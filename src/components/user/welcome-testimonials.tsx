'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { ArrowRight, Star, Quote, CheckCircle, Award, TrendingUp, ThumbsUp } from "lucide-react";

export function WelcomeTestimonials() {
  const { user } = useAuth();
  const router = useRouter();
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Recovered from knee injury",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      content: "Kinetic AI transformed my recovery journey. The personalized exercise plans and real-time feedback helped me recover faster than expected.",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Sports enthusiast",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      content: "The video analysis feature is incredible! It helped me correct my form and prevent further injuries. Highly recommended!",
      rating: 5
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      role: "Marathon runner",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop",
      content: "The video calls with my physiotherapist made all the difference. It's like having a personal coach available whenever I need guidance.",
      rating: 4
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Welcome Overlay */}
      {showWelcome && (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <div className="text-center animate-pulse">
            <div className="text-4xl font-bold text-blue-900 mb-2">
              Welcome to Kinetic AI
            </div>
            <div className="text-xl text-blue-600">
              Your personalized recovery journey starts now
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl text-white p-8 mb-12 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-2/3 mb-6 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Welcome back, {user?.firstName || 'Patient'}!
              </h1>
              <p className="text-xl mb-6 text-blue-100">
                Continue your recovery journey with personalized AI-powered physiotherapy.
              </p>
              <Button 
                size="lg" 
                className="bg-white text-blue-700 hover:bg-blue-50"
                onClick={() => router.push('/dashboard')}
              >
                Continue to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="bg-blue-500 p-4 rounded-full">
                <ThumbsUp className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-8">
            <Quote className="h-8 w-8 text-blue-500 mr-3" />
            <h2 className="text-3xl font-bold text-blue-900">Success Stories</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="overflow-hidden border-2 border-blue-100 hover:shadow-xl transition-all">
                <CardHeader className="bg-blue-50 pb-0">
                  <div className="flex items-center">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="h-12 w-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-gray-600 italic mb-4">"{testimonial.content}"</p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button 
              size="lg" 
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Continue to Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
