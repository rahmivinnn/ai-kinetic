import React from 'react';

interface HeatMapVisualizerProps {
  poseData?: any;
}

const HeatMapVisualizer: React.FC<HeatMapVisualizerProps> = ({ poseData }) => {
  return (
    <div className="heat-map-visualizer">
      <div className="heat-map-container bg-gray-100 aspect-square rounded-md overflow-hidden relative">
        {/* This would be replaced with an actual heat map visualization */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
          Heat Map Visualization
        </div>
        
        {/* Sample colored dots representing heat points */}
        <div className="absolute top-1/4 left-1/3 w-3 h-3 rounded-full bg-red-500 opacity-70"></div>
        <div className="absolute top-1/3 left-1/2 w-4 h-4 rounded-full bg-orange-500 opacity-70"></div>
        <div className="absolute top-1/2 left-1/4 w-3 h-3 rounded-full bg-yellow-500 opacity-70"></div>
        <div className="absolute top-2/3 left-1/3 w-5 h-5 rounded-full bg-red-600 opacity-70"></div>
        <div className="absolute top-3/4 left-1/2 w-3 h-3 rounded-full bg-orange-400 opacity-70"></div>
      </div>
      
      <div className="heat-map-legend flex justify-between items-center mt-2">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-blue-400 mr-1"></div>
          <span className="text-xs">Low</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-green-400 mr-1"></div>
          <span className="text-xs">Medium</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-yellow-400 mr-1"></div>
          <span className="text-xs">High</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
          <span className="text-xs">Critical</span>
        </div>
      </div>
    </div>
  );
};

export default HeatMapVisualizer;
