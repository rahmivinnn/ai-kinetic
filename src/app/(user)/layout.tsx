'use client';

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
  Loader2,
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
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  // Function to get user initials for avatar
  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase() || 'U';
  };

  useEffect(() => {
    // Check for token in both localStorage and cookies
    const token = localStorage.getItem('token');
    const hasCookie = document.cookie.split(';').some(item => item.trim().startsWith('token='));

    if (!loading && !isAuthenticated && !token && !hasCookie) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // Continue rendering even if not authenticated yet, middleware will handle redirect
  // This prevents flickering during authentication check

  return (
    <div className="flex">
      <div className="fixed left-0 top-0 bottom-0 w-[70px] bg-gradient-to-b from-[#004586] to-[#01042A] flex flex-col items-center py-4 z-[100]">
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
          <Link
            href="/dashboard"
            className="flex items-center justify-center w-10 h-10 rounded-md transition-colors bg-white/20 text-white"
          >
            <Home className="w-5 h-5" />
          </Link>
          <Link
            href="/dashboard#exercise-plan"
            className="flex items-center justify-center w-10 h-10 rounded-md transition-colors text-white/60 hover:text-white hover:bg-white/10"
          >
            <Activity className="w-5 h-5" />
          </Link>
          <Link
            href="/video-library"
            className="flex items-center justify-center w-10 h-10 rounded-md transition-colors text-white/60 hover:text-white hover:bg-white/10"
          >
            <Video className="w-5 h-5" />
          </Link>
          <Link
            href="/video-call"
            className="flex items-center justify-center w-10 h-10 rounded-md transition-colors text-white/60 hover:text-white hover:bg-white/10"
          >
            <PhoneCall className="w-5 h-5" />
          </Link>
          <Link
            href="/messages"
            className="flex items-center justify-center w-10 h-10 rounded-md transition-colors text-white/60 hover:text-white hover:bg-white/10"
          >
            <MessageSquare className="w-5 h-5" />
          </Link>
          <Link
            href="/progress-analytics"
            className="flex items-center justify-center w-10 h-10 rounded-md transition-colors text-white/60 hover:text-white hover:bg-white/10"
          >
            <BarChart2 className="w-5 h-5" />
          </Link>
          <Link
            href="/appointments"
            className="flex items-center justify-center w-10 h-10 rounded-md transition-colors text-white/60 hover:text-white hover:bg-white/10"
          >
            <Calendar className="w-5 h-5" />
          </Link>
          <Link
            href="/profile"
            className="flex items-center justify-center w-10 h-10 rounded-md transition-colors text-white/60 hover:text-white hover:bg-white/10"
          >
            <User className="w-5 h-5" />
          </Link>
        </div>

        {/* User Profile & Logout */}
        <div className="mt-auto flex flex-col items-center space-y-4">
          <Link
            href="/settings"
            className="flex items-center justify-center w-10 h-10 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </Link>
          <button
            onClick={() => logout()}
            className="flex items-center justify-center w-10 h-10 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
          <Link href="/profile" className="mt-2">
            <Avatar className="w-10 h-10 border-2 border-white/20">
              <AvatarImage src={user?.photoURL || ''} />
              <AvatarFallback className="bg-primary/20 text-primary">
                {user?.displayName ? getInitials(user.displayName) : 'U'}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
      <main className="pl-[80px] pr-4 py-4 w-full min-h-screen bg-[#EBF4FE]">
        {children}
      </main>
    </div>
  );
}
