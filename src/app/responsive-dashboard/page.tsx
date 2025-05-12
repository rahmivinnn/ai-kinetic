'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  BarChart2,
  Calendar,
  Clock,
  FileText,
  Settings,
  User,
  Video,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  return (
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back! Here's an overview of your activity.</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button className="bg-blue-600 hover:bg-blue-700">
              New Analysis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { title: "Total Sessions", value: "24", icon: <Activity className="h-5 w-5 text-blue-600" />, change: "+12% from last month" },
            { title: "Pose Analyses", value: "156", icon: <BarChart2 className="h-5 w-5 text-green-600" />, change: "+8% from last month" },
            { title: "Videos Uploaded", value: "18", icon: <Video className="h-5 w-5 text-purple-600" />, change: "+5% from last month" },
            { title: "Reports Generated", value: "9", icon: <FileText className="h-5 w-5 text-orange-600" />, change: "+15% from last month" }
          ].map((stat, index) => (
            <Card key={index} className="border-2 border-blue-50 dark:border-blue-900/20">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    <p className="text-xs text-green-600 mt-1">{stat.change}</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-full">
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="recent" className="mb-8">
          <TabsList>
            <TabsTrigger value="recent">Recent Activity</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest pose detection and analysis sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: "Squat Form Analysis", time: "Today, 2:30 PM", type: "Analysis", status: "Completed" },
                    { title: "Running Gait Video", time: "Yesterday, 10:15 AM", type: "Upload", status: "Processed" },
                    { title: "Deadlift Form Check", time: "Jul 15, 2023", type: "Analysis", status: "Feedback Available" },
                    { title: "Yoga Pose Sequence", time: "Jul 12, 2023", type: "Analysis", status: "In Progress" }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start p-3 hover:bg-muted/50 rounded-md transition-colors">
                      <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full mr-4">
                        {activity.type === "Analysis" ? (
                          <Activity className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Video className="h-5 w-5 text-purple-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{activity.title}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {activity.time}
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-sm text-muted-foreground">{activity.type}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            activity.status === "Completed" ? "bg-green-100 text-green-800" :
                            activity.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                            "bg-yellow-100 text-yellow-800"
                          }`}>
                            {activity.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View All Activity</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="upcoming" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
                <CardDescription>Your scheduled pose detection and analysis sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: "Weekly Progress Check", time: "Tomorrow, 10:00 AM", type: "Analysis", with: "Dr. Sarah Johnson" },
                    { title: "Monthly Assessment", time: "Jul 25, 2023, 2:30 PM", type: "Analysis", with: "Coach Michael" }
                  ].map((session, index) => (
                    <div key={index} className="flex items-start p-3 hover:bg-muted/50 rounded-md transition-colors">
                      <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full mr-4">
                        <Calendar className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{session.title}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {session.time}
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-sm text-muted-foreground">{session.type}</p>
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                            With: {session.with}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View All Sessions</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>Your generated reports and analyses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: "Monthly Progress Report", date: "Jul 01, 2023", type: "PDF", size: "2.4 MB" },
                    { title: "Posture Analysis Summary", date: "Jun 15, 2023", type: "PDF", size: "1.8 MB" },
                    { title: "Injury Risk Assessment", date: "Jun 01, 2023", type: "PDF", size: "3.2 MB" }
                  ].map((report, index) => (
                    <div key={index} className="flex items-start p-3 hover:bg-muted/50 rounded-md transition-colors">
                      <div className="bg-orange-100 dark:bg-orange-900/20 p-2 rounded-full mr-4">
                        <FileText className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{report.title}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {report.date}
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-sm text-muted-foreground">{report.type} • {report.size}</p>
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View All Reports</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
