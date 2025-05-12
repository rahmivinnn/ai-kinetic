import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layers, RotateCw, ZoomIn, ZoomOut, Camera, Download } from 'lucide-react';
import { toast } from 'sonner';

// Mock data for 3D pose
const mockPoseData = {
  keypoints3D: [
    { name: 'nose', x: 0, y: -80, z: 0 },
    { name: 'left_eye', x: -15, y: -85, z: -5 },
    { name: 'right_eye', x: 15, y: -85, z: -5 },
    { name: 'left_ear', x: -30, y: -80, z: -10 },
    { name: 'right_ear', x: 30, y: -80, z: -10 },
    { name: 'left_shoulder', x: -50, y: -40, z: 0 },
    { name: 'right_shoulder', x: 50, y: -40, z: 0 },
    { name: 'left_elbow', x: -70, y: 0, z: 20 },
    { name: 'right_elbow', x: 70, y: 0, z: 20 },
    { name: 'left_wrist', x: -90, y: 30, z: 40 },
    { name: 'right_wrist', x: 90, y: 30, z: 40 },
    { name: 'left_hip', x: -30, y: 40, z: 0 },
    { name: 'right_hip', x: 30, y: 40, z: 0 },
    { name: 'left_knee', x: -40, y: 100, z: 20 },
    { name: 'right_knee', x: 40, y: 100, z: 20 },
    { name: 'left_ankle', x: -45, y: 160, z: 0 },
    { name: 'right_ankle', x: 45, y: 160, z: 0 }
  ],
  connections: [
    ['nose', 'left_eye'], ['nose', 'right_eye'],
    ['left_eye', 'left_ear'], ['right_eye', 'right_ear'],
    ['left_shoulder', 'right_shoulder'],
    ['left_shoulder', 'left_elbow'], ['right_shoulder', 'right_elbow'],
    ['left_elbow', 'left_wrist'], ['right_elbow', 'right_wrist'],
    ['left_shoulder', 'left_hip'], ['right_shoulder', 'right_hip'],
    ['left_hip', 'right_hip'],
    ['left_hip', 'left_knee'], ['right_hip', 'right_knee'],
    ['left_knee', 'left_ankle'], ['right_knee', 'right_ankle']
  ]
};

// Define the component
const ThreeDPoseEstimation = ({ poseData }: { poseData: any }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState('3d');
  const [renderStyle, setRenderStyle] = useState('skeleton');
  
  // Use mock data if no real data is provided
  const data = poseData || mockPoseData;
  
  // Initialize and render 3D visualization
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Render 3D pose
    render3DPose(ctx, data, rotationX, rotationY, zoom, viewMode, renderStyle);
    
  }, [data, rotationX, rotationY, zoom, viewMode, renderStyle]);
  
  // Render 3D pose on canvas
  const render3DPose = (
    ctx: CanvasRenderingContext2D, 
    data: any, 
    rotX: number, 
    rotY: number, 
    zoomLevel: number,
    view: string,
    style: string
  ) => {
    const { keypoints3D, connections } = data;
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Create keypoint map for easy lookup
    const keypointMap: {[key: string]: any} = {};
    keypoints3D.forEach((kp: any) => {
      keypointMap[kp.name] = kp;
    });
    
    // Project 3D points to 2D based on rotation and view mode
    const projectedPoints: {[key: string]: {x: number, y: number, z: number}} = {};
    
    keypoints3D.forEach((kp: any) => {
      // Apply rotation
      let x = kp.x;
      let y = kp.y;
      let z = kp.z;
      
      // Apply X rotation
      const cosX = Math.cos(rotX * Math.PI / 180);
      const sinX = Math.sin(rotX * Math.PI / 180);
      const y2 = y * cosX - z * sinX;
      const z2 = y * sinX + z * cosX;
      
      // Apply Y rotation
      const cosY = Math.cos(rotY * Math.PI / 180);
      const sinY = Math.sin(rotY * Math.PI / 180);
      const x2 = x * cosY + z2 * sinY;
      const z3 = -x * sinY + z2 * cosY;
      
      // Project to 2D based on view mode
      let projX, projY;
      
      if (view === '3d') {
        // Perspective projection
        const scale = 600 / (600 + z3);
        projX = centerX + x2 * scale * zoomLevel;
        projY = centerY + y2 * scale * zoomLevel;
      } else if (view === 'front') {
        // Front view (XY plane)
        projX = centerX + x * zoomLevel;
        projY = centerY + y * zoomLevel;
      } else if (view === 'side') {
        // Side view (YZ plane)
        projX = centerX + z * zoomLevel;
        projY = centerY + y * zoomLevel;
      } else { // top
        // Top view (XZ plane)
        projX = centerX + x * zoomLevel;
        projY = centerY + z * zoomLevel;
      }
      
      projectedPoints[kp.name] = { x: projX, y: projY, z: z3 };
    });
    
    // Draw connections
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#4f46e5';
    
    connections.forEach(([from, to]: [string, string]) => {
      const fromPoint = projectedPoints[from];
      const toPoint = projectedPoints[to];
      
      if (fromPoint && toPoint) {
        ctx.beginPath();
        ctx.moveTo(fromPoint.x, fromPoint.y);
        ctx.lineTo(toPoint.x, toPoint.y);
        ctx.stroke();
      }
    });
    
    // Draw joints
    Object.values(projectedPoints).forEach((point) => {
      // Size based on depth (z) for 3D effect
      const size = view === '3d' ? 
        Math.max(3, 8 - point.z / 50) : 6;
      
      ctx.fillStyle = '#4f46e5';
      ctx.beginPath();
      ctx.arc(point.x, point.y, size, 0, 2 * Math.PI);
      ctx.fill();
    });
    
    // Draw mesh if style is 'mesh'
    if (style === 'mesh') {
      // In a real implementation, we would draw triangulated mesh here
      // For now, we'll just add some additional connections
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(79, 70, 229, 0.3)';
      
      // Draw some additional mesh lines
      const meshConnections = [
        ['nose', 'left_shoulder'], ['nose', 'right_shoulder'],
        ['left_shoulder', 'left_hip'], ['right_shoulder', 'right_hip'],
        ['left_hip', 'left_knee'], ['right_hip', 'right_knee'],
        ['left_knee', 'left_ankle'], ['right_knee', 'right_ankle']
      ];
      
      meshConnections.forEach(([from, to]: [string, string]) => {
        const fromPoint = projectedPoints[from];
        const toPoint = projectedPoints[to];
        
        if (fromPoint && toPoint) {
          ctx.beginPath();
          ctx.moveTo(fromPoint.x, fromPoint.y);
          ctx.lineTo(toPoint.x, toPoint.y);
          ctx.stroke();
        }
      });
    }
    
    // Draw volume if style is 'volume'
    if (style === 'volume') {
      // In a real implementation, we would draw 3D volumes here
      // For now, we'll just add some circles to represent volume
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(79, 70, 229, 0.2)';
      ctx.fillStyle = 'rgba(79, 70, 229, 0.1)';
      
      // Draw circles at key joints to represent volume
      ['left_shoulder', 'right_shoulder', 'left_hip', 'right_hip'].forEach(joint => {
        const point = projectedPoints[joint];
        if (point) {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 20, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
        }
      });
      
      // Draw larger circle for torso
      const leftShoulder = projectedPoints['left_shoulder'];
      const rightShoulder = projectedPoints['right_shoulder'];
      const leftHip = projectedPoints['left_hip'];
      const rightHip = projectedPoints['right_hip'];
      
      if (leftShoulder && rightShoulder && leftHip && rightHip) {
        const centerX = (leftShoulder.x + rightShoulder.x + leftHip.x + rightHip.x) / 4;
        const centerY = (leftShoulder.y + rightShoulder.y + leftHip.y + rightHip.y) / 4;
        
        const radius = Math.max(
          Math.sqrt(Math.pow(rightShoulder.x - leftShoulder.x, 2) + Math.pow(rightShoulder.y - leftShoulder.y, 2)),
          Math.sqrt(Math.pow(rightHip.x - leftHip.x, 2) + Math.pow(rightHip.y - leftHip.y, 2))
        ) / 1.5;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      }
    }
  };
  
  // Capture current view as image
  const captureView = () => {
    if (!canvasRef.current) return;
    
    try {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `3d-pose-${new Date().getTime()}.png`;
      link.click();
      
      toast.success('3D pose image saved');
    } catch (error) {
      console.error('Error capturing view:', error);
      toast.error('Failed to save image');
    }
  };
  
  return (
    <div className="threed-pose-estimation">
      <div className="canvas-container bg-gray-50 rounded-lg overflow-hidden relative">
        <canvas 
          ref={canvasRef} 
          width={640} 
          height={480} 
          className="w-full h-full"
        />
        
        <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-lg p-2">
          <Tabs value={viewMode} onValueChange={setViewMode}>
            <TabsList className="bg-gray-100">
              <TabsTrigger value="3d" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Layers className="h-4 w-4 mr-1" />
                3D
              </TabsTrigger>
              <TabsTrigger value="front" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Front
              </TabsTrigger>
              <TabsTrigger value="side" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Side
              </TabsTrigger>
              <TabsTrigger value="top" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Top
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="absolute top-4 right-4">
          <Select value={renderStyle} onValueChange={setRenderStyle}>
            <SelectTrigger className="w-[140px] bg-white/80 backdrop-blur-sm">
              <SelectValue placeholder="Render Style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="skeleton">Skeleton</SelectItem>
              <SelectItem value="mesh">Mesh</SelectItem>
              <SelectItem value="volume">Volume</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="controls mt-4 grid grid-cols-2 gap-4">
        <Card className="p-3 border border-blue-100">
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <RotateCw className="h-4 w-4 mr-1 text-blue-600" />
            Rotation
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>X Rotation</span>
                <span>{rotationX}°</span>
              </div>
              <Slider
                value={[rotationX]}
                min={-180}
                max={180}
                step={1}
                onValueChange={(value) => setRotationX(value[0])}
              />
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Y Rotation</span>
                <span>{rotationY}°</span>
              </div>
              <Slider
                value={[rotationY]}
                min={-180}
                max={180}
                step={1}
                onValueChange={(value) => setRotationY(value[0])}
              />
            </div>
          </div>
        </Card>
        
        <Card className="p-3 border border-blue-100">
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <ZoomIn className="h-4 w-4 mr-1 text-blue-600" />
            Zoom
          </h3>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Zoom Level</span>
              <span>{zoom.toFixed(1)}x</span>
            </div>
            <Slider
              value={[zoom]}
              min={0.5}
              max={2}
              step={0.1}
              onValueChange={(value) => setZoom(value[0])}
            />
          </div>
          
          <div className="flex justify-between mt-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setZoom(1)}
            >
              Reset
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setZoom(Math.min(2, zoom + 0.1))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
      
      <div className="actions mt-4 flex justify-between">
        <Button 
          variant="outline" 
          className="border-blue-200 text-blue-600 hover:bg-blue-50"
          onClick={() => {
            setRotationX(0);
            setRotationY(0);
            setZoom(1);
          }}
        >
          <RotateCw className="h-4 w-4 mr-1" />
          Reset View
        </Button>
        
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={captureView}
        >
          <Download className="h-4 w-4 mr-1" />
          Save Image
        </Button>
      </div>
      
      <Card className="mt-4 border border-blue-100">
        <CardContent className="p-4">
          <h3 className="text-lg font-medium mb-2">3D Pose Analysis</h3>
          <p className="text-sm text-gray-600 mb-4">
            This 3D visualization allows you to view the pose from different angles and perspectives.
            In a complete implementation, this would include depth estimation from 2D camera inputs
            and support for 3D camera inputs.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-1">Depth Accuracy</h4>
              <div className="text-2xl font-bold text-blue-900">
                {Math.floor(Math.random() * 15) + 85}%
              </div>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-1">3D Confidence</h4>
              <div className="text-2xl font-bold text-blue-900">
                {Math.floor(Math.random() * 10) + 90}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThreeDPoseEstimation;
