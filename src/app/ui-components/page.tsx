"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// Import all action buttons
import {
  StartPoseDetectionButton,
  UploadVideoButton,
  AnalyzePoseButton,
  GenerateFeedbackButton,
  SignInButton,
  SignUpButton,
  ViewPoseFeedbackButton,
  RetryUploadButton,
  UpdateProfileButton,
  CheckStatusButton,
  SyncDataButton,
  CheckForUpdatesButton,
  ViewLogsButton
} from "@/components/ui/action-buttons";

export default function UIComponentsPage() {
  // Demo handlers
  const handleStartPoseDetection = () => {
    toast.success("Pose detection started");
  };

  const handleFileUpload = (file: File) => {
    toast.success(`File uploaded: ${file.name}`);
  };

  const handleAnalyzePose = () => {
    toast.success("Pose analysis started");
  };

  const handleGenerateFeedback = () => {
    toast.success("Generating feedback");
  };

  const handleSignIn = () => {
    toast.success("Sign in clicked");
  };

  const handleSignUp = () => {
    toast.success("Sign up clicked");
  };

  const handleViewFeedback = () => {
    toast.success("Viewing pose feedback");
  };

  const handleRetryUpload = () => {
    toast.success("Retrying upload");
  };

  const handleUpdateProfile = () => {
    toast.success("Update profile clicked");
  };

  const handleCheckStatus = () => {
    toast.success("Checking system status");
  };

  const handleSyncData = () => {
    toast.success("Data synchronized");
  };

  const handleCheckUpdates = () => {
    toast.success("Checking for updates");
  };

  const handleViewLogs = () => {
    toast.success("Viewing system logs");
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Kinetic AI UI Components</h1>

      <Tabs defaultValue="action-buttons">
        <TabsList className="mb-4">
          <TabsTrigger value="action-buttons">Action Buttons</TabsTrigger>
          <TabsTrigger value="pose-detection">Pose Detection</TabsTrigger>
          <TabsTrigger value="user-actions">User Actions</TabsTrigger>
          <TabsTrigger value="admin-actions">Admin Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="action-buttons">
          <Card>
            <CardHeader>
              <CardTitle>Action Buttons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Start Pose Detection</h3>
                  <StartPoseDetectionButton onClick={handleStartPoseDetection} />
                  <p className="text-xs text-gray-500">Initiates OpenPose-based body pose detection</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Upload Video</h3>
                  <UploadVideoButton onFileSelect={handleFileUpload} />
                  <p className="text-xs text-gray-500">Uploads user video for analysis</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Analyze Pose</h3>
                  <AnalyzePoseButton onClick={handleAnalyzePose} />
                  <p className="text-xs text-gray-500">Starts real-time analysis of body posture</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Generate Feedback</h3>
                  <GenerateFeedbackButton onClick={handleGenerateFeedback} />
                  <p className="text-xs text-gray-500">Gives health-related recommendations based on pose</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Sign In</h3>
                  <SignInButton onClick={handleSignIn} />
                  <p className="text-xs text-gray-500">Opens modal or redirects for user login</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Sign Up</h3>
                  <SignUpButton onClick={handleSignUp} />
                  <p className="text-xs text-gray-500">Opens user registration form</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">View Pose Feedback</h3>
                  <ViewPoseFeedbackButton onClick={handleViewFeedback} />
                  <p className="text-xs text-gray-500">Shows dynamic recommendations based on analysis</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Retry Upload</h3>
                  <RetryUploadButton onClick={handleRetryUpload} />
                  <p className="text-xs text-gray-500">Reattempts video upload after failure</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Update Profile</h3>
                  <UpdateProfileButton onClick={handleUpdateProfile} />
                  <p className="text-xs text-gray-500">Lets user modify profile info</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Check Status</h3>
                  <CheckStatusButton onClick={handleCheckStatus} />
                  <p className="text-xs text-gray-500">Checks backend service health</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Sync Data</h3>
                  <SyncDataButton onClick={handleSyncData} />
                  <p className="text-xs text-gray-500">Triggers frontend-backend data sync</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Check for Updates</h3>
                  <CheckForUpdatesButton onClick={handleCheckUpdates} />
                  <p className="text-xs text-gray-500">Fetches logs or version updates from backend</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">View Logs (Admin)</h3>
                  <ViewLogsButton onClick={handleViewLogs} />
                  <p className="text-xs text-gray-500">Displays server logs for debugging</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pose-detection">
          <Card>
            <CardHeader>
              <CardTitle>Pose Detection Components</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Video Upload and Processing</h3>
                  <div className="flex space-x-4">
                    <UploadVideoButton onFileSelect={handleFileUpload} />
                    <StartPoseDetectionButton onClick={handleStartPoseDetection} />
                    <AnalyzePoseButton onClick={handleAnalyzePose} />
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">Feedback Generation</h3>
                  <div className="flex space-x-4">
                    <GenerateFeedbackButton onClick={handleGenerateFeedback} />
                    <ViewPoseFeedbackButton onClick={handleViewFeedback} />
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">Error Handling</h3>
                  <div className="flex space-x-4">
                    <RetryUploadButton onClick={handleRetryUpload} />
                    <CheckStatusButton onClick={handleCheckStatus} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user-actions">
          <Card>
            <CardHeader>
              <CardTitle>User Action Components</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Authentication</h3>
                  <div className="flex space-x-4">
                    <SignInButton onClick={handleSignIn} />
                    <SignUpButton onClick={handleSignUp} />
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">User Profile</h3>
                  <div className="flex space-x-4">
                    <UpdateProfileButton onClick={handleUpdateProfile} />
                    <SyncDataButton onClick={handleSyncData} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin-actions">
          <Card>
            <CardHeader>
              <CardTitle>Admin Action Components</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">System Management</h3>
                  <div className="flex space-x-4">
                    <CheckStatusButton onClick={handleCheckStatus} />
                    <ViewLogsButton onClick={handleViewLogs} />
                    <CheckForUpdatesButton onClick={handleCheckUpdates} />
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
