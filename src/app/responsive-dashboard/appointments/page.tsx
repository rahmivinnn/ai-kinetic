'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, Clock, Plus, Video, User, MapPin, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock appointment data
const upcomingAppointments = [
  {
    id: 1,
    title: 'Weekly Progress Check',
    date: 'July 20, 2023',
    time: '10:00 AM - 11:00 AM',
    practitioner: 'Dr. Sarah Johnson',
    type: 'video',
    location: 'Virtual Session'
  },
  {
    id: 2,
    title: 'Posture Assessment',
    date: 'July 25, 2023',
    time: '2:30 PM - 3:30 PM',
    practitioner: 'Dr. Michael Chen',
    type: 'in-person',
    location: 'Main Clinic, Room 305'
  },
  {
    id: 3,
    title: 'Movement Analysis',
    date: 'August 2, 2023',
    time: '11:15 AM - 12:15 PM',
    practitioner: 'Dr. Emily Rodriguez',
    type: 'video',
    location: 'Virtual Session'
  }
];

const pastAppointments = [
  {
    id: 4,
    title: 'Initial Consultation',
    date: 'July 5, 2023',
    time: '9:00 AM - 10:00 AM',
    practitioner: 'Dr. Sarah Johnson',
    type: 'in-person',
    location: 'Main Clinic, Room 201',
    status: 'completed'
  },
  {
    id: 5,
    title: 'Follow-up Session',
    date: 'July 12, 2023',
    time: '3:00 PM - 4:00 PM',
    practitioner: 'Dr. Michael Chen',
    type: 'video',
    location: 'Virtual Session',
    status: 'completed'
  }
];

export default function AppointmentsPage() {
  const [selectedTab, setSelectedTab] = useState('upcoming');

  return (
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Appointments</h1>
            <p className="text-muted-foreground mt-1">Manage your scheduled sessions</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Schedule New
            </Button>
          </div>
        </div>

        <Tabs defaultValue="upcoming" className="mb-8" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="mt-4">
            <div className="space-y-4">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <Card key={appointment.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-2 bg-blue-500 md:h-auto"></div>
                        <div className="p-6 flex-1">
                          <div className="flex flex-col md:flex-row justify-between">
                            <div>
                              <h3 className="text-xl font-semibold mb-2">{appointment.title}</h3>
                              <div className="flex items-center text-muted-foreground mb-1">
                                <CalendarIcon className="h-4 w-4 mr-2" />
                                {appointment.date}
                              </div>
                              <div className="flex items-center text-muted-foreground mb-1">
                                <Clock className="h-4 w-4 mr-2" />
                                {appointment.time}
                              </div>
                              <div className="flex items-center text-muted-foreground mb-1">
                                <User className="h-4 w-4 mr-2" />
                                {appointment.practitioner}
                              </div>
                              <div className="flex items-center text-muted-foreground">
                                {appointment.type === 'video' ? (
                                  <Video className="h-4 w-4 mr-2" />
                                ) : (
                                  <MapPin className="h-4 w-4 mr-2" />
                                )}
                                {appointment.location}
                              </div>
                            </div>
                            <div className="mt-4 md:mt-0 flex flex-col md:items-end gap-2">
                              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                appointment.type === 'video' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                                {appointment.type === 'video' ? 'Video Call' : 'In-Person'}
                              </div>
                              <div className="flex gap-2 mt-2">
                                {appointment.type === 'video' && (
                                  <Button className="bg-blue-600 hover:bg-blue-700">
                                    Join Call
                                  </Button>
                                )}
                                <Button variant="outline">
                                  Reschedule
                                </Button>
                                <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50">
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Upcoming Appointments</h3>
                    <p className="text-muted-foreground mb-6">You don't have any appointments scheduled.</p>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule New
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="past" className="mt-4">
            <div className="space-y-4">
              {pastAppointments.map((appointment) => (
                <Card key={appointment.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full md:w-2 bg-gray-300 md:h-auto"></div>
                      <div className="p-6 flex-1">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div>
                            <h3 className="text-xl font-semibold mb-2">{appointment.title}</h3>
                            <div className="flex items-center text-muted-foreground mb-1">
                              <CalendarIcon className="h-4 w-4 mr-2" />
                              {appointment.date}
                            </div>
                            <div className="flex items-center text-muted-foreground mb-1">
                              <Clock className="h-4 w-4 mr-2" />
                              {appointment.time}
                            </div>
                            <div className="flex items-center text-muted-foreground mb-1">
                              <User className="h-4 w-4 mr-2" />
                              {appointment.practitioner}
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              {appointment.type === 'video' ? (
                                <Video className="h-4 w-4 mr-2" />
                              ) : (
                                <MapPin className="h-4 w-4 mr-2" />
                              )}
                              {appointment.location}
                            </div>
                          </div>
                          <div className="mt-4 md:mt-0 flex flex-col md:items-end gap-2">
                            <div className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                              <Check className="h-3 w-3 inline mr-1" />
                              Completed
                            </div>
                            <div className="flex gap-2 mt-2">
                              <Button variant="outline">
                                View Summary
                              </Button>
                              <Button variant="outline">
                                Book Follow-up
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="calendar" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Calendar</CardTitle>
                <CardDescription>View and manage your appointments in calendar format</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 flex items-center justify-center">
                  <div className="text-center">
                    <CalendarIcon className="h-16 w-16 mx-auto text-blue-500 mb-4" />
                    <p className="text-muted-foreground">Calendar view would appear here</p>
                    <p className="text-sm text-muted-foreground mt-2">Showing appointments for July 2023</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Previous Month</Button>
                <Button variant="outline">Next Month</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
