"use client";

import React from 'react';
import Hero3D from '@/components/home/hero-3d';
import Features3DSection from '@/components/home/features-3d-section';
import InteractiveDemo from '@/components/home/interactive-demo';
import Testimonials3D from '@/components/home/testimonials-3d';
import CTA3D from '@/components/home/cta-3d';

export default function EnhancedHomePage() {
  return (
    <div className="enhanced-home">
      {/* 3D Hero Section */}
      <Hero3D />
      
      {/* 3D Features Section */}
      <Features3DSection />
      
      {/* Interactive 3D Demo */}
      <InteractiveDemo />
      
      {/* 3D Testimonials */}
      <Testimonials3D />
      
      {/* 3D Call to Action */}
      <CTA3D />
    </div>
  );
}
