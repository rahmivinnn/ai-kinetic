import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dumbbell, Zap, Clock, RotateCcw, Download } from 'lucide-react';

interface PersonalizedWorkoutGeneratorProps {
  poseData?: any;
}

const PersonalizedWorkoutGenerator: React.FC<PersonalizedWorkoutGeneratorProps> = ({ poseData }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [workoutGenerated, setWorkoutGenerated] = useState(false);
  
  // Sample workout data
  const sampleWorkout = [
    { id: 1, name: "Shoulder Mobility Exercise", duration: "3 sets x 10 reps", completed: false },
    { id: 2, name: "Hip Flexor Stretch", duration: "30 seconds each side", completed: false },
    { id: 3, name: "Core Stabilization", duration: "2 sets x 45 seconds", completed: false },
    { id: 4, name: "Squat Form Correction", duration: "3 sets x 8 reps", completed: false },
    { id: 5, name: "Balance Training", duration: "2 minutes total", completed: false },
  ];
  
  const [workoutItems, setWorkoutItems] = useState(sampleWorkout);
  
  // Generate workout based on pose data
  const generateWorkout = () => {
    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      setWorkoutGenerated(true);
    }, 1500);
  };
  
  // Reset workout
  const resetWorkout = () => {
    setWorkoutItems(sampleWorkout.map(item => ({ ...item, completed: false })));
  };
  
  // Toggle workout item completion
  const toggleItemCompletion = (id: number) => {
    setWorkoutItems(workoutItems.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };
  
  return (
    <div className="personalized-workout-generator">
      {!workoutGenerated ? (
        <div className="generate-section">
          <Button 
            onClick={generateWorkout} 
            disabled={isGenerating}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <Dumbbell className="h-4 w-4 mr-2" />
            {isGenerating ? "Generating Workout..." : "Generate Personalized Workout"}
          </Button>
        </div>
      ) : (
        <div className="workout-plan">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium">Your Personalized Workout</h3>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" onClick={resetWorkout}>
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-3 w-3 mr-1" />
                Save
              </Button>
            </div>
          </div>
          
          <div className="workout-items space-y-2">
            {workoutItems.map(item => (
              <Card key={item.id} className={`border ${item.completed ? 'bg-blue-50 border-blue-200' : 'border-gray-200'}`}>
                <CardContent className="p-3">
                  <div className="flex items-start">
                    <Checkbox 
                      id={`workout-item-${item.id}`}
                      checked={item.completed}
                      onCheckedChange={() => toggleItemCompletion(item.id)}
                      className="mt-0.5 mr-2"
                    />
                    <div className="flex-1">
                      <label 
                        htmlFor={`workout-item-${item.id}`}
                        className={`text-sm font-medium ${item.completed ? 'line-through text-blue-600' : ''}`}
                      >
                        {item.name}
                      </label>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {item.duration}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalizedWorkoutGenerator;
