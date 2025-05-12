import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import {
  Play,
  Pause,
  Camera,
  Video,
  Sliders,
  Download,
  Share2,
  Maximize2,
  Minimize2,
  RotateCcw,
  Settings,
  AlertCircle
} from 'lucide-react';
import { StartPoseDetectionButton, AnalyzePoseButton } from "@/components/ui/action-buttons";
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import {
  initializeTensorFlow,
  createDetector,
  detectPoses,
  drawSkeleton,
  drawKeypoints,
  calculateJointAngles,
  drawAngle,
  isCameraAvailable,
  startCamera,
  stopCamera,
  generatePoseFeedback,
  calculatePoseScore
} from '@/lib/pose-detection';

interface DetectionPanelProps {
  videoUrl?: string;
  onPoseDetected?: (poseData: any) => void;
}

const DetectionPanel: React.FC<DetectionPanelProps> = ({
  videoUrl,
  onPoseDetected
}) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeSource, setActiveSource] = useState<'camera' | 'video'>('video');
  const [cameraActive, setCameraActive] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showKeypoints, setShowKeypoints] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(50);
  const [detectionFPS, setDetectionFPS] = useState(15);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // State for detector
  const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(null);
  const [tfInitialized, setTfInitialized] = useState(false);
  const [cameraAvailable, setCameraAvailable] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize TensorFlow.js and pose detector
  useEffect(() => {
    const init = async () => {
      try {
        // Initialize TensorFlow.js
        const initialized = await initializeTensorFlow();
        setTfInitialized(initialized);

        if (initialized) {
          // Create detector
          const modelType = 'movenet'; // Default model
          const newDetector = await createDetector(modelType);

          if (newDetector) {
            setDetector(newDetector);
            console.log('Pose detector initialized successfully');
          } else {
            setError('Failed to initialize pose detector');
            console.error('Failed to initialize pose detector');
          }
        } else {
          setError('Failed to initialize TensorFlow.js');
          console.error('Failed to initialize TensorFlow.js');
        }

        // Check if camera is available
        const hasCamera = await isCameraAvailable();
        setCameraAvailable(hasCamera);
        if (!hasCamera) {
          console.warn('No camera detected on this device');
        }
      } catch (err) {
        console.error('Error during initialization:', err);
        setError('Error initializing pose detection system');
      }
    };

    init();

    // Cleanup function
    return () => {
      // Clean up resources when component unmounts
      if (cameraActive) {
        stopCameraStream();
      }

      // Dispose of detector if needed
      if (detector) {
        // Some detectors need explicit disposal
        try {
          // @ts-ignore - Not all detector types have dispose method
          if (detector.dispose && typeof detector.dispose === 'function') {
            detector.dispose();
          }
        } catch (err) {
          console.error('Error disposing detector:', err);
        }
      }
    };
  }, []);

  // Start camera
  const startCameraStream = async () => {
    try {
      if (!videoRef.current) return;

      if (!cameraAvailable) {
        toast.error('No camera detected on this device');
        return;
      }

      const success = await startCamera(videoRef.current);

      if (success) {
        setCameraActive(true);
        setActiveSource('camera');
        toast.success('Camera started successfully');
      } else {
        toast.error('Failed to start camera');
      }
    } catch (error) {
      console.error('Error starting camera:', error);
      toast.error('Error accessing camera. Please check permissions.');
    }
  };

  // Stop camera
  const stopCameraStream = () => {
    if (!videoRef.current) return;

    stopCamera(videoRef.current);
    setCameraActive(false);
  };

  // Start pose detection
  const startPoseDetection = () => {
    if (!detector) {
      toast.error('Pose detector not initialized. Please try again.');
      return;
    }

    if (!videoRef.current || !canvasRef.current) {
      toast.error('Video or canvas element not found.');
      return;
    }

    if (activeSource === 'camera' && !cameraActive) {
      startCameraStream().then(() => {
        // Start detection after camera is ready
        setTimeout(() => {
          startDetectionLoop();
        }, 1000);
      });
    } else {
      startDetectionLoop();
    }
  };

  // The actual detection loop
  const startDetectionLoop = () => {
    setIsDetecting(true);

    let lastFrameTime = 0;
    let animationFrameId: number;

    // Calculate frame interval based on FPS setting
    const frameInterval = 1000 / detectionFPS;

    const detectPoseInFrame = async (timestamp: number) => {
      if (!canvasRef.current || !videoRef.current || !detector) {
        stopPoseDetection();
        return;
      }

      // Throttle frame rate based on FPS setting
      if (timestamp - lastFrameTime < frameInterval) {
        animationFrameId = requestAnimationFrame(detectPoseInFrame);
        return;
      }

      lastFrameTime = timestamp;

      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // Draw video frame on canvas
      if (videoRef.current.readyState >= 2) {
        ctx.drawImage(
          videoRef.current,
          0, 0,
          canvasRef.current.width,
          canvasRef.current.height
        );
      }

      try {
        // Detect poses
        const poses = await detectPoses(
          detector,
          videoRef.current,
          true, // flipHorizontal
          1, // maxPoses
          confidenceThreshold / 100 // scoreThreshold
        );

        if (poses && poses.length > 0) {
          const pose = poses[0];

          // Draw skeleton and keypoints
          if (showSkeleton) {
            drawSkeleton(ctx, pose, confidenceThreshold / 100);
          }

          if (showKeypoints) {
            drawKeypoints(ctx, pose, confidenceThreshold / 100);
          }

          // Calculate joint angles
          const angles = calculateJointAngles(pose);

          // Draw angles for key joints
          if (angles && showSkeleton) {
            // Find keypoints
            const findKeypoint = (name: string) => pose.keypoints.find(kp => kp.name === name);

            const leftShoulder = findKeypoint('left_shoulder');
            const leftElbow = findKeypoint('left_elbow');
            const leftWrist = findKeypoint('left_wrist');
            const leftHip = findKeypoint('left_hip');
            const leftKnee = findKeypoint('left_knee');
            const leftAnkle = findKeypoint('left_ankle');

            // Draw left elbow angle
            if (leftShoulder && leftElbow && leftWrist &&
                leftShoulder.score > confidenceThreshold/100 &&
                leftElbow.score > confidenceThreshold/100 &&
                leftWrist.score > confidenceThreshold/100) {
              drawAngle(
                ctx,
                { x: leftShoulder.x, y: leftShoulder.y },
                { x: leftElbow.x, y: leftElbow.y },
                { x: leftWrist.x, y: leftWrist.y }
              );
            }

            // Draw left knee angle
            if (leftHip && leftKnee && leftAnkle &&
                leftHip.score > confidenceThreshold/100 &&
                leftKnee.score > confidenceThreshold/100 &&
                leftAnkle.score > confidenceThreshold/100) {
              drawAngle(
                ctx,
                { x: leftHip.x, y: leftHip.y },
                { x: leftKnee.x, y: leftKnee.y },
                { x: leftAnkle.x, y: leftAnkle.y }
              );
            }
          }

          // Call the callback with the pose data
          if (onPoseDetected) {
            onPoseDetected({
              ...pose,
              angles,
              scores: calculatePoseScore(pose, angles || {})
            });
          }
        }
      } catch (error) {
        console.error('Error during pose detection:', error);
      }

      // Continue the detection loop
      if (isDetecting) {
        animationFrameId = requestAnimationFrame(detectPoseInFrame);
      }
    };

    // Start the detection loop
    animationFrameId = requestAnimationFrame(detectPoseInFrame);

    // Return cleanup function
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  };

  // Stop pose detection
  const stopPoseDetection = () => {
    setIsDetecting(false);

    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  // Start pose analysis
  const startPoseAnalysis = () => {
    setIsAnalyzing(true);

    // In a real implementation, we would analyze the detected pose here
    // We'll simulate a more comprehensive analysis

    // First, make sure we have a canvas to work with
    if (!canvasRef.current) {
      setIsAnalyzing(false);
      return;
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) {
      setIsAnalyzing(false);
      return;
    }

    // Simulate analysis process with visual feedback
    let progress = 0;
    const analysisInterval = setInterval(() => {
      progress += 10;

      if (progress >= 100) {
        clearInterval(analysisInterval);

        // Draw analysis results on canvas
        drawAnalysisResults(ctx);

        setIsAnalyzing(false);
        return;
      }

      // Show analysis progress
      const width = canvasRef.current!.width;
      const height = canvasRef.current!.height;

      // Draw progress indicator
      ctx.fillStyle = 'rgba(79, 70, 229, 0.2)';
      ctx.fillRect(0, height - 10, width * (progress / 100), 10);

      // Draw progress text
      ctx.fillStyle = '#4f46e5';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Analyzing: ${progress}%`, width / 2, height / 2);

    }, 300);
  };

  // Draw analysis results on canvas
  const drawAnalysisResults = (ctx: CanvasRenderingContext2D) => {
    if (!canvasRef.current) return;

    const width = canvasRef.current.width;
    const height = canvasRef.current.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw video frame if available
    if (videoRef.current && videoRef.current.readyState >= 2) {
      ctx.drawImage(videoRef.current, 0, 0, width, height);
    }

    // Draw analysis annotations

    // 1. Draw joint angles
    const centerX = width / 2;
    const centerY = height / 2;

    // Shoulder angle
    drawAngle(ctx,
      { x: centerX - 100, y: centerY }, // elbow
      { x: centerX - 70, y: centerY - 50 }, // shoulder
      { x: centerX - 50, y: centerY + 50 }, // hip
      '105°'
    );

    // Elbow angle
    drawAngle(ctx,
      { x: centerX - 130, y: centerY + 50 }, // wrist
      { x: centerX - 100, y: centerY }, // elbow
      { x: centerX - 70, y: centerY - 50 }, // shoulder
      '142°'
    );

    // Knee angle
    drawAngle(ctx,
      { x: centerX - 50, y: centerY + 50 }, // hip
      { x: centerX - 60, y: centerY + 150 }, // knee
      { x: centerX - 70, y: centerY + 250 }, // ankle
      '168°'
    );

    // 2. Draw posture alignment line
    ctx.strokeStyle = 'rgba(79, 70, 229, 0.7)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 3]);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 100); // head
    ctx.lineTo(centerX, centerY + 250); // feet
    ctx.stroke();
    ctx.setLineDash([]);

    // 3. Draw balance indicator
    const balanceX = centerX + 10; // slightly off-center
    const balanceY = centerY + 300;

    ctx.fillStyle = 'rgba(79, 70, 229, 0.2)';
    ctx.beginPath();
    ctx.ellipse(centerX, balanceY, 80, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#4f46e5';
    ctx.beginPath();
    ctx.arc(balanceX, balanceY, 10, 0, Math.PI * 2);
    ctx.fill();

    // 4. Add analysis labels
    ctx.font = '14px Arial';
    ctx.fillStyle = '#4f46e5';
    ctx.textAlign = 'left';

    // Posture label
    ctx.fillText('Posture: Good', 20, 30);

    // Balance label
    ctx.fillText('Balance: Slightly Right', 20, 60);

    // Form score
    ctx.textAlign = 'right';
    ctx.fillText('Form Score: 85%', width - 20, 30);
  };

  // Helper function to draw angle between three points
  const drawAngle = (
    ctx: CanvasRenderingContext2D,
    p1: {x: number, y: number},
    p2: {x: number, y: number},
    p3: {x: number, y: number},
    angleText: string
  ) => {
    // Draw angle arc
    ctx.strokeStyle = 'rgba(79, 70, 229, 0.7)';
    ctx.lineWidth = 2;

    // Calculate angle
    const angle1 = Math.atan2(p1.y - p2.y, p1.x - p2.x);
    const angle2 = Math.atan2(p3.y - p2.y, p3.x - p2.x);

    // Draw arc
    const radius = 20;
    ctx.beginPath();
    ctx.arc(p2.x, p2.y, radius, angle1, angle2, false);
    ctx.stroke();

    // Draw angle text
    ctx.fillStyle = '#4f46e5';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';

    // Position text at midpoint of arc
    const midAngle = (angle1 + angle2) / 2;
    const textX = p2.x + (radius + 10) * Math.cos(midAngle);
    const textY = p2.y + (radius + 10) * Math.sin(midAngle);

    ctx.fillText(angleText, textX, textY);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
          .then(() => {
            setIsFullscreen(true);
          })
          .catch(err => {
            console.error('Error attempting to enable fullscreen:', err);
            toast.error('Could not enter fullscreen mode');
          });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
          .then(() => {
            setIsFullscreen(false);
          })
          .catch(err => {
            console.error('Error attempting to exit fullscreen:', err);
          });
      }
    }
  };

  // Handle video upload
  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is a video
    if (!file.type.startsWith('video/')) {
      toast.error('Please upload a video file');
      return;
    }

    // Check file size (limit to 100MB)
    if (file.size > 100 * 1024 * 1024) {
      toast.error('File size exceeds 100MB limit');
      return;
    }

    // Create object URL for the video
    const videoUrl = URL.createObjectURL(file);
    setUploadedVideoUrl(videoUrl);
    setActiveSource('upload');

    // Reset video element
    if (videoRef.current) {
      videoRef.current.src = videoUrl;
      videoRef.current.load();

      // Add event listener for when video is loaded
      videoRef.current.onloadedmetadata = () => {
        toast.success(`Video loaded: ${file.name}`);

        // Set canvas dimensions to match video
        if (canvasRef.current && videoRef.current) {
          canvasRef.current.width = videoRef.current.videoWidth;
          canvasRef.current.height = videoRef.current.videoHeight;
        }
      };
    }

    // Stop camera if it's active
    if (cameraActive) {
      stopCameraStream();
    }
  };

  // Download current frame with pose overlay
  const downloadFrame = () => {
    if (!canvasRef.current) return;

    try {
      // Create a temporary link element
      const link = document.createElement('a');
      link.download = `pose-detection-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;

      // Convert canvas to data URL
      link.href = canvasRef.current.toDataURL('image/png');

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Frame downloaded successfully');
    } catch (error) {
      console.error('Error downloading frame:', error);
      toast.error('Failed to download frame');
    }
  };

  // Share current frame
  const shareFrame = async () => {
    if (!canvasRef.current) return;

    try {
      // Check if Web Share API is available
      if (navigator.share) {
        // Convert canvas to blob
        const blob = await new Promise<Blob>((resolve) => {
          canvasRef.current!.toBlob((blob) => {
            resolve(blob!);
          }, 'image/png');
        });

        // Create file from blob
        const file = new File([blob], 'pose-detection.png', { type: 'image/png' });

        // Share file
        await navigator.share({
          title: 'Pose Detection Result',
          text: 'Check out my pose analysis!',
          files: [file]
        });

        toast.success('Frame shared successfully');
      } else {
        // Fallback if Web Share API is not available
        downloadFrame();
        toast.info('Sharing not supported on this browser. Frame downloaded instead.');
      }
    } catch (error) {
      console.error('Error sharing frame:', error);
      toast.error('Failed to share frame');
    }
  };

  // Initialize canvas dimensions when component mounts
  useEffect(() => {
    if (!canvasRef.current) return;

    // Set canvas dimensions to match container
    const resizeCanvas = () => {
      if (canvasRef.current && containerRef.current) {
        canvasRef.current.width = containerRef.current.offsetWidth;
        canvasRef.current.height = containerRef.current.offsetHeight;
      }
    };

    // Initial resize
    resizeCanvas();

    // Add resize listener
    window.addEventListener('resize', resizeCanvas);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <Card className="detection-panel">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <Camera className="h-5 w-5 mr-2 text-primary" />
          Pose Detection
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="video" onValueChange={(value) => setActiveSource(value as 'camera' | 'video')}>
          <TabsList className="mb-4">
            <TabsTrigger value="video">
              <Video className="h-4 w-4 mr-2" />
              Video
            </TabsTrigger>
            <TabsTrigger value="camera">
              <Camera className="h-4 w-4 mr-2" />
              Camera
            </TabsTrigger>
          </TabsList>

          {activeSource === 'video' && (
            <div className="mb-4">
              <label
                htmlFor="video-upload"
                className="flex items-center justify-center w-full p-2 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-primary transition-colors"
              >
                <div className="flex flex-col items-center space-y-2 text-center">
                  <Upload className="h-6 w-6 text-gray-500" />
                  <div className="text-sm text-gray-500">
                    <span className="font-medium text-primary">Click to upload</span> or drag and drop
                  </div>
                  <p className="text-xs text-gray-500">
                    MP4, WebM or MOV (max. 100MB)
                  </p>
                </div>
                <input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleVideoUpload}
                />
              </label>
            </div>
          )}

          <div
            ref={containerRef}
            className={`detection-container relative bg-black rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : 'aspect-video'}`}
          >
            <video
              ref={videoRef}
              src={activeSource === 'video' ? videoUrl : undefined}
              className="absolute inset-0 w-full h-full object-contain"
              playsInline
              muted
              loop
            />

            <canvas
              ref={canvasRef}
              width={640}
              height={480}
              className="absolute inset-0 w-full h-full object-contain"
            />

            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                <div className="bg-white p-4 rounded-lg max-w-md text-center">
                  <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold mb-2">Error</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Reload Page
                  </Button>
                </div>
              </div>
            )}

            {!isDetecting && !error && (
              <div className="absolute inset-0 flex items-center justify-center">
                {activeSource === 'camera' && !cameraActive ? (
                  <>
                    {!cameraAvailable ? (
                      <div className="bg-white p-4 rounded-lg max-w-md text-center">
                        <AlertCircle className="h-10 w-10 text-amber-500 mx-auto mb-2" />
                        <h3 className="text-lg font-semibold mb-2">No Camera Detected</h3>
                        <p className="text-gray-600 mb-4">
                          We couldn't find a camera on your device. Please connect a camera or switch to video upload mode.
                        </p>
                        <Button
                          onClick={() => setActiveSource('video')}
                          className="bg-primary hover:bg-primary/90"
                        >
                          Switch to Video Upload
                        </Button>
                      </div>
                    ) : (
                      <Button onClick={startCameraStream} className="bg-primary hover:bg-primary/90">
                        <Camera className="h-4 w-4 mr-2" />
                        Start Camera
                      </Button>
                    )}
                  </>
                ) : (
                  <StartPoseDetectionButton
                    onClick={startPoseDetection}
                    isProcessing={false}
                  />
                )}
              </div>
            )}

            <div className="absolute top-2 right-2 flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                className="h-8 w-8 p-0 rounded-full bg-white/80 hover:bg-white/90"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>

              <Button
                variant="secondary"
                size="sm"
                className="h-8 w-8 p-0 rounded-full bg-white/80 hover:bg-white/90"
                onClick={() => {
                  if (isDetecting) {
                    stopPoseDetection();
                  } else if (activeSource === 'camera' && !cameraActive) {
                    startCameraStream();
                  } else {
                    startPoseDetection();
                  }
                }}
              >
                {isDetecting ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {isDetecting ? (
              <Button
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
                onClick={stopPoseDetection}
              >
                <Pause className="h-4 w-4 mr-2" />
                Stop Detection
              </Button>
            ) : (
              <StartPoseDetectionButton
                onClick={startPoseDetection}
                isProcessing={false}
              />
            )}

            <AnalyzePoseButton
              onClick={startPoseAnalysis}
              isAnalyzing={isAnalyzing}
            />

            <Button
              variant="outline"
              onClick={downloadFrame}
            >
              <Download className="h-4 w-4 mr-2" />
              Save Results
            </Button>

            <Button
              variant="outline"
              onClick={shareFrame}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          <div className="mt-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center text-sm font-normal justify-start w-full mb-2"
              onClick={() => document.getElementById('detection-settings')?.classList.toggle('hidden')}
            >
              <Settings className="h-4 w-4 mr-2" />
              Detection Settings
            </Button>

            <div id="detection-settings" className="hidden p-3 bg-muted/30 rounded-md space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-skeleton" className="text-sm">Show Skeleton</Label>
                <Switch
                  id="show-skeleton"
                  checked={showSkeleton}
                  onCheckedChange={setShowSkeleton}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-keypoints" className="text-sm">Show Keypoints</Label>
                <Switch
                  id="show-keypoints"
                  checked={showKeypoints}
                  onCheckedChange={setShowKeypoints}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="confidence-threshold" className="text-sm">Confidence Threshold</Label>
                  <span className="text-sm">{confidenceThreshold}%</span>
                </div>
                <Slider
                  id="confidence-threshold"
                  min={0}
                  max={100}
                  step={1}
                  value={[confidenceThreshold]}
                  onValueChange={(value) => setConfidenceThreshold(value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="detection-fps" className="text-sm">Detection FPS</Label>
                  <span className="text-sm">{detectionFPS}</span>
                </div>
                <Slider
                  id="detection-fps"
                  min={1}
                  max={30}
                  step={1}
                  value={[detectionFPS]}
                  onValueChange={(value) => setDetectionFPS(value[0])}
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  setShowSkeleton(true);
                  setShowKeypoints(true);
                  setConfidenceThreshold(50);
                  setDetectionFPS(15);
                }}
              >
                <RotateCcw className="h-3 w-3 mr-2" />
                Reset to Defaults
              </Button>
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DetectionPanel;
