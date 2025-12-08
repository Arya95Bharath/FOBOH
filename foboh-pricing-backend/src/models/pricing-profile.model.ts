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