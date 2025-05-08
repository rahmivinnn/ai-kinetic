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
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Welcome Back, Sarah</h1>
        <p className="text-muted-foreground">Your recovery journey at a glance</p>
      </div>
      
      {/* Dashboard Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-8">
          <div 
            className={`cursor-pointer py-4 px-1 border-b-2 font-medium text-sm ${dashboardNavTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setDashboardNavTab('overview')}
          >
            Overview
          </div>
          <div 
            className={`cursor-pointer py-4 px-1 border-b-2 font-medium text-sm ${dashboardNavTab === 'exercises' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setDashboardNavTab('exercises')}
          >
            Exercises
          </div>
          <div 
            className={`cursor-pointer py-4 px-1 border-b-2 font-medium text-sm ${dashboardNavTab === 'appointments' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setDashboardNavTab('appointments')}
          >
            Appointments
          </div>
          <div 
            className={`cursor-pointer py-4 px-1 border-b-2 font-medium text-sm ${dashboardNavTab === 'messages' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setDashboardNavTab('messages')}
          >
            Messages
          </div>
          <div 
            className={`cursor-pointer py-4 px-1 border-b-2 font-medium text-sm ${dashboardNavTab === 'progress' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setDashboardNavTab('progress')}
          >
            Progress
          </div>
          <div 
            className={`cursor-pointer py-4 px-1 border-b-2 font-medium text-sm ${dashboardNavTab === 'my-submissions' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setDashboardNavTab('my-submissions')}
          >
            My Submissions
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs
        defaultValue="exercise-plan"
        className="mb-8"
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value);
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
    </div>
  );
};

export default UserHome;
