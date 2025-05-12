'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Share2, 
  Eye, 
  Calendar, 
  Clock, 
  User, 
  BarChart2, 
  PieChart, 
  LineChart, 
  Plus, 
  Printer, 
  Mail
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

// Sample report data
const sampleReports = [
  {
    id: 1,
    title: 'Monthly Progress Report - July 2023',
    type: 'progress',
    date: '2023-07-15',
    client: 'John Smith',
    summary: 'Overall improvement in squat form and shoulder mobility.',
    metrics: {
      formScore: 85,
      rangeOfMotion: 78,
      stability: 82,
      progress: 12
    },
    status: 'completed'
  },
  {
    id: 2,
    title: 'Running Gait Analysis',
    type: 'analysis',
    date: '2023-07-10',
    client: 'Emily Johnson',
    summary: 'Detailed analysis of running form with recommendations for improvement.',
    metrics: {
      formScore: 72,
      efficiency: 68,
      impact: 75,
      progress: 8
    },
    status: 'completed'
  },
  {
    id: 3,
    title: 'Posture Assessment',
    type: 'assessment',
    date: '2023-07-05',
    client: 'Sarah Williams',
    summary: 'Comprehensive posture analysis with corrective exercise recommendations.',
    metrics: {
      alignment: 65,
      balance: 70,
      muscleImbalance: 60,
      progress: 5
    },
    status: 'completed'
  },
  {
    id: 4,
    title: 'Rehabilitation Progress - Knee',
    type: 'rehabilitation',
    date: '2023-06-30',
    client: 'David Rodriguez',
    summary: 'Post-surgery rehabilitation progress tracking and next steps.',
    metrics: {
      painLevel: 3,
      mobility: 65,
      strength: 60,
      progress: 15
    },
    status: 'completed'
  },
  {
    id: 5,
    title: 'Yoga Form Analysis',
    type: 'analysis',
    date: '2023-06-25',
    client: 'Michael Chen',
    summary: 'Analysis of key yoga poses with alignment feedback.',
    metrics: {
      alignment: 80,
      balance: 85,
      flexibility: 75,
      progress: 10
    },
    status: 'completed'
  },
  {
    id: 6,
    title: 'Initial Assessment Report',
    type: 'assessment',
    date: '2023-07-20',
    client: 'Lisa Thompson',
    summary: 'Initial fitness assessment and goal setting.',
    status: 'pending'
  }
];

export default function ReportsPage() {
  const [reports, setReports] = useState(sampleReports);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedReport, setSelectedReport] = useState<number | null>(null);
  
  // Filter reports based on search query and active tab
  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (report.summary && report.summary.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'progress' && report.type === 'progress') ||
      (activeTab === 'analysis' && report.type === 'analysis') ||
      (activeTab === 'assessment' && report.type === 'assessment') ||
      (activeTab === 'rehabilitation' && report.type === 'rehabilitation');
    
    return matchesSearch && matchesTab;
  });
  
  // Generate a new report
  const generateReport = () => {
    toast.info('Report generation form would open here');
  };
  
  // View report details
  const viewReport = (id: number) => {
    setSelectedReport(id);
  };
  
  // Download report
  const downloadReport = (id: number) => {
    const report = reports.find(r => r.id === id);
    if (!report) return;
    
    toast.success(`Downloading: ${report.title}`);
  };
  
  // Share report
  const shareReport = (id: number) => {
    const report = reports.find(r => r.id === id);
    if (!report) return;
    
    toast.info(`Sharing options for: ${report.title}`);
  };
  
  // Print report
  const printReport = (id: number) => {
    const report = reports.find(r => r.id === id);
    if (!report) return;
    
    toast.info(`Preparing to print: ${report.title}`);
  };
  
  // Email report
  const emailReport = (id: number) => {
    const report = reports.find(r => r.id === id);
    if (!report) return;
    
    toast.info(`Email options for: ${report.title}`);
  };
  
  return (
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-muted-foreground mt-1">View and generate detailed analysis reports</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={generateReport}
            >
              <Plus className="h-4 w-4 mr-2" />
              Generate New Report
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList className="bg-gray-100">
              <TabsTrigger value="all" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                All Reports
              </TabsTrigger>
              <TabsTrigger value="progress" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Progress
              </TabsTrigger>
              <TabsTrigger value="analysis" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Analysis
              </TabsTrigger>
              <TabsTrigger value="assessment" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Assessment
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="mt-4 md:mt-0 flex w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search reports..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="ml-2">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Reports List */}
          <div className={selectedReport ? "hidden md:block md:col-span-1" : "col-span-full"}>
            {filteredReports.length > 0 ? (
              <div className="space-y-4">
                {filteredReports.map(report => (
                  <Card 
                    key={report.id} 
                    className={`cursor-pointer hover:border-blue-300 transition-colors ${
                      selectedReport === report.id ? 'border-blue-500' : ''
                    }`}
                    onClick={() => viewReport(report.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge 
                            className={`mb-2 ${
                              report.type === 'progress' 
                                ? 'bg-green-100 text-green-800 border-green-200' 
                                : report.type === 'analysis'
                                  ? 'bg-blue-100 text-blue-800 border-blue-200'
                                  : report.type === 'assessment'
                                    ? 'bg-purple-100 text-purple-800 border-purple-200'
                                    : 'bg-amber-100 text-amber-800 border-amber-200'
                            }`}
                          >
                            {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                          </Badge>
                          <h3 className="font-medium">{report.title}</h3>
                        </div>
                        
                        <Badge 
                          variant="outline" 
                          className={report.status === 'completed' 
                            ? 'border-green-200 text-green-800' 
                            : 'border-amber-200 text-amber-800'
                          }
                        >
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="mt-2 space-y-1 text-sm">
                        <div className="flex items-center text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {report.date}
                        </div>
                        <div className="flex items-center text-gray-500">
                          <User className="h-3 w-3 mr-1" />
                          {report.client}
                        </div>
                      </div>
                      
                      {report.summary && (
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{report.summary}</p>
                      )}
                      
                      <div className="flex justify-end mt-3 space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadReport(report.id);
                          }}
                        >
                          <Download className="h-4 w-4 text-gray-500 hover:text-blue-600" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            shareReport(report.id);
                          }}
                        >
                          <Share2 className="h-4 w-4 text-gray-500 hover:text-blue-600" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            viewReport(report.id);
                          }}
                        >
                          <Eye className="h-4 w-4 text-gray-500 hover:text-blue-600" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">No reports found</h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery 
                    ? `No reports matching "${searchQuery}"`
                    : "You haven't generated any reports yet"}
                </p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={generateReport}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Your First Report
                </Button>
              </Card>
            )}
          </div>
          
          {/* Report Details */}
          {selectedReport && (
            <div className="md:col-span-2">
              {(() => {
                const report = reports.find(r => r.id === selectedReport);
                if (!report) return null;
                
                return (
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge 
                            className={`mb-2 ${
                              report.type === 'progress' 
                                ? 'bg-green-100 text-green-800 border-green-200' 
                                : report.type === 'analysis'
                                  ? 'bg-blue-100 text-blue-800 border-blue-200'
                                  : report.type === 'assessment'
                                    ? 'bg-purple-100 text-purple-800 border-purple-200'
                                    : 'bg-amber-100 text-amber-800 border-amber-200'
                            }`}
                          >
                            {report.type.charAt(0).toUpperCase() + report.type.slice(1)} Report
                          </Badge>
                          <CardTitle>{report.title}</CardTitle>
                        </div>
                        <div className="md:hidden">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setSelectedReport(null)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                              <path d="M18 6L6 18M6 6l12 12"></path>
                            </svg>
                          </Button>
                        </div>
                      </div>
                      <CardDescription>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {report.date}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <User className="h-4 w-4 mr-1" />
                            {report.client}
                          </div>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {report.summary && (
                        <div className="mb-6">
                          <h3 className="text-lg font-medium mb-2">Summary</h3>
                          <p className="text-gray-700">{report.summary}</p>
                        </div>
                      )}
                      
                      {report.metrics && (
                        <div className="mb-6">
                          <h3 className="text-lg font-medium mb-4">Key Metrics</h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.entries(report.metrics).map(([key, value]) => (
                              <Card key={key} className="bg-gray-50">
                                <CardContent className="p-4 text-center">
                                  <p className="text-sm text-gray-500 mb-1">
                                    {key.replace(/([A-Z])/g, ' $1').trim().charAt(0).toUpperCase() + key.replace(/([A-Z])/g, ' $1').trim().slice(1)}
                                  </p>
                                  <div className="text-2xl font-bold">
                                    {typeof value === 'number' ? (
                                      key.toLowerCase().includes('progress') ? `+${value}%` : `${value}%`
                                    ) : (
                                      value
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-4">Visualizations</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card className="bg-gray-50">
                            <CardContent className="p-4 flex flex-col items-center justify-center h-40">
                              <BarChart2 className="h-12 w-12 text-blue-500 mb-2" />
                              <p className="text-gray-500 text-sm">Performance Metrics</p>
                            </CardContent>
                          </Card>
                          <Card className="bg-gray-50">
                            <CardContent className="p-4 flex flex-col items-center justify-center h-40">
                              <LineChart className="h-12 w-12 text-green-500 mb-2" />
                              <p className="text-gray-500 text-sm">Progress Over Time</p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Recommendations</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700">
                          <li>Continue focusing on proper form during squats</li>
                          <li>Increase mobility exercises for shoulder range of motion</li>
                          <li>Maintain consistent practice schedule</li>
                          <li>Consider adding balance exercises to your routine</li>
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={() => setSelectedReport(null)} className="md:hidden">
                        Back to List
                      </Button>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => downloadReport(report.id)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => printReport(report.id)}
                        >
                          <Printer className="h-4 w-4 mr-1" />
                          Print
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => emailReport(report.id)}
                        >
                          <Mail className="h-4 w-4 mr-1" />
                          Email
                        </Button>
                        <Button 
                          className="bg-blue-600 hover:bg-blue-700"
                          size="sm"
                          onClick={() => shareReport(report.id)}
                        >
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })()}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
