import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import { useStore } from '@/store/useStore';
import '../global.css';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, []);

  useEffect(() => {
    if (isLoading) {
      console.log('[GUARD] Still loading auth state...');
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';
    const isOnboarding = segments.length === 0 || segments[0] === 'index';

    console.log('[GUARD] Auth state:', { 
      isAuthenticated, 
      segments: segments.join('/'), 
      inAuthGroup, 
      inTabsGroup, 
      isOnboarding 
    });

    if (!isAuthenticated) {
      // User is not authenticated
      if (inTabsGroup) {
        // Trying to access protected tabs, redirect to login
        console.log('[GUARD] Not authenticated, redirecting to login from tabs');
        router.replace('/(auth)/login');
      } else if (!inAuthGroup && !isOnboarding) {
        // Trying to access other protected routes, redirect to login
        console.log('[GUARD] Not authenticated, redirecting to login from protected route');
        router.replace('/(auth)/login');
      }
      // If already in auth group or onboarding, do nothing
    } else {
      // User is authenticated
      if (inAuthGroup || isOnboarding) {
        // Already logged in, redirect to tabs
        console.log('[GUARD] Authenticated, redirecting to tabs');
        router.replace('/(tabs)');
      }
      // If already in tabs or other protected routes, do nothing
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={['#1e1b4b', '#312e81', '#4c1d95']}
          style={StyleSheet.absoluteFill}
        />
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const { fetchProperties, fetchChats } = useStore();

  useEffect(() => {
    fetchProperties();
    fetchChats();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <AuthGuard>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#0f172a' },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="property/[id]"
            options={{
              presentation: 'card',
            }}
          />
          <Stack.Screen
            name="listing/create"
            options={{
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="chat/[id]"
            options={{
              presentation: 'card',
            }}
          />
        </Stack>
      </AuthGuard>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});