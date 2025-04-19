import { create } from 'zustand';
import { inventoryApi } from '@/lib/api/inventoryApi';
import { InventoryItem } from '@/types/inventory';

interface InventoryState {
  // State
  items: InventoryItem[];
  isLoading: boolean;
  error: string | null;
  pendingUploads: InventoryItem[];
  
  // Actions
  fetchInventory: () => Promise<void>;
  addItem: (item: InventoryItem, imageUri?: string) => Promise<void>;
  updateItem: (id: string, updates: Partial<InventoryItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  
  // Local state management
  addPendingUpload: (item: InventoryItem) => void;
  removePendingUpload: (localId: string) => void;
  resetError: () => void;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  // Initial state
  items: [],
  isLoading: false,
  error: null,
  pendingUploads: [],
  
  // Actions
  fetchInventory: async () => {
    set({ isLoading: true, error: null });
    try {
      const items = await inventoryApi.getInventory();
      set({ items, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch inventory', isLoading: false });
    }
  },
  
  addItem: async (item: InventoryItem, localImageUri?: string) => {
    // Create a temporary ID for tracking in UI
    const tempId = Date.now().toString();
    const pendingItem = { 
      ...item, 
      id: tempId, 
      isUploading: true,
      localImageUri
    };
    
    // Add to pending uploads for UI tracking
    get().addPendingUpload(pendingItem);
    
    try {
      // If we have a local image, we need to upload it first
      if (localImageUri) {
        // Create FormData for image upload
        const formData = new FormData();
        // @ts-ignore - React Native's FormData is not fully typed
        formData.append('image', {
          uri: localImageUri,
          name: 'image.jpg',
          type: 'image/jpeg'
        });
        
        // Upload the image
        const uploadResult = await inventoryApi.uploadImage(formData);
        
        // Update item with the image URL
        item = {
          ...item,
          imageUrls: [uploadResult.imageUrl]
        };
      }
      
      // Create the item on the backend
      const newItem = await inventoryApi.createInventoryItem(item);
      
      // Update local state
      set(state => ({
        items: [...state.items, newItem],
        pendingUploads: state.pendingUploads.filter(item => item.id !== tempId)
      }));
    } catch (error) {
      set(state => ({
        error: error instanceof Error ? error.message : 'Failed to add item',
        // Remove from pending uploads
        pendingUploads: state.pendingUploads.filter(item => item.id !== tempId)
      }));
    }
  },
  
  updateItem: async (id: string, updates: Partial<InventoryItem>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedItem = await inventoryApi.updateInventoryItem(id, updates);
      
      set(state => ({
        items: state.items.map(item => 
          item.id === id ? updatedItem : item
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update item',
        isLoading: false 
      });
    }
  },
  
  deleteItem: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await inventoryApi.deleteInventoryItem(id);
      
      set(state => ({
        items: state.items.filter(item => item.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete item',
        isLoading: false 
      });
    }
  },
  
  toggleFavorite: async (id: string) => {
    const item = get().items.find(i => i.id === id);
    if (!item) return;
    
    const isFavorite = item.metadata?.favorite || false;
    
    await get().updateItem(id, { 
      metadata: { 
        ...item.metadata,
        favorite: !isFavorite 
      } 
    });
  },
  
  // Local state management
  addPendingUpload: (item: InventoryItem) => {
    set(state => ({
      pendingUploads: [...state.pendingUploads, item]
    }));
  },
  
  removePendingUpload: (localId: string) => {
    set(state => ({
      pendingUploads: state.pendingUploads.filter(item => item.id !== localId)
    }));
  },
  
  resetError: () => set({ error: null })
})); 