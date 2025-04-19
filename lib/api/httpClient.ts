import * as SecureStore from 'expo-secure-store';
import { clerk } from '@clerk/clerk-expo/dist/provider/singleton';


// Token management
const getAuthToken = async (): Promise<string | null> => {
  try {
    const token = await clerk.session?.getToken();
    console.log("getToken", token)
    return await SecureStore.getItemAsync('clerk-auth-token');
  } catch (error) {
    console.error('Error retrieving auth token:', error);
    return null;
  }
};

// Base API URL
const API_URL = process.env.EXPO_PUBLIC_API_URL || '';

// HTTP client with automatic token injection
export const httpClient = {
  async get<T>(endpoint: string, requiresAuth = true): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (requiresAuth) {
      const token = await getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`API error: ${await response.text()}`);
    }

    return response.json();
  },

  async post<T>(endpoint: string, data: any, requiresAuth = true): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (requiresAuth) {
        console.log("requiresAuth")
      const token = await getAuthToken();
      console.log("token", token)
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const url = `${API_URL}${endpoint}`;
    console.log(`[API] POST ${url}`, data);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[API] Error ${response.status}: ${errorText}`);
        throw new Error(`API error: ${errorText}`);
      }

      const result = await response.json();
      console.log(`[API] Response:`, result);
      return result;
    } catch (error) {
      console.error(`[API] Request failed:`, error);
      throw error;
    }
  },

  async put<T>(endpoint: string, data: any, requiresAuth = true): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (requiresAuth) {
      const token = await getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API error: ${await response.text()}`);
    }

    return response.json();
  },

  async delete<T>(endpoint: string, requiresAuth = true): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (requiresAuth) {
      const token = await getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error(`API error: ${await response.text()}`);
    }

    return response.json();
  },
}; 