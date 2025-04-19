import { Redirect } from 'expo-router';

export default function WardrobeTab() {
  // Redirect to the protected wardrobe screen
  return <Redirect href="/(protected)/wardrobe" />;
} 