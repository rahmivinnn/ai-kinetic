"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Send, Paperclip, Video, Search, Image, File, Smile, X, Phone, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  avatar: string;
  isRead?: boolean;
}

interface Conversation {
  id: string;
  name: string;
  message: string;
  avatar: string;
  unread?: number;
  isOnline?: boolean;
  lastActive?: string;
  role?: string;
}

const initialMessages: Message[] = [
  {
    id: "1",
    sender: "Dr. Johnson",
    content:
      "Hi there, I've reviewed your latest exercise videos. Great progress on your knee exercises!",
    timestamp: "10:30 AM",
    avatar:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop",
    isRead: true
  },
  {
    id: "2",
    sender: "You",
    content:
      "Thanks! I've been working hard on them. I still feel some discomfort when doing the lateral raises.",
    timestamp: "10:35 AM",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop",
    isRead: true
  },
  {
    id: "3",
    sender: "Dr. Johnson",
    content:
      "Let's adjust your form slightly. Could you send a new video of you performing that exercise?",
    timestamp: "10:40 AM",
    avatar:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop",
    isRead: true
  },
];

const initialConversations: Conversation[] = [
  {
    id: "1",
    name: "Dr. Johnson",
    message: "Let's adjust your form slightly. Could you send a new video?",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop",
    unread: 0,
    isOnline: true,
    lastActive: "Just now",
    role: "Physiotherapist"
  },
  {
    id: "2",
    name: "AI Assistant",
    message: "I've analyzed your latest squat video. Would you like to see the results?",
    avatar: "https://images.unsplash.com/photo-1525373698358-041e3a460346?w=50&h=50&fit=crop",
    unread: 2,
    isOnline: true,
    lastActive: "Always online",
    role: "AI Analysis"
  },
  {
    id: "3",
    name: "Dr. Williams",
    message: "Let's discuss your progress during our next appointment",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=50&h=50&fit=crop",
    unread: 0,
    isOnline: false,
    lastActive: "2 hours ago",
    role: "Orthopedic Specialist"
  },
  {
    id: "4",
    name: "Support Team",
    message: "How can we help you with your recovery journey?",
    avatar: "/kinetic-logo.png",
    unread: 0,
    isOnline: true,
    lastActive: "Always online",
    role: "Customer Support"
  },
];

export default function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(initialConversations[0]);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Show welcome toast
    if (showWelcome) {
      setTimeout(() => {
        toast.info("Welcome to your messages", {
          description: "You have 2 unread messages from AI Assistant",
        });
        setShowWelcome(false);
      }, 1000);
    }
  }, [showWelcome]);

  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "You",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: (user && 'profilePicture' in user ? (user as any).profilePicture : undefined) || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop",
      isRead: true
    };

    setMessages([...messages, userMessage]);
    setNewMessage("");

    // Show typing indicator
    setIsTyping(true);

    // Simulate response after delay
    setTimeout(() => {
      const responseMessage: Message = {
        id: `response-${Date.now()}`,
        sender: activeConversation.name,
        content: getAutoResponse(activeConversation.id, newMessage),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: activeConversation.avatar,
        isRead: false
      };

      setMessages(prev => [...prev, responseMessage]);
      setIsTyping(false);

      // Update conversation with latest message
      setConversations(prev =>
        prev.map(conv =>
          conv.id === activeConversation.id
            ? { ...conv, message: responseMessage.content, lastActive: "Just now" }
            : conv
        )
      );

      // Show notification
      toast.success(`New message from ${activeConversation.name}`);
    }, 2000);
  };

  const getAutoResponse = (conversationId: string, message: string): string => {
    const lowerMessage = message.toLowerCase();

    if (conversationId === "1") { // Dr. Johnson
      if (lowerMessage.includes("video") || lowerMessage.includes("exercise")) {
        return "Great! I'll review your video as soon as you upload it. Make sure to follow the form guidelines we discussed.";
      } else if (lowerMessage.includes("pain") || lowerMessage.includes("hurt") || lowerMessage.includes("discomfort")) {
        return "I'm sorry to hear that. Can you describe the pain in more detail? Is it sharp or dull? When exactly does it occur during the exercise?";
      } else {
        return "Thank you for the update. Keep up with your exercises, and don't hesitate to reach out if you have any questions.";
      }
    } else if (conversationId === "2") { // AI Assistant
      return "I've analyzed your message and will provide personalized feedback based on your recovery progress. Would you like me to suggest some modifications to your exercise routine?";
    } else if (conversationId === "3") { // Dr. Williams
      return "Thanks for your message. I've made a note in your file and we'll discuss this further during our next appointment.";
    } else { // Support Team
      return "Thank you for contacting support. We're here to help with any questions about the platform. Is there anything specific you'd like assistance with?";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleConversationClick = (conversation: Conversation) => {
    setActiveConversation(conversation);

    // Mark messages as read
    if (conversation.unread && conversation.unread > 0) {
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversation.id
            ? { ...conv, unread: 0 }
            : conv
        )
      );

      // Generate conversation-specific messages
      if (conversation.id === "2") { // AI Assistant
        setMessages([
          {
            id: "ai-1",
            sender: "AI Assistant",
            content: "Hello! I've been analyzing your exercise videos and tracking your progress.",
            timestamp: "Yesterday",
            avatar: conversation.avatar,
            isRead: true
          },
          {
            id: "ai-2",
            sender: "You",
            content: "Hi! How's my progress looking?",
            timestamp: "Yesterday",
            avatar: user?.profilePicture || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop",
            isRead: true
          },
          {
            id: "ai-3",
            sender: "AI Assistant",
            content: "Your knee extension form has improved by 23% over the last two weeks. Your range of motion is now at 85% of the target.",
            timestamp: "Yesterday",
            avatar: conversation.avatar,
            isRead: true
          },
          {
            id: "ai-4",
            sender: "AI Assistant",
            content: "I've analyzed your latest squat video. Would you like to see the results?",
            timestamp: "10:15 AM",
            avatar: conversation.avatar,
            isRead: false
          },
          {
            id: "ai-5",
            sender: "AI Assistant",
            content: "I've also prepared some recommendations to improve your form based on the analysis.",
            timestamp: "10:16 AM",
            avatar: conversation.avatar,
            isRead: false
          }
        ]);
      } else if (conversation.id === "3") { // Dr. Williams
        setMessages([
          {
            id: "w-1",
            sender: "Dr. Williams",
            content: "Hello! I've reviewed your latest medical reports. Your recovery is progressing well.",
            timestamp: "Monday",
            avatar: conversation.avatar,
            isRead: true
          },
          {
            id: "w-2",
            sender: "You",
            content: "That's great news! When do you think I can return to my regular activities?",
            timestamp: "Monday",
            avatar: user?.profilePicture || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop",
            isRead: true
          },
          {
            id: "w-3",
            sender: "Dr. Williams",
            content: "Let's discuss your progress during our next appointment. I think we can start planning for a gradual return to activities.",
            timestamp: "Monday",
            avatar: conversation.avatar,
            isRead: true
          }
        ]);
      } else if (conversation.id === "4") { // Support Team
        setMessages([
          {
            id: "s-1",
            sender: "Support Team",
            content: "Welcome to Kinetic AI! How can we help you with your recovery journey?",
            timestamp: "Last week",
            avatar: conversation.avatar,
            isRead: true
          },
          {
            id: "s-2",
            sender: "You",
            content: "Hi! I'm having trouble uploading my exercise videos. The upload seems to get stuck at 80%.",
            timestamp: "Last week",
            avatar: user?.profilePicture || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop",
            isRead: true
          },
          {
            id: "s-3",
            sender: "Support Team",
            content: "I'm sorry to hear that. Let's troubleshoot this issue. What device and browser are you using?",
            timestamp: "Last week",
            avatar: conversation.avatar,
            isRead: true
          },
          {
            id: "s-4",
            sender: "You",
            content: "I'm using Chrome on my iPhone.",
            timestamp: "Last week",
            avatar: user?.profilePicture || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop",
            isRead: true
          },
          {
            id: "s-5",
            sender: "Support Team",
            content: "Thank you. There's a known issue with video uploads on mobile browsers. Could you try using our mobile app instead? It has better handling for video uploads.",
            timestamp: "Last week",
            avatar: conversation.avatar,
            isRead: true
          },
          {
            id: "s-6",
            sender: "You",
            content: "I'll try that. Thanks!",
            timestamp: "Last week",
            avatar: user?.profilePicture || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop",
            isRead: true
          },
          {
            id: "s-7",
            sender: "Support Team",
            content: "How can we help you today?",
            timestamp: "Last week",
            avatar: conversation.avatar,
            isRead: true
          }
        ]);
      } else {
        // Default to initial messages for Dr. Johnson
        setMessages(initialMessages);
      }
    }
  };

  const filteredConversations = conversations.filter(
    conversation => conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col h-[calc(100vh-12rem)] overflow-hidden rounded-lg border shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 h-full">
          {/* Conversations List */}
          <div className="border-r">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Messages</h2>
                <Button
                  size="sm"
                  onClick={() => {
                    toast.success("New conversation started");
                    // In a real app, this would open a new conversation dialog
                  }}
                >
                  New Message
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="divide-y">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
                      activeConversation?.id === conversation.id ? 'bg-muted/50' : ''
                    }`}
                    onClick={() => handleConversationClick(conversation)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conversation.avatar} alt={conversation.name} />
                          <AvatarFallback>{getInitials(conversation.name)}</AvatarFallback>
                        </Avatar>
                        {conversation.isOnline && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="truncate">
                            <h3 className="font-medium">{conversation.name}</h3>
                            <p className="text-xs text-muted-foreground">{conversation.role}</p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-xs text-muted-foreground">
                              {conversation.lastActive}
                            </span>
                            {conversation.unread && conversation.unread > 0 && (
                              <Badge className="mt-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                                {conversation.unread}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm truncate text-muted-foreground mt-1">
                          {conversation.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="col-span-2 flex flex-col h-full">
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={activeConversation.avatar} alt={activeConversation.name} />
                      <AvatarFallback>{getInitials(activeConversation.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{activeConversation.name}</h3>
                      <p className="text-xs text-muted-foreground flex items-center">
                        {activeConversation.isOnline ? (
                          <>
                            <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                            Online
                          </>
                        ) : (
                          <>Last active: {activeConversation.lastActive}</>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toast.info("Starting audio call...")}
                    >
                      <Phone className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toast.info("Starting video call...")}
                    >
                      <Video className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "You" ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`flex gap-2 max-w-[80%] ${message.sender === "You" ? "flex-row-reverse" : ""}`}>
                          {message.sender !== "You" && (
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarImage src={message.avatar} alt={message.sender} />
                              <AvatarFallback>{getInitials(message.sender)}</AvatarFallback>
                            </Avatar>
                          )}
                          <div>
                            <div
                              className={`rounded-lg p-3 ${
                                message.sender === "You"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                            </div>
                            <div className={`flex items-center mt-1 text-xs text-muted-foreground ${message.sender === "You" ? "justify-end" : ""}`}>
                              <span>{message.timestamp}</span>
                              {message.sender === "You" && (
                                <span className="ml-1">
                                  {message.isRead ? '• Read' : '• Sent'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="flex gap-2 max-w-[80%]">
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage src={activeConversation.avatar} alt={activeConversation.name} />
                            <AvatarFallback>{getInitials(activeConversation.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="rounded-lg p-3 bg-muted">
                              <div className="flex space-x-1">
                                <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"></div>
                                <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex items-end gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                          <Paperclip className="h-5 w-5" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56" align="start" alignOffset={20}>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            className="flex flex-col items-center h-auto py-2"
                            onClick={() => toast.info("Image upload coming soon")}
                          >
                            <Image className="h-5 w-5 mb-1" />
                            <span className="text-xs">Image</span>
                          </Button>
                          <Button
                            variant="outline"
                            className="flex flex-col items-center h-auto py-2"
                            onClick={() => toast.info("Document upload coming soon")}
                          >
                            <File className="h-5 w-5 mb-1" />
                            <span className="text-xs">Document</span>
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Input
                      placeholder="Type your message..."
                      className="flex-1"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                          <Smile className="h-5 w-5" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56" align="end" alignOffset={20}>
                        <div className="grid grid-cols-5 gap-2">
                          {['😊', '👍', '❤️', '😂', '🙏', '😍', '🔥', '👏', '🎉', '🤔'].map(emoji => (
                            <Button
                              key={emoji}
                              variant="ghost"
                              className="h-10 w-10 p-0 text-lg"
                              onClick={() => setNewMessage(prev => prev + emoji)}
                            >
                              {emoji}
                            </Button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Button
                      size="icon"
                      className="h-10 w-10 rounded-full"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <Button
                      variant="default"
                      onClick={() => toast.info("Starting video call with " + activeConversation.name)}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Video Call
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        toast.success("Redirecting to video upload");
                        // In a real app, this would navigate to the video upload page
                      }}
                    >
                      Upload Exercise Video
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No conversation selected</h3>
                <p className="text-muted-foreground max-w-md">
                  Select a conversation from the list to start messaging
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
