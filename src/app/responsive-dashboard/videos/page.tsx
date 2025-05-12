'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  Upload, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Play, 
  Download, 
  Edit, 
  Trash2, 
  Share2, 
  CheckCircle, 
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

// Sample video data
const sampleVideos = [
  {
    id: 1,
    title: 'Squat Form Analysis',
    thumbnail: '/images/squat.jpg',
    duration: '2:45',
    uploadDate: '2023-07-15',
    status: 'analyzed',
    category: 'exercise'
  },
  {
    id: 2,
    title: 'Running Gait Assessment',
    thumbnail: '/images/running.jpg',
    duration: '3:12',
    uploadDate: '2023-07-10',
    status: 'analyzed',
    category: 'running'
  },
  {
    id: 3,
    title: 'Yoga Pose Sequence',
    thumbnail: '/images/yoga.jpg',
    duration: '5:30',
    uploadDate: '2023-07-05',
    status: 'analyzed',
    category: 'yoga'
  },
  {
    id: 4,
    title: 'Deadlift Technique',
    thumbnail: '/images/deadlift.jpg',
    duration: '1:45',
    uploadDate: '2023-06-28',
    status: 'processing',
    category: 'exercise'
  },
  {
    id: 5,
    title: 'Basketball Jump Shot',
    thumbnail: '/images/basketball.jpg',
    duration: '0:58',
    uploadDate: '2023-06-20',
    status: 'analyzed',
    category: 'sports'
  },
  {
    id: 6,
    title: 'Tennis Serve Analysis',
    thumbnail: '/images/tennis.jpg',
    duration: '1:22',
    uploadDate: '2023-06-15',
    status: 'analyzed',
    category: 'sports'
  }
];

export default function VideosPage() {
  const [videos, setVideos] = useState(sampleVideos);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Filter videos based on active tab and search query
  const filteredVideos = videos.filter(video => {
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'analyzed' && video.status === 'analyzed') ||
                      (activeTab === 'processing' && video.status === 'processing') ||
                      (activeTab === video.category);
    
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });
  
  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file.type.startsWith('video/')) {
      toast.error('Please upload a valid video file');
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          // Add new video to the list
          const newVideo = {
            id: videos.length + 1,
            title: file.name.replace(/\.[^/.]+$/, ""),
            thumbnail: '/images/placeholder.jpg',
            duration: '0:00', // This would be determined after processing
            uploadDate: new Date().toISOString().split('T')[0],
            status: 'processing',
            category: 'uncategorized'
          };
          
          setVideos([newVideo, ...videos]);
          toast.success('Video uploaded successfully');
          
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };
  
  // Delete a video
  const deleteVideo = (id: number) => {
    if (confirm('Are you sure you want to delete this video?')) {
      setVideos(videos.filter(video => video.id !== id));
      toast.success('Video deleted successfully');
    }
  };
  
  // Play a video
  const playVideo = (id: number) => {
    const video = videos.find(v => v.id === id);
    if (video) {
      toast.info(`Playing: ${video.title}`);
      // In a real app, this would open a video player
    }
  };
  
  // Download a video
  const downloadVideo = (id: number) => {
    const video = videos.find(v => v.id === id);
    if (video) {
      toast.info(`Downloading: ${video.title}`);
      // In a real app, this would trigger a download
    }
  };
  
  // Share a video
  const shareVideo = (id: number) => {
    const video = videos.find(v => v.id === id);
    if (video) {
      toast.info(`Sharing: ${video.title}`);
      // In a real app, this would open a share dialog
    }
  };
  
  return (
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Videos</h1>
            <p className="text-muted-foreground mt-1">Manage your uploaded and analyzed videos</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <label className="cursor-pointer">
              <input 
                type="file" 
                accept="video/*" 
                className="hidden" 
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              <Button className="bg-blue-600 hover:bg-blue-700" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Uploading {uploadProgress}%
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Video
                  </>
                )}
              </Button>
            </label>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList className="bg-gray-100">
              <TabsTrigger value="all" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                All Videos
              </TabsTrigger>
              <TabsTrigger value="analyzed" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Analyzed
              </TabsTrigger>
              <TabsTrigger value="processing" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Processing
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="mt-4 md:mt-0 flex w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search videos..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="ml-2">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map(video => (
              <Card key={video.id} className="overflow-hidden">
                <div className="relative aspect-video bg-gray-100">
                  {/* In a real app, this would be an actual thumbnail */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <Video className="h-12 w-12 text-gray-400" />
                  </div>
                  
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/50">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 text-white"
                      onClick={() => playVideo(video.id)}
                    >
                      <Play className="h-6 w-6" />
                    </Button>
                  </div>
                  
                  <Badge 
                    className={`absolute top-2 left-2 ${
                      video.status === 'analyzed' 
                        ? 'bg-green-100 text-green-800 border-green-200' 
                        : 'bg-amber-100 text-amber-800 border-amber-200'
                    }`}
                  >
                    {video.status === 'analyzed' ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 mr-1" />
                    )}
                    {video.status === 'analyzed' ? 'Analyzed' : 'Processing'}
                  </Badge>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-medium truncate">{video.title}</h3>
                  
                  <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {video.uploadDate}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {video.duration}
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => downloadVideo(video.id)}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                    
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => shareVideo(video.id)}
                      >
                        <Share2 className="h-4 w-4 text-gray-500 hover:text-blue-600" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4 text-gray-500 hover:text-blue-600" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => deleteVideo(video.id)}
                      >
                        <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Video className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No videos found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery 
                ? `No videos matching "${searchQuery}"`
                : "You haven't uploaded any videos yet"}
            </p>
            <label className="cursor-pointer">
              <input 
                type="file" 
                accept="video/*" 
                className="hidden" 
                onChange={handleFileUpload}
              />
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Upload className="mr-2 h-4 w-4" />
                Upload Your First Video
              </Button>
            </label>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
