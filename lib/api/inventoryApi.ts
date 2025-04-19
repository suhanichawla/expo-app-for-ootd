import { httpClient } from './httpClient';
import { InventoryItem } from '@/types/inventory';

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
  createInventoryItem: async (data: Omit<InventoryItem, 'id'>): Promise<InventoryItem> => {
    console.log("inventiyr")
    return httpClient.post<InventoryItem>(INVENTORY_ENDPOINT, data, true);
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