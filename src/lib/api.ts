import axios from 'axios';

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

// Auth API
export const authAPI = {
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  login: async (credentials: any) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

// User API
export const userAPI = {
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  getAllPhysiotherapists: async () => {
    const response = await api.get('/users/physiotherapists');
    return response.data;
  },
  getUserById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  updateUser: async (id: string, userData: any) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },
};

// Appointment API
export const appointmentAPI = {
  createAppointment: async (appointmentData: any) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },
  getUserAppointments: async () => {
    const response = await api.get('/appointments');
    return response.data;
  },
  getUpcomingAppointments: async () => {
    const response = await api.get('/appointments/upcoming');
    return response.data;
  },
  getAppointmentById: async (id: string) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },
  updateAppointment: async (id: string, appointmentData: any) => {
    const response = await api.put(`/appointments/${id}`, appointmentData);
    return response.data;
  },
};

// Video API
export const videoAPI = {
  uploadVideo: async (formData: FormData) => {
    const response = await api.post('/videos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  uploadLibraryVideo: async (formData: FormData) => {
    const response = await api.post('/videos/library/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  getUserVideos: async () => {
    const response = await api.get('/videos');
    return response.data;
  },
  getLibraryVideos: async () => {
    const response = await api.get('/videos/library');
    return response.data;
  },
  getVideoById: async (id: string) => {
    const response = await api.get(`/videos/${id}`);
    return response.data;
  },
  getVideoAnalysis: async (id: string) => {
    const response = await api.get(`/videos/${id}/analysis`);
    return response.data;
  },
  addTherapistReview: async (id: string, reviewData: any) => {
    const response = await api.post(`/videos/${id}/review`, reviewData);
    return response.data;
  },
  getVideoCategories: async () => {
    const response = await api.get('/videos/categories');
    return response.data;
  },
};

// Exercise API
export const exerciseAPI = {
  getAllExercises: async () => {
    const response = await api.get('/exercises');
    return response.data;
  },
  getUserExercises: async () => {
    const response = await api.get('/exercises/user');
    return response.data;
  },
  getExercisesByCategory: async (category: string) => {
    const response = await api.get(`/exercises/category/${category}`);
    return response.data;
  },
  getExerciseById: async (id: string) => {
    const response = await api.get(`/exercises/${id}`);
    return response.data;
  },
  createExercise: async (exerciseData: any) => {
    const response = await api.post('/exercises', exerciseData);
    return response.data;
  },
  updateExercise: async (id: string, exerciseData: any) => {
    const response = await api.put(`/exercises/${id}`, exerciseData);
    return response.data;
  },
};

// AI API
export const aiAPI = {
  generateExercisePlan: async (patientId: string) => {
    const response = await api.post(`/ai/exercise-plan/${patientId}`);
    return response.data;
  },
  getPatientInsights: async (patientId: string) => {
    const response = await api.get(`/ai/insights/${patientId}`);
    return response.data;
  },
};

export default api;
