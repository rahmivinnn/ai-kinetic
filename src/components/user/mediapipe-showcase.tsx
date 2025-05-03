'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Image from 'next/image';

export function MediaPipeShowcase() {
  const [activeTab, setActiveTab] = useState('pose');
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="pose" className="text-xs sm:text-sm">
              Pose Detection
            </TabsTrigger>
            <TabsTrigger value="landmarks" className="text-xs sm:text-sm">
              Body Landmarks
            </TabsTrigger>
            <TabsTrigger value="analysis" className="text-xs sm:text-sm">
              Motion Analysis
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pose" className="mt-0">
            <div className="space-y-4">
              <div className="aspect-[16/9] relative overflow-hidden rounded-lg">
                <Image
                  src="https://developers.google.com/static/mediapipe/images/solutions/pose_tracking_example.png"
                  alt="MediaPipe Pose Detection"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="aspect-square relative overflow-hidden rounded-lg">
                  <Image
                    src="https://developers.google.com/static/mediapipe/images/solutions/pose_classification_example.png"
                    alt="Pose Classification"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="aspect-square relative overflow-hidden rounded-lg">
                  <Image
                    src="https://developers.google.com/static/mediapipe/images/solutions/pose-world-landmarks.jpg"
                    alt="3D Pose Landmarks"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                MediaPipe Pose is a high-fidelity body pose tracking solution that detects 33 landmarks on the human body in real-time. 
                It works on single frames with no need for specialized hardware acceleration.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="landmarks" className="mt-0">
            <div className="space-y-4">
              <div className="aspect-[16/9] relative overflow-hidden rounded-lg bg-blue-50">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="80%" height="80%" viewBox="0 0 1000 600" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Human body outline */}
                    <path d="M500 100 Q550 120 560 150 Q570 180 570 200 L570 300 L530 400 L530 500 L550 600" stroke="#CCCCCC" strokeWidth="2" fill="none" />
                    <path d="M500 100 Q450 120 440 150 Q430 180 430 200 L430 300 L470 400 L470 500 L450 600" stroke="#CCCCCC" strokeWidth="2" fill="none" />
                    <path d="M570 200 L650 280" stroke="#CCCCCC" strokeWidth="2" fill="none" />
                    <path d="M430 200 L350 280" stroke="#CCCCCC" strokeWidth="2" fill="none" />
                    <path d="M650 280 L700 380" stroke="#CCCCCC" strokeWidth="2" fill="none" />
                    <path d="M350 280 L300 380" stroke="#CCCCCC" strokeWidth="2" fill="none" />
                    
                    {/* Face landmarks */}
                    <circle cx="500" cy="100" r="8" fill="#FF5733" />
                    <text x="510" y="95" fontSize="12" fill="#FF5733">0: Nose</text>
                    
                    <circle cx="485" cy="90" r="5" fill="#FF5733" />
                    <text x="455" y="85" fontSize="12" fill="#FF5733">1: Left Eye</text>
                    
                    <circle cx="515" cy="90" r="5" fill="#FF5733" />
                    <text x="525" y="85" fontSize="12" fill="#FF5733">2: Right Eye</text>
                    
                    <circle cx="470" cy="95" r="5" fill="#FF5733" />
                    <text x="430" y="100" fontSize="12" fill="#FF5733">3: Left Ear</text>
                    
                    <circle cx="530" cy="95" r="5" fill="#FF5733" />
                    <text x="540" y="100" fontSize="12" fill="#FF5733">4: Right Ear</text>
                    
                    {/* Shoulder landmarks */}
                    <circle cx="430" cy="200" r="8" fill="#33A8FF" />
                    <text x="390" y="195" fontSize="12" fill="#33A8FF">11: Left Shoulder</text>
                    
                    <circle cx="570" cy="200" r="8" fill="#33A8FF" />
                    <text x="580" y="195" fontSize="12" fill="#33A8FF">12: Right Shoulder</text>
                    
                    {/* Elbow landmarks */}
                    <circle cx="350" cy="280" r="8" fill="#33FF57" />
                    <text x="310" y="275" fontSize="12" fill="#33FF57">13: Left Elbow</text>
                    
                    <circle cx="650" cy="280" r="8" fill="#33FF57" />
                    <text x="660" y="275" fontSize="12" fill="#33FF57">14: Right Elbow</text>
                    
                    {/* Wrist landmarks */}
                    <circle cx="300" cy="380" r="8" fill="#33FF57" />
                    <text x="260" y="375" fontSize="12" fill="#33FF57">15: Left Wrist</text>
                    
                    <circle cx="700" cy="380" r="8" fill="#33FF57" />
                    <text x="710" y="375" fontSize="12" fill="#33FF57">16: Right Wrist</text>
                    
                    {/* Hip landmarks */}
                    <circle cx="470" cy="400" r="8" fill="#33A8FF" />
                    <text x="430" y="395" fontSize="12" fill="#33A8FF">23: Left Hip</text>
                    
                    <circle cx="530" cy="400" r="8" fill="#33A8FF" />
                    <text x="540" y="395" fontSize="12" fill="#33A8FF">24: Right Hip</text>
                    
                    {/* Knee landmarks */}
                    <circle cx="470" cy="500" r="8" fill="#FF33A8" />
                    <text x="430" y="495" fontSize="12" fill="#FF33A8">25: Left Knee</text>
                    
                    <circle cx="530" cy="500" r="8" fill="#FF33A8" />
                    <text x="540" y="495" fontSize="12" fill="#FF33A8">26: Right Knee</text>
                    
                    {/* Ankle landmarks */}
                    <circle cx="450" cy="600" r="8" fill="#FF33A8" />
                    <text x="410" y="595" fontSize="12" fill="#FF33A8">27: Left Ankle</text>
                    
                    <circle cx="550" cy="600" r="8" fill="#FF33A8" />
                    <text x="560" y="595" fontSize="12" fill="#FF33A8">28: Right Ankle</text>
                  </svg>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2 bg-[#FF5733]/10 rounded-lg">
                  <h4 className="text-xs font-medium text-[#FF5733]">Face (5)</h4>
                  <p className="text-xs text-muted-foreground">Nose, eyes, ears</p>
                </div>
                <div className="p-2 bg-[#33A8FF]/10 rounded-lg">
                  <h4 className="text-xs font-medium text-[#33A8FF]">Torso (4)</h4>
                  <p className="text-xs text-muted-foreground">Shoulders, hips</p>
                </div>
                <div className="p-2 bg-[#33FF57]/10 rounded-lg">
                  <h4 className="text-xs font-medium text-[#33FF57]">Arms (10)</h4>
                  <p className="text-xs text-muted-foreground">Elbows, wrists, hands</p>
                </div>
                <div className="p-2 bg-[#FF33A8]/10 rounded-lg">
                  <h4 className="text-xs font-medium text-[#FF33A8]">Legs (14)</h4>
                  <p className="text-xs text-muted-foreground">Knees, ankles, feet</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                MediaPipe Pose detects 33 landmarks on the human body, providing precise tracking of joints and body parts.
                These landmarks enable accurate analysis of posture, movement, and exercise form.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="analysis" className="mt-0">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="aspect-square relative overflow-hidden rounded-lg">
                  <Image
                    src="https://developers.google.com/static/mediapipe/images/solutions/pose_angles.png"
                    alt="Joint Angle Analysis"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2">
                    Joint Angle Analysis
                  </div>
                </div>
                <div className="aspect-square relative overflow-hidden rounded-lg">
                  <Image
                    src="https://developers.google.com/static/mediapipe/images/solutions/pose_classification_pushups.gif"
                    alt="Exercise Classification"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2">
                    Exercise Classification
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-700">Biomechanical Analysis</h4>
                  <ul className="mt-1 space-y-1">
                    <li className="text-xs flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                      Joint angle measurement
                    </li>
                    <li className="text-xs flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                      Range of motion tracking
                    </li>
                    <li className="text-xs flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                      Movement symmetry detection
                    </li>
                  </ul>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="text-sm font-medium text-green-700">Form Correction</h4>
                  <ul className="mt-1 space-y-1">
                    <li className="text-xs flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                      Posture alignment feedback
                    </li>
                    <li className="text-xs flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                      Form deviation detection
                    </li>
                    <li className="text-xs flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                      Real-time correction guidance
                    </li>
                  </ul>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                MediaPipe enables sophisticated motion analysis by tracking landmarks over time. This allows for precise 
                measurement of joint angles, movement patterns, and exercise form, providing valuable feedback for 
                physical therapy and fitness applications.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
