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
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const isOnboarding = segments[0] === undefined || segments.length === 0;

    if (!isAuthenticated && !inAuthGroup && !isOnboarding) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && (inAuthGroup || isOnboarding)) {
      router.replace('/(tabs)');
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