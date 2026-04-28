import { create } from 'zustand';
import * as Crypto from 'expo-crypto';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, role: User['role']) => Promise<boolean>;
  logout: () => void;
  initializeAuth: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => void;
  clearError: () => void;
}

const mockUser: User = {
  id: Crypto.randomUUID(),
  email: 'john.doe@email.com',
  phone: '+1 (555) 123-4567',
  name: 'John Doe',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  role: 'both',
  verified: true,
  rating: 4.9,
  reviewCount: 47,
  bio: 'Real estate enthusiast with 5+ years of experience. Looking for my dream home while helping others find theirs.',
  createdAt: new Date('2023-06-15'),
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  authError: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, authError: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (!email || !email.includes('@')) {
        set({ authError: 'Please enter a valid email address', isLoading: false });
        return false;
      }
      
      if (!password || password.length < 6) {
        set({ authError: 'Password must be at least 6 characters', isLoading: false });
        return false;
      }
      
      // Mock successful login
      const loggedInUser = { ...mockUser, email };
      console.log('Login successful:', loggedInUser.email);
      
      set({ 
        user: loggedInUser,
        isAuthenticated: true, 
        isLoading: false,
        authError: null,
      });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      set({ authError: 'Login failed. Please try again.', isLoading: false });
      return false;
    }
  },

  signup: async (email: string, password: string, name: string, role: User['role']) => {
    set({ isLoading: true, authError: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validation
      if (!email || !email.includes('@')) {
        set({ authError: 'Please enter a valid email address', isLoading: false });
        return false;
      }
      
      if (!password || password.length < 6) {
        set({ authError: 'Password must be at least 6 characters', isLoading: false });
        return false;
      }
      
      if (!name || name.trim().length < 2) {
        set({ authError: 'Please enter your full name', isLoading: false });
        return false;
      }

      const newUser: User = {
        id: Crypto.randomUUID(),
        email: email.trim(),
        phone: '',
        name: name.trim(),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=8b5cf6&color=fff&size=200`,
        role,
        verified: false,
        rating: 0,
        reviewCount: 0,
        bio: '',
        createdAt: new Date(),
      };
      
      console.log('Signup successful:', newUser.email);
      
      set({ 
        user: newUser,
        isAuthenticated: true, 
        isLoading: false,
        authError: null,
      });
      
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      set({ authError: 'Signup failed. Please try again.', isLoading: false });
      return false;
    }
  },

  logout: () => {
    console.log('User logged out');
    set({ 
      user: null, 
      isAuthenticated: false,
      authError: null,
    });
  },

  initializeAuth: async () => {
    set({ isLoading: true });
    
    try {
      // Simulate checking stored auth token
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For demo, start logged out
      console.log('Auth initialized: logged out');
      set({ isLoading: false, isAuthenticated: false, user: null });
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ isLoading: false, isAuthenticated: false, user: null });
    }
  },

  updateProfile: (updates: Partial<User>) => {
    const { user } = get();
    if (user) {
      const updatedUser = { ...user, ...updates };
      console.log('Profile updated:', updatedUser.email);
      set({ user: updatedUser });
    }
  },

  clearError: () => {
    set({ authError: null });
  },
}));