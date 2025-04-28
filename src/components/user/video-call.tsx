'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  Phone, 
  MessageSquare, 
  Share2, 
  MoreVertical,
  Volume2,
  Volume1,
  VolumeX,
  Maximize2,
  Minimize2,
  X
} from 'lucide-react';

interface VideoCallProps {
  doctorId?: string;
  doctorName?: string;
  doctorAvatar?: string;
  doctorSpecialty?: string;
  onClose?: () => void;
  isFullScreen?: boolean;
}

export function VideoCall({ 
  doctorId = '1', 
  doctorName = 'Dr. Jane Smith', 
  doctorAvatar = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=250&h=250&fit=crop', 
  doctorSpecialty = 'Physiotherapist',
  onClose,
  isFullScreen = false
}: VideoCallProps) {
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [volume, setVolume] = useState(80);
  const [callDuration, setCallDuration] = useState(0);
  const [messages, setMessages] = useState<{text: string, sender: 'user' | 'doctor', timestamp: Date}[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [isFullScreenMode, setIsFullScreenMode] = useState(isFullScreen);
  const [showControls, setShowControls] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const doctorVideoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate connecting and then connected after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setCallStatus('connected');
      toast.success(`Connected with ${doctorName}`);
    }, 3000);

    return () => clearTimeout(timer);
  }, [doctorName]);

  // Start call timer once connected
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [callStatus]);

  // Simulate getting user's camera
  useEffect(() => {
    const getUserMedia = async () => {
      try {
        // In a real app, this would be actual camera access
        // For demo, we'll use a placeholder video
        if (userVideoRef.current) {
          userVideoRef.current.src = 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-a-video-call-with-a-colleague-42914-large.mp4';
          userVideoRef.current.muted = true;
          userVideoRef.current.play();
        }
        
        // Simulate doctor video with delay
        setTimeout(() => {
          if (doctorVideoRef.current) {
            doctorVideoRef.current.src = 'https://assets.mixkit.co/videos/preview/mixkit-doctor-talking-to-the-camera-in-a-medical-office-42915-large.mp4';
            doctorVideoRef.current.volume = volume / 100;
            doctorVideoRef.current.play();
          }
        }, 3000);
      } catch (error) {
        console.error('Error accessing camera:', error);
        toast.error('Could not access camera');
      }
    };

    getUserMedia();
  }, []);

  // Update doctor video volume when volume changes
  useEffect(() => {
    if (doctorVideoRef.current) {
      doctorVideoRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Auto-hide controls after inactivity
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      controlsTimeoutRef.current = setTimeout(() => {
        if (isFullScreenMode) {
          setShowControls(false);
        }
      }, 3000);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isFullScreenMode]);

  // Simulate doctor sending messages
  useEffect(() => {
    if (callStatus === 'connected') {
      const messages = [
        "Hello! How are you feeling today?",
        "I've reviewed your latest exercise videos. Your form is improving!",
        "Let's discuss your progress with the knee rehabilitation exercises.",
        "Do you have any pain or discomfort when performing the exercises?",
        "I'd like to show you a new exercise technique. Can you see my demonstration clearly?"
      ];
      
      let index = 0;
      
      const interval = setInterval(() => {
        if (index < messages.length) {
          addMessage(messages[index], 'doctor');
          index++;
        } else {
          clearInterval(interval);
        }
      }, 15000); // Every 15 seconds
      
      return () => clearInterval(interval);
    }
  }, [callStatus]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast.info(isMuted ? 'Microphone unmuted' : 'Microphone muted');
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    toast.info(isVideoOn ? 'Camera turned off' : 'Camera turned on');
  };

  const endCall = () => {
    setCallStatus('ended');
    toast.info(`Call with ${doctorName} ended`);
    
    // In a real app, this would disconnect the call
    setTimeout(() => {
      if (onClose) onClose();
    }, 2000);
  };

  const toggleFullScreen = () => {
    setIsFullScreenMode(!isFullScreenMode);
  };

  const toggleScreenShare = () => {
    setIsSharing(!isSharing);
    toast.info(isSharing ? 'Screen sharing stopped' : 'Screen sharing started');
    
    if (!isSharing) {
      // In a real app, this would actually share the screen
      toast.success('Now sharing your screen with the doctor');
    }
  };

  const addMessage = (text: string, sender: 'user' | 'doctor') => {
    setMessages(prev => [...prev, { text, sender, timestamp: new Date() }]);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      addMessage(newMessage.trim(), 'user');
      setNewMessage('');
      
      // Simulate doctor typing and responding
      setTimeout(() => {
        toast.info(`${doctorName} is typing...`);
        
        setTimeout(() => {
          const responses = [
            "I understand. Let me know if you have any questions about your exercises.",
            "That's good to hear! Keep up the great work.",
            "I'll make a note of that in your treatment plan.",
            "Could you elaborate a bit more on that?",
            "Let me show you a better technique for that exercise."
          ];
          
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];
          addMessage(randomResponse, 'doctor');
        }, 3000);
      }, 1000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX className="h-5 w-5" />;
    if (volume < 50) return <Volume1 className="h-5 w-5" />;
    return <Volume2 className="h-5 w-5" />;
  };

  if (callStatus === 'ended') {
    return (
      <Card className={`w-full ${isFullScreenMode ? 'fixed inset-0 z-50' : ''}`}>
        <CardHeader>
          <CardTitle>Call Ended</CardTitle>
          <CardDescription>Your call with {doctorName} has ended</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
            <Phone className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">Call Duration: {formatTime(callDuration)}</h3>
          <p className="text-muted-foreground mb-6">Thank you for using our telehealth service</p>
          <Button onClick={onClose}>Return to Dashboard</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`${isFullScreenMode ? 'fixed inset-0 z-50 bg-background' : 'w-full'}`}>
      <div className="relative h-full flex flex-col">
        {/* Main video area */}
        <div className="relative flex-grow overflow-hidden bg-black">
          {/* Doctor's video (main) */}
          <video
            ref={doctorVideoRef}
            className={`w-full h-full object-cover ${callStatus !== 'connected' ? 'opacity-0' : ''}`}
            playsInline
            autoPlay
            loop
          />
          
          {/* User's video (picture-in-picture) */}
          <div className="absolute bottom-4 right-4 w-1/4 max-w-[200px] aspect-video rounded-lg overflow-hidden border-2 border-background shadow-lg">
            <video
              ref={userVideoRef}
              className={`w-full h-full object-cover ${!isVideoOn ? 'hidden' : ''}`}
              playsInline
              autoPlay
              loop
              muted
            />
            {!isVideoOn && (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <VideoOff className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>
          
          {/* Connection status overlay */}
          {callStatus === 'connecting' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-pulse">
                <Phone className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Connecting to {doctorName}</h3>
              <p className="text-muted-foreground">Please wait while we establish a secure connection</p>
              <div className="mt-6 flex space-x-1">
                <div className="h-2 w-2 rounded-full bg-primary animate-bounce"></div>
                <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          
          {/* Doctor info overlay */}
          {showControls && (
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent">
              <div className="flex items-center">
                <div className="flex items-center">
                  <div className="relative">
                    <img 
                      src={doctorAvatar} 
                      alt={doctorName} 
                      className="w-10 h-10 rounded-full object-cover border-2 border-background"
                    />
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-white">{doctorName}</h3>
                    <p className="text-xs text-white/70">{doctorSpecialty}</p>
                  </div>
                </div>
                <div className="ml-auto flex items-center">
                  <Badge variant="outline" className="bg-black/30 text-white border-white/20">
                    {formatTime(callDuration)}
                  </Badge>
                  {isFullScreenMode && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-white hover:bg-white/10 ml-2"
                      onClick={() => {
                        if (onClose) onClose();
                      }}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Call controls */}
          {showControls && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={`rounded-full h-12 w-12 ${isMuted ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30 hover:text-red-500' : 'bg-white/10 text-white hover:bg-white/20'}`}
                  onClick={toggleMute}
                >
                  {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={`rounded-full h-12 w-12 ${!isVideoOn ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30 hover:text-red-500' : 'bg-white/10 text-white hover:bg-white/20'}`}
                  onClick={toggleVideo}
                >
                  {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </Button>
                
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="rounded-full h-14 w-14"
                  onClick={endCall}
                >
                  <Phone className="h-6 w-6 rotate-135" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={`rounded-full h-12 w-12 ${showChat ? 'bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary' : 'bg-white/10 text-white hover:bg-white/20'}`}
                  onClick={() => setShowChat(!showChat)}
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={`rounded-full h-12 w-12 ${isSharing ? 'bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary' : 'bg-white/10 text-white hover:bg-white/20'}`}
                  onClick={toggleScreenShare}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full h-12 w-12 bg-white/10 text-white hover:bg-white/20"
                  onClick={toggleFullScreen}
                >
                  {isFullScreenMode ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                </Button>
              </div>
              
              {/* Volume control */}
              <div className="mt-4 flex items-center gap-2 max-w-xs mx-auto">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-white/10"
                  onClick={() => setVolume(0)}
                >
                  {getVolumeIcon()}
                </Button>
                <Slider
                  value={[volume]}
                  max={100}
                  step={1}
                  className="flex-1"
                  onValueChange={(value) => setVolume(value[0])}
                />
                <span className="text-xs text-white min-w-[30px]">{volume}%</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Chat sidebar */}
        {showChat && (
          <div className="absolute top-0 right-0 bottom-0 w-80 bg-card border-l shadow-lg flex flex-col">
            <div className="p-3 border-b flex justify-between items-center">
              <h3 className="font-medium">Chat with {doctorName}</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowChat(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mb-2" />
                  <p>No messages yet</p>
                  <p className="text-xs">Send a message to start the conversation</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div 
                    key={index}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-3 border-t">
              <div className="flex gap-2">
                <Input 
                  placeholder="Type a message..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button 
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
