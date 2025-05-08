'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

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

export function ProgressTab() {
  const [timeframe, setTimeframe] = useState('weekly');
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

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
