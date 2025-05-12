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
  AlertCircle,
  Upload,
  Activity,
  Zap,
  Record,
  StopCircle,
  Save
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
  calculatePoseScore,
  cleanupTensorFlowResources
} from '@/lib/pose-detection';
import { RepetitionCounter, ExerciseType as RepExerciseType } from '@/lib/rep-counter';
import {
  analyzePoseAndGenerateFeedback,
  ExerciseType as AnalysisExerciseType,
  FeedbackMessage
} from '@/lib/posture-analysis';
import { VideoRecorder } from '@/lib/video-recorder';

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
  const [showAngles, setShowAngles] = useState(true);
  const [highlightErrors, setHighlightErrors] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(50);
  const [detectionFPS, setDetectionFPS] = useState(15);

  // Exercise tracking state
  const [selectedExercise, setSelectedExercise] = useState<AnalysisExerciseType>('general');
  const [countingReps, setCountingReps] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [repPhase, setRepPhase] = useState('');
  const [feedback, setFeedback] = useState<FeedbackMessage[]>([]);
  const [poseScore, setPoseScore] = useState<{[key: string]: number}>({
    form: 0,
    alignment: 0,
    stability: 0,
    range: 0,
    overall: 0
  });

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const repCounterRef = useRef<RepetitionCounter | null>(null);
  const recorderRef = useRef<VideoRecorder | null>(null);
  const recordingTimerRef = useRef<number | null>(null);

  // State for detector
  const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(null);
  const [tfInitialized, setTfInitialized] = useState(false);
  const [cameraAvailable, setCameraAvailable] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modelType, setModelType] = useState<string>('blazepose');

  // Initialize TensorFlow.js and pose detector
  useEffect(() => {
    const init = async () => {
      try {
        // Initialize TensorFlow.js
        const initialized = await initializeTensorFlow();
        setTfInitialized(initialized);

        if (initialized) {
          // Create detector with the selected model type
          const newDetector = await createDetector(modelType);

          if (newDetector) {
            setDetector(newDetector);
            console.log(`${modelType} detector initialized successfully`);

            // Initialize repetition counter
            repCounterRef.current = new RepetitionCounter(selectedExercise as RepExerciseType);
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

      // Clean up recording resources
      if (recordingTimerRef.current !== null) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }

      if (recorderRef.current) {
        recorderRef.current.dispose();
        recorderRef.current = null;
      }

      if (recordedUrl) {
        URL.revokeObjectURL(recordedUrl);
      }

      // Clean up TensorFlow.js resources
      cleanupTensorFlowResources();
    };
  }, [modelType]); // Re-initialize when model type changes

  // Re-initialize rep counter when exercise changes
  useEffect(() => {
    if (selectedExercise) {
      repCounterRef.current = new RepetitionCounter(selectedExercise as RepExerciseType);
      setRepCount(0);
      setRepPhase('');
    }
  }, [selectedExercise]);

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
          activeSource === 'camera', // flipHorizontal for camera
          1, // maxPoses
          confidenceThreshold / 100 // scoreThreshold
        );

        if (poses && poses.length > 0) {
          const pose = poses[0];

          // Calculate joint angles
          const angles = calculateJointAngles(pose);

          // Draw skeleton with enhanced visualization
          if (showSkeleton) {
            drawSkeleton(
              ctx,
              pose,
              confidenceThreshold / 100,
              3, // lineWidth
              '#4f46e5', // color
              highlightErrors, // highlight errors
              angles // reference angles
            );
          }

          // Draw keypoints with enhanced visualization
          if (showKeypoints) {
            drawKeypoints(
              ctx,
              pose,
              confidenceThreshold / 100,
              5, // radius
              '#4f46e5', // color
              true // highlight important keypoints
            );
          }

          // Draw angles for key joints
          if (angles && showAngles) {
            // Find keypoints
            const findKeypoint = (name: string) => pose.keypoints.find(kp => kp.name === name);

            // Draw important angles
            const keyJoints = [
              // Elbow angles
              ['left_shoulder', 'left_elbow', 'left_wrist'],
              ['right_shoulder', 'right_elbow', 'right_wrist'],

              // Shoulder angles
              ['left_elbow', 'left_shoulder', 'left_hip'],
              ['right_elbow', 'right_shoulder', 'right_hip'],

              // Hip angles
              ['left_shoulder', 'left_hip', 'left_knee'],
              ['right_shoulder', 'right_hip', 'right_knee'],

              // Knee angles
              ['left_hip', 'left_knee', 'left_ankle'],
              ['right_hip', 'right_knee', 'right_ankle']
            ];

            keyJoints.forEach(([p1Name, p2Name, p3Name]) => {
              const p1 = findKeypoint(p1Name);
              const p2 = findKeypoint(p2Name);
              const p3 = findKeypoint(p3Name);

              if (p1 && p2 && p3 &&
                  p1.score > confidenceThreshold/100 &&
                  p2.score > confidenceThreshold/100 &&
                  p3.score > confidenceThreshold/100) {
                drawAngle(
                  ctx,
                  { x: p1.x, y: p1.y },
                  { x: p2.x, y: p2.y },
                  { x: p3.x, y: p3.y }
                );
              }
            });
          }

          // Generate feedback based on pose analysis
          const poseFeedback = analyzePoseAndGenerateFeedback(pose, angles, selectedExercise);
          setFeedback(poseFeedback);

          // Calculate pose score
          const scores = calculatePoseScore(pose, angles || {}, selectedExercise);
          setPoseScore(scores);

          // Count repetitions if enabled
          if (countingReps && repCounterRef.current) {
            const repStatus = repCounterRef.current.update(pose);
            setRepCount(repStatus.count);
            setRepPhase(repStatus.phase);

            // Display rep count on canvas
            ctx.font = 'bold 48px Arial';
            ctx.fillStyle = '#4f46e5';
            ctx.textAlign = 'center';
            ctx.fillText(`${repStatus.count}`, canvasRef.current.width - 60, 60);

            // Display phase
            ctx.font = '16px Arial';
            ctx.fillText(
              repStatus.phase === 'up' ? 'UP' : repStatus.phase === 'down' ? 'DOWN' : '',
              canvasRef.current.width - 60, 90
            );
          }

          // Display feedback on canvas
          if (poseFeedback.length > 0) {
            ctx.font = '16px Arial';
            ctx.textAlign = 'left';

            poseFeedback.slice(0, 3).forEach((item, index) => {
              // Set color based on feedback type
              switch (item.type) {
                case 'correction':
                  ctx.fillStyle = '#ef4444'; // Red
                  break;
                case 'warning':
                  ctx.fillStyle = '#f97316'; // Orange
                  break;
                case 'suggestion':
                  ctx.fillStyle = '#3b82f6'; // Blue
                  break;
                case 'positive':
                  ctx.fillStyle = '#22c55e'; // Green
                  break;
                default:
                  ctx.fillStyle = '#ffffff';
              }

              // Draw feedback text
              ctx.fillText(item.message, 20, canvasRef.current.height - 20 - (index * 25));
            });
          }

          // Call the callback with the pose data
          if (onPoseDetected) {
            onPoseDetected({
              ...pose,
              angles,
              scores,
              feedback: poseFeedback,
              repCount: repCount,
              repPhase: repPhase
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

    // Stop recording if active
    if (isRecording && recorderRef.current) {
      stopRecording();
    }

    // Clean up TensorFlow.js resources to free memory
    tf.engine().endScope();
    tf.engine().startScope();
  };

  // Start pose analysis
  const startPoseAnalysis = () => {
    // Don't start analysis if already analyzing
    if (isAnalyzing) return;

    setIsAnalyzing(true);
    toast.info('Starting detailed pose analysis...');

    // First, make sure we have a canvas to work with
    if (!canvasRef.current) {
      setIsAnalyzing(false);
      toast.error('Canvas not available for analysis');
      return;
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) {
      setIsAnalyzing(false);
      toast.error('Canvas context not available');
      return;
    }

    // Start detection if not already running
    if (!isDetecting) {
      startPoseDetection();
    }

    // Simulate analysis process with visual feedback
    let progress = 0;
    const analysisInterval = setInterval(() => {
      progress += 5;

      if (progress >= 100) {
        clearInterval(analysisInterval);

        // Draw analysis results on canvas
        drawAnalysisResults(ctx);

        // Show success message
        toast.success('Analysis complete', {
          description: 'Detailed pose analysis has been completed successfully'
        });

        setIsAnalyzing(false);
        return;
      }

      // Show analysis progress
      const width = canvasRef.current!.width;
      const height = canvasRef.current!.height;

      // Save current canvas state
      ctx.save();

      // Create semi-transparent overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, width, height);

      // Draw progress bar
      const barWidth = width * 0.7;
      const barHeight = 20;
      const barX = (width - barWidth) / 2;
      const barY = height / 2 - barHeight / 2;

      // Draw progress bar background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillRect(barX, barY, barWidth, barHeight);

      // Draw progress bar fill
      ctx.fillStyle = '#4f46e5';
      ctx.fillRect(barX, barY, barWidth * (progress / 100), barHeight);

      // Draw progress text
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Analyzing: ${progress}%`, width / 2, barY + barHeight + 25);

      // Draw analysis type
      ctx.font = 'bold 18px Arial';
      ctx.fillText('Advanced Pose Analysis', width / 2, barY - 25);

      // Restore canvas state
      ctx.restore();
    }, 100);
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

    // Get the latest pose data if available
    let poseData = null;
    let angles = null;

    if (detector && videoRef.current) {
      // Attempt to get a new pose detection for the analysis
      detectPoses(
        detector,
        videoRef.current,
        activeSource === 'camera', // flipHorizontal for camera
        1, // maxPoses
        confidenceThreshold / 100 // scoreThreshold
      ).then(poses => {
        if (poses && poses.length > 0) {
          poseData = poses[0];
          angles = calculateJointAngles(poseData);

          // Continue with drawing the analysis
          drawAnalysisAnnotations(ctx, poseData, angles);
        } else {
          // Draw default analysis if no pose detected
          drawDefaultAnalysis(ctx);
        }
      }).catch(error => {
        console.error('Error detecting pose for analysis:', error);
        // Draw default analysis on error
        drawDefaultAnalysis(ctx);
      });
    } else {
      // Draw default analysis if detector or video not available
      drawDefaultAnalysis(ctx);
    }
  };

  // Draw analysis annotations based on actual pose data
  const drawAnalysisAnnotations = (
    ctx: CanvasRenderingContext2D,
    pose: poseDetection.Pose,
    angles: Record<string, number> | null
  ) => {
    if (!canvasRef.current) return;

    const width = canvasRef.current.width;
    const height = canvasRef.current.height;

    // Draw skeleton with enhanced visualization
    drawSkeleton(
      ctx,
      pose,
      confidenceThreshold / 100,
      3, // lineWidth
      '#4f46e5', // color
      true, // highlight errors
      angles // reference angles
    );

    // Draw keypoints with enhanced visualization
    drawKeypoints(
      ctx,
      pose,
      confidenceThreshold / 100,
      5, // radius
      '#4f46e5', // color
      true // highlight important keypoints
    );

    // Generate feedback based on pose analysis
    const poseFeedback = analyzePoseAndGenerateFeedback(pose, angles, selectedExercise);

    // Calculate pose score
    const scores = calculatePoseScore(pose, angles || {}, selectedExercise);

    // Draw analysis overlay
    drawAnalysisOverlay(ctx, poseFeedback, scores);
  };

  // Draw default analysis when no pose data is available
  const drawDefaultAnalysis = (ctx: CanvasRenderingContext2D) => {
    if (!canvasRef.current) return;

    const width = canvasRef.current.width;
    const height = canvasRef.current.height;

    // Draw analysis annotations
    const centerX = width / 2;
    const centerY = height / 2;

    // 1. Draw joint angles
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

    // Draw default analysis overlay
    drawAnalysisOverlay(ctx, [], {
      form: 85,
      alignment: 80,
      stability: 90,
      range: 75,
      overall: 82
    });
  };

  // Draw analysis overlay with feedback and scores
  const drawAnalysisOverlay = (
    ctx: CanvasRenderingContext2D,
    feedback: FeedbackMessage[],
    scores: {[key: string]: number}
  ) => {
    if (!canvasRef.current) return;

    const width = canvasRef.current.width;
    const height = canvasRef.current.height;

    // Draw semi-transparent overlay panel at the bottom
    const panelHeight = 150;
    const panelY = height - panelHeight;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, panelY, width, panelHeight);

    // Draw title
    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('Detailed Pose Analysis', width / 2, panelY + 25);

    // Draw scores
    const scoreX = 100;
    const scoreY = panelY + 60;
    const scoreSpacing = 120;

    // Draw score bars
    Object.entries(scores).forEach(([key, value], index) => {
      if (key === 'overall') return; // Skip overall score here

      const x = scoreX + (index * scoreSpacing);

      // Draw score label
      ctx.font = '12px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(key.charAt(0).toUpperCase() + key.slice(1), x, scoreY - 10);

      // Draw score bar background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillRect(x - 40, scoreY, 80, 10);

      // Draw score bar fill
      const barColor = value >= 80 ? '#22c55e' : value >= 60 ? '#f59e0b' : '#ef4444';
      ctx.fillStyle = barColor;
      ctx.fillRect(x - 40, scoreY, 80 * (value / 100), 10);

      // Draw score value
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`${value}%`, x, scoreY + 30);
    });

    // Draw overall score in a circle
    const overallX = width - 80;
    const overallY = panelY + 60;
    const overallScore = scores.overall || 0;

    // Draw circle background
    ctx.beginPath();
    ctx.arc(overallX, overallY, 30, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fill();

    // Draw score arc
    ctx.beginPath();
    ctx.arc(overallX, overallY, 30, -Math.PI / 2, (Math.PI * 2 * (overallScore / 100)) - Math.PI / 2);
    ctx.lineWidth = 5;
    const arcColor = overallScore >= 80 ? '#22c55e' : overallScore >= 60 ? '#f59e0b' : '#ef4444';
    ctx.strokeStyle = arcColor;
    ctx.stroke();

    // Draw score text
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(`${overallScore}%`, overallX, overallY + 5);

    // Draw "Overall" label
    ctx.font = '12px Arial';
    ctx.fillText('Overall', overallX, overallY - 40);

    // Draw feedback
    const feedbackX = 20;
    const feedbackY = panelY + 100;

    ctx.font = '14px Arial';
    ctx.textAlign = 'left';

    if (feedback.length > 0) {
      // Show up to 3 feedback items
      feedback.slice(0, 3).forEach((item, index) => {
        // Set color based on feedback type
        switch (item.type) {
          case 'correction':
            ctx.fillStyle = '#ef4444'; // Red
            break;
          case 'warning':
            ctx.fillStyle = '#f97316'; // Orange
            break;
          case 'suggestion':
            ctx.fillStyle = '#3b82f6'; // Blue
            break;
          case 'positive':
            ctx.fillStyle = '#22c55e'; // Green
            break;
          default:
            ctx.fillStyle = '#ffffff';
        }

        // Draw feedback text
        ctx.fillText(`• ${item.message}`, feedbackX, feedbackY + (index * 20));
      });
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.fillText('• Good form! Keep it up.', feedbackX, feedbackY);
    }
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
    setActiveSource('video');

    // Show loading toast
    const loadingToast = toast.loading(`Loading video: ${file.name}`);

    // Reset video element
    if (videoRef.current) {
      videoRef.current.src = videoUrl;
      videoRef.current.load();

      // Add event listener for when video is loaded
      videoRef.current.onloadedmetadata = () => {
        // Dismiss loading toast
        toast.dismiss(loadingToast);
        toast.success(`Video loaded: ${file.name}`);

        // Set canvas dimensions to match video
        if (canvasRef.current && videoRef.current) {
          canvasRef.current.width = videoRef.current.videoWidth;
          canvasRef.current.height = videoRef.current.videoHeight;
        }

        // Auto-play the video
        videoRef.current.play().catch(error => {
          console.error('Error playing video:', error);
          toast.error('Could not autoplay video. Please click play manually.');
        });
      };

      // Handle errors
      videoRef.current.onerror = () => {
        toast.dismiss(loadingToast);
        toast.error('Error loading video. Please try another file.');
      };
    }

    // Stop camera if it's active
    if (cameraActive) {
      stopCameraStream();
    }

    // Reset state
    setIsDetecting(false);
    setIsAnalyzing(false);
    setRepCount(0);
    setRepPhase('');
    setFeedback([]);
    setPoseScore({
      form: 0,
      alignment: 0,
      stability: 0,
      range: 0,
      overall: 0
    });

    // Clear the file input value so the same file can be uploaded again
    event.target.value = '';
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

  // Start recording
  const startRecording = async () => {
    if (isRecording) return;

    if (!videoRef.current || !canvasRef.current) {
      toast.error('Video or canvas element not found');
      return;
    }

    try {
      // Initialize recorder if not already initialized
      if (!recorderRef.current) {
        recorderRef.current = new VideoRecorder({
          mimeType: 'video/webm;codecs=vp9',
          frameRate: 30
        });
      }

      // Initialize with canvas (includes video and pose overlay)
      const initialized = await recorderRef.current.initWithCanvas(canvasRef.current, true);

      if (!initialized) {
        toast.error('Failed to initialize recorder');
        return;
      }

      // Start recording
      const started = recorderRef.current.start();

      if (!started) {
        toast.error('Failed to start recording');
        return;
      }

      setIsRecording(true);
      setRecordingDuration(0);
      setRecordedBlob(null);
      setRecordedUrl(null);

      // Start timer to update duration
      recordingTimerRef.current = window.setInterval(() => {
        if (recorderRef.current) {
          setRecordingDuration(recorderRef.current.getDuration());
        }
      }, 1000);

      toast.success('Recording started');

      // Start detection if not already running
      if (!isDetecting) {
        startPoseDetection();
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording');
    }
  };

  // Stop recording
  const stopRecording = async () => {
    if (!isRecording || !recorderRef.current) return;

    try {
      // Stop the recording timer
      if (recordingTimerRef.current !== null) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }

      // Stop the recorder and get the blob
      const blob = await recorderRef.current.stop();

      // Create URL for the blob
      const url = URL.createObjectURL(blob);

      setIsRecording(false);
      setRecordedBlob(blob);
      setRecordedUrl(url);

      toast.success('Recording stopped');
    } catch (error) {
      console.error('Error stopping recording:', error);
      toast.error('Failed to stop recording');
      setIsRecording(false);
    }
  };

  // Save recorded video
  const saveRecordedVideo = () => {
    if (!recordedBlob) {
      toast.error('No recording available to save');
      return;
    }

    try {
      // Create a download link
      const url = recordedUrl || URL.createObjectURL(recordedBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pose-recording-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Recording saved successfully');
    } catch (error) {
      console.error('Error saving recording:', error);
      toast.error('Failed to save recording');
    }
  };

  // Format time for display (mm:ss)
  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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

            {countingReps && (
              <Button
                variant={repCount > 0 ? "default" : "outline"}
                onClick={() => {
                  if (repCounterRef.current) {
                    repCounterRef.current.reset();
                    setRepCount(0);
                    setRepPhase('');
                  }
                }}
              >
                <Activity className="h-4 w-4 mr-2" />
                {repCount > 0 ? `${repCount} Reps` : 'Reset Counter'}
              </Button>
            )}

            <AnalyzePoseButton
              onClick={startPoseAnalysis}
              isAnalyzing={isAnalyzing}
            />

            {/* Recording buttons */}
            {isRecording ? (
              <Button
                variant="destructive"
                onClick={stopRecording}
                className="animate-pulse"
              >
                <StopCircle className="h-4 w-4 mr-2" />
                Stop Recording ({formatTime(recordingDuration)})
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={startRecording}
                disabled={!isDetecting}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <Record className="h-4 w-4 mr-2" />
                Record Video
              </Button>
            )}

            {recordedBlob && (
              <Button
                variant="outline"
                onClick={saveRecordedVideo}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Recording
              </Button>
            )}

            <Button
              variant="outline"
              onClick={downloadFrame}
            >
              <Download className="h-4 w-4 mr-2" />
              Save Frame
            </Button>

            <Button
              variant="outline"
              onClick={shareFrame}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Feedback and Stats Panel */}
          {isDetecting && (
            <div className="mt-4 p-3 bg-muted/30 rounded-md">
              <div className="flex items-center mb-2">
                <Zap className="h-4 w-4 mr-2 text-primary" />
                <h3 className="text-sm font-medium">Real-time Analysis</h3>
              </div>

              {/* Pose Score */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs">Overall Form</span>
                  <span className="text-xs font-medium">{poseScore.overall}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full"
                    style={{ width: `${poseScore.overall}%` }}
                  ></div>
                </div>
              </div>

              {/* Score Details */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                {Object.entries(poseScore)
                  .filter(([key]) => key !== 'overall')
                  .map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-xs text-gray-500 mb-1">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                      <div className="text-sm font-medium">{value}%</div>
                    </div>
                  ))
                }
              </div>

              {/* Feedback Messages */}
              <div className="space-y-2 mt-3">
                <h4 className="text-xs font-medium text-gray-500">Feedback</h4>
                {feedback.length > 0 ? (
                  <ul className="space-y-1">
                    {feedback.slice(0, 3).map((item, index) => (
                      <li
                        key={index}
                        className={`text-xs px-2 py-1 rounded flex items-start ${
                          item.type === 'correction' ? 'bg-red-50 text-red-700' :
                          item.type === 'warning' ? 'bg-amber-50 text-amber-700' :
                          item.type === 'suggestion' ? 'bg-blue-50 text-blue-700' :
                          'bg-green-50 text-green-700'
                        }`}
                      >
                        <span className="mr-1">•</span>
                        {item.message}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-500">No feedback available yet. Start moving to get analysis.</p>
                )}
              </div>
            </div>
          )}

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
              <div className="space-y-2 mb-4">
                <Label className="text-sm font-medium">Exercise Type</Label>
                <select
                  className="w-full p-2 rounded-md border border-gray-300 bg-white"
                  value={selectedExercise}
                  onChange={(e) => setSelectedExercise(e.target.value as AnalysisExerciseType)}
                >
                  <option value="general">General Posture</option>
                  <option value="squat">Squat</option>
                  <option value="pushup">Push-up</option>
                  <option value="plank">Plank</option>
                  <option value="lunge">Lunge</option>
                  <option value="shoulderPress">Shoulder Press</option>
                  <option value="bicepCurl">Bicep Curl</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="counting-reps" className="text-sm">Count Repetitions</Label>
                <Switch
                  id="counting-reps"
                  checked={countingReps}
                  onCheckedChange={setCountingReps}
                />
              </div>

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

              <div className="flex items-center justify-between">
                <Label htmlFor="show-angles" className="text-sm">Show Joint Angles</Label>
                <Switch
                  id="show-angles"
                  checked={showAngles}
                  onCheckedChange={setShowAngles}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="highlight-errors" className="text-sm">Highlight Form Errors</Label>
                <Switch
                  id="highlight-errors"
                  checked={highlightErrors}
                  onCheckedChange={setHighlightErrors}
                />
              </div>

              <div className="space-y-2 mt-2">
                <Label className="text-sm font-medium">Model Type</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={modelType === 'blazepose' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setModelType('blazepose')}
                    className="text-xs"
                  >
                    BlazePose
                  </Button>
                  <Button
                    variant={modelType === 'movenet' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setModelType('movenet')}
                    className="text-xs"
                  >
                    MoveNet
                  </Button>
                  <Button
                    variant={modelType === 'posenet' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setModelType('posenet')}
                    className="text-xs"
                  >
                    PoseNet
                  </Button>
                </div>
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
                  setShowAngles(true);
                  setHighlightErrors(true);
                  setConfidenceThreshold(50);
                  setDetectionFPS(15);
                  setModelType('blazepose');
                  setSelectedExercise('general');
                  setCountingReps(false);
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
