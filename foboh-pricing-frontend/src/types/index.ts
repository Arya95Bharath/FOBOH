export interface Product {
  id: string;
  title: string;
  skuCode: string;
  brand: string;
  categoryId: string;
  subCategoryId: string;
  segmentId: string;
  globalWholesalePrice: number;
  selected?: boolean; // UI state
}

export interface PricingProfile {
  id: string;
  name: string;
  description?: string;
  basedOn: string;
  adjustmentType: 'fixed' | 'dynamic';
  adjustmentMode: 'increase' | 'decrease';
  adjustmentValue: number;
  selectedProducts: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CalculatedPrice {
  productId: string;
  productTitle: string;
  skuCode: string;
  category: string;
  basedOnPrice: number;
  adjustmentValue: number;
  newPrice: number;
}

export interface PricingConfiguration {
  profileName: string;
  basedOn: string;
  adjustmentType: 'fixed' | 'dynamic';
  adjustmentMode: 'increase' | 'decrease';
  adjustmentValue: number | string;
}

export interface ReferenceData {
  subCategories: string[];
  segments: string[];
  brands: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  error?: string;
  details?: string;
}