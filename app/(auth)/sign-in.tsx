import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/lib/auth/useAuth';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await signIn({ email, password });
      router.replace('/(tabs)');
    } catch (err) {
      setError('Invalid email or password');
      console.error('Sign in error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError('');
      await signInWithGoogle();
      router.replace('/(tabs)');
    } catch (err) {
      setError('Google sign in failed');
      console.error('Google sign in error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ThemedView style={styles.innerContainer}>
        <View style={styles.logoContainer}>
          {/* Replace with your app logo */}
          <Image
            source={require('@/assets/images/react-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <ThemedText type="title" style={styles.title}>
          Welcome Back
        </ThemedText>

        <View style={styles.form}>
          <TextInput
            style={[
              styles.input,
              { color: Colors[colorScheme ?? 'light'].text },
              { borderColor: Colors[colorScheme ?? 'light'].icon },
            ]}
            placeholder="Email"
            placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            style={[
              styles.input,
              { color: Colors[colorScheme ?? 'light'].text },
              { borderColor: Colors[colorScheme ?? 'light'].icon },
            ]}
            placeholder="Password"
            placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {error ? (
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          ) : null}

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: Colors[colorScheme ?? 'light'].primary },
            ]}
            onPress={handleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.buttonText}>Sign In</ThemedText>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.forgotPassword}
            onPress={() => router.push('/(auth)/forgot-password' as any)}
          >
            <ThemedText type="primary">Forgot Password?</ThemedText>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: Colors[colorScheme ?? 'light'].icon }]} />
            <ThemedText style={styles.dividerText}>OR</ThemedText>
            <View style={[styles.dividerLine, { backgroundColor: Colors[colorScheme ?? 'light'].icon }]} />
          </View>

          <TouchableOpacity
            style={[
              styles.googleButton,
              { borderColor: Colors[colorScheme ?? 'light'].icon },
            ]}
            onPress={handleGoogleSignIn}
            disabled={isLoading}
          >
            <ThemedText>Sign in with Google</ThemedText>
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <ThemedText>Don't have an account? </ThemedText>
            <TouchableOpacity onPress={() => router.push('/(auth)/sign-up' as any)}>
              <ThemedText type="primary">Sign Up</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
  },
  form: {
    width: '100%',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 10,
  },
  googleButton: {
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});
