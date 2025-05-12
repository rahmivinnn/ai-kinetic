import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  File,
  X,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Play,
  Pause,
  Video
} from 'lucide-react';
import { UploadVideoButton, RetryUploadButton } from "@/components/ui/action-buttons";

interface UploadPanelProps {
  onUploadComplete?: (fileUrl: string, fileName: string) => void;
  maxFileSize?: number; // in MB
  allowedFormats?: string[];
}

const UploadPanel: React.FC<UploadPanelProps> = ({
  onUploadComplete,
  maxFileSize = 100, // Default 100MB
  allowedFormats = ['.mp4', '.avi', '.mov']
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle file selection
  const handleFileSelect = (file: File) => {
    // Reset states
    setUploadError(null);
    setUploadSuccess(false);
    setUploadProgress(0);

    // Validate file size
    if (file.size > maxFileSize * 1024 * 1024) {
      setUploadError(`File size exceeds the maximum limit of ${maxFileSize}MB`);
      return;
    }

    // Validate file format
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (!allowedFormats.includes(fileExtension)) {
      setUploadError(`File format not supported. Allowed formats: ${allowedFormats.join(', ')}`);
      return;
    }

    // Set selected file and create preview URL
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  // Clear selected file
  const clearSelectedFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadSuccess(false);
    setUploadError(null);
    setUploadProgress(0);
  };

  // Handle upload
  const handleUpload = () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadError(null);

    // Calculate number of chunks based on file size
    const chunkSize = 1024 * 1024; // 1MB chunks
    const totalChunks = Math.ceil(selectedFile.size / chunkSize);
    let currentChunk = 0;

    // Simulate chunked upload with variable speed based on file size
    const uploadNextChunk = () => {
      if (currentChunk >= totalChunks) {
        // Upload complete
        setIsUploading(false);
        setUploadSuccess(true);

        // Call the callback with the file URL
        if (onUploadComplete && previewUrl) {
          onUploadComplete(previewUrl, selectedFile.name);
        }

        return;
      }

      // Simulate network delay (faster for smaller files)
      const delay = Math.min(200, 50 + (selectedFile.size / (1024 * 1024)) * 5);

      setTimeout(() => {
        currentChunk++;
        const progress = Math.round((currentChunk / totalChunks) * 100);
        setUploadProgress(progress);
        uploadNextChunk();
      }, delay);
    };

    // Start upload process
    uploadNextChunk();
  };

  // Handle retry
  const handleRetry = () => {
    setUploadError(null);
    setUploadProgress(0);
    setUploadSuccess(false);
  };

  // Toggle video playback
  const togglePlayback = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <Card className="upload-panel">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <Upload className="h-5 w-5 mr-2 text-primary" />
          Video Upload
        </CardTitle>
      </CardHeader>

      <CardContent>
        {!selectedFile ? (
          <div className="upload-area">
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors">
              <Video className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload a Video</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Supported formats: {allowedFormats.join(', ')}
                <br />
                Maximum file size: {maxFileSize}MB
              </p>

              <UploadVideoButton
                onFileSelect={handleFileSelect}
                className="mx-auto"
              />
            </div>
          </div>
        ) : (
          <div className="selected-file-area">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="bg-primary/10 p-2 rounded-md mr-3">
                  <File className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">{selectedFile.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)}MB
                  </p>
                </div>
              </div>

              {!isUploading && !uploadSuccess && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={clearSelectedFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {previewUrl && (
              <div className="video-preview mb-4 relative">
                <video
                  ref={videoRef}
                  src={previewUrl}
                  className="w-full h-auto rounded-md bg-black"
                  controls={false}
                  onEnded={() => setIsPlaying(false)}
                />

                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-full h-10 w-10 p-0"
                    onClick={togglePlayback}
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            {uploadError && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{uploadError}</AlertDescription>
              </Alert>
            )}

            {isUploading && (
              <div className="upload-progress mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Uploading...</span>
                  <span className="text-sm">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {uploadSuccess && (
              <Alert className="mb-4 bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-700">
                  Video uploaded successfully
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-between">
              {!uploadSuccess ? (
                <>
                  {uploadError ? (
                    <RetryUploadButton onClick={handleRetry} />
                  ) : (
                    <Button
                      onClick={handleUpload}
                      disabled={isUploading || !selectedFile}
                      className="w-full"
                    >
                      {isUploading ? (
                        <>
                          <span className="animate-spin mr-2">
                            <RotateCcw className="h-4 w-4" />
                          </span>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Video
                        </>
                      )}
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  variant="outline"
                  onClick={clearSelectedFile}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Another Video
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UploadPanel;
