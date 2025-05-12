'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function WelcomeScreen() {
  const [showWelcome, setShowWelcome] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex flex-col items-center justify-center p-4">
      {/* Welcome Overlay */}
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
            Welcome to Your Recovery Journey
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