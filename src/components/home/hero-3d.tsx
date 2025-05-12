"use client";

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from 'lucide-react';
import Link from 'next/link';

const Hero3D = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Animation for the human figure
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      if (containerRef.current && canvas) {
        canvas.width = containerRef.current.offsetWidth;
        canvas.height = containerRef.current.offsetHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Human figure keypoints
    const keypoints = [
      { name: 'head', x: 0, y: -80 },
      { name: 'neck', x: 0, y: -50 },
      { name: 'rightShoulder', x: -30, y: -50 },
      { name: 'rightElbow', x: -60, y: -20 },
      { name: 'rightWrist', x: -70, y: 10 },
      { name: 'leftShoulder', x: 30, y: -50 },
      { name: 'leftElbow', x: 60, y: -20 },
      { name: 'leftWrist', x: 70, y: 10 },
      { name: 'rightHip', x: -20, y: 0 },
      { name: 'rightKnee', x: -25, y: 50 },
      { name: 'rightAnkle', x: -30, y: 100 },
      { name: 'leftHip', x: 20, y: 0 },
      { name: 'leftKnee', x: 25, y: 50 },
      { name: 'leftAnkle', x: 30, y: 100 },
    ];

    // Connections between keypoints
    const connections = [
      ['head', 'neck'],
      ['neck', 'rightShoulder'],
      ['rightShoulder', 'rightElbow'],
      ['rightElbow', 'rightWrist'],
      ['neck', 'leftShoulder'],
      ['leftShoulder', 'leftElbow'],
      ['leftElbow', 'leftWrist'],
      ['neck', 'rightHip'],
      ['rightHip', 'rightKnee'],
      ['rightKnee', 'rightAnkle'],
      ['neck', 'leftHip'],
      ['leftHip', 'leftKnee'],
      ['leftKnee', 'leftAnkle'],
      ['rightHip', 'leftHip'],
    ];

    // Animation variables
    let angle = 0;
    let frame = 0;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = Math.min(canvas.width, canvas.height) / 300;

    // Animation function
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update animation
      angle += 0.01;
      frame += 1;

      // Calculate animated keypoints
      const animatedKeypoints = keypoints.map(kp => {
        // Add some movement to make it look like the figure is breathing/moving slightly
        let offsetX = 0;
        let offsetY = 0;

        if (kp.name.includes('Shoulder') || kp.name.includes('Elbow') || kp.name.includes('Wrist')) {
          offsetY = Math.sin(frame * 0.05) * 2;
        }

        if (kp.name.includes('Knee') || kp.name.includes('Ankle')) {
          offsetX = Math.sin(frame * 0.03) * 1;
        }

        if (kp.name === 'head') {
          offsetX = Math.sin(frame * 0.02) * 3;
          offsetY = Math.sin(frame * 0.03) * 2;
        }

        // Apply 3D rotation (simple Y-axis rotation)
        const rotX = kp.x * Math.cos(angle) - 0 * Math.sin(angle);

        return {
          ...kp,
          screenX: centerX + (rotX + offsetX) * scale,
          screenY: centerY + (kp.y + offsetY) * scale,
          z: kp.x * Math.sin(angle) + 0 * Math.cos(angle) // Z-coordinate for depth
        };
      });

      // Sort keypoints by Z to create depth effect (paint back to front)
      const sortedKeypoints = [...animatedKeypoints].sort((a, b) => a.z - b.z);

      // Draw connections
      connections.forEach(([from, to]) => {
        const fromKp = animatedKeypoints.find(kp => kp.name === from);
        const toKp = animatedKeypoints.find(kp => kp.name === to);

        if (fromKp && toKp) {
          // Calculate gradient color based on z-position
          const avgZ = (fromKp.z + toKp.z) / 2;
          const normalizedZ = (avgZ + 100) / 200; // Normalize to 0-1 range

          // Create gradient from blue to purple
          const r = Math.round(64 + normalizedZ * 128);
          const g = Math.round(64 + normalizedZ * 32);
          const b = Math.round(200 + normalizedZ * 55);

          ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.lineWidth = 3 + normalizedZ * 2;

          ctx.beginPath();
          ctx.moveTo(fromKp.screenX, fromKp.screenY);
          ctx.lineTo(toKp.screenX, toKp.screenY);
          ctx.stroke();
        }
      });

      // Draw keypoints
      sortedKeypoints.forEach(kp => {
        // Calculate color based on z-position
        const normalizedZ = (kp.z + 100) / 200; // Normalize to 0-1 range

        // Create gradient from blue to purple
        const r = Math.round(64 + normalizedZ * 128);
        const g = Math.round(64 + normalizedZ * 32);
        const b = Math.round(200 + normalizedZ * 55);

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;

        // Size based on z-position for depth effect
        const size = 4 + normalizedZ * 4;

        ctx.beginPath();
        ctx.arc(kp.screenX, kp.screenY, size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Add glow effect
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgba(79, 70, 229, 0.5)';

      // Continue animation
      requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-indigo-900 min-h-[90vh] flex items-center">
      {/* Kinetic AI Logo */}
      <motion.div
        className="absolute top-4 left-4 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
      >
        <Link href="/">
          <div className="flex items-center cursor-pointer group">
            {/* Logo removed as requested */}
          </div>
        </Link>
      </motion.div>

      {/* 3D Canvas Background */}
      <div ref={containerRef} className="absolute inset-0 z-0">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
        />
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 z-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-blue-500 opacity-70"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
              scale: [0, 1, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Transform Your Movement with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">AI-Powered</span> Analysis
            </motion.h1>

            <motion.p
              className="text-lg text-blue-100 mb-8 max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Kinetic AI uses advanced pose detection technology to analyze your movement, provide real-time feedback, and help you improve your form and prevent injuries.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link href="/pose-detection-v2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
                    Try Pose Detection
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </motion.div>
                  </Button>
                </motion.div>
              </Link>

              <Link href="/openpose-analyzer">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" variant="outline" className="border-blue-400 text-blue-100 hover:bg-blue-900/20 shadow-lg">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <Play className="mr-2 h-4 w-4" />
                    </motion.div>
                    OpenPose Analyzer
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:block"
          >
            {/* This div will be empty as the 3D animation is in the background */}
            <div className="aspect-square rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 p-8">
              {/* This is just a placeholder to give some visual element on the right side */}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent z-10"></div>
    </div>
  );
};

export default Hero3D;
