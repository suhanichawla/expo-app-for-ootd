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
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/lib/auth/useAuth';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function SignUpScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();

  const handleSignUp = async () => {
    console.log('Sign up button pressed');
    // Validate inputs
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const result = await signUp({ email, password, firstName, lastName });
      
      if (result.success) {
        // Redirect to verification code screen
        router.push({
          pathname: '/(auth)/verify-code',
          params: { email }
        });
      } else {
        setError(result.error || 'Sign up failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Sign up error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError('');
      await signInWithGoogle();
      router.replace('/(protected)/home' as any);
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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
            Create Account
          </ThemedText>

          <View style={styles.form}>
            <TextInput
              style={[
                styles.input,
                { color: Colors[colorScheme ?? 'light'].text },
                { borderColor: Colors[colorScheme ?? 'light'].icon },
              ]}
              placeholder="First Name"
              placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
            />

            <TextInput
              style={[
                styles.input,
                { color: Colors[colorScheme ?? 'light'].text },
                { borderColor: Colors[colorScheme ?? 'light'].icon },
              ]}
              placeholder="Last Name"
              placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
            />

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

            <TextInput
              style={[
                styles.input,
                { color: Colors[colorScheme ?? 'light'].text },
                { borderColor: Colors[colorScheme ?? 'light'].icon },
              ]}
              placeholder="Confirm Password"
              placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
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
              onPress={handleSignUp}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.buttonText}>Sign Up</ThemedText>
              )}
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
              <ThemedText>Sign up with Google</ThemedText>
            </TouchableOpacity>

            <View style={styles.signinContainer}>
              <ThemedText>Already have an account? </ThemedText>
              <TouchableOpacity onPress={() => router.push('/(auth)/sign-in' as any)}>
                <ThemedText type="primary">Sign In</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  innerContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
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
  signinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});
