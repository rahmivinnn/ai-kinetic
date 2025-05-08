'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { videoAPI } from '@/lib/api';
import { toast } from 'sonner';
import {
  AlertCircle, CheckCircle, Play, Download, Activity, ArrowRight, ChevronRight,
  Info, Award, BarChart3, Zap, Share2, Flame, Heart, Clock, Maximize2,
  Minimize2, SkipForward, SkipBack, Pause, Volume2, VolumeX, Camera,
  MessageSquare, ThumbsUp, Sparkles, RotateCw
} from 'lucide-react';

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
  // Basic state
  const [analysis, setAnalysis] = useState<VideoAnalysisData | null>(null);
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Enhanced interactivity state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(60); // Default duration in seconds
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [activeIssue, setActiveIssue] = useState<number | null>(null);
  const [showInsight, setShowInsight] = useState(false);
  const [insightMessage, setInsightMessage] = useState("");
  const [showAchievement, setShowAchievement] = useState(false);
  const [achievementMessage, setAchievementMessage] = useState("");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonProgress, setComparisonProgress] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);

  // Refs
  const videoRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Tips array
  const analysisTips = [
    "Focus on maintaining proper form rather than increasing repetitions",
    "Small adjustments in posture can significantly improve your results",
    "Regular video analysis helps track progress over time",
    "Share your analysis with your therapist for personalized feedback",
    "Compare your current form with previous sessions to see improvement"
  ];

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

  // Interactive video functions
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      showRandomInsight();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const seekVideo = (percent: number) => {
    const newTime = Math.floor(duration * (percent / 100));
    setCurrentTime(newTime);
  };

  const jumpToIssue = (index: number, startTime: number) => {
    setActiveIssue(index);
    setCurrentTime(startTime);
    setIsPlaying(true);

    // Show insight about this issue
    const insights = [
      "Notice how this affects your overall form",
      "This small adjustment can significantly improve your results",
      "Focusing on this area will help prevent potential injuries",
      "Correcting this issue will enhance your performance"
    ];

    setInsightMessage(insights[Math.floor(Math.random() * insights.length)]);
    setShowInsight(true);
    setTimeout(() => setShowInsight(false), 4000);
  };

  const showRandomInsight = () => {
    if (Math.random() > 0.7) {
      const insights = [
        "Your form has improved 15% since your last session!",
        "You're making excellent progress on your range of motion",
        "Your movement quality is in the top 20% of users",
        "Keep up the great work - consistency is key to recovery"
      ];

      setInsightMessage(insights[Math.floor(Math.random() * insights.length)]);
      setShowInsight(true);
      setTimeout(() => setShowInsight(false), 4000);
    }
  };

  const showRandomTip = () => {
    setCurrentTip(Math.floor(Math.random() * analysisTips.length));
    setShowTip(true);
    setTimeout(() => setShowTip(false), 5000);
  };

  const toggleSectionExpand = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
      if (Math.random() > 0.7) {
        showRandomTip();
      }
    }
  };

  const showAchievementNotification = () => {
    const achievements = [
      "Form Master! 🏆",
      "Movement Expert! 🌟",
      "Recovery Champion! 💪",
      "Perfect Posture! 🚀"
    ];

    setAchievementMessage(achievements[Math.floor(Math.random() * achievements.length)]);
    setShowAchievement(true);
    setTimeout(() => setShowAchievement(false), 4000);
  };

  // Start comparison animation
  const startComparison = () => {
    setShowComparison(true);
    setComparisonProgress(0);

    const interval = setInterval(() => {
      setComparisonProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setShowComparison(false), 1000);
          return 100;
        }
        return prev + 1;
      });
    }, 50);
  };

  // Format time for video player
  const formatVideoTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
      {/* Floating achievement notification */}
      {showAchievement && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-float-up">
          <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center">
            <Award className="h-6 w-6 mr-2 text-white animate-pulse" />
            <span className="font-bold">{achievementMessage}</span>
          </div>
        </div>
      )}

      {/* Floating insight notification */}
      {showInsight && (
        <div className="fixed bottom-8 right-8 z-50 max-w-xs animate-slide-up">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-xl shadow-lg">
            <div className="flex items-start">
              <div className="bg-white/20 p-2 rounded-full mr-3">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm mb-1">Analysis Insight</h4>
                <p className="text-sm text-indigo-100">{insightMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating tip notification */}
      {showTip && (
        <div className="fixed bottom-8 left-8 z-50 max-w-xs animate-slide-up">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-4 rounded-xl shadow-lg">
            <div className="flex items-start">
              <div className="bg-white/20 p-2 rounded-full mr-3">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm mb-1">Pro Tip</h4>
                <p className="text-sm text-blue-100">{analysisTips[currentTip]}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header with interactive video player */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 rounded-xl overflow-hidden shadow-lg mb-6 relative">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/20 animate-float-slow"></div>
          <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-white/20 animate-float-delay"></div>
        </div>

        <div className="p-6 text-white relative z-10">
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="flex items-center">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                  Movement Analysis
                </h2>
                <div className="ml-3 bg-white/20 backdrop-blur-sm rounded-full p-1.5 animate-pulse-slow">
                  <Camera className="h-5 w-5 text-purple-200" />
                </div>
              </div>
              <p className="text-purple-100 mt-1 max-w-md">
                AI-powered analysis of your {video?.title || 'exercise'} video with real-time feedback
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center border border-white/20 hover:bg-white/20 transition-all cursor-pointer group"
                onClick={showAchievementNotification}
              >
                <Award className="h-5 w-5 text-yellow-300 mr-2 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="text-xs text-purple-100">Overall Score</div>
                  <div className="text-xl font-bold group-hover:text-yellow-300 transition-colors">{analysis.formScore}%</div>
                </div>
              </div>

              <div
                className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center border border-white/20 hover:bg-white/20 transition-all cursor-pointer group"
                onClick={startComparison}
              >
                <BarChart3 className="h-5 w-5 text-blue-300 mr-2 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="text-xs text-purple-100">Compare</div>
                  <div className="text-sm font-medium group-hover:text-blue-300 transition-colors">Previous</div>
                </div>
              </div>
            </div>
          </div>

          <div
            ref={videoRef}
            className="relative aspect-video bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-inner group"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => !isPlaying && setShowControls(true)}
          >
            {/* Video comparison overlay */}
            {showComparison && (
              <div className="absolute inset-0 z-20 flex">
                <div className="w-1/2 bg-gradient-to-r from-blue-500/20 to-transparent flex items-center justify-center">
                  <div className="text-white/70 text-lg font-medium">Previous</div>
                </div>
                <div className="w-1/2 bg-gradient-to-l from-green-500/20 to-transparent flex items-center justify-center">
                  <div className="text-white/70 text-lg font-medium">Current</div>
                </div>
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-30"
                  style={{ left: `${comparisonProgress}%` }}
                ></div>
              </div>
            )}

            {/* Video thumbnail with play button */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
              onClick={togglePlay}
            >
              <div className="bg-white/20 backdrop-blur-sm p-5 rounded-full cursor-pointer hover:bg-white/30 transition-all hover:scale-110 group-hover:scale-110">
                <Play className="h-12 w-12 text-white" />
              </div>
            </div>

            {/* Video controls overlay */}
            <div
              className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}
            >
              {/* Progress bar with issues markers */}
              <div className="relative mb-3">
                <div
                  ref={progressBarRef}
                  className="h-2 bg-white/20 rounded-full overflow-hidden cursor-pointer"
                  onClick={(e) => {
                    if (progressBarRef.current) {
                      const rect = progressBarRef.current.getBoundingClientRect();
                      const percent = ((e.clientX - rect.left) / rect.width) * 100;
                      seekVideo(percent);
                    }
                  }}
                >
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  ></div>
                </div>

                {/* Issue markers */}
                {analysis.issues.map((issue, index) => issue.timeMarkers && (
                  <div
                    key={index}
                    className={`absolute h-4 w-4 rounded-full -mt-3 cursor-pointer transition-all duration-300 hover:scale-125 ${
                      activeIssue === index ? 'ring-2 ring-white' : ''
                    } ${
                      issue.severity === 'high' ? 'bg-red-500' :
                      issue.severity === 'medium' ? 'bg-orange-500' : 'bg-yellow-500'
                    }`}
                    style={{ left: `${(issue.timeMarkers.start / duration) * 100}%` }}
                    onClick={() => jumpToIssue(index, issue.timeMarkers.start)}
                    title={issue.description}
                  />
                ))}
              </div>

              {/* Control buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    className="text-white hover:text-purple-300 transition-colors"
                    onClick={togglePlay}
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6" />
                    )}
                  </button>

                  <button
                    className="text-white hover:text-purple-300 transition-colors"
                    onClick={() => seekVideo(Math.max(0, (currentTime - 5) / duration * 100))}
                  >
                    <SkipBack className="h-5 w-5" />
                  </button>

                  <button
                    className="text-white hover:text-purple-300 transition-colors"
                    onClick={() => seekVideo(Math.min(100, (currentTime + 5) / duration * 100))}
                  >
                    <SkipForward className="h-5 w-5" />
                  </button>

                  <div className="text-white text-sm">
                    {formatVideoTime(currentTime)} / {formatVideoTime(duration)}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      className="text-white hover:text-purple-300 transition-colors"
                      onClick={toggleMute}
                    >
                      {isMuted ? (
                        <VolumeX className="h-5 w-5" />
                      ) : (
                        <Volume2 className="h-5 w-5" />
                      )}
                    </button>

                    <div className="w-20 h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full"
                        style={{ width: `${isMuted ? 0 : volume}%` }}
                      ></div>
                    </div>
                  </div>

                  <button
                    className="text-white hover:text-purple-300 transition-colors"
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? (
                      <Minimize2 className="h-5 w-5" />
                    ) : (
                      <Maximize2 className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Active issue highlight */}
            {activeIssue !== null && analysis.issues[activeIssue] && (
              <div className="absolute top-4 left-4 right-4 bg-black/60 backdrop-blur-sm text-white p-3 rounded-lg border border-white/20 animate-fade-in">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${
                    analysis.issues[activeIssue].severity === 'high' ? 'bg-red-500/20' :
                    analysis.issues[activeIssue].severity === 'medium' ? 'bg-orange-500/20' : 'bg-yellow-500/20'
                  }`}>
                    <AlertCircle className={`h-5 w-5 ${
                      analysis.issues[activeIssue].severity === 'high' ? 'text-red-500' :
                      analysis.issues[activeIssue].severity === 'medium' ? 'text-orange-500' : 'text-yellow-500'
                    }`} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium capitalize">{analysis.issues[activeIssue].type} Issue</h4>
                      <Badge className={`${getSeverityColor(analysis.issues[activeIssue].severity)} ml-2`}>
                        {analysis.issues[activeIssue].severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-white/80 mt-1">{analysis.issues[activeIssue].description}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Overview */}
        <div className="md:col-span-2 space-y-6">
          <div
            className={`bg-gradient-to-br from-purple-50 via-indigo-50 to-violet-50 rounded-xl border border-purple-100 overflow-hidden shadow-sm transition-all duration-500 ${expandedSection === 'metrics' ? 'ring-2 ring-purple-300' : 'hover:shadow-md'}`}
          >
            <div
              className="p-5 border-b border-purple-100 flex justify-between items-center cursor-pointer"
              onClick={() => toggleSectionExpand('metrics')}
            >
              <h3 className="text-lg font-semibold text-purple-900 flex items-center">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-2 rounded-full mr-3 shadow-sm">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-700">
                  Performance Metrics
                </span>
              </h3>
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                  {new Date().toLocaleDateString()}
                </Badge>
                {expandedSection === 'metrics' ?
                  <ChevronUp className="h-5 w-5 text-purple-500" /> :
                  <ChevronDown className="h-5 w-5 text-purple-500" />
                }
              </div>
            </div>

            <div className={`p-5 ${expandedSection === 'metrics' ? 'animate-fade-in' : ''}`}>
              <div className="grid grid-cols-2 gap-6">
                <div
                  className="bg-white p-5 rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                  onMouseEnter={() => setHoveredMetric('form')}
                  onMouseLeave={() => setHoveredMetric(null)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center text-white mr-3 shadow-md group-hover:scale-110 transition-transform">
                        <Activity className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-purple-900 group-hover:text-purple-700 transition-colors">Form Score</div>
                        <div className="text-xs text-purple-700">Overall technique quality</div>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-purple-900 group-hover:scale-110 transition-transform">{analysis.formScore}%</div>
                  </div>

                  <div className="relative">
                    <div className="h-3 bg-purple-100 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${hoveredMetric === 'form' ? analysis.formScore : 0}%` }}
                      ></div>
                    </div>

                    {/* Rating indicators */}
                    <div className="flex justify-between mt-2 px-1">
                      <div className="text-xs text-purple-600">Poor</div>
                      <div className="text-xs text-purple-600">Excellent</div>
                    </div>
                  </div>

                  {/* Comparison with previous (only shown when hovered) */}
                  {hoveredMetric === 'form' && (
                    <div className="mt-3 bg-purple-50 p-2 rounded-lg border border-purple-100 flex items-center justify-between animate-fade-in">
                      <div className="flex items-center">
                        <RotateCw className="h-4 w-4 text-purple-600 mr-1.5" />
                        <span className="text-xs text-purple-700">Previous: 68%</span>
                      </div>
                      <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">+7%</span>
                    </div>
                  )}
                </div>

                <div
                  className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                  onMouseEnter={() => setHoveredMetric('movement')}
                  onMouseLeave={() => setHoveredMetric(null)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 flex items-center justify-center text-white mr-3 shadow-md group-hover:scale-110 transition-transform">
                        <Zap className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-blue-900 group-hover:text-blue-700 transition-colors">Movement Quality</div>
                        <div className="text-xs text-blue-700">Smoothness and control</div>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-blue-900 group-hover:scale-110 transition-transform">{analysis.movementQuality}%</div>
                  </div>

                  <div className="relative">
                    <div className="h-3 bg-blue-100 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${hoveredMetric === 'movement' ? analysis.movementQuality : 0}%` }}
                      ></div>
                    </div>

                    {/* Rating indicators */}
                    <div className="flex justify-between mt-2 px-1">
                      <div className="text-xs text-blue-600">Poor</div>
                      <div className="text-xs text-blue-600">Excellent</div>
                    </div>
                  </div>

                  {/* Comparison with previous (only shown when hovered) */}
                  {hoveredMetric === 'movement' && (
                    <div className="mt-3 bg-blue-50 p-2 rounded-lg border border-blue-100 flex items-center justify-between animate-fade-in">
                      <div className="flex items-center">
                        <RotateCw className="h-4 w-4 text-blue-600 mr-1.5" />
                        <span className="text-xs text-blue-700">Previous: 75%</span>
                      </div>
                      <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">+7%</span>
                    </div>
                  )}
                </div>

                <div
                  className="bg-white p-5 rounded-xl border border-green-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                  onMouseEnter={() => setHoveredMetric('range')}
                  onMouseLeave={() => setHoveredMetric(null)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white mr-3 shadow-md group-hover:scale-110 transition-transform">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-green-900 group-hover:text-green-700 transition-colors">Range of Motion</div>
                        <div className="text-xs text-green-700">Movement extent</div>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-green-900 group-hover:scale-110 transition-transform">{analysis.rangeOfMotion}%</div>
                  </div>

                  <div className="relative">
                    <div className="h-3 bg-green-100 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${hoveredMetric === 'range' ? analysis.rangeOfMotion : 0}%` }}
                      ></div>
                    </div>

                    {/* Rating indicators */}
                    <div className="flex justify-between mt-2 px-1">
                      <div className="text-xs text-green-600">Limited</div>
                      <div className="text-xs text-green-600">Full</div>
                    </div>
                  </div>

                  {/* Comparison with previous (only shown when hovered) */}
                  {hoveredMetric === 'range' && (
                    <div className="mt-3 bg-green-50 p-2 rounded-lg border border-green-100 flex items-center justify-between animate-fade-in">
                      <div className="flex items-center">
                        <RotateCw className="h-4 w-4 text-green-600 mr-1.5" />
                        <span className="text-xs text-green-700">Previous: 60%</span>
                      </div>
                      <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">+8%</span>
                    </div>
                  )}
                </div>

                <div
                  className="bg-white p-5 rounded-xl border border-amber-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                  onMouseEnter={() => setHoveredMetric('symmetry')}
                  onMouseLeave={() => setHoveredMetric(null)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center text-white mr-3 shadow-md group-hover:scale-110 transition-transform">
                        <Activity className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-amber-900 group-hover:text-amber-700 transition-colors">Symmetry</div>
                        <div className="text-xs text-amber-700">Left/right balance</div>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-amber-900 group-hover:scale-110 transition-transform">{analysis.symmetry}%</div>
                  </div>

                  <div className="relative">
                    <div className="h-3 bg-amber-100 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${hoveredMetric === 'symmetry' ? analysis.symmetry : 0}%` }}
                      ></div>
                    </div>

                    {/* Rating indicators */}
                    <div className="flex justify-between mt-2 px-1">
                      <div className="text-xs text-amber-600">Uneven</div>
                      <div className="text-xs text-amber-600">Balanced</div>
                    </div>
                  </div>

                  {/* Comparison with previous (only shown when hovered) */}
                  {hoveredMetric === 'symmetry' && (
                    <div className="mt-3 bg-amber-50 p-2 rounded-lg border border-amber-100 flex items-center justify-between animate-fade-in">
                      <div className="flex items-center">
                        <RotateCw className="h-4 w-4 text-amber-600 mr-1.5" />
                        <span className="text-xs text-amber-700">Previous: 65%</span>
                      </div>
                      <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">+5%</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional content when expanded */}
              {expandedSection === 'metrics' && (
                <div className="mt-6 bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-xl border border-indigo-100 animate-fade-in">
                  <h4 className="text-sm font-medium text-indigo-900 mb-3 flex items-center">
                    <Sparkles className="h-4 w-4 text-indigo-600 mr-2" />
                    Performance Insights
                  </h4>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-indigo-100 p-1.5 rounded-full">
                        <CheckCircle className="h-4 w-4 text-indigo-600" />
                      </div>
                      <p className="text-sm text-indigo-800">Your form score has improved by 7% since your last session, showing excellent progress.</p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-indigo-100 p-1.5 rounded-full">
                        <CheckCircle className="h-4 w-4 text-indigo-600" />
                      </div>
                      <p className="text-sm text-indigo-800">Range of motion shows the most improvement, indicating your flexibility is increasing.</p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-indigo-100 p-1.5 rounded-full">
                        <CheckCircle className="h-4 w-4 text-indigo-600" />
                      </div>
                      <p className="text-sm text-indigo-800">Your overall performance is in the top 25% of users with similar conditions.</p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-4 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                    onClick={showRandomTip}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Get Personalized Tips
                  </Button>
                </div>
              )}
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
          <div
            className={`bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 rounded-xl border border-red-100 overflow-hidden shadow-sm transition-all duration-500 ${expandedSection === 'issues' ? 'ring-2 ring-red-300' : 'hover:shadow-md'}`}
          >
            <div
              className="p-5 border-b border-red-100 flex justify-between items-center cursor-pointer"
              onClick={() => toggleSectionExpand('issues')}
            >
              <h3 className="text-lg font-semibold text-red-900 flex items-center">
                <div className="bg-gradient-to-r from-red-500 to-orange-500 p-2 rounded-full mr-3 shadow-sm">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-700 to-orange-700">
                  Issues Detected
                </span>
                <span className="ml-2 bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-sm">
                  {analysis.issues.length}
                </span>
              </h3>
              <div className="flex items-center gap-2">
                {expandedSection === 'issues' ?
                  <ChevronUp className="h-5 w-5 text-red-500" /> :
                  <ChevronDown className="h-5 w-5 text-red-500" />
                }
              </div>
            </div>

            <div className={`p-5 ${expandedSection === 'issues' ? 'animate-fade-in' : ''}`}>
              {analysis.issues.length === 0 ? (
                <div className="bg-white p-5 rounded-xl border border-green-100 text-center shadow-sm">
                  <div className="bg-green-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <h4 className="font-medium text-green-800 text-lg">No Issues Detected</h4>
                  <p className="text-green-700 mt-2">
                    Great job! Your form looks excellent. Keep up the good work!
                  </p>
                  <div className="mt-4 bg-green-50 p-3 rounded-lg inline-block">
                    <div className="flex items-center">
                      <Award className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-green-700">Perfect Form Achievement</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {analysis.issues.map((issue, index) => (
                    <div
                      key={index}
                      className={`bg-white p-5 rounded-xl border ${
                        issue.severity === 'high' ? 'border-red-200' :
                        issue.severity === 'medium' ? 'border-orange-200' : 'border-yellow-200'
                      } shadow-sm hover:shadow-md transition-all cursor-pointer group ${
                        activeIssue === index ? 'ring-2 ring-offset-2 ring-red-300' : ''
                      }`}
                      onClick={() => issue.timeMarkers && jumpToIssue(index, issue.timeMarkers.start)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-full mr-3 ${
                            issue.severity === 'high' ? 'bg-red-100' :
                            issue.severity === 'medium' ? 'bg-orange-100' : 'bg-yellow-100'
                          }`}>
                            <AlertCircle className={`h-5 w-5 ${
                              issue.severity === 'high' ? 'text-red-600' :
                              issue.severity === 'medium' ? 'text-orange-600' : 'text-yellow-600'
                            }`} />
                          </div>
                          <h4 className="font-medium text-gray-900 capitalize group-hover:text-red-900 transition-colors">
                            {issue.type} Issue
                          </h4>
                        </div>
                        <Badge className={`${getSeverityColor(issue.severity)} px-2.5 py-0.5 text-sm`}>
                          {issue.severity}
                        </Badge>
                      </div>

                      <p className={`text-gray-700 mb-4 group-hover:${
                        issue.severity === 'high' ? 'text-red-700' :
                        issue.severity === 'medium' ? 'text-orange-700' : 'text-yellow-700'
                      } transition-colors`}>
                        {issue.description}
                      </p>

                      {issue.timeMarkers && (
                        <div className="flex items-center justify-between">
                          <div className={`text-xs ${
                            issue.severity === 'high' ? 'text-red-600' :
                            issue.severity === 'medium' ? 'text-orange-600' : 'text-yellow-600'
                          }`}>
                            Occurs at {formatVideoTime(issue.timeMarkers.start)} - {formatVideoTime(issue.timeMarkers.end)}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className={`${
                              issue.severity === 'high' ? 'border-red-200 text-red-700 hover:bg-red-50' :
                              issue.severity === 'medium' ? 'border-orange-200 text-orange-700 hover:bg-orange-50' :
                              'border-yellow-200 text-yellow-700 hover:bg-yellow-50'
                            } transition-all group-hover:scale-105`}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Jump to Issue
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Additional content when expanded */}
                  {expandedSection === 'issues' && analysis.issues.length > 0 && (
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-xl border border-amber-100 mt-4 animate-fade-in">
                      <h4 className="text-sm font-medium text-amber-900 mb-3 flex items-center">
                        <Info className="h-4 w-4 text-amber-600 mr-2" />
                        Issue Summary
                      </h4>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-red-100 p-1.5 rounded-full mr-2">
                              <AlertCircle className="h-3.5 w-3.5 text-red-600" />
                            </div>
                            <span className="text-sm text-red-800">High Severity</span>
                          </div>
                          <span className="text-sm font-medium">
                            {analysis.issues.filter(i => i.severity === 'high').length}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-orange-100 p-1.5 rounded-full mr-2">
                              <AlertCircle className="h-3.5 w-3.5 text-orange-600" />
                            </div>
                            <span className="text-sm text-orange-800">Medium Severity</span>
                          </div>
                          <span className="text-sm font-medium">
                            {analysis.issues.filter(i => i.severity === 'medium').length}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-yellow-100 p-1.5 rounded-full mr-2">
                              <AlertCircle className="h-3.5 w-3.5 text-yellow-600" />
                            </div>
                            <span className="text-sm text-yellow-800">Low Severity</span>
                          </div>
                          <span className="text-sm font-medium">
                            {analysis.issues.filter(i => i.severity === 'low').length}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-amber-200">
                        <p className="text-sm text-amber-800">
                          Focus on addressing high severity issues first for the most significant improvement in your form.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Recommendations section */}
          <div
            className={`bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-xl border border-green-100 overflow-hidden shadow-sm transition-all duration-500 ${expandedSection === 'recommendations' ? 'ring-2 ring-green-300' : 'hover:shadow-md'}`}
          >
            <div
              className="p-5 border-b border-green-100 flex justify-between items-center cursor-pointer"
              onClick={() => toggleSectionExpand('recommendations')}
            >
              <h3 className="text-lg font-semibold text-green-900 flex items-center">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-full mr-3 shadow-sm">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-emerald-700">
                  Personalized Recommendations
                </span>
              </h3>
              <div className="flex items-center gap-2">
                {expandedSection === 'recommendations' ?
                  <ChevronUp className="h-5 w-5 text-green-500" /> :
                  <ChevronDown className="h-5 w-5 text-green-500" />
                }
              </div>
            </div>

            <div className={`p-5 ${expandedSection === 'recommendations' ? 'animate-fade-in' : ''}`}>
              <div className="space-y-4">
                {analysis.recommendations.map((recommendation, index) => (
                  <div
                    key={index}
                    className="bg-white p-5 rounded-xl border border-green-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                    onClick={showRandomTip}
                  >
                    <div className="flex items-start">
                      <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-2 rounded-full mt-0.5 mr-4 flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-800 group-hover:text-green-800 transition-colors">{recommendation}</p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-200 transition-colors">
                            Recommended
                          </Badge>
                          <Badge variant="outline" className="border-green-200 text-green-700 hover:bg-green-50 transition-colors">
                            {index === 0 ? 'Alignment' : index === 1 ? 'Technique' : 'Consistency'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Additional content when expanded */}
                {expandedSection === 'recommendations' && (
                  <div className="bg-gradient-to-br from-teal-50 to-green-50 p-5 rounded-xl border border-teal-100 mt-4 animate-fade-in">
                    <h4 className="text-sm font-medium text-teal-900 mb-3 flex items-center">
                      <Sparkles className="h-4 w-4 text-teal-600 mr-2" />
                      Implementation Plan
                    </h4>

                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg border border-teal-100">
                        <h5 className="text-sm font-medium text-teal-800 mb-2 flex items-center">
                          <span className="bg-teal-100 text-teal-700 w-5 h-5 rounded-full flex items-center justify-center mr-2 text-xs font-bold">1</span>
                          Short-term (1-2 weeks)
                        </h5>
                        <p className="text-sm text-teal-700">
                          Focus on implementing the first recommendation with daily practice sessions of 10-15 minutes.
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded-lg border border-teal-100">
                        <h5 className="text-sm font-medium text-teal-800 mb-2 flex items-center">
                          <span className="bg-teal-100 text-teal-700 w-5 h-5 rounded-full flex items-center justify-center mr-2 text-xs font-bold">2</span>
                          Mid-term (2-4 weeks)
                        </h5>
                        <p className="text-sm text-teal-700">
                          Incorporate all recommendations into your routine and upload a follow-up video for analysis.
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded-lg border border-teal-100">
                        <h5 className="text-sm font-medium text-teal-800 mb-2 flex items-center">
                          <span className="bg-teal-100 text-teal-700 w-5 h-5 rounded-full flex items-center justify-center mr-2 text-xs font-bold">3</span>
                          Long-term (1-2 months)
                        </h5>
                        <p className="text-sm text-teal-700">
                          Maintain consistent practice and schedule a follow-up with your therapist to assess progress.
                        </p>
                      </div>
                    </div>

                    <Button
                      className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-none shadow-sm"
                      onClick={showAchievementNotification}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Schedule Therapist Consultation
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons with enhanced interactivity */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              className="bg-gradient-to-r from-purple-500 via-indigo-500 to-violet-500 hover:from-purple-600 hover:via-indigo-600 hover:to-violet-600 text-white border-none shadow-md hover:shadow-lg transition-all hover:scale-[1.02] h-14"
              onClick={togglePlay}
            >
              <div className="flex flex-col items-center">
                <Play className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">View Full Video</span>
              </div>
            </Button>

            <Button
              className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white border-none shadow-md hover:shadow-lg transition-all hover:scale-[1.02] h-14"
              onClick={showRandomTip}
            >
              <div className="flex flex-col items-center">
                <Camera className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">Record New Video</span>
              </div>
            </Button>

            <Button
              variant="outline"
              className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition-all hover:scale-[1.02] h-14"
              onClick={() => {
                showAchievementNotification();
                toast.success("Report downloaded successfully", {
                  icon: <Download className="h-5 w-5 text-indigo-500" />
                });
              }}
            >
              <div className="flex flex-col items-center">
                <Download className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">Download Report</span>
              </div>
            </Button>

            <Button
              variant="outline"
              className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition-all hover:scale-[1.02] h-14"
              onClick={() => {
                toast.success("Analysis shared with your therapist", {
                  icon: <Share2 className="h-5 w-5 text-indigo-500" />
                });
              }}
            >
              <div className="flex flex-col items-center">
                <Share2 className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">Share with Therapist</span>
              </div>
            </Button>
          </div>

          {/* Feedback button */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100 flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-indigo-400 to-purple-400 p-2 rounded-full mr-3 shadow-sm">
                <ThumbsUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-indigo-900">Was this analysis helpful?</h4>
                <p className="text-xs text-indigo-700">Your feedback helps improve our AI</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                onClick={() => {
                  toast.success("Thank you for your feedback!", {
                    icon: <ThumbsUp className="h-5 w-5 text-green-500" />
                  });
                }}
              >
                Yes
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                onClick={() => {
                  setShowTip(true);
                  setTimeout(() => setShowTip(false), 5000);
                }}
              >
                No
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
