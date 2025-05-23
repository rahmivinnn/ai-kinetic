"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  PlayCircle,
  Download,
  Eye,
  Info,
  Upload,
  Plus,
  BookOpen,
  User,
  Library,
  X,
  MessageSquare,
  Camera
} from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { videoAPI } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import { LibraryVideoUploadForm } from "@/components/user/library-video-upload";
import { VideoUploadForm } from "@/components/user/video-upload";
import { PoseAnalysis } from "@/components/user/pose-analysis";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface VideoSubmission {
  id: string;
  date: string;
  title: string;
  status: string;
  duration: string;
  aiScore: string;
  description: string;
}

interface ExerciseVideo {
  id: string;
  title: string;
  level: string;
  description: string;
}

interface LibraryVideo {
  id: string;
  title: string;
  category: string;
  level: string;
  description: string;
  uploadedBy: string;
  uploadDate: string;
  thumbnailUrl: string;
  views: number;
}

interface Feedback {
  id: string;
  exercise: string;
  feedback: string;
  therapist: string;
  avatar: string;
}

export default function VideoLib() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("my-submissions");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showLibraryUploadForm, setShowLibraryUploadForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [libraryVideos, setLibraryVideos] = useState<LibraryVideo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  // Video player modal state
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<any>(null);

  // Feedback modal state
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<Feedback | null>(null);

  // Pose analysis state
  const [isPoseAnalysisModalOpen, setIsPoseAnalysisModalOpen] = useState(false);
  const [analysisMode, setAnalysisMode] = useState<'live' | 'upload'>('upload');
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  // Fetch library videos
  useEffect(() => {
    const fetchLibraryVideos = async () => {
      try {
        setIsLoading(true);
        // In a real implementation, this would call the API
        // const data = await videoAPI.getLibraryVideos();
        // setLibraryVideos(data);

        // For now, we'll use mock data
        setTimeout(() => {
          setLibraryVideos([
            {
              id: "lib1",
              title: "Proper Knee Extension Technique",
              category: "knee",
              level: "beginner",
              description: "Learn the correct form for knee extension exercises to maximize recovery and prevent injury.",
              uploadedBy: "Dr. Johnson",
              uploadDate: "June 10, 2023",
              thumbnailUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop",
              views: 1245
            },
            {
              id: "lib2",
              title: "Advanced Shoulder Mobility Exercises",
              category: "shoulder",
              level: "advanced",
              description: "A comprehensive guide to advanced shoulder mobility exercises for patients in later stages of recovery.",
              uploadedBy: "Dr. Smith",
              uploadDate: "May 22, 2023",
              thumbnailUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&h=300&fit=crop",
              views: 876
            },
            {
              id: "lib3",
              title: "Balance Training Fundamentals",
              category: "balance",
              level: "intermediate",
              description: "Essential balance training exercises to improve stability and coordination during rehabilitation.",
              uploadedBy: "Dr. Williams",
              uploadDate: "April 15, 2023",
              thumbnailUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&h=300&fit=crop",
              views: 2103
            },
            {
              id: "lib4",
              title: "Lower Back Strengthening",
              category: "back",
              level: "beginner",
              description: "Safe and effective exercises for strengthening the lower back muscles and improving core stability.",
              uploadedBy: "Dr. Johnson",
              uploadDate: "March 30, 2023",
              thumbnailUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=300&fit=crop",
              views: 1587
            }
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching library videos:', error);
        toast.error('Failed to load library videos');
        setIsLoading(false);
      }
    };

    if (activeTab === "library") {
      fetchLibraryVideos();
    }
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setShowUploadForm(false);
    setShowLibraryUploadForm(false);
  };

  const toggleUploadForm = () => {
    setShowUploadForm(!showUploadForm);
    if (showLibraryUploadForm) setShowLibraryUploadForm(false);
  };

  const toggleLibraryUploadForm = () => {
    setShowLibraryUploadForm(!showLibraryUploadForm);
    if (showUploadForm) setShowUploadForm(false);
  };

  // Handle playing video
  const handlePlayVideo = (video: any) => {
    setCurrentVideo(video);
    setIsVideoModalOpen(true);
  };

  // Handle viewing feedback
  const handleViewFeedback = (feedback: Feedback) => {
    setCurrentFeedback(feedback);
    setIsFeedbackModalOpen(true);
  };

  // Close video modal
  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    setCurrentVideo(null);
  };

  // Close feedback modal
  const closeFeedbackModal = () => {
    setIsFeedbackModalOpen(false);
    setCurrentFeedback(null);
  };

  // Open pose analysis modal with live mode
  const openLiveAnalysis = () => {
    setAnalysisMode('live');
    setAnalysisResults(null);
    setIsPoseAnalysisModalOpen(true);
  };

  // Open pose analysis modal with upload mode
  const openVideoAnalysis = (video: any) => {
    setAnalysisMode('upload');
    setCurrentVideo(video);
    setAnalysisResults(null);
    setIsPoseAnalysisModalOpen(true);
  };

  // Close pose analysis modal
  const closePoseAnalysisModal = () => {
    setIsPoseAnalysisModalOpen(false);
    setAnalysisResults(null);
  };

  // Handle analysis completion
  const handleAnalysisComplete = (results: any) => {
    setAnalysisResults(results);
    toast.success('Analysis completed with score: ' + results.score + '%');
  };

  const filteredLibraryVideos = libraryVideos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || video.category === selectedCategory;
    const matchesLevel = selectedLevel === "all" || video.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  const recentSubmissions: VideoSubmission[] = [
    {
      id: "1",
      date: "MAY 16, 2023",
      title: "Knee Extension",
      status: "Awaiting feedback",
      duration: "1:24",
      aiScore: "In Progress",
      description: "Submitted for review",
    },
    {
      id: "2",
      date: "MAY 14, 2023",
      title: "Hamstring Curl",
      status: "Feedback received from Dr. Johnson",
      duration: "2:05",
      aiScore: "87%",
      description: "Feedback received",
    },
    {
      id: "3",
      date: "MAY 12, 2023",
      title: "Balance Training",
      status: "AI analysis complete",
      duration: "1:47",
      aiScore: "78%",
      description: "AI analysis complete - 78% form accuracy",
    },
  ];

  const recommendedVideos: ExerciseVideo[] = [
    {
      id: "1",
      title: "Seated Leg Raises",
      level: "BEGINNER",
      description: "Recommended by Dr. Johnson for your recovery plan",
    },
    {
      id: "2",
      title: "Standing Balance",
      level: "INTERMEDIATE",
      description: "Next progression in your balance training series",
    },
    {
      id: "3",
      title: "Single Leg Squat",
      level: "ADVANCED",
      description: "Future goal exercise - save for later stages",
    },
  ];

  const feedbacks: Feedback[] = [
    {
      id: "1",
      exercise: "Hamstring Curl Feedback",
      feedback:
        "Good form overall. Try to maintain a slower, more controlled movement on the return phase.",
      therapist: "Dr. Johnson",
      avatar:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop",
    },
    {
      id: "2",
      exercise: "Balance Training Feedback",
      feedback:
        "Your stability has improved. Focus on keeping your core engaged throughout the exercise.",
      therapist: "Dr. Smith",
      avatar:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=50&h=50&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen p-4">
      <div className=" mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Video Library</h1>
          <div className="flex space-x-2 text-sm text-muted-foreground">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="flex flex-col space-y-2 text-sm text-muted-foreground w-full"
            >
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                <TabsTrigger
                  value="my-submissions"
                  className="relative rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none flex items-center"
                >
                  <User className="h-4 w-4 mr-2" />
                  My Submissions
                </TabsTrigger>
                <TabsTrigger
                  value="library"
                  className="relative rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none flex items-center"
                >
                  <Library className="h-4 w-4 mr-2" />
                  Video Library
                </TabsTrigger>
                <TabsTrigger
                  value="exercise-demos"
                  className="relative rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none flex items-center"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Exercise Demos
                </TabsTrigger>
                <TabsTrigger
                  value="feedback"
                  className="relative rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none flex items-center"
                >
                  <Info className="h-4 w-4 mr-2" />
                  Feedback History
                </TabsTrigger>
              </TabsList>

              {/* Tab Content */}
              <TabsContent value="my-submissions" className="mt-0 space-y-8">
                {/* Recent Submissions */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Recent Submissions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {recentSubmissions.map((submission) => (
                      <Card key={submission.id} className="p-4 space-y-4">
                        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                          <PlayCircle className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">
                            {submission.date}
                          </div>
                          <h3 className="font-semibold">{submission.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {submission.description}
                          </p>
                          <div className="flex space-x-2">
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => {
                                if (submission.id === "1") {
                                  handlePlayVideo(submission);
                                } else if (submission.id === "2") {
                                  // Find the corresponding feedback
                                  const feedback = feedbacks.find(f => f.id === "1");
                                  if (feedback) {
                                    handleViewFeedback(feedback);
                                  }
                                } else {
                                  handlePlayVideo({
                                    ...submission,
                                    aiScore: 78
                                  });
                                }
                              }}
                            >
                              {submission.id === "1"
                                ? "View Video"
                                : submission.id === "2"
                                ? "View Feedback"
                                : "View Analysis"}
                            </Button>
                            {submission.id !== "1" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toast.success("Report downloaded")}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Video Submission History */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Video Submission History</h2>
                  <div className="bg-card rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4">Date</th>
                          <th className="text-left p-4">Exercise Type</th>
                          <th className="text-left p-4">Duration</th>
                          <th className="text-left p-4">Status</th>
                          <th className="text-left p-4">AI Score</th>
                          <th className="text-left p-4"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentSubmissions.map((submission) => (
                          <tr key={submission.id} className="border-b hover:bg-muted/50 cursor-pointer">
                            <td className="p-4">{submission.date}</td>
                            <td className="p-4">{submission.title}</td>
                            <td className="p-4">{submission.duration}</td>
                            <td className="p-4">{submission.status}</td>
                            <td className="p-4">{submission.aiScore}</td>
                            <td className="p-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handlePlayVideo(submission)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (submission.id === "2") {
                                    const feedback = feedbacks.find(f => f.id === "1");
                                    if (feedback) {
                                      handleViewFeedback(feedback);
                                    }
                                  } else {
                                    toast.info(`Viewing details for ${submission.title}`);
                                  }
                                }}
                              >
                                <Info className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="library" className="mt-0 space-y-8">
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <>
                    {filteredLibraryVideos.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {filteredLibraryVideos.map((video) => (
                          <Card key={video.id} className="overflow-hidden">
                            <div className="relative">
                              <div className="aspect-video overflow-hidden">
                                <Image
                                  src={video.thumbnailUrl}
                                  alt={video.title}
                                  width={500}
                                  height={300}
                                  className="object-cover w-full h-full transition-transform hover:scale-105"
                                />
                              </div>
                              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                {video.level.charAt(0).toUpperCase() + video.level.slice(1)}
                              </div>
                              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center">
                                <Eye className="h-3 w-3 mr-1" /> {video.views.toLocaleString()}
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="text-sm font-medium text-primary mb-1">
                                {video.category.charAt(0).toUpperCase() + video.category.slice(1)} Exercises
                              </div>
                              <h3 className="font-semibold text-lg mb-2">{video.title}</h3>
                              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                {video.description}
                              </p>
                              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                                <span>By {video.uploadedBy}</span>
                                <span>{video.uploadDate}</span>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="flex-1"
                                  onClick={() => handlePlayVideo(video)}
                                >
                                  <PlayCircle className="h-4 w-4 mr-2" /> Play
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => toast.success(`Saved ${video.title} to favorites`)}
                                >
                                  Save
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => toast.success(`Downloaded ${video.title}`)}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-muted/30 rounded-lg">
                        <h3 className="text-lg font-medium mb-2">No videos found</h3>
                        <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSearchQuery("");
                            setSelectedCategory("all");
                            setSelectedLevel("all");
                          }}
                        >
                          Clear Filters
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>

              <TabsContent value="exercise-demos" className="mt-0 space-y-8">
                {/* Recommended Exercise Videos */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Recommended Exercise Videos</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {recommendedVideos.map((video) => (
                      <Card key={video.id} className="p-4 space-y-4">
                        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                          <PlayCircle className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-primary">
                            {video.level}
                          </div>
                          <h3 className="font-semibold">{video.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {video.description}
                          </p>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handlePlayVideo(video)}
                          >
                            Watch Demo
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="feedback" className="mt-0 space-y-8">
                {/* Therapist Feedback */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Therapist Feedback</h2>
                  <div className="space-y-4">
                    {feedbacks.map((feedback) => (
                      <Card key={feedback.id} className="p-4">
                        <div className="flex items-start space-x-4">
                          <Image
                            src={feedback.avatar}
                            alt={feedback.therapist}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold">{feedback.exercise}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {feedback.feedback}
                            </p>
                            <div className="flex justify-end mt-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewFeedback(feedback)}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Search and Upload Buttons */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Input
                type="text"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {activeTab === "library" && (
              <div className="flex gap-2">
                <select
                  className="px-3 py-2 rounded-md border border-input bg-background text-sm"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="knee">Knee Rehabilitation</option>
                  <option value="shoulder">Shoulder Exercises</option>
                  <option value="back">Back Strengthening</option>
                  <option value="balance">Balance Training</option>
                  <option value="general">General Fitness</option>
                </select>

                <select
                  className="px-3 py-2 rounded-md border border-input bg-background text-sm"
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {activeTab === "my-submissions" && (
              <>
                <Button
                  variant={showUploadForm ? "secondary" : "default"}
                  onClick={toggleUploadForm}
                >
                  {showUploadForm ? "Cancel" : "Upload Exercise Video"}
                  {!showUploadForm && <Upload className="ml-2 h-4 w-4" />}
                </Button>

                <Button
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={openLiveAnalysis}
                >
                  Live Pose Analysis
                  <Camera className="ml-2 h-4 w-4" />
                </Button>
              </>
            )}

            {activeTab === "library" && user?.role === "physiotherapist" && (
              <Button
                variant={showLibraryUploadForm ? "secondary" : "default"}
                onClick={toggleLibraryUploadForm}
              >
                {showLibraryUploadForm ? "Cancel" : "Add to Library"}
                {!showLibraryUploadForm && <Plus className="ml-2 h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>

        {/* Upload Forms */}
        {showUploadForm && activeTab === "my-submissions" && (
          <div className="mb-8">
            <VideoUploadForm />
          </div>
        )}

        {showLibraryUploadForm && activeTab === "library" && user?.role === "physiotherapist" && (
          <div className="mb-8">
            <LibraryVideoUploadForm />
          </div>
        )}


      </div>

      {/* Video Player Modal */}
      <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentVideo?.title || 'Video Player'}</DialogTitle>
            <DialogDescription>
              {currentVideo?.description || ''}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            {currentVideo && (
              <div className="space-y-4">
                <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                  {/* In a real implementation, this would be a video player component */}
                  {/* For now, we'll use a placeholder with play controls */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full bg-gradient-to-t from-black/60 to-transparent absolute"></div>
                    <Image
                      src={currentVideo.thumbnailUrl || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop"}
                      alt={currentVideo.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between">
                        <Button variant="default" size="sm" className="bg-white/20 backdrop-blur-sm hover:bg-white/30">
                          <PlayCircle className="h-5 w-5 mr-2" /> Play
                        </Button>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-0 text-white">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2 w-full bg-white/20 rounded-full h-1">
                        <div className="bg-primary h-1 rounded-full w-1/3"></div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-white">
                        <span>0:42</span>
                        <span>2:15</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{currentVideo.title}</h3>

                  {currentVideo.aiScore && (
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-2">AI Analysis</h4>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Overall Score</span>
                            <span className="font-medium">{currentVideo.aiScore}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div
                              className="h-2 bg-primary rounded-full"
                              style={{ width: `${currentVideo.aiScore}%` }}
                            ></div>
                          </div>
                        </div>

                        <p className="text-sm mt-2">
                          AI analysis shows good form overall. Focus on maintaining proper alignment during the exercise.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Exercise Details</h4>
                    <p className="text-sm">{currentVideo.description}</p>

                    {currentVideo.notes && (
                      <div className="mt-2">
                        <h5 className="text-sm font-medium">Notes:</h5>
                        <p className="text-sm text-muted-foreground">{currentVideo.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="mt-4 flex justify-between flex-wrap gap-2">
            <Button
              variant="default"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                closeVideoModal();
                openVideoAnalysis(currentVideo);
              }}
            >
              Analyze Pose
            </Button>
            <Button variant="outline" onClick={closeVideoModal}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feedback Modal */}
      <Dialog open={isFeedbackModalOpen} onOpenChange={setIsFeedbackModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentFeedback?.exercise || 'Therapist Feedback'}</DialogTitle>
          </DialogHeader>

          {currentFeedback && (
            <div className="mt-4 space-y-4">
              <div className="flex items-start space-x-4">
                <Image
                  src={currentFeedback.avatar}
                  alt={currentFeedback.therapist}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{currentFeedback.therapist}</h3>
                  <p className="text-sm text-muted-foreground">Physiotherapist</p>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm">{currentFeedback.feedback}</p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Additional Notes</h4>
                <p className="text-sm text-muted-foreground">
                  Continue with the current exercise plan. I've noticed significant improvement in your form since your last submission.
                  Focus on maintaining proper breathing technique during the exercise.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Your Reply</h4>
                <textarea
                  className="w-full p-2 border rounded-md h-24 text-sm"
                  placeholder="Type your response here..."
                ></textarea>
              </div>
            </div>
          )}

          <DialogFooter className="mt-4 space-x-2">
            <Button variant="outline" onClick={closeFeedbackModal}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast.success(`Reply sent to ${currentFeedback?.therapist}`);
              closeFeedbackModal();
            }}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pose Analysis Modal */}
      <Dialog open={isPoseAnalysisModalOpen} onOpenChange={setIsPoseAnalysisModalOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {analysisMode === 'live' ? 'Live Pose Analysis' : `Analyzing: ${currentVideo?.title || 'Video'}`}
            </DialogTitle>
            <DialogDescription>
              {analysisMode === 'live'
                ? 'Perform your exercise in front of the camera for real-time analysis'
                : 'AI will analyze your exercise form and provide feedback'}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <PoseAnalysis
              videoUrl={currentVideo?.url}
              onAnalysisComplete={handleAnalysisComplete}
              mode={analysisMode}
            />
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={closePoseAnalysisModal}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
