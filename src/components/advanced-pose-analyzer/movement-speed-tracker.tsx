import React from 'react';
import { Progress } from "@/components/ui/progress";

interface MovementSpeedTrackerProps {
  poseData: any;
}

const MovementSpeedTracker: React.FC<MovementSpeedTrackerProps> = ({ poseData }) => {
  // Sample data for demonstration
  const speedData = {
    overall: 65,
    arms: 70,
    legs: 60,
    torso: 65
  };
  
  return (
    <div className="movement-speed-tracker">
      <div className="speed-metrics space-y-2 mt-2">
        <div className="metric">
          <div className="flex justify-between items-center text-xs mb-1">
            <span>Overall Speed</span>
            <span className="font-medium">{speedData.overall}%</span>
          </div>
          <Progress value={speedData.overall} className="h-1.5" />
        </div>
        
        <div className="metric">
          <div className="flex justify-between items-center text-xs mb-1">
            <span>Arms</span>
            <span className="font-medium">{speedData.arms}%</span>
          </div>
          <Progress value={speedData.arms} className="h-1.5" />
        </div>
        
        <div className="metric">
          <div className="flex justify-between items-center text-xs mb-1">
            <span>Legs</span>
            <span className="font-medium">{speedData.legs}%</span>
          </div>
          <Progress value={speedData.legs} className="h-1.5" />
        </div>
        
        <div className="metric">
          <div className="flex justify-between items-center text-xs mb-1">
            <span>Torso</span>
            <span className="font-medium">{speedData.torso}%</span>
          </div>
          <Progress value={speedData.torso} className="h-1.5" />
        </div>
      </div>
    </div>
  );
};

export default MovementSpeedTracker;
