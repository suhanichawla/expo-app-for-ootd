import React, { ReactNode, useEffect, useState } from 'react';
import { ClerkProvider, useAuth, useUser, useSignUp, useSignIn } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import { AuthContext, AuthContextType } from './AuthContext';
import { useAuthStore, User } from '@/store/authStore';
import { useSSO } from '@clerk/clerk-expo'
import * as AuthSession from 'expo-auth-session'
import { userApi } from '../api/userApi';



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

// Function to get or create a user in the database
const getOrCreateUser = async (user: User): Promise<User> => {
  try {
    // Try to get existing user from database
    const dbUser = await userApi.getUserByEmail(user.email);
    
    if (dbUser) {
      // User exists, update local user object with DB info
      user.dbId = dbUser._id;
      user.emailVerified = dbUser.emailVerified;
    } else {
      // User doesn't exist, create new user in database
      const newDbUser = await userApi.createUser({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        clerkUserId: user.id
      });
      
      if (newDbUser) {
        user.dbId = newDbUser._id;
        user.emailVerified = false;
      }
    }
    return user;
  } catch (error) {
    console.error('Error getting or creating user:', error);
    return user;
  }
};

// ClerkAuthProvider is the specific implementation using Clerk
const ClerkAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { startSSOFlow } = useSSO()
  const { user: clerkUser } = useUser();
  const { signUp, setActive } = useSignUp();
  const { signIn } = useSignIn();
  const [pendingVerification, setPendingVerification] = useState(false);
  
  // Subscribe to the auth store state
  const { setUser, setAuthenticated, setLoading, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    setLoading(!isLoaded);
    
    const initUser = async () => {
      if (isLoaded && isSignedIn && clerkUser) {
        console.log("successful sign in fires use effect")
        // Map Clerk user to our User type
        const user: User = {
          id: clerkUser.id,
          firstName: clerkUser.firstName || '',
          lastName: clerkUser.lastName || '',
          email: clerkUser.primaryEmailAddress?.emailAddress || '',
          imageUrl: clerkUser.imageUrl,
          dbId: '',
          emailVerified: false
        };

        // Get or create user in database
        const updatedUser = await getOrCreateUser(user);
        console.log("updatedUser", updatedUser)
        
        setUser(updatedUser);
        setAuthenticated(true);
      } else if (isLoaded) {
        setUser(null);
        setAuthenticated(false);
      }
    };
    
    initUser();
  }, [isLoaded, isSignedIn, clerkUser, setUser, setAuthenticated, setLoading]);

  // Create the auth context value with Clerk implementation
  const authContextValue: AuthContextType = {
    signIn: async ({ email, password }) => {
      try {
        if (!signIn) {
          throw new Error('Sign in service is not available');
        }
        const signInAttempt = await signIn.create({
          identifier: email,
          password,
        });
  
        // If sign-in process is complete, set the created session as active
        // and redirect the user
        if (signInAttempt.status === 'complete') {
          const dbUser = await userApi.getUserByEmail(email);
          if (dbUser) {
            const user: User = {
              id: dbUser.clerkUserId,
              firstName: dbUser.firstName,
              lastName: dbUser.lastName,
              email: dbUser.email,
              imageUrl: dbUser.imageUrl || '',
              dbId: dbUser._id,
              emailVerified: dbUser.emailVerified
            };
            setUser(user);
            setAuthenticated(true);
            return { 
              success: true
            }
          }else{
            return {
              success: false,
              error: 'User not found. Please sign up.'
            }
          }
          
        } else {
          // If the status isn't complete, check why. User might need to
          // complete further steps.
          console.log('Sign in attempt:', signInAttempt);
          console.error(JSON.stringify(signInAttempt, null, 2))
          return { 
            success: false, 
            error:  'Sign in. Please try again.' 
          }
        }
      } catch (err) {
        console.log('Sign in error:');
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(err, null, 2))
        const errorMessage = (err as any)?.message || 'Sign in failed. Please try again.';
        return { 
          success: false, 
          error: errorMessage  
        };
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
        const newDbUser = await userApi.createUser({
          email: email,
          firstName: firstName,
          lastName: lastName,
          clerkUserId: signUp.createdUserId || ''
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
        if (verification.createdUserId && signUp.emailAddress) {
          await userApi.verifyUser(signUp.emailAddress)
          const user: User = {
            id: verification.createdUserId,
            firstName: signUp.firstName || '',
            lastName: signUp.lastName || '',
            email: signUp.emailAddress || '',
            dbId: '',
            imageUrl: '',
            emailVerified: false
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
        const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
          strategy: 'oauth_google',
          redirectUrl: AuthSession.makeRedirectUri(),
        })
  
        // If sign in was successful, set the active session
        if (createdSessionId) {
          console.log('Sign in successful:', createdSessionId);
          await setActive!({ session: createdSessionId })
          console.log("sign in with google store", signUp)
          useAuthStore.getState().setAuthenticated(true);
          return { success: true };
        } else {
          console.log('Sign in attempt:', signIn)
          return { success: false, error: 'Sign in failed. Please try again.' };
        };
      } catch (error) {
        console.error('Google sign in error:', error);
        return { success: false, error: 'Google sign in failed. Please try again.' };
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
    user: user, // Use the subscribed value from the store
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
