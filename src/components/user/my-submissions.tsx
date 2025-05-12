'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Video, 
  Calendar, 
  Clock, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  ThumbsUp, 
  MessageSquare, 
  Share2,
  Camera,
  BarChart2
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

// Mock data for submissions
const mockSubmissions = [
  {
    id: 'sub-001',
    title: 'Shoulder Rehabilitation Exercise',
    date: '2023-10-15',
    time: '14:30',
    thumbnail: '/images/shoulder-exercise.jpg',
    status: 'analyzed',
    accuracy: 87,
    feedback: 'Good form overall. Keep your shoulder blades retracted.',
    exerciseType: 'Shoulder',
    duration: '2:45',
    views: 12,
    likes: 3,
    comments: 2
  },
  {
    id: 'sub-002',
    title: 'Knee Extension Exercise',
    date: '2023-10-12',
    time: '10:15',
    thumbnail: '/images/knee-exercise.jpg',
    status: 'analyzed',
    accuracy: 92,
    feedback: 'Excellent form. Maintain the pace throughout the exercise.',
    exerciseType: 'Knee',
    duration: '3:20',
    views: 8,
    likes: 5,
    comments: 1
  },
  {
    id: 'sub-003',
    title: 'Lower Back Strengthening',
    date: '2023-10-08',
    time: '16:45',
    thumbnail: '/images/back-exercise.jpg',
    status: 'analyzed',
    accuracy: 78,
    feedback: 'Watch your lower back position. Try to keep it neutral.',
    exerciseType: 'Back',
    duration: '4:10',
    views: 15,
    likes: 7,
    comments: 4
  },
  {
    id: 'sub-004',
    title: 'Hip Mobility Exercise',
    date: '2023-10-05',
    time: '09:30',
    thumbnail: '/images/hip-exercise.jpg',
    status: 'pending',
    exerciseType: 'Hip',
    duration: '2:55',
    views: 3,
    likes: 0,
    comments: 0
  }
];

export function MySubmissions() {
  const [submissions, setSubmissions] = useState(mockSubmissions);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const filteredSubmissions = submissions.filter(sub => {
    if (activeTab === 'analyzed' && sub.status !== 'analyzed') return false;
    if (activeTab === 'pending' && sub.status !== 'pending') return false;
    
    return sub.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           sub.exerciseType.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleViewAnalysis = (id: string) => {
    toast.info("Opening analysis for submission", {
      description: `Loading detailed analysis for submission ${id}`,
      duration: 3000
    });
    // In a real app, this would navigate to the analysis page
  };

  const handleDownload = (id: string) => {
    toast.success("Download started", {
      description: "Your video is being prepared for download",
      duration: 3000
    });
    // In a real app, this would trigger a download
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search submissions..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="analyzed">Analyzed</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-48 bg-muted animate-pulse"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded animate-pulse w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredSubmissions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubmissions.map((submission) => (
            <Card key={submission.id} className="overflow-hidden hover:shadow-lg transition-all">
              <div className="relative h-48 bg-muted">
                {/* In a real app, this would be a real thumbnail */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Video className="h-12 w-12 text-white opacity-70" />
                </div>
                <Badge 
                  className={`absolute top-2 right-2 ${
                    submission.status === 'analyzed' 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-amber-500 hover:bg-amber-600'
                  }`}
                >
                  {submission.status === 'analyzed' ? 'Analyzed' : 'Pending'}
                </Badge>
                {submission.status === 'analyzed' && (
                  <div className="absolute bottom-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {submission.accuracy}% Accuracy
                  </div>
                )}
              </div>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg">{submission.title}</CardTitle>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span>{new Date(submission.date).toLocaleDateString()}</span>
                  <Clock className="h-3.5 w-3.5 ml-3 mr-1" />
                  <span>{submission.time}</span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {submission.status === 'analyzed' && submission.feedback && (
                  <p className="text-sm mt-2 text-muted-foreground">
                    <span className="font-medium text-foreground">Feedback: </span>
                    {submission.feedback}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="outline" className="bg-blue-50">
                    {submission.exerciseType}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50">
                    {submission.duration}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    {submission.views}
                  </span>
                  <span className="flex items-center">
                    <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                    {submission.likes}
                  </span>
                  <span className="flex items-center">
                    <MessageSquare className="h-3.5 w-3.5 mr-1" />
                    {submission.comments}
                  </span>
                </div>
                <div className="flex gap-1">
                  {submission.status === 'analyzed' && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleViewAnalysis(submission.id)}
                    >
                      <BarChart2 className="h-4 w-4" />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => handleDownload(submission.id)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-muted/30 p-4 rounded-full mb-4">
            <Video className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No submissions found</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            {searchTerm 
              ? `No results for "${searchTerm}". Try a different search term.` 
              : "You haven't uploaded any videos yet."}
          </p>
          <Button asChild>
            <Link href="/video-library">
              <Camera className="h-4 w-4 mr-2" />
              Upload New Video
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
