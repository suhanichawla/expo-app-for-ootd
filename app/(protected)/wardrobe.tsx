import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  useColorScheme
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useInventoryStore } from '@/store/inventoryStore';
import { InventoryItem } from '@/types/inventory';
import { Colors } from '@/constants/Colors';

export default function WardrobeScreen() {
  const colorScheme = useColorScheme();
  const { items, isLoading, fetchInventory, pendingUploads } = useInventoryStore();
  const [groupedItems, setGroupedItems] = useState<Record<string, InventoryItem[]>>({});

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    // Group items by category
    const grouped: Record<string, InventoryItem[]> = {};
    
    // Include both confirmed items and pending uploads
    const allItems = [...items, ...pendingUploads];
    
    allItems.forEach(item => {
      const category = item.category;
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(item);
    });
    
    setGroupedItems(grouped);
  }, [items, pendingUploads]);

  const renderItem = ({ item }: { item: InventoryItem }) => (
    <TouchableOpacity 
      style={styles.itemCard}
      onPress={() => router.push(`/item/${item.id}`)}
    >
      {item.localImageUri || item.imageUrls?.[0] ? (
        <Image 
          source={{ uri: item.localImageUri || item.imageUrls[0] }}
          style={styles.itemImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.placeholderImage}>
          <Ionicons name="shirt-outline" size={40} color="#ccc" />
        </View>
      )}
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{item.subCategory}</Text>
        <Text style={styles.itemSubtitle}>{item.attributes.brand || 'Unknown brand'}</Text>
        
        {item.isUploading && (
          <View style={styles.uploadingIndicator}>
            <ActivityIndicator size="small" color={Colors[colorScheme ?? 'light'].primary} />
            <Text style={styles.uploadingText}>Uploading...</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        title: 'My Wardrobe',
        headerLargeTitle: true
      }} />
      
      {isLoading && items.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].primary} />
        </View>
      ) : (
        <>
          {Object.keys(groupedItems).length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="shirt-outline" size={80} color="#ccc" />
              <Text style={styles.emptyText}>Your wardrobe is empty</Text>
              <Text style={styles.emptySubtext}>
                Add your first clothing item by tapping the + button below
              </Text>
            </View>
          ) : (
            <FlatList
              data={Object.entries(groupedItems)}
              keyExtractor={(item) => item[0]}
              renderItem={({ item: [category, categoryItems] }) => (
                <View style={styles.categorySection}>
                  <Text style={styles.categoryTitle}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
                  <FlatList
                    data={categoryItems}
                    keyExtractor={(item) => item.id || Math.random().toString()}
                    renderItem={renderItem}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.itemsRow}
                  />
                </View>
              )}
            />
          )}
        </>
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[
          styles.fab,
          { backgroundColor: Colors[colorScheme ?? 'light'].primary }
        ]}
        onPress={() => router.push('/add-item')}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  itemsRow: {
    paddingLeft: 15,
  },
  itemCard: {
    width: 160,
    marginRight: 15,
    borderRadius: 12,
    backgroundColor: '#f8f8f8',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  itemImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#eee',
  },
  placeholderImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemDetails: {
    padding: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  uploadingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  uploadingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
}); 