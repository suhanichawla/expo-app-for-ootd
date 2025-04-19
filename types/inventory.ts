export interface Attribute {
  color?: string;
  pattern?: string;
  material?: string;
  brand?: string;
  size?: string;
  season?: string[];
  style?: string[];
  occasions?: string[];
}

export interface Metadata {
  purchaseDate?: Date;
  retired?: boolean;
  retiredDate?: Date;
  favorite?: boolean;
  tags?: string[];
}

export interface Stats {
  timesWorn?: number;
  lastWorn?: Date;
  averageRating?: number;
}

export interface InventoryItem {
  id?: string;
  userId?: string;
  category: string;
  subCategory: string;
  attributes: Attribute;
  imageUrls: string[];
  metadata?: Metadata;
  stats?: Stats;
  createdAt?: Date;
  updatedAt?: Date;
  // Local properties
  isUploading?: boolean;
  localImageUri?: string;
}

export type Category = 'top' | 'bottom' | 'outerwear' | 'accessory' | 'shoes' | 'other';
export type Season = 'spring' | 'summer' | 'fall' | 'winter';

// Constants for form options
export const CATEGORIES: Category[] = ['top', 'bottom', 'outerwear', 'accessory', 'shoes', 'other'];
export const SUBCATEGORIES = {
  top: ['t-shirt', 'shirt', 'blouse', 'sweater', 'tank top'],
  bottom: ['jeans', 'pants', 'shorts', 'skirt', 'leggings'],
  outerwear: ['jacket', 'coat', 'hoodie', 'cardigan'],
  accessory: ['hat', 'scarf', 'jewelry', 'bag', 'belt', 'sunglasses'],
  shoes: ['sneakers', 'boots', 'sandals', 'dress shoes', 'flats', 'heels'],
  other: ['pajamas', 'swimwear', 'costume']
};
export const SEASONS: Season[] = ['spring', 'summer', 'fall', 'winter'];
export const COLORS = ['black', 'white', 'red', 'blue', 'green', 'yellow', 'purple', 'pink', 'brown', 'gray', 'orange', 'multicolor'];
export const MATERIALS = ['cotton', 'polyester', 'wool', 'linen', 'denim', 'leather', 'silk', 'nylon', 'spandex', 'other'];
export const OCCASIONS = ['casual', 'formal', 'work', 'athletic', 'beach', 'party', 'travel'];
export const STYLES = ['classic', 'vintage', 'streetwear', 'bohemian', 'minimal', 'preppy', 'athleisure', 'formal']; 