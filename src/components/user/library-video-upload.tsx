'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, FileVideo, AlertCircle } from 'lucide-react';
import { videoAPI } from '@/lib/api';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface VideoCategory {
  id: string;
  name: string;
}

export function LibraryVideoUploadForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('beginner');
  const [file, setFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<VideoCategory[]>([
    { id: 'knee', name: 'Knee Rehabilitation' },
    { id: 'shoulder', name: 'Shoulder Exercises' },
    { id: 'back', name: 'Back Strengthening' },
    { id: 'balance', name: 'Balance Training' },
    { id: 'general', name: 'General Fitness' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Check file type
      if (!selectedFile.type.includes('video/')) {
        toast.error('Please select a video file');
        return;
      }

      // Check file size (200MB limit for library videos)
      if (selectedFile.size > 200 * 1024 * 1024) {
        toast.error('File size exceeds 200MB limit');
        return;
      }

      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please select a video file');
      return;
    }

    if (!title) {
      toast.error('Please enter a title');
      return;
    }

    if (!category) {
      toast.error('Please select a category');
      return;
    }

    try {
      setIsLoading(true);
      setIsUploading(true);

      // Create form data
      const formData = new FormData();
      formData.append('video', file);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('level', level);
      formData.append('isLibraryVideo', 'true');

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 500);

      // Upload video to library
      await videoAPI.uploadLibraryVideo(formData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      toast.success('Video uploaded to library successfully');

      // Reset form
      setTitle('');
      setDescription('');
      setCategory('');
      setLevel('beginner');
      setFile(null);

      // Redirect to video library
      setTimeout(() => {
        router.push('/video-library');
      }, 1500);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload video to library');
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1500);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Library Video</CardTitle>
        <CardDescription>
          Upload example videos to the library for patients to reference
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Library Videos</AlertTitle>
          <AlertDescription className="text-blue-700">
            Videos uploaded here will be available to all patients as reference examples. 
            These are separate from patient-specific exercise videos.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Video Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Proper Knee Extension Technique"
              disabled={isLoading}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Exercise Category</Label>
              <Select
                value={category}
                onValueChange={setCategory}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Difficulty Level</Label>
              <Select
                value={level}
                onValueChange={setLevel}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Video Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed instructions and key points for this exercise"
              className="min-h-[100px]"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video">Video File</Label>
            {!file ? (
              <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground mt-1">MP4, MOV, or AVI (max 200MB)</p>
                <Input
                  id="video"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="video/*"
                  className="hidden"
                  disabled={isLoading}
                />
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileVideo className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={removeFile}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Uploading to library...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Uploading...' : 'Upload to Library'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
