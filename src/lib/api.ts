import axios from 'axios';

// Mock data flag - set to true to use mock data instead of API calls
const USE_MOCK_DATA = true;

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Mock data for development
const mockData = {
  appointments: [
    {
      id: '1',
      startTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      endTime: new Date(Date.now() + 86400000 + 3600000).toISOString(), // Tomorrow + 1 hour
      status: 'scheduled',
      type: 'video',
      notes: 'Follow-up on knee rehabilitation progress',
      physiotherapist: {
        id: '1',
        firstName: 'John',
        lastName: 'Johnson',
        email: 'dr.johnson@example.com',
        role: 'physiotherapist',
        specialization: 'Orthopedic Rehabilitation',
        profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop'
      },
      patient: {
        id: '2',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        role: 'patient'
      }
    },
    {
      id: '2',
      startTime: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
      endTime: new Date(Date.now() + 172800000 + 3600000).toISOString(), // Day after tomorrow + 1 hour
      status: 'scheduled',
      type: 'in-person',
      notes: 'Comprehensive assessment and plan adjustment',
      physiotherapist: {
        id: '3',
        firstName: 'Sarah',
        lastName: 'Smith',
        email: 'dr.smith@example.com',
        role: 'physiotherapist',
        specialization: 'Sports Rehabilitation',
        profileImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=50&h=50&fit=crop'
      },
      patient: {
        id: '2',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        role: 'patient'
      }
    }
  ],
  exercises: [
    {
      id: '1',
      name: 'Knee Extension',
      description: 'Strengthen quadriceps muscles',
      category: 'strength',
      difficulty: 'beginner',
      targetArea: 'knee',
      instructions: 'Sit on a chair with your back straight. Slowly extend your right leg until it\'s parallel to the floor. Hold for 5 seconds, then slowly lower it back down. Repeat with the left leg.',
      demoVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop',
      sets: 3,
      reps: 10,
      frequency: 'Daily',
      duration: 5,
      notes: 'Focus on controlled movements',
      treatmentPlanId: '1'
    },
    {
      id: '2',
      name: 'Hamstring Curl',
      description: 'Strengthen hamstring muscles',
      category: 'strength',
      difficulty: 'intermediate',
      targetArea: 'knee',
      instructions: 'Lie face down on a mat. Slowly bend your right knee, bringing your heel toward your buttocks. Hold for 3 seconds, then slowly lower it back down. Repeat with the left leg.',
      demoVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&h=300&fit=crop',
      sets: 3,
      reps: 8,
      frequency: 'Daily',
      duration: 3,
      notes: 'Avoid arching your back',
      treatmentPlanId: '1'
    },
    {
      id: '3',
      name: 'Balance Training',
      description: 'Improve stability and proprioception',
      category: 'balance',
      difficulty: 'beginner',
      targetArea: 'full body',
      instructions: 'Stand on one leg with your knee slightly bent. Try to maintain your balance for 30 seconds. Switch to the other leg and repeat.',
      demoVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&h=300&fit=crop',
      sets: 2,
      reps: 5,
      frequency: 'Daily',
      duration: 30,
      notes: 'Use a wall or chair for support if needed',
      treatmentPlanId: '1'
    }
  ],
  videos: [
    {
      id: '1',
      title: 'Knee Extension Exercise',
      description: 'My first attempt at the knee extension exercise',
      url: 'https://example.com/videos/1',
      thumbnailUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop',
      uploadDate: '2023-05-16T10:30:00Z',
      status: 'pending',
      aiScore: null,
      patientId: '2',
      exerciseId: '1'
    },
    {
      id: '2',
      title: 'Hamstring Curl Progress',
      description: 'Week 2 of hamstring curl exercises',
      url: 'https://example.com/videos/2',
      thumbnailUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&h=300&fit=crop',
      uploadDate: '2023-05-14T14:45:00Z',
      status: 'reviewed',
      aiScore: 87,
      patientId: '2',
      exerciseId: '2',
      therapistReview: {
        id: '1',
        content: 'Good form overall. Try to maintain a slower, more controlled movement on the return phase.',
        therapistId: '1',
        createdAt: '2023-05-15T09:20:00Z'
      }
    },
    {
      id: '3',
      title: 'Balance Training Session',
      description: 'My balance training progress',
      url: 'https://example.com/videos/3',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&h=300&fit=crop',
      uploadDate: '2023-05-12T16:15:00Z',
      status: 'analyzed',
      aiScore: 78,
      patientId: '2',
      exerciseId: '3'
    }
  ],
  libraryVideos: [
    {
      id: 'lib1',
      title: 'Proper Knee Extension Technique',
      category: 'knee',
      level: 'beginner',
      description: 'Learn the correct form for knee extension exercises to maximize recovery and prevent injury.',
      uploadedBy: 'Dr. Johnson',
      uploadDate: 'June 10, 2023',
      thumbnailUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop',
      views: 1245
    },
    {
      id: 'lib2',
      title: 'Advanced Shoulder Mobility Exercises',
      category: 'shoulder',
      level: 'advanced',
      description: 'A comprehensive guide to advanced shoulder mobility exercises for patients in later stages of recovery.',
      uploadedBy: 'Dr. Smith',
      uploadDate: 'May 22, 2023',
      thumbnailUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&h=300&fit=crop',
      views: 876
    },
    {
      id: 'lib3',
      title: 'Balance Training Fundamentals',
      category: 'balance',
      level: 'intermediate',
      description: 'Essential balance training exercises to improve stability and coordination during rehabilitation.',
      uploadedBy: 'Dr. Williams',
      uploadDate: 'April 15, 2023',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&h=300&fit=crop',
      views: 2103
    },
    {
      id: 'lib4',
      title: 'Lower Back Strengthening',
      category: 'back',
      level: 'beginner',
      description: 'Safe and effective exercises for strengthening the lower back muscles and improving core stability.',
      uploadedBy: 'Dr. Johnson',
      uploadDate: 'March 30, 2023',
      thumbnailUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=300&fit=crop',
      views: 1587
    }
  ]
};

// Auth API
export const authAPI = {
  register: async (userData: any) => {
    if (USE_MOCK_DATA) {
      // Create mock user
      const mockUser = {
        id: Math.random().toString(36).substring(2, 9),
        firstName: userData.firstName || 'New',
        lastName: userData.lastName || 'User',
        email: userData.email || 'user@example.com',
        role: userData.role || 'patient',
        createdAt: new Date().toISOString()
      };

      // Create mock token
      const mockToken = `mock-token-${Math.random().toString(36).substring(2, 15)}`;

      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 800));

      return {
        user: mockUser,
        token: mockToken
      };
    }

    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },
  login: async (credentials: any) => {
    if (USE_MOCK_DATA) {
      // Create mock user based on role
      const isPhysiotherapist = credentials.email?.includes('doctor') || credentials.email?.includes('physio');

      const mockUser = {
        id: Math.random().toString(36).substring(2, 9),
        firstName: isPhysiotherapist ? 'Doctor' : 'Patient',
        lastName: isPhysiotherapist ? 'Johnson' : 'Smith',
        email: credentials.email || 'user@example.com',
        role: isPhysiotherapist ? 'physiotherapist' : 'patient',
        createdAt: new Date().toISOString()
      };

      // Create mock token
      const mockToken = `mock-token-${Math.random().toString(36).substring(2, 15)}`;

      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 800));

      return {
        user: mockUser,
        token: mockToken
      };
    }

    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },
  getProfile: async () => {
    if (USE_MOCK_DATA) {
      // Get token from localStorage
      const token = localStorage.getItem('token');

      // If no token, return null
      if (!token) {
        return null;
      }

      // Get user from localStorage
      const userJson = localStorage.getItem('user');
      if (userJson) {
        return JSON.parse(userJson);
      }

      // Create default mock user
      const mockUser = {
        id: Math.random().toString(36).substring(2, 9),
        firstName: 'Default',
        lastName: 'User',
        email: 'user@example.com',
        role: 'patient',
        createdAt: new Date().toISOString()
      };

      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 500));

      return mockUser;
    }

    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  },
};

// User API
export const userAPI = {
  getAllUsers: async () => {
    if (USE_MOCK_DATA) {
      // Create mock users
      const mockUsers = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Johnson',
          email: 'dr.johnson@example.com',
          role: 'physiotherapist',
          specialization: 'Orthopedic Rehabilitation',
          profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop',
          createdAt: new Date(Date.now() - 7776000000).toISOString() // 90 days ago
        },
        {
          id: '2',
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane.doe@example.com',
          role: 'patient',
          createdAt: new Date(Date.now() - 2592000000).toISOString() // 30 days ago
        },
        {
          id: '3',
          firstName: 'Sarah',
          lastName: 'Smith',
          email: 'dr.smith@example.com',
          role: 'physiotherapist',
          specialization: 'Sports Rehabilitation',
          profileImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=50&h=50&fit=crop',
          createdAt: new Date(Date.now() - 5184000000).toISOString() // 60 days ago
        },
        {
          id: '4',
          firstName: 'Michael',
          lastName: 'Brown',
          email: 'michael.brown@example.com',
          role: 'patient',
          createdAt: new Date(Date.now() - 1296000000).toISOString() // 15 days ago
        }
      ];

      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 800));

      return mockUsers;
    }

    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching all users:', error);

      // Return mock data on error
      return [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Johnson',
          email: 'dr.johnson@example.com',
          role: 'physiotherapist',
          specialization: 'Orthopedic Rehabilitation',
          profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop'
        },
        {
          id: '2',
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane.doe@example.com',
          role: 'patient'
        }
      ];
    }
  },
  getAllPhysiotherapists: async () => {
    if (USE_MOCK_DATA) {
      // Create mock physiotherapists
      const mockPhysiotherapists = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Johnson',
          email: 'dr.johnson@example.com',
          role: 'physiotherapist',
          specialization: 'Orthopedic Rehabilitation',
          profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop',
          experience: '15 years',
          bio: 'Specialized in knee and hip rehabilitation with a focus on sports injuries.',
          availability: ['Monday', 'Wednesday', 'Friday']
        },
        {
          id: '3',
          firstName: 'Sarah',
          lastName: 'Smith',
          email: 'dr.smith@example.com',
          role: 'physiotherapist',
          specialization: 'Sports Rehabilitation',
          profileImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=50&h=50&fit=crop',
          experience: '8 years',
          bio: 'Former athlete specializing in sports-related injuries and performance optimization.',
          availability: ['Tuesday', 'Thursday', 'Saturday']
        },
        {
          id: '5',
          firstName: 'Robert',
          lastName: 'Williams',
          email: 'dr.williams@example.com',
          role: 'physiotherapist',
          specialization: 'Neurological Rehabilitation',
          profileImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=50&h=50&fit=crop',
          experience: '12 years',
          bio: 'Specializes in stroke recovery and neurological conditions.',
          availability: ['Monday', 'Tuesday', 'Thursday']
        }
      ];

      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 800));

      return mockPhysiotherapists;
    }

    try {
      const response = await api.get('/users/physiotherapists');
      return response.data;
    } catch (error) {
      console.error('Error fetching physiotherapists:', error);

      // Return mock data on error
      return [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Johnson',
          email: 'dr.johnson@example.com',
          role: 'physiotherapist',
          specialization: 'Orthopedic Rehabilitation',
          profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop'
        },
        {
          id: '3',
          firstName: 'Sarah',
          lastName: 'Smith',
          email: 'dr.smith@example.com',
          role: 'physiotherapist',
          specialization: 'Sports Rehabilitation',
          profileImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=50&h=50&fit=crop'
        }
      ];
    }
  },
  getUserById: async (id: string) => {
    if (USE_MOCK_DATA) {
      // Create mock user based on id
      let mockUser;

      if (id === '1') {
        mockUser = {
          id: '1',
          firstName: 'John',
          lastName: 'Johnson',
          email: 'dr.johnson@example.com',
          role: 'physiotherapist',
          specialization: 'Orthopedic Rehabilitation',
          profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop',
          experience: '15 years',
          bio: 'Specialized in knee and hip rehabilitation with a focus on sports injuries.',
          availability: ['Monday', 'Wednesday', 'Friday']
        };
      } else if (id === '2') {
        mockUser = {
          id: '2',
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane.doe@example.com',
          role: 'patient',
          medicalHistory: 'ACL reconstruction surgery 3 months ago',
          dateOfBirth: '1990-05-15',
          gender: 'Female',
          emergencyContact: 'John Doe, 555-123-4567'
        };
      } else {
        mockUser = {
          id,
          firstName: 'User',
          lastName: id,
          email: `user${id}@example.com`,
          role: Math.random() > 0.5 ? 'patient' : 'physiotherapist',
          createdAt: new Date().toISOString()
        };
      }

      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 500));

      return mockUser;
    }

    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);

      // Return mock data on error
      return {
        id,
        firstName: 'User',
        lastName: id,
        email: `user${id}@example.com`,
        role: 'patient',
        createdAt: new Date().toISOString()
      };
    }
  },
  updateUser: async (id: string, userData: any) => {
    if (USE_MOCK_DATA) {
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 800));

      return {
        ...userData,
        id,
        updatedAt: new Date().toISOString()
      };
    }

    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  },
};

// Appointment API
export const appointmentAPI = {
  createAppointment: async (appointmentData: any) => {
    if (USE_MOCK_DATA) {
      return { ...appointmentData, id: Math.random().toString(36).substring(2, 9) };
    }
    try {
      const response = await api.post('/appointments', appointmentData);
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },
  getUserAppointments: async () => {
    if (USE_MOCK_DATA) {
      return mockData.appointments;
    }
    try {
      const response = await api.get('/appointments');
      return response.data;
    } catch (error) {
      console.error('Error fetching user appointments:', error);
      return mockData.appointments;
    }
  },
  getUpcomingAppointments: async () => {
    if (USE_MOCK_DATA) {
      return mockData.appointments;
    }
    try {
      const response = await api.get('/appointments/upcoming');
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error);
      return mockData.appointments;
    }
  },
  getAppointmentById: async (id: string) => {
    if (USE_MOCK_DATA) {
      const appointment = mockData.appointments.find(a => a.id === id);
      return appointment || null;
    }
    try {
      const response = await api.get(`/appointments/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching appointment ${id}:`, error);
      const appointment = mockData.appointments.find(a => a.id === id);
      return appointment || null;
    }
  },
  updateAppointment: async (id: string, appointmentData: any) => {
    if (USE_MOCK_DATA) {
      return { ...appointmentData, id };
    }
    try {
      const response = await api.put(`/appointments/${id}`, appointmentData);
      return response.data;
    } catch (error) {
      console.error(`Error updating appointment ${id}:`, error);
      throw error;
    }
  },
};

// Video API
export const videoAPI = {
  uploadVideo: async (formData: FormData) => {
    if (USE_MOCK_DATA) {
      // Extract data from FormData
      const title = formData.get('title') as string || 'Untitled Video';
      const description = formData.get('description') as string || '';
      const exerciseId = formData.get('exerciseId') as string || '1';

      // Create mock video object
      const newVideo = {
        id: Math.random().toString(36).substring(2, 9),
        title,
        description,
        url: 'https://example.com/videos/mock',
        thumbnailUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop',
        uploadDate: new Date().toISOString(),
        status: 'pending',
        aiScore: null,
        patientId: '2',
        exerciseId
      };

      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      return newVideo;
    }

    try {
      const response = await api.post('/videos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  },
  uploadLibraryVideo: async (formData: FormData) => {
    if (USE_MOCK_DATA) {
      // Extract data from FormData
      const title = formData.get('title') as string || 'Untitled Library Video';
      const description = formData.get('description') as string || '';
      const category = formData.get('category') as string || 'general';
      const level = formData.get('level') as string || 'beginner';

      // Create mock library video object
      const newLibraryVideo = {
        id: `lib${Math.random().toString(36).substring(2, 7)}`,
        title,
        category,
        level,
        description,
        uploadedBy: 'Dr. Johnson',
        uploadDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        thumbnailUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop',
        views: 0
      };

      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      return newLibraryVideo;
    }

    try {
      const response = await api.post('/videos/library/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading library video:', error);
      throw error;
    }
  },
  getUserVideos: async () => {
    if (USE_MOCK_DATA) {
      return mockData.videos;
    }

    try {
      const response = await api.get('/videos');
      return response.data;
    } catch (error) {
      console.error('Error fetching user videos:', error);
      return mockData.videos;
    }
  },
  getLibraryVideos: async () => {
    if (USE_MOCK_DATA) {
      return mockData.libraryVideos;
    }

    try {
      const response = await api.get('/videos/library');
      return response.data;
    } catch (error) {
      console.error('Error fetching library videos:', error);
      return mockData.libraryVideos;
    }
  },
  getVideoById: async (id: string) => {
    if (USE_MOCK_DATA) {
      const video = mockData.videos.find(v => v.id === id);
      return video || null;
    }

    try {
      const response = await api.get(`/videos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching video ${id}:`, error);
      const video = mockData.videos.find(v => v.id === id);
      return video || null;
    }
  },
  getVideoAnalysis: async (id: string) => {
    if (USE_MOCK_DATA) {
      const video = mockData.videos.find(v => v.id === id);

      // Create mock analysis
      const mockAnalysis = {
        id: `analysis-${id}`,
        videoId: id,
        score: video?.aiScore || Math.floor(Math.random() * 30) + 70,
        posture: Math.floor(Math.random() * 30) + 70,
        movement: Math.floor(Math.random() * 30) + 70,
        alignment: Math.floor(Math.random() * 30) + 70,
        feedback: [
          'Good range of motion',
          'Keep your back straight during the exercise',
          'Try to maintain a consistent pace'
        ],
        createdAt: new Date().toISOString()
      };

      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return mockAnalysis;
    }

    try {
      const response = await api.get(`/videos/${id}/analysis`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching video analysis for ${id}:`, error);
      throw error;
    }
  },
  addTherapistReview: async (id: string, reviewData: any) => {
    if (USE_MOCK_DATA) {
      const mockReview = {
        id: `review-${Math.random().toString(36).substring(2, 9)}`,
        videoId: id,
        content: reviewData.content,
        therapistId: '1',
        therapistName: 'Dr. Johnson',
        createdAt: new Date().toISOString()
      };

      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 800));

      return mockReview;
    }

    try {
      const response = await api.post(`/videos/${id}/review`, reviewData);
      return response.data;
    } catch (error) {
      console.error(`Error adding therapist review for video ${id}:`, error);
      throw error;
    }
  },
  getVideoCategories: async () => {
    if (USE_MOCK_DATA) {
      return [
        { id: 'knee', name: 'Knee Rehabilitation' },
        { id: 'shoulder', name: 'Shoulder Exercises' },
        { id: 'back', name: 'Back Strengthening' },
        { id: 'balance', name: 'Balance Training' },
        { id: 'general', name: 'General Fitness' }
      ];
    }

    try {
      const response = await api.get('/videos/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching video categories:', error);
      return [
        { id: 'knee', name: 'Knee Rehabilitation' },
        { id: 'shoulder', name: 'Shoulder Exercises' },
        { id: 'back', name: 'Back Strengthening' },
        { id: 'balance', name: 'Balance Training' },
        { id: 'general', name: 'General Fitness' }
      ];
    }
  },
};

// Exercise API
export const exerciseAPI = {
  getAllExercises: async () => {
    if (USE_MOCK_DATA) {
      return mockData.exercises;
    }
    try {
      const response = await api.get('/exercises');
      return response.data;
    } catch (error) {
      console.error('Error fetching all exercises:', error);
      return mockData.exercises;
    }
  },
  getUserExercises: async () => {
    if (USE_MOCK_DATA) {
      return mockData.exercises;
    }
    try {
      const response = await api.get('/exercises/user');
      return response.data;
    } catch (error) {
      console.error('Error fetching user exercises:', error);
      return mockData.exercises;
    }
  },
  getExercisesByCategory: async (category: string) => {
    if (USE_MOCK_DATA) {
      return mockData.exercises.filter(e => e.category === category);
    }
    try {
      const response = await api.get(`/exercises/category/${category}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching exercises by category ${category}:`, error);
      return mockData.exercises.filter(e => e.category === category);
    }
  },
  getExerciseById: async (id: string) => {
    if (USE_MOCK_DATA) {
      const exercise = mockData.exercises.find(e => e.id === id);
      return exercise || null;
    }
    try {
      const response = await api.get(`/exercises/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching exercise ${id}:`, error);
      const exercise = mockData.exercises.find(e => e.id === id);
      return exercise || null;
    }
  },
  createExercise: async (exerciseData: any) => {
    if (USE_MOCK_DATA) {
      return { ...exerciseData, id: Math.random().toString(36).substring(2, 9) };
    }
    try {
      const response = await api.post('/exercises', exerciseData);
      return response.data;
    } catch (error) {
      console.error('Error creating exercise:', error);
      throw error;
    }
  },
  updateExercise: async (id: string, exerciseData: any) => {
    if (USE_MOCK_DATA) {
      return { ...exerciseData, id };
    }
    try {
      const response = await api.put(`/exercises/${id}`, exerciseData);
      return response.data;
    } catch (error) {
      console.error(`Error updating exercise ${id}:`, error);
      throw error;
    }
  },
};

// AI API
export const aiAPI = {
  generateExercisePlan: async (patientId: string) => {
    if (USE_MOCK_DATA) {
      // Create mock exercise plan
      const mockPlan = {
        id: `plan-${Math.random().toString(36).substring(2, 9)}`,
        patientId,
        exercises: mockData.exercises,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
        notes: 'AI-generated exercise plan based on patient assessment'
      };

      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      return mockPlan;
    }

    try {
      const response = await api.post(`/ai/exercise-plan/${patientId}`);
      return response.data;
    } catch (error) {
      console.error(`Error generating exercise plan for patient ${patientId}:`, error);

      // Return mock data on error
      return {
        id: `plan-${Math.random().toString(36).substring(2, 9)}`,
        patientId,
        exercises: mockData.exercises,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
        notes: 'AI-generated exercise plan based on patient assessment'
      };
    }
  },
  getPatientInsights: async (patientId: string) => {
    if (USE_MOCK_DATA) {
      // Create mock insights
      const mockInsights = {
        id: `insights-${Math.random().toString(36).substring(2, 9)}`,
        patientId,
        progress: {
          overall: 75,
          mobility: 82,
          strength: 68,
          balance: 76
        },
        recommendations: [
          'Increase frequency of balance exercises',
          'Add resistance to knee extension exercises',
          'Focus on maintaining proper form during all exercises'
        ],
        trends: {
          painLevel: [7, 6, 5, 4, 3, 3, 2],
          mobility: [60, 65, 70, 75, 78, 80, 82],
          strength: [50, 55, 58, 60, 63, 65, 68],
          balance: [55, 60, 65, 70, 72, 74, 76]
        },
        createdAt: new Date().toISOString()
      };

      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      return mockInsights;
    }

    try {
      const response = await api.get(`/ai/insights/${patientId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching patient insights for ${patientId}:`, error);

      // Return mock data on error
      return {
        id: `insights-${Math.random().toString(36).substring(2, 9)}`,
        patientId,
        progress: {
          overall: 75,
          mobility: 82,
          strength: 68,
          balance: 76
        },
        recommendations: [
          'Increase frequency of balance exercises',
          'Add resistance to knee extension exercises',
          'Focus on maintaining proper form during all exercises'
        ],
        trends: {
          painLevel: [7, 6, 5, 4, 3, 3, 2],
          mobility: [60, 65, 70, 75, 78, 80, 82],
          strength: [50, 55, 58, 60, 63, 65, 68],
          balance: [55, 60, 65, 70, 72, 74, 76]
        },
        createdAt: new Date().toISOString()
      };
    }
  },
};

export default api;
