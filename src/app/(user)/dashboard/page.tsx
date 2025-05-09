'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoUploadForm } from "@/components/user/video-upload";
import { ExercisePlan } from "@/components/user/exercise-plan-fixed";
import { VideoAnalysis } from "@/components/user/video-analysis";
import { PersonalizedExercisePlan } from "@/components/user/personalized-exercise-plan";
import { AIPhysiotherapyAssistant } from "@/components/user/ai-physiotherapy-assistant";
import { Activity, Calendar, MessageSquare, ArrowRight, Bell, Upload, BarChart, Video, ChevronUp, ChevronDown, Check, RefreshCw, Camera, Sparkles, Zap } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { appointmentAPI } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Import tab components
import { OverviewTab } from "@/components/user/overview-tab";
import { ExercisesTab } from "@/components/user/exercises-tab";
import { AppointmentsTab } from "@/components/user/appointments-tab";
import { MessagesTab } from "@/components/user/messages-tab";
import { ProgressTab } from "@/components/user/progress-tab";
import { MySubmissions } from "@/components/user/my-submissions";

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
  const [dashboardNavTab, setDashboardNavTab] = useState('overview');

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
    <div className="min-h-screen">
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
            <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.firstName || 'Sarah'}!</h2>
            <p className="text-muted-foreground">Let's continue your recovery journey</p>
          </div>
        </div>
      )}

      {/* Dashboard Header */}
      <div className="mb-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-6 rounded-xl border border-blue-100 animate-fade-in shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600">
              Welcome back, {user?.firstName || (user?.email ? user.email.split('@')[0] : 'Patient')}
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

      {/* Dashboard Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-8 overflow-x-auto pb-1 scrollbar-hide">
          <div
            className={`cursor-pointer py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${dashboardNavTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setDashboardNavTab('overview')}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Overview
          </div>
          <div
            className={`cursor-pointer py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${dashboardNavTab === 'exercises' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setDashboardNavTab('exercises')}
          >
            <Activity className="h-4 w-4 mr-2" />
            Exercises
          </div>
          <div
            className={`cursor-pointer py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${dashboardNavTab === 'appointments' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setDashboardNavTab('appointments')}
          >
            <Video className="h-4 w-4 mr-2" />
            Appointments
          </div>
          <div
            className={`cursor-pointer py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${dashboardNavTab === 'messages' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setDashboardNavTab('messages')}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
          </div>
          <div
            className={`cursor-pointer py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${dashboardNavTab === 'progress' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setDashboardNavTab('progress')}
          >
            <BarChart className="h-4 w-4 mr-2" />
            Progress
          </div>
          <div
            className={`cursor-pointer py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${dashboardNavTab === 'my-submissions' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setDashboardNavTab('my-submissions')}
          >
            <Upload className="h-4 w-4 mr-2" />
            My Submissions
          </div>
          <div
            className={`cursor-pointer py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${dashboardNavTab === 'openpose' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => window.location.href = '/openpose-analyzer'}
          >
            <Camera className="h-4 w-4 mr-2" />
            OpenPose Analyzer
          </div>
          <div
            className={`cursor-pointer py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${dashboardNavTab === 'ai-physio' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setDashboardNavTab('ai-physio')}
          >
            <Zap className="h-4 w-4 mr-2" />
            AI Physio Assistant
          </div>
        </div>
      </div>

      {/* Placeholder for dashboard content */}

      {/* Dashboard Content Tabs */}
      {dashboardNavTab === 'overview' && (
        <OverviewTab />
      )}

      {dashboardNavTab === 'exercises' && (
        <ExercisesTab />
      )}

      {dashboardNavTab === 'appointments' && (
        <AppointmentsTab />
      )}

      {dashboardNavTab === 'messages' && (
        <MessagesTab />
      )}

      {dashboardNavTab === 'progress' && (
        <ProgressTab />
      )}

      {dashboardNavTab === 'my-submissions' && (
        <MySubmissions />
      )}

      {dashboardNavTab === 'ai-physio' && (
        <AIPhysiotherapyAssistant />
      )}

      {/* Main Content Tabs - Only shown in Overview */}
      {dashboardNavTab === 'overview' && (
        <Tabs
          defaultValue="exercise-plan"
          className="mb-8 mt-8"
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
      )}
    </div>
  );
};

export default UserHome;
