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

    toast.success(`Starting ${exercise.name}!`, {
      icon: <Zap className="h-5 w-5 text-yellow-500" />
    });
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
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl p-6 mb-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold">Your Exercise Plan</h2>
        <p className="text-blue-100 mt-1">
          Personalized exercises designed for your recovery journey
        </p>
        
        <div className="mt-4 flex items-center gap-4">
          <div className="bg-white/10 rounded-lg px-4 py-3">
            <div className="text-xs text-blue-100">Daily Progress</div>
            <div className="text-2xl font-bold">{Math.round(progress)}%</div>
          </div>
          
          {streakCount > 0 && (
            <div className="bg-white/10 rounded-lg px-4 py-3">
              <div className="text-xs text-blue-100">Current Streak</div>
              <div className="text-2xl font-bold">{streakCount} days</div>
            </div>
          )}
        </div>
        
        <div className="mt-4 w-full bg-white/10 rounded-full h-2.5">
          <div
            className="h-full bg-white rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-6">
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
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              <div className="p-5 border-b border-blue-100">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-blue-900">{exercise.name}</h3>
                  <Badge className={getDifficultyColor(exercise.difficulty)}>
                    {exercise.difficulty}
                  </Badge>
                </div>
                <p className="text-sm text-blue-700 mt-1">{exercise.description}</p>
              </div>
              
              <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-2">
                      <Activity className="h-4 w-4 text-blue-700" />
                    </div>
                    <span className="text-sm text-blue-900">{exercise.targetArea}</span>
                  </div>
                  <div className="text-sm text-blue-900">{exercise.sets} sets × {exercise.reps} reps</div>
                </div>
                
                <div className="flex items-center gap-2 mt-4">
                  <Button 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => startExercise(exercise)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Exercise
                  </Button>
                  
                  <Checkbox
                    id={`complete-${exercise.id}`}
                    checked={!!completedExercises[exercise.id]}
                    onCheckedChange={() => {
                      toggleExerciseCompletion(exercise.id);
                      if (!completedExercises[exercise.id]) {
                        showRandomAchievement();
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
