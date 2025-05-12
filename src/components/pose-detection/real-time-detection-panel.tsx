"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import {
  Camera,
  Video,
  Play,
  Pause,
  RefreshCw,
  Download,
  Camera as CameraIcon,
  Sliders,
  Zap,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  RotateCcw,
  Smartphone
} from 'lucide-react';

// Import TensorFlow.js and pose detection
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
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
  calculatePoseScore,
  cleanupTensorFlowResources
} from '@/lib/pose-detection';
import {
  analyzePoseAndGenerateFeedback,
  ExerciseType,
  FeedbackMessage
} from '@/lib/posture-analysis';

interface RealTimeDetectionPanelProps {
  onPoseDetected?: (poseData: any) => void;
  analysisMode?: 'general' | 'exercise' | 'posture';
  selectedBodyPart?: string | null;
}

const RealTimeDetectionPanel: React.FC<RealTimeDetectionPanelProps> = ({
  onPoseDetected,
  analysisMode = 'general',
  selectedBodyPart = null
}) => {
  // Refs for video and canvas elements
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectorRef = useRef<any>(null);
  const animationRef = useRef<number | null>(null);

  // State variables
  const [isInitialized, setIsInitialized] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(50);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showKeypoints, setShowKeypoints] = useState(true);
  const [showAngles, setShowAngles] = useState(true);
  const [modelType, setModelType] = useState<'blazepose' | 'movenet' | 'posenet'>('blazepose');
  const [detectionFPS, setDetectionFPS] = useState(0);
  const [lastPoseTimestamp, setLastPoseTimestamp] = useState(0);
  const [cameraDevices, setCameraDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [isMobile, setIsMobile] = useState(false);

  // Initialize TensorFlow.js and check for camera
  useEffect(() => {
    const init = async () => {
      try {
        // Check if running on mobile
        const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
        setIsMobile(mobile);

        // Initialize TensorFlow.js
        const tfInitialized = await initializeTensorFlow();
        if (!tfInitialized) {
          toast.error('Failed to initialize TensorFlow.js');
          return;
        }

        // Check camera availability
        const cameraAvailable = await isCameraAvailable();
        if (!cameraAvailable) {
          toast.error('No camera detected');
          return;
        }

        // Get available camera devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setCameraDevices(videoDevices);

        if (videoDevices.length > 0) {
          setSelectedCamera(videoDevices[0].deviceId);
        }

        setIsInitialized(true);
        toast.success('System initialized successfully');
      } catch (error) {
        console.error('Initialization error:', error);
        toast.error('Failed to initialize the system');
      }
    };

    init();

    // Cleanup function
    return () => {
      stopDetection();
      if (videoRef.current && videoRef.current.srcObject) {
        stopCamera(videoRef.current);
      }
      cleanupTensorFlowResources();
    };
  }, []);

  // Start camera stream with retry mechanism
  const startStream = async (retryCount = 0) => {
    if (!videoRef.current) {
      toast.error('Video element not available');
      return;
    }

    // Prevent multiple start attempts
    if (isStreaming) {
      return;
    }

    const maxRetries = 3;

    try {
      toast.loading('Starting camera...', { id: 'camera-start' });

      // First check if we have permission to access the camera
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
        if (permissionStatus.state === 'denied') {
          toast.error('Camera access denied. Please allow camera access in your browser settings.', { id: 'camera-start' });
          return;
        }
      } catch (permissionError) {
        // Some browsers don't support the permissions API, so we'll just try to access the camera directly
        console.warn('Could not check camera permissions:', permissionError);
      }

      // Try to start the camera
      const success = await startCamera(videoRef.current, selectedCamera, {
        width: 640,
        height: 480,
        facingMode: 'user'
      });

      if (success) {
        setIsStreaming(true);
        toast.success('Camera started successfully', { id: 'camera-start' });
      } else {
        throw new Error('Failed to start camera');
      }
    } catch (error) {
      console.error('Error starting camera:', error);

      if (retryCount < maxRetries) {
        // Retry with a different approach
        toast.loading(`Retrying camera start (${retryCount + 1}/${maxRetries})...`, { id: 'camera-start' });

        // Wait a moment before retrying
        setTimeout(() => {
          // Try with default camera if a specific one failed
          if (selectedCamera && retryCount === 0) {
            setSelectedCamera('');
            startStream(retryCount + 1);
          } else {
            // Try with lower resolution
            startCamera(videoRef.current, selectedCamera, {
              width: 320,
              height: 240,
              facingMode: 'user'
            }).then(success => {
              if (success) {
                setIsStreaming(true);
                toast.success('Camera started with lower resolution', { id: 'camera-start' });
              } else {
                startStream(retryCount + 1);
              }
            }).catch(() => {
              startStream(retryCount + 1);
            });
          }
        }, 1000);
      } else {
        toast.error('Failed to start camera after multiple attempts. Please check your camera settings.', { id: 'camera-start' });
      }
    }
  };

  // Stop camera stream safely
  const stopStream = () => {
    if (!videoRef.current) return;

    // First stop detection if it's running
    if (isDetecting) {
      stopDetection();
    }

    try {
      stopCamera(videoRef.current);
      setIsStreaming(false);
      toast.info('Camera stopped');
    } catch (error) {
      console.error('Error stopping camera:', error);
      // Force reset the video element
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        setIsStreaming(false);
      }
    }
  };

  // Start pose detection
  const startDetection = async () => {
    if (!videoRef.current || !isStreaming) {
      toast.error('Camera must be started first');
      return;
    }

    try {
      // Disable the button during initialization to prevent multiple clicks
      setIsDetecting(true);

      // Create detector if not already created
      if (!detectorRef.current) {
        toast.loading('Initializing pose detector...', { id: 'detector-init' });

        try {
          detectorRef.current = await createDetector(modelType);

          if (!detectorRef.current) {
            toast.error('Failed to create pose detector', { id: 'detector-init' });
            setIsDetecting(false);
            return;
          }

          toast.success('Pose detector initialized', { id: 'detector-init' });
        } catch (detectorError) {
          console.error('Error creating detector:', detectorError);
          toast.error('Failed to initialize pose detector', { id: 'detector-init' });
          setIsDetecting(false);
          return;
        }
      }

      // Start the detection loop
      detectPose();
      toast.success('Pose detection started');
    } catch (error) {
      console.error('Error starting detection:', error);
      toast.error('Failed to start pose detection');
      setIsDetecting(false);
    }
  };

  // Stop pose detection
  const stopDetection = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (detectorRef.current) {
      if (typeof detectorRef.current.dispose === 'function') {
        detectorRef.current.dispose();
      }
      detectorRef.current = null;
    }

    setIsDetecting(false);
    toast.info('Pose detection stopped');
  };

  // Detect pose in video frame
  const detectPose = async () => {
    // Safety checks to prevent errors
    if (!videoRef.current || !canvasRef.current || !detectorRef.current || !isDetecting) {
      if (isDetecting) {
        // If we're supposed to be detecting but missing required refs, stop detection
        setIsDetecting(false);
      }
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Could not get canvas context');
      stopDetection();
      return;
    }

    // Check if video is ready and playing
    if (video.readyState < 2 || video.paused) {
      // Video not ready yet, try again in the next frame
      animationRef.current = requestAnimationFrame(detectPose);
      return;
    }

    try {
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate FPS
      const now = performance.now();
      const elapsed = now - lastPoseTimestamp;
      if (lastPoseTimestamp !== 0 && elapsed > 0) {
        setDetectionFPS(Math.round(1000 / elapsed));
      }
      setLastPoseTimestamp(now);

      // Detect poses with error handling
      let poses;
      try {
        poses = await detectPoses(
          detectorRef.current,
          video,
          true, // flipHorizontal
          1, // maxPoses
          confidenceThreshold / 100 // scoreThreshold
        );
      } catch (detectionError) {
        console.error('Error in pose detection:', detectionError);

        // Try to continue detection despite error
        animationRef.current = requestAnimationFrame(detectPose);
        return;
      }

      // Process detected poses
      if (poses && poses.length > 0) {
        const pose = poses[0];

        // Calculate joint angles
        const angles = calculateJointAngles(pose);

        // Draw skeleton and keypoints if enabled
        if (showSkeleton && pose.keypoints) {
          drawSkeleton(ctx, pose, { color: 'rgba(0, 119, 255, 0.8)', lineWidth: 4 });
        }

        if (showKeypoints && pose.keypoints) {
          drawKeypoints(ctx, pose, {
            radius: 6,
            color: 'rgba(255, 255, 255, 0.9)',
            fillColor: 'rgba(0, 119, 255, 0.8)',
            showLabels: false
          });
        }

        if (showAngles && angles) {
          // Draw angles for specific body parts or all angles
          const anglesToDraw = selectedBodyPart ?
            filterAnglesByBodyPart(angles, selectedBodyPart) :
            angles;

          Object.entries(anglesToDraw).forEach(([joint, angle]) => {
            try {
              drawAngle(ctx, pose, joint, angle);
            } catch (angleError) {
              console.warn(`Error drawing angle for ${joint}:`, angleError);
              // Continue with other angles
            }
          });
        }

        // Generate feedback based on analysis mode
        let exerciseType: ExerciseType = 'general';
        if (analysisMode === 'exercise') {
          exerciseType = 'squat'; // Default to squat, should be dynamic based on detected exercise
        } else if (analysisMode === 'posture') {
          exerciseType = 'general';
        }

        let feedback;
        try {
          feedback = analyzePoseAndGenerateFeedback(pose, angles, exerciseType);
        } catch (feedbackError) {
          console.warn('Error generating feedback:', feedbackError);
          feedback = []; // Provide empty feedback on error
        }

        // Pass pose data to parent component
        if (onPoseDetected) {
          onPoseDetected({
            ...pose,
            angles,
            feedback,
            timestamp: now
          });
        }
      } else {
        // No poses detected, draw a hint on the canvas
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('No pose detected. Try adjusting your position or lighting.', canvas.width / 2, canvas.height / 2);
      }

      // Continue detection loop only if still detecting
      if (isDetecting) {
        animationRef.current = requestAnimationFrame(detectPose);
      }
    } catch (error) {
      console.error('Error in pose detection loop:', error);

      // Try to recover instead of stopping completely
      if (isDetecting) {
        toast.error('Detection error, attempting to recover...');
        // Continue the loop but with a slight delay to avoid rapid error loops
        setTimeout(() => {
          if (isDetecting) {
            animationRef.current = requestAnimationFrame(detectPose);
          }
        }, 1000);
      }
    }
  };

  // Filter angles based on selected body part
  const filterAnglesByBodyPart = (angles: Record<string, number>, bodyPart: string) => {
    const filteredAngles: Record<string, number> = {};

    switch (bodyPart) {
      case 'upper':
        // Upper body joints
        ['leftShoulder', 'rightShoulder', 'leftElbow', 'rightElbow', 'leftWrist', 'rightWrist', 'neck'].forEach(joint => {
          if (angles[joint] !== undefined) {
            filteredAngles[joint] = angles[joint];
          }
        });
        break;
      case 'lower':
        // Lower body joints
        ['leftHip', 'rightHip', 'leftKnee', 'rightKnee', 'leftAnkle', 'rightAnkle'].forEach(joint => {
          if (angles[joint] !== undefined) {
            filteredAngles[joint] = angles[joint];
          }
        });
        break;
      case 'spine':
        // Spine related joints
        ['spine', 'neck', 'leftHip', 'rightHip'].forEach(joint => {
          if (angles[joint] !== undefined) {
            filteredAngles[joint] = angles[joint];
          }
        });
        break;
      default:
        return angles;
    }

    return filteredAngles;
  };

  // Take a snapshot of the current frame with enhanced error handling
  const takeSnapshot = () => {
    if (!canvasRef.current) {
      toast.error('Canvas not available');
      return;
    }

    if (!isStreaming) {
      toast.error('Camera must be started first');
      return;
    }

    try {
      // Create a temporary canvas to combine video and annotations
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');

      if (!tempCtx) {
        throw new Error('Could not create temporary canvas context');
      }

      // Set dimensions to match the original canvas
      tempCanvas.width = canvasRef.current.width;
      tempCanvas.height = canvasRef.current.height;

      // First draw the video frame
      if (videoRef.current && videoRef.current.readyState >= 2) {
        tempCtx.drawImage(videoRef.current, 0, 0, tempCanvas.width, tempCanvas.height);
      }

      // Then draw the annotations from our canvas
      tempCtx.drawImage(canvasRef.current, 0, 0);

      // Add timestamp and watermark
      tempCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      tempCtx.fillRect(10, tempCanvas.height - 30, 250, 20);
      tempCtx.fillStyle = '#000000';
      tempCtx.font = '12px Arial';
      tempCtx.fillText(`Kinetic AI - ${new Date().toLocaleString()}`, 15, tempCanvas.height - 15);

      // Convert to data URL
      const dataUrl = tempCanvas.toDataURL('image/png');

      // Create download link
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `pose-snapshot-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;

      // Append to document, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Snapshot saved to downloads');
    } catch (error) {
      console.error('Error taking snapshot:', error);
      toast.error('Failed to save snapshot. Please try again.');

      // Fallback method if the first approach fails
      try {
        if (canvasRef.current) {
          const simpleDataUrl = canvasRef.current.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = simpleDataUrl;
          link.download = `pose-snapshot-simple-${new Date().getTime()}.png`;
          link.click();
          toast.success('Snapshot saved using fallback method');
        }
      } catch (fallbackError) {
        console.error('Fallback snapshot method failed:', fallbackError);
        toast.error('All snapshot methods failed. Please check browser permissions.');
      }
    }
  };

  // Change camera device
  const changeCamera = async (deviceId: string) => {
    if (isStreaming) {
      stopStream();
    }

    setSelectedCamera(deviceId);

    // Restart stream with new camera
    if (videoRef.current) {
      try {
        await startCamera(videoRef.current, deviceId);
        setIsStreaming(true);
        toast.success('Camera changed');
      } catch (error) {
        console.error('Error changing camera:', error);
        toast.error('Failed to change camera');
      }
    }
  };

  // Reset detector
  const resetDetector = async () => {
    stopDetection();

    if (detectorRef.current) {
      if (typeof detectorRef.current.dispose === 'function') {
        detectorRef.current.dispose();
      }
      detectorRef.current = null;
    }

    try {
      detectorRef.current = await createDetector(modelType);
      toast.success('Detector reset successfully');

      if (isStreaming) {
        startDetection();
      }
    } catch (error) {
      console.error('Error resetting detector:', error);
      toast.error('Failed to reset detector');
    }
  };

  return (
    <div className="real-time-detection-panel">
      <div className="video-container bg-gray-900 aspect-video rounded-lg overflow-hidden relative mb-4">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-contain"
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-contain"
        />

        {!isStreaming ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <CameraIcon className="h-16 w-16 text-blue-400 mb-4" />
            <Button
              onClick={startStream}
              disabled={!isInitialized}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Start Camera
            </Button>
          </div>
        ) : (
          <div className="absolute top-2 right-2 flex space-x-2">
            <Badge variant="outline" className="bg-black/50 text-white border-none">
              {detectionFPS} FPS
            </Badge>
            {isDetecting && (
              <Badge variant="outline" className="bg-green-500/80 text-white border-none">
                Live
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="controls-container">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Button
            onClick={isDetecting ? stopDetection : startDetection}
            disabled={!isStreaming}
            className={isDetecting ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}
          >
            {isDetecting ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Stop Detection
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Detection
              </>
            )}
          </Button>

          <Button
            onClick={isStreaming ? stopStream : startStream}
            variant="outline"
          >
            {isStreaming ? (
              <>
                <Video className="h-4 w-4 mr-2" />
                Stop Camera
              </>
            ) : (
              <>
                <Camera className="h-4 w-4 mr-2" />
                Start Camera
              </>
            )}
          </Button>
        </div>

        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Detection Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="confidence">Confidence Threshold: {confidenceThreshold}%</Label>
                </div>
                <Slider
                  id="confidence"
                  min={10}
                  max={90}
                  step={5}
                  value={[confidenceThreshold]}
                  onValueChange={(value) => setConfidenceThreshold(value[0])}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="skeleton"
                    checked={showSkeleton}
                    onCheckedChange={setShowSkeleton}
                  />
                  <Label htmlFor="skeleton">Show Skeleton</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="keypoints"
                    checked={showKeypoints}
                    onCheckedChange={setShowKeypoints}
                  />
                  <Label htmlFor="keypoints">Show Keypoints</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="angles"
                    checked={showAngles}
                    onCheckedChange={setShowAngles}
                  />
                  <Label htmlFor="angles">Show Angles</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" size="sm" onClick={takeSnapshot} disabled={!isStreaming}>
            <Download className="h-4 w-4 mr-1" />
            Snapshot
          </Button>

          <Button variant="outline" size="sm" onClick={resetDetector}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Reset
          </Button>

          {cameraDevices.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const currentIndex = cameraDevices.findIndex(device => device.deviceId === selectedCamera);
                const nextIndex = (currentIndex + 1) % cameraDevices.length;
                changeCamera(cameraDevices[nextIndex].deviceId);
              }}
            >
              <Smartphone className="h-4 w-4 mr-1" />
              Switch Camera
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealTimeDetectionPanel;
