import { httpClient } from './httpClient';
import { User } from '@/store/authStore';

export interface UserCreateResponse {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  clerkUserId: string;
  emailVerified: boolean;
  imageUrl?: string;
}

export const userApi = {
  /**
   * Create a new user in the database after email verification
   */
  createUser: async (userData: {
    email: string;
    firstName: string | null;
    lastName: string | null;
    id: string;
    imageUrl?: string;
  }): Promise<UserCreateResponse> => {
    return httpClient.post<UserCreateResponse>('/api/users/register', userData, false);
  },

  /**
   * Create or verify a user who signed in with OAuth
   */
  createOAuthUser: async (userData: {
    email: string;
    firstName: string | null;
    lastName: string | null;
    clerkUserId: string;
    imageUrl?: string;
  }): Promise<UserCreateResponse> => {
    return httpClient.post<UserCreateResponse>('/api/users/oauth-login', userData, true);
  },

  /**
   * Verify a user's email
   */
  verifyUser: async (email: string): Promise<UserCreateResponse> => {
    return httpClient.post<UserCreateResponse>('/api/users/verify', { email }, true);
  },

  /**
   * Get a user by email
   */
  getUserByEmail: async (email: string): Promise<UserCreateResponse> => {
    return httpClient.post<UserCreateResponse>('/api/users/getuser', { email }, true);
  },
}; 