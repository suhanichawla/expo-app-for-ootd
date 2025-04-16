import { useAuthContext } from './AuthContext';
import { useAuthStore } from '@/store/authStore';

// Custom hook that combines the auth context and auth store
export const useAuth = () => {
  const authContext = useAuthContext();
  const { isAuthenticated, isLoading, user } = useAuthStore();

  return {
    // From auth context
    signIn: authContext.signIn,
    signUp: authContext.signUp,
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
