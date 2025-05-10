import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Camera, Play, Pause, User, Users } from 'lucide-react';
import { toast } from 'sonner';

// Define the component
const MultiPersonDetection = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [persons, setPersons] = useState<any[]>([]);
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);
  const [detectionConfidence, setDetectionConfidence] = useState<{[key: number]: number}>({});
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectorRef = useRef<any>(null);
  const animationRef = useRef<number | null>(null);
  
  // Initialize pose detector
  useEffect(() => {
    const initializeDetector = async () => {
      try {
        // In a real implementation, we would load TensorFlow.js and PoseNet/BlazePose here
        // For now, we'll simulate the detector
        detectorRef.current = {
          estimatePoses: async (video: HTMLVideoElement) => {
            // Simulate pose detection with multiple people
            return simulateMultiPersonPoses();
          }
        };
        
        console.log('Multi-person pose detector initialized');
      } catch (error) {
        console.error('Error initializing pose detector:', error);
        toast.error('Failed to initialize pose detector');
      }
    };
    
    initializeDetector();
    
    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // Start webcam stream
  const startStream = async () => {
    try {
      if (!videoRef.current) return;
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });
      
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      
      // Set canvas dimensions to match video
      if (canvasRef.current) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
      }
      
      setIsStreaming(true);
      toast.success('Camera started successfully');
    } catch (error) {
      console.error('Error starting camera:', error);
      toast.error('Failed to start camera');
    }
  };
  
  // Stop webcam stream
  const stopStream = () => {
    if (!videoRef.current || !videoRef.current.srcObject) return;
    
    const stream = videoRef.current.srcObject as MediaStream;
    const tracks = stream.getTracks();
    
    tracks.forEach(track => track.stop());
    videoRef.current.srcObject = null;
    
    setIsStreaming(false);
    setIsAnalyzing(false);
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    toast.info('Camera stopped');
  };
  
  // Start pose detection
  const startAnalysis = () => {
    if (!isStreaming || !videoRef.current || !canvasRef.current) {
      toast.error('Camera must be started first');
      return;
    }
    
    setIsAnalyzing(true);
    detectPoses();
    toast.success('Multi-person analysis started');
  };
  
  // Stop pose detection
  const stopAnalysis = () => {
    setIsAnalyzing(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    toast.info('Analysis stopped');
  };
  
  // Detect poses in video frames
  const detectPoses = async () => {
    if (!isAnalyzing || !videoRef.current || !canvasRef.current || !detectorRef.current) return;
    
    try {
      // Estimate poses
      const poses = await detectorRef.current.estimatePoses(videoRef.current);
      
      // Assign consistent IDs to persons based on position
      const trackedPersons = trackPersonsAcrossFrames(poses);
      setPersons(trackedPersons);
      
      // Update detection confidence
      const confidence: {[key: number]: number} = {};
      trackedPersons.forEach(person => {
        confidence[person.id] = person.score || Math.random() * 20 + 80; // 80-100% confidence
      });
      setDetectionConfidence(confidence);
      
      // Draw all persons on canvas
      drawMultiPersonPoses(canvasRef.current, trackedPersons);
      
      // Continue detection loop
      animationRef.current = requestAnimationFrame(detectPoses);
    } catch (error) {
      console.error('Error detecting poses:', error);
      setIsAnalyzing(false);
      toast.error('Error during pose detection');
    }
  };
  
  // Simulate multi-person pose detection
  const simulateMultiPersonPoses = () => {
    const numPersons = Math.floor(Math.random() * 2) + 1; // 1-3 persons
    const poses = [];
    
    for (let i = 0; i < numPersons; i++) {
      poses.push({
        id: i,
        score: Math.random() * 0.2 + 0.8, // 0.8-1.0 confidence
        keypoints: simulateKeypoints(i)
      });
    }
    
    return poses;
  };
  
  // Simulate keypoints for a person
  const simulateKeypoints = (personIndex: number) => {
    const centerX = 320 + (personIndex - 1) * 150; // Spread persons horizontally
    const centerY = 240;
    
    // Basic keypoints for a human figure
    return [
      { name: 'nose', x: centerX, y: centerY - 80, score: Math.random() * 0.2 + 0.8 },
      { name: 'left_eye', x: centerX - 15, y: centerY - 85, score: Math.random() * 0.2 + 0.8 },
      { name: 'right_eye', x: centerX + 15, y: centerY - 85, score: Math.random() * 0.2 + 0.8 },
      { name: 'left_ear', x: centerX - 30, y: centerY - 80, score: Math.random() * 0.2 + 0.8 },
      { name: 'right_ear', x: centerX + 30, y: centerY - 80, score: Math.random() * 0.2 + 0.8 },
      { name: 'left_shoulder', x: centerX - 50, y: centerY - 40, score: Math.random() * 0.2 + 0.8 },
      { name: 'right_shoulder', x: centerX + 50, y: centerY - 40, score: Math.random() * 0.2 + 0.8 },
      { name: 'left_elbow', x: centerX - 70, y: centerY, score: Math.random() * 0.2 + 0.8 },
      { name: 'right_elbow', x: centerX + 70, y: centerY, score: Math.random() * 0.2 + 0.8 },
      { name: 'left_wrist', x: centerX - 90, y: centerY + 30, score: Math.random() * 0.2 + 0.8 },
      { name: 'right_wrist', x: centerX + 90, y: centerY + 30, score: Math.random() * 0.2 + 0.8 },
      { name: 'left_hip', x: centerX - 30, y: centerY + 40, score: Math.random() * 0.2 + 0.8 },
      { name: 'right_hip', x: centerX + 30, y: centerY + 40, score: Math.random() * 0.2 + 0.8 },
      { name: 'left_knee', x: centerX - 40, y: centerY + 100, score: Math.random() * 0.2 + 0.8 },
      { name: 'right_knee', x: centerX + 40, y: centerY + 100, score: Math.random() * 0.2 + 0.8 },
      { name: 'left_ankle', x: centerX - 45, y: centerY + 160, score: Math.random() * 0.2 + 0.8 },
      { name: 'right_ankle', x: centerX + 45, y: centerY + 160, score: Math.random() * 0.2 + 0.8 }
    ];
  };
  
  // Track persons across frames to maintain consistent IDs
  const trackPersonsAcrossFrames = (poses: any[]) => {
    // In a real implementation, this would use position prediction and IoU matching
    // For now, we'll just use the IDs from the simulation
    return poses;
  };
  
  // Draw poses on canvas
  const drawMultiPersonPoses = (canvas: HTMLCanvasElement, persons: any[]) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw each person
    persons.forEach(person => {
      const isSelected = selectedPersonId === person.id;
      
      // Draw with different colors based on selection
      const color = isSelected ? '#4f46e5' : '#64748b';
      const lineWidth = isSelected ? 4 : 2;
      
      drawSkeleton(ctx, person.keypoints, color, lineWidth);
      drawKeypoints(ctx, person.keypoints, color, isSelected ? 6 : 4);
      
      // Draw person ID
      const nose = person.keypoints.find((kp: any) => kp.name === 'nose');
      if (nose) {
        ctx.font = isSelected ? 'bold 16px Arial' : '14px Arial';
        ctx.fillStyle = color;
        ctx.fillText(`Person ${person.id + 1}`, nose.x - 30, nose.y - 100);
      }
    });
  };
  
  // Draw skeleton
  const drawSkeleton = (ctx: CanvasRenderingContext2D, keypoints: any[], color: string, lineWidth: number) => {
    // Define connections between keypoints
    const connections = [
      ['nose', 'left_eye'], ['nose', 'right_eye'],
      ['left_eye', 'left_ear'], ['right_eye', 'right_ear'],
      ['left_shoulder', 'right_shoulder'],
      ['left_shoulder', 'left_elbow'], ['right_shoulder', 'right_elbow'],
      ['left_elbow', 'left_wrist'], ['right_elbow', 'right_wrist'],
      ['left_shoulder', 'left_hip'], ['right_shoulder', 'right_hip'],
      ['left_hip', 'right_hip'],
      ['left_hip', 'left_knee'], ['right_hip', 'right_knee'],
      ['left_knee', 'left_ankle'], ['right_knee', 'right_ankle']
    ];
    
    // Create keypoint map for easy lookup
    const keypointMap: {[key: string]: any} = {};
    keypoints.forEach(kp => {
      keypointMap[kp.name] = kp;
    });
    
    // Draw connections
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    
    connections.forEach(([from, to]) => {
      const fromKp = keypointMap[from];
      const toKp = keypointMap[to];
      
      if (fromKp && toKp && fromKp.score > 0.5 && toKp.score > 0.5) {
        ctx.beginPath();
        ctx.moveTo(fromKp.x, fromKp.y);
        ctx.lineTo(toKp.x, toKp.y);
        ctx.stroke();
      }
    });
  };
  
  // Draw keypoints
  const drawKeypoints = (ctx: CanvasRenderingContext2D, keypoints: any[], color: string, radius: number) => {
    keypoints.forEach(kp => {
      if (kp.score > 0.5) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(kp.x, kp.y, radius, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
  };
  
  // Select a person for detailed analysis
  const selectPerson = (personId: number) => {
    setSelectedPersonId(personId === selectedPersonId ? null : personId);
  };
  
  return (
    <div className="multi-person-detection">
      <div className="video-container bg-gray-900 aspect-video rounded-lg overflow-hidden relative">
        <video 
          ref={videoRef} 
          className="absolute inset-0 w-full h-full object-contain"
          playsInline
          muted
        />
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full object-contain"
        />
        
        {!isStreaming && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <Camera className="h-16 w-16 text-blue-400 mb-4" />
            <Button onClick={startStream} className="bg-blue-600 hover:bg-blue-700">
              Start Camera
            </Button>
          </div>
        )}
      </div>
      
      <div className="controls flex justify-between mt-4">
        <div className="left-controls">
          {isStreaming && (
            <>
              {isAnalyzing ? (
                <Button onClick={stopAnalysis} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                  <Pause className="h-4 w-4 mr-2" />
                  Stop Analysis
                </Button>
              ) : (
                <Button onClick={startAnalysis} className="bg-blue-600 hover:bg-blue-700">
                  <Play className="h-4 w-4 mr-2" />
                  Start Multi-Person Analysis
                </Button>
              )}
            </>
          )}
        </div>
        
        <div className="right-controls">
          {isStreaming && (
            <Button onClick={stopStream} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
              Stop Camera
            </Button>
          )}
        </div>
      </div>
      
      {persons.length > 0 && (
        <div className="person-selector mt-4">
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <Users className="h-4 w-4 mr-1 text-blue-600" />
            Detected Persons
          </h3>
          
          <div className="flex gap-2">
            {persons.map(person => (
              <motion.div
                key={person.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={selectedPersonId === person.id ? "default" : "outline"}
                  className={selectedPersonId === person.id 
                    ? "bg-blue-600 hover:bg-blue-700" 
                    : "border-blue-200 text-blue-600 hover:bg-blue-50"}
                  onClick={() => selectPerson(person.id)}
                >
                  <User className="h-4 w-4 mr-1" />
                  Person {person.id + 1}
                  <Badge className="ml-2 bg-blue-100 text-blue-800">
                    {detectionConfidence[person.id]?.toFixed(0)}%
                  </Badge>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      {selectedPersonId !== null && (
        <Card className="mt-4 border border-blue-100">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-2">Person {selectedPersonId + 1} Analysis</h3>
            <p className="text-sm text-gray-600 mb-4">
              Detailed analysis for the selected person. In a complete implementation, 
              this would show joint angles, posture feedback, and other metrics specific to this person.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 mb-1">Posture Score</h4>
                <div className="text-2xl font-bold text-blue-900">
                  {Math.floor(Math.random() * 20) + 80}%
                </div>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 mb-1">Movement Quality</h4>
                <div className="text-2xl font-bold text-blue-900">
                  {Math.floor(Math.random() * 20) + 80}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MultiPersonDetection;
