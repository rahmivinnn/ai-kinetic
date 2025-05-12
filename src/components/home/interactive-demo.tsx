"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Pause, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2,
  Camera,
  Video,
  Download
} from 'lucide-react';

const InteractiveDemo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('skeleton');
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  
  // Initialize the demo
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
    
    // Define the skeleton keypoints
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
    let frame = 0;
    
    // Animation function
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update animation
      frame += isPlaying ? 1 : 0;
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const scale = Math.min(canvas.width, canvas.height) / 300 * zoom;
      
      // Calculate animated keypoints with rotation
      const animatedKeypoints = keypoints.map(kp => {
        // Add some movement to make it look like the figure is doing an exercise
        let offsetX = 0;
        let offsetY = 0;
        
        if (isPlaying) {
          if (kp.name.includes('Shoulder') || kp.name.includes('Elbow') || kp.name.includes('Wrist')) {
            // Simulate arm movement
            offsetY = Math.sin(frame * 0.05) * 15;
            offsetX = Math.cos(frame * 0.05) * 5;
          }
          
          if (kp.name.includes('Knee') || kp.name.includes('Ankle')) {
            // Simulate leg movement
            offsetY = Math.sin(frame * 0.05) * 10;
            offsetX = Math.cos(frame * 0.05) * 3;
          }
          
          if (kp.name === 'head') {
            offsetX = Math.sin(frame * 0.02) * 3;
            offsetY = Math.sin(frame * 0.03) * 2;
          }
        }
        
        // Apply 3D rotation
        const rotX = kp.x * Math.cos(rotation.y * Math.PI / 180) - 0 * Math.sin(rotation.y * Math.PI / 180);
        const rotY = kp.y * Math.cos(rotation.x * Math.PI / 180) - 0 * Math.sin(rotation.x * Math.PI / 180);
        
        return {
          ...kp,
          screenX: centerX + (rotX + offsetX) * scale,
          screenY: centerY + (rotY + offsetY) * scale,
          z: kp.x * Math.sin(rotation.y * Math.PI / 180) + kp.y * Math.sin(rotation.x * Math.PI / 180) // Z-coordinate for depth
        };
      });
      
      // Sort keypoints by Z to create depth effect (paint back to front)
      const sortedKeypoints = [...animatedKeypoints].sort((a, b) => a.z - b.z);
      
      // Draw based on active tab
      if (activeTab === 'skeleton' || activeTab === 'both') {
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
      }
      
      if (activeTab === 'points' || activeTab === 'both') {
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
      }
      
      if (activeTab === 'mesh') {
        // Draw a simplified mesh
        ctx.fillStyle = 'rgba(79, 70, 229, 0.2)';
        ctx.strokeStyle = 'rgba(79, 70, 229, 0.8)';
        ctx.lineWidth = 1;
        
        // Draw torso
        const neck = animatedKeypoints.find(kp => kp.name === 'neck');
        const leftShoulder = animatedKeypoints.find(kp => kp.name === 'leftShoulder');
        const rightShoulder = animatedKeypoints.find(kp => kp.name === 'rightShoulder');
        const leftHip = animatedKeypoints.find(kp => kp.name === 'leftHip');
        const rightHip = animatedKeypoints.find(kp => kp.name === 'rightHip');
        
        if (neck && leftShoulder && rightShoulder && leftHip && rightHip) {
          ctx.beginPath();
          ctx.moveTo(neck.screenX, neck.screenY);
          ctx.lineTo(leftShoulder.screenX, leftShoulder.screenY);
          ctx.lineTo(leftHip.screenX, leftHip.screenY);
          ctx.lineTo(rightHip.screenX, rightHip.screenY);
          ctx.lineTo(rightShoulder.screenX, rightShoulder.screenY);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
        
        // Draw limbs as cylinders (simplified as rectangles)
        const drawLimb = (from: any, to: any, width: number) => {
          if (!from || !to) return;
          
          const angle = Math.atan2(to.screenY - from.screenY, to.screenX - from.screenX);
          const length = Math.sqrt(
            Math.pow(to.screenX - from.screenX, 2) + 
            Math.pow(to.screenY - from.screenY, 2)
          );
          
          ctx.save();
          ctx.translate(from.screenX, from.screenY);
          ctx.rotate(angle);
          
          ctx.beginPath();
          ctx.roundRect(0, -width/2, length, width, width/2);
          ctx.fill();
          ctx.stroke();
          
          ctx.restore();
        };
        
        // Draw arms
        const leftElbow = animatedKeypoints.find(kp => kp.name === 'leftElbow');
        const leftWrist = animatedKeypoints.find(kp => kp.name === 'leftWrist');
        const rightElbow = animatedKeypoints.find(kp => kp.name === 'rightElbow');
        const rightWrist = animatedKeypoints.find(kp => kp.name === 'rightWrist');
        
        drawLimb(leftShoulder, leftElbow, 10);
        drawLimb(leftElbow, leftWrist, 8);
        drawLimb(rightShoulder, rightElbow, 10);
        drawLimb(rightElbow, rightWrist, 8);
        
        // Draw legs
        const leftKnee = animatedKeypoints.find(kp => kp.name === 'leftKnee');
        const leftAnkle = animatedKeypoints.find(kp => kp.name === 'leftAnkle');
        const rightKnee = animatedKeypoints.find(kp => kp.name === 'rightKnee');
        const rightAnkle = animatedKeypoints.find(kp => kp.name === 'rightAnkle');
        
        drawLimb(leftHip, leftKnee, 12);
        drawLimb(leftKnee, leftAnkle, 10);
        drawLimb(rightHip, rightKnee, 12);
        drawLimb(rightKnee, rightAnkle, 10);
        
        // Draw head
        const head = animatedKeypoints.find(kp => kp.name === 'head');
        if (head) {
          ctx.beginPath();
          ctx.arc(head.screenX, head.screenY, 15, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
      }
      
      // Add glow effect
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgba(79, 70, 229, 0.5)';
      
      // Continue animation
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isPlaying, activeTab, rotation, zoom]);
  
  // Toggle play/pause
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };
  
  // Reset rotation
  const resetRotation = () => {
    setRotation({ x: 0, y: 0 });
  };
  
  // Zoom controls
  const zoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };
  
  const zoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    
    if (!isFullscreen && containerRef.current) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };
  
  return (
    <div className="py-20 bg-gradient-to-b from-slate-900 to-indigo-900">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Interactive <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">3D Demo</span>
          </h2>
          <p className="text-lg text-blue-100 max-w-3xl mx-auto">
            Experience our pose detection technology with this interactive demo. Rotate, zoom, and explore different visualization modes.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <div 
              ref={containerRef}
              className={`relative bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-indigo-500/30 ${isFullscreen ? 'fixed inset-0 z-50' : 'aspect-video'}`}
            >
              <canvas 
                ref={canvasRef} 
                className="w-full h-full"
                onMouseMove={(e) => {
                  if (e.buttons === 1) { // Left mouse button is pressed
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    setRotation({
                      x: ((y - centerY) / centerY) * 30,
                      y: ((x - centerX) / centerX) * 30
                    });
                  }
                }}
              />
              
              <div className="absolute top-4 right-4 flex space-x-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="h-8 w-8 p-0 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
                
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="h-8 w-8 p-0 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                  onClick={togglePlayback}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </div>
              
              <div className="absolute bottom-4 left-4 right-4 flex justify-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-1">
                  <p className="text-xs text-white">Drag to rotate • Scroll to zoom</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-indigo-500/30 p-6">
              <h3 className="text-xl font-bold mb-4 text-white">Controls</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-blue-100 mb-2 block">Visualization Mode</label>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="bg-slate-800/50 border border-indigo-500/30">
                      <TabsTrigger value="skeleton" className="data-[state=active]:bg-indigo-600">Skeleton</TabsTrigger>
                      <TabsTrigger value="points" className="data-[state=active]:bg-indigo-600">Points</TabsTrigger>
                      <TabsTrigger value="mesh" className="data-[state=active]:bg-indigo-600">Mesh</TabsTrigger>
                      <TabsTrigger value="both" className="data-[state=active]:bg-indigo-600">Both</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-blue-100 mb-2 block">Rotation</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-blue-200 mb-1">X: {rotation.x.toFixed(1)}°</p>
                      <input 
                        type="range" 
                        min="-30" 
                        max="30" 
                        value={rotation.x}
                        onChange={(e) => setRotation(prev => ({ ...prev, x: parseFloat(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-blue-200 mb-1">Y: {rotation.y.toFixed(1)}°</p>
                      <input 
                        type="range" 
                        min="-30" 
                        max="30" 
                        value={rotation.y}
                        onChange={(e) => setRotation(prev => ({ ...prev, y: parseFloat(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={resetRotation}
                    className="mt-2 w-full border-blue-400 text-blue-100 hover:bg-blue-900/20"
                  >
                    <RotateCw className="h-3 w-3 mr-2" />
                    Reset Rotation
                  </Button>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-blue-100 mb-2 block">Zoom: {(zoom * 100).toFixed(0)}%</label>
                  <div className="flex items-center">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={zoomOut}
                      disabled={zoom <= 0.5}
                      className="border-blue-400 text-blue-100 hover:bg-blue-900/20"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="2" 
                      step="0.1"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="flex-1 mx-2"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={zoomIn}
                      disabled={zoom >= 2}
                      className="border-blue-400 text-blue-100 hover:bg-blue-900/20"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-indigo-500/30">
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      <Camera className="h-4 w-4 mr-2" />
                      Try with Camera
                    </Button>
                    <Button variant="outline" className="border-blue-400 text-blue-100 hover:bg-blue-900/20">
                      <Video className="h-4 w-4 mr-2" />
                      Upload Video
                    </Button>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4 w-full border-blue-400 text-blue-100 hover:bg-blue-900/20"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download as GIF
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveDemo;
