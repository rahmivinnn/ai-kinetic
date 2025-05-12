'use client';

import { useState, useRef, useEffect } from 'react';
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
import { Upload, X, FileVideo } from 'lucide-react';
import { videoAPI, exerciseAPI } from '@/lib/api';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

interface Exercise {
  id: string;
  name: string;
  category: string;
}

export function VideoUploadForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [exerciseId, setExerciseId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const router = useRouter();

  // Fetch exercises on component mount
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setIsLoading(true);
        const data = await exerciseAPI.getUserExercises();
        setExercises(data);
      } catch (error) {
        console.error('Error fetching exercises:', error);
        toast.error('Failed to load exercises');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Check file type
      if (!selectedFile.type.includes('video/')) {
        toast.error('Please select a video file');
        return;
      }

      // Check file size (100MB limit)
      if (selectedFile.size > 100 * 1024 * 1024) {
        toast.error('File size exceeds 100MB limit');
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

    if (!exerciseId) {
      toast.error('Please select an exercise');
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
      formData.append('exerciseId', exerciseId);

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

      // Upload video
      const response = await videoAPI.uploadVideo(formData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      toast.success('Video uploaded successfully');

      // Reset form
      setTitle('');
      setDescription('');
      setExerciseId('');
      setFile(null);

      // Redirect to video library
      setTimeout(() => {
        router.push('/video-library');
      }, 1500);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload video');
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
        <CardTitle>Upload Exercise Video</CardTitle>
        <CardDescription>
          Upload a video of your exercise for AI analysis and therapist feedback
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Video Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Knee Extension Exercise - May 15"
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="exercise">Exercise Type</Label>
            <Select
              value={exerciseId}
              onValueChange={setExerciseId}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an exercise from your plan" />
              </SelectTrigger>
              <SelectContent>
                {exercises.map((exercise) => (
                  <SelectItem key={exercise.id} value={exercise.id}>
                    {exercise.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Notes for your physiotherapist</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe any pain or difficulties you experienced"
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
                <p className="text-xs text-muted-foreground mt-1">MP4, MOV, or AVI (max 100MB)</p>
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
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Uploading...' : 'Upload Video'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
