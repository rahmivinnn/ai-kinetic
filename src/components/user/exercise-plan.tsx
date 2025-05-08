'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { exerciseAPI } from '@/lib/api';
import { toast } from 'sonner';
import { Play, Calendar, Upload, CheckCircle, Clock, Pause, X, Activity } from 'lucide-react';

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
  animationDelay?: number; // allow animationDelay injected in mapping
}

export function ExercisePlan() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});
  const [progress, setProgress] = useState(0);
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

  // Define toggleExerciseCompletion using useCallback before it's used in effects
  const toggleExerciseCompletion = useCallback((exerciseId: string) => {
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
  }, [completedExercises, exercises.length]);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const data = await exerciseAPI.getUserExercises();

        // Add animation delay for each exercise
        const enhancedData = data.map((exercise: Exercise, index: number) => ({
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
  }, [timerActive, activeExercise, toggleExerciseCompletion]);

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
    <div className="w-full">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 mb-6 text-white shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">Your Exercise Plan</h2>
            <p className="text-blue-100 mt-1">
              Personalized exercises for your recovery journey
            </p>

            <div className="mt-4 flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                <div className="text-xs text-blue-100">Daily Progress</div>
                <div className="text-xl font-bold">{Math.round(progress)}%</div>
              </div>

              {streakCount > 0 && (
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center">
                  <div className="mr-2 text-2xl">🔥</div>
                  <div>
                    <div className="text-xs text-blue-100">Current Streak</div>
                    <div className="text-xl font-bold">{streakCount} days</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
            <div className="relative h-16 w-16">
              <svg viewBox="0 0 100 100" className="h-full w-full">
                <circle
                  cx="50" cy="50" r="45"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="8"
                />
                <circle
                  cx="50" cy="50" r="45"
                  fill="none"
                  stroke="white"
                  strokeWidth="8"
                  strokeDasharray={`${progress * 2.83} 283`}
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
                {Math.round(progress)}%
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 w-full bg-white/20 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-1000 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Active Exercise Modal */}
        {activeExercise && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-white rounded-2xl overflow-hidden shadow-2xl">
              {/* Header with gradient background */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">{activeExercise.name}</h2>
                    <p className="text-blue-100 mt-1">{activeExercise.description}</p>
                  </div>
                  <Badge className={`${getDifficultyColor(activeExercise.difficulty)} px-3 py-1.5`}>
                    {activeExercise.difficulty}
                  </Badge>
                </div>
              </div>

              <div className="p-6">
                {showInstructions ? (
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                      <h3 className="text-lg font-semibold text-blue-800 mb-3">Instructions:</h3>
                      <div className="text-blue-700 whitespace-pre-line">{activeExercise.instructions}</div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                      onClick={() => setShowInstructions(false)}
                    >
                      Back to Exercise
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Video section */}
                    <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl flex items-center justify-center overflow-hidden shadow-lg">
                      {activeExercise.demoVideoUrl ? (
                        <iframe
                          src={activeExercise.demoVideoUrl.replace('watch?v=', 'embed/')}
                          className="w-full h-full"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <div className="text-white/20 text-9xl font-bold select-none">
                            {activeExercise.name.charAt(0)}
                          </div>
                          <p className="text-white/60 mt-4">No demo video available</p>
                        </div>
                      )}
                    </div>

                    {/* Exercise progress */}
                    <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-blue-800">Exercise Progress</h3>
                        <div className="text-2xl font-bold text-blue-700">{formatTime(timerSeconds)}</div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="relative">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-blue-700">Sets</span>
                            <span className="text-sm font-medium text-blue-800">{currentSet}/{activeExercise.sets}</span>
                          </div>
                          <div className="h-3 bg-blue-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300"
                              style={{ width: `${(currentSet / activeExercise.sets) * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="relative">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-blue-700">Reps</span>
                            <span className="text-sm font-medium text-blue-800">{currentRep}/{activeExercise.reps}</span>
                          </div>
                          <div className="h-3 bg-blue-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300"
                              style={{ width: `${(currentRep / activeExercise.reps) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <div className="text-3xl font-bold text-blue-700">{currentSet}</div>
                          <div className="text-xs text-blue-600 mt-1">CURRENT SET</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <div className="text-3xl font-bold text-blue-700">{currentRep}</div>
                          <div className="text-xs text-blue-600 mt-1">CURRENT REP</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <div className="text-3xl font-bold text-blue-700">{formatTime(timerSeconds)}</div>
                          <div className="text-xs text-blue-600 mt-1">ELAPSED TIME</div>
                        </div>
                      </div>
                    </div>

                    {/* Control buttons */}
                    <div className="flex gap-4">
                      {timerActive ? (
                        <Button
                          variant="outline"
                          className="flex-1 h-14 text-lg border-blue-200 text-blue-700 hover:bg-blue-50"
                          onClick={pauseExercise}
                        >
                          <Pause className="h-6 w-6 mr-2" />
                          Pause Exercise
                        </Button>
                      ) : (
                        <Button
                          className="flex-1 h-14 text-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-none"
                          onClick={resumeExercise}
                        >
                          <Play className="h-6 w-6 mr-2" />
                          Resume Exercise
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        className="h-14 px-6"
                        onClick={stopExercise}
                      >
                        <X className="h-6 w-6" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      className="w-full text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                      onClick={() => setShowInstructions(true)}
                    >
                      View Detailed Instructions
                    </Button>
                  </div>
                )}
              </div>
            </div>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exercises.map((exercise: Exercise, index: number) => (
            <div
              key={exercise.id}
              className={`rounded-xl overflow-hidden transition-all duration-300 transform hover:shadow-xl ${
                completedExercises[exercise.id]
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100'
                  : 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 hover:border-blue-300'
              }`}
              style={{
                opacity: loading ? 0 : 1,
                transform: loading ? 'translateY(10px)' : 'translateY(0)',
                transition: `all 0.3s ease-in-out ${exercise.animationDelay || 0}ms`
              }}
            >
              <div className="relative">
                {/* Exercise thumbnail/video preview */}
                <div className="h-48 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
                  {exercise.thumbnailUrl ? (
                    <img
                      src={exercise.thumbnailUrl}
                      alt={exercise.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white/20 text-9xl font-bold select-none">
                        {exercise.name.charAt(0)}
                      </div>
                    </div>
                  )}

                  {/* Play button overlay */}
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors cursor-pointer"
                    onClick={() => startExercise(exercise)}
                  >
                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                      <Play className="h-10 w-10 text-white" />
                    </div>
                  </div>

                  {/* Difficulty badge */}
                  <div className="absolute top-3 right-3">
                    <Badge className={`${getDifficultyColor(exercise.difficulty)} px-3 py-1 text-xs font-medium`}>
                      {exercise.difficulty}
                    </Badge>
                  </div>

                  {/* Completed badge */}
                  {completedExercises[exercise.id] && (
                    <div className="absolute top-3 left-3">
                      <div className="bg-green-500 text-white rounded-full p-1">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Exercise details */}
                <div className="p-5">
                  <h3 className={`text-lg font-semibold ${completedExercises[exercise.id] ? 'text-green-800' : 'text-blue-800'}`}>
                    {exercise.name}
                  </h3>
                  <p className={`text-sm mt-1 ${completedExercises[exercise.id] ? 'text-green-700' : 'text-blue-700'}`}>
                    {exercise.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className={`p-3 rounded-lg ${completedExercises[exercise.id] ? 'bg-green-100/50' : 'bg-blue-100/50'}`}>
                      <div className={`text-xs ${completedExercises[exercise.id] ? 'text-green-700' : 'text-blue-700'}`}>Sets</div>
                      <div className={`text-xl font-bold ${completedExercises[exercise.id] ? 'text-green-800' : 'text-blue-800'}`}>
                        {exercise.sets}
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${completedExercises[exercise.id] ? 'bg-green-100/50' : 'bg-blue-100/50'}`}>
                      <div className={`text-xs ${completedExercises[exercise.id] ? 'text-green-700' : 'text-blue-700'}`}>Reps</div>
                      <div className={`text-xl font-bold ${completedExercises[exercise.id] ? 'text-green-800' : 'text-blue-800'}`}>
                        {exercise.reps}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge variant="outline" className={`text-xs ${completedExercises[exercise.id] ? 'border-green-200 text-green-700' : 'border-blue-200 text-blue-700'}`}>
                      {exercise.frequency}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${completedExercises[exercise.id] ? 'border-green-200 text-green-700' : 'border-blue-200 text-blue-700'}`}>
                      {exercise.targetArea}
                    </Badge>
                  </div>
                </div>

                {/* Action buttons */}
                <div className={`px-5 py-4 flex justify-between items-center ${completedExercises[exercise.id] ? 'bg-green-100/30' : 'bg-blue-100/30'} border-t ${completedExercises[exercise.id] ? 'border-green-100' : 'border-blue-100'}`}>
                  <div className="flex items-center">
                    <Checkbox
                      id={`complete-${exercise.id}`}
                      checked={!!completedExercises[exercise.id]}
                      className={completedExercises[exercise.id] ? 'text-green-500 border-green-500' : ''}
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
                      className={`ml-2 text-sm font-medium cursor-pointer ${completedExercises[exercise.id] ? 'text-green-700' : 'text-blue-700'}`}
                    >
                      {completedExercises[exercise.id] ? 'Completed' : 'Mark as completed'}
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => startExercise(exercise)}
                      className={completedExercises[exercise.id]
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-none"
                        : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-none"
                      }
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={completedExercises[exercise.id]
                        ? "border-green-200 text-green-700 hover:bg-green-50"
                        : "border-blue-200 text-blue-700 hover:bg-blue-50"
                      }
                      onClick={() => {
                        toast.info(`Upload a video for ${exercise.name}`);
                        // Navigate to upload tab with pre-selected exercise
                        const uploadTab = document.querySelector('[value="upload-video"]');
                        if (uploadTab) {
                          (uploadTab as HTMLElement).click();
                        }
                      }}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
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
