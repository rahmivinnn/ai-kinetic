'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  MessageSquare, 
  Calendar, 
  FileText, 
  Activity, 
  Star, 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  Phone
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

// Sample client data
const sampleClients = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    avatar: '/avatars/john.jpg',
    status: 'active',
    lastSession: '2023-07-15',
    nextSession: '2023-07-22',
    progress: 'Improving',
    notes: 'Working on shoulder mobility and squat form.',
    tags: ['athlete', 'rehabilitation']
  },
  {
    id: 2,
    name: 'Emily Johnson',
    email: 'emily.johnson@example.com',
    phone: '(555) 234-5678',
    avatar: '/avatars/emily.jpg',
    status: 'active',
    lastSession: '2023-07-14',
    nextSession: '2023-07-21',
    progress: 'Excellent',
    notes: 'Making great progress with running gait correction.',
    tags: ['runner', 'performance']
  },
  {
    id: 3,
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    phone: '(555) 345-6789',
    avatar: '/avatars/michael.jpg',
    status: 'inactive',
    lastSession: '2023-06-30',
    nextSession: null,
    progress: 'On hold',
    notes: 'Taking a break due to travel. Will resume in August.',
    tags: ['yoga', 'flexibility']
  },
  {
    id: 4,
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    phone: '(555) 456-7890',
    avatar: '/avatars/sarah.jpg',
    status: 'active',
    lastSession: '2023-07-12',
    nextSession: '2023-07-19',
    progress: 'Steady',
    notes: 'Working on posture correction and core strength.',
    tags: ['posture', 'office worker']
  },
  {
    id: 5,
    name: 'David Rodriguez',
    email: 'david.rodriguez@example.com',
    phone: '(555) 567-8901',
    avatar: '/avatars/david.jpg',
    status: 'active',
    lastSession: '2023-07-10',
    nextSession: '2023-07-24',
    progress: 'Improving',
    notes: 'Recovering from knee surgery, focusing on rehabilitation exercises.',
    tags: ['rehabilitation', 'post-surgery']
  },
  {
    id: 6,
    name: 'Lisa Thompson',
    email: 'lisa.thompson@example.com',
    phone: '(555) 678-9012',
    avatar: '/avatars/lisa.jpg',
    status: 'pending',
    lastSession: null,
    nextSession: '2023-07-20',
    progress: 'New client',
    notes: 'Initial assessment scheduled. Goals include weight loss and strength training.',
    tags: ['weight loss', 'beginner']
  }
];

export default function ClientsPage() {
  const [clients, setClients] = useState(sampleClients);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [expandedClient, setExpandedClient] = useState<number | null>(null);
  
  // Filter clients based on search query and active tab
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'active' && client.status === 'active') ||
      (activeTab === 'inactive' && client.status === 'inactive') ||
      (activeTab === 'pending' && client.status === 'pending');
    
    return matchesSearch && matchesTab;
  });
  
  // Toggle client details expansion
  const toggleClientExpansion = (id: number) => {
    setExpandedClient(expandedClient === id ? null : id);
  };
  
  // Add new client
  const addNewClient = () => {
    toast.info('New client form would open here');
  };
  
  // Contact client
  const contactClient = (id: number, method: 'email' | 'message' | 'call') => {
    const client = clients.find(c => c.id === id);
    if (!client) return;
    
    switch (method) {
      case 'email':
        toast.info(`Sending email to ${client.name}`);
        break;
      case 'message':
        toast.info(`Opening chat with ${client.name}`);
        break;
      case 'call':
        toast.info(`Calling ${client.name}`);
        break;
    }
  };
  
  // Schedule session
  const scheduleSession = (id: number) => {
    const client = clients.find(c => c.id === id);
    if (!client) return;
    
    toast.info(`Opening scheduler for ${client.name}`);
  };
  
  // View client reports
  const viewReports = (id: number) => {
    const client = clients.find(c => c.id === id);
    if (!client) return;
    
    toast.info(`Opening reports for ${client.name}`);
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
            <h1 className="text-3xl font-bold">Clients</h1>
            <p className="text-muted-foreground mt-1">Manage your client relationships</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={addNewClient}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Client
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList className="bg-gray-100">
              <TabsTrigger value="all" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                All Clients
              </TabsTrigger>
              <TabsTrigger value="active" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Active
              </TabsTrigger>
              <TabsTrigger value="inactive" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Inactive
              </TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Pending
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="mt-4 md:mt-0 flex w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search clients..."
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
        
        {filteredClients.length > 0 ? (
          <div className="space-y-4">
            {filteredClients.map(client => (
              <Card key={client.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div 
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleClientExpansion(client.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={client.avatar} alt={client.name} />
                          <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="ml-3">
                          <h3 className="font-medium">{client.name}</h3>
                          <p className="text-sm text-gray-500">{client.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Badge 
                          className={`mr-4 ${
                            client.status === 'active' 
                              ? 'bg-green-100 text-green-800 border-green-200' 
                              : client.status === 'inactive'
                                ? 'bg-gray-100 text-gray-800 border-gray-200'
                                : 'bg-amber-100 text-amber-800 border-amber-200'
                          }`}
                        >
                          {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                        </Badge>
                        
                        <div className="flex items-center space-x-2 mr-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              contactClient(client.id, 'message');
                            }}
                          >
                            <MessageSquare className="h-4 w-4 text-gray-500 hover:text-blue-600" />
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              scheduleSession(client.id);
                            }}
                          >
                            <Calendar className="h-4 w-4 text-gray-500 hover:text-blue-600" />
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              viewReports(client.id);
                            }}
                          >
                            <FileText className="h-4 w-4 text-gray-500 hover:text-blue-600" />
                          </Button>
                        </div>
                        
                        {expandedClient === client.id ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {expandedClient === client.id && (
                    <div className="p-4 pt-0 border-t mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Contact Information</h4>
                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <Mail className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{client.email}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Phone className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{client.phone}</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {client.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="bg-gray-50">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">Session Information</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Last Session:</span>
                              <span>{client.lastSession || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Next Session:</span>
                              <span>{client.nextSession || 'Not scheduled'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Progress:</span>
                              <span className="font-medium">{client.progress}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">Notes</h4>
                          <p className="text-sm text-gray-700">{client.notes}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-4 space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => contactClient(client.id, 'email')}
                        >
                          <Mail className="h-4 w-4 mr-1" />
                          Email
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => contactClient(client.id, 'call')}
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                        <Button 
                          className="bg-blue-600 hover:bg-blue-700"
                          size="sm"
                          onClick={() => scheduleSession(client.id)}
                        >
                          <Calendar className="h-4 w-4 mr-1" />
                          Schedule Session
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No clients found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery 
                ? `No clients matching "${searchQuery}"`
                : "You haven't added any clients yet"}
            </p>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={addNewClient}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Client
            </Button>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
