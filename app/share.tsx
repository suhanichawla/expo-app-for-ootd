import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import { SharedContent, saveSharedContent } from '@/lib/share/shareUtils';

export default function ShareScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ url?: string; text?: string }>();
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<SharedContent>({});

  useEffect(() => {
    const processSharedContent = async () => {
      try {
        // Get content from query params or intent
        const sharedContent: SharedContent = {
          url: params.url,
          text: params.text,
        };

        // If we have content, process it
        if (sharedContent.url || sharedContent.text) {
          setContent(sharedContent);
          
          // Save the content to your app's storage
          const success = await saveSharedContent(sharedContent);
          
          if (success) {
            // Navigate to the appropriate screen after successful save
            setTimeout(() => {
              router.replace('/(tabs)');
            }, 1500);
          } else {
            // Handle save failure
            console.error('Failed to save shared content');
            router.replace('/(tabs)');
          }
        } else {
          // No content was shared, go back to main screen
          router.replace('/(tabs)');
        }
      } catch (error) {
        console.error('Error processing shared content:', error);
        router.replace('/(tabs)');
      }
    };

    processSharedContent();
  }, [params, router]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.contentContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.text}>Adding to your Travel Vault...</Text>
        {content.source && (
          <Text style={styles.sourceText}>From: {content.source}</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
  },
  sourceText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
}); 