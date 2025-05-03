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
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 border-b border-blue-100">
              <CardTitle className="text-blue-900">MediaPipe Technology</CardTitle>
              <CardDescription className="text-blue-700">
                Advanced AI-powered pose detection and analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 pt-5">
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-blue-100">
                <div className="bg-white p-3 rounded-full shadow-sm">
                  <svg width="40" height="40" viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M96 9L15 52V140L96 183L177 140V52L96 9Z" fill="#4285F4"/>
                    <path d="M96 183L15 140V52L96 9V183Z" fill="#0D47A1"/>
                    <path d="M96 67L40 97V157L96 127V67Z" fill="#EEEEEE"/>
                    <path d="M96 67L152 97V157L96 127V67Z" fill="#FFFFFF"/>
                    <path d="M96 9L177 52L96 67L15 52L96 9Z" fill="#FFFFFF"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">Google MediaPipe</h3>
                  <p className="text-sm text-blue-700">
                    Industry-leading computer vision framework used by professionals worldwide
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 p-4 bg-white rounded-xl border border-blue-100 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM9 16.5L16.5 12L9 7.5V16.5Z" fill="#4285F4"/>
                      </svg>
                    </div>
                    <h3 className="font-medium text-blue-900">1. Pose Detection</h3>
                  </div>
                  <p className="text-sm text-blue-700 pl-9">
                    MediaPipe uses advanced ML models to detect 33 key points on the human body with high precision, including:
                  </p>
                  <div className="grid grid-cols-2 gap-2 pl-9">
                    <div className="text-xs bg-blue-50 p-2 rounded">
                      <span className="font-medium text-blue-900">Face (5 points)</span>
                      <p className="text-blue-700">Nose, eyes, ears</p>
                    </div>
                    <div className="text-xs bg-blue-50 p-2 rounded">
                      <span className="font-medium text-blue-900">Torso (4 points)</span>
                      <p className="text-blue-700">Shoulders, hips</p>
                    </div>
                    <div className="text-xs bg-blue-50 p-2 rounded">
                      <span className="font-medium text-blue-900">Arms (10 points)</span>
                      <p className="text-blue-700">Shoulders, elbows, wrists, hands</p>
                    </div>
                    <div className="text-xs bg-blue-50 p-2 rounded">
                      <span className="font-medium text-blue-900">Legs (8 points)</span>
                      <p className="text-blue-700">Hips, knees, ankles, feet</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 p-4 bg-white rounded-xl border border-blue-100 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 p-2 rounded-full">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 1H9V3H15V1ZM11 14H13V8H11V14ZM19.03 7.39L20.45 5.97C20.02 5.46 19.55 4.98 19.04 4.56L17.62 5.98C16.07 4.74 14.12 4 12 4C7.03 4 3 8.03 3 13C3 17.97 7.02 22 12 22C16.98 22 21 17.97 21 13C21 10.88 20.26 8.93 19.03 7.39ZM12 20C8.13 20 5 16.87 5 13C5 9.13 8.13 6 12 6C15.87 6 19 9.13 19 13C19 16.87 15.87 20 12 20Z" fill="#0F9D58"/>
                      </svg>
                    </div>
                    <h3 className="font-medium text-blue-900">2. Real-time Analysis</h3>
                  </div>
                  <p className="text-sm text-blue-700 pl-9">
                    The system performs complex biomechanical analysis in real-time:
                  </p>
                  <ul className="space-y-1 pl-9 text-sm text-blue-700">
                    <li className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                      Joint angle calculations
                    </li>
                    <li className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                      Posture alignment detection
                    </li>
                    <li className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                      Movement symmetry analysis
                    </li>
                    <li className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                      Range of motion measurement
                    </li>
                    <li className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                      Form deviation detection
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-2 p-4 bg-white rounded-xl border border-blue-100 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="bg-yellow-100 p-2 rounded-full">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V5C22 3.9 21.1 3 20 3ZM20 19H4V5H20V19ZM18 15H6V17H18V15ZM18 11H6V13H18V11ZM18 7H6V9H18V7Z" fill="#F4B400"/>
                    </svg>
                  </div>
                  <h3 className="font-medium text-blue-900">3. Feedback Generation</h3>
                </div>
                <p className="text-sm text-blue-700 pl-9">
                  Based on the analysis, the system provides detailed, actionable feedback:
                </p>
                <div className="pl-9 space-y-2 mt-2">
                  <div className="bg-yellow-50 p-2 rounded text-sm border border-yellow-100">
                    <span className="font-medium text-yellow-800">Form Correction</span>
                    <p className="text-yellow-700 text-xs">Specific guidance on how to correct your posture and alignment</p>
                  </div>
                  <div className="bg-green-50 p-2 rounded text-sm border border-green-100">
                    <span className="font-medium text-green-800">Performance Metrics</span>
                    <p className="text-green-700 text-xs">Quantitative scores for different aspects of your exercise form</p>
                  </div>
                  <div className="bg-blue-50 p-2 rounded text-sm border border-blue-100">
                    <span className="font-medium text-blue-800">Progress Tracking</span>
                    <p className="text-blue-700 text-xs">Comparison with previous sessions to show improvement over time</p>
                  </div>
                </div>
              </div>

              <div className="mt-2 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                <h3 className="font-medium text-blue-900 mb-2 flex items-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z" fill="#4285F4"/>
                  </svg>
                  Tips for Best Results
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <div className="bg-white p-1 rounded-full mt-0.5">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 3V21H21V3H3ZM19 19H5V5H19V19ZM11 7H13V13H11V7ZM11 15H13V17H11V15Z" fill="#4285F4"/>
                      </svg>
                    </div>
                    <p className="text-xs text-blue-800">Ensure good lighting in your environment</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="bg-white p-1 rounded-full mt-0.5">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM9 16H15V18H9V16ZM12 6C9.79 6 8 7.79 8 10H10C10 8.9 10.9 8 12 8C13.1 8 14 8.9 14 10C14 12 11 11.75 11 15H13C13 12.75 16 12.5 16 10C16 7.79 14.21 6 12 6Z" fill="#4285F4"/>
                      </svg>
                    </div>
                    <p className="text-xs text-blue-800">Wear clothing that makes your joints visible</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="bg-white p-1 rounded-full mt-0.5">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 3H6C5.17 3 4.46 3.5 4.16 4.22L1.14 11.27C1.05 11.5 1 11.74 1 12V14C1 15.1 1.9 16 3 16H9.31L8.36 20.57L8.33 20.89C8.33 21.3 8.5 21.68 8.77 21.95L9.83 23L16.42 16.41C16.78 16.05 17 15.55 17 15V5C17 3.9 16.1 3 15 3ZM15 15L10.66 19.34L12 14H3V12L6 5H15V15ZM19 3H23V15H19V3Z" fill="#4285F4"/>
                      </svg>
                    </div>
                    <p className="text-xs text-blue-800">Position your camera to capture your full body</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="bg-white p-1 rounded-full mt-0.5">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 3C8.03 3 4 7.03 4 12H1L4.89 15.89L4.96 16.03L9 12H6C6 8.13 9.13 5 13 5C16.87 5 20 8.13 20 12C20 15.87 16.87 19 13 19C11.07 19 9.32 18.21 8.06 16.94L6.64 18.36C8.27 19.99 10.51 21 13 21C17.97 21 22 16.97 22 12C22 7.03 17.97 3 13 3ZM12 8V13L16.28 15.54L17 14.33L13.5 12.25V8H12Z" fill="#4285F4"/>
                      </svg>
                    </div>
                    <p className="text-xs text-blue-800">Perform movements slowly and deliberately</p>
                  </div>
                </div>
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
