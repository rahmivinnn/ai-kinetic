'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import Image from "next/image";

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
    <div className="min-h-screen">
      {/* Welcome Animation */}
      {showWelcome && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#01042A] z-50">
          <div className="text-center">
            <div className="inline-block rounded-full bg-blue-500/20 p-6 mb-4">
              <div className="rounded-full bg-blue-500/40 p-4">
                <div className="rounded-full bg-blue-500 text-white p-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 animate-pulse">
                    <path d="M18 8c0 4.5-6 9-6 9s-6-4.5-6-9a6 6 0 0 1 12 0Z"></path>
                    <circle cx="12" cy="8" r="2"></circle>
                  </svg>
                </div>
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-2 text-white">Welcome to Kinetic AI, {user?.firstName || 'Patient'}!</h2>
            <p className="text-blue-200">Preparing your personalized recovery journey...</p>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <nav className="bg-[#01042A] text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="mr-2">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="#00A3FF" />
                <path d="M16 8L18.5 13.5L24 14.5L20 18.5L21 24L16 21.5L11 24L12 18.5L8 14.5L13.5 13.5L16 8Z" fill="white" />
              </svg>
            </div>
            <span className="text-xl font-bold">Kinetic AI</span>
          </div>
          <div className="hidden md:flex space-x-6">
            <a href="#features" className="hover:text-blue-300">Features</a>
            <a href="#how-it-works" className="hover:text-blue-300">How It Works</a>
            <a href="#success-stories" className="hover:text-blue-300">Success Stories</a>
            <a href="#resources" className="hover:text-blue-300">Resources</a>
          </div>
          <div>
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => router.push('/dashboard')}
            >
              Sign up
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="py-16 px-4 md:px-8 bg-white">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#01042A]">
              Personalized Recovery<br />
              Powered By Movement<br />
              Intelligence
            </h1>
            <p className="text-gray-600 mb-6 max-w-lg">
              Transform your rehabilitation with intelligent movement coaching and data-driven therapy.
              Our platform bridges home exercises with clinical expertise for a smoother, faster recovery
              experience.
            </p>
            <div className="flex space-x-4">
              <Button
                className="bg-[#01042A] hover:bg-[#01042A]/90 text-white"
                onClick={() => router.push('/dashboard')}
              >
                Start Your Journey
              </Button>
              <Button
                variant="outline"
                className="border-[#01042A] text-[#01042A] hover:bg-[#01042A]/10"
                onClick={() => router.push('/video-library')}
              >
                Watch Demo
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md h-80 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=350&fit=crop"
                alt="Physiotherapy"
                width={500}
                height={350}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16 px-4 md:px-8 bg-gray-50">
        <div className="container mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-[#01042A]">Our Key Features</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Kinetic AI combines cutting-edge technology with clinical expertise to provide a comprehensive recovery solution.
          </p>
        </div>

        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0066CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8c0 4.5-6 9-6 9s-6-4.5-6-9a6 6 0 0 1 12 0Z"></path>
                <circle cx="12" cy="8" r="2"></circle>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-[#01042A]">AI Movement Analysis</h3>
            <p className="text-gray-600">
              Our AI technology analyzes your movements in real-time to provide personalized feedback and corrections.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0066CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-[#01042A]">Expert Guidance</h3>
            <p className="text-gray-600">
              Connect with certified physiotherapists who provide professional guidance throughout your recovery journey.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0066CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20V10"></path>
                <path d="M18 20V4"></path>
                <path d="M6 20v-6"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-[#01042A]">Progress Tracking</h3>
            <p className="text-gray-600">
              Monitor your recovery progress with detailed analytics and visualizations to stay motivated.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="success-stories" className="py-16 px-4 md:px-8 bg-white">
        <div className="container mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-[#01042A]">Success Stories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from our users who have successfully recovered using Kinetic AI.
          </p>
        </div>

        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="flex items-center mb-4">
              <Image
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
                alt="Sarah Johnson"
                width={64}
                height={64}
                className="h-16 w-16 rounded-full object-cover mr-4"
              />
              <div>
                <h3 className="font-semibold text-[#01042A]">Sarah Johnson</h3>
                <p className="text-sm text-gray-500">Recovered from knee injury</p>
              </div>
            </div>
            <p className="text-gray-600 italic mb-4">
              &quot;Kinetic AI transformed my recovery journey. The personalized exercise plans and real-time feedback helped me recover faster than expected.&quot;
            </p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="flex items-center mb-4">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
                alt="Michael Chen"
                width={64}
                height={64}
                className="h-16 w-16 rounded-full object-cover mr-4"
              />
              <div>
                <h3 className="font-semibold text-[#01042A]">Michael Chen</h3>
                <p className="text-sm text-gray-500">Sports enthusiast</p>
              </div>
            </div>
            <p className="text-gray-600 italic mb-4">
              &quot;The video analysis feature is incredible! It helped me correct my form and prevent further injuries. Highly recommended!&quot;
            </p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="flex items-center mb-4">
              <Image
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop"
                alt="Emma Rodriguez"
                width={64}
                height={64}
                className="h-16 w-16 rounded-full object-cover mr-4"
              />
              <div>
                <h3 className="font-semibold text-[#01042A]">Emma Rodriguez</h3>
                <p className="text-sm text-gray-500">Marathon runner</p>
              </div>
            </div>
            <p className="text-gray-600 italic mb-4">
              &quot;The video calls with my physiotherapist made all the difference. It&apos;s like having a personal coach available whenever I need guidance.&quot;
            </p>
            <div className="flex">
              {[...Array(4)].map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              ))}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 px-4 md:px-8 bg-[#01042A] text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Recovery Journey?</h2>
          <p className="text-blue-200 mb-8 max-w-2xl mx-auto">
            Access your personalized exercise plan, connect with experts, and track your progress all in one place.
          </p>
          <Button
            size="lg"
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => router.push('/dashboard')}
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
