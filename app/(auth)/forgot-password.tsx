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
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('email'); // email -> code -> success
  const { forgotPassword, verifyResetCode } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();

  const handleSendResetCode = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await forgotPassword({ email });
      setStep('code');
    } catch (err) {
      setError('Failed to send reset code. Please try again.');
      console.error('Forgot password error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code) {
      setError('Verification code is required');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const result = await verifyResetCode({ email, code });
      
      if (result.success) {
        router.push({
          pathname: '/(auth)/reset-password' as any,
          params: { email }
        });
      } else {
        setError(result.error || 'Invalid code. Please try again.');
      }
    } catch (err) {
      setError('Failed to verify code. Please try again.');
      console.error('Code verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmailStep = () => (
    <View style={styles.form}>
      <ThemedText style={styles.instructions}>
        Enter your email address and we'll send you a code to reset your password.
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

      {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: Colors[colorScheme ?? 'light'].primary },
        ]}
        onPress={handleSendResetCode}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <ThemedText style={styles.buttonText}>Send Reset Code</ThemedText>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push('/(auth)/sign-in' as any)}
      >
        <ThemedText type="primary">Back to Sign In</ThemedText>
      </TouchableOpacity>
    </View>
  );

  const renderCodeStep = () => (
    <View style={styles.form}>
      <ThemedText style={styles.instructions}>
        Enter the verification code sent to your email address.
      </ThemedText>

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
      />

      {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: Colors[colorScheme ?? 'light'].primary },
        ]}
        onPress={handleVerifyCode}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <ThemedText style={styles.buttonText}>Verify Code</ThemedText>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setStep('email')}
      >
        <ThemedText type="primary">Back to Email</ThemedText>
      </TouchableOpacity>
    </View>
  );

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

        {step === 'email' && renderEmailStep()}
        {step === 'code' && renderCodeStep()}
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
