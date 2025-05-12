import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ThumbsUp, ThumbsDown, Volume2, VolumeX, Mic, MicOff } from 'lucide-react';

interface VirtualCoachProps {
  poseData?: any;
}

const VirtualCoach: React.FC<VirtualCoachProps> = ({ poseData }) => {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(false);
  const [feedbackHistory, setFeedbackHistory] = useState([
    { id: 1, message: "Keep your back straight during the squat", timestamp: "Just now", type: "correction" },
    { id: 2, message: "Great job maintaining knee alignment", timestamp: "30s ago", type: "positive" },
    { id: 3, message: "Try to lower your hips more on the next rep", timestamp: "1m ago", type: "suggestion" },
    { id: 4, message: "Watch your breathing pattern", timestamp: "2m ago", type: "reminder" },
  ]);
  
  // Toggle audio feedback
  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };
  
  // Toggle microphone for voice commands
  const toggleMic = () => {
    setMicEnabled(!micEnabled);
  };
  
  // Get badge color based on feedback type
  const getFeedbackBadge = (type: string) => {
    switch (type) {
      case "correction":
        return <Badge className="bg-red-100 text-red-700 border-red-200">Correction</Badge>;
      case "positive":
        return <Badge className="bg-green-100 text-green-700 border-green-200">Positive</Badge>;
      case "suggestion":
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Suggestion</Badge>;
      case "reminder":
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Reminder</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Feedback</Badge>;
    }
  };
  
  return (
    <div className="virtual-coach">
      <div className="coach-controls flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium flex items-center">
          <MessageSquare className="h-4 w-4 mr-1 text-blue-600" />
          Virtual Coach
        </h3>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className={`p-1 ${audioEnabled ? 'bg-blue-50 text-blue-700' : ''}`}
            onClick={toggleAudio}
          >
            {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className={`p-1 ${micEnabled ? 'bg-blue-50 text-blue-700' : ''}`}
            onClick={toggleMic}
          >
            {micEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      <div className="feedback-history space-y-2 max-h-40 overflow-y-auto">
        {feedbackHistory.map(feedback => (
          <Card key={feedback.id} className="border border-gray-200">
            <CardContent className="p-2">
              <div className="flex justify-between items-start">
                <p className="text-sm">{feedback.message}</p>
                {getFeedbackBadge(feedback.type)}
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500">{feedback.timestamp}</span>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <ThumbsUp className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <ThumbsDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VirtualCoach;
