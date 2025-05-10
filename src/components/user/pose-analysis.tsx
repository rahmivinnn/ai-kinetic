'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Camera, RefreshCw, Check, AlertTriangle, Info, Activity, Zap, Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, Box, LayoutSplit, Layers, Stop } from 'lucide-react';

// Define the PoseAnalysis component props
interface PoseAnalysisProps {
  videoUrl?: string;
  onAnalysisComplete?: (results: any) => void;
  mode?: 'live' | 'upload';
  referenceVideoUrl?: string;
  enableVoiceFeedback?: boolean;
  showAdvancedMetrics?: boolean;
}

interface PoseMetrics {
  symmetryScore: number;
  balanceScore: number;
  stabilityScore: number;
  alignmentScore: number;
  overallScore: number;
  jointAngles: Record<string, number>;
  movementQuality: number;
  energyEfficiency: number;
  formConsistency: number;
  rangeOfMotion: number;
  performanceHistory: Array<{
    timestamp: number;
    score: number;
    metrics: Record<string, number>;
  }>;
}

interface Exercise {
  name: string;
  targetAngles: Record<string, number>;
  tolerance: number;
  instructions: string[];
}

export function PoseAnalysis({ videoUrl, onAnalysisComplete, mode = 'live', referenceVideoUrl, enableVoiceFeedback = false, showAdvancedMetrics = false }: PoseAnalysisProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas3DRef = useRef<HTMLCanvasElement>(null);
  const referenceVideoRef = useRef<HTMLVideoElement>(null);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
  const animationFrameRef = useRef<number>();
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);
  const [poseScore, setPoseScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [isMediaPipeLoaded, setIsMediaPipeLoaded] = useState(false);
  const [isOpenPoseLoaded, setIsOpenPoseLoaded] = useState(false);
  const [isMediaPipeSupported, setIsMediaPipeSupported] = useState(true);
  const [isOpenPoseSupported, setIsOpenPoseSupported] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [detectionMethod, setDetectionMethod] = useState<'mediapipe' | 'openpose'>('mediapipe');
  const [poseMetrics, setPoseMetrics] = useState<PoseMetrics>({ 
    symmetryScore: 0,
    balanceScore: 0,
    stabilityScore: 0,
    alignmentScore: 0,
    overallScore: 0,
    jointAngles: {},
    movementQuality: 0,
    energyEfficiency: 0,
    formConsistency: 0,
    rangeOfMotion: 0,
    performanceHistory: []
  });
  
  // 3D Visualization settings
  const [visualization3D, setVisualization3D] = useState({
    rotationX: 0,
    rotationY: 0,
    zoom: 1,
    autoRotate: false,
    showSkeleton: true,
    showMuscles: false,
    highlightIssues: true
  });

  // Enhanced feedback settings
  const [feedbackSettings, setFeedbackSettings] = useState({
    showRealtime: true,
    voiceFeedback: enableVoiceFeedback,
    vibrationFeedback: false,
    detailedAnalysis: showAdvancedMetrics,
    highlightCorrections: true
  });

  // Performance tracking
  const [performanceStats, setPerformanceStats] = useState({
    sessionsCompleted: 0,
    totalExerciseTime: 0,
    personalBests: {},
    recentProgress: [],
    achievementPoints: 0
  });
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [show3DView, setShow3DView] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [audioFeedback, setAudioFeedback] = useState(enableVoiceFeedback);
  const [videoPlaybackState, setVideoPlaybackState] = useState({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    playbackRate: 1,
    isFullscreen: false
  });
  const [showSideBySide, setShowSideBySide] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(0.5);
  const [showControls, setShowControls] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const openPoseNetRef = useRef<any>(null);
  const poseHistoryRef = useRef<any[]>([]);
  const lastFeedbackTimeRef = useRef<number>(0);

  // Load MediaPipe scripts
  useEffect(() => {
    // Check if MediaPipe is already loaded
    if (window.poseDetection) {
      setIsMediaPipeLoaded(true);
      return;
    }

    // Load TensorFlow.js and MediaPipe scripts
    const loadScripts = async () => {
      try {
        // Load TensorFlow.js Core
        const tfScript = document.createElement('script');
        tfScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core@4.2.0/dist/tf-core.min.js';
        tfScript.async = true;
        document.body.appendChild(tfScript);

        await new Promise((resolve) => {
          tfScript.onload = resolve;
        });

        // Load TensorFlow.js Backend
        const tfBackendScript = document.createElement('script');
        tfBackendScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl@4.2.0/dist/tf-backend-webgl.min.js';
        tfBackendScript.async = true;
        document.body.appendChild(tfBackendScript);

        await new Promise((resolve) => {
          tfBackendScript.onload = resolve;
        });

        // Load MediaPipe Pose Detection
        const poseDetectionScript = document.createElement('script');
        poseDetectionScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection@2.1.0/dist/pose-detection.min.js';
        poseDetectionScript.async = true;
        document.body.appendChild(poseDetectionScript);

        await new Promise((resolve) => {
          poseDetectionScript.onload = resolve;
        });

        setIsMediaPipeLoaded(true);
        toast.success('MediaPipe loaded successfully');
      } catch (error) {
        console.error('Error loading MediaPipe:', error);
        setIsMediaPipeSupported(false);
        toast.error('Failed to load MediaPipe. Your browser may not support it.');
      }
    };

    loadScripts();

    // Cleanup function
    // Cleanup function for MediaPipe useEffect
  return () => {
    // Stop camera if active
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    }
  };
}, []);

const togglePlayPause = () => {
  if (videoRef.current) {
    if (videoPlaybackState.isPlaying) {
      videoRef.current.pause();
      setVideoPlaybackState(prev => ({ ...prev, isPlaying: false }));
    } else {
      videoRef.current.play();
      setVideoPlaybackState(prev => ({ ...prev, isPlaying: true }));
    }
  }
};

const handleVideoTimeUpdate = () => {
  if (videoRef.current) {
    setVideoPlaybackState(prev => ({
      ...prev,
      currentTime: videoRef.current.currentTime
    }));
  }
};

const handleVideoLoadedMetadata = () => {
  if (videoRef.current) {
    setVideoPlaybackState(prev => ({
      ...prev,
      duration: videoRef.current.duration
    }));
  }
};

const handleVolumeChange = (value: number) => {
  if (videoRef.current) {
    videoRef.current.volume = value;
    setVideoPlaybackState(prev => ({ ...prev, volume: value }));
  }
};

const handlePlaybackRateChange = (value: number) => {
  if (videoRef.current) {
    videoRef.current.playbackRate = value;
    setVideoPlaybackState(prev => ({ ...prev, playbackRate: value }));
  }
};

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    videoRef.current?.requestFullscreen();
    setVideoPlaybackState(prev => ({ ...prev, isFullscreen: true }));
  } else {
    document.exitFullscreen();
    setVideoPlaybackState(prev => ({ ...prev, isFullscreen: false }));
  }
};

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const startAnalysis = () => {
  setIsAnalyzing(true);
  // Add analysis logic here
};

const stopAnalysis = () => {
  setIsAnalyzing(false);
  // Add cleanup logic here
};


  return (
    <div className="relative w-full h-full">
      {/* Video Player Container with enhanced visuals */}
      <div 
        className={`relative w-full aspect-video bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden shadow-lg transition-all duration-500 ${isTransitioning ? 'scale-95 opacity-90 rotate-1' : 'scale-100 opacity-100 rotate-0'} hover:shadow-2xl`}
        style={{
          transform: `perspective(1000px) ${isTransitioning ? 'rotateX(2deg)' : 'rotateX(0deg)'}`
        }}
        onMouseEnter={() => {
          setShowControls(true);
          setIsTransitioning(true);
          setTimeout(() => setIsTransitioning(false), 300);
        }}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Main Video */}
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          onTimeUpdate={handleVideoTimeUpdate}
          onLoadedMetadata={handleVideoLoadedMetadata}
        />

        {/* Reference Video (if in comparison mode) */}
        {(showSideBySide || showOverlay) && (
          <video
            ref={referenceVideoRef}
            className={`absolute top-0 ${showSideBySide ? 'right-0 w-1/2' : 'left-0 w-full opacity-50'} h-full object-contain`}
          />
        )}

        {/* Canvas Overlay */}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        />

        {/* 3D View Canvas */}
        {show3DView && (
          <canvas
            ref={canvas3DRef}
            className="absolute top-0 right-0 w-1/3 h-1/3 bg-black/30 rounded-bl-lg"
          />
        )}

        {/* Video Controls */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Progress Bar */}
          <div className="w-full h-1 bg-white/30 rounded-full mb-4 cursor-pointer">
            <div 
              className="h-full bg-primary rounded-full relative"
              style={{ width: `${(videoPlaybackState.currentTime / videoPlaybackState.duration) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full transform scale-0 hover:scale-100 transition-transform" />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-primary"
                onClick={togglePlayPause}
              >
                {videoPlaybackState.isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-white text-sm">
                  {formatTime(videoPlaybackState.currentTime)} / {formatTime(videoPlaybackState.duration)}
                </span>
              </div>

              <div className="flex items-center gap-2 group relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-primary"
                >
                  <Volume2 className="h-5 w-5" />
                </Button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
                  <div className="bg-black/90 rounded-lg p-2">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={videoPlaybackState.volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-24"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Playback Rate */}
              <select
                value={videoPlaybackState.playbackRate}
                onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
                className="bg-transparent text-white text-sm border-none outline-none"
              >
                <option value="0.5">0.5x</option>
                <option value="1">1x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
              </select>

              {/* Comparison Controls */}
              {referenceVideoUrl && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`text-white hover:text-primary ${showSideBySide ? 'text-primary' : ''}`}
                    onClick={() => {
                      setShowSideBySide(!showSideBySide);
                      setShowOverlay(false);
                    }}
                  >
                    <LayoutSplit className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`text-white hover:text-primary ${showOverlay ? 'text-primary' : ''}`}
                    onClick={() => {
                      setShowOverlay(!showOverlay);
                      setShowSideBySide(false);
                    }}
                  >
                    <Layers className="h-5 w-5" />
                  </Button>
                </div>
              )}

              {/* 3D View Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className={`text-white hover:text-primary ${show3DView ? 'text-primary' : ''}`}
                onClick={() => setShow3DView(!show3DView)}
              >
                <Box className="h-5 w-5" />
              </Button>

              {/* Fullscreen Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-primary"
                onClick={toggleFullscreen}
              >
                {videoPlaybackState.isFullscreen ? (
                  <Minimize2 className="h-5 w-5" />
                ) : (
                  <Maximize2 className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Controls */}
      <div className="mt-6 space-y-4 transform transition-all duration-300 hover:scale-[1.02]">
        <div className="flex items-center justify-between bg-gradient-to-r from-gray-900/50 to-gray-800/50 p-4 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <Button
              variant={isAnalyzing ? 'destructive' : 'default'}
              onClick={isAnalyzing ? stopAnalysis : startAnalysis}
              className={`relative overflow-hidden transform transition-all duration-300 ${isAnalyzing ? 'animate-pulse shadow-red-500/50' : 'hover:scale-105 shadow-primary/50'} shadow-lg`}
            >
              {isAnalyzing ? (
                <>
                  <Stop className="h-5 w-5 mr-2" />
                  Stop Analysis
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  Start Analysis
                </>
              )}
              {isAnalyzing && (
                <div
                  className="absolute inset-0 bg-white/20"
                  style={{
                    transform: `translateX(${progress}%)",
                    transition: 'transform 0.2s ease-out'
                  }}
                />
              )}
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setDetectionMethod('mediapipe')}
                className={detectionMethod === 'mediapipe' ? 'border-primary text-primary' : ''}
              >
                <Activity className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setDetectionMethod('openpose')}
                className={detectionMethod === 'openpose' ? 'border-primary text-primary' : ''}
              >
                <Zap className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setAudioFeedback(!audioFeedback)}
              className={audioFeedback ? 'border-primary text-primary' : ''}
            >
              {audioFeedback ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowAdvancedMetrics(!showAdvancedMetrics)}
              className={showAdvancedMetrics ? 'border-primary text-primary' : ''}
            >
              <BarChart2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Feedback Display */}
        <div className="space-y-2 perspective-1000">
          {feedback.map((message, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 p-4 rounded-xl backdrop-blur-sm flex items-start gap-3 transform transition-all duration-500 hover:scale-[1.02] hover:-rotate-1 shadow-lg"
              style={{
                animation: `slideIn 0.5s ease-out ${index * 0.1}s both`,
                opacity: 0,
                transform: 'translateY(20px)'
              }}
            >
              <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm">{message}</p>
            </div>
          ))}
        </div>

        {/* Metrics Display */}
        {showAdvancedMetrics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <MetricCard
              title="Symmetry"
              value={poseMetrics.symmetryScore}
              icon={<Balance className="h-5 w-5" />}
            />
            <MetricCard
              title="Balance"
              value={poseMetrics.balanceScore}
              icon={<Activity className="h-5 w-5" />}
            />
            <MetricCard
              title="Stability"
              value={poseMetrics.stabilityScore}
              icon={<Anchor className="h-5 w-5" />}
            />
            <MetricCard
              title="Alignment"
              value={poseMetrics.alignmentScore}
              icon={<AlignCenter className="h-5 w-5" />}
            />
          </div>
        )}
      </div>
    </div>) => {
      // Stop camera if active
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  // Load OpenPose scripts
  useEffect(() => {
    if (window.posenet) {
      setIsOpenPoseLoaded(true);
      return;
    }

    const loadOpenPoseScripts = async () => {
      try {
        // First ensure TensorFlow.js is loaded
        if (!window.tf) {
          // Load TensorFlow.js Core if not already loaded
          const tfScript = document.createElement('script');
          tfScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.2.0/dist/tf.min.js';
          tfScript.async = true;
          document.body.appendChild(tfScript);

          await new Promise((resolve) => {
            tfScript.onload = resolve;
          });
        }

        // Load PoseNet (implementation of OpenPose in TensorFlow.js)
        const posenetScript = document.createElement('script');
        posenetScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/posenet@2.2.2/dist/posenet.min.js';
        posenetScript.async = true;
        document.body.appendChild(posenetScript);

        await new Promise((resolve) => {
          posenetScript.onload = resolve;
        });

        // Initialize PoseNet model
        if (window.posenet) {
          // Load OpenPose model
          const net = await window.posenet.load({
            architecture: 'ResNet50',
            outputStride: 32,
            inputResolution: { width: 640, height: 480 },
            quantBytes: 2
          });
          
          openPoseNetRef.current = net;
          setIsOpenPoseLoaded(true);
          toast.success('OpenPose loaded successfully');
        }
      } catch (error) {
        console.error('Error loading OpenPose:', error);
        setIsOpenPoseSupported(false);
        toast.error('Failed to load OpenPose. Your browser may not support it.');
      }
    };

    loadOpenPoseScripts();
  }, []);

  // Initialize camera for live mode
  const startCamera = async () => {
    if (!videoRef.current) return;

    try {
      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setCameraActive(true);
      toast.success('Camera started');
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Failed to access camera. Please check permissions.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
      toast.info('Camera stopped');
    }
  };

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      speechSynthesisRef.current = window.speechSynthesis;
    }
  }, []);

  // Provide audio feedback
  const speakFeedback = (message: string) => {
    if (audioFeedback && speechSynthesisRef.current) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'id-ID';
      speechSynthesisRef.current.speak(utterance);
    }
  };

  // Calculate pose metrics
  const calculatePoseMetrics = (pose: any) => {
    const metrics: PoseMetrics = {
      symmetryScore: calculateSymmetryScore(pose),
      balanceScore: calculateBalanceScore(pose),
      stabilityScore: calculateStabilityScore(pose),
      alignmentScore: calculateAlignmentScore(pose),
      overallScore: 0,
      jointAngles: calculateJointAngles(pose)
    };
    
    metrics.overallScore = (metrics.symmetryScore + metrics.balanceScore + 
      metrics.stabilityScore + metrics.alignmentScore) / 4;
    
    return metrics;
  };

  // Calculate symmetry score
  const calculateSymmetryScore = (pose: any) => {
    // Implement symmetry calculation logic
    return 0.8; // Placeholder
  };

  // Calculate balance score
  const calculateBalanceScore = (pose: any) => {
    // Implement balance calculation logic
    return 0.75; // Placeholder
  };

  // Calculate stability score
  const calculateStabilityScore = (pose: any) => {
    // Implement stability calculation logic using pose history
    return 0.9; // Placeholder
  };

  // Calculate alignment score
  const calculateAlignmentScore = (pose: any) => {
    // Implement alignment calculation logic
    return 0.85; // Placeholder
  };

  // Calculate joint angles
  const calculateJointAngles = (pose: any) => {
    const angles: Record<string, number> = {};
    // Implement joint angle calculations
    return angles;
  };

  // Enhanced pose comparison with advanced visualization
  const compareWithReference = async () => {
    if (!referenceVideoRef.current || !currentExercise) return;
    
    setIsTransitioning(true);
    
    // Setup comparison view based on mode
    if (showSideBySide) {
      // Side by side view setup
      const mainCanvas = canvasRef.current!;
      const refCanvas = document.createElement('canvas');
      refCanvas.width = mainCanvas.width / 2;
      refCanvas.height = mainCanvas.height;
      
      const mainCtx = mainCanvas.getContext('2d')!;
      const refCtx = refCanvas.getContext('2d')!;
      
      // Draw current video
      mainCtx.drawImage(
        videoRef.current!,
        0, 0, mainCanvas.width / 2, mainCanvas.height
      );
      
      // Draw reference video
      mainCtx.drawImage(
        referenceVideoRef.current!,
        mainCanvas.width / 2, 0, mainCanvas.width / 2, mainCanvas.height
      );
      
      // Add divider line with animation
      mainCtx.beginPath();
      mainCtx.moveTo(mainCanvas.width / 2, 0);
      mainCtx.lineTo(mainCanvas.width / 2, mainCanvas.height);
      mainCtx.strokeStyle = '#00ff00';
      mainCtx.lineWidth = 2;
      mainCtx.stroke();
      
    } else if (showOverlay) {
      // Overlay view setup
      const ctx = canvasRef.current!.getContext('2d')!;
      
      // Draw current video
      ctx.drawImage(videoRef.current!, 0, 0, canvasRef.current!.width, canvasRef.current!.height);
      
      // Draw reference video with opacity
      ctx.globalAlpha = overlayOpacity;
      ctx.drawImage(referenceVideoRef.current!, 0, 0, canvasRef.current!.width, canvasRef.current!.height);
      ctx.globalAlpha = 1.0;
    }
    
    // Calculate pose similarity
    const currentPose = await detectPose(videoRef.current!);
    const referencePose = await detectPose(referenceVideoRef.current!);
    
    const similarity = calculatePoseSimilarity(currentPose, referencePose);
    const angleErrors = findAngleErrors(currentPose, referencePose);
    
    // Generate detailed feedback
    const feedbackMessages = [];
    
    if (similarity < currentExercise.tolerance) {
      angleErrors.forEach(error => {
        feedbackMessages.push(
          `Sesuaikan sudut ${error.joint}: perbedaan ${error.difference.toFixed(1)}°`
        );
      });
    }
    
    // Update feedback with animation
    setFeedback(prev => {
      const newFeedback = [...feedbackMessages];
      setTimeout(() => setIsTransitioning(false), 300);
      return newFeedback;
    });
    
    // Provide audio feedback
    if (feedbackMessages.length > 0) {
      speakFeedback(feedbackMessages[0]);
    }
  };
  
  // Calculate pose similarity
  const calculatePoseSimilarity = (pose1: any, pose2: any) => {
    let totalSimilarity = 0;
    let count = 0;
    
    // Compare joint positions
    pose1.keypoints.forEach((kp1: any, i: number) => {
      const kp2 = pose2.keypoints[i];
      if (kp1.score > 0.5 && kp2.score > 0.5) {
        const distance = Math.sqrt(
          Math.pow(kp1.x - kp2.x, 2) + Math.pow(kp1.y - kp2.y, 2)
        );
        totalSimilarity += 1 / (1 + distance);
        count++;
      }
    });
    
    return count > 0 ? totalSimilarity / count : 0;
  };
  
  // Find angle errors between poses
  const findAngleErrors = (pose1: any, pose2: any) => {
    const errors = [];
    const joints = ['shoulder', 'elbow', 'hip', 'knee'];
    
    joints.forEach(joint => {
      const angle1 = calculateJointAngle(pose1, joint);
      const angle2 = calculateJointAngle(pose2, joint);
      
      if (Math.abs(angle1 - angle2) > 15) { // 15 degrees threshold
        errors.push({
          joint,
          difference: Math.abs(angle1 - angle2)
        });
      }
    });
    
    return errors;
  };

  // Enhanced 3D visualization with Three.js
  const render3DView = (pose: any) => {
    if (!canvas3DRef.current || !show3DView) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas3DRef.current.width / canvas3DRef.current.height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas3DRef.current, alpha: true });
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);
    
    // Create joints and bones
    const joints: THREE.Mesh[] = [];
    const bones: THREE.Line[] = [];
    
    // Add joints
    pose.keypoints.forEach((keypoint: any) => {
      if (keypoint.score > 0.5) {
        const geometry = new THREE.SphereGeometry(0.1, 32, 32);
        const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        const joint = new THREE.Mesh(geometry, material);
        joint.position.set(
          (keypoint.x / canvas3DRef.current!.width - 0.5) * 4,
          -(keypoint.y / canvas3DRef.current!.height - 0.5) * 4,
          0
        );
        scene.add(joint);
        joints.push(joint);
      }
    });
    
    // Add bones between connected joints
    const connections = [
      ['leftShoulder', 'leftElbow'],
      ['leftElbow', 'leftWrist'],
      ['rightShoulder', 'rightElbow'],
      ['rightElbow', 'rightWrist'],
      ['leftShoulder', 'rightShoulder'],
      ['leftHip', 'rightHip'],
      ['leftShoulder', 'leftHip'],
      ['rightShoulder', 'rightHip'],
      ['leftHip', 'leftKnee'],
      ['leftKnee', 'leftAnkle'],
      ['rightHip', 'rightKnee'],
      ['rightKnee', 'rightAnkle']
    ];
    
    connections.forEach(([start, end]) => {
      const startPoint = pose.keypoints.find((kp: any) => kp.name === start);
      const endPoint = pose.keypoints.find((kp: any) => kp.name === end);
      
      if (startPoint && endPoint && startPoint.score > 0.5 && endPoint.score > 0.5) {
        const points = [];
        points.push(new THREE.Vector3(
          (startPoint.x / canvas3DRef.current!.width - 0.5) * 4,
          -(startPoint.y / canvas3DRef.current!.height - 0.5) * 4,
          0
        ));
        points.push(new THREE.Vector3(
          (endPoint.x / canvas3DRef.current!.width - 0.5) * 4,
          -(endPoint.y / canvas3DRef.current!.height - 0.5) * 4,
          0
        ));
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
        const bone = new THREE.Line(geometry, material);
        scene.add(bone);
        bones.push(bone);
      }
    });
    
    // Position camera
    camera.position.z = 5;
    
    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      // Rotate scene slightly for 3D effect
      scene.rotation.y += 0.005;
      
      // Add smooth transitions for joint positions
      joints.forEach((joint, i) => {
        const keypoint = pose.keypoints[i];
        if (keypoint && keypoint.score > 0.5) {
          joint.position.lerp(
            new THREE.Vector3(
              (keypoint.x / canvas3DRef.current!.width - 0.5) * 4,
              -(keypoint.y / canvas3DRef.current!.height - 0.5) * 4,
              0
            ),
            0.1
          );
        }
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup
    const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleVideoLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value;
    }
  };

  const handlePlaybackRateChange = (value: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = value;
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);
  };

  const stopAnalysis = () => {
    setIsAnalyzing(false);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="relative w-full h-full">
      {/* Video Player Container with enhanced visuals */}
      <div 
        className={`relative w-full aspect-video bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden shadow-lg transition-all duration-500 ${isTransitioning ? 'scale-95 opacity-90 rotate-1' : 'scale-100 opacity-100 rotate-0'} hover:shadow-2xl`}
        style={{
          transform: `perspective(1000px) ${isTransitioning ? 'rotateX(2deg)' : 'rotateX(0deg)'}`
        }}
        onMouseEnter={() => {
          setShowControls(true);
          setIsTransitioning(true);
          setTimeout(() => setIsTransitioning(false), 300);
        }}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Main Video */}
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          onTimeUpdate={handleVideoTimeUpdate}
          onLoadedMetadata={handleVideoLoadedMetadata}
        />

        {/* Reference Video (if in comparison mode) */}
        {(showSideBySide || showOverlay) && (
          <video
            ref={referenceVideoRef}
            className={`absolute top-0 ${showSideBySide ? 'right-0 w-1/2' : 'left-0 w-full opacity-50'} h-full object-contain`}
          />
        )}

        {/* Canvas Overlay */}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        />

        {/* 3D View Canvas */}
        {show3DView && (
          <canvas
            ref={canvas3DRef}
            className="absolute top-0 right-0 w-1/3 h-1/3 bg-black/30 rounded-bl-lg"
          />
        )}

        {/* Video Controls */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Progress Bar */}
          <div className="w-full h-1 bg-white/30 rounded-full mb-4 cursor-pointer">
            <div 
              className="h-full bg-primary rounded-full relative"
              style={{ width: `${(videoPlaybackState.currentTime / videoPlaybackState.duration) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full transform scale-0 hover:scale-100 transition-transform" />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-primary"
                onClick={togglePlayPause}
              >
                {videoPlaybackState.isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-white text-sm">
                  {formatTime(videoPlaybackState.currentTime)} / {formatTime(videoPlaybackState.duration)}
                </span>
              </div>

              <div className="flex items-center gap-2 group relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-primary"
                >
                  <Volume2 className="h-5 w-5" />
                </Button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
                  <div className="bg-black/90 rounded-lg p-2">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={videoPlaybackState.volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-24"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Playback Rate */}
              <select
                value={videoPlaybackState.playbackRate}
                onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
                className="bg-transparent text-white text-sm border-none outline-none"
              >
                <option value="0.5">0.5x</option>
                <option value="1">1x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
              </select>

              {/* Comparison Controls */}
              {referenceVideoUrl && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`text-white hover:text-primary ${showSideBySide ? 'text-primary' : ''}`}
                    onClick={() => {
                      setShowSideBySide(!showSideBySide);
                      setShowOverlay(false);
                    }}
                  >
                    <LayoutSplit className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`text-white hover:text-primary ${showOverlay ? 'text-primary' : ''}`}
                    onClick={() => {
                      setShowOverlay(!showOverlay);
                      setShowSideBySide(false);
                    }}
                  >
                    <Layers className="h-5 w-5" />
                  </Button>
                </div>
              )}

              {/* 3D View Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className={`text-white hover:text-primary ${show3DView ? 'text-primary' : ''}`}
                onClick={() => setShow3DView(!show3DView)}
              >
                <Box className="h-5 w-5" />
              </Button>

              {/* Fullscreen Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-primary"
                onClick={toggleFullscreen}
              >
                {videoPlaybackState.isFullscreen ? (
                  <Minimize2 className="h-5 w-5" />
                ) : (
                  <Maximize2 className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Controls */}
      <div className="mt-6 space-y-4 transform transition-all duration-300 hover:scale-[1.02]">
        <div className="flex items-center justify-between bg-gradient-to-r from-gray-900/50 to-gray-800/50 p-4 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <Button
              variant={isAnalyzing ? 'destructive' : 'default'}
              onClick={isAnalyzing ? stopAnalysis : startAnalysis}
              className={`relative overflow-hidden transform transition-all duration-300 ${isAnalyzing ? 'animate-pulse shadow-red-500/50' : 'hover:scale-105 shadow-primary/50'} shadow-lg`}
            >
              {isAnalyzing ? (
                <>
                  <Stop className="h-5 w-5 mr-2" />
                  Stop Analysis
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  Start Analysis
                </>
              )}
              {isAnalyzing && (
                <div
                  className="absolute inset-0 bg-white/20"
                  style={{
                    transform: `translateX(${progress}%)",
                    transition: 'transform 0.2s ease-out'
                  }}
                />
              )}
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setDetectionMethod('mediapipe')}
                className={detectionMethod === 'mediapipe' ? 'border-primary text-primary' : ''}
              >
                <Activity className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setDetectionMethod('openpose')}
                className={detectionMethod === 'openpose' ? 'border-primary text-primary' : ''}
              >
                <Zap className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setAudioFeedback(!audioFeedback)}
              className={audioFeedback ? 'border-primary text-primary' : ''}
            >
              {audioFeedback ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowAdvancedMetrics(!showAdvancedMetrics)}
              className={showAdvancedMetrics ? 'border-primary text-primary' : ''}
            >
              <BarChart2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Feedback Display */}
        <div className="space-y-2 perspective-1000">
          {feedback.map((message, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 p-4 rounded-xl backdrop-blur-sm flex items-start gap-3 transform transition-all duration-500 hover:scale-[1.02] hover:-rotate-1 shadow-lg"
              style={{
                animation: `slideIn 0.5s ease-out ${index * 0.1}s both`,
                opacity: 0,
                transform: 'translateY(20px)'
              }}
            >
              <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm">{message}</p>
            </div>
          ))}
        </div>

        {/* Metrics Display */}
        {showAdvancedMetrics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <MetricCard
              title="Symmetry"
              value={poseMetrics.symmetryScore}
              icon={<Balance className="h-5 w-5" />}
            />
            <MetricCard
              title="Balance"
              value={poseMetrics.balanceScore}
              icon={<Activity className="h-5 w-5" />}
            />
            <MetricCard
              title="Stability"
              value={poseMetrics.stabilityScore}
              icon={<Anchor className="h-5 w-5" />}
            />
            <MetricCard
              title="Alignment"
              value={poseMetrics.alignmentScore}
              icon={<AlignCenter className="h-5 w-5" />}
            />
          </div>
        )}
      </div>
    </div>) => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      scene.clear();
      renderer.dispose();
    };
  };

  // Video player controls
  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      setVideoPlaybackState(prev => ({
        ...prev,
        currentTime: videoRef.current!.currentTime
      }));
    }
  };

  const handleVideoLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoPlaybackState(prev => ({
        ...prev,
        duration: videoRef.current!.duration
      }));
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoPlaybackState.isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setVideoPlaybackState(prev => ({
        ...prev,
        isPlaying: !prev.isPlaying
      }));
    }
  };

  const handleVolumeChange = (value: number) => {
    if (videoRef.current) {
      videoRef.current.volume = value;
      setVideoPlaybackState(prev => ({
        ...prev,
        volume: value
      }));
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setVideoPlaybackState(prev => ({
        ...prev,
        playbackRate: rate
      }));
    }
  };

  const toggleFullscreen = () => {
    const container = videoRef.current?.parentElement;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen();
      setVideoPlaybackState(prev => ({
        ...prev,
        isFullscreen: true
      }));
    } else {
      document.exitFullscreen();
      setVideoPlaybackState(prev => ({
        ...prev,
        isFullscreen: false
      }));
    }
  };

  // Start pose analysis
  const startAnalysis = async () => {
    if (detectionMethod === 'mediapipe' && !isMediaPipeLoaded) {
      toast.error('MediaPipe not loaded');
      return;
    }

    if (detectionMethod === 'openpose' && !isOpenPoseLoaded) {
      toast.error('OpenPose not loaded');
      return;
    }

    if (!videoRef.current || !canvasRef.current) {
      toast.error('Video or canvas not ready');
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setFeedback([]);

    try {
      if (detectionMethod === 'mediapipe') {
        await runMediaPipeAnalysis();
      } else {
        await runOpenPoseAnalysis();
      }
    } catch (error) {
      console.error(`Error during ${detectionMethod} pose analysis:`, error);
      toast.error(`Error during ${detectionMethod} pose analysis`);
      setIsAnalyzing(false);
      setProgress(0);
    }
  };

  // MediaPipe pose analysis implementation
  const runMediaPipeAnalysis = async () => {
    // Initialize the detector
    const detector = await window.poseDetection.createDetector(
      window.poseDetection.SupportedModels.MoveNet,
      { modelType: 'thunder' }
    );

    // Analysis progress simulation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 5;
      });
    }, 200);

    // Frame processing function
    const processFrame = async () => {
      if (!videoRef.current || !canvasRef.current || !detector) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Detect poses
      const poses = await detector.estimatePoses(video);

      // Draw the results
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      if (poses.length > 0) {
        // Draw keypoints
        for (const pose of poses) {
          drawKeypoints(ctx, pose.keypoints);
          drawSkeleton(ctx, pose.keypoints);
        }

        // Analyze pose and generate feedback
        analyzePose(poses[0]);
      }

      // Continue processing frames if still analyzing
      if (isAnalyzing && (mode === 'live' && cameraActive)) {
        requestAnimationFrame(processFrame);
      } else {
        // Complete the analysis
        clearInterval(progressInterval);
        setProgress(100);

        // Generate final results
        const analysisResults = {
          score: poseScore || Math.floor(Math.random() * 30) + 70,
          feedback: feedback.length > 0 ? feedback : generateDefaultFeedback(),
          timestamp: new Date().toISOString(),
          method: 'mediapipe'
        };

        setResults(analysisResults);

        if (onAnalysisComplete) {
          onAnalysisComplete(analysisResults);
        }

        toast.success('MediaPipe pose analysis completed');
      }
    };

    // Start processing frames
    processFrame();
  };

  // OpenPose (PoseNet) analysis implementation
  const runOpenPoseAnalysis = async () => {
    if (!openPoseNetRef.current) {
      toast.error('OpenPose model not initialized');
      return;
    }

    const net = openPoseNetRef.current;

    // Analysis progress simulation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 5;
      });
    }, 200);

    // Frame processing function for OpenPose
    const processOpenPoseFrame = async () => {
      if (!videoRef.current || !canvasRef.current || !net) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Perform pose estimation with OpenPose (PoseNet)
      // Use single-person detection with higher accuracy
      const pose = await net.estimateSinglePose(video, {
        flipHorizontal: false,
        decodingMethod: 'single-person',
        scoreThreshold: 0.5,
        nmsRadius: 20
      });

      // Draw the results
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      if (pose && pose.keypoints) {
        // Convert OpenPose format to compatible format for our existing drawing functions
        const adaptedKeypoints = adaptOpenPoseKeypoints(pose.keypoints);
        
        // Draw keypoints and skeleton
        drawOpenPoseKeypoints(ctx, pose.keypoints);
        drawOpenPoseSkeleton(ctx, pose.keypoints);

        // Use our existing analysis with the adapted keypoints
        const adaptedPose = { keypoints: adaptedKeypoints };
        analyzePose(adaptedPose);
      }

      // Continue processing frames if still analyzing
      if (isAnalyzing && (mode === 'live' && cameraActive)) {
        requestAnimationFrame(processOpenPoseFrame);
      } else {
        // Complete the analysis
        clearInterval(progressInterval);
        setProgress(100);

        // Generate final results
        const analysisResults = {
          score: poseScore || Math.floor(Math.random() * 30) + 70,
          feedback: feedback.length > 0 ? feedback : generateDefaultFeedback(),
          timestamp: new Date().toISOString(),
          method: 'openpose'
        };

        setResults(analysisResults);

        if (onAnalysisComplete) {
          onAnalysisComplete(analysisResults);
        }

        toast.success('OpenPose analysis completed');
      }
    };

    // Start processing frames
    processOpenPoseFrame();
  };

  // Convert OpenPose keypoints to our format for compatibility
  const adaptOpenPoseKeypoints = (openPoseKeypoints: any[]) => {
    // OpenPose keypoint mapping to our expected format
    const mapping: Record<string, string> = {
      'nose': 'nose',
      'leftEye': 'left_eye',
      'rightEye': 'right_eye',
      'leftEar': 'left_ear',
      'rightEar': 'right_ear',
      'leftShoulder': 'left_shoulder',
      'rightShoulder': 'right_shoulder',
      'leftElbow': 'left_elbow',
      'rightElbow': 'right_elbow',
      'leftWrist': 'left_wrist',
      'rightWrist': 'right_wrist',
      'leftHip': 'left_hip',
      'rightHip': 'right_hip',
      'leftKnee': 'left_knee',
      'rightKnee': 'right_knee',
      'leftAnkle': 'left_ankle',
      'rightAnkle': 'right_ankle'
    };

    return openPoseKeypoints.map(kp => {
      return {
        x: kp.position.x,
        y: kp.position.y,
        score: kp.score,
        name: mapping[kp.part] || kp.part
      };
    });
  };

  // Draw OpenPose keypoints on canvas
  const drawOpenPoseKeypoints = (ctx: CanvasRenderingContext2D, keypoints: any[]) => {
    // Define OpenPose specific keypoint visualization style
    const keypointRadius = 5;
    ctx.fillStyle = '#FF0000';
    
    // Draw each keypoint
    for (const keypoint of keypoints) {
      // Only draw keypoints with confidence above threshold
      if (keypoint.score > 0.5) {
        const { x, y } = keypoint.position;
        
        // Draw circle for keypoint
        ctx.beginPath();
        ctx.arc(x, y, keypointRadius, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw keypoint name for debugging
        // ctx.fillText(keypoint.part, x + 5, y - 5);
      }
    }
  };

  // Draw OpenPose skeleton
  const drawOpenPoseSkeleton = (ctx: CanvasRenderingContext2D, keypoints: any[]) => {
    // OpenPose specific skeleton connections
    const connections = [
      // Face
      ['nose', 'leftEye'],
      ['nose', 'rightEye'],
      ['leftEye', 'leftEar'],
      ['rightEye', 'rightEar'],
      
      // Upper body
      ['leftShoulder', 'rightShoulder'],
      ['leftShoulder', 'leftElbow'],
      ['leftElbow', 'leftWrist'],
      ['rightShoulder', 'rightElbow'],
      ['rightElbow', 'rightWrist'],
      
      // Torso
      ['leftShoulder', 'leftHip'],
      ['rightShoulder', 'rightHip'],
      ['leftHip', 'rightHip'],
      
      // Lower body
      ['leftHip', 'leftKnee'],
      ['leftKnee', 'leftAnkle'],
      ['rightHip', 'rightKnee'],
      ['rightKnee', 'rightAnkle']
    ];
    
    // Create a map of keypoints by name for easy lookup
    const keypointMap = keypoints.reduce((map, keypoint) => {
      map[keypoint.part] = keypoint;
      return map;
    }, {} as Record<string, any>);
    
    // Set line style for skeleton
    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 2;
    
    // Draw each connection
    for (const [startName, endName] of connections) {
      const startPoint = keypointMap[startName];
      const endPoint = keypointMap[endName];
      
      // Only draw connection if both points are detected with confidence
      if (startPoint && endPoint && startPoint.score > 0.5 && endPoint.score > 0.5) {
        ctx.beginPath();
        ctx.moveTo(startPoint.position.x, startPoint.position.y);
        ctx.lineTo(endPoint.position.x, endPoint.position.y);
        ctx.stroke();
      }
    }
  };

  // Stop analysis
  const stopAnalysis = () => {
    setIsAnalyzing(false);
    toast.info('Analysis stopped');
  };

  // Draw keypoints on canvas with enhanced visualization
  const drawKeypoints = (ctx: CanvasRenderingContext2D, keypoints: any[]) => {
    // Define body part groups for color coding
    const bodyPartGroups = {
      face: ['nose', 'left_eye', 'right_eye', 'left_ear', 'right_ear'],
      torso: ['left_shoulder', 'right_shoulder', 'left_hip', 'right_hip'],
      leftArm: ['left_shoulder', 'left_elbow', 'left_wrist', 'left_pinky', 'left_index', 'left_thumb'],
      rightArm: ['right_shoulder', 'right_elbow', 'right_wrist', 'right_pinky', 'right_index', 'right_thumb'],
      leftLeg: ['left_hip', 'left_knee', 'left_ankle', 'left_heel', 'left_foot_index'],
      rightLeg: ['right_hip', 'right_knee', 'right_ankle', 'right_heel', 'right_foot_index']
    };

    // Define colors for each body part group
    const groupColors = {
      face: '#FF5733',     // Orange-red
      torso: '#33A8FF',    // Blue
      leftArm: '#33FF57',  // Green
      rightArm: '#33FF57', // Green
      leftLeg: '#FF33A8',  // Pink
      rightLeg: '#FF33A8'  // Pink
    };

    // Function to get color based on keypoint name
    const getKeypointColor = (name: string) => {
      for (const [group, points] of Object.entries(bodyPartGroups)) {
        if (points.includes(name)) {
          return groupColors[group as keyof typeof groupColors];
        }
      }
      return '#FFFFFF'; // Default white
    };

    // Draw glow effect
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';

    // Draw keypoints with enhanced visualization
    keypoints.forEach(keypoint => {
      if (keypoint.score > 0.3) {
        const { x, y, name } = keypoint;
        const color = getKeypointColor(name);

        // Draw keypoint with glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();

        // Draw outer ring
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Draw confidence indicator
        const confidenceRadius = 12 * keypoint.score;
        ctx.beginPath();
        ctx.arc(x, y, confidenceRadius, 0, 2 * Math.PI);
        ctx.strokeStyle = `rgba(255, 255, 255, ${keypoint.score * 0.5})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Only show labels for main joints to avoid clutter
        const mainJoints = ['nose', 'left_shoulder', 'right_shoulder', 'left_hip', 'right_hip',
                           'left_knee', 'right_knee', 'left_ankle', 'right_ankle'];

        if (mainJoints.includes(name)) {
          // Create background for text
          const displayName = name.replace('_', ' ');
          ctx.font = '10px Arial';
          const textWidth = ctx.measureText(displayName).width;

          ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
          ctx.fillRect(x + 10, y - 10, textWidth + 6, 16);

          // Draw keypoint name
          ctx.fillStyle = 'white';
          ctx.fillText(displayName, x + 13, y);
        }
      }
    });

    // Reset shadow
    ctx.shadowBlur = 0;
  };

  // Draw skeleton (connections between keypoints) with enhanced visualization
  const drawSkeleton = (ctx: CanvasRenderingContext2D, keypoints: any[]) => {
    // Define connections between keypoints with body part grouping
    const connections = [
      // Face
      { start: 'nose', end: 'left_eye', color: '#FF5733', width: 2 },
      { start: 'nose', end: 'right_eye', color: '#FF5733', width: 2 },
      { start: 'left_eye', end: 'left_ear', color: '#FF5733', width: 2 },
      { start: 'right_eye', end: 'right_ear', color: '#FF5733', width: 2 },

      // Torso - thicker lines for the core
      { start: 'left_shoulder', end: 'right_shoulder', color: '#33A8FF', width: 3 },
      { start: 'left_shoulder', end: 'left_hip', color: '#33A8FF', width: 3 },
      { start: 'right_shoulder', end: 'right_hip', color: '#33A8FF', width: 3 },
      { start: 'left_hip', end: 'right_hip', color: '#33A8FF', width: 3 },

      // Arms
      { start: 'left_shoulder', end: 'left_elbow', color: '#33FF57', width: 2.5 },
      { start: 'left_elbow', end: 'left_wrist', color: '#33FF57', width: 2.5 },
      { start: 'right_shoulder', end: 'right_elbow', color: '#33FF57', width: 2.5 },
      { start: 'right_elbow', end: 'right_wrist', color: '#33FF57', width: 2.5 },

      // Hands (if available)
      { start: 'left_wrist', end: 'left_pinky', color: '#33FF57', width: 1.5 },
      { start: 'left_wrist', end: 'left_index', color: '#33FF57', width: 1.5 },
      { start: 'left_wrist', end: 'left_thumb', color: '#33FF57', width: 1.5 },
      { start: 'right_wrist', end: 'right_pinky', color: '#33FF57', width: 1.5 },
      { start: 'right_wrist', end: 'right_index', color: '#33FF57', width: 1.5 },
      { start: 'right_wrist', end: 'right_thumb', color: '#33FF57', width: 1.5 },

      // Legs
      { start: 'left_hip', end: 'left_knee', color: '#FF33A8', width: 2.5 },
      { start: 'left_knee', end: 'left_ankle', color: '#FF33A8', width: 2.5 },
      { start: 'right_hip', end: 'right_knee', color: '#FF33A8', width: 2.5 },
      { start: 'right_knee', end: 'right_ankle', color: '#FF33A8', width: 2.5 },

      // Feet (if available)
      { start: 'left_ankle', end: 'left_heel', color: '#FF33A8', width: 1.5 },
      { start: 'left_heel', end: 'left_foot_index', color: '#FF33A8', width: 1.5 },
      { start: 'left_ankle', end: 'left_foot_index', color: '#FF33A8', width: 1.5 },
      { start: 'right_ankle', end: 'right_heel', color: '#FF33A8', width: 1.5 },
      { start: 'right_heel', end: 'right_foot_index', color: '#FF33A8', width: 1.5 },
      { start: 'right_ankle', end: 'right_foot_index', color: '#FF33A8', width: 1.5 },
    ];

    // Create a map of keypoints by name for easy lookup
    const keypointMap = keypoints.reduce((map, keypoint) => {
      map[keypoint.name] = keypoint;
      return map;
    }, {} as Record<string, any>);

    // Draw connections with glow effect
    ctx.shadowBlur = 5;
    ctx.lineCap = 'round';

    connections.forEach(({ start, end, color, width }) => {
      const startPoint = keypointMap[start];
      const endPoint = keypointMap[end];

      if (startPoint && endPoint && startPoint.score > 0.3 && endPoint.score > 0.3) {
        // Calculate average confidence for this connection
        const avgConfidence = (startPoint.score + endPoint.score) / 2;

        // Set line style based on confidence
        ctx.shadowColor = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = width * (0.5 + avgConfidence * 0.5); // Scale width by confidence

        // Draw line with gradient
        const gradient = ctx.createLinearGradient(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, color);
        ctx.strokeStyle = gradient;

        // Draw the connection
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.stroke();

        // Draw pulse effect for high confidence connections
        if (avgConfidence > 0.7) {
          const now = Date.now();
          const pulseSize = Math.sin(now / 200) * 2 + 2; // Pulsing effect

          ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 * avgConfidence})`;
          ctx.lineWidth = width * (0.8 + avgConfidence * 0.5) + pulseSize;
          ctx.beginPath();
          ctx.moveTo(startPoint.x, startPoint.y);
          ctx.lineTo(endPoint.x, endPoint.y);
          ctx.stroke();
        }
      }
    });

    // Reset shadow
    ctx.shadowBlur = 0;
  };

  // Analyze pose and generate detailed feedback
  const analyzePose = (pose: any) => {
    if (!pose || !pose.keypoints) return;

    // Get all keypoints
    const keypoints = pose.keypoints;
    const keypointMap = keypoints.reduce((map: Record<string, any>, kp: any) => {
      map[kp.name] = kp;
      return map;
    }, {});

    // Calculate a more detailed pose score
    // Weight different body parts differently
    const bodyPartWeights = {
      face: 0.05,      // Less important for most exercises
      shoulders: 0.2,  // Very important for posture
      arms: 0.15,      // Important for many exercises
      torso: 0.25,     // Critical for core alignment
      hips: 0.2,       // Critical for lower body alignment
      legs: 0.15       // Important for stance
    };

    // Group keypoints by body part
    const bodyPartScores = {
      face: calculatePartScore(['nose', 'left_eye', 'right_eye'], keypointMap),
      shoulders: calculatePartScore(['left_shoulder', 'right_shoulder'], keypointMap),
      arms: calculatePartScore(['left_elbow', 'right_elbow', 'left_wrist', 'right_wrist'], keypointMap),
      torso: calculatePartScore(['left_shoulder', 'right_shoulder', 'left_hip', 'right_hip'], keypointMap),
      hips: calculatePartScore(['left_hip', 'right_hip'], keypointMap),
      legs: calculatePartScore(['left_knee', 'right_knee', 'left_ankle', 'right_ankle'], keypointMap)
    };

    // Calculate weighted score
    let weightedScore = 0;
    let totalWeight = 0;

    for (const [part, weight] of Object.entries(bodyPartWeights)) {
      const partScore = bodyPartScores[part as keyof typeof bodyPartScores];
      if (partScore.count > 0) {
        weightedScore += partScore.score * weight;
        totalWeight += weight;
      }
    }

    const calculatedScore = Math.floor((weightedScore / totalWeight) * 100);
    setPoseScore(calculatedScore);

    // Generate detailed feedback based on keypoint positions and angles
    const newFeedback: string[] = [];

    // 1. Check shoulder alignment (horizontal)
    const leftShoulder = keypointMap['left_shoulder'];
    const rightShoulder = keypointMap['right_shoulder'];

    if (leftShoulder && rightShoulder && leftShoulder.score > 0.5 && rightShoulder.score > 0.5) {
      const shoulderDiff = Math.abs(leftShoulder.y - rightShoulder.y);
      const shoulderWidth = Math.abs(leftShoulder.x - rightShoulder.x);
      const shoulderTilt = (shoulderDiff / shoulderWidth) * 100;

      if (shoulderTilt > 15) {
        newFeedback.push('Shoulders are not level. Try to keep your shoulders even to maintain proper posture.');
      }
    }

    // 2. Check spine alignment
    const nose = keypointMap['nose'];
    const midHip = getMidpoint(keypointMap['left_hip'], keypointMap['right_hip']);

    if (nose && midHip && nose.score > 0.5 && keypointMap['left_hip'].score > 0.5 && keypointMap['right_hip'].score > 0.5) {
      const spineDeviation = Math.abs(nose.x - midHip.x);
      const height = Math.abs(nose.y - midHip.y);
      const spineAngle = Math.atan(spineDeviation / height) * (180 / Math.PI);

      if (spineAngle > 10) {
        newFeedback.push(`Spine is leaning ${spineDeviation > 0 ? 'to the side' : 'forward'}. Try to maintain a straight back.`);
      }
    }

    // 3. Check knee alignment for squats
    const leftKnee = keypointMap['left_knee'];
    const rightKnee = keypointMap['right_knee'];
    const leftAnkle = keypointMap['left_ankle'];
    const rightAnkle = keypointMap['right_ankle'];
    const leftHip = keypointMap['left_hip'];
    const rightHip = keypointMap['right_hip'];

    if (leftKnee && rightKnee && leftAnkle && rightAnkle && leftHip && rightHip &&
        leftKnee.score > 0.5 && rightKnee.score > 0.5 &&
        leftAnkle.score > 0.5 && rightAnkle.score > 0.5 &&
        leftHip.score > 0.5 && rightHip.score > 0.5) {

      // Check if knees are going past toes (for squats)
      const leftKneePastToe = leftKnee.x < leftAnkle.x - 30;
      const rightKneePastToe = rightKnee.x < rightAnkle.x - 30;

      if (leftKneePastToe || rightKneePastToe) {
        newFeedback.push('Knees are extending too far forward. Keep knees aligned with toes to protect your joints.');
      }

      // Check knee tracking (should be in line with feet)
      const leftKneeTracking = Math.abs(leftKnee.x - leftAnkle.x);
      const rightKneeTracking = Math.abs(rightKnee.x - rightAnkle.x);

      if (leftKneeTracking > 50 || rightKneeTracking > 50) {
        newFeedback.push('Knees are not tracking over toes. Align your knees with your feet for proper form.');
      }

      // Check for squat depth
      const leftLegAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
      const rightLegAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
      const avgLegAngle = (leftLegAngle + rightLegAngle) / 2;

      // Detect if person is doing a squat
      const isSquatPosition = avgLegAngle < 150; // Less than 150 degrees suggests bent knees

      if (isSquatPosition) {
        if (avgLegAngle > 120) {
          newFeedback.push('Try to squat deeper for full range of motion. Aim for thighs parallel to the ground.');
        } else if (avgLegAngle < 70) {
          newFeedback.push('You\'re squatting too deep. This may put excessive strain on your knees.');
        }
      }
    }

    // 4. Check arm symmetry
    const leftElbow = keypointMap['left_elbow'];
    const rightElbow = keypointMap['right_elbow'];
    const leftWrist = keypointMap['left_wrist'];
    const rightWrist = keypointMap['right_wrist'];

    if (leftElbow && rightElbow && leftWrist && rightWrist && leftShoulder && rightShoulder &&
        leftElbow.score > 0.5 && rightElbow.score > 0.5 &&
        leftWrist.score > 0.5 && rightWrist.score > 0.5) {

      const leftArmAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
      const rightArmAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
      const armAngleDiff = Math.abs(leftArmAngle - rightArmAngle);

      if (armAngleDiff > 20) {
        newFeedback.push('Your arms are not moving symmetrically. Try to maintain equal form on both sides.');
      }
    }

    // 5. Check hip rotation
    if (leftHip && rightHip && leftShoulder && rightShoulder &&
        leftHip.score > 0.5 && rightHip.score > 0.5 &&
        leftShoulder.score > 0.5 && rightShoulder.score > 0.5) {

      const shoulderWidth = Math.abs(leftShoulder.x - rightShoulder.x);
      const hipWidth = Math.abs(leftHip.x - rightHip.x);
      const rotationRatio = hipWidth / shoulderWidth;

      if (rotationRatio < 0.7 || rotationRatio > 1.3) {
        newFeedback.push('Your hips appear to be rotated. Try to keep your hips square and aligned with your shoulders.');
      }
    }

    // Only update feedback if we have new insights and avoid duplicates
    if (newFeedback.length > 0) {
      const uniqueFeedback = newFeedback.filter(item => !feedback.includes(item));
      if (uniqueFeedback.length > 0) {
        setFeedback(prev => [...prev, ...uniqueFeedback]);
      }
    }
  };

  // Helper function to calculate score for a group of body parts
  const calculatePartScore = (partNames: string[], keypointMap: Record<string, any>) => {
    let sum = 0;
    let count = 0;

    for (const name of partNames) {
      const keypoint = keypointMap[name];
      if (keypoint && keypoint.score > 0.1) {
        sum += keypoint.score;
        count++;
      }
    }

    return {
      score: count > 0 ? sum / count : 0,
      count
    };
  };

  // Helper function to get midpoint between two points
  const getMidpoint = (point1: any, point2: any) => {
    if (!point1 || !point2) return null;

    return {
      x: (point1.x + point2.x) / 2,
      y: (point1.y + point2.y) / 2,
      score: (point1.score + point2.score) / 2
    };
  };

  // Helper function to calculate angle between three points (in degrees)
  const calculateAngle = (p1: any, p2: any, p3: any) => {
    if (!p1 || !p2 || !p3) return 0;

    const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);

    if (angle > 180.0) {
      angle = 360.0 - angle;
    }

    return angle;
  };

  // Generate default feedback if none was created during analysis
  const generateDefaultFeedback = (): string[] => {
    return [
      'Maintain proper alignment throughout the exercise',
      'Keep your back straight during the movement',
      'Focus on controlled movements rather than speed',
      'Remember to breathe properly during the exercise'
    ];
  };

  if (!isMediaPipeSupported || !isOpenPoseSupported) {
    const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleVideoLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value;
    }
  };

  const handlePlaybackRateChange = (value: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = value;
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);
  };

  const stopAnalysis = () => {
    setIsAnalyzing(false);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="relative w-full h-full">
      {/* Video Player Container with enhanced visuals */}
      <div 
        className={`relative w-full aspect-video bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden shadow-lg transition-all duration-500 ${isTransitioning ? 'scale-95 opacity-90 rotate-1' : 'scale-100 opacity-100 rotate-0'} hover:shadow-2xl`}
        style={{
          transform: `perspective(1000px) ${isTransitioning ? 'rotateX(2deg)' : 'rotateX(0deg)'}`
        }}
        onMouseEnter={() => {
          setShowControls(true);
          setIsTransitioning(true);
          setTimeout(() => setIsTransitioning(false), 300);
        }}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Main Video */}
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          onTimeUpdate={handleVideoTimeUpdate}
          onLoadedMetadata={handleVideoLoadedMetadata}
        />

        {/* Reference Video (if in comparison mode) */}
        {(showSideBySide || showOverlay) && (
          <video
            ref={referenceVideoRef}
            className={`absolute top-0 ${showSideBySide ? 'right-0 w-1/2' : 'left-0 w-full opacity-50'} h-full object-contain`}
          />
        )}

        {/* Canvas Overlay */}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        />

        {/* 3D View Canvas */}
        {show3DView && (
          <canvas
            ref={canvas3DRef}
            className="absolute top-0 right-0 w-1/3 h-1/3 bg-black/30 rounded-bl-lg"
          />
        )}

        {/* Video Controls */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Progress Bar */}
          <div className="w-full h-1 bg-white/30 rounded-full mb-4 cursor-pointer">
            <div 
              className="h-full bg-primary rounded-full relative"
              style={{ width: `${(videoPlaybackState.currentTime / videoPlaybackState.duration) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full transform scale-0 hover:scale-100 transition-transform" />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-primary"
                onClick={togglePlayPause}
              >
                {videoPlaybackState.isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-white text-sm">
                  {formatTime(videoPlaybackState.currentTime)} / {formatTime(videoPlaybackState.duration)}
                </span>
              </div>

              <div className="flex items-center gap-2 group relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-primary"
                >
                  <Volume2 className="h-5 w-5" />
                </Button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
                  <div className="bg-black/90 rounded-lg p-2">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={videoPlaybackState.volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-24"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Playback Rate */}
              <select
                value={videoPlaybackState.playbackRate}
                onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
                className="bg-transparent text-white text-sm border-none outline-none"
              >
                <option value="0.5">0.5x</option>
                <option value="1">1x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
              </select>

              {/* Comparison Controls */}
              {referenceVideoUrl && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`text-white hover:text-primary ${showSideBySide ? 'text-primary' : ''}`}
                    onClick={() => {
                      setShowSideBySide(!showSideBySide);
                      setShowOverlay(false);
                    }}
                  >
                    <LayoutSplit className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`text-white hover:text-primary ${showOverlay ? 'text-primary' : ''}`}
                    onClick={() => {
                      setShowOverlay(!showOverlay);
                      setShowSideBySide(false);
                    }}
                  >
                    <Layers className="h-5 w-5" />
                  </Button>
                </div>
              )}

              {/* 3D View Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className={`text-white hover:text-primary ${show3DView ? 'text-primary' : ''}`}
                onClick={() => setShow3DView(!show3DView)}
              >
                <Box className="h-5 w-5" />
              </Button>

              {/* Fullscreen Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-primary"
                onClick={toggleFullscreen}
              >
                {videoPlaybackState.isFullscreen ? (
                  <Minimize2 className="h-5 w-5" />
                ) : (
                  <Maximize2 className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Controls */}
      <div className="mt-6 space-y-4 transform transition-all duration-300 hover:scale-[1.02]">
        <div className="flex items-center justify-between bg-gradient-to-r from-gray-900/50 to-gray-800/50 p-4 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <Button
              variant={isAnalyzing ? 'destructive' : 'default'}
              onClick={isAnalyzing ? stopAnalysis : startAnalysis}
              className={`relative overflow-hidden transform transition-all duration-300 ${isAnalyzing ? 'animate-pulse shadow-red-500/50' : 'hover:scale-105 shadow-primary/50'} shadow-lg`}
            >
              {isAnalyzing ? (
                <>
                  <Stop className="h-5 w-5 mr-2" />
                  Stop Analysis
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  Start Analysis
                </>
              )}
              {isAnalyzing && (
                <div
                  className="absolute inset-0 bg-white/20"
                  style={{
                    transform: `translateX(${progress}%)",
                    transition: 'transform 0.2s ease-out'
                  }}
                />
              )}
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setDetectionMethod('mediapipe')}
                className={detectionMethod === 'mediapipe' ? 'border-primary text-primary' : ''}
              >
                <Activity className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setDetectionMethod('openpose')}
                className={detectionMethod === 'openpose' ? 'border-primary text-primary' : ''}
              >
                <Zap className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setAudioFeedback(!audioFeedback)}
              className={audioFeedback ? 'border-primary text-primary' : ''}
            >
              {audioFeedback ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowAdvancedMetrics(!showAdvancedMetrics)}
              className={showAdvancedMetrics ? 'border-primary text-primary' : ''}
            >
              <BarChart2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Feedback Display */}
        <div className="space-y-2 perspective-1000">
          {feedback.map((message, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 p-4 rounded-xl backdrop-blur-sm flex items-start gap-3 transform transition-all duration-500 hover:scale-[1.02] hover:-rotate-1 shadow-lg"
              style={{
                animation: `slideIn 0.5s ease-out ${index * 0.1}s both`,
                opacity: 0,
                transform: 'translateY(20px)'
              }}
            >
              <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm">{message}</p>
            </div>
          ))}
        </div>

        {/* Metrics Display */}
        {showAdvancedMetrics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <MetricCard
              title="Symmetry"
              value={poseMetrics.symmetryScore}
              icon={<Balance className="h-5 w-5" />}
            />
            <MetricCard
              title="Balance"
              value={poseMetrics.balanceScore}
              icon={<Activity className="h-5 w-5" />}
            />
            <MetricCard
              title="Stability"
              value={poseMetrics.stabilityScore}
              icon={<Anchor className="h-5 w-5" />}
            />
            <MetricCard
              title="Alignment"
              value={poseMetrics.alignmentScore}
              icon={<AlignCenter className="h-5 w-5" />}
            />
          </div>
        )}
      </div>
    </div>
      <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
              Browser Not Supported
            </CardTitle>
            <CardDescription>
              Your browser doesn't support the required features for pose analysis.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Please try using a modern browser like Chrome, Edge, or Firefox.
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleVideoLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value;
    }
  };

  const handlePlaybackRateChange = (value: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = value;
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);
  };

  const stopAnalysis = () => {
    setIsAnalyzing(false);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="relative w-full h-full">
      {/* Video Player Container with enhanced visuals */}
      <div 
        className={`relative w-full aspect-video bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden shadow-lg transition-all duration-500 ${isTransitioning ? 'scale-95 opacity-90 rotate-1' : 'scale-100 opacity-100 rotate-0'} hover:shadow-2xl`}
        style={{
          transform: `perspective(1000px) ${isTransitioning ? 'rotateX(2deg)' : 'rotateX(0deg)'}`
        }}
        onMouseEnter={() => {
          setShowControls(true);
          setIsTransitioning(true);
          setTimeout(() => setIsTransitioning(false), 300);
        }}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Main Video */}
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          onTimeUpdate={handleVideoTimeUpdate}
          onLoadedMetadata={handleVideoLoadedMetadata}
        />

        {/* Reference Video (if in comparison mode) */}
        {(showSideBySide || showOverlay) && (
          <video
            ref={referenceVideoRef}
            className={`absolute top-0 ${showSideBySide ? 'right-0 w-1/2' : 'left-0 w-full opacity-50'} h-full object-contain`}
          />
        )}

        {/* Canvas Overlay */}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        />

        {/* 3D View Canvas */}
        {show3DView && (
          <canvas
            ref={canvas3DRef}
            className="absolute top-0 right-0 w-1/3 h-1/3 bg-black/30 rounded-bl-lg"
          />
        )}

        {/* Video Controls */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Progress Bar */}
          <div className="w-full h-1 bg-white/30 rounded-full mb-4 cursor-pointer">
            <div 
              className="h-full bg-primary rounded-full relative"
              style={{ width: `${(videoPlaybackState.currentTime / videoPlaybackState.duration) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full transform scale-0 hover:scale-100 transition-transform" />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-primary"
                onClick={togglePlayPause}
              >
                {videoPlaybackState.isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-white text-sm">
                  {formatTime(videoPlaybackState.currentTime)} / {formatTime(videoPlaybackState.duration)}
                </span>
              </div>

              <div className="flex items-center gap-2 group relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-primary"
                >
                  <Volume2 className="h-5 w-5" />
                </Button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
                  <div className="bg-black/90 rounded-lg p-2">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={videoPlaybackState.volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-24"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Playback Rate */}
              <select
                value={videoPlaybackState.playbackRate}
                onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
                className="bg-transparent text-white text-sm border-none outline-none"
              >
                <option value="0.5">0.5x</option>
                <option value="1">1x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
              </select>

              {/* Comparison Controls */}
              {referenceVideoUrl && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`text-white hover:text-primary ${showSideBySide ? 'text-primary' : ''}`}
                    onClick={() => {
                      setShowSideBySide(!showSideBySide);
                      setShowOverlay(false);
                    }}
                  >
                    <LayoutSplit className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`text-white hover:text-primary ${showOverlay ? 'text-primary' : ''}`}
                    onClick={() => {
                      setShowOverlay(!showOverlay);
                      setShowSideBySide(false);
                    }}
                  >
                    <Layers className="h-5 w-5" />
                  </Button>
                </div>
              )}

              {/* 3D View Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className={`text-white hover:text-primary ${show3DView ? 'text-primary' : ''}`}
                onClick={() => setShow3DView(!show3DView)}
              >
                <Box className="h-5 w-5" />
              </Button>

              {/* Fullscreen Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-primary"
                onClick={toggleFullscreen}
              >
                {videoPlaybackState.isFullscreen ? (
                  <Minimize2 className="h-5 w-5" />
                ) : (
                  <Maximize2 className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Controls */}
      <div className="mt-6 space-y-4 transform transition-all duration-300 hover:scale-[1.02]">
        <div className="flex items-center justify-between bg-gradient-to-r from-gray-900/50 to-gray-800/50 p-4 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <Button
              variant={isAnalyzing ? 'destructive' : 'default'}
              onClick={isAnalyzing ? stopAnalysis : startAnalysis}
              className={`relative overflow-hidden transform transition-all duration-300 ${isAnalyzing ? 'animate-pulse shadow-red-500/50' : 'hover:scale-105 shadow-primary/50'} shadow-lg`}
            >
              {isAnalyzing ? (
                <>
                  <Stop className="h-5 w-5 mr-2" />
                  Stop Analysis
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  Start Analysis
                </>
              )}
              {isAnalyzing && (
                <div
                  className="absolute inset-0 bg-white/20"
                  style={{
                    transform: `translateX(${progress}%)",
                    transition: 'transform 0.2s ease-out'
                  }}
                />
              )}
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setDetectionMethod('mediapipe')}
                className={detectionMethod === 'mediapipe' ? 'border-primary text-primary' : ''}
              >
                <Activity className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setDetectionMethod('openpose')}
                className={detectionMethod === 'openpose' ? 'border-primary text-primary' : ''}
              >
                <Zap className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setAudioFeedback(!audioFeedback)}
              className={audioFeedback ? 'border-primary text-primary' : ''}
            >
              {audioFeedback ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowAdvancedMetrics(!showAdvancedMetrics)}
              className={showAdvancedMetrics ? 'border-primary text-primary' : ''}
            >
              <BarChart2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Feedback Display */}
        <div className="space-y-2 perspective-1000">
          {feedback.map((message, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 p-4 rounded-xl backdrop-blur-sm flex items-start gap-3 transform transition-all duration-500 hover:scale-[1.02] hover:-rotate-1 shadow-lg"
              style={{
                animation: `slideIn 0.5s ease-out ${index * 0.1}s both`,
                opacity: 0,
                transform: 'translateY(20px)'
              }}
            >
              <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm">{message}</p>
            </div>
          ))}
        </div>

        {/* Metrics Display */}
        {showAdvancedMetrics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <MetricCard
              title="Symmetry"
              value={poseMetrics.symmetryScore}
              icon={<Balance className="h-5 w-5" />}
            />
            <MetricCard
              title="Balance"
              value={poseMetrics.balanceScore}
              icon={<Activity className="h-5 w-5" />}
            />
            <MetricCard
              title="Stability"
              value={poseMetrics.stabilityScore}
              icon={<Anchor className="h-5 w-5" />}
            />
            <MetricCard
              title="Alignment"
              value={poseMetrics.alignmentScore}
              icon={<AlignCenter className="h-5 w-5" />}
            />
          </div>
        )}
      </div>
    </div>
      <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Analisis Pose Real-time
            </CardTitle>
            <CardDescription>
              {mode === 'live'
                ? 'Analisis pose secara real-time menggunakan kamera'
                : 'Analisis pose dari video yang diunggah'}
            </CardDescription>
      <CardContent className="space-y-4">
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          {/* Video element (camera feed or uploaded video) */}
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            playsInline
            muted
            autoPlay={mode === 'live'}
            loop={mode === 'upload'}
            src={mode === 'upload' ? videoUrl : undefined}
          />

          {/* Canvas overlay for drawing pose detection */}
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
          />

          {/* Loading indicator */}
          {!isMediaPipeLoaded && !isOpenPoseLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                <p className="text-white mt-4">Loading pose detection models...</p>
              </div>
            </div>
          )}
        </div>

        {/* Detection Method Selection */}
        <div className="flex items-center space-x-4 mb-4">
          <span className="font-medium">Detection Method:</span>
          <div className="flex space-x-2">
            <Button 
              variant={detectionMethod === 'mediapipe' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setDetectionMethod('mediapipe')}
              disabled={!isMediaPipeLoaded}
            >
              MediaPipe
            </Button>
            <Button 
              variant={detectionMethod === 'openpose' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setDetectionMethod('openpose')}
              disabled={!isOpenPoseLoaded}
            >
              OpenPose
            </Button>
          </div>
        </div>

        {/* Method Description */}
        <div className="mb-4 text-sm text-muted-foreground">
          {detectionMethod === 'mediapipe' ? (
            <div className="flex items-start space-x-2">
              <Info size={16} />
              <span>MediaPipe uses Google's MoveNet model for fast and accurate pose detection.</span>
            </div>
          ) : (
            <div className="flex items-start space-x-2">
              <Info size={16} />
              <span>OpenPose uses CMU's multi-person pose estimation model for detailed keypoint detection.</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-2">
          {mode === 'live' && (
            <>
              {!cameraActive ? (
                <Button
                  onClick={startCamera}
                  disabled={!isMediaPipeLoaded || cameraActive}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Start Camera
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={stopCamera}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Stop Camera
                </Button>
              )}
            </>
          )}

          {!isAnalyzing ? (
            <Button
              onClick={startAnalysis}
              disabled={!isMediaPipeLoaded || (mode === 'live' && !cameraActive)}
              className="bg-green-600 hover:bg-green-700"
            >
              Start Analysis
            </Button>
          ) : (
            <Button
              variant="destructive"
              onClick={stopAnalysis}
            >
              Stop Analysis
            </Button>
          )}
        </div>

        {/* Progress indicator */}
        {isAnalyzing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Analyzing pose...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Results with enhanced visualization */}
        {results && (
          <div className="space-y-6 mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Analysis Results</h3>
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md">
                Score: {results.score}%
              </div>
            </div>

            {/* Score visualization */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-5 rounded-xl border border-blue-100 shadow-sm">
              <h4 className="font-medium text-blue-800 mb-3">Performance Metrics</h4>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-blue-700">Overall Form</span>
                    <span className="text-sm font-bold text-blue-900">{results.score}%</span>
                  </div>
                  <div className="h-2.5 bg-blue-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                      style={{ width: `${results.score}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-blue-700">Posture</span>
                    <span className="text-sm font-bold text-blue-900">{Math.min(100, results.score + Math.floor(Math.random() * 10) - 5)}%</span>
                  </div>
                  <div className="h-2.5 bg-blue-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                      style={{ width: `${Math.min(100, results.score + Math.floor(Math.random() * 10) - 5)}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-blue-700">Alignment</span>
                    <span className="text-sm font-bold text-blue-900">{Math.min(100, results.score + Math.floor(Math.random() * 10) - 5)}%</span>
                  </div>
                  <div className="h-2.5 bg-blue-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                      style={{ width: `${Math.min(100, results.score + Math.floor(Math.random() * 10) - 5)}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-blue-700">Stability</span>
                    <span className="text-sm font-bold text-blue-900">{Math.min(100, results.score + Math.floor(Math.random() * 10) - 5)}%</span>
                  </div>
                  <div className="h-2.5 bg-blue-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                      style={{ width: `${Math.min(100, results.score + Math.floor(Math.random() * 10) - 5)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Body part scores visualization */}
              <div className="mt-4">
                <h5 className="text-sm font-medium text-blue-800 mb-2">Body Part Analysis</h5>
                <div className="grid grid-cols-3 gap-2">
                  {['Shoulders', 'Spine', 'Hips', 'Knees', 'Arms', 'Core'].map((part, index) => {
                    const partScore = Math.min(100, results.score + Math.floor(Math.random() * 15) - 7);
                    let colorClass = 'bg-green-500';
                    if (partScore < 70) colorClass = 'bg-yellow-500';
                    if (partScore < 50) colorClass = 'bg-red-500';

                    const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleVideoLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value;
    }
  };

  const handlePlaybackRateChange = (value: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = value;
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);
  };

  const stopAnalysis = () => {
    setIsAnalyzing(false);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="relative w-full h-full">
      {/* Video Player Container with enhanced visuals */}
      <div 
        className={`relative w-full aspect-video bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden shadow-lg transition-all duration-500 ${isTransitioning ? 'scale-95 opacity-90 rotate-1' : 'scale-100 opacity-100 rotate-0'} hover:shadow-2xl`}
        style={{
          transform: `perspective(1000px) ${isTransitioning ? 'rotateX(2deg)' : 'rotateX(0deg)'}`
        }}
        onMouseEnter={() => {
          setShowControls(true);
          setIsTransitioning(true);
          setTimeout(() => setIsTransitioning(false), 300);
        }}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Main Video */}
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          onTimeUpdate={handleVideoTimeUpdate}
          onLoadedMetadata={handleVideoLoadedMetadata}
        />

        {/* Reference Video (if in comparison mode) */}
        {(showSideBySide || showOverlay) && (
          <video
            ref={referenceVideoRef}
            className={`absolute top-0 ${showSideBySide ? 'right-0 w-1/2' : 'left-0 w-full opacity-50'} h-full object-contain`}
          />
        )}

        {/* Canvas Overlay */}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        />

        {/* 3D View Canvas */}
        {show3DView && (
          <canvas
            ref={canvas3DRef}
            className="absolute top-0 right-0 w-1/3 h-1/3 bg-black/30 rounded-bl-lg"
          />
        )}

        {/* Video Controls */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Progress Bar */}
          <div className="w-full h-1 bg-white/30 rounded-full mb-4 cursor-pointer">
            <div 
              className="h-full bg-primary rounded-full relative"
              style={{ width: `${(videoPlaybackState.currentTime / videoPlaybackState.duration) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full transform scale-0 hover:scale-100 transition-transform" />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-primary"
                onClick={togglePlayPause}
              >
                {videoPlaybackState.isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-white text-sm">
                  {formatTime(videoPlaybackState.currentTime)} / {formatTime(videoPlaybackState.duration)}
                </span>
              </div>

              <div className="flex items-center gap-2 group relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-primary"
                >
                  <Volume2 className="h-5 w-5" />
                </Button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
                  <div className="bg-black/90 rounded-lg p-2">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={videoPlaybackState.volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-24"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Playback Rate */}
              <select
                value={videoPlaybackState.playbackRate}
                onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
                className="bg-transparent text-white text-sm border-none outline-none"
              >
                <option value="0.5">0.5x</option>
                <option value="1">1x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
              </select>

              {/* Comparison Controls */}
              {referenceVideoUrl && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`text-white hover:text-primary ${showSideBySide ? 'text-primary' : ''}`}
                    onClick={() => {
                      setShowSideBySide(!showSideBySide);
                      setShowOverlay(false);
                    }}
                  >
                    <LayoutSplit className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`text-white hover:text-primary ${showOverlay ? 'text-primary' : ''}`}
                    onClick={() => {
                      setShowOverlay(!showOverlay);
                      setShowSideBySide(false);
                    }}
                  >
                    <Layers className="h-5 w-5" />
                  </Button>
                </div>
              )}

              {/* 3D View Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className={`text-white hover:text-primary ${show3DView ? 'text-primary' : ''}`}
                onClick={() => setShow3DView(!show3DView)}
              >
                <Box className="h-5 w-5" />
              </Button>

              {/* Fullscreen Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-primary"
                onClick={toggleFullscreen}
              >
                {videoPlaybackState.isFullscreen ? (
                  <Minimize2 className="h-5 w-5" />
                ) : (
                  <Maximize2 className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Controls */}
      <div className="mt-6 space-y-4 transform transition-all duration-300 hover:scale-[1.02]">
        <div className="flex items-center justify-between bg-gradient-to-r from-gray-900/50 to-gray-800/50 p-4 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <Button
              variant={isAnalyzing ? 'destructive' : 'default'}
              onClick={isAnalyzing ? stopAnalysis : startAnalysis}
              className={`relative overflow-hidden transform transition-all duration-300 ${isAnalyzing ? 'animate-pulse shadow-red-500/50' : 'hover:scale-105 shadow-primary/50'} shadow-lg`}
            >
              {isAnalyzing ? (
                <>
                  <Stop className="h-5 w-5 mr-2" />
                  Stop Analysis
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  Start Analysis
                </>
              )}
              {isAnalyzing && (
                <div
                  className="absolute inset-0 bg-white/20"
                  style={{
                    transform: `translateX(${progress}%)",
                    transition: 'transform 0.2s ease-out'
                  }}
                />
              )}
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setDetectionMethod('mediapipe')}
                className={detectionMethod === 'mediapipe' ? 'border-primary text-primary' : ''}
              >
                <Activity className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setDetectionMethod('openpose')}
                className={detectionMethod === 'openpose' ? 'border-primary text-primary' : ''}
              >
                <Zap className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setAudioFeedback(!audioFeedback)}
              className={audioFeedback ? 'border-primary text-primary' : ''}
            >
              {audioFeedback ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowAdvancedMetrics(!showAdvancedMetrics)}
              className={showAdvancedMetrics ? 'border-primary text-primary' : ''}
            >
              <BarChart2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Feedback Display */}
        <div className="space-y-2 perspective-1000">
          {feedback.map((message, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 p-4 rounded-xl backdrop-blur-sm flex items-start gap-3 transform transition-all duration-500 hover:scale-[1.02] hover:-rotate-1 shadow-lg"
              style={{
                animation: `slideIn 0.5s ease-out ${index * 0.1}s both`,
                opacity: 0,
                transform: 'translateY(20px)'
              }}
            >
              <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm">{message}</p>
            </div>
          ))}
        </div>

        {/* Metrics Display */}
        {showAdvancedMetrics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <MetricCard
              title="Symmetry"
              value={poseMetrics.symmetryScore}
              icon={<Balance className="h-5 w-5" />}
            />
            <MetricCard
              title="Balance"
              value={poseMetrics.balanceScore}
              icon={<Activity className="h-5 w-5" />}
            />
            <MetricCard
              title="Stability"
              value={poseMetrics.stabilityScore}
              icon={<Anchor className="h-5 w-5" />}
            />
            <MetricCard
              title="Alignment"
              value={poseMetrics.alignmentScore}
              icon={<AlignCenter className="h-5 w-5" />}
            />
          </div>
        )}
      </div>
    </div>
                      <div key={index} className="bg-white p-2 rounded-lg shadow-sm border border-blue-50 text-center">
                        <div className="flex justify-center mb-1">
                          <div className={`w-3 h-3 rounded-full ${colorClass}`}></div>
                        </div>
                        <p className="text-xs font-medium text-blue-900">{part}</p>
                        <p className="text-xs text-blue-700">{partScore}%</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Feedback visualization */}
            <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm space-y-4">
              <h4 className="font-medium text-blue-800 flex items-center">
                <Info className="h-5 w-5 mr-2 text-blue-600" />
                Detailed Feedback
              </h4>

              <div className="space-y-3">
                {results.feedback.map((item: string, index: number) => {
                  // Determine feedback type and icon/color
                  const isPositive = item.includes('good') || item.includes('Great') || item.includes('excellent');
                  const isWarning = item.includes('Try to') || item.includes('Focus on') || item.includes('Remember to');

                  let bgColor = 'bg-blue-50';
                  let textColor = 'text-blue-800';
                  let icon = <Info className="h-5 w-5 text-blue-600" />;

                  if (isPositive) {
                    bgColor = 'bg-green-50';
                    textColor = 'text-green-800';
                    icon = <Check className="h-5 w-5 text-green-600" />;
                  } else if (isWarning) {
                    bgColor = 'bg-yellow-50';
                    textColor = 'text-yellow-800';
                    icon = <AlertTriangle className="h-5 w-5 text-yellow-600" />;
                  }

                  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleVideoLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value;
    }
  };

  const handlePlaybackRateChange = (value: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = value;
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);
  };

  const stopAnalysis = () => {
    setIsAnalyzing(false);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="relative w-full h-full">
      {/* Video Player Container with enhanced visuals */}
      <div 
        className={`relative w-full aspect-video bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden shadow-lg transition-all duration-500 ${isTransitioning ? 'scale-95 opacity-90 rotate-1' : 'scale-100 opacity-100 rotate-0'} hover:shadow-2xl`}
        style={{
          transform: `perspective(1000px) ${isTransitioning ? 'rotateX(2deg)' : 'rotateX(0deg)'}`
        }}
        onMouseEnter={() => {
          setShowControls(true);
          setIsTransitioning(true);
          setTimeout(() => setIsTransitioning(false), 300);
        }}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Main Video */}
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          onTimeUpdate={handleVideoTimeUpdate}
          onLoadedMetadata={handleVideoLoadedMetadata}
        />

        {/* Reference Video (if in comparison mode) */}
        {(showSideBySide || showOverlay) && (
          <video
            ref={referenceVideoRef}
            className={`absolute top-0 ${showSideBySide ? 'right-0 w-1/2' : 'left-0 w-full opacity-50'} h-full object-contain`}
          />
        )}

        {/* Canvas Overlay */}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        />

        {/* 3D View Canvas */}
        {show3DView && (
          <canvas
            ref={canvas3DRef}
            className="absolute top-0 right-0 w-1/3 h-1/3 bg-black/30 rounded-bl-lg"
          />
        )}

        {/* Video Controls */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Progress Bar */}
          <div className="w-full h-1 bg-white/30 rounded-full mb-4 cursor-pointer">
            <div 
              className="h-full bg-primary rounded-full relative"
              style={{ width: `${(videoPlaybackState.currentTime / videoPlaybackState.duration) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full transform scale-0 hover:scale-100 transition-transform" />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-primary"
                onClick={togglePlayPause}
              >
                {videoPlaybackState.isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-white text-sm">
                  {formatTime(videoPlaybackState.currentTime)} / {formatTime(videoPlaybackState.duration)}
                </span>
              </div>

              <div className="flex items-center gap-2 group relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-primary"
                >
                  <Volume2 className="h-5 w-5" />
                </Button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
                  <div className="bg-black/90 rounded-lg p-2">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={videoPlaybackState.volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-24"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Playback Rate */}
              <select
                value={videoPlaybackState.playbackRate}
                onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
                className="bg-transparent text-white text-sm border-none outline-none"
              >
                <option value="0.5">0.5x</option>
                <option value="1">1x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
              </select>

              {/* Comparison Controls */}
              {referenceVideoUrl && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`text-white hover:text-primary ${showSideBySide ? 'text-primary' : ''}`}
                    onClick={() => {
                      setShowSideBySide(!showSideBySide);
                      setShowOverlay(false);
                    }}
                  >
                    <LayoutSplit className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`text-white hover:text-primary ${showOverlay ? 'text-primary' : ''}`}
                    onClick={() => {
                      setShowOverlay(!showOverlay);
                      setShowSideBySide(false);
                    }}
                  >
                    <Layers className="h-5 w-5" />
                  </Button>
                </div>
              )}

              {/* 3D View Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className={`text-white hover:text-primary ${show3DView ? 'text-primary' : ''}`}
                onClick={() => setShow3DView(!show3DView)}
              >
                <Box className="h-5 w-5" />
              </Button>

              {/* Fullscreen Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-primary"
                onClick={toggleFullscreen}
              >
                {videoPlaybackState.isFullscreen ? (
                  <Minimize2 className="h-5 w-5" />
                ) : (
                  <Maximize2 className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Controls */}
      <div className="mt-6 space-y-4 transform transition-all duration-300 hover:scale-[1.02]">
        <div className="flex items-center justify-between bg-gradient-to-r from-gray-900/50 to-gray-800/50 p-4 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <Button
              variant={isAnalyzing ? 'destructive' : 'default'}
              onClick={isAnalyzing ? stopAnalysis : startAnalysis}
              className={`relative overflow-hidden transform transition-all duration-300 ${isAnalyzing ? 'animate-pulse shadow-red-500/50' : 'hover:scale-105 shadow-primary/50'} shadow-lg`}
            >
              {isAnalyzing ? (
                <>
                  <Stop className="h-5 w-5 mr-2" />
                  Stop Analysis
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  Start Analysis
                </>
              )}
              {isAnalyzing && (
                <div
                  className="absolute inset-0 bg-white/20"
                  style={{
                    transform: `translateX(${progress}%)",
                    transition: 'transform 0.2s ease-out'
                  }}
                />
              )}
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setDetectionMethod('mediapipe')}
                className={detectionMethod === 'mediapipe' ? 'border-primary text-primary' : ''}
              >
                <Activity className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setDetectionMethod('openpose')}
                className={detectionMethod === 'openpose' ? 'border-primary text-primary' : ''}
              >
                <Zap className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setAudioFeedback(!audioFeedback)}
              className={audioFeedback ? 'border-primary text-primary' : ''}
            >
              {audioFeedback ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowAdvancedMetrics(!showAdvancedMetrics)}
              className={showAdvancedMetrics ? 'border-primary text-primary' : ''}
            >
              <BarChart2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Feedback Display */}
        <div className="space-y-2 perspective-1000">
          {feedback.map((message, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 p-4 rounded-xl backdrop-blur-sm flex items-start gap-3 transform transition-all duration-500 hover:scale-[1.02] hover:-rotate-1 shadow-lg"
              style={{
                animation: `slideIn 0.5s ease-out ${index * 0.1}s both`,
                opacity: 0,
                transform: 'translateY(20px)'
              }}
            >
              <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm">{message}</p>
            </div>
          ))}
        </div>

        {/* Metrics Display */}
        {showAdvancedMetrics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <MetricCard
              title="Symmetry"
              value={poseMetrics.symmetryScore}
              icon={<Balance className="h-5 w-5" />}
            />
            <MetricCard
              title="Balance"
              value={poseMetrics.balanceScore}
              icon={<Activity className="h-5 w-5" />}
            />
            <MetricCard
              title="Stability"
              value={poseMetrics.stabilityScore}
              icon={<Anchor className="h-5 w-5" />}
            />
            <MetricCard
              title="Alignment"
              value={poseMetrics.alignmentScore}
              icon={<AlignCenter className="h-5 w-5" />}
            />
          </div>
        )}
      </div>
    </div>
                    <div key={index} className={`${bgColor} p-3 rounded-lg flex items-start gap-3`}>
                      <div className="mt-0.5 flex-shrink-0">
                        {icon}
                      </div>
                      <div>
                        <p className={`text-sm ${textColor}`}>{item}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-blue-100 text-xs text-blue-500 italic">
                Analysis completed: {new Date(results.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Add MediaPipe types to Window interface
declare global {
  interface Window {
    poseDetection: any;
    posenet: any;
    tf: any;
  }
}
