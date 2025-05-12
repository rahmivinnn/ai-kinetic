"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Camera,
  Activity,
  MessageSquare,
  BarChart2,
  Users,
  Zap,
  Shield,
  Database
} from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const Features3DSection = () => {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  const features: Feature[] = [
    {
      icon: <Camera className="h-6 w-6" />,
      title: "Real-time Pose Detection",
      description: "Analyze body posture and movement in real-time using advanced AI algorithms.",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: <Activity className="h-6 w-6" />,
      title: "Movement Analysis",
      description: "Get detailed insights into your movement patterns, joint angles, and body alignment.",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Personalized Feedback",
      description: "Receive customized recommendations to improve your form and prevent injuries.",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: <BarChart2 className="h-6 w-6" />,
      title: "Progress Tracking",
      description: "Monitor your improvement over time with detailed metrics and visualizations.",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Multi-Person Detection",
      description: "Analyze multiple people simultaneously for group training and coaching.",
      color: "from-cyan-500 to-blue-600"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "High Performance",
      description: "Optimized algorithms ensure smooth performance even on mobile devices.",
      color: "from-yellow-500 to-amber-600"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Privacy Focused",
      description: "Your data stays on your device with optional cloud backup and synchronization.",
      color: "from-teal-500 to-green-600"
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Comprehensive Analytics",
      description: "Deep dive into your performance data with advanced analytics and reporting.",
      color: "from-pink-500 to-rose-600"
    }
  ];

  return (
    <div className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">
            Powerful Features for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Movement Analysis</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Discover how Kinetic AI can transform your training, rehabilitation, or fitness routine with these powerful features.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="relative perspective-1000"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onHoverStart={() => setActiveFeature(index)}
              onHoverEnd={() => setActiveFeature(null)}
            >
              <motion.div
                className={`h-full bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 p-6
                           transition-all duration-300 ease-out`}
                animate={{
                  rotateX: activeFeature === index ? 5 : 0,
                  rotateY: activeFeature === index ? 5 : 0,
                  scale: activeFeature === index ? 1.05 : 1,
                  boxShadow: activeFeature === index
                    ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
              >
                <motion.div
                  className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center bg-gradient-to-r ${feature.color} text-white shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {feature.icon}
                </motion.div>

                <motion.h3
                  className="text-xl font-bold mb-2 dark:text-white"
                  animate={{
                    color: activeFeature === index ?
                      ['#1e40af', '#4f46e5', '#1e40af'] :
                      activeFeature === null ? '#1e293b' : '#1e293b'
                  }}
                  transition={{ duration: 1.5, repeat: activeFeature === index ? Infinity : 0 }}
                >
                  {feature.title}
                </motion.h3>
                <p className="text-slate-600 dark:text-slate-300">{feature.description}</p>

                {/* Interactive button */}
                {activeFeature === index && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4"
                  >
                    <Link href={
                      feature.title === "Real-time Pose Detection" ? "/pose-detection-v2" :
                      feature.title === "Movement Analysis" ? "/openpose-analyzer" :
                      feature.title === "Progress Tracking" ? "/dashboard" :
                      "/"
                    }>
                      <button className={`text-sm font-medium py-1 px-3 rounded-full bg-gradient-to-r ${feature.color} text-white`}>
                        Try it now
                      </button>
                    </Link>
                  </motion.div>
                )}

                {/* Interactive elements that appear on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-xl pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeFeature === index ? 1 : 0 }}
                />

                {/* Animated particles on hover */}
                {activeFeature === index && (
                  <>
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`absolute w-1 h-1 rounded-full bg-gradient-to-r ${feature.color}`}
                        initial={{
                          x: '50%',
                          y: '50%',
                          opacity: 0,
                          scale: 0
                        }}
                        animate={{
                          x: `${50 + (Math.random() * 40 - 20)}%`,
                          y: `${50 + (Math.random() * 40 - 20)}%`,
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0]
                        }}
                        transition={{
                          duration: 1 + Math.random(),
                          repeat: Infinity,
                          repeatType: 'loop'
                        }}
                      />
                    ))}
                  </>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features3DSection;
