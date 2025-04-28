'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { videoAPI } from '@/lib/api';
import { toast } from 'sonner';
import { AlertCircle, CheckCircle, Play, Download } from 'lucide-react';

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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Movement Analysis</CardTitle>
        <CardDescription>
          AI-powered analysis of your {video?.title || 'exercise'} video
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="issues">Issues ({analysis.issues.length})</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Form Score</span>
                  <span className="text-sm">{analysis.formScore}%</span>
                </div>
                <Progress value={analysis.formScore} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Movement Quality</span>
                  <span className="text-sm">{analysis.movementQuality}%</span>
                </div>
                <Progress value={analysis.movementQuality} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Range of Motion</span>
                  <span className="text-sm">{analysis.rangeOfMotion}%</span>
                </div>
                <Progress value={analysis.rangeOfMotion} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Symmetry</span>
                  <span className="text-sm">{analysis.symmetry}%</span>
                </div>
                <Progress value={analysis.symmetry} className="h-2" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">AI Notes</h3>
              <p className="text-sm text-muted-foreground">{analysis.aiNotes}</p>
            </div>

            {analysis.therapistNotes && (
              <div className="space-y-2 border-t pt-4">
                <h3 className="text-sm font-medium">Therapist Notes</h3>
                <p className="text-sm text-muted-foreground">{analysis.therapistNotes}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="issues" className="space-y-4 pt-4">
            {analysis.issues.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <CheckCircle className="h-16 w-16 text-primary mb-4" />
                <h3 className="text-lg font-medium">No Issues Detected</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Great job! No significant issues were detected in your movement.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {analysis.issues.map((issue, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-medium capitalize">{issue.type} Issue</h3>
                      <Badge className={getSeverityColor(issue.severity)}>
                        {issue.severity} severity
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{issue.description}</p>
                    {issue.timeMarkers && (
                      <Button variant="outline" size="sm" className="mt-2">
                        <Play className="h-4 w-4 mr-2" />
                        View at {issue.timeMarkers.start}s
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4 pt-4">
            <div className="space-y-4">
              {analysis.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <p className="text-sm">{recommendation}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
          <Button size="sm">
            View Full Video
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
