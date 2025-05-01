'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import { toast } from 'sonner';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'patient' | 'physiotherapist' | 'admin';
  token?: string;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);

      // Try to get user data from localStorage first
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        return;
      }

      // If no stored user data, create a default user
      const mockToken = 'mock-token-' + Math.random().toString(36).substring(2, 15);
      const mockUserData = {
        id: 'user-' + Math.random().toString(36).substring(2, 9),
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@example.com',
        role: 'patient' as const,
        token: mockToken,
        profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop"
      };

      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUserData));

      // Set cookie for middleware
      document.cookie = `token=${mockToken}; path=/; max-age=86400; SameSite=Lax`;

      setUser(mockUserData);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);

      // Generate a mock token
      const mockToken = 'mock-token-' + Math.random().toString(36).substring(2, 15);

      // Extract first name and last name from email
      const nameParts = email.split('@')[0].split('.');
      const firstName = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1) : 'User';
      const lastName = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1) : 'Account';

      // Create mock user data
      const mockUserData = {
        id: 'user-' + Math.random().toString(36).substring(2, 9),
        firstName: firstName,
        lastName: lastName,
        email: email,
        role: 'patient' as const,
        token: mockToken,
        profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Save token to localStorage and cookie
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUserData));

      // Set cookie for middleware
      document.cookie = `token=${mockToken}; path=/; max-age=86400; SameSite=Lax`;

      // Set user data
      setUser(mockUserData);

      // Show success animation and message
      toast.success('Login successful', {
        description: `Welcome back, ${firstName}!`,
        duration: 3000
      });

      // Redirect to welcome page
      router.push('/welcome');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setLoading(true);

      // Generate a mock token
      const mockToken = 'mock-token-' + Math.random().toString(36).substring(2, 15);

      // Create mock user data
      const mockUserData = {
        id: 'user-' + Math.random().toString(36).substring(2, 9),
        firstName: userData.firstName || 'New',
        lastName: userData.lastName || 'User',
        email: userData.email,
        role: 'patient' as const,
        token: mockToken,
        profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Save token to localStorage and cookie
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUserData));

      // Set cookie for middleware
      document.cookie = `token=${mockToken}; path=/; max-age=86400; SameSite=Lax`;

      // Set user data
      setUser(mockUserData);

      // Show success animation and message
      toast.success('Registration successful', {
        description: `Welcome to Kinetic AI, ${mockUserData.firstName}!`,
        duration: 5000
      });

      // Redirect to welcome page
      router.push('/welcome');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Get user name before removing data
    const userName = user?.firstName || 'User';

    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Clear cookie
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';

    // Clear user state
    setUser(null);

    // Redirect to login
    router.push('/login');

    // Show success message
    toast.success(`Goodbye, ${userName}!`, {
      description: 'You have been logged out successfully',
      duration: 3000
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
