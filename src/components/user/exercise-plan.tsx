'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { exerciseAPI } from '@/lib/api';
import { toast } from 'sonner';
import { Play, Calendar, Upload, CheckCircle, Clock } from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  targetArea: string;
  instructions: string;
  demoVideoUrl?: string;
  thumbnailUrl?: string;
  sets: number;
  reps: number;
  frequency: string;
  duration?: number;
  notes?: string;
  treatmentPlanId: string;
}

export function ExercisePlan() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const data = await exerciseAPI.getUserExercises();

        // Add animation delay for each exercise
        const enhancedData = data.map((exercise, index) => ({
          ...exercise,
          animationDelay: index * 150 // 150ms delay between each exercise
        }));

        setExercises(enhancedData);

        // Initialize completed exercises from localStorage
        const savedCompleted = localStorage.getItem('completedExercises');
        if (savedCompleted) {
          const parsed = JSON.parse(savedCompleted);
          setCompletedExercises(parsed);

          // Calculate progress
          const completedCount = Object.values(parsed).filter(Boolean).length;
          setProgress(enhancedData.length > 0 ? (completedCount / enhancedData.length) * 100 : 0);
        }

        // Show success toast if exercises are loaded
        if (enhancedData.length > 0) {
          toast.success(`Loaded ${enhancedData.length} exercises in your plan`);
        }
      } catch (error) {
        console.error('Error fetching exercises:', error);
        toast.error('Failed to load your exercise plan');
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const toggleExerciseCompletion = (exerciseId: string) => {
    const newCompletedExercises = {
      ...completedExercises,
      [exerciseId]: !completedExercises[exerciseId]
    };

    setCompletedExercises(newCompletedExercises);

    // Save to localStorage
    localStorage.setItem('completedExercises', JSON.stringify(newCompletedExercises));

    // Update progress
    const completedCount = Object.values(newCompletedExercises).filter(Boolean).length;
    setProgress(exercises.length > 0 ? (completedCount / exercises.length) * 100 : 0);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'intermediate':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'advanced':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Loading Exercise Plan</CardTitle>
          <CardDescription>Please wait while we load your personalized exercise plan</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-32 w-32 bg-muted rounded-full mb-4"></div>
            <div className="h-4 w-48 bg-muted rounded mb-2"></div>
            <div className="h-4 w-32 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (exercises.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>No Exercise Plan Found</CardTitle>
          <CardDescription>You don't have any exercises assigned yet</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-8">
          <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">Your physiotherapist will create a personalized exercise plan for you soon</p>
          <Button>Schedule Appointment</Button>
        </CardContent>
      </Card>
    );
  }

  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [currentRep, setCurrentRep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [streakCount, setStreakCount] = useState(() => {
    const saved = localStorage.getItem('exerciseStreak');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    // Check if user completed exercises yesterday
    const lastCompletionDate = localStorage.getItem('lastExerciseCompletion');
    const today = new Date().toDateString();

    if (lastCompletionDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toDateString();

      if (lastCompletionDate === yesterdayString && progress === 100) {
        // User completed exercises yesterday and today
        const newStreak = streakCount + 1;
        setStreakCount(newStreak);
        localStorage.setItem('exerciseStreak', newStreak.toString());
        localStorage.setItem('lastExerciseCompletion', today);

        if (newStreak % 3 === 0) { // Milestone every 3 days
          toast.success(`🔥 ${newStreak} day streak! Keep it up!`, {
            duration: 5000
          });
        }
      } else if (progress === 100) {
        // User completed exercises today but not yesterday
        setStreakCount(1);
        localStorage.setItem('exerciseStreak', '1');
        localStorage.setItem('lastExerciseCompletion', today);
      }
    } else if (progress === 100) {
      // First time completing exercises
      setStreakCount(1);
      localStorage.setItem('exerciseStreak', '1');
      localStorage.setItem('lastExerciseCompletion', today);
    }
  }, [progress, streakCount]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerActive && activeExercise) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          const newTime = prev + 1;

          // Check if we need to increment rep count
          if (activeExercise.duration && newTime % activeExercise.duration === 0) {
            setCurrentRep(prevRep => {
              const newRep = prevRep + 1;

              // Check if we completed all reps in this set
              if (newRep > activeExercise.reps) {
                setCurrentRep(1);
                setCurrentSet(prevSet => {
                  const newSet = prevSet + 1;

                  // Check if we completed all sets
                  if (newSet > activeExercise.sets) {
                    setTimerActive(false);
                    setShowConfetti(true);
                    toggleExerciseCompletion(activeExercise.id);
                    toast.success(`Great job completing ${activeExercise.name}!`);

                    setTimeout(() => {
                      setShowConfetti(false);
                      setActiveExercise(null);
                    }, 3000);

                    return 1;
                  }

                  toast.info(`Starting set ${newSet}!`);
                  return newSet;
                });
              }

              return newRep;
            });
          }

          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerActive, activeExercise]);

  const startExercise = (exercise: Exercise) => {
    setActiveExercise(exercise);
    setCurrentSet(1);
    setCurrentRep(1);
    setTimerSeconds(0);
    setTimerActive(true);
    toast.info(`Starting ${exercise.name}!`);
  };

  const pauseExercise = () => {
    setTimerActive(false);
    toast.info("Exercise paused. Take a break when you need it!");
  };

  const resumeExercise = () => {
    setTimerActive(true);
    toast.info("Exercise resumed. Keep going!");
  };

  const stopExercise = () => {
    setTimerActive(false);
    setActiveExercise(null);
    toast.info("Exercise stopped. You can try again later!");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Your Exercise Plan</CardTitle>
            <CardDescription>
              Personalized exercises for your recovery journey
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            {streakCount > 0 && (
              <Badge variant="outline" className="flex items-center bg-orange-500/10 text-orange-500 border-orange-500/20">
                <span className="mr-1">🔥</span>
                {streakCount} day streak
              </Badge>
            )}
            <Badge variant="outline" className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Updated {new Date().toLocaleDateString()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Active Exercise Modal */}
        {activeExercise && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{activeExercise.name}</CardTitle>
                  <Badge className={getDifficultyColor(activeExercise.difficulty)}>
                    {activeExercise.difficulty}
                  </Badge>
                </div>
                <CardDescription>{activeExercise.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {showInstructions ? (
                  <div className="space-y-4">
                    <h3 className="font-medium">Instructions:</h3>
                    <p className="text-sm whitespace-pre-line">{activeExercise.instructions}</p>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowInstructions(false)}
                    >
                      Back to Exercise
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      {activeExercise.demoVideoUrl ? (
                        <iframe
                          src={activeExercise.demoVideoUrl.replace('watch?v=', 'embed/')}
                          className="w-full h-full"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <Calendar className="h-16 w-16 text-primary mb-2" />
                          <p className="text-muted-foreground">No demo video available</p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-primary/10 rounded-lg p-3">
                        <p className="text-sm text-muted-foreground">Set</p>
                        <p className="text-2xl font-bold">{currentSet}/{activeExercise.sets}</p>
                      </div>
                      <div className="bg-primary/10 rounded-lg p-3">
                        <p className="text-sm text-muted-foreground">Rep</p>
                        <p className="text-2xl font-bold">{currentRep}/{activeExercise.reps}</p>
                      </div>
                      <div className="bg-primary/10 rounded-lg p-3">
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="text-2xl font-bold">{formatTime(timerSeconds)}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {timerActive ? (
                        <Button variant="outline" className="flex-1" onClick={pauseExercise}>
                          Pause
                        </Button>
                      ) : (
                        <Button className="flex-1" onClick={resumeExercise}>
                          Resume
                        </Button>
                      )}
                      <Button variant="destructive" onClick={stopExercise}>
                        Stop
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={() => setShowInstructions(true)}
                    >
                      View Instructions
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Confetti Effect */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full">
                {Array.from({ length: 100 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-confetti"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'][Math.floor(Math.random() * 6)],
                      width: `${Math.random() * 10 + 5}px`,
                      height: `${Math.random() * 10 + 5}px`,
                      animationDuration: `${Math.random() * 3 + 2}s`,
                      animationDelay: `${Math.random() * 0.5}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Daily Progress</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-4">
          {exercises.map((exercise: any) => (
            <div
              key={exercise.id}
              className={`border rounded-lg overflow-hidden transition-all duration-300 transform hover:shadow-md ${
                completedExercises[exercise.id]
                  ? 'bg-muted/50 border-primary/20'
                  : 'hover:border-primary/30'
              }`}
              style={{
                opacity: loading ? 0 : 1,
                transform: loading ? 'translateY(10px)' : 'translateY(0)',
                transition: `all 0.3s ease-in-out ${exercise.animationDelay || 0}ms`
              }}
            >
              <div className="flex items-start p-4">
                <div className="flex-shrink-0 mr-4">
                  {exercise.thumbnailUrl ? (
                    <img
                      src={exercise.thumbnailUrl}
                      alt={exercise.name}
                      className="w-20 h-20 object-cover rounded-md cursor-pointer"
                      onClick={() => startExercise(exercise)}
                    />
                  ) : (
                    <div
                      className="w-20 h-20 bg-primary/10 rounded-md flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors"
                      onClick={() => startExercise(exercise)}
                    >
                      <Play className="h-8 w-8 text-primary" />
                    </div>
                  )}
                </div>

                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{exercise.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{exercise.description}</p>
                    </div>
                    <Badge className={getDifficultyColor(exercise.difficulty)}>
                      {exercise.difficulty}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {exercise.sets} sets
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {exercise.reps} reps
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {exercise.frequency}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {exercise.targetArea}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="border-t px-4 py-3 flex justify-between items-center bg-muted/30">
                <div className="flex items-center">
                  <Checkbox
                    id={`complete-${exercise.id}`}
                    checked={!!completedExercises[exercise.id]}
                    onCheckedChange={() => {
                      toggleExerciseCompletion(exercise.id);
                      if (!completedExercises[exercise.id]) {
                        setShowConfetti(true);
                        setTimeout(() => setShowConfetti(false), 3000);
                        toast.success(`Great job completing ${exercise.name}!`);
                      }
                    }}
                  />
                  <label
                    htmlFor={`complete-${exercise.id}`}
                    className="ml-2 text-sm font-medium cursor-pointer"
                  >
                    {completedExercises[exercise.id] ? 'Completed' : 'Mark as completed'}
                  </label>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => startExercise(exercise)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Exercise
                  </Button>
                  <Button size="sm" onClick={() => {
                    toast.info(`Upload a video for ${exercise.name}`);
                    // Navigate to upload tab with pre-selected exercise
                    const uploadTab = document.querySelector('[value="upload-video"]');
                    if (uploadTab) {
                      (uploadTab as HTMLElement).click();
                    }
                  }}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Video
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {progress === 100 && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center">
            <CheckCircle className="h-5 w-5 text-primary mr-3" />
            <div>
              <h4 className="font-medium">Great job!</h4>
              <p className="text-sm text-muted-foreground">You've completed all your exercises for today</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
