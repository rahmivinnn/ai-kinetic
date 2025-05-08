'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { videoAPI } from '@/lib/api';
import { toast } from 'sonner';
import { AlertCircle, CheckCircle, Play, Download, Activity, ArrowRight, ChevronRight, Info, Award, BarChart3, Zap, Share2 } from 'lucide-react';

interface VideoAnalysisProps {
  videoId: string;
}

interface Issue {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  timeMarkers?: {
    start: number;
    end: number;
  };
}

interface VideoAnalysisData {
  formScore: number;
  movementQuality: number;
  rangeOfMotion: number;
  symmetry: number;
  issues: Issue[];
  recommendations: string[];
  aiNotes: string;
  therapistNotes?: string;
}

export function VideoAnalysis({ videoId }: VideoAnalysisProps) {
  const [analysis, setAnalysis] = useState<VideoAnalysisData | null>(null);
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch video details
        const videoData = await videoAPI.getVideoById(videoId);
        setVideo(videoData);

        // Simulate loading delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Fetch analysis data
        const analysisData = await videoAPI.getVideoAnalysis(videoId);
        setAnalysis(analysisData);

        setError(null);

        // Show success toast
        toast.success('Analysis loaded successfully');
      } catch (err) {
        console.error('Error fetching video analysis:', err);
        setError('Failed to load video analysis data');
        toast.error('Failed to load analysis data');
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchData();
    } else {
      // If no videoId is provided, use mock data for demo purposes
      setLoading(true);
      setTimeout(() => {
        setVideo({
          _id: 'mock-video-id',
          title: 'Knee Extension Exercise',
          status: 'analyzed'
        });

        setAnalysis({
          formScore: 75,
          movementQuality: 82,
          rangeOfMotion: 68,
          symmetry: 70,
          issues: [
            {
              type: 'alignment',
              description: 'Slight misalignment in knee position during extension',
              severity: 'low',
              timeMarkers: { start: 5, end: 10 }
            },
            {
              type: 'range',
              description: 'Not achieving full extension at the top of the movement',
              severity: 'medium',
              timeMarkers: { start: 15, end: 20 }
            }
          ],
          recommendations: [
            'Focus on keeping your knee aligned with your hip and ankle',
            'Try to achieve full extension at the top of the movement',
            'Maintain a steady pace throughout the exercise'
          ],
          aiNotes: 'Overall good form with minor adjustments needed for optimal results.',
          therapistNotes: 'Great progress! Work on extending fully at the top of the movement. Try to do this exercise daily.'
        });

        setLoading(false);
        toast.success('Demo analysis loaded');
      }, 1500);
    }
  }, [videoId]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Analyzing Movement</CardTitle>
          <CardDescription>Our AI is analyzing your exercise form</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 py-4">
          <div className="flex justify-center">
            <div className="relative h-32 w-32">
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
              <div className="relative flex items-center justify-center h-full w-full rounded-full bg-primary/10">
                <Activity className="h-12 w-12 text-primary animate-pulse" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Analyzing form...</span>
                <span className="animate-pulse">In progress</span>
              </div>
              <div className="h-2 bg-muted rounded overflow-hidden">
                <div className="h-full bg-primary animate-progress" style={{ width: '70%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing movement data...</span>
                <span className="animate-pulse">In progress</span>
              </div>
              <div className="h-2 bg-muted rounded overflow-hidden">
                <div className="h-full bg-primary animate-progress" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Generating recommendations...</span>
                <span className="animate-pulse">In progress</span>
              </div>
              <div className="h-2 bg-muted rounded overflow-hidden">
                <div className="h-full bg-primary animate-progress" style={{ width: '50%' }}></div>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            This usually takes a few seconds
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error || !analysis) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Analysis Unavailable</CardTitle>
          <CardDescription>We couldn't load the analysis for this video</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-8">
          <AlertCircle className="h-16 w-16 text-destructive mb-4" />
          <p className="text-muted-foreground">{error || 'Analysis data not available'}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'medium':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'high':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="w-full">
      {/* Header with video preview */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl overflow-hidden shadow-lg mb-6">
        <div className="p-6 text-white">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold">Movement Analysis</h2>
              <p className="text-purple-100">
                AI-powered analysis of your {video?.title || 'exercise'} video
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center">
              <Award className="h-5 w-5 text-yellow-300 mr-2" />
              <div>
                <div className="text-xs text-purple-100">Overall Score</div>
                <div className="text-xl font-bold">{analysis.formScore}%</div>
              </div>
            </div>
          </div>

          <div className="relative aspect-video bg-black/30 rounded-lg overflow-hidden shadow-inner">
            {/* Video thumbnail with play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full cursor-pointer hover:bg-white/30 transition-colors">
                <Play className="h-10 w-10 text-white" />
              </div>
            </div>

            {/* Time markers for issues */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="relative h-2 bg-white/20 rounded-full">
                {analysis.issues.map((issue, index) => issue.timeMarkers && (
                  <div
                    key={index}
                    className={`absolute h-4 w-4 rounded-full -mt-1 cursor-pointer ${
                      issue.severity === 'high' ? 'bg-red-500' :
                      issue.severity === 'medium' ? 'bg-orange-500' : 'bg-yellow-500'
                    }`}
                    style={{ left: `${(issue.timeMarkers.start / 60) * 100}%` }}
                    title={issue.description}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Overview */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-purple-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-purple-900 flex items-center">
                <BarChart3 className="h-5 w-5 text-purple-700 mr-2" />
                Performance Metrics
              </h3>
              <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                {new Date().toLocaleDateString()}
              </Badge>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center text-white mr-3">
                        <Activity className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-purple-900">Form Score</div>
                        <div className="text-xs text-purple-700">Overall technique quality</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-purple-900">{analysis.formScore}%</div>
                  </div>
                  <div className="h-2.5 bg-purple-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                      style={{ width: `${analysis.formScore}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 flex items-center justify-center text-white mr-3">
                        <Zap className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-blue-900">Movement Quality</div>
                        <div className="text-xs text-blue-700">Smoothness and control</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-blue-900">{analysis.movementQuality}%</div>
                  </div>
                  <div className="h-2.5 bg-blue-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                      style={{ width: `${analysis.movementQuality}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white mr-3">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-green-900">Range of Motion</div>
                        <div className="text-xs text-green-700">Movement extent</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-green-900">{analysis.rangeOfMotion}%</div>
                  </div>
                  <div className="h-2.5 bg-green-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                      style={{ width: `${analysis.rangeOfMotion}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center text-white mr-3">
                        <Activity className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-amber-900">Symmetry</div>
                        <div className="text-xs text-amber-700">Left/right balance</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-amber-900">{analysis.symmetry}%</div>
                  </div>
                  <div className="h-2.5 bg-amber-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                      style={{ width: `${analysis.symmetry}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-indigo-100">
              <h3 className="text-lg font-semibold text-indigo-900 flex items-center">
                <Info className="h-5 w-5 text-indigo-700 mr-2" />
                Analysis Notes
              </h3>
            </div>

            <div className="p-5 space-y-5">
              <div className="bg-white/70 p-4 rounded-lg border border-indigo-100">
                <h4 className="text-sm font-medium text-indigo-900 mb-2 flex items-center">
                  <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                    <span className="text-xs font-bold text-indigo-700">AI</span>
                  </div>
                  AI Analysis
                </h4>
                <p className="text-indigo-700">{analysis.aiNotes}</p>
              </div>

              {analysis.therapistNotes && (
                <div className="bg-white/70 p-4 rounded-lg border border-indigo-100">
                  <h4 className="text-sm font-medium text-indigo-900 mb-2 flex items-center">
                    <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                      <span className="text-xs font-bold text-indigo-700">PT</span>
                    </div>
                    Therapist Notes
                  </h4>
                  <p className="text-indigo-700">{analysis.therapistNotes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column - Issues and Recommendations */}
        <div className="space-y-6">
          {/* Issues section */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border border-red-100 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-red-100">
              <h3 className="text-lg font-semibold text-red-900 flex items-center">
                <AlertCircle className="h-5 w-5 text-red-700 mr-2" />
                Issues Detected ({analysis.issues.length})
              </h3>
            </div>

            <div className="p-5">
              {analysis.issues.length === 0 ? (
                <div className="bg-white/70 p-4 rounded-lg border border-green-100 text-center">
                  <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-2" />
                  <h4 className="font-medium text-green-800">No Issues Detected</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Great job! Your form looks excellent.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {analysis.issues.map((issue, index) => (
                    <div key={index} className="bg-white/70 p-4 rounded-lg border border-red-100">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-red-900 capitalize">{issue.type} Issue</h4>
                        <Badge className={`${getSeverityColor(issue.severity)} px-2 py-0.5`}>
                          {issue.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-red-700 mb-3">{issue.description}</p>
                      {issue.timeMarkers && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-red-200 text-red-700 hover:bg-red-50"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          View at {issue.timeMarkers.start}s
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recommendations section */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-green-100">
              <h3 className="text-lg font-semibold text-green-900 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-700 mr-2" />
                Recommendations
              </h3>
            </div>

            <div className="p-5 space-y-3">
              {analysis.recommendations.map((recommendation, index) => (
                <div key={index} className="bg-white/70 p-4 rounded-lg border border-green-100">
                  <div className="flex items-start">
                    <div className="bg-green-100 text-green-700 rounded-full p-1 mt-0.5 mr-3 flex-shrink-0">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <p className="text-green-800">{recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button
              className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white border-none"
            >
              <Play className="h-4 w-4 mr-2" />
              View Full Video
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          </div>

          <Button
            variant="outline"
            className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share with Therapist
          </Button>
        </div>
      </div>
    </div>
  );
}
