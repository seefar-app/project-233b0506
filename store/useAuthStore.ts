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

// Mock user database - simulates backend storage
const mockUserDatabase: Map<string, { email: string; password: string; user: User }> = new Map([
  [
    'john.doe@email.com',
    {
      email: 'john.doe@email.com',
      password: 'password123',
      user: {
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
      },
    },
  ],
  [
    'jane.smith@email.com',
    {
      email: 'jane.smith@email.com',
      password: 'password123',
      user: {
        id: Crypto.randomUUID(),
        email: 'jane.smith@email.com',
        phone: '+1 (555) 987-6543',
        name: 'Jane Smith',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        role: 'buyer',
        verified: true,
        rating: 4.8,
        reviewCount: 32,
        bio: 'First-time home buyer looking for the perfect starter home in a great neighborhood.',
        createdAt: new Date('2023-08-20'),
      },
    },
  ],
  [
    'test@example.com',
    {
      email: 'test@example.com',
      password: 'test123',
      user: {
        id: Crypto.randomUUID(),
        email: 'test@example.com',
        phone: '+1 (555) 000-0000',
        name: 'Test User',
        avatar: 'https://ui-avatars.com/api/?name=Test+User&background=8b5cf6&color=fff&size=200',
        role: 'buyer',
        verified: false,
        rating: 0,
        reviewCount: 0,
        bio: 'Test account for demo purposes.',
        createdAt: new Date(),
      },
    },
  ],
]);

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  authError: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, authError: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email.trim())) {
        set({ authError: 'Please enter a valid email address', isLoading: false });
        return false;
      }
      
      // Validate password length
      if (!password || password.length < 6) {
        set({ authError: 'Password must be at least 6 characters', isLoading: false });
        return false;
      }
      
      const normalizedEmail = email.trim().toLowerCase();
      
      // Check if user exists in mock database
      const userRecord = mockUserDatabase.get(normalizedEmail);
      
      let loggedInUser: User;
      
      if (userRecord) {
        // User exists - verify password
        if (userRecord.password !== password) {
          set({ authError: 'Invalid email or password', isLoading: false });
          return false;
        }
        loggedInUser = userRecord.user;
      } else {
        // User doesn't exist - create new user dynamically (mock auto-registration)
        const nameParts = normalizedEmail.split('@')[0].split('.');
        const displayName = nameParts
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ');
        
        loggedInUser = {
          id: Crypto.randomUUID(),
          email: normalizedEmail,
          phone: '',
          name: displayName || 'User',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || 'User')}&background=8b5cf6&color=fff&size=200`,
          role: 'buyer',
          verified: false,
          rating: 0,
          reviewCount: 0,
          bio: '',
          createdAt: new Date(),
        };
        
        // Add to mock database for future logins
        mockUserDatabase.set(normalizedEmail, {
          email: normalizedEmail,
          password: password,
          user: loggedInUser,
        });
      }
      
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email.trim())) {
        set({ authError: 'Please enter a valid email address', isLoading: false });
        return false;
      }
      
      // Validate password length
      if (!password || password.length < 6) {
        set({ authError: 'Password must be at least 6 characters', isLoading: false });
        return false;
      }
      
      // Validate name
      if (!name || name.trim().length < 2) {
        set({ authError: 'Please enter your full name', isLoading: false });
        return false;
      }

      const normalizedEmail = email.trim().toLowerCase();
      
      // Check if user already exists
      if (mockUserDatabase.has(normalizedEmail)) {
        set({ authError: 'An account with this email already exists', isLoading: false });
        return false;
      }

      const newUser: User = {
        id: Crypto.randomUUID(),
        email: normalizedEmail,
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
      
      // Add to mock database
      mockUserDatabase.set(normalizedEmail, {
        email: normalizedEmail,
        password: password,
        user: newUser,
      });
      
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
      
      // Update in mock database
      const normalizedEmail = user.email.toLowerCase();
      const userRecord = mockUserDatabase.get(normalizedEmail);
      if (userRecord) {
        mockUserDatabase.set(normalizedEmail, {
          ...userRecord,
          user: updatedUser,
        });
      }
      
      set({ user: updatedUser });
    }
  },

  clearError: () => {
    set({ authError: null });
  },
}));