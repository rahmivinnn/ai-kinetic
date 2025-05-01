"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PlayCircle, Download, Eye, Info, Upload, Plus, BookOpen, User, Library } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { videoAPI } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import { LibraryVideoUploadForm } from "@/components/user/library-video-upload";
import { VideoUploadForm } from "@/components/user/video-upload";

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
              className="flex space-x-2 text-sm text-muted-foreground w-full"
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
              <Button
                variant={showUploadForm ? "secondary" : "default"}
                onClick={toggleUploadForm}
              >
                {showUploadForm ? "Cancel" : "Upload Exercise Video"}
                {!showUploadForm && <Upload className="ml-2 h-4 w-4" />}
              </Button>
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
                        onClick={() => toast.info(`Viewing ${submission.id === "1" ? "video" : submission.id === "2" ? "feedback" : "analysis"}`)}
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
                          onClick={() => toast.info(`Viewing video for ${submission.title}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toast.info(`Viewing details for ${submission.title}`)}
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
                            onClick={() => toast.info(`Playing ${video.title}`)}
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
                      onClick={() => toast.info(`Watching demo for ${video.title}`)}
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
                          onClick={() => toast.success(`Replied to ${feedback.therapist}`)}
                        >
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </div>
    </div>
  );
}
