import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '@/lib/auth/useAuth';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function Index() {
  const { isAuthenticated, isLoading, isLoaded } = useAuth();
  const colorScheme = useColorScheme();

  // Debug output to see what's happening
  console.log("Auth State:", { isAuthenticated, isLoading, isLoaded });

  // Wait for Clerk to fully load before making any auth decisions
  if (isLoading || !isLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator 
          size="large" 
          color={Colors[colorScheme ?? 'light'].primary} 
        />
      </View>
    );
  }

  // Redirect based on authentication status
  if (isAuthenticated) {
    return <Redirect href="/(protected)/home" />;
  } else {
    return <Redirect href="/(auth)/sign-in" />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
