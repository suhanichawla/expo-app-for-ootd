import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  ActivityIndicator,
  useColorScheme,
  TouchableOpacity
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useInventoryStore } from '@/store/inventoryStore';
import { InventoryItem } from '@/types/inventory';
import { Colors } from '@/constants/Colors';

export default function ItemDetailScreen() {
  const colorScheme = useColorScheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items, pendingUploads, toggleFavorite } = useInventoryStore();
  const [item, setItem] = useState<InventoryItem | null>(null);
  
  useEffect(() => {
    if (!id) return;
    
    // First check pending uploads (local items not yet saved to server)
    const pendingItem = pendingUploads.find(item => item.id === id);
    if (pendingItem) {
      setItem(pendingItem);
      return;
    }
    
    // Then check saved items
    const savedItem = items.find(item => item.id === id);
    if (savedItem) {
      setItem(savedItem);
      return;
    }
  }, [id, items, pendingUploads]);
  
  if (!item) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].primary} />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          headerTitle: item.subCategory.charAt(0).toUpperCase() + item.subCategory.slice(1),
        }}
      />
      
      <ScrollView>
        {/* Image */}
        <View style={styles.imageContainer}>
          {item.localImageUri || item.imageUrls?.[0] ? (
            <Image 
              source={{ uri: item.localImageUri || item.imageUrls[0] }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="shirt-outline" size={60} color="#ccc" />
            </View>
          )}
          
          {/* Favorite button */}
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={() => {
              if (item.id && !item.isUploading) {
                toggleFavorite(item.id)
              }
            }}
            disabled={item.isUploading}
          >
            <Ionicons 
              name={item.metadata?.favorite ? "heart" : "heart-outline"} 
              size={24} 
              color={item.metadata?.favorite ? "#e74c3c" : "#666"} 
            />
          </TouchableOpacity>
        </View>
        
        {/* Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Basic Details</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category</Text>
            <Text style={styles.detailValue}>
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Subcategory</Text>
            <Text style={styles.detailValue}>
              {item.subCategory.charAt(0).toUpperCase() + item.subCategory.slice(1)}
            </Text>
          </View>
          
          {item.attributes.brand && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Brand</Text>
              <Text style={styles.detailValue}>{item.attributes.brand}</Text>
            </View>
          )}
          
          {item.attributes.size && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Size</Text>
              <Text style={styles.detailValue}>{item.attributes.size}</Text>
            </View>
          )}
          
          {item.attributes.color && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Color</Text>
              <Text style={styles.detailValue}>
                {item.attributes.color.charAt(0).toUpperCase() + item.attributes.color.slice(1)}
              </Text>
            </View>
          )}
          
          {item.attributes.material && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Material</Text>
              <Text style={styles.detailValue}>
                {item.attributes.material.charAt(0).toUpperCase() + item.attributes.material.slice(1)}
              </Text>
            </View>
          )}
          
          {item.attributes.season && item.attributes.season.length > 0 && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Seasons</Text>
              <Text style={styles.detailValue}>
                {item.attributes.season.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}
              </Text>
            </View>
          )}
          
          {item.attributes.occasions && item.attributes.occasions.length > 0 && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Occasions</Text>
              <Text style={styles.detailValue}>
                {item.attributes.occasions.map(o => o.charAt(0).toUpperCase() + o.slice(1)).join(', ')}
              </Text>
            </View>
          )}
          
          {item.attributes.style && item.attributes.style.length > 0 && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Styles</Text>
              <Text style={styles.detailValue}>
                {item.attributes.style.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}
              </Text>
            </View>
          )}
          
          {/* Stats section if available */}
          {item.stats && (
            <>
              <View style={[styles.sectionHeader, styles.statsHeader]}>
                <Text style={styles.sectionTitle}>Stats</Text>
              </View>
              
              {item.stats.timesWorn !== undefined && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Times Worn</Text>
                  <Text style={styles.detailValue}>{item.stats.timesWorn}</Text>
                </View>
              )}
              
              {item.stats.lastWorn && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Last Worn</Text>
                  <Text style={styles.detailValue}>
                    {new Date(item.stats.lastWorn).toLocaleDateString()}
                  </Text>
                </View>
              )}
              
              {item.stats.averageRating !== undefined && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Average Rating</Text>
                  <Text style={styles.detailValue}>{item.stats.averageRating.toFixed(1)}</Text>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
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
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 350,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: 'white',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  detailsContainer: {
    padding: 20,
  },
  sectionHeader: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsHeader: {
    marginTop: 20,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  detailLabel: {
    width: 110,
    fontSize: 16,
    color: '#666',
  },
  detailValue: {
    flex: 1,
    fontSize: 16,
  },
}); 