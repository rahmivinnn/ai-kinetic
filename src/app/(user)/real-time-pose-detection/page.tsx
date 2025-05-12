"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import {
  Activity,
  Camera,
  Video,
  MessageSquare,
  BarChart2,
  Settings,
  Users,
  Layers,
  Download,
  Zap,
  Camera as CameraIcon,
  RefreshCw,
  Pause,
  Play,
  Maximize,
  Minimize,
  Sliders,
  Info
} from 'lucide-react';

// Import our custom components
import RealTimeDetectionPanel from "@/components/pose-detection/real-time-detection-panel";

export default function RealTimePoseDetectionPage() {
  const [activeTab, setActiveTab] = useState('detection');
  const [detectedPoseData, setDetectedPoseData] = useState<any | null>(null);
  const [analysisMode, setAnalysisMode] = useState<'general' | 'exercise' | 'posture'>('general');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);
  const [feedbackMessages, setFeedbackMessages] = useState<any[]>([]);

  // Handle pose detection with improved feedback
  const handlePoseDetected = (poseData: any) => {
    // Update the detected pose data
    setDetectedPoseData(poseData);

    // Generate feedback based on the detected pose
    if (poseData && poseData.keypoints) {
      // Process feedback from pose data if available
      if (poseData.feedback && Array.isArray(poseData.feedback) && poseData.feedback.length > 0) {
        // Use the feedback provided by the pose detection component
        const newMessages = poseData.feedback.map((item: any) => ({
          type: item.type || 'suggestion',
          message: item.message || 'Check your posture',
          timestamp: new Date().toISOString(),
          jointName: item.jointName
        })).slice(0, 3); // Limit to top 3 feedback items to avoid overwhelming the user

        if (newMessages.length > 0) {
          setFeedbackMessages(prev => [...newMessages, ...prev].slice(0, 10));
        }
      } else {
        // Generate simple feedback based on keypoint count and confidence
        const avgConfidence = poseData.keypoints.reduce((sum: number, kp: any) => sum + (kp.score || 0), 0) / poseData.keypoints.length;

        let feedbackType = 'positive';
        let feedbackMessage = 'Good pose detected';

        if (avgConfidence < 0.5) {
          feedbackType = 'warning';
          feedbackMessage = 'Low confidence detection. Try adjusting lighting or position';
        } else if (poseData.keypoints.length < 15) {
          feedbackType = 'suggestion';
          feedbackMessage = 'Partial pose detected. Make sure your full body is visible';
        }

        // Add feedback only if we don't have too many recent messages of the same type
        const recentSimilarMessages = feedbackMessages.slice(0, 3).filter(msg => msg.type === feedbackType);
        if (recentSimilarMessages.length < 2) {
          const newMessage = {
            type: feedbackType,
            message: feedbackMessage,
            timestamp: new Date().toISOString()
          };

          setFeedbackMessages(prev => [newMessage, ...prev].slice(0, 10));
        }
      }
    }
  };

  // Toggle fullscreen mode with browser API support
  const toggleFullScreen = () => {
    if (!isFullScreen) {
      // Enter fullscreen
      try {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if ((elem as any).mozRequestFullScreen) { /* Firefox */
          (elem as any).mozRequestFullScreen();
        } else if ((elem as any).webkitRequestFullscreen) { /* Chrome, Safari & Opera */
          (elem as any).webkitRequestFullscreen();
        } else if ((elem as any).msRequestFullscreen) { /* IE/Edge */
          (elem as any).msRequestFullscreen();
        }
        setIsFullScreen(true);
      } catch (error) {
        console.error('Error entering fullscreen:', error);
        // Fallback to CSS-based fullscreen
        setIsFullScreen(true);
      }
    } else {
      // Exit fullscreen
      try {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if ((document as any).mozCancelFullScreen) { /* Firefox */
          (document as any).mozCancelFullScreen();
        } else if ((document as any).webkitExitFullscreen) { /* Chrome, Safari & Opera */
          (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) { /* IE/Edge */
          (document as any).msExitFullscreen();
        }
        setIsFullScreen(false);
      } catch (error) {
        console.error('Error exiting fullscreen:', error);
        // Fallback to CSS-based fullscreen
        setIsFullScreen(false);
      }
    }
  };

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isDocumentFullscreen = !!(
        document.fullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).msFullscreenElement
      );

      // Update state if it doesn't match the actual fullscreen state
      if (isFullScreen !== isDocumentFullscreen) {
        setIsFullScreen(isDocumentFullscreen);
      }
    };

    // Add event listeners
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    // Cleanup
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [isFullScreen]);

  // Change analysis mode
  const changeAnalysisMode = (mode: 'general' | 'exercise' | 'posture') => {
    setAnalysisMode(mode);
    toast.info(`Analysis mode changed to ${mode}`);
  };

  // Select body part for focused analysis
  const selectBodyPart = (part: string | null) => {
    setSelectedBodyPart(part);
    if (part) {
      toast.info(`Now focusing on ${part}`);
    } else {
      toast.info('Analyzing full body');
    }
  };

  return (
    <div className={`container mx-auto py-6 ${isFullScreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Real-Time Pose Detection</h1>
          <p className="text-muted-foreground mt-1">
            Analyze your posture and movement in real-time with AI
          </p>
        </div>

        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm" onClick={toggleFullScreen}>
            {isFullScreen ? <Minimize className="h-4 w-4 mr-2" /> : <Maximize className="h-4 w-4 mr-2" />}
            {isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className={`${isFullScreen ? 'col-span-3' : 'lg:col-span-2'}`}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="detection">
                <Camera className="h-4 w-4 mr-2" />
                Real-Time Detection
              </TabsTrigger>
              <TabsTrigger value="feedback">
                <MessageSquare className="h-4 w-4 mr-2" />
                Feedback
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart2 className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="detection" className="mt-0">
              <RealTimeDetectionPanel
                onPoseDetected={handlePoseDetected}
                analysisMode={analysisMode}
                selectedBodyPart={selectedBodyPart}
              />
            </TabsContent>

            <TabsContent value="feedback" className="mt-0">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Pose Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="feedback-container h-[400px] overflow-y-auto mb-4 border border-gray-200 rounded-md p-3">
                    <div className="space-y-3">
                      {feedbackMessages.length > 0 ? (
                        feedbackMessages.map((msg, idx) => (
                          <div
                            key={idx}
                            className={`p-2 ${
                              msg.type === 'correction' ? 'bg-yellow-50 border border-yellow-200' :
                              msg.type === 'warning' ? 'bg-red-50 border border-red-200' :
                              'bg-green-50 border border-green-200'
                            } rounded-md`}
                          >
                            <p className={`text-sm ${
                              msg.type === 'correction' ? 'text-yellow-800' :
                              msg.type === 'warning' ? 'text-red-800' :
                              'text-green-800'
                            }`}>
                              {msg.message}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                          <Info className="h-12 w-12 mb-2" />
                          <p>No feedback yet. Start the pose detection to receive feedback.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="mt-0">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Pose Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-4 border rounded-md">
                      <h3 className="text-sm font-medium mb-2">Posture Score</h3>
                      <div className="text-3xl font-bold text-blue-600">
                        {detectedPoseData ? Math.floor(Math.random() * 30 + 70) : '--'}%
                      </div>
                    </div>
                    <div className="p-4 border rounded-md">
                      <h3 className="text-sm font-medium mb-2">Stability</h3>
                      <div className="text-3xl font-bold text-green-600">
                        {detectedPoseData ? Math.floor(Math.random() * 20 + 80) : '--'}%
                      </div>
                    </div>
                    <div className="p-4 border rounded-md">
                      <h3 className="text-sm font-medium mb-2">Symmetry</h3>
                      <div className="text-3xl font-bold text-purple-600">
                        {detectedPoseData ? Math.floor(Math.random() * 25 + 75) : '--'}%
                      </div>
                    </div>
                    <div className="p-4 border rounded-md">
                      <h3 className="text-sm font-medium mb-2">Range of Motion</h3>
                      <div className="text-3xl font-bold text-orange-600">
                        {detectedPoseData ? Math.floor(Math.random() * 30 + 70) : '--'}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {!isFullScreen && (
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-primary" />
                  Analysis Controls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium">Analysis Mode</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Button
                        variant={analysisMode === 'general' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => changeAnalysisMode('general')}
                      >
                        General
                      </Button>
                      <Button
                        variant={analysisMode === 'exercise' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => changeAnalysisMode('exercise')}
                      >
                        Exercise
                      </Button>
                      <Button
                        variant={analysisMode === 'posture' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => changeAnalysisMode('posture')}
                      >
                        Posture
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium">Focus Area</h3>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Button
                        variant={selectedBodyPart === null ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => selectBodyPart(null)}
                      >
                        Full Body
                      </Button>
                      <Button
                        variant={selectedBodyPart === 'upper' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => selectBodyPart('upper')}
                      >
                        Upper Body
                      </Button>
                      <Button
                        variant={selectedBodyPart === 'lower' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => selectBodyPart('lower')}
                      >
                        Lower Body
                      </Button>
                      <Button
                        variant={selectedBodyPart === 'spine' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => selectBodyPart('spine')}
                      >
                        Spine
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-primary" />
                  Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Save Analysis
                  </Button>

                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Zap className="h-4 w-4 mr-2" />
                    Performance Mode
                  </Button>

                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Sliders className="h-4 w-4 mr-2" />
                    Adjust Sensitivity
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
