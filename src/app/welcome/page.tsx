'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import Image from "next/image";
import { ArrowRight } from 'lucide-react';

export default function WelcomePage() {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    // Show welcome screen for 3 seconds, then redirect to dashboard
    const timer = setTimeout(() => {
      setShowWelcome(false);
      // Redirect to dashboard after welcome animation
      router.push('/dashboard');
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#01042A]">
        <div className="text-center">
          <div className="inline-block rounded-full bg-blue-500/20 p-6 mb-4 animate-pulse">
            <div className="rounded-full bg-blue-500/40 p-4">
              <div className="rounded-full bg-blue-500 text-white p-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10">
                  <path d="M18 8c0 4.5-6 9-6 9s-6-4.5-6-9a6 6 0 0 1 12 0Z"></path>
                  <circle cx="12" cy="8" r="2"></circle>
                </svg>
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-white">Loading...</h2>
        </div>
      </div>
    );
  }

  // If not authenticated, return null (will redirect in useEffect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex flex-col items-center justify-center p-4">
      {/* Welcome Animation */}
      {showWelcome && (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-blue-900 to-blue-700 z-50">
          <div className="text-center animate-pulse">
            <div className="mb-6">
              <Image
                src="/kinetic-logo.png"
                alt="Kinetic AI Logo"
                width={120}
                height={120}
                className="mx-auto"
              />
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              Welcome to Kinetic AI
            </div>
            <div className="text-xl text-blue-200">
              Your personalized recovery journey starts now
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <Image
            src="/kinetic-logo.png"
            alt="Kinetic AI Logo"
            width={120}
            height={120}
            className="mx-auto"
          />
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 mb-8 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Welcome back, {user?.firstName || 'Patient'}!
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Let's continue with your personalized AI-powered physiotherapy program.
          </p>
          <Button
            size="lg"
            className="bg-emerald-500 hover:bg-emerald-600 text-white w-full md:w-auto"
            onClick={() => router.push('/dashboard')}
          >
            Continue to Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        <div className="text-blue-200 text-sm">
          © {new Date().getFullYear()} Kinetic AI. All rights reserved.
        </div>
      </div>
    </div>
  );
}


