'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Info, Download } from 'lucide-react';
import Image from 'next/image';

interface SampleVideo {
  id: string;
  title: string;
  category: string;
  thumbnailUrl: string;
  videoUrl: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  bodyParts: string[];
}

const sampleVideos: SampleVideo[] = [
  {
    id: 'squat-1',
    title: 'Basic Squat Form',
    category: 'Lower Body',
    thumbnailUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=500&h=300&fit=crop',
    videoUrl: 'https://storage.googleapis.com/mediapipe-assets/squat_example.mp4',
    description: 'Perfect for beginners to learn proper squat form. Focus on keeping your back straight and knees aligned with toes.',
    difficulty: 'beginner',
    duration: '0:45',
    bodyParts: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core']
  },
  {
    id: 'pushup-1',
    title: 'Standard Push-up',
    category: 'Upper Body',
    thumbnailUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=500&h=300&fit=crop',
    videoUrl: 'https://storage.googleapis.com/mediapipe-assets/pushup_example.mp4',
    description: 'Classic push-up demonstration with proper form. Keep your core engaged and maintain a straight line from head to heels.',
    difficulty: 'intermediate',
    duration: '0:38',
    bodyParts: ['Chest', 'Shoulders', 'Triceps', 'Core']
  },
  {
    id: 'lunge-1',
    title: 'Forward Lunge',
    category: 'Lower Body',
    thumbnailUrl: 'https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?w=500&h=300&fit=crop',
    videoUrl: 'https://storage.googleapis.com/mediapipe-assets/lunge_example.mp4',
    description: 'Proper forward lunge technique. Focus on keeping your front knee at 90 degrees and maintaining balance.',
    difficulty: 'beginner',
    duration: '0:42',
    bodyParts: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core']
  },
  {
    id: 'plank-1',
    title: 'Plank Position',
    category: 'Core',
    thumbnailUrl: 'https://images.unsplash.com/photo-1566241142248-11cef3e1a09d?w=500&h=300&fit=crop',
    videoUrl: 'https://storage.googleapis.com/mediapipe-assets/plank_example.mp4',
    description: 'Proper plank form demonstration. Focus on maintaining a straight line from head to heels and engaging your core.',
    difficulty: 'beginner',
    duration: '0:35',
    bodyParts: ['Core', 'Shoulders', 'Back']
  },
  {
    id: 'deadlift-1',
    title: 'Deadlift Technique',
    category: 'Full Body',
    thumbnailUrl: 'https://images.unsplash.com/photo-1598266663439-2056e6900339?w=500&h=300&fit=crop',
    videoUrl: 'https://storage.googleapis.com/mediapipe-assets/deadlift_example.mp4',
    description: 'Proper deadlift form with emphasis on hip hinge and back position. Keep your back straight and core engaged.',
    difficulty: 'advanced',
    duration: '0:50',
    bodyParts: ['Lower Back', 'Glutes', 'Hamstrings', 'Core']
  },
  {
    id: 'shoulder-1',
    title: 'Shoulder Press',
    category: 'Upper Body',
    thumbnailUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=500&h=300&fit=crop',
    videoUrl: 'https://storage.googleapis.com/mediapipe-assets/shoulder_press_example.mp4',
    description: 'Proper shoulder press technique. Focus on full range of motion and keeping your core engaged.',
    difficulty: 'intermediate',
    duration: '0:40',
    bodyParts: ['Shoulders', 'Triceps', 'Upper Back']
  }
];

interface SampleVideosProps {
  onSelectVideo: (video: SampleVideo) => void;
}

export function SampleVideos({ onSelectVideo }: SampleVideosProps) {
  const [filter, setFilter] = useState<string>('all');
  
  const filteredVideos = filter === 'all' 
    ? sampleVideos 
    : sampleVideos.filter(video => video.category.toLowerCase().includes(filter.toLowerCase()) || 
                                  video.difficulty === filter);
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={filter === 'all' ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button 
          variant={filter === 'upper body' ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter('upper body')}
        >
          Upper Body
        </Button>
        <Button 
          variant={filter === 'lower body' ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter('lower body')}
        >
          Lower Body
        </Button>
        <Button 
          variant={filter === 'core' ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter('core')}
        >
          Core
        </Button>
        <Button 
          variant={filter === 'beginner' ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter('beginner')}
        >
          Beginner
        </Button>
        <Button 
          variant={filter === 'advanced' ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter('advanced')}
        >
          Advanced
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVideos.map((video) => (
          <Card key={video.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative aspect-video">
              <Image
                src={video.thumbnailUrl}
                alt={video.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Button 
                  variant="default" 
                  size="sm" 
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
                  onClick={() => onSelectVideo(video)}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Analyze
                </Button>
              </div>
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {video.duration}
              </div>
              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded capitalize">
                {video.difficulty}
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-base">{video.title}</h3>
                  <p className="text-xs text-muted-foreground">{video.category}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => onSelectVideo(video)}
                >
                  <Info className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2">
                <p className="text-xs text-muted-foreground line-clamp-2">{video.description}</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {video.bodyParts.slice(0, 3).map((part, index) => (
                  <span key={index} className="text-xs bg-muted px-2 py-0.5 rounded">
                    {part}
                  </span>
                ))}
                {video.bodyParts.length > 3 && (
                  <span className="text-xs bg-muted px-2 py-0.5 rounded">
                    +{video.bodyParts.length - 3}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export type { SampleVideo };
