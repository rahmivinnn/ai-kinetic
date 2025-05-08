'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import {
  Home,
  Activity,
  Video,
  MessageSquare,
  BarChart2,
  Calendar,
  User,
  Settings,
  LogOut,
  PhoneCall
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  active?: boolean;
}

export default function SideNavigation() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  
  // Navigation items
  const navItems: NavItem[] = [
    { 
      title: "Home", 
      href: "/dashboard", 
      icon: Home,
      active: pathname === '/dashboard'
    },
    { 
      title: "Exercise Plan", 
      href: "/dashboard#exercise-plan", 
      icon: Activity,
      active: pathname === '/dashboard' && pathname.includes('#exercise-plan')
    },
    { 
      title: "Video Library", 
      href: "/video-library", 
      icon: Video,
      active: pathname === '/video-library'
    },
    { 
      title: "Video Call", 
      href: "/video-call", 
      icon: PhoneCall,
      active: pathname === '/video-call'
    },
    { 
      title: "Messages", 
      href: "/messages", 
      icon: MessageSquare,
      active: pathname === '/messages'
    },
    { 
      title: "Analytics", 
      href: "/progress-analytics", 
      icon: BarChart2,
      active: pathname === '/progress-analytics'
    },
    { 
      title: "Appointments", 
      href: "/appointments", 
      icon: Calendar,
      active: pathname === '/appointments'
    },
    { 
      title: "Profile", 
      href: "/profile", 
      icon: User,
      active: pathname === '/profile'
    },
  ];

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase() || 'U';
  };

  return (
    <div className="fixed left-0 top-0 bottom-0 w-[60px] bg-gradient-to-b from-[#004586] to-[#01042A] flex flex-col items-center py-4 z-50">
      {/* Logo */}
      <div className="mb-8">
        <Link href="/dashboard">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white">
            <img
              src="/kinetic-logo.png"
              alt="Kinetic AI"
              className="w-8 h-8"
            />
          </div>
        </Link>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 w-full flex flex-col items-center space-y-4">
        <TooltipProvider>
          {navItems.map((item) => (
            <Tooltip key={item.title} delayDuration={300}>
              <TooltipTrigger asChild>
                <Link 
                  href={item.href}
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-md transition-colors",
                    item.active 
                      ? "bg-white/20 text-white" 
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.title}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>

      {/* User Profile & Logout */}
      <div className="mt-auto flex flex-col items-center space-y-4">
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Link href="/settings" className="flex items-center justify-center w-10 h-10 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                <Settings className="w-5 h-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <button 
                onClick={() => logout()}
                className="flex items-center justify-center w-10 h-10 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Link href="/profile" className="mt-2">
                <Avatar className="w-10 h-10 border-2 border-white/20">
                  <AvatarImage src={user?.photoURL || ''} />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {user?.displayName ? getInitials(user.displayName) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{user?.displayName || 'User Profile'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
