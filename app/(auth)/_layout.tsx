import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function AuthLayout() {
  const colorScheme = useColorScheme();

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
