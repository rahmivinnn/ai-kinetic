'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  Activity,
  Video,
  MessageSquare,
  BarChart2,
  ChevronRight,
  ArrowRight,
  Camera,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Play
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

// Mock data for appointments
const mockAppointments = [
  {
    id: 'apt-001',
    doctorName: 'Dr. Sarah Johnson',
    doctorSpecialty: 'Physiotherapist',
    doctorAvatar: '/images/doctor-1.jpg',
    date: '2023-10-20',
    startTime: '10:00',
    endTime: '10:45',
    status: 'upcoming',
    type: 'video'
  }
];

// Mock data for exercises
const mockExercises = [
  {
    id: 'ex-001',
    title: 'Shoulder External Rotation',
    category: 'Shoulder',
    duration: '5 min',
    completed: false,
    progress: 0
  },
  {
    id: 'ex-002',
    title: 'Knee Extension',
    category: 'Knee',
    duration: '8 min',
    completed: false,
    progress: 0
  },
  {
    id: 'ex-003',
    title: 'Lower Back Stretch',
    category: 'Back',
    duration: '6 min',
    completed: false,
    progress: 0
  }
];

// Mock data for messages
const mockMessages = [
  {
    id: 'msg-001',
    senderName: 'Dr. Sarah Johnson',
    senderAvatar: '/images/doctor-1.jpg',
    content: 'How is your shoulder feeling today?',
    time: '10:30 AM',
    unread: true
  },
  {
    id: 'msg-002',
    senderName: 'Dr. Michael Chen',
    senderAvatar: '/images/doctor-2.jpg',
    content: 'Your latest X-ray results look promising.',
    time: 'Yesterday',
    unread: false
  }
];

export function OverviewTab() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    exercisesCompleted: 0,
    streak: 0,
    progress: 0,
    nextMilestone: 0
  });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      setDashboardStats({
        exercisesCompleted: Math.floor(Math.random() * 50) + 20,
        streak: Math.floor(Math.random() * 10) + 1,
        progress: Math.floor(Math.random() * 40) + 60,
        nextMilestone: Math.floor(Math.random() * 5) + 5
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const isToday = (dateString: string) => {
    const today = new Date();
    const date = new Date(dateString);
    return date.toDateString() === today.toDateString();
  };

  const handleStartExercise = (id: string) => {
    toast.info("Starting exercise", {
      description: "Preparing to start your exercise session",
      duration: 3000
    });
    // In a real app, this would navigate to the exercise page
  };

  const handleJoinCall = (id: string) => {
    toast.info("Joining video call", {
      description: "Preparing to connect you with your doctor",
      duration: 3000
    });
    // In a real app, this would navigate to the video call page
  };

  return (
    <div className="space-y-6">
      {/* Today's Overview */}
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <span className="bg-primary/10 p-1 rounded-full mr-2">
          <Calendar className="h-5 w-5 text-primary" />
        </span>
        Today&apos;s Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Next Appointment Card */}
        <Card className="overflow-hidden border-2 border-primary/10 hover:shadow-lg transition-all duration-300 hover:border-primary/20">
          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500"></div>
          <CardContent className="p-6 pt-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-blue-100 p-2 rounded-full">
                <Calendar className="h-5 w-5 text-blue-700" />
              </div>
              <span className="text-sm font-medium text-blue-700">
                UPCOMING APPOINTMENT
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-3">Next Session</h3>
            {isLoading ? (
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
              </div>
            ) : mockAppointments.length > 0 ? (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="font-bold text-blue-700">
                      {new Date(mockAppointments[0].date).getDate()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">
                      {isToday(mockAppointments[0].date) ? 'Today' : formatDate(mockAppointments[0].date)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {mockAppointments[0].startTime} - {mockAppointments[0].endTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 p-2 bg-muted rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="font-bold text-blue-700">
                      {mockAppointments[0].doctorName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{mockAppointments[0].doctorName}</p>
                    <p className="text-xs text-muted-foreground">{mockAppointments[0].doctorSpecialty}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center p-4 mb-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">No upcoming appointments</p>
              </div>
            )}
            <div className="flex gap-2">
              {mockAppointments.length > 0 && mockAppointments[0].type === 'video' && (
                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => handleJoinCall(mockAppointments[0].id)}>
                  <Video className="h-4 w-4 mr-2" />
                  Join Video Call
                </Button>
              )}
              <Button variant="outline" className="w-full" asChild>
                <Link href="/appointments">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Daily Plan Card */}
        <Card className="overflow-hidden border-2 border-primary/10 hover:shadow-lg transition-all duration-300 hover:border-primary/20">
          <div className="absolute top-0 left-0 right-0 h-1 bg-green-500"></div>
          <CardContent className="p-6 pt-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-green-100 p-2 rounded-full">
                <Activity className="h-5 w-5 text-green-700" />
              </div>
              <span className="text-sm font-medium text-green-700">
                DAILY EXERCISES
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-3">Exercise Plan</h3>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Today's progress</span>
                <span className="text-sm font-medium">{dashboardStats.progress}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                  style={{ width: `${dashboardStats.progress}%` }}
                ></div>
              </div>

              <div className="space-y-2 mt-3">
                {isLoading ? (
                  <>
                    <div className="h-8 bg-muted rounded animate-pulse w-full"></div>
                    <div className="h-8 bg-muted rounded animate-pulse w-full"></div>
                  </>
                ) : (
                  mockExercises.map((exercise) => (
                    <div key={exercise.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <Activity className="h-4 w-4 text-green-700" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{exercise.title}</p>
                          <p className="text-xs text-muted-foreground">{exercise.duration}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => handleStartExercise(exercise.id)}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
                <Link href="/exercises">
                  <Activity className="h-4 w-4 mr-2" />
                  View All
                </Link>
              </Button>
              <Button className="w-full bg-purple-600 hover:bg-purple-700" asChild>
                <Link href="/ai-plan-generator">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Plan
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* MediaPipe Pose Analyzer Card */}
        <Card className="overflow-hidden border-2 border-primary/10 hover:shadow-lg transition-all duration-300 hover:border-primary/20">
          <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-500"></div>
          <CardContent className="p-6 pt-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-cyan-100 p-2 rounded-full">
                <Camera className="h-5 w-5 text-cyan-700" />
              </div>
              <span className="text-sm font-medium text-cyan-700">
                AI POSE ANALYSIS
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-3">MediaPipe Pose Analyzer</h3>

            <div className="space-y-3 mb-4">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm">Analyze your exercise form in real-time using AI-powered pose detection technology.</p>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="bg-cyan-50 p-2 rounded-lg text-center">
                    <p className="text-xs text-cyan-700 font-medium">LIVE ANALYSIS</p>
                    <p className="text-2xl font-bold text-cyan-700 mt-1">
                      <Camera className="h-6 w-6 mx-auto" />
                    </p>
                  </div>
                  <div className="bg-cyan-50 p-2 rounded-lg text-center">
                    <p className="text-xs text-cyan-700 font-medium">ACCURACY</p>
                    <p className="text-2xl font-bold text-cyan-700 mt-1">95%</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-muted/50 rounded-lg flex items-start gap-3">
                <div className="bg-cyan-100 p-1 rounded-full">
                  <CheckCircle2 className="h-4 w-4 text-cyan-700" />
                </div>
                <div>
                  <p className="text-xs font-medium">Real-time feedback on your exercise form</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button className="w-full bg-cyan-600 hover:bg-cyan-700" asChild>
                <Link href="/pose-analysis">
                  <Camera className="h-4 w-4 mr-2" />
                  Start Analysis
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/video-library">
                  <Video className="h-4 w-4 mr-2" />
                  Video Library
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Messages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between items-center">
              <span>Recent Activity</span>
              <Button variant="ghost" size="sm" className="h-8 px-2" asChild>
                <Link href="/progress-analytics">
                  <span className="text-sm font-normal">View All</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <>
                <div className="h-12 bg-muted rounded animate-pulse w-full"></div>
                <div className="h-12 bg-muted rounded animate-pulse w-full"></div>
                <div className="h-12 bg-muted rounded animate-pulse w-full"></div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle2 className="h-4 w-4 text-green-700" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Completed Shoulder Exercise</h4>
                    <p className="text-xs text-muted-foreground">Today, 9:30 AM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Video className="h-4 w-4 text-blue-700" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Uploaded Exercise Video</h4>
                    <p className="text-xs text-muted-foreground">Yesterday, 4:15 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Calendar className="h-4 w-4 text-purple-700" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Scheduled Appointment</h4>
                    <p className="text-xs text-muted-foreground">Yesterday, 11:20 AM</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between items-center">
              <span>Recent Messages</span>
              <Button variant="ghost" size="sm" className="h-8 px-2" asChild>
                <Link href="/messages">
                  <span className="text-sm font-normal">View All</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <>
                <div className="h-16 bg-muted rounded animate-pulse w-full"></div>
                <div className="h-16 bg-muted rounded animate-pulse w-full"></div>
              </>
            ) : mockMessages.length > 0 ? (
              mockMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    message.unread ? 'bg-blue-50 border border-blue-100' : 'bg-muted/30'
                  }`}
                >
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="font-bold text-blue-700">
                      {message.senderName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{message.senderName}</h4>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{message.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{message.content}</p>
                  </div>
                  {message.unread && (
                    <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>
                  )}
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center p-6 text-center">
                <div>
                  <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No recent messages</p>
                </div>
              </div>
            )}
            <Button variant="outline" className="w-full" asChild>
              <Link href="/messages">
                <MessageSquare className="h-4 w-4 mr-2" />
                Open Messages
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
