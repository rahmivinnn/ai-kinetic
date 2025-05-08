'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoUploadForm } from "@/components/user/video-upload";
import { ExercisePlan } from "@/components/user/exercise-plan-fixed";
import { VideoAnalysis } from "@/components/user/video-analysis";
import { PersonalizedExercisePlan } from "@/components/user/personalized-exercise-plan";
import { Activity, Calendar, MessageSquare, ArrowRight, Bell, Upload, BarChart, Video, ChevronUp, ChevronDown, Check, RefreshCw, Camera, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { appointmentAPI } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const UserHome = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('exercise-plan');
  const [showWelcomeToast, setShowWelcomeToast] = useState(true);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [refreshingStats, setRefreshingStats] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  const toggleCardExpansion = (cardId: string) => {
    if (expandedCard === cardId) {
      setExpandedCard(null);
    } else {
      setExpandedCard(cardId);
      toast.info(`Viewing details for ${cardId}`);
    }
  };

  const refreshStats = () => {
    setRefreshingStats(true);
    toast.info("Refreshing dashboard statistics...");

    setTimeout(() => {
      setDashboardStats({
        exercisesCompleted: Math.floor(Math.random() * 50) + 20,
        streak: Math.floor(Math.random() * 10) + 1,
        progress: Math.floor(Math.random() * 40) + 60,
        nextMilestone: Math.floor(Math.random() * 5) + 5
      });
      setRefreshingStats(false);
      toast.success("Dashboard statistics updated!");
    }, 1500);
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const data = await appointmentAPI.getUpcomingAppointments();
        setAppointments(data);

        // Show toast if appointments are found
        if (data.length > 0) {
          const nextAppointment = new Date(data[0].startTime);
          const formattedDate = nextAppointment.toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
          });

          toast.info(`Your next appointment is on ${formattedDate}`, {
            duration: 5000,
            position: 'top-right'
          });
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast.error('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();

    // Show welcome toast
    if (showWelcomeToast) {
      setTimeout(() => {
        toast.success(`Welcome back, ${user?.firstName || 'Patient'}!`, {
          description: "Let's continue your recovery journey today.",
          duration: 5000
        });
        setShowWelcomeToast(false);
      }, 1000);
    }
  }, [user, showWelcomeToast]);

  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    exercisesCompleted: 0,
    streak: 0,
    progress: 0,
    nextMilestone: 0
  });

  // Simulate loading dashboard stats
  useEffect(() => {
    setTimeout(() => {
      setDashboardStats({
        exercisesCompleted: Math.floor(Math.random() * 50) + 20,
        streak: Math.floor(Math.random() * 10) + 1,
        progress: Math.floor(Math.random() * 40) + 60,
        nextMilestone: Math.floor(Math.random() * 5) + 5
      });
    }, 1500);

    // Hide welcome animation after 3 seconds
    setTimeout(() => {
      setShowWelcomeAnimation(false);
    }, 3000);
  }, []);

  return (
    <div className="min-h-screen p-4">
      {/* Welcome Animation */}
      {showWelcomeAnimation && (
        <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50 animate-fade-in">
          <div className="text-center">
            <div className="inline-block rounded-full bg-primary/10 p-6 mb-4">
              <div className="rounded-full bg-primary/20 p-4">
                <div className="rounded-full bg-primary text-primary-foreground p-4">
                  <Activity className="h-10 w-10 animate-pulse" />
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.firstName || 'Patient'}!</h2>
            <p className="text-muted-foreground">Let's continue your recovery journey</p>
          </div>
        </div>
      )}

      {/* Header with gradient text */}
      <div className="mb-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-6 rounded-xl border border-blue-100 animate-fade-in shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600">
              Welcome back, {user?.firstName || 'Patient'}
            </h1>
            <p className="text-indigo-700 mt-1 font-medium">
              Here's an overview of your recovery journey
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <div
              className="bg-white p-3 rounded-lg shadow-sm border border-blue-100 cursor-pointer hover:shadow-md transition-all"
              onClick={() => toggleCardExpansion('recovery')}
            >
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Activity className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">{dashboardStats.progress}%</p>
                  <p className="text-xs text-blue-700">Recovery</p>
                </div>
                {expandedCard === 'recovery' ? (
                  <ChevronUp className="h-4 w-4 text-blue-700" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-blue-700" />
                )}
              </div>
              {expandedCard === 'recovery' && (
                <div className="mt-3 pt-3 border-t border-blue-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-blue-700">Progress</span>
                    <span className="text-xs font-medium">{dashboardStats.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${dashboardStats.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-blue-700 mt-2">Next milestone: {dashboardStats.nextMilestone} days</p>
                </div>
              )}
            </div>
            <div
              className="bg-white p-3 rounded-lg shadow-sm border border-blue-100 cursor-pointer hover:shadow-md transition-all"
              onClick={() => toggleCardExpansion('streak')}
            >
              <div className="flex items-center gap-2">
                <div className="bg-orange-100 p-2 rounded-full">
                  <span className="text-orange-700 text-sm font-bold">🔥</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">{dashboardStats.streak} days</p>
                  <p className="text-xs text-blue-700">Streak</p>
                </div>
                {expandedCard === 'streak' ? (
                  <ChevronUp className="h-4 w-4 text-blue-700" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-blue-700" />
                )}
              </div>
              {expandedCard === 'streak' && (
                <div className="mt-3 pt-3 border-t border-blue-100">
                  <p className="text-xs text-blue-700">Keep going! You're on a roll!</p>
                  <div className="flex items-center gap-1 mt-2">
                    {Array.from({ length: Math.min(dashboardStats.streak, 7) }).map((_, i) => (
                      <div key={i} className="h-2 w-2 rounded-full bg-orange-500"></div>
                    ))}
                    {Array.from({ length: Math.max(0, 7 - Math.min(dashboardStats.streak, 7)) }).map((_, i) => (
                      <div key={i} className="h-2 w-2 rounded-full bg-gray-200"></div>
                    ))}
                  </div>
                  <p className="text-xs text-green-600 mt-2">+{dashboardStats.streak} days streak bonus!</p>
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-white border-blue-100 text-blue-700 hover:bg-blue-50"
              onClick={refreshStats}
              disabled={refreshingStats}
            >
              {refreshingStats ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

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
            {loading ? (
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
              </div>
            ) : appointments.length > 0 ? (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="font-bold text-blue-700">
                      {new Date(appointments[0].startTime).getDate()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">
                      {new Date(appointments[0].startTime).toLocaleString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(appointments[0].startTime).toLocaleString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 p-2 bg-muted rounded-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop"
                    alt="Dr. Johnson"
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium">Dr. {appointments[0].physiotherapist?.lastName || 'Johnson'}</p>
                    <p className="text-xs text-muted-foreground">Physiotherapist</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center p-4 mb-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">No upcoming appointments</p>
              </div>
            )}
            <div className="flex gap-2">
              {appointments.length > 0 && (
                <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                  <Link href="/video-call">
                    <Video className="h-4 w-4 mr-2" />
                    Join Video Call
                  </Link>
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

              <div className="grid grid-cols-2 gap-2 mt-3">
                <div
                  className="bg-muted/50 p-3 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => toggleCardExpansion('exercises')}
                >
                  <div className="flex justify-between items-center">
                    <p className="text-2xl font-bold text-green-700">{dashboardStats.exercisesCompleted}</p>
                    {expandedCard === 'exercises' ? (
                      <ChevronUp className="h-4 w-4 text-green-700" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-green-700" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Exercises completed</p>

                  {expandedCard === 'exercises' && (
                    <div className="mt-2 pt-2 border-t border-muted">
                      <div className="flex justify-between items-center text-xs">
                        <span>This week:</span>
                        <span className="font-medium text-green-700">+{Math.floor(dashboardStats.exercisesCompleted * 0.3)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs mt-1">
                        <span>Last week:</span>
                        <span className="font-medium">{Math.floor(dashboardStats.exercisesCompleted * 0.7)}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full mt-2 h-7 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success("Viewing exercise history");
                          router.push('/progress-analytics');
                        }}
                      >
                        View History
                      </Button>
                    </div>
                  )}
                </div>

                <div
                  className="bg-muted/50 p-3 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => toggleCardExpansion('streak-details')}
                >
                  <div className="flex justify-between items-center">
                    <p className="text-2xl font-bold text-orange-500">{dashboardStats.streak} days</p>
                    {expandedCard === 'streak-details' ? (
                      <ChevronUp className="h-4 w-4 text-orange-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-orange-500" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Current streak</p>

                  {expandedCard === 'streak-details' && (
                    <div className="mt-2 pt-2 border-t border-muted">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 7 }).map((_, i) => (
                          <div
                            key={i}
                            className={`h-2 w-2 rounded-full ${i < dashboardStats.streak % 7 ? 'bg-orange-500' : 'bg-gray-200'}`}
                          ></div>
                        ))}
                      </div>
                      <p className="text-xs mt-2">
                        {dashboardStats.streak > 0
                          ? `You've been consistent for ${dashboardStats.streak} days!`
                          : 'Start your streak today!'}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full mt-2 h-7 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success("Viewing streak details");
                          router.push('/progress-analytics');
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => {
                setActiveTab('exercise-plan');
                document.getElementById('exercise-plan')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                <Activity className="h-4 w-4 mr-2" />
                Continue
              </Button>
              <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => {
                setActiveTab('ai-plan');
                document.getElementById('ai-plan')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                <Sparkles className="h-4 w-4 mr-2" />
                AI Plan
              </Button>
              <Button variant="outline" className="w-full col-span-2" asChild>
                <Link href="/exercise-categories">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  View All Exercises
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
                <div className="bg-cyan-100 p-2 rounded-full flex-shrink-0">
                  <Check className="h-4 w-4 text-cyan-700" />
                </div>
                <div>
                  <p className="text-sm font-medium">Real-time feedback</p>
                  <p className="text-xs text-muted-foreground mt-1">Get instant feedback on your exercise form</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="w-full bg-cyan-600 hover:bg-cyan-700" asChild>
                <Link href="/pose-analyzer">
                  <Camera className="h-4 w-4 mr-2" />
                  Open Analyzer
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Card */}
        <Card className="overflow-hidden border-2 border-primary/10 hover:shadow-lg transition-all duration-300 hover:border-primary/20 md:hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-purple-500"></div>
          <CardContent className="p-6 pt-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-purple-100 p-2 rounded-full">
                <Bell className="h-5 w-5 text-purple-700" />
              </div>
              <span className="text-sm font-medium text-purple-700">
                NOTIFICATIONS
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-3">Recent Updates</h3>

            <div className="space-y-3 mb-4">
              <div className="p-3 bg-muted/50 rounded-lg flex items-start gap-3 hover:bg-muted transition-colors cursor-pointer" onClick={() => {
                setActiveTab('analysis');
                toast.info("Viewing your latest analysis");
              }}>
                <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                  <Activity className="h-4 w-4 text-blue-700" />
                </div>
                <div>
                  <p className="text-sm font-medium">New AI analysis available</p>
                  <p className="text-xs text-muted-foreground mt-1">Your squat form has improved by 23%</p>
                  <p className="text-xs text-purple-700 mt-1">10 minutes ago</p>
                </div>
              </div>

              <div className="p-3 bg-muted/50 rounded-lg flex items-start gap-3 hover:bg-muted transition-colors cursor-pointer" onClick={() => {
                toast.info("Opening message from Dr. Johnson");
                router.push('/messages');
              }}>
                <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
                  <MessageSquare className="h-4 w-4 text-green-700" />
                </div>
                <div>
                  <p className="text-sm font-medium">Message from Dr. Johnson</p>
                  <p className="text-xs text-muted-foreground mt-1">Great progress on your knee exercises!</p>
                  <p className="text-xs text-purple-700 mt-1">1 hour ago</p>
                </div>
              </div>

              <div className="p-3 bg-muted/50 rounded-lg flex items-start gap-3 hover:bg-muted transition-colors cursor-pointer" onClick={() => {
                toast.info("Opening appointment details");
                router.push('/appointments');
              }}>
                <div className="bg-orange-100 p-2 rounded-full flex-shrink-0">
                  <Calendar className="h-4 w-4 text-orange-700" />
                </div>
                <div>
                  <p className="text-sm font-medium">Appointment Reminder</p>
                  <p className="text-xs text-muted-foreground mt-1">Session with Dr. Johnson tomorrow at 2:00 PM</p>
                  <p className="text-xs text-purple-700 mt-1">3 hours ago</p>
                </div>
              </div>
            </div>

            <Button variant="outline" asChild className="w-full">
              <Link href="/notifications">
                View All Notifications
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs
        defaultValue="exercise-plan"
        className="mb-8"
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value);
          // Show toast based on selected tab
          if (value === "exercise-plan") {
            toast.info("Let's complete your daily exercises!", {
              description: "Track your progress by marking exercises as completed.",
              duration: 3000
            });
          } else if (value === "ai-plan") {
            toast.info("Generate a personalized exercise plan", {
              description: "Our AI will create a tailored 7-day plan based on your needs.",
              duration: 3000
            });
          } else if (value === "upload-video") {
            toast.info("Upload a new exercise video", {
              description: "Our AI will analyze your form and provide feedback.",
              duration: 3000
            });
          } else if (value === "analysis") {
            toast.info("View your latest analysis", {
              description: "See how your form has improved over time.",
              duration: 3000
            });
          }
        }}
      >
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger
            value="exercise-plan"
            id="exercise-plan"
            className="transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Activity className="h-4 w-4 mr-2" />
            Exercise Plan
          </TabsTrigger>
          <TabsTrigger
            value="ai-plan"
            className="transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            AI Plan Generator
          </TabsTrigger>
          <TabsTrigger
            value="upload-video"
            className="transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Video
          </TabsTrigger>
          <TabsTrigger
            value="analysis"
            className="transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <BarChart className="h-4 w-4 mr-2" />
            Latest Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="exercise-plan" className="mt-0">
          <ExercisePlan />
        </TabsContent>

        <TabsContent value="ai-plan" className="mt-0">
          <PersonalizedExercisePlan />
        </TabsContent>

        <TabsContent value="upload-video" className="mt-0">
          <VideoUploadForm />
        </TabsContent>

        <TabsContent value="analysis" className="mt-0">
          <VideoAnalysis videoId="mock-video-id" />
        </TabsContent>
      </Tabs>

      {/* Testimonials Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center">
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 p-1 rounded-full mr-2">
              <MessageSquare className="h-5 w-5 text-white" />
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Patient Testimonials
            </span>
          </h2>
          <Button
            variant="outline"
            size="sm"
            className="border-purple-200 text-purple-700 hover:bg-purple-50"
          >
            Share Your Story
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                  MK
                </div>
                <div className="absolute -bottom-1 -right-1 bg-green-500 h-4 w-4 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="font-semibold text-purple-900">Maria K.</h3>
                <p className="text-xs text-purple-700">Knee Rehabilitation • 3 months</p>
              </div>
            </div>
            <p className="text-sm text-purple-800 italic mb-4">
              "After my ACL surgery, I was worried about recovery. The AI analysis helped me perfect my form and track progress. I'm back to running now!"
            </p>
            <div className="flex items-center justify-between">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-4 w-4 text-yellow-500 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-purple-600 font-medium">2 weeks ago</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                  JT
                </div>
                <div className="absolute -bottom-1 -right-1 bg-green-500 h-4 w-4 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">James T.</h3>
                <p className="text-xs text-blue-700">Shoulder Recovery • 6 months</p>
              </div>
            </div>
            <p className="text-sm text-blue-800 italic mb-4">
              "The real-time feedback during exercises is incredible. My physiotherapist can see my progress remotely, and the AI catches form issues I wouldn't notice."
            </p>
            <div className="flex items-center justify-between">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-4 w-4 text-yellow-500 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-blue-600 font-medium">1 month ago</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-xl border border-green-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
                  SL
                </div>
                <div className="absolute -bottom-1 -right-1 bg-green-500 h-4 w-4 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="font-semibold text-green-900">Sarah L.</h3>
                <p className="text-xs text-green-700">Back Pain • 2 months</p>
              </div>
            </div>
            <p className="text-sm text-green-800 italic mb-4">
              "As someone with chronic back pain, proper form is crucial. The AI analysis ensures I'm doing exercises correctly, and I've seen a 70% reduction in pain!"
            </p>
            <div className="flex items-center justify-between">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star, index) => (
                  <svg key={star} className={`h-4 w-4 ${index < 4 ? 'text-yellow-500' : 'text-yellow-300'} fill-current`} viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-green-600 font-medium">3 weeks ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <span className="bg-gradient-to-r from-blue-400 to-indigo-500 p-1 rounded-full mr-2">
              <Activity className="h-5 w-5 text-white" />
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Recent Activity
            </span>
          </h2>
          <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50" asChild>
            <Link href="/activity">View All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-r from-blue-400 to-indigo-500 p-3 rounded-full flex-shrink-0 shadow-sm">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-blue-900">AI Analysis Complete</h4>
                    <p className="text-sm text-blue-700">
                      Your squat form video has been analyzed
                    </p>
                  </div>
                  <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Today</span>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex-1 h-2.5 bg-blue-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-blue-700">85%</span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span className="text-xs text-blue-700">Form accuracy</span>
                  <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">+23% improvement</span>
                </div>
                <div className="mt-4">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-none shadow-sm" asChild>
                    <Link href="/video-library">
                      View Detailed Analysis
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-teal-50 p-5 rounded-xl border border-green-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-r from-green-400 to-teal-500 p-3 rounded-full flex-shrink-0 shadow-sm">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-green-900">New Message</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-6 w-6 rounded-full bg-green-200 flex items-center justify-center">
                        <span className="text-xs font-bold text-green-700">DJ</span>
                      </div>
                      <p className="text-sm text-green-700">
                        From Dr. Johnson
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">1 hour ago</span>
                </div>
                <div className="mt-3 p-4 bg-white/70 rounded-lg border border-green-100">
                  <p className="text-sm text-green-800 italic">
                    "Great progress on your knee exercises! I've noticed significant improvement in your form and range of motion. Keep up the excellent work!"
                  </p>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white border-none shadow-sm" asChild>
                    <Link href="/messages">
                      Reply Now
                      <MessageSquare className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex-1 border-green-200 text-green-700 hover:bg-green-50" asChild>
                    <Link href="/video-call">
                      Video Call
                      <Video className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-100 shadow-sm hover:shadow-md transition-all md:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h4 className="font-semibold text-amber-900 flex items-center">
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 p-1.5 rounded-full mr-2 shadow-sm">
                  <Activity className="h-5 w-5 text-white" />
                </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-700 to-orange-700">
                  Weekly Progress Summary
                </span>
              </h4>
              <span className="text-xs font-medium bg-amber-100 text-amber-700 px-3 py-1 rounded-full">Last 7 days</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border border-amber-100 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-medium text-amber-700">Exercises Completed</p>
                    <p className="text-3xl font-bold text-amber-900 mt-1">{dashboardStats.exercisesCompleted}</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-2 rounded-full shadow-sm">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="mt-3 flex items-center">
                  <div className="flex-1 h-1.5 bg-green-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                <div className="mt-2 flex items-center">
                  <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">+12% from last week</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-amber-100 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-medium text-blue-700">Form Accuracy</p>
                    <p className="text-3xl font-bold text-blue-900 mt-1">85%</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-400 to-indigo-500 p-2 rounded-full shadow-sm">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="mt-3 flex items-center">
                  <div className="flex-1 h-1.5 bg-blue-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div className="mt-2 flex items-center">
                  <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">+5% from last week</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-amber-100 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-medium text-orange-700">Pain Level</p>
                    <p className="text-3xl font-bold text-orange-900 mt-1">2/10</p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-400 to-red-500 p-2 rounded-full shadow-sm">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="mt-3 flex items-center">
                  <div className="flex-1 h-1.5 bg-orange-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
                <div className="mt-2 flex items-center">
                  <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">-3 points from initial</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-amber-100 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-medium text-purple-700">Recovery Progress</p>
                    <p className="text-3xl font-bold text-purple-900 mt-1">{dashboardStats.progress}%</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-2 rounded-full shadow-sm">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="mt-3 flex items-center">
                  <div className="flex-1 h-1.5 bg-purple-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full" style={{ width: `${dashboardStats.progress}%` }}></div>
                  </div>
                </div>
                <div className="mt-2 flex items-center">
                  <span className="text-xs font-medium bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">On track for full recovery</span>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-none shadow-sm" asChild>
                <Link href="/progress-analytics">
                  View Detailed Analytics
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
