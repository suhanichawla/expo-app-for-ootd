import { useAuthContext } from './AuthContext';
import { useAuthStore } from '@/store/authStore';

// Custom hook that combines the auth context and auth store
export const useAuth = () => {
  const authContext = useAuthContext();
  const { isAuthenticated, isLoading, user, setAuthenticated } = useAuthStore();

  // If Clerk says user is signed in, make sure our store reflects that
  if (authContext.isLoaded && authContext.isSignedIn && !isAuthenticated) {
    setAuthenticated(true);
  }

  return {
    // From auth context
    signIn: authContext.signIn,
    signUp: authContext.signUp,
    verifyCode: authContext.verifyCode,
    signInWithGoogle: authContext.signInWithGoogle,
    signOut: authContext.signOut,
    forgotPassword: authContext.forgotPassword,
    isLoaded: authContext.isLoaded,
    
    // From auth store
    isAuthenticated,
    isLoading,
    user,
  };
};
