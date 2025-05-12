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
  Upload,
  Camera,
  Video,
  MessageSquare,
  BarChart2,
  Settings,
  Users,
  Layers,
  Calendar,
  ArrowRight,
  CheckCircle,
  Clock
} from 'lucide-react';

// Import our custom components
import DetectionPanel from "@/components/pose-detection/detection-panel";
import UploadPanel from "@/components/video-upload/upload-panel";
import FeedbackPanel from "@/components/pose-feedback/feedback-panel";
import AdvancedPoseAnalyzer from "@/components/advanced-pose-analyzer";

// Import action buttons
import {
  CheckStatusButton,
  SyncDataButton,
  CheckForUpdatesButton
} from "@/components/ui/action-buttons";

export default function EnhancedPoseDetectionPage() {
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | undefined>();
  const [uploadedFileName, setUploadedFileName] = useState<string | undefined>();
  const [detectedPoseData, setDetectedPoseData] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('detection');

  // Handle video upload completion
  const handleUploadComplete = (fileUrl: string, fileName: string) => {
    setUploadedVideoUrl(fileUrl);
    setUploadedFileName(fileName);

    // Reset pose data when a new video is uploaded
    setDetectedPoseData(null);

    // Automatically switch to detection tab after upload
    setActiveTab('detection');

    // Show a toast notification
    toast.success(`Video "${fileName}" ready for analysis`);
  };

  // Handle pose detection completion
  const handlePoseDetected = (poseData: any) => {
    // Update the detected pose data
    setDetectedPoseData(poseData);

    // In a real implementation, we would process the pose data here
    // and update the state accordingly

    // For demonstration purposes, we'll simulate real-time updates
    // by generating new pose data periodically
    if (poseData) {
      // Add a small random variation to the data to simulate movement
      setTimeout(() => {
        const updatedData = {
          ...poseData,
          score: Math.min(1, Math.max(0, poseData.score + (Math.random() * 0.1 - 0.05))),
          keypoints: poseData.keypoints.map((kp: any) => ({
            ...kp,
            position: {
              x: kp.position.x + (Math.random() * 4 - 2),
              y: kp.position.y + (Math.random() * 4 - 2)
            },
            score: Math.min(1, Math.max(0, kp.score + (Math.random() * 0.1 - 0.05)))
          }))
        };

        // Update pose data with a slight delay to simulate processing time
        setDetectedPoseData(updatedData);
      }, 500);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Pose Detection & Analysis</h1>
          <p className="text-muted-foreground mt-1">
            Upload a video or use your camera to analyze body posture and movement
          </p>
        </div>

        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <CheckStatusButton onClick={() => console.log('Checking status')} />
          <SyncDataButton onClick={() => console.log('Syncing data')} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="upload">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </TabsTrigger>
              <TabsTrigger value="detection">
                <Camera className="h-4 w-4 mr-2" />
                Detection
              </TabsTrigger>
              <TabsTrigger value="feedback">
                <MessageSquare className="h-4 w-4 mr-2" />
                Feedback
              </TabsTrigger>
              <TabsTrigger value="advanced">
                <BarChart2 className="h-4 w-4 mr-2" />
                Advanced
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-0">
              <UploadPanel onUploadComplete={handleUploadComplete} />
            </TabsContent>

            <TabsContent value="detection" className="mt-0">
              <DetectionPanel
                videoUrl={uploadedVideoUrl}
                onPoseDetected={handlePoseDetected}
              />
            </TabsContent>

            <TabsContent value="feedback" className="mt-0">
              <FeedbackPanel poseData={detectedPoseData} />
            </TabsContent>

            <TabsContent value="advanced" className="mt-0">
              <AdvancedPoseAnalyzer />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <Activity className="h-5 w-5 mr-2 text-primary" />
                Session Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Current Video</h3>
                  {uploadedFileName ? (
                    <div className="flex items-center mt-1">
                      <Video className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{uploadedFileName}</span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">No video uploaded</p>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium">Detection Status</h3>
                  <div className="flex items-center mt-1">
                    {detectedPoseData ? (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Pose Detected
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        Waiting for Detection
                      </Badge>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start"
                      onClick={() => setActiveTab('upload')}
                    >
                      <Upload className="h-3 w-3 mr-1" />
                      Upload
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start"
                      onClick={() => setActiveTab('detection')}
                    >
                      <Camera className="h-3 w-3 mr-1" />
                      Detect
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start"
                      onClick={() => setActiveTab('feedback')}
                    >
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Feedback
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start"
                      onClick={() => setActiveTab('advanced')}
                    >
                      <BarChart2 className="h-3 w-3 mr-1" />
                      Advanced
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
                  <Users className="h-4 w-4 mr-2" />
                  Multi-Person Detection
                </Button>

                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Layers className="h-4 w-4 mr-2" />
                  3D Pose Estimation
                </Button>

                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Pose Templates
                </Button>

                <Button variant="outline" className="w-full justify-start" size="sm">
                  <CheckForUpdatesButton onClick={() => console.log('Checking for updates')} className="w-full justify-start" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <Activity className="h-5 w-5 mr-2 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start space-x-3 p-2 hover:bg-muted/50 rounded-md transition-colors">
                    <div className="bg-primary/10 p-1 rounded-full">
                      {i === 1 ? (
                        <Upload className="h-4 w-4 text-primary" />
                      ) : i === 2 ? (
                        <Camera className="h-4 w-4 text-primary" />
                      ) : (
                        <MessageSquare className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {i === 1 ? "Video Uploaded" : i === 2 ? "Pose Detected" : "Feedback Generated"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {i === 1 ? "Just now" : i === 2 ? "5 minutes ago" : "10 minutes ago"}
                      </p>
                    </div>
                  </div>
                ))}

                <Button variant="ghost" size="sm" className="w-full text-primary justify-center mt-2">
                  View All Activity
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
