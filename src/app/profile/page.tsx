"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { UpdateProfileButton } from '@/components/ui/action-buttons';
import { Camera, Edit, Calendar, Clock, Activity, Award, Download } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="md:w-1/3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>

                <h2 className="text-xl font-bold mt-4">John Doe</h2>
                <p className="text-sm text-muted-foreground">john.doe@example.com</p>

                <div className="flex gap-2 mt-4">
                  <Badge>Patient</Badge>
                  <Badge variant="outline">Premium</Badge>
                </div>

                <div className="w-full mt-6">
                  <UpdateProfileButton onClick={() => console.log('Update profile')} className="w-full" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">John Doe</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">john.doe@example.com</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">+1 (555) 123-4567</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">January 15, 1985</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">123 Main St, Anytown, CA 12345</p>
                </div>

                <Button variant="outline" className="w-full" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Information
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-2/3">
          <Tabs defaultValue="activity">
            <TabsList className="mb-4">
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="analysis">Analysis History</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your recent pose detection and analysis activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-start gap-4 p-3 hover:bg-muted/50 rounded-md transition-colors">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Activity className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium">
                              {i % 2 === 0 ? "Pose Analysis Completed" : "Video Uploaded"}
                            </h3>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              {i === 1 ? "Just now" : i === 2 ? "2 hours ago" : `${i} days ago`}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {i % 2 === 0
                              ? "Your pose analysis has been completed with 85% accuracy."
                              : "You uploaded a new video for analysis."}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis">
              <Card>
                <CardHeader>
                  <CardTitle>Analysis History</CardTitle>
                  <CardDescription>
                    Your past pose detection and analysis sessions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="border rounded-md p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">
                              {i === 1 ? "Squat Form Analysis" :
                               i === 2 ? "Running Gait Analysis" :
                               i === 3 ? "Deadlift Posture Check" : "Yoga Pose Analysis"}
                            </h3>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <Calendar className="h-3 w-3 mr-1" />
                              {`${new Date().getMonth() + 1}/${new Date().getDate() - i}/${new Date().getFullYear()}`}
                            </div>
                          </div>
                          <Badge>
                            {i === 1 ? "Completed" :
                             i === 2 ? "Reviewed" :
                             i === 3 ? "Feedback Available" : "In Progress"}
                          </Badge>
                        </div>

                        <Separator className="my-3" />

                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-sm">
                            <Award className="h-4 w-4 mr-1 text-primary" />
                            Score: {90 - (i * 5)}%
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-3 w-3 mr-1" />
                            Download Report
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="progress">
              <Card>
                <CardHeader>
                  <CardTitle>Progress Tracking</CardTitle>
                  <CardDescription>
                    Track your improvement over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                    <p className="text-muted-foreground">Progress charts will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports">
              <Card>
                <CardHeader>
                  <CardTitle>Reports</CardTitle>
                  <CardDescription>
                    View and download your analysis reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex justify-between items-center p-3 border rounded-md">
                        <div className="flex items-center">
                          <div className="bg-primary/10 p-2 rounded-full mr-3">
                            <Activity className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">
                              {i === 1 ? "Monthly Progress Report" :
                               i === 2 ? "Posture Analysis Summary" : "Injury Risk Assessment"}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {`Generated on ${new Date().getMonth() + 1}/${new Date().getDate() - i * 5}/${new Date().getFullYear()}`}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
