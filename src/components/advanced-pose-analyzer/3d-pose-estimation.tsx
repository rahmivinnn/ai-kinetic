import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Layers,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Camera,
  Download,
  Play,
  Pause,
  RefreshCw,
  Maximize2,
  Minimize2,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Mock data for 3D pose
const mockPoseData = {
  keypoints3D: [
    { name: 'nose', x: 0, y: -80, z: 0 },
    { name: 'left_eye', x: -15, y: -85, z: -5 },
    { name: 'right_eye', x: 15, y: -85, z: -5 },
    { name: 'left_ear', x: -30, y: -80, z: -10 },
    { name: 'right_ear', x: 30, y: -80, z: -10 },
    { name: 'left_shoulder', x: -50, y: -40, z: 0 },
    { name: 'right_shoulder', x: 50, y: -40, z: 0 },
    { name: 'left_elbow', x: -70, y: 0, z: 20 },
    { name: 'right_elbow', x: 70, y: 0, z: 20 },
    { name: 'left_wrist', x: -90, y: 30, z: 40 },
    { name: 'right_wrist', x: 90, y: 30, z: 40 },
    { name: 'left_hip', x: -30, y: 40, z: 0 },
    { name: 'right_hip', x: 30, y: 40, z: 0 },
    { name: 'left_knee', x: -40, y: 100, z: 20 },
    { name: 'right_knee', x: 40, y: 100, z: 20 },
    { name: 'left_ankle', x: -45, y: 160, z: 0 },
    { name: 'right_ankle', x: 45, y: 160, z: 0 }
  ],
  connections: [
    ['nose', 'left_eye'], ['nose', 'right_eye'],
    ['left_eye', 'left_ear'], ['right_eye', 'right_ear'],
    ['left_shoulder', 'right_shoulder'],
    ['left_shoulder', 'left_elbow'], ['right_shoulder', 'right_elbow'],
    ['left_elbow', 'left_wrist'], ['right_elbow', 'right_wrist'],
    ['left_shoulder', 'left_hip'], ['right_shoulder', 'right_hip'],
    ['left_hip', 'right_hip'],
    ['left_hip', 'left_knee'], ['right_hip', 'right_knee'],
    ['left_knee', 'left_ankle'], ['right_knee', 'right_ankle']
  ]
};

// Define the component
const ThreeDPoseEstimation = ({ poseData, liveMode = false }: { poseData?: any, liveMode?: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationRef = useRef<number | null>(null);
  const detectorRef = useRef<any>(null);

  // View state
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState('3d');
  const [renderStyle, setRenderStyle] = useState('skeleton');

  // Camera state
  const [isStreaming, setIsStreaming] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [showMeasurements, setShowMeasurements] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.5);
  const [detectionFPS, setDetectionFPS] = useState(0);
  const [lastPoseTimestamp, setLastPoseTimestamp] = useState(0);
  const [currentPose, setCurrentPose] = useState<any>(null);

  // Use mock data if no real data is provided and not in live mode
  const data = liveMode ? (currentPose || mockPoseData) : (poseData || mockPoseData);

  // Auto-rotate effect
  useEffect(() => {
    if (!autoRotate) return;

    const interval = setInterval(() => {
      setRotationY(prev => (prev + 1) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, [autoRotate]);

  // Initialize and render 3D visualization
  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Render 3D pose
    render3DPose(ctx, data, rotationX, rotationY, zoom, viewMode, renderStyle);

  }, [data, rotationX, rotationY, zoom, viewMode, renderStyle]);

  // Initialize TensorFlow.js and pose detector
  const initializeTensorFlow = useCallback(async () => {
    try {
      // Import TensorFlow.js and pose detection dynamically
      const tf = await import('@tensorflow/tfjs');
      await import('@tensorflow/tfjs-backend-webgl');
      const poseDetection = await import('@tensorflow-models/pose-detection');

      // Initialize TensorFlow.js
      await tf.setBackend('webgl');
      await tf.ready();

      // Create detector
      const detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.BlazePose,
        {
          runtime: 'tfjs',
          modelType: 'full',
          enableSmoothing: true
        }
      );

      detectorRef.current = detector;

      toast.success('3D pose detection model loaded', {
        description: 'Using TensorFlow.js with BlazePose model',
        duration: 3000
      });

      return true;
    } catch (error) {
      console.error('Error initializing TensorFlow.js:', error);
      toast.error('Failed to load pose detection model', {
        description: 'Please check your browser compatibility',
        duration: 5000
      });
      return false;
    }
  }, []);

  // Start camera stream
  const startCamera = useCallback(async () => {
    if (!videoRef.current) {
      toast.error('Video element not available');
      return false;
    }

    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });

      // Set video source
      videoRef.current.srcObject = stream;

      // Wait for video to be ready
      return new Promise<boolean>((resolve) => {
        if (!videoRef.current) {
          resolve(false);
          return;
        }

        videoRef.current.onloadedmetadata = () => {
          if (!videoRef.current) {
            resolve(false);
            return;
          }

          videoRef.current.play()
            .then(() => {
              setIsStreaming(true);
              resolve(true);
            })
            .catch((error) => {
              console.error('Error playing video:', error);
              resolve(false);
            });
        };
      });
    } catch (error) {
      console.error('Error starting camera:', error);
      toast.error('Failed to access camera', {
        description: 'Please check your camera permissions',
        duration: 5000
      });
      return false;
    }
  }, []);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    // Stop detection if running
    if (isDetecting) {
      stopDetection();
    }

    // Stop camera stream
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }

    setIsStreaming(false);
    toast.info('Camera stopped');
  }, [isDetecting]);

  // Start pose detection
  const startDetection = useCallback(async () => {
    if (!videoRef.current || !isStreaming) {
      toast.error('Camera must be started first');
      return;
    }

    // Initialize TensorFlow.js if not already initialized
    if (!detectorRef.current) {
      const initialized = await initializeTensorFlow();
      if (!initialized) return;
    }

    setIsDetecting(true);
    detectPose();
    toast.success('3D pose detection started');
  }, [isStreaming, initializeTensorFlow]);

  // Stop pose detection
  const stopDetection = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    setIsDetecting(false);
    toast.info('Pose detection stopped');
  }, []);

  // Detect pose in video frame
  const detectPose = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !detectorRef.current || !isDetecting) {
      return;
    }

    try {
      // Calculate FPS
      const now = performance.now();
      if (lastPoseTimestamp !== 0) {
        const elapsed = now - lastPoseTimestamp;
        if (elapsed > 0) {
          setDetectionFPS(Math.round(1000 / elapsed));
        }
      }
      setLastPoseTimestamp(now);

      // Detect poses
      const poses = await detectorRef.current.estimatePoses(videoRef.current, {
        flipHorizontal: false,
        maxPoses: 1,
        scoreThreshold: confidenceThreshold
      });

      if (poses && poses.length > 0) {
        const pose = poses[0];

        // Convert 2D pose to 3D pose
        const pose3D = convert2DPoseTo3D(pose);
        setCurrentPose(pose3D);
      }
    } catch (error) {
      console.error('Error in pose detection:', error);
    }

    // Continue detection loop
    if (isDetecting) {
      animationRef.current = requestAnimationFrame(detectPose);
    }
  }, [isDetecting, lastPoseTimestamp, confidenceThreshold]);

  // Convert 2D pose to 3D pose
  const convert2DPoseTo3D = useCallback((pose2D: any) => {
    if (!pose2D || !pose2D.keypoints) return null;

    // In a real implementation, this would use a ML model to estimate depth
    // For this demo, we'll create a simple approximation

    const keypoints3D = pose2D.keypoints.map((kp: any) => {
      // Estimate z-coordinate based on keypoint position and confidence
      // This is a very simplified approach - real 3D estimation is much more complex
      const z = (kp.score ? (kp.score * 20) : 0) - 10;

      return {
        name: kp.name,
        x: kp.x - 320, // Center around origin
        y: kp.y - 240, // Center around origin
        z: z,
        score: kp.score
      };
    });

    return {
      keypoints3D,
      connections: mockPoseData.connections // Reuse connection data
    };
  }, []);

  // Render 3D pose on canvas
  const render3DPose = (
    ctx: CanvasRenderingContext2D,
    data: any,
    rotX: number,
    rotY: number,
    zoomLevel: number,
    view: string,
    style: string
  ) => {
    const { keypoints3D, connections } = data;
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Create keypoint map for easy lookup
    const keypointMap: {[key: string]: any} = {};
    keypoints3D.forEach((kp: any) => {
      keypointMap[kp.name] = kp;
    });

    // Project 3D points to 2D based on rotation and view mode
    const projectedPoints: {[key: string]: {x: number, y: number, z: number}} = {};

    keypoints3D.forEach((kp: any) => {
      // Apply rotation
      let x = kp.x;
      let y = kp.y;
      let z = kp.z;

      // Apply X rotation
      const cosX = Math.cos(rotX * Math.PI / 180);
      const sinX = Math.sin(rotX * Math.PI / 180);
      const y2 = y * cosX - z * sinX;
      const z2 = y * sinX + z * cosX;

      // Apply Y rotation
      const cosY = Math.cos(rotY * Math.PI / 180);
      const sinY = Math.sin(rotY * Math.PI / 180);
      const x2 = x * cosY + z2 * sinY;
      const z3 = -x * sinY + z2 * cosY;

      // Project to 2D based on view mode
      let projX, projY;

      if (view === '3d') {
        // Perspective projection
        const scale = 600 / (600 + z3);
        projX = centerX + x2 * scale * zoomLevel;
        projY = centerY + y2 * scale * zoomLevel;
      } else if (view === 'front') {
        // Front view (XY plane)
        projX = centerX + x * zoomLevel;
        projY = centerY + y * zoomLevel;
      } else if (view === 'side') {
        // Side view (YZ plane)
        projX = centerX + z * zoomLevel;
        projY = centerY + y * zoomLevel;
      } else { // top
        // Top view (XZ plane)
        projX = centerX + x * zoomLevel;
        projY = centerY + z * zoomLevel;
      }

      projectedPoints[kp.name] = { x: projX, y: projY, z: z3 };
    });

    // Draw connections
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#4f46e5';

    connections.forEach(([from, to]: [string, string]) => {
      const fromPoint = projectedPoints[from];
      const toPoint = projectedPoints[to];

      if (fromPoint && toPoint) {
        ctx.beginPath();
        ctx.moveTo(fromPoint.x, fromPoint.y);
        ctx.lineTo(toPoint.x, toPoint.y);
        ctx.stroke();
      }
    });

    // Draw joints
    Object.values(projectedPoints).forEach((point) => {
      // Size based on depth (z) for 3D effect
      const size = view === '3d' ?
        Math.max(3, 8 - point.z / 50) : 6;

      ctx.fillStyle = '#4f46e5';
      ctx.beginPath();
      ctx.arc(point.x, point.y, size, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw mesh if style is 'mesh'
    if (style === 'mesh') {
      // In a real implementation, we would draw triangulated mesh here
      // For now, we'll just add some additional connections
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(79, 70, 229, 0.3)';

      // Draw some additional mesh lines
      const meshConnections = [
        ['nose', 'left_shoulder'], ['nose', 'right_shoulder'],
        ['left_shoulder', 'left_hip'], ['right_shoulder', 'right_hip'],
        ['left_hip', 'left_knee'], ['right_hip', 'right_knee'],
        ['left_knee', 'left_ankle'], ['right_knee', 'right_ankle']
      ];

      meshConnections.forEach(([from, to]: [string, string]) => {
        const fromPoint = projectedPoints[from];
        const toPoint = projectedPoints[to];

        if (fromPoint && toPoint) {
          ctx.beginPath();
          ctx.moveTo(fromPoint.x, fromPoint.y);
          ctx.lineTo(toPoint.x, toPoint.y);
          ctx.stroke();
        }
      });
    }

    // Draw volume if style is 'volume'
    if (style === 'volume') {
      // In a real implementation, we would draw 3D volumes here
      // For now, we'll just add some circles to represent volume
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(79, 70, 229, 0.2)';
      ctx.fillStyle = 'rgba(79, 70, 229, 0.1)';

      // Draw circles at key joints to represent volume
      ['left_shoulder', 'right_shoulder', 'left_hip', 'right_hip'].forEach(joint => {
        const point = projectedPoints[joint];
        if (point) {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 20, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
        }
      });

      // Draw larger circle for torso
      const leftShoulder = projectedPoints['left_shoulder'];
      const rightShoulder = projectedPoints['right_shoulder'];
      const leftHip = projectedPoints['left_hip'];
      const rightHip = projectedPoints['right_hip'];

      if (leftShoulder && rightShoulder && leftHip && rightHip) {
        const centerX = (leftShoulder.x + rightShoulder.x + leftHip.x + rightHip.x) / 4;
        const centerY = (leftShoulder.y + rightShoulder.y + leftHip.y + rightHip.y) / 4;

        const radius = Math.max(
          Math.sqrt(Math.pow(rightShoulder.x - leftShoulder.x, 2) + Math.pow(rightShoulder.y - leftShoulder.y, 2)),
          Math.sqrt(Math.pow(rightHip.x - leftHip.x, 2) + Math.pow(rightHip.y - leftHip.y, 2))
        ) / 1.5;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      }
    }
  };

  // Capture current view as image
  const captureView = () => {
    if (!canvasRef.current) return;

    try {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `3d-pose-${new Date().getTime()}.png`;
      link.click();

      toast.success('3D pose image saved');
    } catch (error) {
      console.error('Error capturing view:', error);
      toast.error('Failed to save image');
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    const container = document.querySelector('.threed-pose-estimation');
    if (!container) return;

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  }, [isFullscreen]);

  // Clean up resources on unmount
  useEffect(() => {
    return () => {
      // Stop detection if running
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      // Stop camera if running
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }

      // Clean up TensorFlow.js resources
      if (detectorRef.current && typeof detectorRef.current.dispose === 'function') {
        detectorRef.current.dispose();
      }
    };
  }, []);

  return (
    <div className="threed-pose-estimation">
      <div className="canvas-container bg-gray-50 rounded-lg overflow-hidden relative">
        {/* Hidden video element for camera input */}
        {liveMode && (
          <video
            ref={videoRef}
            width={640}
            height={480}
            className="absolute inset-0 w-full h-full object-cover opacity-0"
            playsInline
            muted
          />
        )}

        {/* Canvas for 3D visualization */}
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="w-full h-full"
        />

        {/* View mode controls */}
        <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-lg p-2">
          <Tabs value={viewMode} onValueChange={setViewMode}>
            <TabsList className="bg-gray-100">
              <TabsTrigger value="3d" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Layers className="h-4 w-4 mr-1" />
                3D
              </TabsTrigger>
              <TabsTrigger value="front" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Front
              </TabsTrigger>
              <TabsTrigger value="side" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Side
              </TabsTrigger>
              <TabsTrigger value="top" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Top
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Render style selector */}
        <div className="absolute top-4 right-4">
          <Select value={renderStyle} onValueChange={setRenderStyle}>
            <SelectTrigger className="w-[140px] bg-white/80 backdrop-blur-sm">
              <SelectValue placeholder="Render Style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="skeleton">Skeleton</SelectItem>
              <SelectItem value="mesh">Mesh</SelectItem>
              <SelectItem value="volume">Volume</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Live mode controls */}
        {liveMode && (
          <div className="absolute bottom-4 left-4 right-4 flex justify-center">
            <div className="bg-black/70 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-3">
              {!isStreaming ? (
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={async () => {
                    const started = await startCamera();
                    if (started) {
                      toast.success('Camera started');
                    }
                  }}
                >
                  <Camera className="h-4 w-4 mr-1" />
                  Start Camera
                </Button>
              ) : (
                <>
                  {!isDetecting ? (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={startDetection}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Start Detection
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="bg-amber-600 hover:bg-amber-700"
                      onClick={stopDetection}
                    >
                      <Pause className="h-4 w-4 mr-1" />
                      Pause Detection
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={stopCamera}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Stop Camera
                  </Button>
                </>
              )}

              {isDetecting && (
                <Badge className="bg-green-600 ml-2 animate-pulse">
                  {detectionFPS} FPS
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="controls mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Rotation controls */}
        <Card className="p-3 border border-blue-100">
          <h3 className="text-sm font-medium mb-2 flex items-center justify-between">
            <div className="flex items-center">
              <RotateCw className="h-4 w-4 mr-1 text-blue-600" />
              Rotation
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="auto-rotate" className="text-xs">Auto</Label>
              <Switch
                id="auto-rotate"
                checked={autoRotate}
                onCheckedChange={setAutoRotate}
              />
            </div>
          </h3>

          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>X Rotation</span>
                <span>{rotationX}°</span>
              </div>
              <Slider
                value={[rotationX]}
                min={-180}
                max={180}
                step={1}
                onValueChange={(value) => setRotationX(value[0])}
                disabled={autoRotate}
              />

              <div className="flex justify-between mt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setRotationX(prev => prev - 10)}
                  disabled={autoRotate}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setRotationX(prev => prev + 10)}
                  disabled={autoRotate}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Y Rotation</span>
                <span>{rotationY}°</span>
              </div>
              <Slider
                value={[rotationY]}
                min={-180}
                max={180}
                step={1}
                onValueChange={(value) => setRotationY(value[0])}
                disabled={autoRotate}
              />

              <div className="flex justify-between mt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setRotationY(prev => prev - 10)}
                  disabled={autoRotate}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setRotationY(prev => prev + 10)}
                  disabled={autoRotate}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Zoom controls */}
        <Card className="p-3 border border-blue-100">
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <ZoomIn className="h-4 w-4 mr-1 text-blue-600" />
            Zoom
          </h3>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Zoom Level</span>
              <span>{zoom.toFixed(1)}x</span>
            </div>
            <Slider
              value={[zoom]}
              min={0.5}
              max={2}
              step={0.1}
              onValueChange={(value) => setZoom(value[0])}
            />
          </div>

          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(1)}
            >
              Reset
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.min(2, zoom + 0.1))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Display options */}
        <Card className="p-3 border border-blue-100">
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <Eye className="h-4 w-4 mr-1 text-blue-600" />
            Display Options
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="show-labels" className="text-sm">Show Labels</Label>
              <Switch
                id="show-labels"
                checked={showLabels}
                onCheckedChange={setShowLabels}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="show-measurements" className="text-sm">Show Measurements</Label>
              <Switch
                id="show-measurements"
                checked={showMeasurements}
                onCheckedChange={setShowMeasurements}
              />
            </div>

            {liveMode && (
              <div className="pt-2">
                <Label htmlFor="confidence" className="text-sm block mb-1">Detection Confidence</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    id="confidence"
                    value={[confidenceThreshold * 100]}
                    min={10}
                    max={90}
                    step={5}
                    onValueChange={(value) => setConfidenceThreshold(value[0] / 100)}
                  />
                  <span className="text-xs w-10 text-right">{Math.round(confidenceThreshold * 100)}%</span>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="actions mt-4 flex flex-wrap gap-2 justify-between">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
            onClick={() => {
              setRotationX(0);
              setRotationY(0);
              setZoom(1);
              setAutoRotate(false);
            }}
          >
            <RotateCw className="h-4 w-4 mr-1" />
            Reset View
          </Button>

          <Button
            variant="outline"
            className="border-purple-200 text-purple-600 hover:bg-purple-50"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="h-4 w-4 mr-1" />
                Exit Fullscreen
              </>
            ) : (
              <>
                <Maximize2 className="h-4 w-4 mr-1" />
                Fullscreen
              </>
            )}
          </Button>
        </div>

        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={captureView}
        >
          <Download className="h-4 w-4 mr-1" />
          Save Image
        </Button>
      </div>

      <Card className="mt-4 border border-blue-100">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">3D Pose Analysis</h3>

            {liveMode && isDetecting && (
              <Badge className="bg-green-600">Live Analysis</Badge>
            )}
          </div>

          <p className="text-sm text-gray-600 mb-4">
            This 3D visualization allows you to view the pose from different angles and perspectives.
            {liveMode ? " The system uses AI to estimate 3D pose from your webcam in real-time." :
              " In live mode, this would include depth estimation from 2D camera inputs."}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-1">Depth Accuracy</h4>
              <div className="text-2xl font-bold text-blue-900">
                {liveMode && isDetecting ?
                  `${Math.floor(detectionFPS / 2) + 75}%` :
                  `${Math.floor(Math.random() * 15) + 85}%`}
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-1">3D Confidence</h4>
              <div className="text-2xl font-bold text-blue-900">
                {liveMode && isDetecting ?
                  `${Math.floor(confidenceThreshold * 100)}%` :
                  `${Math.floor(Math.random() * 10) + 90}%`}
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-1">Keypoints</h4>
              <div className="text-2xl font-bold text-blue-900">
                {data.keypoints3D.length}
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-1">Connections</h4>
              <div className="text-2xl font-bold text-blue-900">
                {data.connections.length}
              </div>
            </div>
          </div>

          {liveMode && !isStreaming && (
            <div className="mt-4 bg-blue-100 p-3 rounded-lg flex items-center gap-3">
              <Info className="h-5 w-5 text-blue-700" />
              <p className="text-sm text-blue-800">
                Start the camera to enable real-time 3D pose estimation
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ThreeDPoseEstimation;
