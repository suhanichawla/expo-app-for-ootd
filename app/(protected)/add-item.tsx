import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator,
  Alert,
  useColorScheme
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { useInventoryStore } from '@/store/inventoryStore';
import { 
  InventoryItem, 
  CATEGORIES, 
  SUBCATEGORIES, 
  SEASONS, 
  Category,
  COLORS,
  MATERIALS,
  OCCASIONS,
  STYLES
} from '@/types/inventory';
import { Colors } from '@/constants/Colors';
import { takePicture, pickImage, requestMediaPermissions } from '@/lib/utils/imagePickerUtils';

export default function AddItemScreen() {
  const colorScheme = useColorScheme();
  const { addItem } = useInventoryStore();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [category, setCategory] = useState<Category | null>(null);
  const [subCategory, setSubCategory] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [brand, setBrand] = useState('');
  const [material, setMaterial] = useState<string | null>(null);
  const [size, setSize] = useState('');
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  
  // DropDown open states
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [subCategoryOpen, setSubCategoryOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const [materialOpen, setMaterialOpen] = useState(false);
  const [seasonsOpen, setSeasonsOpen] = useState(false);
  const [occasionsOpen, setOccasionsOpen] = useState(false);
  const [stylesOpen, setStylesOpen] = useState(false);

  // Available subcategories based on selected category
  const [subCategories, setSubCategories] = useState<string[]>([]);
  
  useEffect(() => {
    // Reset subcategory when category changes
    setSubCategory(null);
    
    // Update available subcategories
    if (category && SUBCATEGORIES[category]) {
      setSubCategories(SUBCATEGORIES[category]);
    } else {
      setSubCategories([]);
    }
  }, [category]);

  // Check permissions when component mounts
  useEffect(() => {
    requestMediaPermissions();
  }, []);

  const handleTakePhoto = async () => {
    const uri = await takePicture();
    if (uri) {
      setImageUri(uri);
    }
  };

  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) {
      setImageUri(uri);
    }
  };

  const validateForm = (): boolean => {
    if (!imageUri) {
      Alert.alert('Missing Image', 'Please take a photo or select an image from your gallery');
      return false;
    }
    
    if (!category) {
      Alert.alert('Missing Category', 'Please select a category for this item');
      return false;
    }
    
    if (!subCategory) {
      Alert.alert('Missing Subcategory', 'Please select a subcategory for this item');
      return false;
    }
    
    return true;
  };

  const handleSave = async () => {
    //if (!validateForm()) return;
    
    setIsSaving(true);
    
    try {
      const newItem: InventoryItem = {
        category: category!,
        subCategory: subCategory!,
        attributes: {
          color: color || undefined,
          brand: brand || undefined,
          material: material || undefined,
          size: size || undefined,
          season: selectedSeasons.length > 0 ? selectedSeasons : undefined,
          occasions: selectedOccasions.length > 0 ? selectedOccasions : undefined,
          style: selectedStyles.length > 0 ? selectedStyles : undefined,
        },
        imageUrls: [],
      };
      
      await addItem(newItem, imageUri!);
      router.back();
    } catch (error) {
      console.error('Failed to save item:', error);
      Alert.alert('Error', 'Failed to save item. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        title: 'Add Clothing Item',
        headerBackTitle: 'Cancel',
      }} />
      
      <ScrollView style={styles.scrollContainer}>
        {/* Image Selection */}
        <View style={styles.imageContainer}>
          {imageUri ? (
            <View style={styles.imagePreviewContainer}>
              <Image 
                source={{ uri: imageUri }} 
                style={styles.imagePreview} 
                resizeMode="cover"
              />
              <TouchableOpacity 
                style={styles.changeImageButton} 
                onPress={() => setImageUri(null)}
              >
                <Ionicons name="refresh-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.imagePlaceholder}>
              <TouchableOpacity 
                style={styles.mediaButton} 
                onPress={handleTakePhoto}
              >
                <Ionicons name="camera-outline" size={30} color={Colors[colorScheme ?? 'light'].primary} />
                <Text style={styles.mediaButtonText}>Take Photo</Text>
              </TouchableOpacity>
              
              <Text style={styles.orText}>or</Text>
              
              <TouchableOpacity 
                style={styles.mediaButton} 
                onPress={handlePickImage}
              >
                <Ionicons name="image-outline" size={30} color={Colors[colorScheme ?? 'light'].primary} />
                <Text style={styles.mediaButtonText}>Choose from Gallery</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        {/* Form Fields */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          {/* Category */}
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Category *</Text>
            <DropDownPicker
              open={categoryOpen}
              value={category}
              items={CATEGORIES.map(cat => ({ label: cat.charAt(0).toUpperCase() + cat.slice(1), value: cat }))}
              setOpen={setCategoryOpen}
              setValue={setCategory}
              placeholder="Select a category"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              zIndex={3000}
              zIndexInverse={1000}
            />
          </View>
          
          {/* Subcategory */}
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Subcategory *</Text>
            <DropDownPicker
              open={subCategoryOpen}
              value={subCategory}
              items={subCategories.map(subCat => ({ label: subCat.charAt(0).toUpperCase() + subCat.slice(1), value: subCat }))}
              setOpen={setSubCategoryOpen}
              setValue={setSubCategory}
              placeholder="Select a subcategory"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              disabled={!category}
              zIndex={2000}
              zIndexInverse={2000}
            />
          </View>
          
          {/* Brand */}
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Brand</Text>
            <TextInput
              style={styles.textInput}
              value={brand}
              onChangeText={setBrand}
              placeholder="Enter brand name"
            />
          </View>
          
          {/* Size */}
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Size</Text>
            <TextInput
              style={styles.textInput}
              value={size}
              onChangeText={setSize}
              placeholder="Enter size (S, M, L, 32, etc.)"
            />
          </View>
        </View>
        
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Attributes</Text>
          
          {/* Color */}
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Color</Text>
            <DropDownPicker
              open={colorOpen}
              value={color}
              items={COLORS.map(col => ({ label: col.charAt(0).toUpperCase() + col.slice(1), value: col }))}
              setOpen={setColorOpen}
              setValue={setColor}
              placeholder="Select a color"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              zIndex={1900}
              zIndexInverse={2100}
            />
          </View>
          
          {/* Material */}
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Material</Text>
            <DropDownPicker
              open={materialOpen}
              value={material}
              items={MATERIALS.map(mat => ({ label: mat.charAt(0).toUpperCase() + mat.slice(1), value: mat }))}
              setOpen={setMaterialOpen}
              setValue={setMaterial}
              placeholder="Select a material"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              zIndex={1800}
              zIndexInverse={2200}
            />
          </View>
          
          {/* Seasons */}
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Seasons</Text>
            <DropDownPicker
              open={seasonsOpen}
              value={selectedSeasons}
              items={SEASONS.map(season => ({ label: season.charAt(0).toUpperCase() + season.slice(1), value: season }))}
              setOpen={setSeasonsOpen}
              setValue={setSelectedSeasons}
              placeholder="Select seasons"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              multiple={true}
              zIndex={1700}
              zIndexInverse={2300}
            />
          </View>
          
          {/* Occasions */}
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Occasions</Text>
            <DropDownPicker
              open={occasionsOpen}
              value={selectedOccasions}
              items={OCCASIONS.map(occ => ({ label: occ.charAt(0).toUpperCase() + occ.slice(1), value: occ }))}
              setOpen={setOccasionsOpen}
              setValue={setSelectedOccasions}
              placeholder="Select occasions"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              multiple={true}
              zIndex={1600}
              zIndexInverse={2400}
            />
          </View>
          
          {/* Styles */}
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Styles</Text>
            <DropDownPicker
              open={stylesOpen}
              value={selectedStyles}
              items={STYLES.map(style => ({ label: style.charAt(0).toUpperCase() + style.slice(1), value: style }))}
              setOpen={setStylesOpen}
              setValue={setSelectedStyles}
              placeholder="Select styles"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              multiple={true}
              zIndex={1500}
              zIndexInverse={2500}
            />
          </View>
        </View>
      </ScrollView>
      
      {/* Save Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: Colors[colorScheme ?? 'light'].primary }
          ]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <Ionicons name="save-outline" size={20} color="white" />
              <Text style={styles.saveButtonText}>Save Item</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
  },
  imageContainer: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#eee',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 20,
  },
  mediaButton: {
    alignItems: 'center',
    padding: 15,
  },
  mediaButtonText: {
    marginTop: 8,
    color: '#666',
  },
  orText: {
    marginHorizontal: 20,
    color: '#999',
  },
  imagePreviewContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
    borderRadius: 10,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  changeImageButton: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  formField: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  dropdown: {
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dropdownContainer: {
    borderColor: '#ddd',
  },
  bottomBar: {
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  saveButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 