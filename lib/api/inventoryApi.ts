import { httpClient } from './httpClient';
import { InventoryItem } from '@/types/inventory';
import { getClerkInstance } from '@clerk/clerk-expo/dist/provider/singleton';

// API endpoints
const INVENTORY_ENDPOINT = '/api/inventory';

export const inventoryApi = {
  /**
   * Fetch all inventory items for the current user
   */
  getInventory: async (): Promise<InventoryItem[]> => {
    return httpClient.get<InventoryItem[]>(INVENTORY_ENDPOINT);
  },

  /**
   * Get a specific inventory item by ID
   */
  getInventoryItem: async (itemId: string): Promise<InventoryItem> => {
    return httpClient.get<InventoryItem>(`${INVENTORY_ENDPOINT}/${itemId}`);
  },

  /**
   * Create a new inventory item
   */
  createInventoryItem: async (data: Partial<Omit<InventoryItem, 'id'>>, imageUri: string): Promise<InventoryItem> => {
    try {
      // Create form data for multipart request
      const formData = new FormData();
      
      // Add the image file
      const fileNameParts = imageUri.split('/');
      const fileName = fileNameParts[fileNameParts.length - 1];
      
      // @ts-ignore - FormData append type issues in React Native
      formData.append('image', {
        uri: imageUri,
        name: fileName,
        type: 'image/jpeg'
      });
      
      // Add other data fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      
      // Get auth token
      const token = await getClerkInstance().session?.getToken();
      
      // Send multipart request
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/inventory/upload-inventory-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type here - it will be set automatically with boundary
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${errorText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error uploading inventory item:', error);
      throw error;
    }
  },

  /**
   * Update an existing inventory item
   */
  updateInventoryItem: async (itemId: string, data: Partial<InventoryItem>): Promise<InventoryItem> => {
    return httpClient.put<InventoryItem>(`${INVENTORY_ENDPOINT}/${itemId}`, data);
  },

  /**
   * Delete an inventory item
   */
  deleteInventoryItem: async (itemId: string): Promise<void> => {
    return httpClient.delete<void>(`${INVENTORY_ENDPOINT}/${itemId}`);
  },

  /**
   * Upload an image for an inventory item
   * Returns the URL of the uploaded image
   */
  uploadImage: async (file: FormData): Promise<{ imageUrl: string }> => {
    // Create custom headers for multipart/form-data
    const uploadResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/upload/image`, {
      method: 'POST',
      body: file,
      headers: {
        // The httpClient will add Authorization header
      }
    });

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${await uploadResponse.text()}`);
    }

    return uploadResponse.json();
  }
}; 