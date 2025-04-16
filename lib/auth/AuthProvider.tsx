import React, { ReactNode, useEffect, useState } from 'react';
import { ClerkProvider, useAuth, useUser, useSignUp, useSignIn } from '@clerk/clerk-expo';
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
  const { signUp, setActive } = useSignUp();
  const { signIn } = useSignIn();
  const [pendingVerification, setPendingVerification] = useState(false);
  
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
        if (!signUp) {
          return { 
            success: false, 
            error: 'Sign up service is not available' 
          };
        }
        
        await signUp.create({
          emailAddress: email,
          password,
          firstName,
          lastName,
        });
  
        // Send user an email with verification code
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        setPendingVerification(true);
        
        return { success: true };
      } catch (err: any) {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(err, null, 2));
        
        // Extract error message
        let errorMessage = 'Sign up failed. Please try again.';
        if (err.errors && err.errors.length > 0) {
          errorMessage = err.errors[0].message;
        }
        
        return { 
          success: false, 
          error: errorMessage 
        };
      }
    },
    
    verifyCode: async ({ code }) => {
      try {
        if (!signUp || !pendingVerification) {
          return { 
            success: false, 
            error: 'No verification in progress' 
          };
        }
        
        const verification = await signUp.attemptEmailAddressVerification({
          code,
        });
        
        if (verification.status !== 'complete') {
          return { 
            success: false, 
            error: 'Verification failed. Please try again.' 
          };
        }
        
        // Set the user as active
        await setActive({ session: verification.createdSessionId });
        setPendingVerification(false);
        
        // Update the auth store
        if (verification.createdUserId) {
          const user: User = {
            id: verification.createdUserId,
            firstName: signUp.firstName || '',
            lastName: signUp.lastName || '',
            email: signUp.emailAddress || '',
          };
          
          useAuthStore.getState().setUser(user);
          useAuthStore.getState().setAuthenticated(true);
        }
        
        return { success: true };
      } catch (err: any) {
        console.error('Verification error:', JSON.stringify(err, null, 2));
        
        // Extract error message
        let errorMessage = 'Verification failed. Please try again.';
        if (err.errors && err.errors.length > 0) {
          errorMessage = err.errors[0].message;
        }
        
        return { 
          success: false, 
          error: errorMessage 
        };
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
