"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
}

const Testimonials3D = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Physical Therapist",
      company: "RehabPlus Clinic",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      content: "Kinetic AI has revolutionized how I work with my patients. The real-time feedback and detailed analysis help me provide more accurate assessments and personalized treatment plans. My patients love seeing their progress visualized.",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Fitness Coach",
      company: "Elite Performance",
      avatar: "https://randomuser.me/api/portraits/men/54.jpg",
      content: "As a fitness coach, I need tools that provide accurate movement analysis. Kinetic AI gives me exactly that, plus the ability to track progress over time. My clients have seen significant improvements in their form and performance.",
      rating: 5
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      role: "Yoga Instructor",
      company: "Harmony Yoga Studio",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
      content: "The pose detection in Kinetic AI is incredibly accurate, even for complex yoga poses. It helps my students understand proper alignment and has become an essential tool in my virtual classes. Highly recommended!",
      rating: 4
    },
    {
      id: 4,
      name: "David Wilson",
      role: "Sports Rehabilitation",
      company: "Athletic Recovery Center",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      content: "Working with athletes requires precision and data-driven insights. Kinetic AI provides both, helping us identify potential injury risks and optimize recovery protocols. It's changed how we approach rehabilitation.",
      rating: 5
    },
    {
      id: 5,
      name: "Olivia Thompson",
      role: "Dance Instructor",
      company: "Contemporary Dance Academy",
      avatar: "https://randomuser.me/api/portraits/women/17.jpg",
      content: "The multi-person detection feature is perfect for my dance classes. I can analyze group performances and provide individual feedback. The 3D visualization helps my students understand movement in a whole new way.",
      rating: 4
    }
  ];
  
  // Handle next testimonial
  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };
  
  // Handle previous testimonial
  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };
  
  // Auto-advance testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Animation when testimonial changes
  useEffect(() => {
    controls.start({
      x: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    });
  }, [activeIndex, controls]);
  
  return (
    <div className="py-20 bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">
            What Our Users <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Are Saying</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Hear from professionals who have transformed their practice with Kinetic AI's advanced pose detection technology.
          </p>
        </motion.div>
        
        <div className="relative max-w-4xl mx-auto" ref={containerRef}>
          {/* Background decorative elements */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
          
          {/* Large quote icon */}
          <div className="absolute top-0 left-0 text-blue-100 dark:text-blue-900 transform -translate-x-1/2 -translate-y-1/2">
            <Quote className="w-20 h-20 opacity-20" />
          </div>
          
          {/* Testimonial card */}
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: direction * 100 }}
            animate={controls}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700"
          >
            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3 flex flex-col items-center md:items-start">
                  <Avatar className="w-24 h-24 border-4 border-blue-100 dark:border-blue-900">
                    <AvatarImage src={testimonials[activeIndex].avatar} alt={testimonials[activeIndex].name} />
                    <AvatarFallback>{testimonials[activeIndex].name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <h3 className="text-xl font-bold mt-4 dark:text-white">{testimonials[activeIndex].name}</h3>
                  <p className="text-slate-600 dark:text-slate-300">{testimonials[activeIndex].role}</p>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">{testimonials[activeIndex].company}</p>
                  
                  <div className="flex items-center mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${i < testimonials[activeIndex].rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 dark:text-slate-600'}`} 
                      />
                    ))}
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <blockquote className="text-lg md:text-xl italic text-slate-700 dark:text-slate-200 leading-relaxed">
                    "{testimonials[activeIndex].content}"
                  </blockquote>
                </div>
              </div>
            </div>
            
            {/* 3D effect on hover */}
            <motion.div 
              className="absolute inset-0 pointer-events-none"
              whileHover={{ 
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                transform: "perspective(1000px) rotateX(2deg) rotateY(2deg)"
              }}
            />
          </motion.div>
          
          {/* Navigation buttons */}
          <div className="flex justify-center mt-8 space-x-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handlePrev}
              className="rounded-full h-10 w-10 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > activeIndex ? 1 : -1);
                    setActiveIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === activeIndex 
                      ? 'bg-blue-600 w-6' 
                      : 'bg-slate-300 dark:bg-slate-600 hover:bg-blue-400 dark:hover:bg-blue-700'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleNext}
              className="rounded-full h-10 w-10 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials3D;
