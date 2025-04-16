import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/lib/auth/useAuth';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function ProtectedLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/(auth)/sign-in' as any);
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator 
          size="large" 
          color={Colors[colorScheme ?? 'light'].primary} 
        />
      </View>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colorScheme === 'dark' ? '#151718' : '#fff',
          },
        }}
      />
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
