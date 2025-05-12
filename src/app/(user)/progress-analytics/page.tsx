"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Download, Info, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface ExerciseHistory {
  id: string;
  date: string;
  exercise: string;
  duration: string;
  aiScore: string;
  notes: string;
}

const exerciseHistory: ExerciseHistory[] = [
  {
    id: "1",
    date: "May 15, 2023",
    exercise: "Knee Extension",
    duration: "Complete",
    aiScore: "85%",
    notes: "Good progress",
  },
  {
    id: "2",
    date: "May 14, 2023",
    exercise: "Hamstring Curls",
    duration: "Complete",
    aiScore: "82%",
    notes: "Form improved",
  },
  {
    id: "3",
    date: "May 12, 2023",
    exercise: "Balance Training",
    duration: "Complete",
    aiScore: "78%",
    notes: "Need more stability",
  },
];

export default function ProgressAnalytics() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [showDetails, setShowDetails] = useState(false);
  const [mobilityValue, setMobilityValue] = useState(75);
  const [strengthValue, setStrengthValue] = useState(45);
  const [consistencyValue, setConsistencyValue] = useState(85);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    toast.success(`Switched to ${value} tab`);
  };

  const handleViewDetails = (metric: string) => {
    toast.info(`Viewing details for ${metric}`);
    setShowDetails(!showDetails);
  };

  const handleDownloadReport = () => {
    toast.success("Report downloaded successfully");
  };

  const handleRequestReport = () => {
    toast.success("Report request sent to Dr. Johnson");
  };

  return (
    <div className="space-y-8 p-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Your Progress Analytics</h1>
        <div className="flex space-x-2 text-sm text-muted-foreground">
          <Tabs
            defaultValue="Overview"
            className="flex space-x-2 text-sm text-muted-foreground w-full"
            onValueChange={handleTabChange}
          >
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
              <TabsTrigger
                value="Overview"
                className="relative rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none "
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="Exercise"
                className="relative rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none "
              >
                Exercise History
              </TabsTrigger>
              <TabsTrigger
                value="Detailed"
                className="relative rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none "
              >
                Detailed Comparison
              </TabsTrigger>
              <TabsTrigger
                value="Custom"
                className="relative rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none "
              >
                Custom Reports
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Recovery Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 space-y-4">
              <h3 className="font-medium">Mobility</h3>
              <Progress value={mobilityValue} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {mobilityValue}% improvement in knee range of motion
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewDetails("Mobility")}
              >
                View Details
              </Button>
              {showDetails && activeTab === "Overview" && (
                <div className="mt-4 p-3 bg-muted rounded-md">
                  <p className="text-sm">Detailed mobility analysis shows consistent improvement over the last 4 weeks.</p>
                  <div className="flex justify-between mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setMobilityValue(prev => Math.min(prev + 5, 100))}
                    >
                      <ChevronUp className="h-4 w-4 mr-1" /> Increase
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setMobilityValue(prev => Math.max(prev - 5, 0))}
                    >
                      <ChevronDown className="h-4 w-4 mr-1" /> Decrease
                    </Button>
                  </div>
                </div>
              )}
            </Card>
            <Card className="p-6 space-y-4">
              <h3 className="font-medium">Strength</h3>
              <Progress value={strengthValue} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {strengthValue}% increase in muscle strength
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewDetails("Strength")}
              >
                View Details
              </Button>
              {showDetails && activeTab === "Overview" && (
                <div className="mt-4 p-3 bg-muted rounded-md">
                  <p className="text-sm">Strength training has shown moderate improvement. Consider increasing resistance exercises.</p>
                  <div className="flex justify-between mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStrengthValue(prev => Math.min(prev + 5, 100))}
                    >
                      <ChevronUp className="h-4 w-4 mr-1" /> Increase
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStrengthValue(prev => Math.max(prev - 5, 0))}
                    >
                      <ChevronDown className="h-4 w-4 mr-1" /> Decrease
                    </Button>
                  </div>
                </div>
              )}
            </Card>
            <Card className="p-6 space-y-4">
              <h3 className="font-medium">Consistency</h3>
              <Progress value={consistencyValue} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {consistencyValue}% exercise completion rate
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewDetails("Consistency")}
              >
                View Details
              </Button>
              {showDetails && activeTab === "Overview" && (
                <div className="mt-4 p-3 bg-muted rounded-md">
                  <p className="text-sm">Excellent consistency! You've maintained a high completion rate throughout your program.</p>
                  <div className="flex justify-between mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setConsistencyValue(prev => Math.min(prev + 5, 100))}
                    >
                      <ChevronUp className="h-4 w-4 mr-1" /> Increase
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setConsistencyValue(prev => Math.max(prev - 5, 0))}
                    >
                      <ChevronDown className="h-4 w-4 mr-1" /> Decrease
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>

        <Card className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              AI Detected Form Improvements
            </h2>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.info("Viewing AI auto evaluation")}
              >
                View Auto Evaluation
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadReport}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Our AI has detected significant improvements in your exercise form
            and alignment
          </p>
          {showDetails && (
            <div className="mt-4 p-4 bg-muted rounded-md">
              <h3 className="text-sm font-medium mb-2">AI Analysis Details</h3>
              <ul className="text-sm space-y-2">
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-2 mt-0.5">Improved</span>
                  <span>Knee alignment during extension exercises has improved by 27%</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-2 mt-0.5">Improved</span>
                  <span>Balance stability during single-leg exercises has improved by 18%</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full mr-2 mt-0.5">Needs Work</span>
                  <span>Hip rotation during lateral movements needs more attention</span>
                </li>
              </ul>
            </div>
          )}
        </Card>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Exercise Completion History</h2>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Date</th>
                    <th className="text-left p-4">Exercise Type</th>
                    <th className="text-left p-4">Duration</th>
                    <th className="text-left p-4">AI Score</th>
                    <th className="text-left p-4">Therapist Notes</th>
                    <th className="text-left p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {exerciseHistory.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-muted/50 cursor-pointer">
                      <td className="p-4">{item.date}</td>
                      <td className="p-4">{item.exercise}</td>
                      <td className="p-4">{item.duration}</td>
                      <td className="p-4">{item.aiScore}</td>
                      <td className="p-4">{item.notes}</td>
                      <td className="p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toast.info(`Viewing details for ${item.exercise} on ${item.date}`)}
                        >
                          <Info className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.success("Exercise history exported successfully")}
              >
                <Download className="h-4 w-4 mr-2" />
                Export History
              </Button>
            </div>
          </Card>
        </div>

        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Pain Level Tracking</h2>
          <p className="text-sm text-muted-foreground">
            Pain levels have decreased by 35% since beginning treatment. The
            most significant improvement occurred after week 4 of your exercise
            program.
          </p>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("Viewing pain chart")}
            >
              View Pain Chart
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("Viewing current treatment plan")}
            >
              See Current Plan
            </Button>
          </div>
          {showDetails && (
            <div className="mt-4 p-4 bg-muted rounded-md">
              <h3 className="text-sm font-medium mb-2">Pain Level History</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs">Week 1</span>
                  <div className="w-3/4 bg-gray-200 rounded-full h-2.5">
                    <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-xs font-medium">8.5/10</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs">Week 4</span>
                  <div className="w-3/4 bg-gray-200 rounded-full h-2.5">
                    <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <span className="text-xs font-medium">6.5/10</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs">Week 8</span>
                  <div className="w-3/4 bg-gray-200 rounded-full h-2.5">
                    <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                  <span className="text-xs font-medium">5.0/10</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs">Current</span>
                  <div className="w-3/4 bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                  <span className="text-xs font-medium">3.5/10</span>
                </div>
              </div>
            </div>
          )}
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-start space-x-4">
            <Image
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop"
              alt="Dr. Johnson"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="flex-1">
              <h3 className="font-semibold">Dr. Johnson&apos;s Assessment</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Excellent progress in maintaining proper form during exercises
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleRequestReport}
          >
            Request Comprehensive Report
          </Button>
          {showDetails && (
            <div className="mt-4 p-4 bg-muted rounded-md">
              <h3 className="text-sm font-medium mb-2">Latest Assessment Notes</h3>
              <p className="text-sm">
                Patient has shown remarkable improvement in knee stability and range of motion.
                The consistent adherence to the exercise program has yielded positive results.
                Recommend continuing with the current program with a gradual increase in resistance training.
              </p>
              <div className="mt-3 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toast.success("Message sent to Dr. Johnson")}
                >
                  Send Message
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
