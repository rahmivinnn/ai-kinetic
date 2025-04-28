'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Video, MapPin, Plus, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { appointmentAPI } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Custom date formatting and manipulation functions
const formatDate = (date: Date, format: string): string => {
  const options: Record<string, Intl.DateTimeFormatOptions> = {
    'MMM d': { month: 'short', day: 'numeric' },
    'MMM d, yyyy': { month: 'short', day: 'numeric', year: 'numeric' },
    'EEE': { weekday: 'short' },
    'd': { day: 'numeric' },
    'EEEE, MMMM d, yyyy': { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
    'h:mm a': { hour: 'numeric', minute: '2-digit', hour12: true }
  };

  return date.toLocaleDateString('en-US', options[format] || {});
};

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const startOfWeek = (date: Date): Date => {
  const result = new Date(date);
  const day = result.getDay();
  result.setDate(result.getDate() - day);
  return result;
};

const addWeeks = (date: Date, weeks: number): Date => {
  return addDays(date, weeks * 7);
};

const subWeeks = (date: Date, weeks: number): Date => {
  return addDays(date, -weeks * 7);
};
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date()));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>("video_call");
  const [notes, setNotes] = useState("");
  const [availableTimes, setAvailableTimes] = useState<string[]>([
    "09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
  ]);
  const [therapists, setTherapists] = useState<any[]>([
    { id: 'user2', firstName: 'Dr. Jane', lastName: 'Smith', specialty: 'Orthopedic Rehabilitation' },
    { id: 'therapist2', firstName: 'Dr. Michael', lastName: 'Johnson', specialty: 'Sports Rehabilitation' },
    { id: 'therapist3', firstName: 'Dr. Sarah', lastName: 'Williams', specialty: 'Neurological Rehabilitation' },
  ]);
  const [selectedTherapist, setSelectedTherapist] = useState<string>("user2");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentAPI.getAppointments();
      setAppointments(data);
      toast.success("Appointments loaded successfully");
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAppointment = async () => {
    if (!selectedDate || !selectedTime || !selectedTherapist) {
      toast.error("Please select date, time and therapist");
      return;
    }

    try {
      // Parse the selected time
      const [hours, minutes] = selectedTime.split(':');
      const isPM = selectedTime.includes('PM');
      let hour = parseInt(hours);
      if (isPM && hour !== 12) hour += 12;
      if (!isPM && hour === 12) hour = 0;

      // Create date objects for start and end time
      const startTime = new Date(selectedDate);
      startTime.setHours(hour);
      startTime.setMinutes(parseInt(minutes));

      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 1);

      const appointmentData = {
        physiotherapistId: selectedTherapist,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        type: selectedType,
        notes: notes
      };

      const response = await appointmentAPI.createAppointment(appointmentData);

      toast.success("Appointment scheduled successfully!");
      setOpen(false);

      // Reset form
      setSelectedDate(null);
      setSelectedTime(null);
      setNotes("");

      // Refresh appointments
      fetchAppointments();

      // Show confirmation with animation
      setTimeout(() => {
        toast.success("Appointment confirmation sent to your email", {
          description: `Your appointment with Dr. ${response.physiotherapist.lastName} is confirmed.`
        });
      }, 1500);

    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('Failed to schedule appointment');
    }
  };

  const handleCancelAppointment = async (id: string) => {
    try {
      await appointmentAPI.updateAppointment(id, { status: 'cancelled' });
      toast.success("Appointment cancelled successfully");
      fetchAppointments();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Failed to cancel appointment');
    }
  };

  const handleRescheduleAppointment = (appointment: any) => {
    setSelectedDate(new Date(appointment.startTime));
    setSelectedTime(formatDate(new Date(appointment.startTime), 'h:mm a'));
    setSelectedTherapist(appointment.physiotherapistId);
    setSelectedType(appointment.type);
    setNotes(appointment.notes || '');
    setOpen(true);
  };

  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(currentWeek, i));
    }
    return days;
  };

  const getAppointmentStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAppointmentTypeIcon = (type: string) => {
    switch (type) {
      case 'video_call':
        return <Video className="h-4 w-4 text-primary" />;
      case 'in_person':
        return <MapPin className="h-4 w-4 text-primary" />;
      case 'follow_up':
        return <Clock className="h-4 w-4 text-primary" />;
      default:
        return <Calendar className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-muted-foreground">Manage your therapy sessions</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
              <DialogDescription>
                Choose your preferred date, time, and therapist.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="therapist">Select Therapist</Label>
                <Select value={selectedTherapist} onValueChange={setSelectedTherapist}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a therapist" />
                  </SelectTrigger>
                  <SelectContent>
                    {therapists.map((therapist) => (
                      <SelectItem key={therapist.id} value={therapist.id}>
                        {therapist.firstName} {therapist.lastName} - {therapist.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Select Date</Label>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="font-medium">
                      {formatDate(currentWeek, 'MMM d')} - {formatDate(addDays(currentWeek, 6), 'MMM d, yyyy')}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {getWeekDays().map((day) => (
                      <Button
                        key={day.toISOString()}
                        variant={selectedDate && day.toDateString() === selectedDate.toDateString() ? "default" : "outline"}
                        className="h-16 flex flex-col items-center justify-center"
                        onClick={() => setSelectedDate(day)}
                      >
                        <span className="text-xs">{formatDate(day, 'EEE')}</span>
                        <span className="text-lg font-bold">{formatDate(day, 'd')}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {selectedDate && (
                <div className="grid gap-2">
                  <Label>Select Time</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {availableTimes.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="type">Appointment Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video_call">Video Call</SelectItem>
                    <SelectItem value="in_person">In-Person</SelectItem>
                    <SelectItem value="follow_up">Follow-up</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes or questions for your therapist"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateAppointment}>Schedule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="upcoming" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse space-y-4 w-full max-w-3xl">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-muted rounded-lg"></div>
                ))}
              </div>
            </div>
          ) : appointments.filter(a => a.status === 'scheduled' && new Date(a.startTime) > new Date()).length > 0 ? (
            <div className="space-y-4">
              {appointments
                .filter(a => a.status === 'scheduled' && new Date(a.startTime) > new Date())
                .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                .map((appointment) => (
                  <Card key={appointment.id} className="overflow-hidden transition-all hover:shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center">
                            {getAppointmentTypeIcon(appointment.type)}
                            <span className="ml-2">
                              {appointment.type === 'video_call' ? 'Video Consultation' :
                               appointment.type === 'in_person' ? 'In-Person Visit' : 'Follow-up Session'}
                            </span>
                          </CardTitle>
                          <CardDescription>
                            with Dr. {appointment.physiotherapist?.lastName || 'Smith'}
                          </CardDescription>
                        </div>
                        <Badge className={getAppointmentStatusColor(appointment.status)}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{formatDate(new Date(appointment.startTime), 'EEEE, MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            {formatDate(new Date(appointment.startTime), 'h:mm a')} - {formatDate(new Date(appointment.endTime), 'h:mm a')}
                          </span>
                        </div>
                      </div>
                      {appointment.notes && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          <p>{appointment.notes}</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 pt-2">
                      {appointment.type === 'video_call' && appointment.meetingLink && (
                        <Button variant="default" size="sm" asChild>
                          <a href={appointment.meetingLink} target="_blank" rel="noopener noreferrer">
                            <Video className="h-4 w-4 mr-2" />
                            Join Call
                          </a>
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => handleRescheduleAppointment(appointment)}>
                        Reschedule
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleCancelAppointment(appointment.id)}>
                        Cancel
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No upcoming appointments</h3>
                <p className="text-muted-foreground text-center mb-6">
                  You don&apos;t have any upcoming appointments scheduled.
                </p>
                <Button onClick={() => setOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule Appointment
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse space-y-4 w-full max-w-3xl">
                {[1, 2].map((i) => (
                  <div key={i} className="h-32 bg-muted rounded-lg"></div>
                ))}
              </div>
            </div>
          ) : appointments.filter(a => a.status === 'scheduled' && new Date(a.startTime) < new Date()).length > 0 ? (
            <div className="space-y-4">
              {appointments
                .filter(a => a.status === 'scheduled' && new Date(a.startTime) < new Date())
                .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
                .map((appointment) => (
                  <Card key={appointment.id} className="overflow-hidden transition-all hover:shadow-md opacity-80">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center">
                            {getAppointmentTypeIcon(appointment.type)}
                            <span className="ml-2">
                              {appointment.type === 'video_call' ? 'Video Consultation' :
                               appointment.type === 'in_person' ? 'In-Person Visit' : 'Follow-up Session'}
                            </span>
                          </CardTitle>
                          <CardDescription>
                            with Dr. {appointment.physiotherapist?.lastName || 'Smith'}
                          </CardDescription>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">
                          Completed
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{formatDate(new Date(appointment.startTime), 'EEEE, MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            {formatDate(new Date(appointment.startTime), 'h:mm a')} - {formatDate(new Date(appointment.endTime), 'h:mm a')}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 pt-2">
                      <Button variant="outline" size="sm" onClick={() => {
                        toast.success("Feedback submitted", {
                          description: "Thank you for your feedback on your session with Dr. " +
                            (appointment.physiotherapist?.lastName || 'Smith')
                        });
                      }}>
                        Leave Feedback
                      </Button>
                      <Button variant="default" size="sm" onClick={() => handleRescheduleAppointment(appointment)}>
                        Book Follow-up
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No past appointments</h3>
                <p className="text-muted-foreground text-center mb-6">
                  You don&apos;t have any past appointments.
                </p>
                <Button onClick={() => setOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule Your First Appointment
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="cancelled">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse space-y-4 w-full max-w-3xl">
                <div className="h-32 bg-muted rounded-lg"></div>
              </div>
            </div>
          ) : appointments.filter(a => a.status === 'cancelled').length > 0 ? (
            <div className="space-y-4">
              {appointments
                .filter(a => a.status === 'cancelled')
                .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
                .map((appointment) => (
                  <Card key={appointment.id} className="overflow-hidden transition-all hover:shadow-md opacity-70">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center">
                            {getAppointmentTypeIcon(appointment.type)}
                            <span className="ml-2">
                              {appointment.type === 'video_call' ? 'Video Consultation' :
                               appointment.type === 'in_person' ? 'In-Person Visit' : 'Follow-up Session'}
                            </span>
                          </CardTitle>
                          <CardDescription>
                            with Dr. {appointment.physiotherapist?.lastName || 'Smith'}
                          </CardDescription>
                        </div>
                        <Badge className="bg-red-100 text-red-800">
                          Cancelled
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{formatDate(new Date(appointment.startTime), 'EEEE, MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            {formatDate(new Date(appointment.startTime), 'h:mm a')} - {formatDate(new Date(appointment.endTime), 'h:mm a')}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 pt-2">
                      <Button variant="default" size="sm" onClick={() => {
                        setSelectedDate(new Date(appointment.startTime));
                        setSelectedTime(formatDate(new Date(appointment.startTime), 'h:mm a'));
                        setSelectedTherapist(appointment.physiotherapistId);
                        setSelectedType(appointment.type);
                        setNotes(appointment.notes || '');
                        setOpen(true);
                        toast.info("Rescheduling cancelled appointment");
                      }}>
                        Reschedule
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No cancelled appointments</h3>
                <p className="text-muted-foreground text-center">
                  You don't have any cancelled appointments.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
