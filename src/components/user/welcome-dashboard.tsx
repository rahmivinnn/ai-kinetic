'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { ArrowRight, Star, Quote, CheckCircle, Award, TrendingUp, ThumbsUp, 
         Activity, Video, Calendar, BarChart, Users, Zap, Shield } from "lucide-react";

export function WelcomeDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    // Hide animation after 2 seconds
    const timer = setTimeout(() => {
      setShowAnimation(false);
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

  const features = [
    {
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      title: "Personalized Exercise Plans",
      description: "AI-generated exercise plans tailored to your specific needs and recovery goals."
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-blue-500" />,
      title: "Progress Tracking",
      description: "Monitor your recovery journey with detailed analytics and progress reports."
    },
    {
      icon: <Video className="h-6 w-6 text-purple-500" />,
      title: "Expert Video Guidance",
      description: "Connect with certified physiotherapists through video calls for professional advice."
    },
    {
      icon: <Activity className="h-6 w-6 text-red-500" />,
      title: "Real-time Movement Analysis",
      description: "Advanced AI analyzes your movements to ensure proper form and technique."
    },
    {
      icon: <Calendar className="h-6 w-6 text-indigo-500" />,
      title: "Scheduled Reminders",
      description: "Never miss a session with customized notifications and exercise reminders."
    },
    {
      icon: <BarChart className="h-6 w-6 text-amber-500" />,
      title: "Detailed Analytics",
      description: "Comprehensive reports on your progress, range of motion, and strength improvements."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Welcome Animation */}
      {showAnimation && (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-4xl font-bold text-blue-900 mb-2"
            >
              Welcome to Kinetic AI
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-xl text-blue-600"
            >
              Your personalized recovery journey starts now
            </motion.div>
          </motion.div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-[url('/pattern-bg.png')] opacity-10"></div>
        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <div className="inline-block bg-blue-500 bg-opacity-30 px-4 py-1 rounded-full mb-4">
                <span className="text-blue-100 font-medium flex items-center">
                  <Zap className="h-4 w-4 mr-1" />
                  AI-Powered Rehabilitation Platform
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Welcome back, <span className="text-blue-200">{user?.firstName || 'Patient'}</span>!
              </h1>
              <p className="text-xl mb-8 text-blue-100 max-w-lg">
                Continue your recovery journey with personalized AI-powered physiotherapy. Your next milestone awaits.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg"
                  onClick={() => router.push('/dashboard')}
                >
                  Continue to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-blue-600"
                  onClick={() => router.push('/openpose-analyzer')}
                >
                  Try Movement Analysis
                  <Activity className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <div className="mt-8 flex items-center">
                <Shield className="h-5 w-5 text-blue-200 mr-2" />
                <span className="text-blue-200 text-sm">Clinically validated by leading physiotherapists</span>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -top-6 -left-6 w-20 h-20 bg-purple-500 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-400 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-green-400 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
                <img
                  src="/hero-image.png"
                  alt="Physiotherapy"
                  className="relative z-10 rounded-lg shadow-2xl w-full border-4 border-white/20"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=350&fit=crop";
                  }}
                />
                <div className="absolute bottom-4 right-4 bg-blue-900/80 backdrop-blur-sm p-3 rounded-lg z-20 shadow-lg">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-blue-300 mr-2" />
                    <span className="text-white text-sm font-medium">10,000+ Active Users</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-blue-900 mb-4">
            Your Personalized Recovery Journey
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Kinetic AI combines cutting-edge technology with clinical expertise to deliver a comprehensive rehabilitation experience
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 border-blue-100 hover:border-blue-300 transition-all hover:shadow-lg overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-400 to-indigo-600"></div>
              <CardContent className="p-6">
                <div className="bg-blue-50 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4 shadow-md">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-blue-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
              <CardFooter className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                <p className="text-blue-600 text-sm font-medium flex items-center">
                  Learn more
                  <ArrowRight className="h-4 w-4 ml-1" />
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 bg-blue-50 rounded-xl p-8 shadow-md">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Ready to accelerate your recovery?</h3>
              <p className="text-gray-700 mb-6">
                Our AI-powered platform adapts to your progress, providing personalized guidance every step of the way.
              </p>
              <Button 
                size="lg"
                onClick={() => router.push('/openpose-analyzer')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Try Movement Analysis
                <Activity className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="bg-white p-4 rounded-full shadow-lg">
                <Activity className="h-20 w-20 text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gradient-to-b from-blue-50 to-indigo-50 py-16">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center mb-12">
            <Quote className="h-8 w-8 text-blue-500 mr-3" />
            <h2 className="text-3xl font-bold text-blue-900">Success Stories</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="overflow-hidden border-2 border-blue-100 hover:shadow-xl transition-all">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="h-12 w-12 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h3 className="font-semibold text-blue-900">{testimonial.name}</h3>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 italic mb-4">"{testimonial.content}"</p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
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
