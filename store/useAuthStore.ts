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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock validation
      if (!email.includes('@')) {
        set({ authError: 'Please enter a valid email address', isLoading: false });
        return false;
      }
      
      if (password.length < 6) {
        set({ authError: 'Password must be at least 6 characters', isLoading: false });
        return false;
      }
      
      // Mock successful login
      set({ 
        user: { ...mockUser, email },
        isAuthenticated: true, 
        isLoading: false,
        authError: null,
      });
      return true;
    } catch (error) {
      set({ authError: 'Login failed. Please try again.', isLoading: false });
      return false;
    }
  },

  signup: async (email: string, password: string, name: string, role: User['role']) => {
    set({ isLoading: true, authError: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (!email.includes('@')) {
        set({ authError: 'Please enter a valid email address', isLoading: false });
        return false;
      }
      
      if (password.length < 6) {
        set({ authError: 'Password must be at least 6 characters', isLoading: false });
        return false;
      }
      
      if (name.length < 2) {
        set({ authError: 'Please enter your full name', isLoading: false });
        return false;
      }

      const newUser: User = {
        id: Crypto.randomUUID(),
        email,
        phone: '',
        name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=8b5cf6&color=fff&size=200`,
        role,
        verified: false,
        rating: 0,
        reviewCount: 0,
        bio: '',
        createdAt: new Date(),
      };
      
      set({ 
        user: newUser,
        isAuthenticated: true, 
        isLoading: false,
        authError: null,
      });
      return true;
    } catch (error) {
      set({ authError: 'Signup failed. Please try again.', isLoading: false });
      return false;
    }
  },

  logout: () => {
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, start logged out
      set({ isLoading: false, isAuthenticated: false });
    } catch (error) {
      set({ isLoading: false, isAuthenticated: false });
    }
  },

  updateProfile: (updates: Partial<User>) => {
    const { user } = get();
    if (user) {
      set({ user: { ...user, ...updates } });
    }
  },

  clearError: () => {
    set({ authError: null });
  },
}));