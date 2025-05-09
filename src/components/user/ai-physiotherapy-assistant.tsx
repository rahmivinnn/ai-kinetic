'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Video,
  Download,
  FileText,
  Clipboard,
  Activity,
  BarChart2,
  MessageSquare,
  Zap,
  Check,
  X,
  AlertTriangle,
  Info,
  ChevronRight,
  ChevronDown,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

// Sample exercise data
const sampleExercises = [
  {
    "title": "Mini Squat",
    "target_area": "Right Knee",
    "difficulty_level": "Easy",
    "sets_reps": "3 sets of 10",
    "instructions": "Stand with feet shoulder-width apart. Lower your hips until knees are slightly bent. Hold for 2 seconds, then return.",
    "expected_angles": {
      "rightKnee": "45-60",
      "leftKnee": "45-60",
      "hip": "80-100"
    },
    "openpose_keypoints_used": ["rightKnee", "rightHip", "rightAnkle"],
    "real_time_feedback_logic": {
      "rightKnee < 45": "Bend your knee a bit deeper",
      "knees not aligned": "Keep your knees over your toes"
    },
    "next_progression": "Wall Squat Hold",
    "download_report_fields": ["average_knee_angle", "form_consistency", "pain_level_reported", "video_url"]
  },
  {
    "title": "Wall Squat Hold",
    "target_area": "Knee Stability",
    "difficulty_level": "Medium",
    "sets_reps": "Hold for 30 seconds, 3 sets",
    "instructions": "Stand with your back against a wall. Slide down until knees are at 90 degrees. Hold the position.",
    "expected_angles": {
      "rightKnee": "85-95",
      "leftKnee": "85-95",
      "hip": "90-100"
    },
    "openpose_keypoints_used": ["rightKnee", "rightHip", "rightAnkle", "leftKnee", "leftHip", "leftAnkle"],
    "real_time_feedback_logic": {
      "rightKnee < 85": "Lower your position slightly",
      "rightKnee > 95": "Rise up a bit to maintain proper form",
      "hip angle < 90": "Keep your back flat against the wall"
    },
    "next_progression": "Single Leg Balance",
    "download_report_fields": ["hold_duration", "knee_angle_consistency", "pain_level_reported"]
  },
  {
    "title": "Straight Leg Raise",
    "target_area": "Quadriceps",
    "difficulty_level": "Easy",
    "sets_reps": "3 sets of 12 each leg",
    "instructions": "Lie on your back. Keep one leg straight on the ground and the other straight but raised 45 degrees. Hold for 3 seconds, then lower.",
    "expected_angles": {
      "rightHip": "40-50",
      "rightKnee": "170-180",
      "leftKnee": "170-180"
    },
    "openpose_keypoints_used": ["rightHip", "rightKnee", "rightAnkle", "leftHip", "leftKnee", "leftAnkle"],
    "real_time_feedback_logic": {
      "rightKnee < 170": "Keep your leg straight",
      "rightHip < 40": "Raise your leg higher",
      "rightHip > 50": "Lower your leg slightly"
    },
    "next_progression": "Straight Leg Raise with Ankle Weight",
    "download_report_fields": ["leg_height_consistency", "leg_straightness", "sets_completed"]
  }
];

// Sample patient data
const samplePatientData = {
  "patient_name": "Sarah",
  "injury": "Right ACL tear",
  "recovery_phase": "Strength Phase - Week 3",
  "previous_issues": ["Shallow squat", "Poor knee alignment"],
  "latest_video_data": {
    "rightKneeAngle": 43,
    "leftHipHeight": 0.96,
    "balanceScore": 67,
    "videoURL": "https://example.com/video123"
  },
  "therapist_notes": "Patient needs to focus on knee stability and deeper flexion."
};

export function AIPhysiotherapyAssistant() {
  const [activeTab, setActiveTab] = useState('plan');
  const [selectedExercise, setSelectedExercise] = useState(sampleExercises[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [patientData, setPatientData] = useState(samplePatientData);
  const [jointAngles, setJointAngles] = useState<Record<string, number>>({});
  const [exercisePlan, setExercisePlan] = useState(sampleExercises);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [injury, setInjury] = useState(patientData.injury);
  const [recoveryPhase, setRecoveryPhase] = useState(patientData.recovery_phase);
  const [therapistNotes, setTherapistNotes] = useState(patientData.therapist_notes);
  const [isLoading, setIsLoading] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => {
      clearTimeout(timer);
      stopWebcam();
    };
  }, []);

  const startWebcam = async () => {
    try {
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        toast.success('Camera started', {
          description: 'Ready to analyze your exercise form',
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Error starting webcam:', error);
      toast.error('Failed to start camera', {
        description: 'Please check your camera permissions',
        duration: 5000
      });
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);
    // Simulate feedback
    setFeedback(["Starting analysis...", "Keep your form stable"]);

    // Simulate joint angles
    setJointAngles({
      rightKnee: 48,
      leftKnee: 47,
      hip: 92
    });

    toast.success('Analysis started', {
      description: 'AI is now tracking your movement',
      duration: 3000
    });

    // Simulate feedback over time
    setTimeout(() => {
      setFeedback(prev => ["Bend your knee a bit deeper", ...prev]);
      setJointAngles(prev => ({...prev, rightKnee: 42}));
    }, 3000);

    setTimeout(() => {
      setFeedback(prev => ["Good form! Maintain this position", ...prev]);
      setJointAngles(prev => ({...prev, rightKnee: 52}));
    }, 6000);
  };

  const stopAnalysis = () => {
    setIsAnalyzing(false);
    toast.info('Analysis stopped', {
      description: 'Exercise tracking paused',
      duration: 3000
    });
  };

  const generateExercisePlan = () => {
    setIsGeneratingPlan(true);
    toast.info('Generating personalized exercise plan', {
      description: 'This may take a few moments...',
      duration: 3000
    });

    // Simulate plan generation
    setTimeout(() => {
      setIsGeneratingPlan(false);
      toast.success('Exercise plan generated', {
        description: '50 exercises customized for your recovery',
        duration: 3000
      });
    }, 3000);
  };

  const downloadReport = (format: 'json' | 'pdf') => {
    const reportData = {
      patient: patientData.patient_name,
      exercise: selectedExercise.title,
      date: new Date().toISOString(),
      jointAngles,
      feedback,
      performance: {
        accuracy: 87,
        consistency: 92,
        completionRate: 100
      }
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exercise-report-${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`Report downloaded as ${format.toUpperCase()}`, {
      duration: 3000
    });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-6 rounded-xl border border-blue-100 shadow-lg"
      >
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600">
              AI Physiotherapy Assistant
            </h1>
            <p className="text-indigo-700 mt-1 font-medium">
              Medical-grade rehabilitation with real-time AI guidance
            </p>
            <div className="flex items-center mt-2 space-x-2">
              <Badge className="bg-green-500 hover:bg-green-600">Real-time Analysis</Badge>
              <Badge className="bg-blue-500 hover:bg-blue-600">Personalized Plan</Badge>
              <Badge className="bg-purple-500 hover:bg-purple-600">Progress Tracking</Badge>
            </div>
          </div>

          <Tabs
            defaultValue="plan"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full md:w-auto"
          >
            <TabsList className="p-1 bg-blue-100">
              <TabsTrigger value="plan" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <FileText className="h-4 w-4 mr-2" />
                Exercise Plan
              </TabsTrigger>
              <TabsTrigger value="camera" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Camera className="h-4 w-4 mr-2" />
                Live Analysis
              </TabsTrigger>
              <TabsTrigger value="reports" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <BarChart2 className="h-4 w-4 mr-2" />
                Reports
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </motion.div>

      {/* Exercise Plan Tab */}
      <TabsContent value="plan" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Patient Info */}
          <Card className="md:col-span-1 border-2 border-primary/10 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="text-lg flex items-center">
                <div className="bg-blue-100 p-1 rounded-full mr-2">
                  <Clipboard className="h-4 w-4 text-blue-700" />
                </div>
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div>
                <Label htmlFor="injury">Injury Type</Label>
                <Input
                  id="injury"
                  value={injury}
                  onChange={(e) => setInjury(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="recovery-phase">Recovery Phase</Label>
                <Select value={recoveryPhase} onValueChange={setRecoveryPhase}>
                  <SelectTrigger id="recovery-phase" className="mt-1">
                    <SelectValue placeholder="Select phase" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Initial Phase - Week 1">Initial Phase - Week 1</SelectItem>
                    <SelectItem value="Mobility Phase - Week 2">Mobility Phase - Week 2</SelectItem>
                    <SelectItem value="Strength Phase - Week 3">Strength Phase - Week 3</SelectItem>
                    <SelectItem value="Advanced Phase - Week 4+">Advanced Phase - Week 4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="therapist-notes">Therapist Notes</Label>
                <Textarea
                  id="therapist-notes"
                  value={therapistNotes}
                  onChange={(e) => setTherapistNotes(e.target.value)}
                  className="mt-1"
                  rows={4}
                />
              </div>
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                onClick={generateExercisePlan}
                disabled={isGeneratingPlan}
              >
                {isGeneratingPlan ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating Plan...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Generate Exercise Plan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Exercise List */}
          <Card className="md:col-span-2 border-2 border-primary/10 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="text-lg flex items-center">
                <div className="bg-blue-100 p-1 rounded-full mr-2">
                  <Activity className="h-4 w-4 text-blue-700" />
                </div>
                Personalized Exercise Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-blue-50 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {exercisePlan.map((exercise, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div
                        className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                          selectedExercise.title === exercise.title
                            ? 'bg-blue-50 border-blue-200'
                            : 'bg-white border-gray-200'
                        }`}
                        onClick={() => setSelectedExercise(exercise)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-blue-900">{exercise.title}</h3>
                            <div className="flex items-center mt-1 space-x-2">
                              <Badge variant="outline" className="text-xs bg-blue-50">
                                {exercise.target_area}
                              </Badge>
                              <Badge
                                className={`text-xs ${
                                  exercise.difficulty_level === 'Easy'
                                    ? 'bg-green-100 text-green-800'
                                    : exercise.difficulty_level === 'Medium'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {exercise.difficulty_level}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{exercise.sets_reps}</p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-blue-400" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Selected Exercise Details */}
        {selectedExercise && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6"
          >
            <Card className="border-2 border-primary/10 hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-indigo-50 border-b">
                <CardTitle className="text-lg flex items-center">
                  <div className="bg-purple-100 p-1 rounded-full mr-2">
                    <Info className="h-4 w-4 text-purple-700" />
                  </div>
                  Exercise Details: {selectedExercise.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase">Instructions</h3>
                      <p className="mt-1 text-gray-800">{selectedExercise.instructions}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase">Expected Angles</h3>
                      <div className="mt-2 space-y-2">
                        {Object.entries(selectedExercise.expected_angles).map(([joint, range]) => (
                          <div key={joint} className="flex items-center">
                            <span className="w-24 text-sm capitalize">{joint}:</span>
                            <div className="flex-1 h-2 bg-purple-100 rounded-full overflow-hidden">
                              <div className="h-full bg-purple-500 rounded-full" style={{ width: '70%' }}></div>
                            </div>
                            <span className="ml-2 text-sm font-medium">{range}°</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase">Next Progression</h3>
                      <div className="mt-1 p-2 bg-blue-50 rounded border border-blue-100 text-blue-800">
                        {selectedExercise.next_progression}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase">Real-time Feedback Logic</h3>
                      <div className="mt-2 space-y-2">
                        {Object.entries(selectedExercise.real_time_feedback_logic).map(([condition, feedback], index) => (
                          <div key={index} className="p-2 bg-gray-50 rounded border border-gray-200">
                            <div className="text-xs font-mono text-gray-600">{condition}</div>
                            <div className="text-sm mt-1 flex items-center">
                              <MessageSquare className="h-3 w-3 text-blue-500 mr-1" />
                              "{feedback}"
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase">Keypoints Used</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedExercise.openpose_keypoints_used.map((keypoint, index) => (
                          <Badge key={index} variant="outline" className="bg-indigo-50">
                            {keypoint}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase">Report Fields</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedExercise.download_report_fields.map((field, index) => (
                          <Badge key={index} variant="outline" className="bg-green-50">
                            {field}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    onClick={() => setActiveTab('camera')}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Start Exercise
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </TabsContent>

      {/* Live Analysis Tab */}
      <TabsContent value="camera" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Camera Feed */}
          <Card className="md:col-span-2 border-2 border-primary/10 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="text-lg flex items-center">
                <div className="bg-blue-100 p-1 rounded-full mr-2">
                  <Camera className="h-4 w-4 text-blue-700" />
                </div>
                Live Exercise Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                {!isStreaming ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <Camera className="h-12 w-12 mb-4 opacity-50" />
                    <p className="text-lg font-medium">Camera is off</p>
                    <p className="text-sm opacity-70 mb-4">Start the camera to begin analysis</p>
                    <Button
                      onClick={startWebcam}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Start Camera
                    </Button>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <canvas
                      ref={canvasRef}
                      className="absolute inset-0 w-full h-full"
                    />
                    {isAnalyzing && (
                      <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium animate-pulse">
                        Analyzing
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="flex justify-between mt-4">
                <div className="space-x-2">
                  {isStreaming ? (
                    <Button
                      variant="outline"
                      onClick={stopWebcam}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Stop Camera
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={startWebcam}
                      className="border-blue-200 text-blue-600"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Start Camera
                    </Button>
                  )}
                </div>

                <div className="space-x-2">
                  {isAnalyzing ? (
                    <Button
                      onClick={stopAnalysis}
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Pause className="h-4 w-4 mr-2" />
                      Stop Analysis
                    </Button>
                  ) : (
                    <Button
                      onClick={startAnalysis}
                      disabled={!isStreaming}
                      className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Analysis
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feedback Panel */}
          <Card className="md:col-span-1 border-2 border-primary/10 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="text-lg flex items-center">
                <div className="bg-blue-100 p-1 rounded-full mr-2">
                  <MessageSquare className="h-4 w-4 text-blue-700" />
                </div>
                Real-time Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {isLoading ? (
                <div className="space-y-3">
                  <div className="h-10 bg-blue-50 rounded-lg animate-pulse"></div>
                  <div className="h-10 bg-blue-50 rounded-lg animate-pulse"></div>
                  <div className="h-10 bg-blue-50 rounded-lg animate-pulse"></div>
                </div>
              ) : isAnalyzing && feedback.length > 0 ? (
                <div className="space-y-2">
                  {feedback.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex items-start gap-2 p-3 rounded-lg ${
                        item.toLowerCase().includes('good') || item.toLowerCase().includes('maintain')
                          ? 'bg-green-50 border border-green-100'
                          : item.toLowerCase().includes('bit') || item.toLowerCase().includes('slightly')
                          ? 'bg-yellow-50 border border-yellow-100'
                          : 'bg-blue-50 border border-blue-100'
                      }`}
                    >
                      <div className="mt-0.5">
                        {item.toLowerCase().includes('good') || item.toLowerCase().includes('maintain') ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : item.toLowerCase().includes('bit') || item.toLowerCase().includes('slightly') ? (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        ) : (
                          <Info className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <span className="text-sm">{item}</span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="bg-blue-100 p-3 rounded-full mb-3">
                    <MessageSquare className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-blue-800 font-medium">No feedback yet</p>
                  <p className="text-blue-600 text-sm mt-1">
                    {isStreaming
                      ? 'Start analysis to see feedback'
                      : 'Start the camera and begin analysis'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Joint Angles */}
        {isAnalyzing && Object.keys(jointAngles).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6"
          >
            <Card className="border-2 border-primary/10 hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-indigo-50 border-b">
                <CardTitle className="text-lg flex items-center">
                  <div className="bg-purple-100 p-1 rounded-full mr-2">
                    <Activity className="h-4 w-4 text-purple-700" />
                  </div>
                  Joint Angle Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(jointAngles).map(([joint, angle]) => (
                    <motion.div
                      key={joint}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-100 hover:shadow-md transition-all"
                    >
                      <p className="text-xs text-purple-700 font-medium uppercase tracking-wide">{joint.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <div className="flex items-end gap-1 mt-1">
                        <p className="text-2xl font-bold text-purple-900">{angle.toFixed(1)}</p>
                        <p className="text-sm text-purple-700 mb-1">degrees</p>
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-purple-500 rounded-full"
                            style={{
                              width: `${Math.min(100, (angle / 180) * 100)}%`,
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-purple-600">
                          <span>0°</span>
                          <span>90°</span>
                          <span>180°</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </TabsContent>

      {/* Reports Tab */}
      <TabsContent value="reports" className="mt-6">
        <Card className="border-2 border-primary/10 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="text-lg flex items-center">
              <div className="bg-blue-100 p-1 rounded-full mr-2">
                <BarChart2 className="h-4 w-4 text-blue-700" />
              </div>
              Exercise Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-medium text-blue-900">Download Exercise Report</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Download your exercise performance data in your preferred format
                </p>
                <div className="mt-4 flex gap-3">
                  <Button
                    variant="outline"
                    className="border-blue-200 text-blue-600"
                    onClick={() => downloadReport('json')}
                  >
                    <FileJson className="h-4 w-4 mr-2" />
                    JSON Format
                  </Button>
                  <Button
                    variant="outline"
                    className="border-blue-200 text-blue-600"
                    onClick={() => downloadReport('pdf')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    PDF Format
                  </Button>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg border border-green-100">
                <h3 className="font-medium text-green-900">Exercise Performance Summary</h3>
                <div className="mt-4 space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-green-800">Form Accuracy</span>
                      <span className="text-sm font-medium text-green-800">87%</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-2.5">
                      <div className="bg-gradient-to-r from-green-400 to-teal-500 h-2.5 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-green-800">Movement Consistency</span>
                      <span className="text-sm font-medium text-green-800">92%</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-2.5">
                      <div className="bg-gradient-to-r from-green-400 to-teal-500 h-2.5 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-green-800">Exercise Completion</span>
                      <span className="text-sm font-medium text-green-800">100%</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-2.5">
                      <div className="bg-gradient-to-r from-green-400 to-teal-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-100">
                <h3 className="font-medium text-purple-900">Recovery Progress</h3>
                <p className="text-sm text-purple-700 mt-1">
                  Based on your exercise performance over time
                </p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-3 rounded-lg border border-purple-100">
                    <p className="text-xs text-purple-600 uppercase">Range of Motion</p>
                    <p className="text-2xl font-bold text-purple-900 mt-1">+15%</p>
                    <p className="text-xs text-green-600 flex items-center">
                      <ChevronRight className="h-3 w-3 rotate-90 mr-1" />
                      Improving
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-purple-100">
                    <p className="text-xs text-purple-600 uppercase">Strength</p>
                    <p className="text-2xl font-bold text-purple-900 mt-1">+8%</p>
                    <p className="text-xs text-green-600 flex items-center">
                      <ChevronRight className="h-3 w-3 rotate-90 mr-1" />
                      Improving
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-purple-100">
                    <p className="text-xs text-purple-600 uppercase">Pain Level</p>
                    <p className="text-2xl font-bold text-purple-900 mt-1">-20%</p>
                    <p className="text-xs text-green-600 flex items-center">
                      <ChevronRight className="h-3 w-3 -rotate-90 mr-1" />
                      Decreasing
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
}
