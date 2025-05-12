'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Camera, 
  Video, 
  Upload, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Share2, 
  Maximize2,
  ZoomIn,
  ZoomOut,
  Check,
  X,
  AlertTriangle,
  Info,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

export default function PoseAnalysisPage() {
  const [activeTab, setActiveTab] = useState('live');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [accuracy, setAccuracy] = useState(0);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showAngles, setShowAngles] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (activeTab === 'live') {
      requestCameraPermission();
    }
  }, [activeTab]);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // Simulate starting MediaPipe
      setTimeout(() => {
        setIsAnalyzing(true);
        simulatePoseDetection();
      }, 2000);
      
      return () => {
        stream.getTracks().forEach(track => track.stop());
      };
    } catch (err) {
      console.error('Error accessing camera:', err);
      setCameraPermission(false);
      toast.error('Camera access denied', {
        description: 'Please allow camera access to use the pose analyzer',
        duration: 5000
      });
    }
  };

  const simulatePoseDetection = () => {
    // Simulate pose detection feedback
    const feedbackItems = [
      'Keep your back straight',
      'Lower your shoulders',
      'Bend your knees slightly',
      'Maintain neutral spine position'
    ];
    
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      setFeedback(prev => {
        if (prev.length >= 4) {
          return [...prev.slice(1), feedbackItems[currentIndex]];
        }
        return [...prev, feedbackItems[currentIndex]];
      });
      
      currentIndex = (currentIndex + 1) % feedbackItems.length;
      
      // Simulate accuracy changes
      setAccuracy(prev => {
        const change = Math.random() * 10 - 5;
        const newValue = Math.min(Math.max(prev + change, 60), 98);
        return Math.round(newValue);
      });
    }, 3000);
    
    return () => clearInterval(interval);
  };

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    toast.success('Analysis started', {
      description: 'MediaPipe pose detection is now active',
      duration: 3000
    });
    simulatePoseDetection();
  };

  const handleStopAnalysis = () => {
    setIsAnalyzing(false);
    toast.info('Analysis paused', {
      description: 'MediaPipe pose detection is now paused',
      duration: 3000
    });
  };

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
      
      if (!isAnalyzing) {
        handleStartAnalysis();
      }
    }
  };

  const handlePauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleResetVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
      
      if (isPlaying) {
        videoRef.current.play();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 1));
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleUploadVideo = () => {
    toast.info('Upload video', {
      description: 'Video upload feature is coming soon',
      duration: 3000
    });
  };

  const handleDownloadResults = () => {
    toast.success('Analysis results', {
      description: 'Your analysis results have been downloaded',
      duration: 3000
    });
  };

  const handleShareResults = () => {
    toast.info('Share results', {
      description: 'Sharing feature is coming soon',
      duration: 3000
    });
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-green-500';
    if (accuracy >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getFeedbackIcon = (feedback: string) => {
    if (feedback.toLowerCase().includes('good') || feedback.toLowerCase().includes('excellent')) {
      return <Check className="h-4 w-4 text-green-500" />;
    }
    if (feedback.toLowerCase().includes('watch') || feedback.toLowerCase().includes('careful')) {
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
    if (feedback.toLowerCase().includes('incorrect') || feedback.toLowerCase().includes('wrong')) {
      return <X className="h-4 w-4 text-red-500" />;
    }
    return <Info className="h-4 w-4 text-blue-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold">MediaPipe Pose Analysis</h1>
          <p className="text-muted-foreground">Analyze your exercise form in real-time using AI-powered pose detection</p>
        </div>
        
        <Tabs defaultValue="live" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="live">
              <Camera className="h-4 w-4 mr-2" />
              Live Camera
            </TabsTrigger>
            <TabsTrigger value="upload">
              <Upload className="h-4 w-4 mr-2" />
              Upload Video
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Video/Camera Display */}
        <div className="md:col-span-2">
          <Card className="overflow-hidden">
            <div className="relative aspect-video bg-black">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : activeTab === 'live' ? (
                <>
                  {cameraPermission === false ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                      <Camera className="h-12 w-12 mb-4 text-muted" />
                      <h3 className="text-lg font-medium text-foreground">Camera access required</h3>
                      <p className="text-muted-foreground mt-2 mb-4">
                        Please allow camera access to use the pose analyzer
                      </p>
                      <Button onClick={requestCameraPermission}>
                        Request Camera Access
                      </Button>
                    </div>
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ transform: `scale(${zoom})` }}
                      />
                      <canvas
                        ref={canvasRef}
                        className={`absolute inset-0 w-full h-full ${!showSkeleton ? 'hidden' : ''}`}
                      />
                      {isAnalyzing && (
                        <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm flex items-center">
                          <span className="animate-pulse mr-1">●</span> Analyzing
                        </div>
                      )}
                      {isAnalyzing && (
                        <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                          Accuracy: <span className={getAccuracyColor(accuracy)}>{accuracy}%</span>
                        </div>
                      )}
                    </>
                  )}
                </>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-contain"
                    style={{ transform: `scale(${zoom})` }}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                  />
                  <canvas
                    ref={canvasRef}
                    className={`absolute inset-0 w-full h-full ${!showSkeleton ? 'hidden' : ''}`}
                  />
                  {!videoRef.current?.src && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                      <Upload className="h-12 w-12 mb-4 text-muted" />
                      <h3 className="text-lg font-medium text-foreground">No video selected</h3>
                      <p className="text-muted-foreground mt-2 mb-4">
                        Upload a video to analyze your exercise form
                      </p>
                      <Button onClick={handleUploadVideo}>
                        Upload Video
                      </Button>
                    </div>
                  )}
                  {isAnalyzing && (
                    <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm flex items-center">
                      <span className="animate-pulse mr-1">●</span> Analyzing
                    </div>
                  )}
                  {isAnalyzing && (
                    <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                      Accuracy: <span className={getAccuracyColor(accuracy)}>{accuracy}%</span>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="p-4 border-t">
              {activeTab === 'live' ? (
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    {isAnalyzing ? (
                      <Button variant="outline" onClick={handleStopAnalysis}>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause Analysis
                      </Button>
                    ) : (
                      <Button onClick={handleStartAnalysis}>
                        <Play className="h-4 w-4 mr-2" />
                        Start Analysis
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={handleZoomOut} disabled={zoom <= 1}>
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleZoomIn} disabled={zoom >= 2}>
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      {isPlaying ? (
                        <Button variant="outline" onClick={handlePauseVideo}>
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </Button>
                      ) : (
                        <Button onClick={handlePlayVideo}>
                          <Play className="h-4 w-4 mr-2" />
                          Play
                        </Button>
                      )}
                      <Button variant="outline" size="icon" onClick={handleResetVideo}>
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={handleZoomOut} disabled={zoom <= 1}>
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={handleZoomIn} disabled={zoom >= 2}>
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Maximize2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{formatTime(currentTime)}</span>
                    <Slider
                      value={[currentTime]}
                      max={duration}
                      step={0.1}
                      onValueChange={handleSeek}
                      className="flex-1"
                    />
                    <span className="text-sm">{formatTime(duration)}</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Analysis Results */}
        <div className="space-y-6">
          {/* Real-time Feedback */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Real-time Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <div className="h-8 bg-muted rounded animate-pulse w-full"></div>
                  <div className="h-8 bg-muted rounded animate-pulse w-full"></div>
                  <div className="h-8 bg-muted rounded animate-pulse w-full"></div>
                </div>
              ) : isAnalyzing ? (
                <div className="space-y-2">
                  {feedback.length > 0 ? (
                    feedback.map((item, index) => (
                      <div key={index} className="flex items-start gap-2 p-2 bg-muted/50 rounded-lg">
                        {getFeedbackIcon(item)}
                        <span className="text-sm">{item}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center p-6 text-center">
                      <p className="text-muted-foreground">Waiting for feedback...</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center p-6 text-center">
                  <div>
                    <Play className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Start analysis to see feedback</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Analysis Settings */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Analysis Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Show Skeleton</span>
                  <Button
                    variant={showSkeleton ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowSkeleton(!showSkeleton)}
                  >
                    {showSkeleton ? "On" : "Off"}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Show Angles</span>
                  <Button
                    variant={showAngles ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowAngles(!showAngles)}
                  >
                    {showAngles ? "On" : "Off"}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Detection Sensitivity</span>
                  <div className="w-32">
                    <Slider defaultValue={[0.7]} max={1} step={0.1} />
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={() => toast.info("Advanced settings coming soon")}>
                  <Settings className="h-4 w-4 mr-2" />
                  Advanced Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button className="flex-1" onClick={handleDownloadResults}>
              <Download className="h-4 w-4 mr-2" />
              Download Results
            </Button>
            <Button variant="outline" className="flex-1" onClick={handleShareResults}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
