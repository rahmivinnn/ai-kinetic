'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2, LineChart, PieChart, TrendingUp, Download, Calendar, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground mt-1">Detailed statistics and performance metrics</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Calendar className="h-4 w-4 mr-2" />
              Date Range
            </Button>
          </div>
        </div>

        <Tabs defaultValue="performance" className="mb-8">
          <TabsList>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Movement Accuracy</CardTitle>
                  <CardDescription>Average accuracy across all exercises</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-40">
                    <div className="relative w-32 h-32 flex items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20">
                      <div className="absolute inset-0 rounded-full border-8 border-blue-500 border-opacity-30"></div>
                      <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-blue-500" style={{ transform: 'rotate(45deg)' }}></div>
                      <div className="text-3xl font-bold text-blue-600">78%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-muted-foreground">Previous: 72%</div>
                    <div className="flex items-center text-sm text-green-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +6%
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Exercise Completion</CardTitle>
                  <CardDescription>Percentage of assigned exercises completed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-40">
                    <div className="relative w-32 h-32 flex items-center justify-center rounded-full bg-green-50 dark:bg-green-900/20">
                      <div className="absolute inset-0 rounded-full border-8 border-green-500 border-opacity-30"></div>
                      <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-green-500 border-r-green-500 border-b-green-500" style={{ transform: 'rotate(45deg)' }}></div>
                      <div className="text-3xl font-bold text-green-600">92%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-muted-foreground">Previous: 85%</div>
                    <div className="flex items-center text-sm text-green-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +7%
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Form Quality</CardTitle>
                  <CardDescription>Overall exercise form quality score</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-40">
                    <div className="relative w-32 h-32 flex items-center justify-center rounded-full bg-purple-50 dark:bg-purple-900/20">
                      <div className="absolute inset-0 rounded-full border-8 border-purple-500 border-opacity-30"></div>
                      <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-purple-500 border-r-purple-500" style={{ transform: 'rotate(45deg)' }}></div>
                      <div className="text-3xl font-bold text-purple-600">85%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-muted-foreground">Previous: 80%</div>
                    <div className="flex items-center text-sm text-green-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +5%
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Your performance metrics over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="h-16 w-16 mx-auto text-blue-500 mb-4" />
                    <p className="text-muted-foreground">Performance chart visualization would appear here</p>
                    <p className="text-sm text-muted-foreground mt-2">Showing data from June 15 - July 15, 2023</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="progress" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Progress Over Time</CardTitle>
                <CardDescription>Track your improvement across different metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart2 className="h-16 w-16 mx-auto text-green-500 mb-4" />
                    <p className="text-muted-foreground">Progress chart visualization would appear here</p>
                    <p className="text-sm text-muted-foreground mt-2">Showing progress for the last 3 months</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="comparison" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Comparative Analysis</CardTitle>
                <CardDescription>Compare your performance with benchmarks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <div className="text-center">
                    <PieChart className="h-16 w-16 mx-auto text-purple-500 mb-4" />
                    <p className="text-muted-foreground">Comparison chart visualization would appear here</p>
                    <p className="text-sm text-muted-foreground mt-2">Comparing your data with average user metrics</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
