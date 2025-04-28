'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoUploadForm } from "@/components/user/video-upload";
import { ExercisePlan } from "@/components/user/exercise-plan";
import { VideoAnalysis } from "@/components/user/video-analysis";
import { Activity, Calendar, MessageSquare, ArrowRight, Bell, Upload, BarChart, Video } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
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

      {/* Header */}
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Welcome back, {user?.firstName || 'Patient'}</h1>
            <p className="text-blue-700 mt-1">
              Here's an overview of your recovery journey
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-100">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Activity className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">{dashboardStats.progress}%</p>
                  <p className="text-xs text-blue-700">Recovery</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-100">
              <div className="flex items-center gap-2">
                <div className="bg-orange-100 p-2 rounded-full">
                  <span className="text-orange-700 text-sm font-bold">🔥</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">{dashboardStats.streak} days</p>
                  <p className="text-xs text-blue-700">Streak</p>
                </div>
              </div>
            </div>
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
                  <img
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop"
                    alt="Dr. Johnson"
                    className="h-8 w-8 rounded-full object-cover"
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
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-green-700">{dashboardStats.exercisesCompleted}</p>
                  <p className="text-xs text-muted-foreground">Exercises completed</p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-orange-500">{dashboardStats.streak} days</p>
                  <p className="text-xs text-muted-foreground">Current streak</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => {
                setActiveTab('exercise-plan');
                document.getElementById('exercise-plan')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                <Activity className="h-4 w-4 mr-2" />
                Continue
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/exercise-categories">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  View All
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Card */}
        <Card className="overflow-hidden border-2 border-primary/10 hover:shadow-lg transition-all duration-300 hover:border-primary/20">
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
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger
            value="exercise-plan"
            id="exercise-plan"
            className="transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Activity className="h-4 w-4 mr-2" />
            Exercise Plan
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

        <TabsContent value="upload-video" className="mt-0">
          <VideoUploadForm />
        </TabsContent>

        <TabsContent value="analysis" className="mt-0">
          <VideoAnalysis videoId="mock-video-id" />
        </TabsContent>
      </Tabs>

      {/* Recent Activity */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <span className="bg-primary/10 p-1 rounded-full mr-2">
              <Activity className="h-5 w-5 text-primary" />
            </span>
            Recent Activity
          </h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/activity">View All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="overflow-hidden border-2 border-primary/10 hover:shadow-lg transition-all duration-300 hover:border-primary/20">
            <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500"></div>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                  <Activity className="h-5 w-5 text-blue-700" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">AI Analysis Complete</h4>
                      <p className="text-sm text-muted-foreground">
                        Your squat form video has been analyzed
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">Today</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="text-xs font-medium">85%</span>
                  </div>
                  <div className="mt-3 flex justify-between">
                    <span className="text-xs text-muted-foreground">Form accuracy</span>
                    <span className="text-xs text-green-600">+23% improvement</span>
                  </div>
                  <div className="mt-3">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href="/video-library">
                        View Analysis
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-2 border-primary/10 hover:shadow-lg transition-all duration-300 hover:border-primary/20">
            <div className="absolute top-0 left-0 right-0 h-1 bg-green-500"></div>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
                  <MessageSquare className="h-5 w-5 text-green-700" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">New Message</h4>
                      <p className="text-sm text-muted-foreground">
                        From Dr. Johnson
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">1 hour ago</span>
                  </div>
                  <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm italic">
                      "Great progress on your knee exercises! I've noticed significant improvement in your form and range of motion."
                    </p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700" asChild>
                      <Link href="/messages">
                        Reply
                        <MessageSquare className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href="/video-call">
                        Video Call
                        <Video className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-2 border-primary/10 hover:shadow-lg transition-all duration-300 hover:border-primary/20 md:col-span-2">
            <div className="absolute top-0 left-0 right-0 h-1 bg-orange-500"></div>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium flex items-center">
                  <span className="bg-orange-100 p-1 rounded-full mr-2">
                    <Activity className="h-4 w-4 text-orange-700" />
                  </span>
                  Weekly Progress Summary
                </h4>
                <span className="text-xs text-muted-foreground">Last 7 days</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-muted/30 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-muted-foreground">Exercises Completed</p>
                      <p className="text-2xl font-bold">{dashboardStats.exercisesCompleted}</p>
                    </div>
                    <div className="bg-green-100 p-1 rounded-full">
                      <Activity className="h-4 w-4 text-green-700" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center">
                    <span className="text-xs text-green-600">+12% from last week</span>
                  </div>
                </div>

                <div className="bg-muted/30 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-muted-foreground">Form Accuracy</p>
                      <p className="text-2xl font-bold">85%</p>
                    </div>
                    <div className="bg-blue-100 p-1 rounded-full">
                      <Activity className="h-4 w-4 text-blue-700" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center">
                    <span className="text-xs text-green-600">+5% from last week</span>
                  </div>
                </div>

                <div className="bg-muted/30 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-muted-foreground">Pain Level</p>
                      <p className="text-2xl font-bold">2/10</p>
                    </div>
                    <div className="bg-orange-100 p-1 rounded-full">
                      <Activity className="h-4 w-4 text-orange-700" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center">
                    <span className="text-xs text-green-600">-3 points from initial</span>
                  </div>
                </div>

                <div className="bg-muted/30 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-muted-foreground">Recovery Progress</p>
                      <p className="text-2xl font-bold">{dashboardStats.progress}%</p>
                    </div>
                    <div className="bg-purple-100 p-1 rounded-full">
                      <Activity className="h-4 w-4 text-purple-700" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center">
                    <span className="text-xs text-green-600">On track for full recovery</span>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/progress-analytics">
                    View Detailed Analytics
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
