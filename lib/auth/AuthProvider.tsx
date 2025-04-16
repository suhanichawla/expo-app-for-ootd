import React, { ReactNode, useEffect } from 'react';
import { ClerkProvider, useAuth, useUser } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import { AuthContext, AuthContextType } from './AuthContext';
import { useAuthStore, User } from '@/store/authStore';

// Secure storage for Clerk tokens
const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

// ClerkAuthProvider is the specific implementation using Clerk
const ClerkAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user: clerkUser } = useUser();
  
  const { setUser, setAuthenticated, setLoading } = useAuthStore();

  useEffect(() => {
    setLoading(!isLoaded);
    
    if (isLoaded && isSignedIn && clerkUser) {
      // Map Clerk user to our User type
      const user: User = {
        id: clerkUser.id,
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        imageUrl: clerkUser.imageUrl,
      };
      
      setUser(user);
      setAuthenticated(true);
    } else if (isLoaded) {
      setUser(null);
      setAuthenticated(false);
    }
  }, [isLoaded, isSignedIn, clerkUser, setUser, setAuthenticated, setLoading]);

  // Create the auth context value with Clerk implementation
  const authContextValue: AuthContextType = {
    signIn: async ({ email, password }) => {
      try {
        // Using Clerk's signIn method
        // Note: This is a simplified implementation
        // In a real app, you would handle the complete sign-in flow
        console.log('Sign in with:', email);
        // Implementation will depend on Clerk's current API
      } catch (error) {
        console.error('Sign in error:', error);
        throw error;
      }
    },
    signUp: async ({ email, password, firstName, lastName }) => {
      try {
        // Using Clerk's signUp method
        // Note: This is a simplified implementation
        // In a real app, you would handle the complete sign-up flow
        console.log('Sign up with:', email, firstName, lastName);
        // Implementation will depend on Clerk's current API
      } catch (error) {
        console.error('Sign up error:', error);
        throw error;
      }
    },
    signInWithGoogle: async () => {
      // This will be implemented with OAuth
      try {
        // Implementation will depend on Clerk's OAuth setup
        console.log('Sign in with Google');
      } catch (error) {
        console.error('Google sign in error:', error);
        throw error;
      }
    },
    signOut: async () => {
      try {
        await signOut();
        useAuthStore.getState().signOut();
      } catch (error) {
        console.error('Sign out error:', error);
        throw error;
      }
    },
    forgotPassword: async ({ email }) => {
      try {
        // Implementation will depend on Clerk's password reset flow
        console.log('Forgot password for:', email);
      } catch (error) {
        console.error('Forgot password error:', error);
        throw error;
      }
    },
    isLoaded,
    isSignedIn: isSignedIn || false,
    user: useAuthStore.getState().user,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// AuthProvider is the generic provider that can be swapped out
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Get your publishable key from environment variables or config
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || '';

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkAuthProvider>{children}</ClerkAuthProvider>
    </ClerkProvider>
  );
};
