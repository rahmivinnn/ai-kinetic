'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Activity, Calendar, ArrowRight, CheckCircle, Info, AlertCircle, Download, Printer, Share2, Sparkles, Camera, Video, BarChart2, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

// Types for the exercise plan
interface Exercise {
  name: string;
  description: string;
  reps: string;
  notes: string;
}

interface DayPlan {
  warmup: Exercise[];
  main: Exercise[];
  cooldown: Exercise[];
}

interface ExercisePlan {
  plan: {
    day1: DayPlan;
    day2: DayPlan;
    day3: DayPlan;
    day4: DayPlan;
    day5: DayPlan;
    day6: DayPlan;
    day7: DayPlan;
  };
  warnings: string[];
  motivation: string;
}

// Form types
interface PatientProfile {
  age: string;
  gender: string;
  height: string;
  weight: string;
  medicalConditions: string;
  injuryType: string;
  injurySeverity: string;
  painPoints: string;
  therapistNotes: string;
}

interface VideoAnalysis {
  movementIssues: string;
  romAssessment: string;
  postureNotes: string;
}

interface PatientGoal {
  mainGoal: string;
  minutesPerDay: string;
  equipment: string;
  preferredStyle: string;
}

export function PersonalizedExercisePlan() {
  const router = useRouter();

  // State for form data
  const [patientProfile, setPatientProfile] = useState<PatientProfile>({
    age: '35',
    gender: 'female',
    height: '170',
    weight: '65',
    medicalConditions: 'None',
    injuryType: 'ACL tear (post-surgery)',
    injurySeverity: 'moderate',
    painPoints: 'Left knee, occasional lower back pain',
    therapistNotes: 'Patient is 3 months post-ACL reconstruction. Cleared for progressive loading exercises. Focus on proper alignment and knee stability.'
  });

  const [videoAnalysis, setVideoAnalysis] = useState<VideoAnalysis>({
    movementIssues: 'Slight knee valgus during squats, hip drop on left side during single-leg exercises',
    romAssessment: 'Limited knee flexion (0-110°), full extension achieved',
    postureNotes: 'Forward head posture, anterior pelvic tilt'
  });

  const [patientGoal, setPatientGoal] = useState<PatientGoal>({
    mainGoal: 'Return to recreational sports (tennis)',
    minutesPerDay: '30',
    equipment: 'Resistance bands, yoga mat, light dumbbells',
    preferredStyle: 'Progressive, challenging but safe'
  });

  // State for the generated plan
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [exercisePlan, setExercisePlan] = useState<ExercisePlan | null>(null);
  const [activeDay, setActiveDay] = useState('day1');
  const [showPlanDetails, setShowPlanDetails] = useState(false);

  // OpenPose integration states
  const [hasOpenPoseData, setHasOpenPoseData] = useState(false);
  const [openPoseLoading, setOpenPoseLoading] = useState(false);
  const [openPoseScores, setOpenPoseScores] = useState<Record<string, number>>({
    shoulders: 85,
    back: 72,
    knees: 68,
    overall: 75
  });
  const [openPoseRecommendations, setOpenPoseRecommendations] = useState<string[]>([
    "Focus on exercises that improve knee stability",
    "Include posture correction for anterior pelvic tilt",
    "Add shoulder mobility exercises"
  ]);

  // Handle form input changes
  const handlePatientProfileChange = (field: keyof PatientProfile, value: string) => {
    setPatientProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleVideoAnalysisChange = (field: keyof VideoAnalysis, value: string) => {
    setVideoAnalysis(prev => ({ ...prev, [field]: value }));
  };

  const handlePatientGoalChange = (field: keyof PatientGoal, value: string) => {
    setPatientGoal(prev => ({ ...prev, [field]: value }));
  };

  // Function to fetch OpenPose data
  const fetchOpenPoseData = () => {
    setOpenPoseLoading(true);
    toast.info("Fetching your latest OpenPose analysis data...");

    // Simulate API call to fetch OpenPose data
    setTimeout(() => {
      // In a real implementation, this would be an actual API call
      setHasOpenPoseData(true);
      setOpenPoseLoading(false);

      // Update video analysis based on OpenPose data
      setVideoAnalysis(prev => ({
        ...prev,
        movementIssues: 'Knee valgus during squats (detected by OpenPose), hip drop on left side during single-leg exercises',
        romAssessment: 'Limited knee flexion (0-110°), full extension achieved, shoulder rotation limited to 80%',
        postureNotes: 'Forward head posture (12° forward), anterior pelvic tilt (18°)'
      }));

      toast.success("OpenPose analysis data imported successfully!", {
        description: "Your exercise plan will be optimized based on this data."
      });
    }, 2000);
  };

  // Function to navigate to OpenPose Analyzer
  const goToOpenPoseAnalyzer = () => {
    router.push('/openpose-analyzer');
  };

  // Generate the exercise plan
  const generateExercisePlan = () => {
    setGeneratingPlan(true);
    toast.info("Generating your personalized 7-day exercise plan...");

    // Simulate API call delay
    setTimeout(() => {
      // This is a mock response - in a real app, this would come from an API
      // If we have OpenPose data, we'd include it in the API request
      const mockPlan: ExercisePlan = {
        plan: {
          day1: {
            warmup: [
              { name: "Gentle Knee Mobilization", description: "Seated knee flexion/extension", reps: "2 mins", notes: "Move slowly through available range" }
            ],
            main: [
              { name: "Wall Slides", description: "Back against wall, slide down to 45° knee bend", reps: "3x10", notes: "Keep knees aligned with toes" },
              { name: "Straight Leg Raises", description: "Lying on back, raise straight leg", reps: "3x12 each leg", notes: "Focus on quad engagement" },
              { name: "Resistance Band Side Steps", description: "Band around thighs, step sideways", reps: "3x10 each direction", notes: "Keep tension on band throughout" }
            ],
            cooldown: [
              { name: "Hamstring Stretch", description: "Seated forward fold", reps: "3x30s", notes: "Gentle stretch, no bouncing" }
            ]
          },
          day2: {
            warmup: [
              { name: "Stationary Bike", description: "Low resistance cycling", reps: "5 mins", notes: "Warm up the knee joint" }
            ],
            main: [
              { name: "Single Leg Balance", description: "Stand on one leg", reps: "3x30s each leg", notes: "Use fingertips on wall for support if needed" },
              { name: "Heel Raises", description: "Rise onto toes", reps: "3x15", notes: "Control the movement down" },
              { name: "Glute Bridges", description: "Lying on back, lift hips", reps: "3x12", notes: "Focus on posterior chain activation" }
            ],
            cooldown: [
              { name: "Quad Stretch", description: "Standing, pull heel to buttock", reps: "3x30s each leg", notes: "Keep knees aligned" }
            ]
          },
          day3: {
            warmup: [
              { name: "Dynamic Leg Swings", description: "Forward/backward and side-to-side", reps: "2x10 each direction", notes: "Controlled movements" }
            ],
            main: [
              { name: "Step-Ups", description: "Step up onto low platform", reps: "3x10 each leg", notes: "Start with 4-6 inch height" },
              { name: "Resistance Band Knee Extension", description: "Seated, extend knee against band", reps: "3x15 each leg", notes: "Focus on full extension" },
              { name: "Stability Ball Hamstring Curls", description: "Heels on ball, lift hips and curl ball in", reps: "3x10", notes: "Keep hips elevated throughout" }
            ],
            cooldown: [
              { name: "Calf Stretch", description: "Wall lean, back leg straight", reps: "3x30s each leg", notes: "Feel stretch in calf, not pain" }
            ]
          },
          day4: {
            warmup: [
              { name: "Marching in Place", description: "Lift knees high", reps: "2 mins", notes: "Engage core" }
            ],
            main: [
              { name: "Forward Lunges", description: "Step forward into lunge", reps: "3x8 each leg", notes: "Keep front knee aligned with toes" },
              { name: "Resistance Band Hip Abduction", description: "Band around thighs, move leg outward", reps: "3x12 each leg", notes: "Control the return" },
              { name: "Wall Sits", description: "Back against wall, knees at 60°", reps: "3x30s", notes: "Progress time as tolerated" }
            ],
            cooldown: [
              { name: "Hip Flexor Stretch", description: "Kneeling lunge position", reps: "3x30s each side", notes: "Keep upright posture" }
            ]
          },
          day5: {
            warmup: [
              { name: "Ankle Circles", description: "Rotate ankles in both directions", reps: "2x10 each direction", notes: "Seated with leg extended" }
            ],
            main: [
              { name: "Bodyweight Squats", description: "Squat to chair height", reps: "3x10", notes: "Focus on proper knee alignment" },
              { name: "Single Leg Deadlift", description: "Hinge at hips on one leg", reps: "3x8 each leg", notes: "Light weight or no weight" },
              { name: "Resistance Band Rows", description: "Pull band toward torso", reps: "3x12", notes: "Improves posture and back strength" }
            ],
            cooldown: [
              { name: "Child's Pose", description: "Knees wide, reach forward", reps: "3x30s", notes: "Gentle stretch for lower back" }
            ]
          },
          day6: {
            warmup: [
              { name: "Leg Pendulums", description: "Swing leg forward/backward while standing", reps: "2x10 each leg", notes: "Hold onto support" }
            ],
            main: [
              { name: "Side-Lying Leg Raises", description: "Lift top leg upward", reps: "3x12 each side", notes: "Keep hips stacked" },
              { name: "Standing Hamstring Curls", description: "Bend knee to bring heel toward buttock", reps: "3x12 each leg", notes: "Use band for resistance if available" },
              { name: "Modified Planks", description: "Hold plank position from knees", reps: "3x30s", notes: "Maintain neutral spine" }
            ],
            cooldown: [
              { name: "Seated Spinal Twist", description: "Gentle rotation of torso", reps: "3x30s each side", notes: "Keep spine long" }
            ]
          },
          day7: {
            warmup: [
              { name: "Light Walking", description: "Flat surface, moderate pace", reps: "5 mins", notes: "Focus on heel-to-toe gait" }
            ],
            main: [
              { name: "Balance Pad Exercises", description: "Single leg balance on unstable surface", reps: "3x20s each leg", notes: "Progress to eyes closed if stable" },
              { name: "Terminal Knee Extensions", description: "Resistance band around back of knee", reps: "3x15 each leg", notes: "Focus on last 15° of extension" },
              { name: "Hip Hikes", description: "Standing on one leg, drop and lift hip", reps: "3x10 each side", notes: "Addresses hip drop issue" }
            ],
            cooldown: [
              { name: "Full Body Stretch Sequence", description: "Gentle stretching of all major muscle groups", reps: "5 mins total", notes: "Hold each stretch 20-30s" }
            ]
          }
        },
        warnings: [
          "Avoid deep squats beyond 90° knee flexion",
          "Stop any exercise that causes sharp or increasing pain",
          "Maintain proper form over higher repetitions",
          "Avoid pivoting or twisting on the affected knee"
        ],
        motivation: "You're making excellent progress toward returning to tennis! Each exercise brings you closer to your goal. Remember that consistency is more important than intensity at this stage of recovery."
      };

      setExercisePlan(mockPlan);
      setGeneratingPlan(false);
      setShowPlanDetails(true);
      toast.success("Your personalized exercise plan is ready!", {
        description: "Scroll down to view your 7-day plan."
      });
    }, 3000);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold">AI Personalized Exercise Plan</h2>
        <p className="text-purple-100 mt-1">
          Generate a tailored 7-day exercise plan based on your specific needs and goals
        </p>
      </div>

      {!showPlanDetails ? (
        <div className="space-y-6">
          {/* Form Tabs */}
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Patient Profile</TabsTrigger>
              <TabsTrigger value="analysis">Video Analysis</TabsTrigger>
              <TabsTrigger value="goals">Goals & Preferences</TabsTrigger>
            </TabsList>

            {/* Patient Profile Tab */}
            <TabsContent value="profile" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    value={patientProfile.age}
                    onChange={(e) => handlePatientProfileChange('age', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={patientProfile.gender}
                    onValueChange={(value) => handlePatientProfileChange('gender', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    value={patientProfile.height}
                    onChange={(e) => handlePatientProfileChange('height', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    value={patientProfile.weight}
                    onChange={(e) => handlePatientProfileChange('weight', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicalConditions">Known Medical Conditions</Label>
                <Textarea
                  id="medicalConditions"
                  value={patientProfile.medicalConditions}
                  onChange={(e) => handlePatientProfileChange('medicalConditions', e.target.value)}
                  placeholder="List any relevant medical conditions"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="injuryType">Injury Type</Label>
                <Input
                  id="injuryType"
                  value={patientProfile.injuryType}
                  onChange={(e) => handlePatientProfileChange('injuryType', e.target.value)}
                  placeholder="e.g., ACL tear, rotator cuff injury"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="injurySeverity">Injury Severity</Label>
                <Select
                  value={patientProfile.injurySeverity}
                  onValueChange={(value) => handlePatientProfileChange('injurySeverity', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">Mild</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="painPoints">Pain Points</Label>
                <Input
                  id="painPoints"
                  value={patientProfile.painPoints}
                  onChange={(e) => handlePatientProfileChange('painPoints', e.target.value)}
                  placeholder="e.g., Left knee, lower back"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="therapistNotes">Physiotherapist Notes</Label>
                <Textarea
                  id="therapistNotes"
                  value={patientProfile.therapistNotes}
                  onChange={(e) => handlePatientProfileChange('therapistNotes', e.target.value)}
                  placeholder="Notes from your physiotherapist"
                />
              </div>
            </TabsContent>

            {/* Video Analysis Tab */}
            <TabsContent value="analysis" className="space-y-4 mt-4">
              {/* OpenPose Integration Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100 mb-6">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4 items-start">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <Camera className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-blue-900">OpenPose Analyzer Integration</h3>
                        <p className="text-blue-700 mt-1">
                          Import your latest OpenPose analysis data to optimize your exercise plan
                        </p>

                        {hasOpenPoseData ? (
                          <div className="mt-4 space-y-4">
                            <div className="bg-white p-4 rounded-lg border border-blue-100">
                              <h4 className="font-medium text-blue-800 flex items-center">
                                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                OpenPose Data Imported
                              </h4>

                              <div className="mt-3 space-y-3">
                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Shoulder Alignment</span>
                                    <span className={`font-medium ${openPoseScores.shoulders >= 80 ? 'text-green-600' : openPoseScores.shoulders >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                                      {openPoseScores.shoulders}%
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full ${openPoseScores.shoulders >= 80 ? 'bg-green-500' : openPoseScores.shoulders >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                      style={{ width: `${openPoseScores.shoulders}%` }}
                                    ></div>
                                  </div>
                                </div>

                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Back Posture</span>
                                    <span className={`font-medium ${openPoseScores.back >= 80 ? 'text-green-600' : openPoseScores.back >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                                      {openPoseScores.back}%
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full ${openPoseScores.back >= 80 ? 'bg-green-500' : openPoseScores.back >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                      style={{ width: `${openPoseScores.back}%` }}
                                    ></div>
                                  </div>
                                </div>

                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Knee Alignment</span>
                                    <span className={`font-medium ${openPoseScores.knees >= 80 ? 'text-green-600' : openPoseScores.knees >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                                      {openPoseScores.knees}%
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full ${openPoseScores.knees >= 80 ? 'bg-green-500' : openPoseScores.knees >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                      style={{ width: `${openPoseScores.knees}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-4">
                                <h5 className="text-sm font-medium text-blue-800">Recommendations</h5>
                                <ul className="mt-2 space-y-1">
                                  {openPoseRecommendations.map((rec, index) => (
                                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                      <ArrowRight className="h-3 w-3 text-blue-500 mt-1 flex-shrink-0" />
                                      {rec}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-600 border-blue-200"
                                onClick={fetchOpenPoseData}
                              >
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Refresh Data
                              </Button>

                              <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-600 border-blue-200"
                                onClick={goToOpenPoseAnalyzer}
                              >
                                <Camera className="h-3 w-3 mr-1" />
                                Open Analyzer
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-4 flex flex-col md:flex-row gap-3">
                            {openPoseLoading ? (
                              <div className="w-full bg-white p-4 rounded-lg border border-blue-100 flex items-center justify-center">
                                <div className="flex flex-col items-center">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                                  <p className="text-blue-600 text-sm">Fetching OpenPose data...</p>
                                </div>
                              </div>
                            ) : (
                              <>
                                <Button
                                  className="bg-blue-600 hover:bg-blue-700"
                                  onClick={fetchOpenPoseData}
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Import OpenPose Data
                                </Button>

                                <Button
                                  variant="outline"
                                  className="border-blue-200 text-blue-600"
                                  onClick={goToOpenPoseAnalyzer}
                                >
                                  <Camera className="h-4 w-4 mr-2" />
                                  Go to OpenPose Analyzer
                                </Button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <div className="space-y-2">
                <Label htmlFor="movementIssues">Detected Movement Issues</Label>
                <Textarea
                  id="movementIssues"
                  value={videoAnalysis.movementIssues}
                  onChange={(e) => handleVideoAnalysisChange('movementIssues', e.target.value)}
                  placeholder="e.g., hip tilt, knee valgus"
                  className={hasOpenPoseData ? "border-blue-200 bg-blue-50/30" : ""}
                />
                {hasOpenPoseData && (
                  <p className="text-xs text-blue-600 italic">
                    <Info className="h-3 w-3 inline mr-1" />
                    This field contains data from OpenPose analysis
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="romAssessment">Range of Motion (ROM) Assessment</Label>
                <Textarea
                  id="romAssessment"
                  value={videoAnalysis.romAssessment}
                  onChange={(e) => handleVideoAnalysisChange('romAssessment', e.target.value)}
                  placeholder="e.g., limited shoulder flexion"
                  className={hasOpenPoseData ? "border-blue-200 bg-blue-50/30" : ""}
                />
                {hasOpenPoseData && (
                  <p className="text-xs text-blue-600 italic">
                    <Info className="h-3 w-3 inline mr-1" />
                    This field contains data from OpenPose analysis
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="postureNotes">Posture and Balance Notes</Label>
                <Textarea
                  id="postureNotes"
                  value={videoAnalysis.postureNotes}
                  onChange={(e) => handleVideoAnalysisChange('postureNotes', e.target.value)}
                  placeholder="Notes about posture and balance"
                  className={hasOpenPoseData ? "border-blue-200 bg-blue-50/30" : ""}
                />
                {hasOpenPoseData && (
                  <p className="text-xs text-blue-600 italic">
                    <Info className="h-3 w-3 inline mr-1" />
                    This field contains data from OpenPose analysis
                  </p>
                )}
              </div>
            </TabsContent>

            {/* Goals Tab */}
            <TabsContent value="goals" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="mainGoal">Main Goal</Label>
                <Input
                  id="mainGoal"
                  value={patientGoal.mainGoal}
                  onChange={(e) => handlePatientGoalChange('mainGoal', e.target.value)}
                  placeholder="e.g., reduce pain, increase mobility, return to sport"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minutesPerDay">Time Available Per Day (minutes)</Label>
                <Input
                  id="minutesPerDay"
                  type="number"
                  value={patientGoal.minutesPerDay}
                  onChange={(e) => handlePatientGoalChange('minutesPerDay', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="equipment">Equipment Available</Label>
                <Input
                  id="equipment"
                  value={patientGoal.equipment}
                  onChange={(e) => handlePatientGoalChange('equipment', e.target.value)}
                  placeholder="e.g., yoga mat, resistance bands, none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredStyle">Preferred Exercise Style</Label>
                <Input
                  id="preferredStyle"
                  value={patientGoal.preferredStyle}
                  onChange={(e) => handlePatientGoalChange('preferredStyle', e.target.value)}
                  placeholder="e.g., gentle, challenging, yoga-inspired"
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Generate Button */}
          <Button
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
            onClick={generateExercisePlan}
            disabled={generatingPlan}
          >
            {generatingPlan ? (
              <>Generating Your Plan...</>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate 7-Day Exercise Plan
              </>
            )}
          </Button>
        </div>
      ) : (
        // Exercise Plan Display
        exercisePlan && (
          <div className="space-y-6 animate-fade-in">
            {/* Plan Header */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-indigo-900">Your 7-Day Exercise Plan</h3>
                  <p className="text-indigo-700 mt-1">
                    Personalized based on your profile and goals
                    {hasOpenPoseData && (
                      <span className="inline-flex items-center ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                        <Camera className="h-3 w-3 mr-1" />
                        OpenPose Optimized
                      </span>
                    )}
                  </p>
                </div>
                <Badge className="bg-indigo-100 text-indigo-700">
                  {new Date().toLocaleDateString()}
                </Badge>
              </div>

              {hasOpenPoseData && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.5 }}
                  className="mt-4"
                >
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h4 className="font-medium text-blue-800 flex items-center">
                      <Camera className="h-4 w-4 mr-2 text-blue-600" />
                      OpenPose Analysis Integration
                    </h4>

                    <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="bg-white p-3 rounded-lg border border-blue-100">
                        <p className="text-xs text-blue-700 font-medium">POSTURE SCORE</p>
                        <div className="flex items-end gap-1">
                          <p className="text-2xl font-bold text-blue-900">{openPoseScores.overall}%</p>
                          <p className="text-xs text-blue-700 mb-1">overall</p>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-blue-100">
                        <p className="text-xs text-blue-700 font-medium">FOCUS AREAS</p>
                        <p className="text-sm font-medium text-blue-900 mt-1">
                          Knee Stability, Posture Correction
                        </p>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-blue-100">
                        <p className="text-xs text-blue-700 font-medium">EXERCISE ADAPTATIONS</p>
                        <p className="text-sm font-medium text-blue-900 mt-1">
                          {openPoseScores.knees < 70 ? "Modified knee exercises" : "Standard protocol"}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="mt-4 bg-white p-4 rounded-lg border border-indigo-100">
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-100 p-2 rounded-full">
                    <Info className="h-5 w-5 text-indigo-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-indigo-900">Important Notes</h4>
                    <ul className="mt-2 space-y-2">
                      {exercisePlan.warnings.map((warning, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{warning}</span>
                        </li>
                      ))}
                      {hasOpenPoseData && (
                        <li className="flex items-start gap-2 text-sm">
                          <Camera className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-blue-700">
                            This plan has been optimized based on your OpenPose analysis data.
                            Exercises have been adjusted to address your specific posture and movement patterns.
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Day Selector */}
            <div className="flex overflow-x-auto pb-2 space-x-2">
              {Object.keys(exercisePlan.plan).map((day, index) => (
                <Button
                  key={day}
                  variant={activeDay === day ? "default" : "outline"}
                  className={`flex-shrink-0 ${activeDay === day ? 'bg-indigo-600 text-white' : 'border-indigo-200 text-indigo-700'}`}
                  onClick={() => setActiveDay(day)}
                >
                  Day {index + 1}
                </Button>
              ))}
            </div>

            {/* Day Plan */}
            <div className="space-y-6">
              {/* Warmup */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
                <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-2">
                    <Activity className="h-5 w-5 text-blue-700" />
                  </div>
                  Warm-up
                </h4>
                <div className="space-y-3">
                  {exercisePlan.plan[activeDay as keyof typeof exercisePlan.plan].warmup.map((exercise, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-blue-100">
                      <div className="flex justify-between items-start">
                        <h5 className="font-medium text-blue-900">{exercise.name}</h5>
                        <Badge className="bg-blue-100 text-blue-700">{exercise.reps}</Badge>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{exercise.description}</p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-blue-700">
                        <Info className="h-4 w-4" />
                        <span>{exercise.notes}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Exercises */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-5 rounded-xl border border-purple-100">
                <h4 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                  <div className="bg-purple-100 p-2 rounded-full mr-2">
                    <Activity className="h-5 w-5 text-purple-700" />
                  </div>
                  Main Exercises
                </h4>
                <div className="space-y-3">
                  {exercisePlan.plan[activeDay as keyof typeof exercisePlan.plan].main.map((exercise, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-purple-100">
                      <div className="flex justify-between items-start">
                        <h5 className="font-medium text-purple-900">{exercise.name}</h5>
                        <Badge className="bg-purple-100 text-purple-700">{exercise.reps}</Badge>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{exercise.description}</p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-purple-700">
                        <Info className="h-4 w-4" />
                        <span>{exercise.notes}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cooldown */}
              <div className="bg-gradient-to-br from-green-50 to-teal-50 p-5 rounded-xl border border-green-100">
                <h4 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-2">
                    <Activity className="h-5 w-5 text-green-700" />
                  </div>
                  Cool-down
                </h4>
                <div className="space-y-3">
                  {exercisePlan.plan[activeDay as keyof typeof exercisePlan.plan].cooldown.map((exercise, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-green-100">
                      <div className="flex justify-between items-start">
                        <h5 className="font-medium text-green-900">{exercise.name}</h5>
                        <Badge className="bg-green-100 text-green-700">{exercise.reps}</Badge>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{exercise.description}</p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-green-700">
                        <Info className="h-4 w-4" />
                        <span>{exercise.notes}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Motivation Message */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-xl border border-amber-100">
                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <Sparkles className="h-5 w-5 text-amber-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-amber-900">Your Motivation</h4>
                    <p className="text-amber-800 mt-2">{exercisePlan.motivation}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <Download className="mr-2 h-4 w-4" />
                  Download Plan
                </Button>
                <Button variant="outline" className="border-indigo-200 text-indigo-700">
                  <Printer className="mr-2 h-4 w-4" />
                  Print Plan
                </Button>
                <Button variant="outline" className="border-indigo-200 text-indigo-700">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share with Therapist
                </Button>
                <Button
                  variant="outline"
                  className="border-indigo-200 text-indigo-700 ml-auto"
                  onClick={() => setShowPlanDetails(false)}
                >
                  Create New Plan
                </Button>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
