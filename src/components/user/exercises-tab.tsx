'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Activity, 
  Search, 
  Filter, 
  Play, 
  Clock, 
  BarChart2, 
  CheckCircle2,
  ArrowRight,
  Dumbbell,
  Heart,
  Flame,
  Star,
  Plus,
  Info
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

// Mock data for exercises
const mockExercises = [
  {
    id: 'ex-001',
    title: 'Shoulder External Rotation',
    category: 'Shoulder',
    difficulty: 'Beginner',
    duration: '5 min',
    sets: 3,
    reps: 10,
    thumbnail: '/images/shoulder-rotation.jpg',
    description: 'Helps improve shoulder mobility and strengthen rotator cuff muscles.',
    completed: true,
    progress: 100,
    videoUrl: '/videos/shoulder-rotation.mp4'
  },
  {
    id: 'ex-002',
    title: 'Knee Extension',
    category: 'Knee',
    difficulty: 'Beginner',
    duration: '8 min',
    sets: 3,
    reps: 12,
    thumbnail: '/images/knee-extension.jpg',
    description: 'Strengthens quadriceps muscles and improves knee stability.',
    completed: false,
    progress: 50,
    videoUrl: '/videos/knee-extension.mp4'
  },
  {
    id: 'ex-003',
    title: 'Lower Back Stretch',
    category: 'Back',
    difficulty: 'Beginner',
    duration: '6 min',
    sets: 2,
    reps: 15,
    thumbnail: '/images/back-stretch.jpg',
    description: 'Relieves tension in the lower back and improves flexibility.',
    completed: false,
    progress: 0,
    videoUrl: '/videos/back-stretch.mp4'
  },
  {
    id: 'ex-004',
    title: 'Hip Abduction',
    category: 'Hip',
    difficulty: 'Intermediate',
    duration: '10 min',
    sets: 3,
    reps: 15,
    thumbnail: '/images/hip-abduction.jpg',
    description: 'Strengthens hip abductor muscles and improves hip stability.',
    completed: false,
    progress: 0,
    videoUrl: '/videos/hip-abduction.mp4'
  },
  {
    id: 'ex-005',
    title: 'Wrist Flexion and Extension',
    category: 'Wrist',
    difficulty: 'Beginner',
    duration: '4 min',
    sets: 2,
    reps: 20,
    thumbnail: '/images/wrist-flexion.jpg',
    description: 'Improves wrist mobility and strengthens forearm muscles.',
    completed: true,
    progress: 100,
    videoUrl: '/videos/wrist-flexion.mp4'
  },
  {
    id: 'ex-006',
    title: 'Ankle Dorsiflexion',
    category: 'Ankle',
    difficulty: 'Beginner',
    duration: '5 min',
    sets: 3,
    reps: 15,
    thumbnail: '/images/ankle-dorsiflexion.jpg',
    description: 'Improves ankle mobility and strengthens tibialis anterior muscle.',
    completed: false,
    progress: 25,
    videoUrl: '/videos/ankle-dorsiflexion.mp4'
  }
];

// Mock data for exercise categories
const mockCategories = [
  { id: 'cat-001', name: 'Shoulder', count: 12 },
  { id: 'cat-002', name: 'Knee', count: 8 },
  { id: 'cat-003', name: 'Back', count: 15 },
  { id: 'cat-004', name: 'Hip', count: 10 },
  { id: 'cat-005', name: 'Wrist', count: 6 },
  { id: 'cat-006', name: 'Ankle', count: 7 }
];

export function ExercisesTab() {
  const [exercises, setExercises] = useState(mockExercises);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const filteredExercises = exercises.filter(ex => {
    if (activeTab === 'completed' && !ex.completed) return false;
    if (activeTab === 'in-progress' && (ex.completed || ex.progress === 0)) return false;
    if (activeTab === 'not-started' && ex.progress > 0) return false;
    if (selectedCategory && ex.category !== selectedCategory) return false;
    
    return ex.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           ex.category.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleStartExercise = (id: string) => {
    toast.info("Starting exercise", {
      description: "Preparing to start your exercise session",
      duration: 3000
    });
    // In a real app, this would navigate to the exercise page
  };

  const handleContinueExercise = (id: string) => {
    toast.info("Continuing exercise", {
      description: "Resuming your exercise session",
      duration: 3000
    });
    // In a real app, this would navigate to the exercise page
  };

  const handleMarkCompleted = (id: string) => {
    setExercises(exercises.map(ex => 
      ex.id === id ? { ...ex, completed: true, progress: 100 } : ex
    ));
    
    toast.success("Exercise completed", {
      description: "Great job! Your progress has been updated.",
      duration: 3000
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search exercises..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="not-started">Not Started</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Categories */}
        <div className="md:w-1/4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                <div
                  className={`p-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                    selectedCategory === null ? 'bg-muted/50 font-medium' : ''
                  }`}
                  onClick={() => setSelectedCategory(null)}
                >
                  <div className="flex justify-between items-center">
                    <span>All Categories</span>
                    <Badge variant="outline">{mockExercises.length}</Badge>
                  </div>
                </div>
                {mockCategories.map((category) => (
                  <div
                    key={category.id}
                    className={`p-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedCategory === category.name ? 'bg-muted/50 font-medium' : ''
                    }`}
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    <div className="flex justify-between items-center">
                      <span>{category.name}</span>
                      <Badge variant="outline">{category.count}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-3 pt-0">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/exercise-categories">
                  View All Categories
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Today's Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <CheckCircle2 className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-xl font-bold">{exercises.filter(ex => ex.completed).length}/{exercises.length}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time Spent</p>
                  <p className="text-xl font-bold">32 min</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-full">
                  <Flame className="h-5 w-5 text-orange-700" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Calories</p>
                  <p className="text-xl font-bold">145</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Exercise List */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-48 bg-muted animate-pulse"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredExercises.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredExercises.map((exercise) => (
                <Card key={exercise.id} className="overflow-hidden hover:shadow-lg transition-all">
                  <div className="relative h-48 bg-muted">
                    {/* In a real app, this would be a real thumbnail */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <Play className="h-12 w-12 text-white opacity-70" />
                    </div>
                    {exercise.completed && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Completed
                      </div>
                    )}
                    {exercise.progress > 0 && exercise.progress < 100 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                        <div 
                          className="h-full bg-blue-500" 
                          style={{ width: `${exercise.progress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{exercise.title}</h3>
                      <Badge 
                        variant="outline" 
                        className="ml-2 border-blue-200 bg-blue-50 text-blue-700"
                      >
                        {exercise.category}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {exercise.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="flex items-center text-sm">
                        <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        <span>{exercise.duration}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Dumbbell className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        <span>{exercise.sets} sets × {exercise.reps} reps</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Star className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        <span>{exercise.difficulty}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {exercise.completed ? (
                        <Button variant="outline" className="w-full" onClick={() => handleStartExercise(exercise.id)}>
                          <Play className="h-4 w-4 mr-2" />
                          Repeat Exercise
                        </Button>
                      ) : exercise.progress > 0 ? (
                        <Button className="w-full" onClick={() => handleContinueExercise(exercise.id)}>
                          <Play className="h-4 w-4 mr-2" />
                          Continue ({exercise.progress}%)
                        </Button>
                      ) : (
                        <Button className="w-full" onClick={() => handleStartExercise(exercise.id)}>
                          <Play className="h-4 w-4 mr-2" />
                          Start Exercise
                        </Button>
                      )}
                      
                      {exercise.progress > 0 && !exercise.completed && (
                        <Button 
                          variant="outline" 
                          className="flex-none"
                          onClick={() => handleMarkCompleted(exercise.id)}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-muted/30 p-4 rounded-full mb-4">
                <Activity className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No exercises found</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                {searchTerm 
                  ? `No results for "${searchTerm}". Try a different search term.` 
                  : activeTab === 'completed'
                    ? "You haven't completed any exercises yet."
                    : activeTab === 'in-progress'
                      ? "You don't have any exercises in progress."
                      : "No exercises available for the selected filters."}
              </p>
              <Button asChild>
                <Link href="/exercise-categories">
                  <Plus className="h-4 w-4 mr-2" />
                  Browse Exercise Library
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
