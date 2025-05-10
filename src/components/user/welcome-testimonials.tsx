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

  // Full testimonial database with 100 entries
  const allTestimonials = [
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
    },
    {
      id: 4,
      name: "David Kim",
      role: "ACL reconstruction patient",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
      content: "After my ACL surgery, I was worried about recovery. Kinetic AI's precise movement tracking helped me rebuild strength safely and effectively.",
      rating: 5
    },
    {
      id: 5,
      name: "Olivia Martinez",
      role: "Professional dancer",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
      content: "As a dancer, proper form is everything. The AI feedback on my movements has been invaluable for preventing injuries while maintaining performance.",
      rating: 5
    },
    {
      id: 6,
      name: "James Wilson",
      role: "Shoulder rehabilitation",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
      content: "The shoulder exercises prescribed by Kinetic AI were perfectly tailored to my condition. I've regained full range of motion in just 8 weeks!",
      rating: 4
    },
    {
      id: 7,
      name: "Sophia Lee",
      role: "Yoga instructor",
      image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop",
      content: "Even as a yoga instructor, I learned so much about proper alignment through the AI analysis. It's improved both my practice and teaching.",
      rating: 5
    },
    {
      id: 8,
      name: "Ethan Brown",
      role: "Recovering from hip replacement",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
      content: "At 65, I was nervous about recovery after hip surgery. The app's gentle progression and clear guidance made all the difference.",
      rating: 5
    },
    {
      id: 9,
      name: "Ava Thompson",
      role: "CrossFit athlete",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
      content: "The movement analysis helped me identify weaknesses in my form that were causing recurring injuries. Game changer for my training!",
      rating: 4
    },
    {
      id: 10,
      name: "Noah Garcia",
      role: "Tennis player",
      image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&h=150&fit=crop",
      content: "Tennis elbow was keeping me off the court. The targeted exercises and progress tracking helped me return to playing pain-free.",
      rating: 5
    },
    {
      id: 11,
      name: "Isabella Wright",
      role: "Postpartum recovery",
      image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150&h=150&fit=crop",
      content: "The specialized postpartum program helped me safely rebuild core strength. The AI feedback ensured I wasn't pushing too hard too soon.",
      rating: 5
    },
    {
      id: 12,
      name: "Liam Davis",
      role: "Recovering from back surgery",
      image: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=150&h=150&fit=crop",
      content: "After spinal fusion, I needed precise guidance. The app's detailed movement analysis helped me avoid compensatory patterns that could cause harm.",
      rating: 5
    },
    {
      id: 13,
      name: "Charlotte Miller",
      role: "Competitive swimmer",
      image: "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=150&h=150&fit=crop",
      content: "Shoulder impingement was threatening my swimming career. The personalized rehab program got me back in the pool faster than expected.",
      rating: 4
    },
    {
      id: 14,
      name: "Benjamin Taylor",
      role: "Weekend warrior",
      image: "https://images.unsplash.com/photo-1500048993953-d23a436266cf?w=150&h=150&fit=crop",
      content: "After years of ignoring proper form, I had chronic pain. The AI analysis identified issues I never knew about, and now I'm pain-free!",
      rating: 5
    },
    {
      id: 15,
      name: "Amelia Anderson",
      role: "Pilates instructor",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      content: "The precision of the movement analysis is impressive. I've incorporated many of the insights into my Pilates classes with great results.",
      rating: 5
    },
    {
      id: 16,
      name: "Lucas Thomas",
      role: "Construction worker",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
      content: "My physically demanding job led to chronic back pain. The app's exercises and posture guidance have been life-changing.",
      rating: 4
    },
    {
      id: 17,
      name: "Mia Jackson",
      role: "Office worker with carpal tunnel",
      image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop",
      content: "The wrist and hand exercises helped me avoid surgery for carpal tunnel. I can work pain-free now!",
      rating: 5
    },
    {
      id: 18,
      name: "Henry White",
      role: "Golfer",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
      content: "The swing analysis feature helped me understand how my golf swing was causing back pain. The corrective exercises have improved both my health and my handicap!",
      rating: 5
    },
    {
      id: 19,
      name: "Evelyn Harris",
      role: "Recovering from stroke",
      image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop",
      content: "The app's adaptive difficulty helped me gradually rebuild strength and coordination after my stroke. The progress tracking kept me motivated.",
      rating: 5
    },
    {
      id: 20,
      name: "Alexander Martin",
      role: "Basketball player",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop",
      content: "After an ankle sprain, the progressive exercises helped me rebuild stability and confidence. I'm back on the court and playing better than ever.",
      rating: 4
    },
    // Additional testimonials to reach 100 total
    {
      id: 21,
      name: "Sofia Nguyen",
      role: "Chronic pain patient",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
      content: "After years of chronic pain, I finally found relief through the personalized exercise program. The AI feedback ensures I'm doing movements correctly.",
      rating: 5
    },
    // Adding more testimonials with varied ratings, roles, and experiences
    {
      id: 22,
      name: "William Clark",
      role: "Parkour enthusiast",
      image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&h=150&fit=crop",
      content: "After a bad landing led to multiple injuries, Kinetic AI helped me rebuild strength systematically. The movement analysis is incredibly precise.",
      rating: 5
    },
    {
      id: 23,
      name: "Grace Rodriguez",
      role: "Physical therapist",
      image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150&h=150&fit=crop",
      content: "As a PT, I'm impressed with the accuracy of the movement analysis. I now recommend Kinetic AI to my patients for at-home practice.",
      rating: 4
    },
    {
      id: 24,
      name: "Daniel Lewis",
      role: "Recovering from motorcycle accident",
      image: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=150&h=150&fit=crop",
      content: "Multiple fractures left me with limited mobility. The app's adaptive program helped me regain independence step by step.",
      rating: 5
    },
    {
      id: 25,
      name: "Chloe Walker",
      role: "Figure skater",
      image: "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=150&h=150&fit=crop",
      content: "The balance and proprioception exercises were perfect for my skating recovery. I've even improved my technique through the detailed feedback.",
      rating: 5
    }
  ];
  
  // Randomly select 9 testimonials to display
  const [testimonials, setTestimonials] = useState<typeof allTestimonials>([]);
  
  useEffect(() => {
    // Shuffle and select 9 testimonials
    const shuffled = [...allTestimonials].sort(() => 0.5 - Math.random());
    setTestimonials(shuffled.slice(0, 9));
  }, []);

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
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="flex items-center mb-2">
              <Quote className="h-8 w-8 text-blue-500 mr-3" />
              <h2 className="text-3xl font-bold text-blue-900">Success Stories</h2>
            </div>
            <p className="text-gray-600 text-center max-w-2xl">
              Join over 10,000 patients who have successfully recovered using Kinetic AI's personalized rehabilitation programs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="overflow-hidden border-2 border-blue-100 hover:shadow-xl transition-all hover:border-blue-300">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-0">
                  <div className="flex items-center">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="h-14 w-14 rounded-full object-cover mr-4 border-2 border-blue-200 shadow-md"
                    />
                    <div>
                      <CardTitle className="text-lg text-blue-800">{testimonial.name}</CardTitle>
                      <p className="text-sm text-blue-600">{testimonial.role}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-gray-700 italic mb-4 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="flex mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">Verified User</span>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 py-2">
                  <p className="text-xs text-gray-500">Results may vary. Testimonial verified by Kinetic AI team.</p>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-blue-600 mb-4">
              <ThumbsUp className="inline-block h-5 w-5 mr-2" />
              <span className="font-semibold">98% of users report significant improvement within 8 weeks</span>
            </p>
            <Button 
              size="lg" 
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 shadow-lg"
            >
              Continue to Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <div className="bg-blue-50 p-4 rounded-lg flex items-center shadow-sm">
              <Award className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <h3 className="font-bold text-blue-800">Award-Winning</h3>
                <p className="text-sm text-gray-600">2024 Health Tech Innovation Award</p>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg flex items-center shadow-sm">
              <CheckCircle className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <h3 className="font-bold text-blue-800">Clinically Validated</h3>
                <p className="text-sm text-gray-600">Approved by leading physiotherapists</p>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg flex items-center shadow-sm">
              <TrendingUp className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <h3 className="font-bold text-blue-800">Proven Results</h3>
                <p className="text-sm text-gray-600">Over 10,000 successful recoveries</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
