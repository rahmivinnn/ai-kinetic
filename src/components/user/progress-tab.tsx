'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  LineChart,
  Calendar,
  Activity,
  TrendingUp,
  Award,
  Download,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Camera,
  RefreshCw,
  Info,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

// Mock data for progress charts
const mockWeeklyData = [
  { day: 'Mon', exercises: 5, accuracy: 82, duration: 25 },
  { day: 'Tue', exercises: 7, accuracy: 85, duration: 30 },
  { day: 'Wed', exercises: 4, accuracy: 79, duration: 20 },
  { day: 'Thu', exercises: 8, accuracy: 88, duration: 35 },
  { day: 'Fri', exercises: 6, accuracy: 84, duration: 28 },
  { day: 'Sat', exercises: 3, accuracy: 80, duration: 15 },
  { day: 'Sun', exercises: 5, accuracy: 86, duration: 22 }
];

const mockMonthlyData = [
  { week: 'Week 1', exercises: 25, accuracy: 78, duration: 120 },
  { week: 'Week 2', exercises: 32, accuracy: 82, duration: 145 },
  { week: 'Week 3', exercises: 28, accuracy: 85, duration: 135 },
  { week: 'Week 4', exercises: 35, accuracy: 87, duration: 160 }
];

const mockBodyParts = [
  { name: 'Shoulder', progress: 75, sessions: 12, improvement: 18 },
  { name: 'Knee', progress: 62, sessions: 8, improvement: 15 },
  { name: 'Back', progress: 48, sessions: 6, improvement: 10 },
  { name: 'Hip', progress: 85, sessions: 14, improvement: 22 }
];

const mockAchievements = [
  { title: 'Consistency Champion', description: 'Completed exercises for 7 days in a row', date: '2023-10-12', icon: Award },
  { title: 'Form Master', description: 'Achieved 90%+ accuracy in 5 consecutive sessions', date: '2023-10-08', icon: Activity },
  { title: 'Recovery Milestone', description: 'Reached 75% recovery for shoulder rehabilitation', date: '2023-10-05', icon: TrendingUp }
];

// Mock OpenPose data
const mockOpenPoseData = {
  sessions: [
    { date: '2023-10-15', accuracy: 78, duration: 15, posture_score: 72 },
    { date: '2023-10-12', accuracy: 82, duration: 18, posture_score: 75 },
    { date: '2023-10-09', accuracy: 85, duration: 20, posture_score: 79 },
    { date: '2023-10-06', accuracy: 80, duration: 12, posture_score: 74 },
    { date: '2023-10-03', accuracy: 76, duration: 10, posture_score: 70 }
  ],
  bodyParts: {
    shoulders: { initial: 65, current: 82, improvement: 17 },
    back: { initial: 58, current: 72, improvement: 14 },
    knees: { initial: 70, current: 85, improvement: 15 },
    hips: { initial: 62, current: 78, improvement: 16 }
  },
  trends: {
    posture_improvement: 12,
    movement_quality: 15,
    exercise_form: 18
  }
};

export function ProgressTab() {
  const router = useRouter();
  const [timeframe, setTimeframe] = useState('weekly');
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // OpenPose integration states
  const [hasOpenPoseData, setHasOpenPoseData] = useState(true);
  const [openPoseLoading, setOpenPoseLoading] = useState(false);
  const [openPoseData, setOpenPoseData] = useState(mockOpenPoseData);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const toggleCardExpansion = (cardId: string) => {
    if (expandedCard === cardId) {
      setExpandedCard(null);
    } else {
      setExpandedCard(cardId);
    }
  };

  // Function to fetch OpenPose data
  const fetchOpenPoseData = () => {
    setOpenPoseLoading(true);
    toast.info("Fetching your latest OpenPose analysis data...");

    // Simulate API call to fetch OpenPose data
    setTimeout(() => {
      // In a real implementation, this would be an actual API call
      setHasOpenPoseData(true);
      setOpenPoseLoading(false);

      // Update with new data
      setOpenPoseData({
        ...openPoseData,
        sessions: [
          { date: '2023-10-18', accuracy: 88, duration: 22, posture_score: 84 },
          ...openPoseData.sessions.slice(0, 4)
        ],
        bodyParts: {
          ...openPoseData.bodyParts,
          shoulders: { initial: 65, current: 85, improvement: 20 },
          back: { initial: 58, current: 75, improvement: 17 }
        }
      });

      toast.success("OpenPose analysis data updated successfully!", {
        description: "Your progress charts now include the latest analysis data."
      });
    }, 2000);
  };

  // Function to navigate to OpenPose Analyzer
  const goToOpenPoseAnalyzer = () => {
    router.push('/openpose-analyzer');
  };

  const handleExportData = () => {
    toast.success("Progress data exported", {
      description: "Your progress data has been exported to CSV format",
      duration: 3000
    });
    // In a real app, this would trigger a download
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold">Progress Analytics</h2>

        <div className="flex gap-2">
          <Tabs defaultValue="weekly" value={timeframe} onValueChange={setTimeframe} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>

          <Button variant="outline" size="sm" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded animate-pulse w-3/4 mb-4"></div>
                <div className="h-12 bg-muted rounded animate-pulse w-1/2 mb-2"></div>
                <div className="h-4 bg-muted rounded animate-pulse w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Activity className="h-5 w-5 text-blue-700" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">This {timeframe === 'weekly' ? 'Week' : 'Month'}</span>
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-bold">
                    {timeframe === 'weekly'
                      ? mockWeeklyData.reduce((sum, day) => sum + day.exercises, 0)
                      : mockMonthlyData.reduce((sum, week) => sum + week.exercises, 0)}
                  </h3>
                  <p className="text-sm text-muted-foreground">Exercises Completed</p>
                </div>
                <div className="mt-2 flex items-center text-green-600 text-sm">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+12% from previous {timeframe === 'weekly' ? 'week' : 'month'}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="bg-green-100 p-2 rounded-full">
                    <TrendingUp className="h-5 w-5 text-green-700" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Average</span>
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-bold">
                    {timeframe === 'weekly'
                      ? Math.round(mockWeeklyData.reduce((sum, day) => sum + day.accuracy, 0) / mockWeeklyData.length)
                      : Math.round(mockMonthlyData.reduce((sum, week) => sum + week.accuracy, 0) / mockMonthlyData.length)}%
                  </h3>
                  <p className="text-sm text-muted-foreground">Exercise Accuracy</p>
                </div>
                <div className="mt-2 flex items-center text-green-600 text-sm">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+5% from previous {timeframe === 'weekly' ? 'week' : 'month'}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Calendar className="h-5 w-5 text-purple-700" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Total</span>
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-bold">
                    {timeframe === 'weekly'
                      ? mockWeeklyData.reduce((sum, day) => sum + day.duration, 0)
                      : mockMonthlyData.reduce((sum, week) => sum + week.duration, 0)} min
                  </h3>
                  <p className="text-sm text-muted-foreground">Exercise Duration</p>
                </div>
                <div className="mt-2 flex items-center text-green-600 text-sm">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+8% from previous {timeframe === 'weekly' ? 'week' : 'month'}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <Award className="h-5 w-5 text-amber-700" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Overall</span>
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-bold">68%</h3>
                  <p className="text-sm text-muted-foreground">Recovery Progress</p>
                </div>
                <div className="mt-2 flex items-center text-green-600 text-sm">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+15% from initial assessment</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* OpenPose Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="mt-6 border-2 border-blue-100 overflow-hidden">
              <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-1 rounded-full mr-2">
                      <Camera className="h-4 w-4 text-blue-700" />
                    </div>
                    <span className="text-blue-900">OpenPose Analytics</span>
                    <Badge className="ml-2 bg-blue-100 text-blue-700 hover:bg-blue-200">
                      AI-Powered
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => toggleCardExpansion('openPose')}>
                    {expandedCard === 'openPose' ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {openPoseLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                      <p className="text-blue-600 text-sm">Fetching OpenPose data...</p>
                    </div>
                  </div>
                ) : hasOpenPoseData ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <p className="text-xs text-blue-700 font-medium">LATEST SESSION</p>
                        <p className="text-lg font-bold text-blue-900 mt-1">
                          {openPoseData.sessions[0].date}
                        </p>
                      </div>

                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <p className="text-xs text-blue-700 font-medium">POSTURE SCORE</p>
                        <p className="text-lg font-bold text-blue-900 mt-1">
                          {openPoseData.sessions[0].posture_score}%
                        </p>
                      </div>

                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <p className="text-xs text-blue-700 font-medium">FORM ACCURACY</p>
                        <p className="text-lg font-bold text-blue-900 mt-1">
                          {openPoseData.sessions[0].accuracy}%
                        </p>
                      </div>

                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <p className="text-xs text-blue-700 font-medium">SESSIONS</p>
                        <p className="text-lg font-bold text-blue-900 mt-1">
                          {openPoseData.sessions.length}
                        </p>
                      </div>
                    </div>

                    {(expandedCard === 'openPose' || true) && (
                      <div className="space-y-4 mt-4">
                        <h4 className="text-sm font-medium text-blue-900">Body Part Improvement</h4>

                        <div className="space-y-3">
                          {Object.entries(openPoseData.bodyParts).map(([part, data]) => (
                            <div key={part}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium capitalize">{part}</span>
                                <div className="flex items-center">
                                  <span className="text-xs text-green-600 mr-2">
                                    +{data.improvement}%
                                  </span>
                                  <span className="text-sm text-blue-900 font-medium">
                                    {data.current}%
                                  </span>
                                </div>
                              </div>
                              <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: `${data.current}%` }}></div>
                              </div>
                              <div className="flex justify-between mt-1">
                                <span className="text-xs text-muted-foreground">Initial: {data.initial}%</span>
                                <span className="text-xs text-muted-foreground">Current: {data.current}%</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600 border-blue-200"
                            onClick={fetchOpenPoseData}
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Refresh Data
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600 border-blue-200"
                            onClick={goToOpenPoseAnalyzer}
                          >
                            <Camera className="h-3 w-3 mr-1" />
                            Open Analyzer
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <div className="bg-blue-100 p-3 rounded-full mb-3">
                      <Camera className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-blue-900">No OpenPose Data Available</h3>
                    <p className="text-blue-700 mt-1 mb-4 max-w-md">
                      Use OpenPose Analyzer to track your posture and movement patterns over time
                    </p>
                    <Button
                      onClick={goToOpenPoseAnalyzer}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Go to OpenPose Analyzer
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Body Part Progress */}
          <Card className="mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Body Part Progress</span>
                <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => toggleCardExpansion('bodyParts')}>
                  {expandedCard === 'bodyParts' ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockBodyParts.map((part) => (
                  <div key={part.name} className={expandedCard === 'bodyParts' ? '' : 'hidden md:block'}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{part.name}</span>
                      <span className="text-sm text-muted-foreground">{part.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          part.name === 'Shoulder' ? 'bg-blue-500' :
                          part.name === 'Knee' ? 'bg-green-500' :
                          part.name === 'Back' ? 'bg-purple-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${part.progress}%` }}
                      ></div>
                    </div>
                    {expandedCard === 'bodyParts' && (
                      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                        <span>{part.sessions} sessions</span>
                        <span>+{part.improvement}% improvement</span>
                      </div>
                    )}
                  </div>
                ))}
                {!expandedCard && (
                  <Button variant="link" size="sm" className="p-0 h-auto md:hidden" onClick={() => toggleCardExpansion('bodyParts')}>
                    Show all body parts
                  </Button>
                )}
              </div>
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href="/progress-analytics">
                  View Detailed Analytics
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card className="mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAchievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <achievement.icon className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                      <h4 className="font-medium">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(achievement.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
