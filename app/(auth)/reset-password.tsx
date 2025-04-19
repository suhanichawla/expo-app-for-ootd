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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/lib/auth/useAuth';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { resetPasswordWithCode } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const params = useLocalSearchParams();
  const email = params.email as string;

  const handleResetPassword = async () => {
    // Validate passwords
    if (!password) {
      setError('Password is required');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const result = await resetPasswordWithCode({ password });
      
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || 'Failed to reset password. Please try again.');
      }
    } catch (err) {
      setError('Failed to reset password. Please try again.');
      console.error('Reset password error:', err);
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
              Your password has been successfully reset!
            </ThemedText>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: Colors[colorScheme ?? 'light'].primary },
              ]}
              onPress={() => router.push('/(auth)/sign-in')}
            >
              <ThemedText style={styles.buttonText}>Sign In</ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.form}>
            <ThemedText style={styles.instructions}>
              Create a new password for {email}
            </ThemedText>

            <TextInput
              style={[
                styles.input,
                { color: Colors[colorScheme ?? 'light'].text },
                { borderColor: Colors[colorScheme ?? 'light'].icon },
              ]}
              placeholder="New Password"
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

            {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}

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
                <ThemedText style={styles.buttonText}>Reset Password</ThemedText>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ThemedText type="primary">Go Back</ThemedText>
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