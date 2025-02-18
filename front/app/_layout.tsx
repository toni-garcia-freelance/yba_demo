import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { authService } from './services/authService';

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    const isAuthenticated = authService.isAuthenticated();

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login only if user is not authenticated and not already in auth group
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // If user is authenticated and tries to access auth pages, redirect to home
      router.replace('/');
    }
  }, [segments]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
