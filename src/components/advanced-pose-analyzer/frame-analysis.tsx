import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Upload, Play, SkipForward, SkipBack, FileText, Download } from 'lucide-react';

const FrameAnalysis = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [totalFrames, setTotalFrames] = useState(100);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // Handle file upload
  const handleUpload = () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          // Set random number of frames for demo
          setTotalFrames(Math.floor(Math.random() * 500) + 100);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  // Handle frame navigation
  const nextFrame = () => {
    setCurrentFrame(prev => Math.min(prev + 1, totalFrames - 1));
  };

  const prevFrame = () => {
    setCurrentFrame(prev => Math.max(prev - 1, 0));
  };

  // Start analysis
  const startAnalysis = () => {
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResults({});
    }, 2000);
  };

  return (
    <div className="frame-analysis">
      <div className="upload-section mb-4">
        <Card className="border border-blue-100">
          <CardContent className="p-4">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <label htmlFor="video-upload" className="cursor-pointer">
                    <div className="flex items-center space-x-2 text-sm text-blue-600">
                      <Upload className="h-4 w-4" />
                      <span>{selectedFile ? selectedFile.name : "Select video file"}</span>
                    </div>
                    <input 
                      id="video-upload" 
                      type="file" 
                      className="hidden" 
                      accept="video/mp4,video/avi,video/mov"
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>
                <Button 
                  onClick={handleUpload} 
                  disabled={!selectedFile || isUploading}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Upload Video
                </Button>
              </div>
              
              {isUploading && (
                <div className="upload-progress">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">Uploading: {uploadProgress}%</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {uploadProgress === 100 && (
        <div className="frame-viewer mb-4">
          <Card className="border border-blue-100">
            <CardContent className="p-4">
              <div className="video-frame bg-gray-900 aspect-video rounded-lg overflow-hidden relative mb-4">
                {/* Frame preview would go here */}
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  Frame {currentFrame + 1} of {totalFrames}
                </div>
              </div>
              
              <div className="frame-controls flex items-center space-x-2 mb-4">
                <Button variant="outline" size="sm" onClick={prevFrame} disabled={currentFrame === 0}>
                  <SkipBack className="h-4 w-4" />
                </Button>
                
                <Slider
                  value={[currentFrame]}
                  max={totalFrames - 1}
                  step={1}
                  onValueChange={(value) => setCurrentFrame(value[0])}
                  className="flex-1"
                />
                
                <Button variant="outline" size="sm" onClick={nextFrame} disabled={currentFrame === totalFrames - 1}>
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="analysis-controls flex justify-between">
                <Button 
                  onClick={startAnalysis} 
                  disabled={isAnalyzing}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Analyze Frame
                </Button>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" disabled={!analysisResults}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                  
                  <Button variant="outline" size="sm" disabled={!analysisResults}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Frame
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FrameAnalysis;
