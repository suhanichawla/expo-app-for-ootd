import { createContext, useContext } from 'react';
import { User } from '@/store/authStore';

export interface AuthContextType {
  signIn: (params: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  signUp: (params: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<{ success: boolean; error?: string }>;
  verifyCode: (params: { code: string }) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (params: { email: string }) => Promise<void>;
  isLoaded: boolean;
  isSignedIn: boolean;
  user: User | null;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
