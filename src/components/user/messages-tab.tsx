'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Search, 
  Send, 
  Paperclip, 
  Video, 
  Phone, 
  MoreVertical,
  Clock,
  CheckCheck,
  Image as ImageIcon,
  File,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

// Mock data for messages
const mockContacts = [
  {
    id: 'contact-001',
    name: 'Dr. Sarah Johnson',
    role: 'Physiotherapist',
    avatar: '/images/doctor-1.jpg',
    lastMessage: 'How is your shoulder feeling today?',
    time: '10:30 AM',
    unread: 2,
    online: true
  },
  {
    id: 'contact-002',
    name: 'Dr. Michael Chen',
    role: 'Orthopedic Specialist',
    avatar: '/images/doctor-2.jpg',
    lastMessage: 'Your latest X-ray results look promising.',
    time: 'Yesterday',
    unread: 0,
    online: false
  },
  {
    id: 'contact-003',
    name: 'Emma Wilson',
    role: 'Physical Therapist',
    avatar: '/images/therapist-1.jpg',
    lastMessage: 'Don't forget to do your exercises today!',
    time: 'Yesterday',
    unread: 1,
    online: true
  },
  {
    id: 'contact-004',
    name: 'Dr. Robert Davis',
    role: 'Rehabilitation Specialist',
    avatar: '/images/doctor-3.jpg',
    lastMessage: 'I've reviewed your progress. Let's discuss next steps.',
    time: 'Monday',
    unread: 0,
    online: false
  }
];

const mockMessages = [
  {
    id: 'msg-001',
    contactId: 'contact-001',
    sender: 'contact',
    content: 'Good morning! How is your shoulder feeling today?',
    time: '10:30 AM',
    read: true
  },
  {
    id: 'msg-002',
    contactId: 'contact-001',
    sender: 'user',
    content: 'Morning Dr. Johnson! It\'s feeling better than yesterday. I did the exercises you recommended.',
    time: '10:32 AM',
    read: true
  },
  {
    id: 'msg-003',
    contactId: 'contact-001',
    sender: 'contact',
    content: 'That\'s great to hear! Any pain during the external rotation exercise?',
    time: '10:35 AM',
    read: true
  },
  {
    id: 'msg-004',
    contactId: 'contact-001',
    sender: 'user',
    content: 'A little bit, but not as much as before. I can now complete the full set without stopping.',
    time: '10:38 AM',
    read: true
  },
  {
    id: 'msg-005',
    contactId: 'contact-001',
    sender: 'contact',
    content: 'Excellent progress! I\'ve reviewed your latest exercise video submission. Your form has improved significantly.',
    time: '10:40 AM',
    read: false
  },
  {
    id: 'msg-006',
    contactId: 'contact-001',
    sender: 'contact',
    content: 'I\'ve attached your updated exercise plan based on your progress. Let me know if you have any questions.',
    time: '10:42 AM',
    read: false,
    attachment: {
      type: 'file',
      name: 'Updated_Exercise_Plan.pdf',
      size: '1.2 MB'
    }
  }
];

export function MessagesTab() {
  const [contacts, setContacts] = useState(mockContacts);
  const [messages, setMessages] = useState(mockMessages);
  const [selectedContact, setSelectedContact] = useState(mockContacts[0]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const filteredContacts = contacts.filter(contact => {
    if (activeTab === 'unread' && contact.unread === 0) return false;
    return contact.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const contactMessages = messages.filter(message => message.contactId === selectedContact?.id);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      contactId: selectedContact.id,
      sender: 'user',
      content: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');

    toast.success("Message sent", {
      description: `Your message to ${selectedContact.name} has been sent`,
      duration: 3000
    });
  };

  const handleAttachFile = () => {
    toast.info("File attachment", {
      description: "File attachment feature is coming soon",
      duration: 3000
    });
  };

  const handleVideoCall = () => {
    toast.info("Starting video call", {
      description: `Initiating video call with ${selectedContact.name}`,
      duration: 3000
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[600px]">
      {/* Contacts List */}
      <Card className="md:w-1/3 flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Messages</CardTitle>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList className="h-8">
                <TabsTrigger value="all" className="text-xs px-2">All</TabsTrigger>
                <TabsTrigger value="unread" className="text-xs px-2">Unread</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search contacts..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-0">
          {isLoading ? (
            <div className="space-y-4 p-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded animate-pulse w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredContacts.length > 0 ? (
            <div className="divide-y">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                    selectedContact?.id === contact.id ? 'bg-muted/50' : ''
                  }`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {contact.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium truncate">{contact.name}</h4>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{contact.time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                      {contact.unread > 0 && (
                        <Badge className="ml-2 bg-blue-500 hover:bg-blue-600">{contact.unread}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center p-4">
              <div className="bg-muted/30 p-4 rounded-full mb-4">
                <MessageSquare className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No contacts found</h3>
              <p className="text-muted-foreground mt-1">
                {searchTerm 
                  ? `No results for "${searchTerm}". Try a different search term.` 
                  : "You don't have any messages yet."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            <CardHeader className="pb-2 border-b">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedContact.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center">
                      {selectedContact.role}
                      {selectedContact.online && (
                        <span className="ml-2 flex items-center text-green-500">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1"></span>
                          Online
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={handleVideoCall}>
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href="/appointments">
                      <Calendar className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {contactMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p>{message.content}</p>
                    {message.attachment && (
                      <div className={`mt-2 flex items-center gap-2 p-2 rounded ${
                        message.sender === 'user' ? 'bg-primary/80' : 'bg-background'
                      }`}>
                        <File className="h-4 w-4" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{message.attachment.name}</p>
                          <p className="text-xs opacity-70">{message.attachment.size}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          Download
                        </Button>
                      </div>
                    )}
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-xs opacity-70">{message.time}</span>
                      {message.sender === 'user' && (
                        <CheckCheck className={`h-3 w-3 ${message.read ? 'text-blue-500' : 'opacity-70'}`} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={handleAttachFile}>
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="bg-muted/30 p-6 rounded-full mb-4">
              <MessageSquare className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium">No conversation selected</h3>
            <p className="text-muted-foreground mt-2 mb-6">
              Select a contact from the list to start chatting
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
