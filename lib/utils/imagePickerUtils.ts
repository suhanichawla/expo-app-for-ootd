import * as ImagePicker from 'expo-image-picker';

/**
 * Request permissions for camera and media library
 */
export const requestMediaPermissions = async (): Promise<boolean> => {
  // Request camera permission
  const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
  
  // Request media library permission
  const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
  return cameraPermission.status === 'granted' && mediaLibraryPermission.status === 'granted';
};

/**
 * Take a photo using the device camera
 */
export const takePicture = async (): Promise<string | null> => {
  try {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      return result.assets[0].uri;
    }
    
    return null;
  } catch (error) {
    console.error('Error taking picture:', error);
    return null;
  }
};

/**
 * Select an image from the device media library
 */
export const pickImage = async (): Promise<string | null> => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      return result.assets[0].uri;
    }
    
    return null;
  } catch (error) {
    console.error('Error picking image:', error);
    return null;
  }
}; 