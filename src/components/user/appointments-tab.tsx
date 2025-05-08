'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  Video, 
  Phone, 
  MessageSquare, 
  Plus,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

// Mock data for appointments
const mockAppointments = [
  {
    id: 'apt-001',
    doctorName: 'Dr. Sarah Johnson',
    doctorSpecialty: 'Physiotherapist',
    doctorAvatar: '/images/doctor-1.jpg',
    date: '2023-10-20',
    startTime: '10:00',
    endTime: '10:45',
    status: 'upcoming',
    type: 'video',
    notes: 'Follow-up on shoulder rehabilitation progress'
  },
  {
    id: 'apt-002',
    doctorName: 'Dr. Michael Chen',
    doctorSpecialty: 'Orthopedic Specialist',
    doctorAvatar: '/images/doctor-2.jpg',
    date: '2023-10-25',
    startTime: '14:30',
    endTime: '15:15',
    status: 'upcoming',
    type: 'in-person',
    notes: 'Review X-ray results and adjust treatment plan'
  },
  {
    id: 'apt-003',
    doctorName: 'Emma Wilson',
    doctorSpecialty: 'Physical Therapist',
    doctorAvatar: '/images/therapist-1.jpg',
    date: '2023-10-15',
    startTime: '09:00',
    endTime: '09:45',
    status: 'completed',
    type: 'video',
    notes: 'Initial assessment and exercise plan creation'
  },
  {
    id: 'apt-004',
    doctorName: 'Dr. Robert Davis',
    doctorSpecialty: 'Rehabilitation Specialist',
    doctorAvatar: '/images/doctor-3.jpg',
    date: '2023-10-10',
    startTime: '11:30',
    endTime: '12:15',
    status: 'completed',
    type: 'in-person',
    notes: 'Comprehensive evaluation of recovery progress'
  }
];

// Mock data for available time slots
const mockTimeSlots = [
  { time: '09:00', available: true },
  { time: '09:45', available: false },
  { time: '10:30', available: true },
  { time: '11:15', available: true },
  { time: '12:00', available: false },
  { time: '14:00', available: true },
  { time: '14:45', available: true },
  { time: '15:30', available: false },
  { time: '16:15', available: true }
];

export function AppointmentsTab() {
  const [appointments, setAppointments] = useState(mockAppointments);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showScheduler, setShowScheduler] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const filteredAppointments = appointments.filter(apt => {
    if (activeTab === 'upcoming' && apt.status !== 'upcoming') return false;
    if (activeTab === 'completed' && apt.status !== 'completed') return false;
    return true;
  });

  const handleCancelAppointment = (id: string) => {
    toast.info("Appointment cancellation", {
      description: "Are you sure you want to cancel this appointment?",
      action: {
        label: "Confirm",
        onClick: () => {
          setAppointments(appointments.map(apt => 
            apt.id === id ? { ...apt, status: 'cancelled' } : apt
          ));
          toast.success("Appointment cancelled", {
            description: "Your appointment has been cancelled successfully",
            duration: 3000
          });
        }
      },
      duration: 5000
    });
  };

  const handleRescheduleAppointment = (id: string) => {
    setShowScheduler(true);
    toast.info("Appointment rescheduling", {
      description: "Please select a new date and time for your appointment",
      duration: 3000
    });
  };

  const handleJoinCall = (id: string) => {
    toast.info("Joining video call", {
      description: "Preparing to connect you with your doctor",
      duration: 3000
    });
  };

  const handleBookAppointment = () => {
    toast.success("Appointment booked", {
      description: "Your appointment has been scheduled successfully",
      duration: 3000
    });
    setShowScheduler(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const isToday = (dateString: string) => {
    const today = new Date();
    const date = new Date(dateString);
    return date.toDateString() === today.toDateString();
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: '', date: null });
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        day: i,
        date: date,
        isToday: date.toDateString() === new Date().toDateString(),
        hasAppointment: appointments.some(apt => new Date(apt.date).toDateString() === date.toDateString())
      });
    }
    
    return days;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold">Appointments</h2>
        
        <div className="flex gap-2">
          <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Past</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button onClick={() => setShowScheduler(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Book New
          </Button>
        </div>
      </div>

      {showScheduler ? (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Schedule Appointment</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowScheduler(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Calendar */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <Button variant="ghost" size="icon" onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h3 className="font-medium">
                    {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-7 gap-1 text-center">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-xs font-medium text-muted-foreground py-1">
                      {day}
                    </div>
                  ))}
                  
                  {generateCalendarDays().map((day, index) => (
                    <div
                      key={index}
                      className={`
                        p-2 text-center text-sm rounded-md cursor-pointer
                        ${!day.date ? 'invisible' : ''}
                        ${day.isToday ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}
                        ${day.hasAppointment && !day.isToday ? 'border border-primary/50' : ''}
                      `}
                      onClick={() => day.date && setSelectedDate(day.date)}
                    >
                      {day.day}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Time slots */}
              <div>
                <h3 className="font-medium mb-3">Available Time Slots</h3>
                <div className="grid grid-cols-3 gap-2">
                  {mockTimeSlots.map((slot, index) => (
                    <Button
                      key={index}
                      variant={slot.available ? "outline" : "ghost"}
                      className={`${!slot.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={!slot.available}
                    >
                      {slot.time}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Doctor selection */}
              <div>
                <h3 className="font-medium mb-3">Select Doctor</h3>
                <div className="space-y-2">
                  {mockAppointments.slice(0, 2).map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                    >
                      <Avatar>
                        <AvatarFallback>{apt.doctorName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{apt.doctorName}</h4>
                        <p className="text-sm text-muted-foreground">{apt.doctorSpecialty}</p>
                      </div>
                      <div className="ml-auto">
                        <Badge variant="outline">Available</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowScheduler(false)}>Cancel</Button>
                <Button onClick={handleBookAppointment}>Book Appointment</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-full bg-muted animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded animate-pulse w-1/2 mb-4"></div>
                    <div className="h-10 bg-muted rounded animate-pulse w-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredAppointments.length > 0 ? (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="overflow-hidden hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>{appointment.doctorName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h3 className="font-medium">{appointment.doctorName}</h3>
                      <p className="text-sm text-muted-foreground">{appointment.doctorSpecialty}</p>
                      
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-sm">
                            {isToday(appointment.date) ? 'Today' : formatDate(appointment.date)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-sm">
                            {appointment.startTime} - {appointment.endTime}
                          </span>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`
                            ${appointment.type === 'video' ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-green-200 bg-green-50 text-green-700'}
                          `}
                        >
                          {appointment.type === 'video' ? 'Video Call' : 'In-Person'}
                        </Badge>
                      </div>
                      
                      {appointment.notes && (
                        <p className="text-sm mt-2 p-2 bg-muted/50 rounded-md">
                          {appointment.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="md:ml-auto flex flex-col md:flex-row gap-2 mt-4 md:mt-0 md:items-start">
                    {appointment.status === 'upcoming' && (
                      <>
                        {appointment.type === 'video' && (
                          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => handleJoinCall(appointment.id)}>
                            <Video className="h-4 w-4 mr-2" />
                            Join Call
                          </Button>
                        )}
                        <Button variant="outline" onClick={() => handleRescheduleAppointment(appointment.id)}>
                          Reschedule
                        </Button>
                        <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleCancelAppointment(appointment.id)}>
                          Cancel
                        </Button>
                      </>
                    )}
                    
                    {appointment.status === 'completed' && (
                      <>
                        <Button variant="outline" asChild>
                          <Link href="/messages">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Message
                          </Link>
                        </Button>
                        <Button variant="ghost">
                          View Summary
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-muted/30 p-4 rounded-full mb-4">
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No appointments found</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            {activeTab === 'upcoming' 
              ? "You don't have any upcoming appointments scheduled." 
              : "You don't have any past appointments."}
          </p>
          <Button onClick={() => setShowScheduler(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Book Appointment
          </Button>
        </div>
      )}
    </div>
  );
}
