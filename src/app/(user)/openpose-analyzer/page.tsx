'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [confidenceScores, setConfidenceScores] = useState<Record<string, number>>({});
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);
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
        // Only update if we have new data (based on timestamp)
        if (data.timestamp > lastUpdateTime) {
          setFeedback(data.feedback);
          setAccuracy(data.accuracy);
          setJointAngles(data.joint_angles || {});
          setConfidenceScores(data.confidence_scores || {});
          setLastUpdateTime(data.timestamp);

          // If we have new feedback, show a toast notification for the latest feedback
          if (data.feedback && data.feedback.length > 0 &&
              (!feedback.length || data.feedback[0] !== feedback[0])) {
            const latestFeedback = data.feedback[0];

            // Determine toast type based on feedback content
            if (latestFeedback.toLowerCase().includes('good') ||
                latestFeedback.toLowerCase().includes('excellent') ||
                latestFeedback.toLowerCase().includes('well')) {
              toast.success(latestFeedback, { duration: 3000 });
            } else if (latestFeedback.toLowerCase().includes('not') ||
                       latestFeedback.toLowerCase().includes('watch')) {
              toast.warning(latestFeedback, { duration: 3000 });
            } else {
              toast.info(latestFeedback, { duration: 3000 });
            }
          }
        }
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-6 rounded-xl border border-blue-100 shadow-lg"
      >
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600">
              OpenPose Analyzer
            </h1>
            <p className="text-indigo-700 mt-1 font-medium">
              Advanced real-time pose analysis using AI technology
            </p>
            <div className="flex items-center mt-2 space-x-2">
              <Badge className="bg-green-500 hover:bg-green-600">Real-time Analysis</Badge>
              <Badge className="bg-blue-500 hover:bg-blue-600">Joint Tracking</Badge>
              <Badge className="bg-purple-500 hover:bg-purple-600">Posture Feedback</Badge>
            </div>
          </div>

          <TooltipProvider>
            <Tabs
              defaultValue="live"
              value={activeTab}
              onValueChange={(value) => {
                setActiveTab(value);
                // Reset states when switching tabs
                if (value === 'live') {
                  setVideoFile(null);
                  setAnalyzedVideoUrl(null);
                  setVideoId(null);
                } else {
                  setIsStreaming(false);
                  stopWebcam();
                }
              }}
              className="w-full md:w-auto"
            >
              <TabsList className="p-1 bg-blue-100">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger value="live" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                      <Camera className="h-4 w-4 mr-2" />
                      Live Camera
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Analyze pose in real-time using your webcam</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger value="upload" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Video
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Upload and analyze a pre-recorded video</p>
                  </TooltipContent>
                </Tooltip>
              </TabsList>
            </Tabs>
          </TooltipProvider>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Video/Camera Display */}
        <motion.div
          className="md:col-span-2"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="overflow-hidden border-2 border-primary/10 hover:shadow-xl transition-all duration-300">
            <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800">
              {isLoading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent"></div>
                  <p className="text-white mt-4 animate-pulse">Loading OpenPose Analyzer...</p>
                </div>
              ) : activeTab === 'live' ? (
                <>
                  {!isStreaming ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center"
                    >
                      <div className="bg-blue-500/20 p-6 rounded-full mb-4">
                        <Camera className="h-16 w-16 text-blue-400" />
                      </div>
                      <h3 className="text-2xl font-medium text-white">Camera access required</h3>
                      <p className="text-blue-200 mt-2 mb-6 max-w-md">
                        Start the camera to begin real-time pose analysis with OpenPose technology
                      </p>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          size="lg"
                          onClick={() => setIsStreaming(true)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Camera className="h-5 w-5 mr-2" />
                          Start Camera
                        </Button>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <>
                      <img
                        ref={streamRef}
                        className="absolute inset-0 w-full h-full object-contain"
                        alt="Live stream"
                      />

                      {/* Overlay elements for live analysis */}
                      <div className="absolute inset-0 pointer-events-none">
                        {/* Analysis indicator */}
                        {isAnalyzing && (
                          <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-full text-sm flex items-center"
                          >
                            <span className="animate-pulse h-3 w-3 bg-red-500 rounded-full mr-2"></span>
                            <span>LIVE ANALYSIS</span>
                          </motion.div>
                        )}

                        {/* Accuracy meter */}
                        {isAnalyzing && (
                          <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-full"
                          >
                            <div className="flex items-center gap-2">
                              <span>Accuracy</span>
                              <span className={`font-bold ${getAccuracyColor(accuracy)}`}>
                                {accuracy.toFixed(1)}%
                              </span>
                            </div>
                          </motion.div>
                        )}

                        {/* Joint angle visualization (example) */}
                        {isAnalyzing && showAngles && Object.keys(jointAngles).length > 0 && (
                          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 justify-center">
                            {Object.entries(jointAngles).slice(0, 4).map(([joint, angle]) => (
                              <Badge
                                key={joint}
                                className="bg-black/70 backdrop-blur-sm text-white px-3 py-1"
                              >
                                {joint.replace('_', ' ')}: {typeof angle === 'number' ? angle.toFixed(1) : (angle as any).toFixed(1)}°
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  {!videoFile && !analyzedVideoUrl ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center"
                    >
                      <div className="bg-purple-500/20 p-6 rounded-full mb-4">
                        <Upload className="h-16 w-16 text-purple-400" />
                      </div>
                      <h3 className="text-2xl font-medium text-white">Upload exercise video</h3>
                      <p className="text-purple-200 mt-2 mb-6 max-w-md">
                        Upload a video to analyze your exercise form with advanced pose detection
                      </p>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          size="lg"
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          <Upload className="h-5 w-5 mr-2" />
                          Select Video
                        </Button>
                      </motion.div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="video/mp4,video/avi,video/webm,video/mov"
                        onChange={handleFileChange}
                      />
                    </motion.div>
                  ) : analyzedVideoUrl ? (
                    <>
                      <video
                        ref={videoRef}
                        src={analyzedVideoUrl}
                        className="absolute inset-0 w-full h-full object-contain"
                        controls
                      />

                      {/* Overlay for analyzed video */}
                      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-full text-sm flex items-center">
                        <span className="h-3 w-3 bg-green-500 rounded-full mr-2"></span>
                        <span>ANALYZED VIDEO</span>
                      </div>
                    </>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-900/50 to-indigo-900/50"
                    >
                      <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl max-w-md w-full">
                        <h3 className="text-xl font-medium text-white mb-2 flex items-center">
                          <Video className="h-5 w-5 mr-2 text-purple-300" />
                          {videoFile?.name}
                        </h3>
                        <p className="text-sm text-purple-200 mb-4 flex items-center">
                          <FileDown className="h-4 w-4 mr-2 text-purple-300" />
                          {(videoFile?.size ? (videoFile.size / (1024 * 1024)).toFixed(2) : 0)} MB
                        </p>

                        {isUploading ? (
                          <div className="space-y-3">
                            <Progress
                              value={uploadProgress}
                              className="w-full h-2 bg-purple-900/50"
                              indicatorClassName="bg-gradient-to-r from-purple-500 to-indigo-500"
                            />
                            <div className="flex justify-between text-xs text-purple-200">
                              <span>Uploading...</span>
                              <span>{uploadProgress}%</span>
                            </div>
                          </div>
                        ) : videoId ? (
                          <div className="space-y-3 text-center">
                            <div className="flex justify-center">
                              <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-purple-500 border-r-transparent border-b-purple-500 border-l-transparent"></div>
                            </div>
                            <p className="text-purple-200 animate-pulse">Analyzing video with OpenPose...</p>
                            <p className="text-xs text-purple-300">This may take a few minutes</p>
                          </div>
                        ) : (
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full"
                          >
                            <Button
                              onClick={uploadVideo}
                              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload & Analyze
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </div>
            <CardFooter className="p-4 border-t bg-gradient-to-r from-gray-50 to-gray-100">
              {activeTab === 'live' && isStreaming ? (
                <div className="flex justify-between w-full">
                  <div className="flex gap-2">
                    {isAnalyzing ? (
                      <Button
                        variant="outline"
                        onClick={stopAnalysis}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Pause className="h-4 w-4 mr-2" />
                        Stop Analysis
                      </Button>
                    ) : (
                      <Button
                        onClick={startAnalysis}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Analysis
                      </Button>
                    )}

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center space-x-2 ml-4 bg-gray-100 px-3 py-1 rounded-md">
                            <Label htmlFor="show-skeleton" className="text-sm cursor-pointer">Skeleton</Label>
                            <Switch
                              id="show-skeleton"
                              checked={showSkeleton}
                              onCheckedChange={setShowSkeleton}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Show/hide skeleton overlay</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-md">
                            <Label htmlFor="show-angles" className="text-sm cursor-pointer">Angles</Label>
                            <Switch
                              id="show-angles"
                              checked={showAngles}
                              onCheckedChange={setShowAngles}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Show/hide joint angles</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIsStreaming(false)}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : activeTab === 'upload' && analyzedVideoUrl ? (
                <div className="flex justify-between w-full">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setAnalyzedVideoUrl(null)}
                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => exportResults('json')}
                      className="border-green-200 text-green-600 hover:bg-green-50"
                    >
                      <FileJson className="h-4 w-4 mr-2" />
                      Export JSON
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => exportResults('csv')}
                      className="border-purple-200 text-purple-600 hover:bg-purple-50"
                    >
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </div>
              ) : null}
            </CardFooter>
          </Card>
        </motion.div>

        {/* Analysis Results */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Real-time Feedback */}
          <Card className="border-2 border-primary/10 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="text-lg flex items-center">
                <div className="bg-blue-100 p-1 rounded-full mr-2">
                  <MessageSquare className="h-4 w-4 text-blue-700" />
                </div>
                Real-time Posture Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {isLoading ? (
                <div className="space-y-3">
                  <div className="h-10 bg-blue-50 rounded-lg animate-pulse w-full"></div>
                  <div className="h-10 bg-blue-50 rounded-lg animate-pulse w-full"></div>
                  <div className="h-10 bg-blue-50 rounded-lg animate-pulse w-full"></div>
                </div>
              ) : isAnalyzing || analysisSummary ? (
                <AnimatePresence>
                  {(feedback.length > 0 || (analysisSummary?.feedback && analysisSummary.feedback.length > 0)) ? (
                    <div className="space-y-2">
                      {(analysisSummary ? analysisSummary.feedback : feedback).map((item: string, index: number) => (
                        <motion.div
                          key={`${item}-${index}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`flex items-start gap-2 p-3 rounded-lg ${
                            item.toLowerCase().includes('not') || item.toLowerCase().includes('watch')
                              ? 'bg-red-50 border border-red-100'
                              : item.toLowerCase().includes('good') || item.toLowerCase().includes('excellent')
                              ? 'bg-green-50 border border-green-100'
                              : 'bg-blue-50 border border-blue-100'
                          }`}
                        >
                          <div className="mt-0.5">
                            {getFeedbackIcon(item)}
                          </div>
                          <span className="text-sm">{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center p-8 text-center bg-blue-50/50 rounded-lg"
                    >
                      <div className="bg-blue-100 p-3 rounded-full mb-3">
                        <Activity className="h-6 w-6 text-blue-600" />
                      </div>
                      <p className="text-blue-800 font-medium">Analyzing your posture...</p>
                      <p className="text-blue-600 text-sm mt-1">Feedback will appear here as you move</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-lg"
                >
                  <div className="bg-gray-100 p-3 rounded-full mb-3">
                    <Play className="h-6 w-6 text-gray-600" />
                  </div>
                  <p className="text-gray-800 font-medium">Start analysis to see feedback</p>
                  <p className="text-gray-600 text-sm mt-1">Real-time posture corrections will appear here</p>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Confidence Scores */}
          <Card className="border-2 border-primary/10 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-teal-50 border-b">
              <CardTitle className="text-lg flex items-center">
                <div className="bg-green-100 p-1 rounded-full mr-2">
                  <BarChart2 className="h-4 w-4 text-green-700" />
                </div>
                Posture Confidence Scores
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {isLoading ? (
                <div className="space-y-4">
                  <div className="h-10 bg-green-50 rounded-lg animate-pulse"></div>
                  <div className="h-10 bg-green-50 rounded-lg animate-pulse"></div>
                  <div className="h-10 bg-green-50 rounded-lg animate-pulse"></div>
                </div>
              ) : Object.keys(confidenceScores).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(confidenceScores).map(([part, score]) => (
                    <motion.div
                      key={part}
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "100%" }}
                      transition={{ duration: 0.5 }}
                      className="space-y-1"
                    >
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium capitalize">{part}</p>
                        <p className={`text-sm font-bold ${
                          score >= 90 ? 'text-green-600' :
                          score >= 70 ? 'text-yellow-600' : 'text-red-600'
                        }`}>{score.toFixed(1)}%</p>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${score}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className={`h-full rounded-full ${
                            score >= 90 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                            score >= 70 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                            'bg-gradient-to-r from-red-400 to-red-600'
                          }`}
                        ></motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-lg"
                >
                  <div className="bg-gray-100 p-3 rounded-full mb-3">
                    <BarChart2 className="h-6 w-6 text-gray-600" />
                  </div>
                  <p className="text-gray-800 font-medium">No confidence data available</p>
                  <p className="text-gray-600 text-sm mt-1">Start analysis to see posture scores</p>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Joint Angles */}
          <Card className="border-2 border-primary/10 hover:shadow-lg transition-all duration-300 mt-6">
            <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-indigo-50 border-b">
              <CardTitle className="text-lg flex items-center">
                <div className="bg-purple-100 p-1 rounded-full mr-2">
                  <Activity className="h-4 w-4 text-purple-700" />
                </div>
                Joint Angle Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {isLoading ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-16 bg-purple-50 rounded-lg animate-pulse"></div>
                  <div className="h-16 bg-purple-50 rounded-lg animate-pulse"></div>
                  <div className="h-16 bg-purple-50 rounded-lg animate-pulse"></div>
                  <div className="h-16 bg-purple-50 rounded-lg animate-pulse"></div>
                </div>
              ) : Object.keys(jointAngles).length > 0 || (analysisSummary?.joint_angles && Object.keys(analysisSummary.joint_angles).length > 0) ? (
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(analysisSummary?.joint_angles || jointAngles).map(([joint, angle]) => (
                    <motion.div
                      key={joint}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="p-3 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-100 hover:shadow-md transition-all"
                    >
                      <p className="text-xs text-purple-700 font-medium uppercase tracking-wide">{joint.replace('_', ' ')}</p>
                      <div className="flex items-end gap-1 mt-1">
                        <p className="text-2xl font-bold text-purple-900">{typeof angle === 'number' ? angle.toFixed(1) : (angle as any).toFixed(1)}</p>
                        <p className="text-sm text-purple-700 mb-1">degrees</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-lg"
                >
                  <div className="bg-gray-100 p-3 rounded-full mb-3">
                    <Activity className="h-6 w-6 text-gray-600" />
                  </div>
                  <p className="text-gray-800 font-medium">No joint data available</p>
                  <p className="text-gray-600 text-sm mt-1">Start analysis to see joint angles</p>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Analysis Summary */}
          <AnimatePresence>
            {analysisSummary && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-2 border-primary/10 hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-teal-50 border-b">
                    <CardTitle className="text-lg flex items-center">
                      <div className="bg-green-100 p-1 rounded-full mr-2">
                        <BarChart2 className="h-4 w-4 text-green-700" />
                      </div>
                      Analysis Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg border border-green-100">
                        <p className="text-sm text-green-800 font-medium mb-2">Overall Accuracy</p>
                        <div className="flex items-center gap-3">
                          <div className="w-full bg-white rounded-full h-3 overflow-hidden">
                            <div
                              className={`h-full ${
                                analysisSummary.accuracy >= 90 ? 'bg-green-500' :
                                analysisSummary.accuracy >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${analysisSummary.accuracy}%` }}
                            ></div>
                          </div>
                          <span className={`font-bold text-lg ${getAccuracyColor(analysisSummary.accuracy)}`}>
                            {analysisSummary.accuracy.toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg border border-green-100">
                          <p className="text-xs text-green-700 font-medium">FRAMES</p>
                          <p className="text-xl font-bold text-green-900 mt-1">{analysisSummary.frame_count}</p>
                        </div>

                        <div className="p-3 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg border border-green-100">
                          <p className="text-xs text-green-700 font-medium">DURATION</p>
                          <p className="text-xl font-bold text-green-900 mt-1">{analysisSummary.duration.toFixed(1)}s</p>
                        </div>

                        <div className="p-3 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg border border-green-100">
                          <p className="text-xs text-green-700 font-medium">FEEDBACK</p>
                          <p className="text-xl font-bold text-green-900 mt-1">{analysisSummary.feedback.length}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <motion.div
              className="flex-1"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                onClick={() => exportResults('json')}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Results
              </Button>
            </motion.div>
            <motion.div
              className="flex-1"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                variant="outline"
                className="w-full border-2 border-blue-200"
                onClick={() => window.open('https://google.github.io/mediapipe/solutions/pose.html', '_blank')}
              >
                <Info className="h-4 w-4 mr-2" />
                Learn More
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
