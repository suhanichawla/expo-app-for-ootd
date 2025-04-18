import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/lib/auth/useAuth';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function VerifyCodeScreen() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { verifyCode } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (!email) {
      // If no email is provided, redirect back to sign up
      Alert.alert('Error', 'No email provided for verification');
      router.replace('/(auth)/sign-up' as any);
    }
  }, [email, router]);

  const handleVerify = async () => {
    if (!code) {
      setError('Please enter the verification code');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const result = await verifyCode({ code });
      
      if (result.success) {
        setSuccess(true);
        // Wait a moment to show success message before redirecting
        setTimeout(() => {
          router.replace('/(protected)/home' as any);
        }, 1500);
      } else {
        setError(result.error || 'Verification failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    // In a real implementation, this would call an API to resend the code
    Alert.alert('Resend Code', 'A new verification code has been sent to your email.');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ThemedView style={styles.innerContainer}>
        <ThemedText type="title" style={styles.title}>
          Verify Your Email
        </ThemedText>

        <ThemedText style={styles.subtitle}>
          We've sent a verification code to {email}. Please enter it below to verify your account.
        </ThemedText>

        <View style={styles.form}>
          <TextInput
            style={[
              styles.input,
              { color: Colors[colorScheme ?? 'light'].text },
              { borderColor: Colors[colorScheme ?? 'light'].icon },
            ]}
            placeholder="Verification Code"
            placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
            autoFocus
          />

          {error ? (
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          ) : null}

          {success ? (
            <ThemedText style={styles.successText}>
              Verification successful! Redirecting...
            </ThemedText>
          ) : null}

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: Colors[colorScheme ?? 'light'].primary },
            ]}
            onPress={handleVerify}
            disabled={isLoading || success}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.buttonText}>Verify</ThemedText>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resendContainer}
            onPress={handleResendCode}
            disabled={isLoading || success}
          >
            <ThemedText type="primary">Resend Code</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backContainer}
            onPress={() => router.back()}
            disabled={isLoading || success}
          >
            <ThemedText>Back to Sign Up</ThemedText>
          </TouchableOpacity>
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
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
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
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 8,
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
  resendContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  backContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  successText: {
    color: 'green',
    marginBottom: 10,
    textAlign: 'center',
  },
});
