import React, { ComponentType } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from './useAuth';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Higher-order component to protect routes
export function withAuth<P extends object>(
  Component: ComponentType<P>,
  redirectTo: any = '/(auth)/sign-in'
) {
  return function WithAuthComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const colorScheme = useColorScheme();

    // If still loading, show a loading indicator
    if (isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator 
            size="large" 
            color={Colors[colorScheme ?? 'light'].primary} 
          />
        </View>
      );
    }

    // If not authenticated, redirect to sign-in
    if (!isAuthenticated) {
      // Use setTimeout to avoid immediate redirect which can cause issues
      setTimeout(() => {
        router.replace(redirectTo as any);
      }, 0);
      
      return null;
    }

    // If authenticated, render the protected component
    return <Component {...props} />;
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
