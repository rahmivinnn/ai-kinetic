'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Camera, RefreshCw, Check, AlertTriangle, Info, Activity, Zap, Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, Box, LayoutSplit, Layers, Stop, BarChart2, Balance, Anchor, AlignCenter } from 'lucide-react';

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
  const openPoseNetRef = useRef<any>(null);
  const poseHistoryRef = useRef<any[]>([]);
  const lastFeedbackTimeRef = useRef<number>(0);

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
  const [detectionMethod, setDetectionMethod] = useState<'mediapipe' | 'openpose'>('openpose');
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

  const [visualization3D, setVisualization3D] = useState({
    rotationX: 0,
    rotationY: 0,
    zoom: 1,
    autoRotate: false,
    showSkeleton: true,
    showMuscles: false,
    highlightIssues: true
  });

  const [feedbackSettings, setFeedbackSettings] = useState({
    showRealtime: true,
    voiceFeedback: enableVoiceFeedback,
    vibrationFeedback: false,
    detailedAnalysis: showAdvancedMetrics,
    highlightCorrections: true
  });

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

  // Load MediaPipe scripts
  useEffect(() => {
    if (window.poseDetection) {
      setIsMediaPipeLoaded(true);
      return;
    }

    const loadScripts = async () => {
      try {
        const tfScript = document.createElement('script');
        tfScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core@4.2.0/dist/tf-core.min.js';
        tfScript.async = true;
        document.body.appendChild(tfScript);

        await new Promise((resolve) => {
          tfScript.onload = resolve;
        });

        const tfBackendScript = document.createElement('script');
        tfBackendScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl@4.2.0/dist/tf-backend-webgl.min.js';
        tfBackendScript.async = true;
        document.body.appendChild(tfBackendScript);

        await new Promise((resolve) => {
          tfBackendScript.onload = resolve;
        });

        const poseDetectionScript = document.createElement('script');
        poseDetectionScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection@2.1.0/dist/pose-detection.min.js';
        poseDetectionScript.async = true;
        document.body.appendChild(poseDetectionScript);

        await new Promise((resolve) => {
          poseDetectionScript.onload = resolve;
        });

        setIsMediaPipeLoaded(true);
        toast.success('OpenPose loaded successfully');
      } catch (error) {
        console.error('Error loading OpenPose:', error);
        setIsMediaPipeSupported(false);
        toast.error('Failed to load OpenPose. Your browser may not support it.');
      }
    };

    loadScripts();

    return () => {
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
        if (!window.tf) {
          const tfScript = document.createElement('script');
          tfScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.2.0/dist/tf.min.js';
          tfScript.async = true;
          document.body.appendChild(tfScript);

          await new Promise((resolve) => {
            tfScript.onload = resolve;
          });
        }

        const posenetScript = document.createElement('script');
        posenetScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/posenet@2.2.2/dist/posenet.min.js';
        posenetScript.async = true;
        document.body.appendChild(posenetScript);

        await new Promise((resolve) => {
          posenetScript.onload = resolve;
        });

        if (window.posenet) {
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

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      speechSynthesisRef.current = window.speechSynthesis;
    }
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
  };

  const stopAnalysis = () => {
    setIsAnalyzing(false);
  };

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

  const speakFeedback = (message: string) => {
    if (audioFeedback && speechSynthesisRef.current) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'id-ID';
      speechSynthesisRef.current.speak(utterance);
    }
  };

  const calculatePoseMetrics = (pose: any) => {
    const metrics: PoseMetrics = {
      symmetryScore: calculateSymmetryScore(pose),
      balanceScore: calculateBalanceScore(pose),
      stabilityScore: calculateStabilityScore(pose),
      alignmentScore: calculateAlignmentScore(pose),
      overallScore: 0,
      jointAngles: calculateJointAngles(pose),
      movementQuality: 0,
      energyEfficiency: 0,
      formConsistency: 0,
      rangeOfMotion: 0,
      performanceHistory: []
    };

    metrics.overallScore = (metrics.symmetryScore + metrics.balanceScore +
      metrics.stabilityScore + metrics.alignmentScore) / 4;

    return metrics;
  };

  const calculateSymmetryScore = (pose: any) => {
    return 0.8;
  };

  const calculateBalanceScore = (pose: any) => {
    return 0.75;
  };

  const calculateStabilityScore = (pose: any) => {
    return 0.9;
  };

  const calculateAlignmentScore = (pose: any) => {
    return 0.85;
  };

  const calculateJointAngles = (pose: any) => {
    return {};
  };

  return (
    <div className="relative w-full h-full">
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
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          onTimeUpdate={handleVideoTimeUpdate}
          onLoadedMetadata={handleVideoLoadedMetadata}
        />

        {(showSideBySide || showOverlay) && (
          <video
            ref={referenceVideoRef}
            className={`absolute top-0 ${showSideBySide ? 'right-0 w-1/2' : 'left-0 w-full opacity-50'} h-full object-contain`}
          />
        )}

        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        />

        {show3DView && (
          <canvas
            ref={canvas3DRef}
            className="absolute top-0 right-0 w-1/3 h-1/3 bg-black/30 rounded-bl-lg"
          />
        )}

        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="w-full h-1 bg-white/30 rounded-full mb-4 cursor-pointer">
            <div
              className="h-full bg-primary rounded-full relative"
              style={{ width: `${(videoPlaybackState.currentTime / videoPlaybackState.duration) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full transform scale-0 hover:scale-100 transition-transform" />
            </div>
          </div>

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

              <Button
                variant="ghost"
                size="icon"
                className={`text-white hover:text-primary ${show3DView ? 'text-primary' : ''}`}
                onClick={() => setShow3DView(!show3DView)}
              >
                <Box className="h-5 w-5" />
              </Button>

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
                    transform: `translateX(${progress}%)`,
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
  );
}
