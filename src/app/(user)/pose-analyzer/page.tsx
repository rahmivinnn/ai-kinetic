"use client";

import { useState } from "react";
import { PoseAnalysis } from "@/components/user/pose-analysis";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Camera, Upload } from "lucide-react";
import Link from "next/link";

export default function PoseAnalyzerPage() {
  const [mode, setMode] = useState<'live' | 'upload'>('live');
  const [results, setResults] = useState<any>(null);

  const handleAnalysisComplete = (analysisResults: any) => {
    setResults(analysisResults);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Link href="/dashboard" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">MediaPipe Pose Analyzer</h1>
          <p className="text-muted-foreground">Analyze your exercise form using AI-powered pose detection</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center">
                <CardTitle>Pose Analysis</CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    variant={mode === 'live' ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setMode('live')}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Live Camera
                  </Button>
                  <Button 
                    variant={mode === 'upload' ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setMode('upload')}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Video
                  </Button>
                </div>
              </div>
              <CardDescription>
                {mode === 'live' 
                  ? 'Perform your exercise in front of the camera for real-time analysis' 
                  : 'Upload a video of your exercise for analysis'}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <PoseAnalysis 
                mode={mode}
                onAnalysisComplete={handleAnalysisComplete}
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>
                Understanding the MediaPipe pose detection technology
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">1. Pose Detection</h3>
                <p className="text-sm text-muted-foreground">
                  MediaPipe uses machine learning to detect 33 key points on the human body, including joints and facial landmarks.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">2. Real-time Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  The system analyzes your movements in real-time, comparing joint angles and positions to ideal form.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">3. Feedback Generation</h3>
                <p className="text-sm text-muted-foreground">
                  Based on the analysis, the system provides actionable feedback to improve your exercise form.
                </p>
              </div>
              
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">Tips for Best Results</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Ensure good lighting in your environment</li>
                  <li>• Wear clothing that makes your joints visible</li>
                  <li>• Position your camera to capture your full body</li>
                  <li>• Perform movements slowly and deliberately</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          {results && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
                <CardDescription>
                  Summary of your exercise form analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Overall Score:</span>
                  <span className="text-lg font-bold">{results.score}%</span>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Feedback:</h3>
                  <ul className="text-sm space-y-2">
                    {results.feedback.map((item: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="text-xs text-muted-foreground mt-4">
                  Analysis completed: {new Date(results.timestamp).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
