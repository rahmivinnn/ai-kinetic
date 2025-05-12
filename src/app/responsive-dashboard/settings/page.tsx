'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Smartphone, 
  Globe, 
  Moon, 
  Sun, 
  Save, 
  RotateCcw, 
  LogOut, 
  Camera, 
  Video, 
  Sliders, 
  Database, 
  Lock, 
  Eye, 
  EyeOff
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Account settings
  const [accountSettings, setAccountSettings] = useState({
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    language: 'english',
    timezone: 'utc-8'
  });
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    sessionReminders: true,
    marketingEmails: false,
    newFeatures: true
  });
  
  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    dataSharing: true,
    activityTracking: true,
    anonymousAnalytics: true
  });
  
  // Device settings
  const [deviceSettings, setDeviceSettings] = useState({
    cameraAccess: true,
    microphoneAccess: true,
    storageAccess: true,
    backgroundProcessing: false,
    highPerformanceMode: true
  });
  
  // Pose detection settings
  const [poseDetectionSettings, setposeDetectionSettings] = useState({
    confidenceThreshold: 50,
    detectionFPS: 15,
    showSkeleton: true,
    showKeypoints: true,
    modelType: 'mediapipe',
    multiPersonDetection: true
  });
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Settings saved successfully');
    }, 1000);
  };
  
  // Reset settings to defaults
  const resetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      setAccountSettings({
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '(555) 123-4567',
        language: 'english',
        timezone: 'utc-8'
      });
      
      setNotificationSettings({
        emailNotifications: true,
        pushNotifications: true,
        sessionReminders: true,
        marketingEmails: false,
        newFeatures: true
      });
      
      setPrivacySettings({
        profileVisibility: 'public',
        dataSharing: true,
        activityTracking: true,
        anonymousAnalytics: true
      });
      
      setDeviceSettings({
        cameraAccess: true,
        microphoneAccess: true,
        storageAccess: true,
        backgroundProcessing: false,
        highPerformanceMode: true
      });
      
      setposeDetectionSettings({
        confidenceThreshold: 50,
        detectionFPS: 15,
        showSkeleton: true,
        showKeypoints: true,
        modelType: 'mediapipe',
        multiPersonDetection: true
      });
      
      toast.info('Settings reset to default');
    }
  };
  
  return (
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground mt-1">Configure your account preferences</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="md:col-span-1">
            <CardContent className="p-4">
              <Tabs 
                orientation="vertical" 
                defaultValue="account" 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="flex flex-col h-auto bg-transparent space-y-1">
                  <TabsTrigger 
                    value="account" 
                    className="justify-start w-full data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Account
                  </TabsTrigger>
                  <TabsTrigger 
                    value="notifications" 
                    className="justify-start w-full data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger 
                    value="privacy" 
                    className="justify-start w-full data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Privacy
                  </TabsTrigger>
                  <TabsTrigger 
                    value="devices" 
                    className="justify-start w-full data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800"
                  >
                    <Smartphone className="h-4 w-4 mr-2" />
                    Devices
                  </TabsTrigger>
                  <TabsTrigger 
                    value="pose-detection" 
                    className="justify-start w-full data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Pose Detection
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-3">
            <CardHeader className="pb-2">
              <CardTitle>
                {activeTab === 'account' && (
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-600" />
                    Account Settings
                  </div>
                )}
                {activeTab === 'notifications' && (
                  <div className="flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-blue-600" />
                    Notification Preferences
                  </div>
                )}
                {activeTab === 'privacy' && (
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-blue-600" />
                    Privacy Settings
                  </div>
                )}
                {activeTab === 'devices' && (
                  <div className="flex items-center">
                    <Smartphone className="h-5 w-5 mr-2 text-blue-600" />
                    Device Settings
                  </div>
                )}
                {activeTab === 'pose-detection' && (
                  <div className="flex items-center">
                    <Camera className="h-5 w-5 mr-2 text-blue-600" />
                    Pose Detection Settings
                  </div>
                )}
              </CardTitle>
              <CardDescription>
                {activeTab === 'account' && "Manage your account information and preferences"}
                {activeTab === 'notifications' && "Control how you receive notifications"}
                {activeTab === 'privacy' && "Manage your privacy and data sharing preferences"}
                {activeTab === 'devices' && "Configure device access and permissions"}
                {activeTab === 'pose-detection' && "Customize pose detection behavior and performance"}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-6">
              <form onSubmit={handleSubmit}>
                <TabsContent value="account" className="mt-0 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={accountSettings.name}
                        onChange={(e) => setAccountSettings({...accountSettings, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={accountSettings.email}
                        onChange={(e) => setAccountSettings({...accountSettings, email: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        value={accountSettings.phone}
                        onChange={(e) => setAccountSettings({...accountSettings, phone: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select 
                        value={accountSettings.language}
                        onValueChange={(value) => setAccountSettings({...accountSettings, language: value})}
                      >
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                          <SelectItem value="german">German</SelectItem>
                          <SelectItem value="japanese">Japanese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select 
                        value={accountSettings.timezone}
                        onValueChange={(value) => setAccountSettings({...accountSettings, timezone: value})}
                      >
                        <SelectTrigger id="timezone">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="utc-12">UTC-12:00</SelectItem>
                          <SelectItem value="utc-8">UTC-08:00 (Pacific Time)</SelectItem>
                          <SelectItem value="utc-5">UTC-05:00 (Eastern Time)</SelectItem>
                          <SelectItem value="utc+0">UTC+00:00 (GMT)</SelectItem>
                          <SelectItem value="utc+1">UTC+01:00 (Central European Time)</SelectItem>
                          <SelectItem value="utc+8">UTC+08:00 (China Standard Time)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="theme">Theme</Label>
                      <div className="flex items-center space-x-2">
                        <Sun className="h-4 w-4 text-yellow-500" />
                        <Switch 
                          id="theme"
                          checked={isDarkMode}
                          onCheckedChange={setIsDarkMode}
                        />
                        <Moon className="h-4 w-4 text-blue-700" />
                        <span className="text-sm text-muted-foreground ml-2">
                          {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                        </span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="notifications" className="mt-0 space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive email notifications about your account</p>
                      </div>
                      <Switch 
                        id="email-notifications"
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(value) => setNotificationSettings({...notificationSettings, emailNotifications: value})}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="push-notifications" className="font-medium">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive push notifications on your devices</p>
                      </div>
                      <Switch 
                        id="push-notifications"
                        checked={notificationSettings.pushNotifications}
                        onCheckedChange={(value) => setNotificationSettings({...notificationSettings, pushNotifications: value})}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="session-reminders" className="font-medium">Session Reminders</Label>
                        <p className="text-sm text-muted-foreground">Get reminders about upcoming sessions</p>
                      </div>
                      <Switch 
                        id="session-reminders"
                        checked={notificationSettings.sessionReminders}
                        onCheckedChange={(value) => setNotificationSettings({...notificationSettings, sessionReminders: value})}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="marketing-emails" className="font-medium">Marketing Emails</Label>
                        <p className="text-sm text-muted-foreground">Receive promotional emails and offers</p>
                      </div>
                      <Switch 
                        id="marketing-emails"
                        checked={notificationSettings.marketingEmails}
                        onCheckedChange={(value) => setNotificationSettings({...notificationSettings, marketingEmails: value})}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="new-features" className="font-medium">New Features</Label>
                        <p className="text-sm text-muted-foreground">Get notified about new features and updates</p>
                      </div>
                      <Switch 
                        id="new-features"
                        checked={notificationSettings.newFeatures}
                        onCheckedChange={(value) => setNotificationSettings({...notificationSettings, newFeatures: value})}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="privacy" className="mt-0 space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="profile-visibility" className="font-medium">Profile Visibility</Label>
                      <p className="text-sm text-muted-foreground">Control who can see your profile information</p>
                      <Select 
                        value={privacySettings.profileVisibility}
                        onValueChange={(value) => setPrivacySettings({...privacySettings, profileVisibility: value})}
                      >
                        <SelectTrigger id="profile-visibility">
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="contacts">Contacts Only</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="data-sharing" className="font-medium">Data Sharing</Label>
                        <p className="text-sm text-muted-foreground">Allow sharing your data with trusted partners</p>
                      </div>
                      <Switch 
                        id="data-sharing"
                        checked={privacySettings.dataSharing}
                        onCheckedChange={(value) => setPrivacySettings({...privacySettings, dataSharing: value})}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="activity-tracking" className="font-medium">Activity Tracking</Label>
                        <p className="text-sm text-muted-foreground">Allow tracking your activity for better recommendations</p>
                      </div>
                      <Switch 
                        id="activity-tracking"
                        checked={privacySettings.activityTracking}
                        onCheckedChange={(value) => setPrivacySettings({...privacySettings, activityTracking: value})}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="anonymous-analytics" className="font-medium">Anonymous Analytics</Label>
                        <p className="text-sm text-muted-foreground">Share anonymous usage data to improve the service</p>
                      </div>
                      <Switch 
                        id="anonymous-analytics"
                        checked={privacySettings.anonymousAnalytics}
                        onCheckedChange={(value) => setPrivacySettings({...privacySettings, anonymousAnalytics: value})}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="devices" className="mt-0 space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="camera-access" className="font-medium">Camera Access</Label>
                        <p className="text-sm text-muted-foreground">Allow access to your device's camera</p>
                      </div>
                      <Switch 
                        id="camera-access"
                        checked={deviceSettings.cameraAccess}
                        onCheckedChange={(value) => setDeviceSettings({...deviceSettings, cameraAccess: value})}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="microphone-access" className="font-medium">Microphone Access</Label>
                        <p className="text-sm text-muted-foreground">Allow access to your device's microphone</p>
                      </div>
                      <Switch 
                        id="microphone-access"
                        checked={deviceSettings.microphoneAccess}
                        onCheckedChange={(value) => setDeviceSettings({...deviceSettings, microphoneAccess: value})}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="storage-access" className="font-medium">Storage Access</Label>
                        <p className="text-sm text-muted-foreground">Allow access to your device's storage</p>
                      </div>
                      <Switch 
                        id="storage-access"
                        checked={deviceSettings.storageAccess}
                        onCheckedChange={(value) => setDeviceSettings({...deviceSettings, storageAccess: value})}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="background-processing" className="font-medium">Background Processing</Label>
                        <p className="text-sm text-muted-foreground">Allow the app to process data in the background</p>
                      </div>
                      <Switch 
                        id="background-processing"
                        checked={deviceSettings.backgroundProcessing}
                        onCheckedChange={(value) => setDeviceSettings({...deviceSettings, backgroundProcessing: value})}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="high-performance" className="font-medium">High Performance Mode</Label>
                        <p className="text-sm text-muted-foreground">Enable high performance mode for better analysis</p>
                      </div>
                      <Switch 
                        id="high-performance"
                        checked={deviceSettings.highPerformanceMode}
                        onCheckedChange={(value) => setDeviceSettings({...deviceSettings, highPerformanceMode: value})}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="pose-detection" className="mt-0 space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="confidence-threshold" className="font-medium">Confidence Threshold</Label>
                        <span className="text-sm">{poseDetectionSettings.confidenceThreshold}%</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Minimum confidence level for keypoint detection</p>
                      <input 
                        type="range"
                        id="confidence-threshold"
                        min={0}
                        max={100}
                        step={1}
                        value={poseDetectionSettings.confidenceThreshold}
                        onChange={(e) => setposeDetectionSettings({
                          ...poseDetectionSettings, 
                          confidenceThreshold: parseInt(e.target.value)
                        })}
                        className="w-full"
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="detection-fps" className="font-medium">Detection FPS</Label>
                        <span className="text-sm">{poseDetectionSettings.detectionFPS}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Frames per second for pose detection</p>
                      <input 
                        type="range"
                        id="detection-fps"
                        min={1}
                        max={30}
                        step={1}
                        value={poseDetectionSettings.detectionFPS}
                        onChange={(e) => setposeDetectionSettings({
                          ...poseDetectionSettings, 
                          detectionFPS: parseInt(e.target.value)
                        })}
                        className="w-full"
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="show-skeleton" className="font-medium">Show Skeleton</Label>
                        <p className="text-sm text-muted-foreground">Display skeleton lines between keypoints</p>
                      </div>
                      <Switch 
                        id="show-skeleton"
                        checked={poseDetectionSettings.showSkeleton}
                        onCheckedChange={(value) => setposeDetectionSettings({...poseDetectionSettings, showSkeleton: value})}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="show-keypoints" className="font-medium">Show Keypoints</Label>
                        <p className="text-sm text-muted-foreground">Display keypoint markers on detected joints</p>
                      </div>
                      <Switch 
                        id="show-keypoints"
                        checked={poseDetectionSettings.showKeypoints}
                        onCheckedChange={(value) => setposeDetectionSettings({...poseDetectionSettings, showKeypoints: value})}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label htmlFor="model-type" className="font-medium">Model Type</Label>
                      <p className="text-sm text-muted-foreground">Select the pose detection model to use</p>
                      <Select 
                        value={poseDetectionSettings.modelType}
                        onValueChange={(value) => setposeDetectionSettings({...poseDetectionSettings, modelType: value})}
                      >
                        <SelectTrigger id="model-type">
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mediapipe">MediaPipe</SelectItem>
                          <SelectItem value="openpose">OpenPose</SelectItem>
                          <SelectItem value="blazepose">BlazePose</SelectItem>
                          <SelectItem value="movenet">MoveNet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="multi-person" className="font-medium">Multi-Person Detection</Label>
                        <p className="text-sm text-muted-foreground">Enable detection of multiple people</p>
                      </div>
                      <Switch 
                        id="multi-person"
                        checked={poseDetectionSettings.multiPersonDetection}
                        onCheckedChange={(value) => setposeDetectionSettings({...poseDetectionSettings, multiPersonDetection: value})}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <div className="flex justify-between mt-6">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={resetSettings}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset to Default
                  </Button>
                  
                  <div className="flex space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                    
                    <Button 
                      type="submit" 
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
