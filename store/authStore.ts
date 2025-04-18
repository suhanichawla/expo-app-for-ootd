import { create } from 'zustand';

export interface User {
  id: string; // Clerk user ID
  dbId: string; // Database user ID
  firstName: string;
  lastName: string;
  email: string;
  imageUrl?: string;
  emailVerified: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  setAuthenticated: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  updateUser: (userData: Partial<User>) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  setUser: (user) => set({ user }),
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  setLoading: (value) => set({ isLoading: value }),
  updateUser: (userData) => set((state) => ({
    user: state.user ? { ...state.user, ...userData } : null
  })),
  signOut: () => set({ isAuthenticated: false, user: null }),
}));
