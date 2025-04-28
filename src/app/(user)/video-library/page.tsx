"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayCircle, Download, Eye, Info } from "lucide-react";
import { useState } from "react";

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

interface Feedback {
  id: string;
  exercise: string;
  feedback: string;
  therapist: string;
  avatar: string;
}

export default function VideoLib() {
  const [searchQuery, setSearchQuery] = useState("");

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
              defaultValue="account"
              className="flex space-x-2 text-sm text-muted-foreground"
            >
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                <TabsTrigger
                  value="account"
                  className="relative rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none "
                >
                  My Submissions
                </TabsTrigger>
                <TabsTrigger
                  value="exercise"
                  className="relative rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none "
                >
                  Exercise Demos
                </TabsTrigger>
                <TabsTrigger
                  value="password"
                  className="relative rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none "
                >
                  Feedback History
                </TabsTrigger>
                <TabsTrigger
                  value="saved"
                  className="relative rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none "
                >
                  Saved Videos
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Search and Upload */}
        <div
          className="flex items-center gap-2
        "
        >
          <div className="relative w-64">
            <Input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="default">Upload New Video</Button>
        </div>

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
                    <Button variant="default" size="sm">
                      {submission.id === "1"
                        ? "View Video"
                        : submission.id === "2"
                        ? "View Feedback"
                        : "View Analysis"}
                    </Button>
                    {submission.id !== "1" && (
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

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
                  <Button variant="secondary" size="sm">
                    Watch Demo
                  </Button>
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
                  <tr key={submission.id} className="border-b">
                    <td className="p-4">{submission.date}</td>
                    <td className="p-4">{submission.title}</td>
                    <td className="p-4">{submission.duration}</td>
                    <td className="p-4">{submission.status}</td>
                    <td className="p-4">{submission.aiScore}</td>
                    <td className="p-4">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Info className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Therapist Feedback */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Therapist Feedback</h2>
          <div className="space-y-4">
            {feedbacks.map((feedback) => (
              <Card key={feedback.id} className="p-4">
                <div className="flex items-start space-x-4">
                  <img
                    src={feedback.avatar}
                    alt={feedback.therapist}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{feedback.exercise}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {feedback.feedback}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
