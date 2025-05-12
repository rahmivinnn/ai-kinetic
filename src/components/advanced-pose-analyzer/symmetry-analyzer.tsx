import React from 'react';
import { Progress } from "@/components/ui/progress";

interface SymmetryAnalyzerProps {
  poseData: any;
}

const SymmetryAnalyzer: React.FC<SymmetryAnalyzerProps> = ({ poseData }) => {
  // Sample data for demonstration
  const symmetryData = {
    overall: 85,
    shoulderAlignment: 90,
    hipAlignment: 80,
    weightDistribution: 85
  };
  
  return (
    <div className="symmetry-analyzer">
      <div className="symmetry-metrics space-y-2 mt-2">
        <div className="metric">
          <div className="flex justify-between items-center text-xs mb-1">
            <span>Overall Symmetry</span>
            <span className="font-medium">{symmetryData.overall}%</span>
          </div>
          <Progress value={symmetryData.overall} className="h-1.5" />
        </div>
        
        <div className="metric">
          <div className="flex justify-between items-center text-xs mb-1">
            <span>Shoulder Alignment</span>
            <span className="font-medium">{symmetryData.shoulderAlignment}%</span>
          </div>
          <Progress value={symmetryData.shoulderAlignment} className="h-1.5" />
        </div>
        
        <div className="metric">
          <div className="flex justify-between items-center text-xs mb-1">
            <span>Hip Alignment</span>
            <span className="font-medium">{symmetryData.hipAlignment}%</span>
          </div>
          <Progress value={symmetryData.hipAlignment} className="h-1.5" />
        </div>
        
        <div className="metric">
          <div className="flex justify-between items-center text-xs mb-1">
            <span>Weight Distribution</span>
            <span className="font-medium">{symmetryData.weightDistribution}%</span>
          </div>
          <Progress value={symmetryData.weightDistribution} className="h-1.5" />
        </div>
      </div>
    </div>
  );
};

export default SymmetryAnalyzer;
