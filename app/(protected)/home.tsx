import React from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/lib/auth/useAuth';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(auth)/sign-in' as any);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const navigateToWardrobe = () => {
    router.push('/(protected)/wardrobe' as any);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Home</ThemedText>
        <TouchableOpacity
          style={[
            styles.signOutButton,
            { borderColor: Colors[colorScheme ?? 'light'].icon },
          ]}
          onPress={handleSignOut}
        >
          <ThemedText>Sign Out</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          {user?.imageUrl ? (
            <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
          ) : (
            <View
              style={[
                styles.avatarPlaceholder,
                { backgroundColor: Colors[colorScheme ?? 'light'].primary },
              ]}
            >
              <ThemedText style={styles.avatarText}>
                {user?.firstName?.[0]?.toUpperCase() || ''}
                {user?.lastName?.[0]?.toUpperCase() || ''}
              </ThemedText>
            </View>
          )}
        </View>

        <ThemedText type="subtitle" style={styles.welcomeText}>
          Welcome, {user?.firstName} {user?.lastName}!
        </ThemedText>
        <ThemedText style={styles.emailText}>{user?.email}</ThemedText>
      </View>

      <View style={styles.contentSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Protected Content
        </ThemedText>
        <ThemedView
          style={[
            styles.card,
            { borderColor: Colors[colorScheme ?? 'light'].icon },
          ]}
        >
          <ThemedText>
            This is a protected screen that only authenticated users can access.
          </ThemedText>
        </ThemedView>
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[
          styles.fab,
          { backgroundColor: Colors[colorScheme ?? 'light'].primary }
        ]}
        onPress={navigateToWardrobe}
      >
        <Ionicons name="shirt" size={30} color="white" />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 30,
  },
  signOutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  welcomeText: {
    marginBottom: 8,
  },
  emailText: {
    opacity: 0.7,
  },
  contentSection: {
    flex: 1,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
