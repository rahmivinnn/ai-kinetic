'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { ArrowRight, Star, Quote, CheckCircle, Award, TrendingUp, ThumbsUp } from "lucide-react";

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
      icon: <Award className="h-6 w-6 text-purple-500" />,
      title: "Expert Guidance",
      description: "Connect with certified physiotherapists through video calls for professional advice."
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
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Welcome back, {user?.firstName || 'Patient'}!
              </h1>
              <p className="text-xl mb-8 text-blue-100">
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
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -top-6 -left-6 w-20 h-20 bg-purple-500 rounded-full opacity-20"></div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-400 rounded-full opacity-20"></div>
                <img
                  src="/hero-image.png"
                  alt="Physiotherapy"
                  className="relative z-10 rounded-lg shadow-2xl w-full"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=350&fit=crop";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">
          Personalized Recovery Journey
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 border-blue-100 hover:border-blue-300 transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="bg-blue-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-blue-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
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
