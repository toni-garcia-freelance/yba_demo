import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { isLoggedIn } from './services/authService';

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const inAuthGroup = segments[0] === '(auth)';
        const isAuthenticated = await isLoggedIn();

        if (!isAuthenticated && !inAuthGroup) {
          // Redirect to login only if user is not authenticated and not already in auth group
          router.replace('/(auth)/login');
        } else if (isAuthenticated && inAuthGroup) {
          // If user is authenticated and tries to access auth pages, redirect to home
          router.replace('/');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [segments]);

  if (isLoading) {
    return null; // Or return a loading spinner component
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
