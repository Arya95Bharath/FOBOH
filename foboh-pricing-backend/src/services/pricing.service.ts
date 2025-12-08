import { randomUUID } from 'crypto';
import { PricingProfile, CalculatedPrice } from '../models/pricing-profile.model';
import { productsService } from './products.service';
import { calculationService } from './calculation.service';

export class PricingService {
  private profiles: PricingProfile[] = [];

  getAllProfiles(): PricingProfile[] {
    return [...this.profiles];
  }

  getProfileById(id: string): PricingProfile | undefined {
    return this.profiles.find((p) => p.id === id);
  }

  createProfile(data: Omit<PricingProfile, 'id' | 'createdAt' | 'updatedAt'>): PricingProfile {
    // Validate selected products exist
    const products = productsService.getProductsByIds(data.selectedProducts);
    if (products.length !== data.selectedProducts.length) {
      throw new Error('One or more selected products do not exist');
    }

    // Validate adjustment value
    if (data.adjustmentValue <= 0) {
      throw new Error('Adjustment value must be greater than 0');
    }

    // Validate basedOn profile exists (if not "global")
    if (data.basedOn !== 'global') {
      const baseProfile = this.getProfileById(data.basedOn);
      if (!baseProfile) {
        throw new Error('Base profile does not exist');
      }
    }

    const now = new Date().toISOString();
    const profile: PricingProfile = {
      id: randomUUID(),  // Changed this line
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    this.profiles.push(profile);
    return profile;
  }

  // ... rest of the code stays the same
  updateProfile(id: string, data: Partial<Omit<PricingProfile, 'id' | 'createdAt'>>): PricingProfile {
    const index = this.profiles.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error('Pricing profile not found');
    }

    // Validate if updating selected products
    if (data.selectedProducts) {
      const products = productsService.getProductsByIds(data.selectedProducts);
      if (products.length !== data.selectedProducts.length) {
        throw new Error('One or more selected products do not exist');
      }
    }

    // Validate adjustment value if provided
    if (data.adjustmentValue !== undefined && data.adjustmentValue <= 0) {
      throw new Error('Adjustment value must be greater than 0');
    }

    const updatedProfile = {
      ...this.profiles[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    this.profiles[index] = updatedProfile;
    return updatedProfile;
  }

  deleteProfile(id: string): boolean {
    const index = this.profiles.findIndex((p) => p.id === id);
    if (index === -1) {
      return false;
    }
    this.profiles.splice(index, 1);
    return true;
  }

  calculatePrices(
    basedOn: string,
    adjustmentType: 'fixed' | 'dynamic',
    adjustmentMode: 'increase' | 'decrease',
    adjustmentValue: number,
    productIds: string[]
  ): CalculatedPrice[] {
    // Validate adjustment value
    if (adjustmentValue <= 0) {
      throw new Error('Adjustment value must be greater than 0');
    }

    // Get products
    const products = productsService.getProductsByIds(productIds);
    if (products.length === 0) {
      throw new Error('No valid products selected');
    }

    // Calculate prices for each product
    return products.map((product) => {
      // Determine base price
      let basedOnPrice = product.globalWholesalePrice;

      if (basedOn !== 'global') {
        // If based on another profile, calculate that profile's price first
        const baseProfile = this.getProfileById(basedOn);
        if (baseProfile) {
          const baseCalc = calculationService.calculatePrice(
            product.globalWholesalePrice,
            baseProfile.adjustmentType,
            baseProfile.adjustmentMode,
            baseProfile.adjustmentValue
          );
          basedOnPrice = baseCalc.newPrice;
        }
      }

      // Calculate new price
      const result = calculationService.calculatePrice(
        basedOnPrice,
        adjustmentType,
        adjustmentMode,
        adjustmentValue
      );

      return {
        productId: product.id,
        productTitle: product.title,
        skuCode: product.skuCode,
        category: product.subCategoryId,
        basedOnPrice: basedOnPrice,
        adjustmentValue: result.adjustment,
        newPrice: result.newPrice,
      };
    });
  }
}

export const pricingService = new PricingService();