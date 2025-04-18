import * as Linking from 'expo-linking';

/**
 * Parse shared content from various sources
 */
export interface SharedContent {
  url?: string;
  text?: string;
  title?: string;
  source?: string;
}

/**
 * Process incoming shared URL
 */
export function parseUrlParams(url: string): SharedContent {
  try {
    const { queryParams, path } = Linking.parse(url);
    
    // Parse the shared content from query parameters
    return {
      url: queryParams?.url as string,
      text: queryParams?.text as string,
      title: queryParams?.title as string,
      source: queryParams?.source as string || getSourceFromUrl(queryParams?.url as string),
    };
  } catch (error) {
    console.error('Error parsing URL params:', error);
    return {};
  }
}

/**
 * Try to determine the source of shared content
 */
function getSourceFromUrl(url?: string): string | undefined {
  if (!url) return undefined;
  
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    
    // Check for known hostnames
    if (hostname.includes('instagram.com')) return 'Instagram';
    if (hostname.includes('tiktok.com')) return 'TikTok';
    if (hostname.includes('facebook.com')) return 'Facebook';
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) return 'X/Twitter';
    
    // Return the domain as fallback
    return hostname;
  } catch (error) {
    console.error('Error parsing URL:', error);
    return undefined;
  }
}

/**
 * Save the shared content to your app's storage
 */
export async function saveSharedContent(content: SharedContent): Promise<boolean> {
  try {
    // Here you would implement your app-specific storage logic
    // For example, saving to AsyncStorage, a database, or sending to a server
    
    console.log('Saving shared content:', content);
    
    // Sample implementation (replace with actual storage logic)
    const savedSuccessfully = true;
    
    return savedSuccessfully;
  } catch (error) {
    console.error('Error saving shared content:', error);
    return false;
  }
} 