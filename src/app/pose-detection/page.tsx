"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import AdvancedPoseAnalyzer from "@/components/advanced-pose-analyzer";

// Import action buttons
import {
  StartPoseDetectionButton,
  UploadVideoButton,
  AnalyzePoseButton,
  GenerateFeedbackButton,
  ViewPoseFeedbackButton,
  RetryUploadButton,
  CheckStatusButton,
  SyncDataButton
} from "@/components/ui/action-buttons";

export default function PoseDetectionPage() {
  // Demo handlers
  const handleStartPoseDetection = () => {
    console.log("Pose detection started");
  };

  const handleFileUpload = (file: File) => {
    console.log(`File uploaded: ${file.name}`);
  };

  const handleAnalyzePose = () => {
    console.log("Pose analysis started");
  };

  const handleGenerateFeedback = () => {
    console.log("Generating feedback");
  };

  const handleViewFeedback = () => {
    console.log("Viewing pose feedback");
  };

  const handleRetryUpload = () => {
    console.log("Retrying upload");
  };

  const handleCheckStatus = () => {
    console.log("Checking system status");
  };

  const handleSyncData = () => {
    console.log("Data synchronized");
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Kinetic AI Pose Detection</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Video Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="video-container bg-gray-900 aspect-video rounded-lg overflow-hidden relative mb-4">
              {/* Video element will go here */}
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <p>Video feed will appear here</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <StartPoseDetectionButton onClick={handleStartPoseDetection} />
              <UploadVideoButton onFileSelect={handleFileUpload} />
              <AnalyzePoseButton onClick={handleAnalyzePose} />
              <GenerateFeedbackButton onClick={handleGenerateFeedback} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Pose Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="feedback-container h-[300px] overflow-y-auto mb-4 border border-gray-200 rounded-md p-3">
              <div className="space-y-3">
                <div className="p-2 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-800">Good posture alignment detected.</p>
                </div>

                <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">Slight imbalance in shoulder position.</p>
                </div>

                <div className="p-2 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800">Knee angle too sharp during squat.</p>
                </div>

                <div className="p-2 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800">Try to maintain a neutral spine position.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <ViewPoseFeedbackButton onClick={handleViewFeedback} />
              <SyncDataButton onClick={handleSyncData} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="advanced">
        <TabsList className="mb-4">
          <TabsTrigger value="advanced">Advanced Analysis</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="advanced">
          <AdvancedPoseAnalyzer />
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Analysis History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Squat Analysis</h3>
                    <span className="text-sm text-gray-500">Today, 2:30 PM</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">5 issues detected, 3 improvements suggested</p>
                </div>

                <div className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Running Form</h3>
                    <span className="text-sm text-gray-500">Yesterday, 10:15 AM</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">2 issues detected, 1 improvement suggested</p>
                </div>

                <div className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Deadlift Form</h3>
                    <span className="text-sm text-gray-500">Jul 15, 2023</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">3 issues detected, 2 improvements suggested</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Detection Sensitivity</h3>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option>High</option>
                      <option selected>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Feedback Detail Level</h3>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option>Basic</option>
                      <option selected>Detailed</option>
                      <option>Expert</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Video Quality</h3>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option>Low (480p)</option>
                      <option selected>Medium (720p)</option>
                      <option>High (1080p)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">System Status</h3>
                    <div className="flex space-x-2">
                      <CheckStatusButton onClick={handleCheckStatus} />
                      <RetryUploadButton onClick={handleRetryUpload} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
