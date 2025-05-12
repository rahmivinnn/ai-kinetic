'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, MessageSquare, Bell, Calendar, Video, BarChart, CheckCircle, Clock, X } from "lucide-react";
import { toast } from "sonner";
import { format, subDays, subHours, subMinutes } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading notifications
    setLoading(true);
    setTimeout(() => {
      const mockNotifications = generateMockNotifications();
      setNotifications(mockNotifications);
      setLoading(false);
      toast.success("Notifications loaded");
    }, 1000);
  }, []);

  const generateMockNotifications = () => {
    const now = new Date();
    return [
      {
        id: '1',
        type: 'appointment',
        title: 'Upcoming Appointment',
        message: 'You have an appointment with Dr. Smith tomorrow at 10:00 AM',
        read: false,
        createdAt: subDays(now, 1).toISOString(),
        icon: <Calendar className="h-5 w-5 text-blue-500" />,
        action: '/appointments',
        actionText: 'View Appointment'
      },
      {
        id: '2',
        type: 'analysis',
        title: 'Video Analysis Complete',
        message: 'Your knee extension exercise video has been analyzed by our AI',
        read: false,
        createdAt: subHours(now, 3).toISOString(),
        icon: <Video className="h-5 w-5 text-purple-500" />,
        action: '/dashboard?tab=analysis',
        actionText: 'View Analysis'
      },
      {
        id: '3',
        type: 'message',
        title: 'New Message from Dr. Johnson',
        message: 'Great progress on your exercises! Keep up the good work.',
        read: true,
        createdAt: subHours(now, 5).toISOString(),
        icon: <MessageSquare className="h-5 w-5 text-green-500" />,
        action: '/messages',
        actionText: 'Reply'
      },
      {
        id: '4',
        type: 'exercise',
        title: 'Daily Exercise Reminder',
        message: 'Don\'t forget to complete your daily exercises',
        read: true,
        createdAt: subHours(now, 8).toISOString(),
        icon: <Activity className="h-5 w-5 text-red-500" />,
        action: '/dashboard',
        actionText: 'View Exercises'
      },
      {
        id: '5',
        type: 'progress',
        title: 'Weekly Progress Report',
        message: 'Your recovery progress has improved by 15% this week',
        read: true,
        createdAt: subDays(now, 2).toISOString(),
        icon: <BarChart className="h-5 w-5 text-indigo-500" />,
        action: '/progress-analytics',
        actionText: 'View Report'
      },
      {
        id: '6',
        type: 'appointment',
        title: 'Appointment Confirmed',
        message: 'Your appointment with Dr. Williams has been confirmed',
        read: true,
        createdAt: subDays(now, 3).toISOString(),
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        action: '/appointments',
        actionText: 'View Details'
      },
      {
        id: '7',
        type: 'system',
        title: 'System Maintenance',
        message: 'The system will be undergoing maintenance tonight from 2-4 AM',
        read: true,
        createdAt: subDays(now, 4).toISOString(),
        icon: <Clock className="h-5 w-5 text-orange-500" />,
        action: null,
        actionText: null
      }
    ];
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    toast.success("Marked as read");
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    toast.success("All notifications marked as read");
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    toast.success("Notification deleted");
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with your therapy journey</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllAsRead}>
            Mark All as Read
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            {notifications.filter(n => !n.read).length > 0 && (
              <Badge className="ml-2 bg-primary text-primary-foreground">
                {notifications.filter(n => !n.read).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse space-y-4 w-full max-w-3xl">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-20 bg-muted rounded-lg"></div>
                ))}
              </div>
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`overflow-hidden transition-all hover:shadow-md ${!notification.read ? 'border-l-4 border-l-primary' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        {notification.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{notification.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {getTimeAgo(notification.createdAt)}
                            </span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-3">
                          <div>
                            {!notification.read && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 px-2 text-xs"
                                onClick={() => markAsRead(notification.id)}
                              >
                                Mark as read
                              </Button>
                            )}
                          </div>
                          {notification.action && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              asChild
                              className="h-7"
                            >
                              <Link href={notification.action}>
                                {notification.actionText}
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No notifications</h3>
                <p className="text-muted-foreground text-center mb-6">
                  You don't have any notifications at the moment.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="unread">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse space-y-4 w-full max-w-3xl">
                {[1, 2].map((i) => (
                  <div key={i} className="h-20 bg-muted rounded-lg"></div>
                ))}
              </div>
            </div>
          ) : notifications.filter(n => !n.read).length > 0 ? (
            <div className="space-y-4">
              {notifications
                .filter(n => !n.read)
                .map((notification) => (
                  <Card 
                    key={notification.id} 
                    className="overflow-hidden transition-all hover:shadow-md border-l-4 border-l-primary"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                          {notification.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{notification.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {getTimeAgo(notification.createdAt)}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-3">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 px-2 text-xs"
                              onClick={() => markAsRead(notification.id)}
                            >
                              Mark as read
                            </Button>
                            {notification.action && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                asChild
                                className="h-7"
                              >
                                <Link href={notification.action}>
                                  {notification.actionText}
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">All caught up!</h3>
                <p className="text-muted-foreground text-center">
                  You don't have any unread notifications.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="appointments">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse space-y-4 w-full max-w-3xl">
                <div className="h-20 bg-muted rounded-lg"></div>
              </div>
            </div>
          ) : notifications.filter(n => n.type === 'appointment').length > 0 ? (
            <div className="space-y-4">
              {notifications
                .filter(n => n.type === 'appointment')
                .map((notification) => (
                  <Card 
                    key={notification.id} 
                    className={`overflow-hidden transition-all hover:shadow-md ${!notification.read ? 'border-l-4 border-l-primary' : ''}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                          {notification.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{notification.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {getTimeAgo(notification.createdAt)}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-3">
                            <div>
                              {!notification.read && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-7 px-2 text-xs"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  Mark as read
                                </Button>
                              )}
                            </div>
                            {notification.action && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                asChild
                                className="h-7"
                              >
                                <Link href={notification.action}>
                                  {notification.actionText}
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No appointment notifications</h3>
                <p className="text-muted-foreground text-center mb-6">
                  You don't have any appointment-related notifications.
                </p>
                <Button asChild>
                  <Link href="/appointments">
                    View Appointments
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="messages">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse space-y-4 w-full max-w-3xl">
                <div className="h-20 bg-muted rounded-lg"></div>
              </div>
            </div>
          ) : notifications.filter(n => n.type === 'message').length > 0 ? (
            <div className="space-y-4">
              {notifications
                .filter(n => n.type === 'message')
                .map((notification) => (
                  <Card 
                    key={notification.id} 
                    className={`overflow-hidden transition-all hover:shadow-md ${!notification.read ? 'border-l-4 border-l-primary' : ''}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                          {notification.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{notification.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {getTimeAgo(notification.createdAt)}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-3">
                            <div>
                              {!notification.read && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-7 px-2 text-xs"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  Mark as read
                                </Button>
                              )}
                            </div>
                            {notification.action && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                asChild
                                className="h-7"
                              >
                                <Link href={notification.action}>
                                  {notification.actionText}
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No message notifications</h3>
                <p className="text-muted-foreground text-center mb-6">
                  You don't have any message-related notifications.
                </p>
                <Button asChild>
                  <Link href="/messages">
                    View Messages
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="system">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse space-y-4 w-full max-w-3xl">
                <div className="h-20 bg-muted rounded-lg"></div>
              </div>
            </div>
          ) : notifications.filter(n => n.type === 'system').length > 0 ? (
            <div className="space-y-4">
              {notifications
                .filter(n => n.type === 'system')
                .map((notification) => (
                  <Card 
                    key={notification.id} 
                    className={`overflow-hidden transition-all hover:shadow-md ${!notification.read ? 'border-l-4 border-l-primary' : ''}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                          {notification.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{notification.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {getTimeAgo(notification.createdAt)}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-3">
                            <div>
                              {!notification.read && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-7 px-2 text-xs"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  Mark as read
                                </Button>
                              )}
                            </div>
                            {notification.action && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                asChild
                                className="h-7"
                              >
                                <Link href={notification.action}>
                                  {notification.actionText}
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No system notifications</h3>
                <p className="text-muted-foreground text-center">
                  You don't have any system-related notifications.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
