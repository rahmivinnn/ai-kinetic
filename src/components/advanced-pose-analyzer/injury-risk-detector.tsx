import React from 'react';
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

interface InjuryRiskDetectorProps {
  poseData: any;
}

const InjuryRiskDetector: React.FC<InjuryRiskDetectorProps> = ({ poseData }) => {
  // Sample data for demonstration
  const riskData = {
    overallRisk: "low",
    kneeAlignment: "medium",
    spinePosition: "low",
    ankleStability: "low"
  };
  
  // Helper function to get badge color based on risk level
  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "high":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            High Risk
          </Badge>
        );
      case "medium":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Medium Risk
          </Badge>
        );
      case "low":
      default:
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Low Risk
          </Badge>
        );
    }
  };
  
  return (
    <div className="injury-risk-detector">
      <div className="risk-metrics space-y-2 mt-2">
        <div className="metric flex justify-between items-center">
          <span className="text-xs">Overall Risk:</span>
          {getRiskBadge(riskData.overallRisk)}
        </div>
        
        <div className="metric flex justify-between items-center">
          <span className="text-xs">Knee Alignment:</span>
          {getRiskBadge(riskData.kneeAlignment)}
        </div>
        
        <div className="metric flex justify-between items-center">
          <span className="text-xs">Spine Position:</span>
          {getRiskBadge(riskData.spinePosition)}
        </div>
        
        <div className="metric flex justify-between items-center">
          <span className="text-xs">Ankle Stability:</span>
          {getRiskBadge(riskData.ankleStability)}
        </div>
      </div>
    </div>
  );
};

export default InjuryRiskDetector;
