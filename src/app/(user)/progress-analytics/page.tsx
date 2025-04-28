"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Info } from "lucide-react";

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
  return (
    <div className="space-y-8 p-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Your Progress Analytics</h1>
        <div className="flex space-x-2 text-sm text-muted-foreground">
          <Tabs
            defaultValue="Overview"
            className="flex space-x-2 text-sm text-muted-foreground"
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
              <Progress value={75} className="h-2" />
              <p className="text-sm text-muted-foreground">
                75% improvement in knee range of motion
              </p>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </Card>
            <Card className="p-6 space-y-4">
              <h3 className="font-medium">Strength</h3>
              <Progress value={45} className="h-2" />
              <p className="text-sm text-muted-foreground">
                45% increase in muscle strength
              </p>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </Card>
            <Card className="p-6 space-y-4">
              <h3 className="font-medium">Consistency</h3>
              <Progress value={85} className="h-2" />
              <p className="text-sm text-muted-foreground">
                85% exercise completion rate
              </p>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </Card>
          </div>
        </div>

        <Card className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              AI Detected Form Improvements
            </h2>
            <div className="space-x-2">
              <Button variant="outline" size="sm">
                View Auto Evaluation
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Our AI has detected significant improvements in your exercise form
            and alignment
          </p>
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
                    <tr key={item.id} className="border-b">
                      <td className="p-4">{item.date}</td>
                      <td className="p-4">{item.exercise}</td>
                      <td className="p-4">{item.duration}</td>
                      <td className="p-4">{item.aiScore}</td>
                      <td className="p-4">{item.notes}</td>
                      <td className="p-4">
                        <Button variant="ghost" size="sm">
                          <Info className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
            <Button variant="outline" size="sm">
              View Pain Chart
            </Button>
            <Button variant="outline" size="sm">
              See Current Plan
            </Button>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-start space-x-4">
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop"
              alt="Dr. Johnson"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <h3 className="font-semibold">Dr. Johnson&apos;s Assessment</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Excellent progress in maintaining proper form during exercises
              </p>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            Request Comprehensive Report
          </Button>
        </Card>
      </div>
    </div>
  );
}
