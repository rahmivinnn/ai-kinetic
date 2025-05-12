'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageSquare, 
  Search, 
  Send, 
  Paperclip, 
  MoreVertical, 
  Phone, 
  Video, 
  User, 
  Users, 
  Star, 
  Clock, 
  CheckCheck, 
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

// Sample conversation data
const sampleConversations = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    avatar: '/avatars/sarah.jpg',
    lastMessage: 'Your latest analysis looks great! I noticed significant improvement in your form.',
    timestamp: '10:30 AM',
    unread: 2,
    online: true,
    role: 'Physical Therapist'
  },
  {
    id: 2,
    name: 'Coach Michael',
    avatar: '/avatars/michael.jpg',
    lastMessage: 'Let\'s schedule a follow-up session to review your progress.',
    timestamp: 'Yesterday',
    unread: 0,
    online: false,
    role: 'Fitness Coach'
  },
  {
    id: 3,
    name: 'Team Discussion',
    avatar: '/avatars/team.jpg',
    lastMessage: 'Emily: I\'ll share my analysis results with everyone tomorrow.',
    timestamp: 'Yesterday',
    unread: 0,
    online: true,
    isGroup: true,
    members: 5
  },
  {
    id: 4,
    name: 'Dr. Robert Chen',
    avatar: '/avatars/robert.jpg',
    lastMessage: 'The new exercise routine should help with your shoulder mobility.',
    timestamp: 'Monday',
    unread: 0,
    online: false,
    role: 'Orthopedic Specialist'
  },
  {
    id: 5,
    name: 'Emma Wilson',
    avatar: '/avatars/emma.jpg',
    lastMessage: 'Thanks for sharing your progress video!',
    timestamp: 'Monday',
    unread: 0,
    online: true,
    role: 'Yoga Instructor'
  }
];

// Sample messages for a conversation
const sampleMessages = [
  {
    id: 1,
    senderId: 1,
    text: 'Hi there! I\'ve reviewed your latest squat form analysis.',
    timestamp: '10:15 AM',
    read: true
  },
  {
    id: 2,
    senderId: 1,
    text: 'I noticed significant improvement in your hip alignment compared to last month.',
    timestamp: '10:16 AM',
    read: true
  },
  {
    id: 3,
    senderId: 'user',
    text: 'That\'s great to hear! I\'ve been working on it daily.',
    timestamp: '10:20 AM',
    read: true
  },
  {
    id: 4,
    senderId: 1,
    text: 'Your latest analysis looks great! I noticed significant improvement in your form. Keep up the good work and remember to maintain that neutral spine position we discussed.',
    timestamp: '10:30 AM',
    read: false
  },
  {
    id: 5,
    senderId: 1,
    text: 'Would you like to schedule another session next week to check your progress?',
    timestamp: '10:31 AM',
    read: false
  }
];

export default function MessagesPage() {
  const [conversations, setConversations] = useState(sampleConversations);
  const [activeConversation, setActiveConversation] = useState<number | null>(1);
  const [messages, setMessages] = useState(sampleMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter conversations based on search query and active tab
  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'unread' && conversation.unread > 0) ||
      (activeTab === 'groups' && conversation.isGroup);
    
    return matchesSearch && matchesTab;
  });
  
  // Get the active conversation data
  const currentConversation = conversations.find(c => c.id === activeConversation);
  
  // Send a new message
  const sendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return;
    
    const newMsg = {
      id: messages.length + 1,
      senderId: 'user',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    
    // Simulate a reply after a delay
    setTimeout(() => {
      const replyMsg = {
        id: messages.length + 2,
        senderId: activeConversation,
        text: 'Thanks for your message! I\'ll get back to you soon.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false
      };
      
      setMessages(prev => [...prev, replyMsg]);
      toast.success('New message received');
    }, 3000);
  };
  
  // Mark conversation as read when selected
  const selectConversation = (id: number) => {
    setActiveConversation(id);
    
    // Mark messages as read
    setMessages(messages.map(msg => ({
      ...msg,
      read: true
    })));
    
    // Update unread count
    setConversations(conversations.map(conv => 
      conv.id === id ? { ...conv, unread: 0 } : conv
    ));
  };
  
  // Start a new conversation
  const startNewConversation = () => {
    toast.info('New conversation feature would be implemented here');
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
            <h1 className="text-3xl font-bold">Messages</h1>
            <p className="text-muted-foreground mt-1">Communication with your trainers and team</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={startNewConversation}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Conversation
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="md:col-span-1">
            <Card className="h-[calc(100vh-12rem)]">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Conversations</CardTitle>
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                    {conversations.reduce((sum, conv) => sum + conv.unread, 0)}
                  </Badge>
                </div>
                <div className="relative mt-2">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search messages..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mt-2">
                  <TabsList className="grid grid-cols-3 bg-gray-100">
                    <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                    <TabsTrigger value="unread" className="text-xs">Unread</TabsTrigger>
                    <TabsTrigger value="groups" className="text-xs">Groups</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent className="p-0 overflow-auto h-[calc(100%-8rem)]">
                <div className="divide-y">
                  {filteredConversations.length > 0 ? (
                    filteredConversations.map(conversation => (
                      <div 
                        key={conversation.id}
                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                          activeConversation === conversation.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => selectConversation(conversation.id)}
                      >
                        <div className="flex items-start">
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={conversation.avatar} alt={conversation.name} />
                              <AvatarFallback>
                                {conversation.isGroup ? (
                                  <Users className="h-5 w-5" />
                                ) : (
                                  conversation.name.split(' ').map(n => n[0]).join('')
                                )}
                              </AvatarFallback>
                            </Avatar>
                            {conversation.online && (
                              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                            )}
                          </div>
                          <div className="ml-3 flex-1 overflow-hidden">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium truncate">{conversation.name}</h4>
                              <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{conversation.timestamp}</span>
                            </div>
                            <div className="flex justify-between items-start mt-1">
                              <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                              {conversation.unread > 0 && (
                                <Badge className="ml-2 bg-blue-600">{conversation.unread}</Badge>
                              )}
                            </div>
                            <div className="mt-1">
                              {conversation.isGroup ? (
                                <div className="flex items-center text-xs text-gray-500">
                                  <Users className="h-3 w-3 mr-1" />
                                  {conversation.members} members
                                </div>
                              ) : (
                                <div className="text-xs text-gray-500 truncate">
                                  {conversation.role}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No conversations found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Chat Area */}
          <div className="md:col-span-2">
            <Card className="h-[calc(100vh-12rem)]">
              {activeConversation && currentConversation ? (
                <>
                  <CardHeader className="p-4 border-b">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={currentConversation.avatar} alt={currentConversation.name} />
                          <AvatarFallback>
                            {currentConversation.isGroup ? (
                              <Users className="h-5 w-5" />
                            ) : (
                              currentConversation.name.split(' ').map(n => n[0]).join('')
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-3">
                          <h3 className="font-medium">{currentConversation.name}</h3>
                          <div className="flex items-center text-xs text-gray-500">
                            {currentConversation.online ? (
                              <span className="flex items-center text-green-600">
                                <span className="h-2 w-2 rounded-full bg-green-600 mr-1"></span>
                                Online
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                Last seen recently
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Video className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 flex flex-col h-[calc(100%-8rem)]">
                    <div className="flex-1 overflow-auto p-4 space-y-4">
                      {messages.map(message => (
                        <div 
                          key={message.id}
                          className={`flex ${message.senderId === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          {message.senderId !== 'user' && (
                            <Avatar className="h-8 w-8 mt-1 mr-2">
                              <AvatarImage src={currentConversation.avatar} alt={currentConversation.name} />
                              <AvatarFallback>
                                {currentConversation.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div 
                            className={`max-w-[70%] rounded-lg p-3 ${
                              message.senderId === 'user' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            <p className="text-sm">{message.text}</p>
                            <div 
                              className={`text-xs mt-1 flex justify-end items-center ${
                                message.senderId === 'user' ? 'text-blue-100' : 'text-gray-500'
                              }`}
                            >
                              {message.timestamp}
                              {message.senderId === 'user' && (
                                <CheckCheck className={`h-3 w-3 ml-1 ${message.read ? 'text-blue-300' : 'text-blue-200'}`} />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 border-t">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon" className="h-10 w-10">
                          <Paperclip className="h-5 w-5" />
                        </Button>
                        <Input
                          placeholder="Type a message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                          className="flex-1"
                        />
                        <Button 
                          className="bg-blue-600 hover:bg-blue-700 h-10 w-10 p-0"
                          onClick={sendMessage}
                          disabled={!newMessage.trim()}
                        >
                          <Send className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <MessageSquare className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
                    <p className="text-gray-500 mb-6">Select a conversation from the list or start a new one</p>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={startNewConversation}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Start New Conversation
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
