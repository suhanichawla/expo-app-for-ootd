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
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/lib/auth/useAuth';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { forgotPassword } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();

  const handleResetPassword = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await forgotPassword({ email });
      setSuccess(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
      console.error('Forgot password error:', err);
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
          Reset Password
        </ThemedText>

        {success ? (
          <View style={styles.successContainer}>
            <ThemedText style={styles.successText}>
              Password reset email sent! Check your inbox for instructions.
            </ThemedText>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: Colors[colorScheme ?? 'light'].primary },
              ]}
              onPress={() => router.push('/(auth)/sign-in' as any)}
            >
              <ThemedText style={styles.buttonText}>Back to Sign In</ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.form}>
            <ThemedText style={styles.instructions}>
              Enter your email address and we'll send you instructions to reset your password.
            </ThemedText>

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

            {error ? (
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            ) : null}

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: Colors[colorScheme ?? 'light'].primary },
              ]}
              onPress={handleResetPassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.buttonText}>Send Reset Link</ThemedText>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.push('/(auth)/sign-in' as any)}
            >
              <ThemedText type="primary">Back to Sign In</ThemedText>
            </TouchableOpacity>
          </View>
        )}
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
  instructions: {
    textAlign: 'center',
    marginBottom: 24,
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
  backButton: {
    alignSelf: 'center',
    marginTop: 24,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  successContainer: {
    alignItems: 'center',
    padding: 20,
  },
  successText: {
    textAlign: 'center',
    marginBottom: 24,
  },
});
