"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Play,
  Upload,
  Activity,
  MessageSquare,
  LogIn,
  UserPlus,
  Eye,
  RotateCcw,
  UserCog,
  CheckCircle,
  RefreshCw,
  Bell,
  FileText,
  AlertTriangle,
  CheckCheck
} from 'lucide-react';

// 1. Start Pose Detection Button
export const StartPoseDetectionButton = ({
  onClick,
  isProcessing = false,
  className = ""
}: {
  onClick: () => void,
  isProcessing?: boolean,
  className?: string
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={isProcessing}
      className={`bg-blue-600 hover:bg-blue-700 ${className}`}
    >
      <Play className="h-4 w-4 mr-2" />
      {isProcessing ? "Processing..." : "Start Pose Detection"}
    </Button>
  );
};

// 2. Upload Video Button
export const UploadVideoButton = ({
  onFileSelect,
  isUploading = false,
  progress = 0,
  className = ""
}: {
  onFileSelect: (file: File) => void,
  isUploading?: boolean,
  progress?: number,
  className?: string
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className={`upload-video-container ${className}`}>
      <label htmlFor="video-upload">
        <div className={`flex items-center cursor-pointer ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
          <Button
            type="button"
            disabled={isUploading}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Video
          </Button>
          <input
            id="video-upload"
            type="file"
            className="hidden"
            accept="video/mp4,video/avi,video/mov"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>
      </label>

      {isUploading && (
        <div className="mt-2">
          <Progress value={progress} className="h-1" />
          <p className="text-xs text-gray-500 mt-1">Uploading: {progress}%</p>
        </div>
      )}
    </div>
  );
};

// 3. Analyze Pose Button
export const AnalyzePoseButton = ({
  onClick,
  isAnalyzing = false,
  className = ""
}: {
  onClick: () => void,
  isAnalyzing?: boolean,
  className?: string
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={isAnalyzing}
      className={`bg-green-600 hover:bg-green-700 ${className}`}
    >
      <Activity className="h-4 w-4 mr-2" />
      {isAnalyzing ? "Analyzing..." : "Analyze Pose"}
    </Button>
  );
};

// 4. Generate Feedback Button
export const GenerateFeedbackButton = ({
  onClick,
  isGenerating = false,
  className = ""
}: {
  onClick: () => void,
  isGenerating?: boolean,
  className?: string
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={isGenerating}
      className={`bg-purple-600 hover:bg-purple-700 ${className}`}
    >
      <MessageSquare className="h-4 w-4 mr-2" />
      {isGenerating ? "Generating..." : "Generate Feedback"}
    </Button>
  );
};

// 5. Sign In Button
export const SignInButton = ({
  onClick,
  className = ""
}: {
  onClick: () => void,
  className?: string
}) => {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className={className}
    >
      <LogIn className="h-4 w-4 mr-2" />
      Sign In
    </Button>
  );
};

// 6. Sign Up Button
export const SignUpButton = ({
  onClick,
  className = ""
}: {
  onClick: () => void,
  className?: string
}) => {
  return (
    <Button
      onClick={onClick}
      className={`bg-blue-600 hover:bg-blue-700 ${className}`}
    >
      <UserPlus className="h-4 w-4 mr-2" />
      Sign Up
    </Button>
  );
};

// 7. View Pose Feedback Button
export const ViewPoseFeedbackButton = ({
  onClick,
  className = ""
}: {
  onClick: () => void,
  className?: string
}) => {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className={className}
    >
      <Eye className="h-4 w-4 mr-2" />
      View Pose Feedback
    </Button>
  );
};

// 8. Retry Upload Button
export const RetryUploadButton = ({
  onClick,
  className = ""
}: {
  onClick: () => void,
  className?: string
}) => {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className={className}
    >
      <RotateCcw className="h-4 w-4 mr-2" />
      Retry Upload
    </Button>
  );
};

// 9. Update Profile Button
export const UpdateProfileButton = ({
  onClick,
  className = ""
}: {
  onClick: () => void,
  className?: string
}) => {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className={className}
    >
      <UserCog className="h-4 w-4 mr-2" />
      Update Profile
    </Button>
  );
};

// 10. Check Status Button
export const CheckStatusButton = ({
  onClick,
  className = ""
}: {
  onClick: () => void,
  className?: string
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [statusData, setStatusData] = useState<null | {
    openpose: string;
    queue: string;
    database: string;
  }>(null);

  const handleClick = () => {
    setIsChecking(true);

    // Simulate status check
    setTimeout(() => {
      setStatusData({
        openpose: "Running",
        queue: "3 videos",
        database: "Connected"
      });
      setIsChecking(false);
      onClick();
    }, 1000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          onClick={handleClick}
          variant="outline"
          className={className}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Check Status
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>System Status</DialogTitle>
        </DialogHeader>

        {isChecking ? (
          <div className="flex justify-center py-4">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : statusData ? (
          <div className="space-y-3 py-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">OpenPose:</span>
              <span className="text-sm text-green-600 font-medium">{statusData.openpose}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Processing Queue:</span>
              <span className="text-sm text-blue-600 font-medium">{statusData.queue}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Database:</span>
              <span className="text-sm text-green-600 font-medium">{statusData.database}</span>
            </div>
          </div>
        ) : (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>Unable to fetch status information.</AlertDescription>
          </Alert>
        )}
      </DialogContent>
    </Dialog>
  );
};

// 11. Sync Data Button
export const SyncDataButton = ({
  onClick,
  className = ""
}: {
  onClick: () => void,
  className?: string
}) => {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleClick = () => {
    setIsSyncing(true);

    // Simulate sync
    setTimeout(() => {
      setIsSyncing(false);
      onClick();
    }, 1500);
  };

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      disabled={isSyncing}
      className={className}
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
      {isSyncing ? "Syncing..." : "Sync Data"}
    </Button>
  );
};

// 12. Check for Updates Button
export const CheckForUpdatesButton = ({
  onClick,
  className = ""
}: {
  onClick: () => void,
  className?: string
}) => {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className={className}
    >
      <Bell className="h-4 w-4 mr-2" />
      Check for Updates
    </Button>
  );
};

// 13. View Logs Button (Admin only)
export const ViewLogsButton = ({
  onClick,
  className = ""
}: {
  onClick: () => void,
  className?: string
}) => {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className={className}
    >
      <FileText className="h-4 w-4 mr-2" />
      View Logs
    </Button>
  );
};
