'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VideoCall } from "@/components/user/video-call";
import { Calendar, Clock, Video, Phone, ArrowLeft } from "lucide-react";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const doctors = [
  {
    id: '1',
    name: 'Dr. Jane Smith',
    specialty: 'Physiotherapist',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=250&h=250&fit=crop',
    available: true,
    nextAvailable: 'Now'
  },
  {
    id: '2',
    name: 'Dr. Michael Johnson',
    specialty: 'Orthopedic Specialist',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=250&h=250&fit=crop',
    available: false,
    nextAvailable: 'Tomorrow, 10:00 AM'
  },
  {
    id: '3',
    name: 'Dr. Sarah Williams',
    specialty: 'Physical Therapist',
    avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=250&h=250&fit=crop',
    available: true,
    nextAvailable: 'In 30 minutes'
  }
];

export default function VideoCallPage() {
  const router = useRouter();
  const [selectedDoctor, setSelectedDoctor] = useState<typeof doctors[0] | null>(null);
  const [callInProgress, setCallInProgress] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const startCall = (doctor: typeof doctors[0]) => {
    if (!doctor.available) {
      toast.error(`${doctor.name} is not available right now`, {
        description: `Next available: ${doctor.nextAvailable}`
      });
      return;
    }
    
    setSelectedDoctor(doctor);
    setCallInProgress(true);
    toast.info(`Starting call with ${doctor.name}`);
  };

  const endCall = () => {
    setCallInProgress(false);
    setIsFullScreen(false);
    setSelectedDoctor(null);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {callInProgress && selectedDoctor ? (
        <VideoCall 
          doctorId={selectedDoctor.id}
          doctorName={selectedDoctor.name}
          doctorAvatar={selectedDoctor.avatar}
          doctorSpecialty={selectedDoctor.specialty}
          onClose={endCall}
          isFullScreen={isFullScreen}
        />
      ) : (
        <>
          <div className="flex items-center mb-6">
            <Button variant="ghost" className="mr-2" onClick={() => router.push('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold">Video Consultation</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Start a Video Call</CardTitle>
                <CardDescription>
                  Connect with your healthcare providers through secure video calls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center p-6 bg-primary/10 rounded-lg">
                  <Video className="h-16 w-16 text-primary" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Benefits of Video Consultation</h3>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Get expert advice without leaving your home</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Show your progress and get real-time feedback</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Discuss your treatment plan and ask questions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Secure, private, and HIPAA-compliant platform</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Before Your Call</h3>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Ensure you have a stable internet connection</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Find a quiet, well-lit space for your call</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Test your camera and microphone</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Have your questions and concerns ready</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Available Healthcare Providers</CardTitle>
                  <CardDescription>
                    Select a provider to start a video consultation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {doctors.map((doctor) => (
                    <Card key={doctor.id} className={`overflow-hidden transition-all hover:shadow-md ${doctor.available ? 'hover:border-primary/50' : 'opacity-70'}`}>
                      <div className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <img 
                              src={doctor.avatar} 
                              alt={doctor.name} 
                              className="w-16 h-16 rounded-full object-cover"
                            />
                            {doctor.available && (
                              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{doctor.name}</h3>
                                <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                              </div>
                              {doctor.available ? (
                                <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded-full flex items-center">
                                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1"></span>
                                  Available
                                </span>
                              ) : (
                                <span className="text-xs bg-muted px-2 py-1 rounded-full flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Unavailable
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center mt-2 text-sm">
                              <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                Next available: {doctor.nextAvailable}
                              </span>
                            </div>
                            
                            <div className="flex gap-2 mt-3">
                              <Button 
                                className="flex-1"
                                onClick={() => startCall(doctor)}
                                disabled={!doctor.available}
                              >
                                <Video className="h-4 w-4 mr-2" />
                                Video Call
                              </Button>
                              <Button 
                                variant="outline" 
                                className="flex-1"
                                onClick={() => {
                                  toast.info(`Calling ${doctor.name}`);
                                  setTimeout(() => {
                                    toast.error('Voice calls are not available in this demo');
                                  }, 2000);
                                }}
                              >
                                <Phone className="h-4 w-4 mr-2" />
                                Voice Call
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <CardDescription>
                    Your scheduled video consultations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center p-4 border rounded-lg">
                      <div className="mr-4">
                        <Calendar className="h-10 w-10 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Dr. Jane Smith</h3>
                        <p className="text-sm text-muted-foreground">Tomorrow, 2:00 PM</p>
                      </div>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          toast.info('This appointment is scheduled for tomorrow');
                        }}
                      >
                        Join Later
                      </Button>
                    </div>
                    
                    <div className="flex items-center p-4 border rounded-lg">
                      <div className="mr-4">
                        <Calendar className="h-10 w-10 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Dr. Sarah Williams</h3>
                        <p className="text-sm text-muted-foreground">Friday, 10:30 AM</p>
                      </div>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          toast.info('This appointment is scheduled for Friday');
                        }}
                      >
                        Join Later
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
