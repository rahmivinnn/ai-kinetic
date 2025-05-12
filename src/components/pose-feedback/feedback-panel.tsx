import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  CheckCircle,
  Info,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Download,
  Share2,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';

interface FeedbackItem {
  id: string;
  type: 'correction' | 'positive' | 'suggestion' | 'warning';
  message: string;
  bodyPart?: string;
  severity?: 'low' | 'medium' | 'high';
  timestamp: string;
}

interface FeedbackPanelProps {
  poseData?: any;
  videoId?: string;
}

const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ poseData, videoId }) => {
  const [activeTab, setActiveTab] = useState('realtime');
  const [savedFeedback, setSavedFeedback] = useState<string[]>([]);
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [scores, setScores] = useState({
    overall: 0,
    form: 0,
    alignment: 0,
    stability: 0,
    range: 0
  });

  // Generate feedback based on pose data
  React.useEffect(() => {
    if (poseData) {
      // In a real implementation, this would analyze the pose data
      // and generate appropriate feedback

      // For now, we'll generate some dynamic feedback based on the timestamp
      const timestamp = new Date();
      const timeString = timestamp.toLocaleTimeString();

      // Generate a random score between 60-95
      const generateScore = () => Math.floor(Math.random() * 36) + 60;

      // Update scores
      setScores({
        overall: generateScore(),
        form: generateScore(),
        alignment: generateScore(),
        stability: generateScore(),
        range: generateScore()
      });

      // Generate feedback based on "detected" issues
      const newFeedback: FeedbackItem[] = [];

      // Simulate back alignment issue
      if (Math.random() > 0.5) {
        newFeedback.push({
          id: `back-${Date.now()}`,
          type: 'correction',
          message: 'Keep your back straight during the movement to avoid injury',
          bodyPart: 'back',
          severity: 'high',
          timestamp: 'Just now'
        });
      }

      // Simulate knee alignment feedback
      if (Math.random() > 0.3) {
        newFeedback.push({
          id: `knee-${Date.now()}`,
          type: Math.random() > 0.5 ? 'positive' : 'warning',
          message: Math.random() > 0.5
            ? 'Good knee alignment during the movement'
            : 'Watch your knee alignment, they should track over your toes',
          bodyPart: 'knees',
          severity: Math.random() > 0.5 ? 'low' : 'medium',
          timestamp: 'Just now'
        });
      }

      // Simulate hip position feedback
      if (Math.random() > 0.4) {
        newFeedback.push({
          id: `hip-${Date.now()}`,
          type: 'suggestion',
          message: 'Try to lower your hips more for better form and depth',
          bodyPart: 'hips',
          severity: 'medium',
          timestamp: 'Just now'
        });
      }

      // Simulate shoulder position feedback
      if (Math.random() > 0.6) {
        newFeedback.push({
          id: `shoulder-${Date.now()}`,
          type: 'correction',
          message: 'Keep your shoulders back and down throughout the movement',
          bodyPart: 'shoulders',
          severity: 'medium',
          timestamp: 'Just now'
        });
      }

      // Simulate ankle position feedback
      if (Math.random() > 0.7) {
        newFeedback.push({
          id: `ankle-${Date.now()}`,
          type: 'warning',
          message: 'Watch your ankle position to prevent strain',
          bodyPart: 'ankles',
          severity: 'low',
          timestamp: 'Just now'
        });
      }

      // Add some positive feedback
      if (Math.random() > 0.4) {
        newFeedback.push({
          id: `positive-${Date.now()}`,
          type: 'positive',
          message: 'Good overall form and control during the movement',
          timestamp: 'Just now'
        });
      }

      // Update feedback items, keeping recent history
      setFeedbackItems(prev => {
        // Update timestamps on previous items
        const updatedPrev = prev.map(item => ({
          ...item,
          timestamp: item.timestamp === 'Just now' ? '30s ago' :
                     item.timestamp === '30s ago' ? '1m ago' :
                     item.timestamp === '1m ago' ? '2m ago' :
                     item.timestamp === '2m ago' ? '3m ago' : item.timestamp
        }));

        // Keep only the 5 most recent items including new ones
        return [...newFeedback, ...updatedPrev].slice(0, 5);
      });
    }
  }, [poseData]);

  // Toggle saved feedback
  const toggleSavedFeedback = (id: string) => {
    if (savedFeedback.includes(id)) {
      setSavedFeedback(savedFeedback.filter(itemId => itemId !== id));
    } else {
      setSavedFeedback([...savedFeedback, id]);
    }
  };

  // Get icon based on feedback type
  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case 'correction':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'positive':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'suggestion':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get badge based on feedback type
  const getFeedbackBadge = (type: string) => {
    switch (type) {
      case 'correction':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Correction</Badge>;
      case 'positive':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Positive</Badge>;
      case 'suggestion':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Suggestion</Badge>;
      case 'warning':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Warning</Badge>;
      default:
        return <Badge>Feedback</Badge>;
    }
  };

  return (
    <Card className="feedback-panel">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-primary" />
          Pose Feedback
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="realtime" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="realtime">Real-time</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
          </TabsList>

          <TabsContent value="realtime">
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {feedbackItems.map(item => (
                <Card key={item.id} className="border hover:shadow-sm transition-shadow">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-2">
                        {getFeedbackIcon(item.type)}
                        <div>
                          <p className="text-sm">{item.message}</p>
                          {item.bodyPart && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Body part: {item.bodyPart}
                            </p>
                          )}
                        </div>
                      </div>
                      {getFeedbackBadge(item.type)}
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => toggleSavedFeedback(item.id)}
                        >
                          {savedFeedback.includes(item.id) ? (
                            <BookmarkCheck className="h-4 w-4 text-primary" />
                          ) : (
                            <Bookmark className="h-4 w-4" />
                          )}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <ThumbsUp className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <ThumbsDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="summary">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Overall Performance</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Overall Score</span>
                      <span className="text-sm font-medium">{scores.overall}%</span>
                    </div>
                    <Progress value={scores.overall} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Form</span>
                      <span className="text-sm">{scores.form}%</span>
                    </div>
                    <Progress value={scores.form} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Alignment</span>
                      <span className="text-sm">{scores.alignment}%</span>
                    </div>
                    <Progress value={scores.alignment} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Stability</span>
                      <span className="text-sm">{scores.stability}%</span>
                    </div>
                    <Progress value={scores.stability} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Range of Motion</span>
                      <span className="text-sm">{scores.range}%</span>
                    </div>
                    <Progress value={scores.range} className="h-2" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Key Insights</h3>
                <div className="space-y-2">
                  {feedbackItems.filter(item => item.type === 'correction' || item.severity === 'high').length > 0 ? (
                    <div className="flex items-start space-x-2 p-2 bg-amber-50 rounded-md">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                      <p className="text-sm text-amber-800">
                        {feedbackItems.find(item => item.type === 'correction' || item.severity === 'high')?.message ||
                         'Focus on maintaining proper form throughout the movement'}
                      </p>
                    </div>
                  ) : null}

                  {feedbackItems.filter(item => item.type === 'positive').length > 0 ? (
                    <div className="flex items-start space-x-2 p-2 bg-green-50 rounded-md">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <p className="text-sm text-green-800">
                        {feedbackItems.find(item => item.type === 'positive')?.message ||
                         'Good overall form and control'}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-start space-x-2 p-2 bg-green-50 rounded-md">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <p className="text-sm text-green-800">
                        {scores.overall > 80 ? 'Excellent overall performance!' :
                         scores.overall > 70 ? 'Good overall performance with room for improvement' :
                         'Keep practicing to improve your form and technique'}
                      </p>
                    </div>
                  )}

                  {feedbackItems.filter(item => item.type === 'suggestion').length > 0 ? (
                    <div className="flex items-start space-x-2 p-2 bg-blue-50 rounded-md">
                      <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                      <p className="text-sm text-blue-800">
                        {feedbackItems.find(item => item.type === 'suggestion')?.message ||
                         'Try to focus on your form and technique for better results'}
                      </p>
                    </div>
                  ) : null}

                  {feedbackItems.filter(item => item.type === 'warning' && item.severity !== 'high').length > 0 ? (
                    <div className="flex items-start space-x-2 p-2 bg-red-50 rounded-md">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                      <p className="text-sm text-red-800">
                        {feedbackItems.find(item => item.type === 'warning' && item.severity !== 'high')?.message ||
                         'Watch your form to prevent potential injury'}
                      </p>
                    </div>
                  ) : null}

                  {/* Always show a recommendation based on the scores */}
                  <div className="flex items-start space-x-2 p-2 bg-blue-50 rounded-md">
                    <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                    <p className="text-sm text-blue-800">
                      {scores.form < scores.stability ?
                        'Focus on improving your form for better results' :
                       scores.alignment < scores.range ?
                        'Work on your body alignment to improve overall performance' :
                        'Continue practicing to maintain and improve your technique'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Feedback
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="saved">
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {savedFeedback.length > 0 ? (
                feedbackItems
                  .filter(item => savedFeedback.includes(item.id))
                  .map(item => (
                    <Card key={item.id} className="border hover:shadow-sm transition-shadow">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-2">
                            {getFeedbackIcon(item.type)}
                            <div>
                              <p className="text-sm">{item.message}</p>
                              {item.bodyPart && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Body part: {item.bodyPart}
                                </p>
                              )}
                            </div>
                          </div>
                          {getFeedbackBadge(item.type)}
                        </div>

                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => toggleSavedFeedback(item.id)}
                            >
                              <BookmarkCheck className="h-4 w-4 text-primary" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Bookmark className="h-12 w-12 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium">No saved feedback</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Bookmark important feedback items to save them for later
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FeedbackPanel;
