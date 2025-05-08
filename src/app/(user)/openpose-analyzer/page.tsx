'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
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
  Settings,
  FileDown,
  FileJson,
  FileSpreadsheet
} from 'lucide-react';
import { toast } from 'sonner';

// API URL - replace with your actual backend URL
const API_URL = 'http://localhost:5000/api';

export default function OpenPoseAnalyzerPage() {
  const [activeTab, setActiveTab] = useState('live');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [accuracy, setAccuracy] = useState(0);
  const [jointAngles, setJointAngles] = useState<Record<string, number>>({});
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showAngles, setShowAngles] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [analyzedVideoUrl, setAnalyzedVideoUrl] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [analysisSummary, setAnalysisSummary] = useState<any>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<HTMLImageElement>(null);
  
  // Feedback polling interval
  const feedbackIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
      stopWebcam();
      stopAnalysis();
      
      if (feedbackIntervalRef.current) {
        clearInterval(feedbackIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (activeTab === 'live' && isStreaming) {
      startWebcam();
    } else if (activeTab !== 'live' || !isStreaming) {
      stopWebcam();
    }
  }, [activeTab, isStreaming]);

  useEffect(() => {
    // Poll for feedback when analyzing
    if (isAnalyzing) {
      getFeedback();
      
      feedbackIntervalRef.current = setInterval(() => {
        getFeedback();
      }, 1000);
    } else {
      if (feedbackIntervalRef.current) {
        clearInterval(feedbackIntervalRef.current);
      }
    }
    
    return () => {
      if (feedbackIntervalRef.current) {
        clearInterval(feedbackIntervalRef.current);
      }
    };
  }, [isAnalyzing]);

  useEffect(() => {
    // Check for analyzed video result
    if (videoId) {
      const checkVideoResult = setInterval(() => {
        fetch(`${API_URL}/video_result/${videoId}`)
          .then(response => {
            if (response.ok) {
              clearInterval(checkVideoResult);
              setAnalyzedVideoUrl(`${API_URL}/video_result/${videoId}`);
              toast.success('Video analysis completed');
            }
          })
          .catch(error => {
            console.error('Error checking video result:', error);
          });
      }, 2000);
      
      return () => clearInterval(checkVideoResult);
    }
  }, [videoId]);

  const startWebcam = async () => {
    try {
      await fetch(`${API_URL}/start_webcam`, {
        method: 'POST',
      });
      
      setIsStreaming(true);
      
      if (streamRef.current) {
        streamRef.current.src = `${API_URL}/webcam_stream`;
      }
      
      toast.success('Webcam started', {
        description: 'Camera stream is now active',
        duration: 3000
      });
    } catch (error) {
      console.error('Error starting webcam:', error);
      toast.error('Failed to start webcam', {
        description: 'Please check your camera permissions',
        duration: 5000
      });
    }
  };

  const stopWebcam = async () => {
    try {
      await fetch(`${API_URL}/stop_webcam`, {
        method: 'POST',
      });
      
      setIsStreaming(false);
      
      if (streamRef.current) {
        streamRef.current.src = '';
      }
    } catch (error) {
      console.error('Error stopping webcam:', error);
    }
  };

  const startAnalysis = async () => {
    try {
      await fetch(`${API_URL}/start_analysis`, {
        method: 'POST',
      });
      
      setIsAnalyzing(true);
      setFeedback([]);
      
      toast.success('Analysis started', {
        description: 'OpenPose pose detection is now active',
        duration: 3000
      });
    } catch (error) {
      console.error('Error starting analysis:', error);
      toast.error('Failed to start analysis', {
        duration: 3000
      });
    }
  };

  const stopAnalysis = async () => {
    if (!isAnalyzing) return;
    
    try {
      const response = await fetch(`${API_URL}/stop_analysis`, {
        method: 'POST',
      });
      
      const data = await response.json();
      setIsAnalyzing(false);
      
      if (data.summary) {
        setAnalysisSummary(data.summary);
      }
      
      toast.info('Analysis stopped', {
        description: 'OpenPose pose detection is now paused',
        duration: 3000
      });
    } catch (error) {
      console.error('Error stopping analysis:', error);
    }
  };

  const getFeedback = async () => {
    try {
      const response = await fetch(`${API_URL}/get_feedback`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setFeedback(data.feedback);
        setAccuracy(data.accuracy);
        setJointAngles(data.joint_angles);
      }
    } catch (error) {
      console.error('Error getting feedback:', error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setVideoFile(files[0]);
      
      // Reset previous analysis
      setAnalyzedVideoUrl(null);
      setVideoId(null);
      setAnalysisSummary(null);
      
      toast.info('Video selected', {
        description: `Selected ${files[0].name} (${(files[0].size / (1024 * 1024)).toFixed(2)} MB)`,
        duration: 3000
      });
    }
  };

  const uploadVideo = async () => {
    if (!videoFile) {
      toast.error('No video selected', {
        description: 'Please select a video file first',
        duration: 3000
      });
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    const formData = new FormData();
    formData.append('video', videoFile);
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 5;
          if (newProgress >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return newProgress;
        });
      }, 200);
      
      const response = await fetch(`${API_URL}/upload_video`, {
        method: 'POST',
        body: formData,
      });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setVideoId(data.video_id);
        toast.success('Video uploaded', {
          description: 'Your video is being analyzed. This may take a few minutes.',
          duration: 5000
        });
      } else {
        toast.error('Upload failed', {
          description: data.message,
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error('Upload failed', {
        description: 'An error occurred while uploading the video',
        duration: 3000
      });
    } finally {
      setIsUploading(false);
    }
  };

  const exportResults = async (format: 'json' | 'csv') => {
    try {
      const response = await fetch(`${API_URL}/export_results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ format }),
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        // Trigger download
        window.open(`${API_URL}/download_results/${data.file}`, '_blank');
        
        toast.success('Results exported', {
          description: `Analysis results exported as ${format.toUpperCase()}`,
          duration: 3000
        });
      } else {
        toast.error('Export failed', {
          description: data.message,
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Error exporting results:', error);
      toast.error('Export failed', {
        description: 'An error occurred while exporting results',
        duration: 3000
      });
    }
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
    if (feedback.toLowerCase().includes('not') || feedback.toLowerCase().includes('incorrect')) {
      return <X className="h-4 w-4 text-red-500" />;
    }
    return <Info className="h-4 w-4 text-blue-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold">OpenPose Analyzer</h1>
          <p className="text-muted-foreground">Advanced pose analysis using OpenPose/MediaPipe technology</p>
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
                  {!isStreaming ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                      <Camera className="h-12 w-12 mb-4 text-muted" />
                      <h3 className="text-lg font-medium text-foreground">Camera access required</h3>
                      <p className="text-muted-foreground mt-2 mb-4">
                        Click the button below to start the camera stream
                      </p>
                      <Button onClick={() => setIsStreaming(true)}>
                        Start Camera
                      </Button>
                    </div>
                  ) : (
                    <>
                      <img
                        ref={streamRef}
                        className="absolute inset-0 w-full h-full object-contain"
                        alt="Live stream"
                      />
                      {isAnalyzing && (
                        <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm flex items-center">
                          <span className="animate-pulse mr-1">●</span> Analyzing
                        </div>
                      )}
                      {isAnalyzing && (
                        <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                          Accuracy: <span className={getAccuracyColor(accuracy)}>{accuracy.toFixed(1)}%</span>
                        </div>
                      )}
                    </>
                  )}
                </>
              ) : (
                <>
                  {!videoFile && !analyzedVideoUrl ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                      <Upload className="h-12 w-12 mb-4 text-muted" />
                      <h3 className="text-lg font-medium text-foreground">No video selected</h3>
                      <p className="text-muted-foreground mt-2 mb-4">
                        Upload a video to analyze your exercise form
                      </p>
                      <Button onClick={() => fileInputRef.current?.click()}>
                        Select Video
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="video/mp4,video/avi,video/webm,video/mov"
                        onChange={handleFileChange}
                      />
                    </div>
                  ) : analyzedVideoUrl ? (
                    <video
                      ref={videoRef}
                      src={analyzedVideoUrl}
                      className="absolute inset-0 w-full h-full object-contain"
                      controls
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                      <p className="text-lg font-medium mb-2">{videoFile?.name}</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        {(videoFile?.size ? (videoFile.size / (1024 * 1024)).toFixed(2) : 0)} MB
                      </p>
                      
                      {isUploading ? (
                        <div className="w-full max-w-md space-y-2">
                          <Progress value={uploadProgress} className="w-full" />
                          <p className="text-sm text-center">{uploadProgress}% Uploaded</p>
                        </div>
                      ) : videoId ? (
                        <div className="space-y-2 text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                          <p>Analyzing video... This may take a few minutes.</p>
                        </div>
                      ) : (
                        <Button onClick={uploadVideo} className="mt-2">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload & Analyze
                        </Button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="p-4 border-t">
              {activeTab === 'live' && isStreaming ? (
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    {isAnalyzing ? (
                      <Button variant="outline" onClick={stopAnalysis}>
                        <Pause className="h-4 w-4 mr-2" />
                        Stop Analysis
                      </Button>
                    ) : (
                      <Button onClick={startAnalysis}>
                        <Play className="h-4 w-4 mr-2" />
                        Start Analysis
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => setIsStreaming(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : activeTab === 'upload' && analyzedVideoUrl ? (
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setAnalyzedVideoUrl(null)}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => exportResults('json')}>
                      <FileJson className="h-4 w-4 mr-2" />
                      Export JSON
                    </Button>
                    <Button variant="outline" onClick={() => exportResults('csv')}>
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </div>
              ) : null}
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
              ) : isAnalyzing || analysisSummary ? (
                <div className="space-y-2">
                  {(feedback.length > 0 || (analysisSummary?.feedback && analysisSummary.feedback.length > 0)) ? (
                    (analysisSummary ? analysisSummary.feedback : feedback).map((item: string, index: number) => (
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

          {/* Joint Angles */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Joint Angles</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <div className="h-8 bg-muted rounded animate-pulse w-full"></div>
                  <div className="h-8 bg-muted rounded animate-pulse w-full"></div>
                </div>
              ) : Object.keys(jointAngles).length > 0 || (analysisSummary?.joint_angles && Object.keys(analysisSummary.joint_angles).length > 0) ? (
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(analysisSummary?.joint_angles || jointAngles).map(([joint, angle]) => (
                    <div key={joint} className="p-2 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground capitalize">{joint.replace('_', ' ')}</p>
                      <p className="text-lg font-semibold">{typeof angle === 'number' ? angle.toFixed(1) : (angle as any).toFixed(1)}°</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center p-6 text-center">
                  <p className="text-muted-foreground">No joint data available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Analysis Summary */}
          {analysisSummary && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Analysis Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Overall Accuracy</span>
                    <span className={`font-semibold ${getAccuracyColor(analysisSummary.accuracy)}`}>
                      {analysisSummary.accuracy.toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Frames Analyzed</span>
                    <span className="font-semibold">{analysisSummary.frame_count}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Duration</span>
                    <span className="font-semibold">{analysisSummary.duration.toFixed(1)}s</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Feedback Items</span>
                    <span className="font-semibold">{analysisSummary.feedback.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button className="flex-1" onClick={() => exportResults('json')}>
              <Download className="h-4 w-4 mr-2" />
              Export Results
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => window.open('https://google.github.io/mediapipe/solutions/pose.html', '_blank')}>
              <Info className="h-4 w-4 mr-2" />
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
