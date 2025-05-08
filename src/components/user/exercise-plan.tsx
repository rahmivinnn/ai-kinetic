'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { exerciseAPI } from '@/lib/api';
import { toast } from 'sonner';
import { Play, Calendar, Upload, CheckCircle, Clock, Pause, X, Activity, ChevronUp, ChevronDown, RotateCw, Award, Zap, Heart, Flame } from 'lucide-react';

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
  // Main state
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

  // Enhanced interactivity state
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [hoveredExercise, setHoveredExercise] = useState<string | null>(null);
  const [showMotivation, setShowMotivation] = useState(false);
  const [motivationMessage, setMotivationMessage] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);
  const [pulseEffect, setPulseEffect] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  const [showAchievement, setShowAchievement] = useState(false);
  const [achievementMessage, setAchievementMessage] = useState("");
  const [calories, setCalories] = useState(0);

  // Refs for animations
  const progressCircleRef = useRef<SVGCircleElement>(null);

  // Streak count from localStorage
  const [streakCount, setStreakCount] = useState(() => {
    const saved = localStorage.getItem('exerciseStreak');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Exercise tips
  const exerciseTips = [
    "Remember to breathe deeply during exercises",
    "Stay hydrated throughout your workout",
    "Focus on form rather than speed",
    "Take breaks when needed, but try to maintain consistency",
    "Celebrate small victories in your recovery journey"
  ];

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

  // Enhanced exercise interaction functions
  const startExercise = (exercise: Exercise) => {
    setActiveExercise(exercise);
    setCurrentSet(1);
    setCurrentRep(1);
    setTimerSeconds(0);
    setTimerActive(true);

    // Calculate estimated calories
    const intensity = exercise.difficulty === 'advanced' ? 8 :
                     exercise.difficulty === 'intermediate' ? 5 : 3;
    setCalories(intensity * exercise.sets * exercise.reps);

    // Show motivational message
    const motivations = [
      "You've got this! Let's crush this exercise!",
      "Time to shine! Your recovery journey continues now!",
      "Every rep brings you closer to your goals!",
      "Let's make today count with perfect form!"
    ];
    setMotivationMessage(motivations[Math.floor(Math.random() * motivations.length)]);
    setShowMotivation(true);
    setTimeout(() => setShowMotivation(false), 3000);

    // Trigger animation
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 1000);

    toast.success(`Starting ${exercise.name}!`, {
      icon: <Zap className="h-5 w-5 text-yellow-500" />
    });
  };

  const pauseExercise = () => {
    setTimerActive(false);
    setPulseEffect(true);
    setTimeout(() => setPulseEffect(false), 1000);
    toast.info("Exercise paused. Take a break when you need it!", {
      icon: <Pause className="h-5 w-5 text-blue-500" />
    });
  };

  const resumeExercise = () => {
    setTimerActive(true);
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 1000);
    toast.success("Exercise resumed. Keep going!", {
      icon: <Play className="h-5 w-5 text-green-500" />
    });
  };

  const stopExercise = () => {
    setTimerActive(false);
    setActiveExercise(null);
    toast.info("Exercise stopped. You can try again later!", {
      icon: <X className="h-5 w-5 text-red-500" />
    });
  };

  const toggleExpandExercise = (exerciseId: string) => {
    if (expandedExercise === exerciseId) {
      setExpandedExercise(null);
    } else {
      setExpandedExercise(exerciseId);
      // Show random tip when expanding
      if (Math.random() > 0.7) {
        setCurrentTip(Math.floor(Math.random() * exerciseTips.length));
        setShowTips(true);
        setTimeout(() => setShowTips(false), 5000);
      }
    }
  };

  const showRandomAchievement = () => {
    const achievements = [
      "Perfect Form Master! 🏆",
      "Consistency Champion! 🌟",
      "Recovery Warrior! 💪",
      "Progress Pioneer! 🚀",
      "Dedication Dynamo! ⚡"
    ];
    setAchievementMessage(achievements[Math.floor(Math.random() * achievements.length)]);
    setShowAchievement(true);
    setTimeout(() => setShowAchievement(false), 4000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full">
      {/* Floating achievement notification */}
      {showAchievement && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-float-up">
          <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center">
            <Award className="h-6 w-6 mr-2 text-white animate-pulse" />
            <span className="font-bold">{achievementMessage}</span>
          </div>
        </div>
      )}

      {/* Floating tip notification */}
      {showTips && (
        <div className="fixed bottom-8 right-8 z-50 max-w-xs animate-slide-up">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-4 rounded-xl shadow-lg">
            <div className="flex items-start">
              <div className="bg-white/20 p-2 rounded-full mr-3">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm mb-1">Exercise Tip</h4>
                <p className="text-sm text-blue-100">{exerciseTips[currentTip]}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl p-6 mb-6 text-white shadow-lg relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white animate-float"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-white animate-float-delay"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full bg-white animate-float-slow"></div>
        </div>

        <div className="flex justify-between items-start relative z-10">
          <div>
            <div className="flex items-center">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                Your Exercise Plan
              </h2>
              <div className="ml-3 bg-white/20 backdrop-blur-sm rounded-full p-1.5 animate-pulse-slow">
                <Heart className="h-5 w-5 text-red-200" />
              </div>
            </div>
            <p className="text-blue-100 mt-1 max-w-md">
              Personalized exercises designed specifically for your recovery journey
            </p>

            <div className="mt-6 flex items-center gap-4 flex-wrap">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
                <div className="text-xs text-blue-100 flex items-center">
                  <Activity className="h-3.5 w-3.5 mr-1.5 group-hover:text-yellow-300 transition-colors" />
                  Daily Progress
                </div>
                <div className="text-2xl font-bold flex items-center">
                  {Math.round(progress)}%
                  <span className="text-xs ml-1 text-blue-200">completed</span>
                </div>
              </div>

              {streakCount > 0 && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
                  <div className="text-xs text-blue-100 flex items-center">
                    <Flame className="h-3.5 w-3.5 mr-1.5 text-orange-300 group-hover:text-orange-400 transition-colors" />
                    Current Streak
                  </div>
                  <div className="text-2xl font-bold flex items-center">
                    {streakCount}
                    <span className="text-xs ml-1 text-blue-200">days</span>
                  </div>
                </div>
              )}

              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
                <div className="text-xs text-blue-100 flex items-center">
                  <Zap className="h-3.5 w-3.5 mr-1.5 text-yellow-300 group-hover:text-yellow-400 transition-colors" />
                  Estimated Calories
                </div>
                <div className="text-2xl font-bold flex items-center">
                  {calories}
                  <span className="text-xs ml-1 text-blue-200">kcal</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-full p-5 border border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
            <div className="relative h-20 w-20">
              <svg viewBox="0 0 100 100" className="h-full w-full rotate-progress">
                <circle
                  cx="50" cy="50" r="45"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="8"
                />
                <circle
                  ref={progressCircleRef}
                  cx="50" cy="50" r="45"
                  fill="none"
                  stroke="white"
                  strokeWidth="8"
                  strokeDasharray={`${progress * 2.83} 283`}
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold group-hover:scale-110 transition-transform">
                  {Math.round(progress)}%
                </div>
                <div className="text-xs text-blue-200">complete</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 rounded-full transition-all duration-1000 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Motivational message */}
        {showMotivation && (
          <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20 animate-fade-in">
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-full mr-3">
                <Zap className="h-5 w-5 text-yellow-300 animate-pulse" />
              </div>
              <p className="text-white font-medium">{motivationMessage}</p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Active Exercise Modal */}
        {activeExercise && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-2xl relative">
              {/* Animated background elements */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-500/10 animate-float-slow"></div>
                <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-indigo-500/10 animate-float-delay"></div>
              </div>

              {/* Header with gradient background */}
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white relative overflow-hidden">
                {/* Animated particles */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-white animate-float"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDuration: `${3 + Math.random() * 5}s`,
                        animationDelay: `${Math.random() * 2}s`
                      }}
                    ></div>
                  ))}
                </div>

                <div className="flex justify-between items-center relative z-10">
                  <div>
                    <div className="flex items-center">
                      <h2 className="text-3xl font-bold">{activeExercise.name}</h2>
                      {showAnimation && (
                        <div className="ml-3 animate-ping-once">
                          <Zap className="h-6 w-6 text-yellow-300" />
                        </div>
                      )}
                    </div>
                    <p className="text-blue-100 mt-1 max-w-xl">{activeExercise.description}</p>

                    <div className="mt-4 flex items-center gap-3">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/20">
                        <div className="text-xs text-blue-100 flex items-center">
                          <Activity className="h-3 w-3 mr-1" />
                          Target Area
                        </div>
                        <div className="text-sm font-medium">{activeExercise.targetArea}</div>
                      </div>

                      <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/20">
                        <div className="text-xs text-blue-100 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Frequency
                        </div>
                        <div className="text-sm font-medium">{activeExercise.frequency}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <Badge className={`${getDifficultyColor(activeExercise.difficulty)} px-3 py-1.5 text-sm shadow-lg`}>
                      {activeExercise.difficulty}
                    </Badge>

                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/20 flex items-center">
                      <Flame className="h-4 w-4 text-orange-300 mr-2" />
                      <div>
                        <div className="text-xs text-blue-100">Est. Calories</div>
                        <div className="text-sm font-medium">{calories} kcal</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 relative z-10">
                {showInstructions ? (
                  <div className="space-y-6 animate-fade-in">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 shadow-md">
                      <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <Activity className="h-5 w-5 text-blue-600" />
                        </div>
                        Exercise Instructions
                      </h3>
                      <div className="text-blue-700 whitespace-pre-line leading-relaxed">
                        {activeExercise.instructions ||
                          "Perform this exercise with controlled movements, focusing on proper form and technique. Breathe steadily throughout the exercise. Maintain good posture and engage your core muscles for stability."}
                      </div>

                      <div className="mt-6 bg-blue-100/50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                          <Zap className="h-4 w-4 text-blue-600 mr-2" />
                          Pro Tips
                        </h4>
                        <ul className="list-disc pl-5 text-blue-700 space-y-2">
                          <li>Focus on quality over quantity - proper form is essential</li>
                          <li>Breathe out during the exertion phase of the exercise</li>
                          <li>If you feel pain (not muscle fatigue), stop immediately</li>
                          <li>Keep movements slow and controlled for maximum benefit</li>
                        </ul>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 h-12 text-lg transition-all hover:scale-[1.01]"
                      onClick={() => setShowInstructions(false)}
                    >
                      Back to Exercise
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6 animate-fade-in">
                    {/* Video section with interactive elements */}
                    <div className="aspect-video bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl flex items-center justify-center overflow-hidden shadow-lg relative">
                      {activeExercise.demoVideoUrl ? (
                        <iframe
                          src={activeExercise.demoVideoUrl.replace('watch?v=', 'embed/')}
                          className="w-full h-full"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <div className={`text-white/20 text-9xl font-bold select-none ${pulseEffect ? 'animate-pulse' : ''}`}>
                            {activeExercise.name.charAt(0)}
                          </div>
                          <p className="text-white/60 mt-4">No demo video available</p>
                        </div>
                      )}

                      {/* Video overlay controls */}
                      <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                        <div className="bg-black/40 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
                          {formatTime(timerSeconds)}
                        </div>

                        <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-white rounded-full" style={{ width: '30%' }}></div>
                        </div>

                        <div className="bg-black/40 backdrop-blur-sm text-white p-1.5 rounded-full cursor-pointer hover:bg-black/60 transition-colors">
                          <Play className="h-4 w-4" />
                        </div>
                      </div>
                    </div>

                    {/* Exercise progress with animations */}
                    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 rounded-xl border border-blue-100 shadow-md">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-xl font-semibold text-blue-800 flex items-center">
                          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-full mr-3 shadow-sm">
                            <Activity className="h-5 w-5 text-white" />
                          </div>
                          Live Exercise Progress
                        </h3>
                        <div className={`text-2xl font-bold text-blue-700 ${pulseEffect ? 'animate-pulse' : ''}`}>
                          {formatTime(timerSeconds)}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-5 mb-5">
                        <div className="relative">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-blue-700 flex items-center">
                              <RotateCw className="h-3.5 w-3.5 mr-1.5" />
                              Sets Progress
                            </span>
                            <span className="text-sm font-medium text-blue-800">{currentSet}/{activeExercise.sets}</span>
                          </div>
                          <div className="h-3 bg-blue-200 rounded-full overflow-hidden shadow-inner">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${(currentSet / activeExercise.sets) * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="relative">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-blue-700 flex items-center">
                              <Activity className="h-3.5 w-3.5 mr-1.5" />
                              Reps Progress
                            </span>
                            <span className="text-sm font-medium text-blue-800">{currentRep}/{activeExercise.reps}</span>
                          </div>
                          <div className="h-3 bg-blue-200 rounded-full overflow-hidden shadow-inner">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${(currentRep / activeExercise.reps) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group">
                          <div className="flex justify-between items-start mb-2">
                            <div className="text-3xl font-bold text-blue-700 group-hover:scale-110 transition-transform">
                              {currentSet}
                            </div>
                            <div className="bg-blue-100 p-1.5 rounded-full">
                              <RotateCw className="h-4 w-4 text-blue-600" />
                            </div>
                          </div>
                          <div className="text-xs font-medium text-blue-600 uppercase tracking-wider">Current Set</div>
                          <div className="mt-2 text-xs text-blue-500">{Math.round((currentSet / activeExercise.sets) * 100)}% complete</div>
                        </div>

                        <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group">
                          <div className="flex justify-between items-start mb-2">
                            <div className="text-3xl font-bold text-blue-700 group-hover:scale-110 transition-transform">
                              {currentRep}
                            </div>
                            <div className="bg-blue-100 p-1.5 rounded-full">
                              <Activity className="h-4 w-4 text-blue-600" />
                            </div>
                          </div>
                          <div className="text-xs font-medium text-blue-600 uppercase tracking-wider">Current Rep</div>
                          <div className="mt-2 text-xs text-blue-500">{Math.round((currentRep / activeExercise.reps) * 100)}% complete</div>
                        </div>

                        <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group">
                          <div className="flex justify-between items-start mb-2">
                            <div className="text-3xl font-bold text-blue-700 group-hover:scale-110 transition-transform">
                              {formatTime(timerSeconds)}
                            </div>
                            <div className="bg-blue-100 p-1.5 rounded-full">
                              <Clock className="h-4 w-4 text-blue-600" />
                            </div>
                          </div>
                          <div className="text-xs font-medium text-blue-600 uppercase tracking-wider">Elapsed Time</div>
                          <div className="mt-2 text-xs text-blue-500">Keep going!</div>
                        </div>
                      </div>

                      {/* Calories counter */}
                      <div className="mt-5 bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-100 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-gradient-to-r from-orange-400 to-amber-400 p-2 rounded-full mr-3 shadow-sm">
                            <Flame className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-orange-800">Calories Burned</div>
                            <div className="text-xs text-orange-700">Estimated based on exercise intensity</div>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-orange-700">{Math.round(calories * (timerSeconds / 60) * 0.1)} kcal</div>
                      </div>
                    </div>

                    {/* Control buttons with animations */}
                    <div className="flex gap-4">
                      {timerActive ? (
                        <Button
                          variant="outline"
                          className="flex-1 h-16 text-lg border-blue-200 text-blue-700 hover:bg-blue-50 transition-all hover:scale-[1.01]"
                          onClick={pauseExercise}
                        >
                          <Pause className="h-6 w-6 mr-2" />
                          Pause Exercise
                        </Button>
                      ) : (
                        <Button
                          className="flex-1 h-16 text-lg bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white border-none shadow-md hover:shadow-lg transition-all hover:scale-[1.01]"
                          onClick={resumeExercise}
                        >
                          <Play className="h-6 w-6 mr-2" />
                          Resume Exercise
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        className="h-16 px-6 hover:bg-red-600 transition-all hover:scale-[1.01]"
                        onClick={stopExercise}
                      >
                        <X className="h-6 w-6" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant="ghost"
                        className="text-blue-700 hover:bg-blue-50 hover:text-blue-800 border border-blue-100"
                        onClick={() => setShowInstructions(true)}
                      >
                        View Detailed Instructions
                      </Button>

                      <Button
                        variant="ghost"
                        className="text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 border border-indigo-100"
                        onClick={() => {
                          const uploadTab = document.querySelector('[value="upload-video"]');
                          if (uploadTab) {
                            (uploadTab as HTMLElement).click();
                          }
                          stopExercise();
                        }}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Your Video
                      </Button>
                    </div>
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
              className={`rounded-xl overflow-hidden transition-all duration-500 transform hover:shadow-2xl ${
                completedExercises[exercise.id]
                  ? 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border border-green-200'
                  : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 border border-blue-200 hover:border-blue-300'
              } ${hoveredExercise === exercise.id ? 'scale-[1.02]' : ''} ${expandedExercise === exercise.id ? 'md:col-span-2' : ''}`}
              style={{
                opacity: loading ? 0 : 1,
                transform: loading ? 'translateY(10px)' : 'translateY(0)',
                transition: `all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) ${exercise.animationDelay || 0}ms`
              }}
              onMouseEnter={() => setHoveredExercise(exercise.id)}
              onMouseLeave={() => setHoveredExercise(null)}
            >
              <div className={`relative ${expandedExercise === exercise.id ? 'md:flex' : ''}`}>
                {/* Exercise thumbnail/video preview */}
                <div className={`${expandedExercise === exercise.id ? 'md:w-1/2' : ''} h-48 md:h-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden`}>
                  {exercise.thumbnailUrl ? (
                    <img
                      src={exercise.thumbnailUrl}
                      alt={exercise.name}
                      className={`w-full h-full object-cover transition-transform duration-700 ${hoveredExercise === exercise.id ? 'scale-110' : ''}`}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`text-white/20 text-9xl font-bold select-none transition-all duration-700 ${hoveredExercise === exercise.id ? 'scale-125 rotate-12' : ''}`}>
                        {exercise.name.charAt(0)}
                      </div>
                    </div>
                  )}

                  {/* Play button overlay */}
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-all duration-300 cursor-pointer"
                    onClick={() => startExercise(exercise)}
                  >
                    <div className={`bg-white/20 backdrop-blur-sm p-4 rounded-full transition-all duration-500 ${hoveredExercise === exercise.id ? 'scale-110 bg-white/30' : ''}`}>
                      <Play className={`h-10 w-10 text-white transition-transform duration-500 ${hoveredExercise === exercise.id ? 'scale-110' : ''}`} />
                    </div>
                  </div>

                  {/* Difficulty badge */}
                  <div className="absolute top-3 right-3">
                    <Badge className={`${getDifficultyColor(exercise.difficulty)} px-3 py-1 text-xs font-medium shadow-md backdrop-blur-sm`}>
                      {exercise.difficulty}
                    </Badge>
                  </div>

                  {/* Completed badge with animation */}
                  {completedExercises[exercise.id] && (
                    <div className="absolute top-3 left-3">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full p-1.5 shadow-md animate-pulse-slow">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                    </div>
                  )}

                  {/* Expand/collapse button */}
                  <div
                    className="absolute bottom-3 right-3 cursor-pointer"
                    onClick={() => toggleExpandExercise(exercise.id)}
                  >
                    <div className={`bg-white/20 backdrop-blur-sm p-1.5 rounded-full transition-all duration-300 hover:bg-white/40`}>
                      {expandedExercise === exercise.id ?
                        <ChevronUp className="h-4 w-4 text-white" /> :
                        <ChevronDown className="h-4 w-4 text-white" />
                      }
                    </div>
                  </div>
                </div>

                {/* Exercise details */}
                <div className={`${expandedExercise === exercise.id ? 'md:w-1/2' : ''} p-5`}>
                  <div className="flex justify-between items-start">
                    <h3 className={`text-lg font-semibold ${completedExercises[exercise.id] ? 'text-green-800' : 'text-blue-800'} group-hover:text-opacity-80`}>
                      {exercise.name}
                    </h3>

                    {/* Animated icon for expanded view */}
                    {expandedExercise === exercise.id && (
                      <div className={`${completedExercises[exercise.id] ? 'bg-green-100' : 'bg-blue-100'} p-1.5 rounded-full animate-bounce-slow`}>
                        <Activity className={`h-4 w-4 ${completedExercises[exercise.id] ? 'text-green-600' : 'text-blue-600'}`} />
                      </div>
                    )}
                  </div>

                  <p className={`text-sm mt-1 ${completedExercises[exercise.id] ? 'text-green-700' : 'text-blue-700'}`}>
                    {exercise.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className={`p-3 rounded-lg ${completedExercises[exercise.id] ? 'bg-green-100/50' : 'bg-blue-100/50'} hover:bg-opacity-80 transition-colors cursor-pointer group`}>
                      <div className={`text-xs flex items-center ${completedExercises[exercise.id] ? 'text-green-700' : 'text-blue-700'}`}>
                        <RotateCw className="h-3 w-3 mr-1" />
                        Sets
                      </div>
                      <div className={`text-xl font-bold ${completedExercises[exercise.id] ? 'text-green-800' : 'text-blue-800'} group-hover:scale-110 transition-transform`}>
                        {exercise.sets}
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${completedExercises[exercise.id] ? 'bg-green-100/50' : 'bg-blue-100/50'} hover:bg-opacity-80 transition-colors cursor-pointer group`}>
                      <div className={`text-xs flex items-center ${completedExercises[exercise.id] ? 'text-green-700' : 'text-blue-700'}`}>
                        <Activity className="h-3 w-3 mr-1" />
                        Reps
                      </div>
                      <div className={`text-xl font-bold ${completedExercises[exercise.id] ? 'text-green-800' : 'text-blue-800'} group-hover:scale-110 transition-transform`}>
                        {exercise.reps}
                      </div>
                    </div>
                  </div>

                  {/* Additional details in expanded view */}
                  {expandedExercise === exercise.id && (
                    <div className="mt-4 space-y-4 animate-fade-in">
                      <div className={`p-4 rounded-lg ${completedExercises[exercise.id] ? 'bg-green-100/30 border border-green-200' : 'bg-blue-100/30 border border-blue-200'}`}>
                        <h4 className={`text-sm font-medium mb-2 ${completedExercises[exercise.id] ? 'text-green-800' : 'text-blue-800'}`}>
                          Exercise Instructions
                        </h4>
                        <p className={`text-sm ${completedExercises[exercise.id] ? 'text-green-700' : 'text-blue-700'}`}>
                          {exercise.instructions || "Perform this exercise with controlled movements, focusing on proper form and technique. Breathe steadily throughout the exercise."}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className={`p-3 rounded-lg ${completedExercises[exercise.id] ? 'bg-green-100/30 border border-green-200' : 'bg-blue-100/30 border border-blue-200'}`}>
                          <div className={`text-xs ${completedExercises[exercise.id] ? 'text-green-700' : 'text-blue-700'}`}>Target Area</div>
                          <div className={`text-sm font-medium ${completedExercises[exercise.id] ? 'text-green-800' : 'text-blue-800'}`}>
                            {exercise.targetArea}
                          </div>
                        </div>
                        <div className={`p-3 rounded-lg ${completedExercises[exercise.id] ? 'bg-green-100/30 border border-green-200' : 'bg-blue-100/30 border border-blue-200'}`}>
                          <div className={`text-xs ${completedExercises[exercise.id] ? 'text-green-700' : 'text-blue-700'}`}>Frequency</div>
                          <div className={`text-sm font-medium ${completedExercises[exercise.id] ? 'text-green-800' : 'text-blue-800'}`}>
                            {exercise.frequency}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {!expandedExercise && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Badge
                        variant="outline"
                        className={`text-xs ${completedExercises[exercise.id] ? 'border-green-200 text-green-700' : 'border-blue-200 text-blue-700'} hover:bg-opacity-80 transition-colors`}
                      >
                        {exercise.frequency}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs ${completedExercises[exercise.id] ? 'border-green-200 text-green-700' : 'border-blue-200 text-blue-700'} hover:bg-opacity-80 transition-colors`}
                      >
                        {exercise.targetArea}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className={`px-5 py-4 flex justify-between items-center ${completedExercises[exercise.id] ? 'bg-green-100/30' : 'bg-blue-100/30'} border-t ${completedExercises[exercise.id] ? 'border-green-200' : 'border-blue-200'} ${expandedExercise === exercise.id ? 'md:absolute md:bottom-0 md:left-1/2 md:right-0' : ''}`}>
                  <div className="flex items-center">
                    <Checkbox
                      id={`complete-${exercise.id}`}
                      checked={!!completedExercises[exercise.id]}
                      className={`${completedExercises[exercise.id] ? 'text-green-500 border-green-500' : ''} transition-all duration-300 hover:scale-110`}
                      onCheckedChange={() => {
                        toggleExerciseCompletion(exercise.id);
                        if (!completedExercises[exercise.id]) {
                          setShowConfetti(true);
                          setTimeout(() => setShowConfetti(false), 3000);
                          showRandomAchievement();
                          toast.success(`Great job completing ${exercise.name}!`, {
                            icon: <Award className="h-5 w-5 text-yellow-500" />
                          });
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
                      className={`${completedExercises[exercise.id]
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                        : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                      } text-white border-none shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105`}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`${completedExercises[exercise.id]
                        ? "border-green-200 text-green-700 hover:bg-green-50"
                        : "border-blue-200 text-blue-700 hover:bg-blue-50"
                      } transition-all duration-300 hover:scale-105`}
                      onClick={() => {
                        toast.info(`Upload a video for ${exercise.name}`, {
                          icon: <Upload className="h-5 w-5 text-blue-500" />
                        });
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
