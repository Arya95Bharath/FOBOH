import { PricingService } from '../../services/pricing.service';
import { ProductsService } from '../../services/products.service';

describe('PricingService', () => {
  let pricingService: PricingService;
  let productsService: ProductsService;
  let testProductIds: string[];

  beforeEach(() => {
    pricingService = new PricingService();
    productsService = new ProductsService();
    
    // Get real product IDs for testing
    const products = productsService.getAllProducts();
    testProductIds = products.map(p => p.id);
  });

  describe('createProfile', () => {
    test('should create a pricing profile successfully', () => {
      const profile = pricingService.createProfile({
        name: 'Test Discount',
        description: 'Test description',
        basedOn: 'global',
        adjustmentType: 'dynamic',
        adjustmentMode: 'decrease',
        adjustmentValue: 10,
        selectedProducts: [testProductIds[0]],
      });

      expect(profile).toHaveProperty('id');
      expect(profile.name).toBe('Test Discount');
      expect(profile.adjustmentValue).toBe(10);
      expect(profile).toHaveProperty('createdAt');
      expect(profile).toHaveProperty('updatedAt');
    });

    test('should throw error for invalid product IDs', () => {
      expect(() => {
        pricingService.createProfile({
          name: 'Test',
          basedOn: 'global',
          adjustmentType: 'fixed',
          adjustmentMode: 'increase',
          adjustmentValue: 10,
          selectedProducts: ['invalid-id'],
        });
      }).toThrow('One or more selected products do not exist');
    });

    test('should throw error for zero adjustment value', () => {
      expect(() => {
        pricingService.createProfile({
          name: 'Test',
          basedOn: 'global',
          adjustmentType: 'fixed',
          adjustmentMode: 'increase',
          adjustmentValue: 0,
          selectedProducts: [testProductIds[0]],
        });
      }).toThrow('Adjustment value must be greater than 0');
    });

    test('should throw error for negative adjustment value', () => {
      expect(() => {
        pricingService.createProfile({
          name: 'Test',
          basedOn: 'global',
          adjustmentType: 'fixed',
          adjustmentMode: 'increase',
          adjustmentValue: -10,
          selectedProducts: [testProductIds[0]],
        });
      }).toThrow('Adjustment value must be greater than 0');
    });
  });

  describe('getAllProfiles', () => {
    test('should return empty array initially', () => {
      const profiles = pricingService.getAllProfiles();
      expect(profiles).toHaveLength(0);
    });

    test('should return all created profiles', () => {
      pricingService.createProfile({
        name: 'Profile 1',
        basedOn: 'global',
        adjustmentType: 'fixed',
        adjustmentMode: 'increase',
        adjustmentValue: 5,
        selectedProducts: [testProductIds[0]],
      });

      pricingService.createProfile({
        name: 'Profile 2',
        basedOn: 'global',
        adjustmentType: 'dynamic',
        adjustmentMode: 'decrease',
        adjustmentValue: 10,
        selectedProducts: [testProductIds[1]],
      });

      const profiles = pricingService.getAllProfiles();
      expect(profiles).toHaveLength(2);
    });
  });

  describe('getProfileById', () => {
    test('should return profile by ID', () => {
      const created = pricingService.createProfile({
        name: 'Test',
        basedOn: 'global',
        adjustmentType: 'fixed',
        adjustmentMode: 'increase',
        adjustmentValue: 10,
        selectedProducts: [testProductIds[0]],
      });

      const found = pricingService.getProfileById(created.id);
      
      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    test('should return undefined for non-existent ID', () => {
      const found = pricingService.getProfileById('non-existent');
      expect(found).toBeUndefined();
    });
  });

  describe('updateProfile', () => {
    
    test('should update profile successfully', async () => {
        const created = pricingService.createProfile({
            name: 'Original Name',
            basedOn: 'global',
            adjustmentType: 'fixed',
            adjustmentMode: 'increase',
            adjustmentValue: 10,
            selectedProducts: [testProductIds[0]],
        });

        // Add a small delay to ensure timestamp is different
        await new Promise(resolve => setTimeout(resolve, 10));

        const updated = pricingService.updateProfile(created.id, {
            name: 'Updated Name',
            adjustmentValue: 20,
        });

        expect(updated.name).toBe('Updated Name');
        expect(updated.adjustmentValue).toBe(20);
        expect(updated.id).toBe(created.id);
        // Verify updatedAt is a valid ISO string
        expect(updated.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
        });

    test('should throw error for non-existent profile', () => {
      expect(() => {
        pricingService.updateProfile('non-existent', { name: 'Test' });
      }).toThrow('Pricing profile not found');
    });

    test('should throw error for invalid adjustment value', () => {
      const created = pricingService.createProfile({
        name: 'Test',
        basedOn: 'global',
        adjustmentType: 'fixed',
        adjustmentMode: 'increase',
        adjustmentValue: 10,
        selectedProducts: [testProductIds[0]],
      });

      expect(() => {
        pricingService.updateProfile(created.id, { adjustmentValue: 0 });
      }).toThrow('Adjustment value must be greater than 0');
    });
  });

  describe('deleteProfile', () => {
    test('should delete profile successfully', () => {
      const created = pricingService.createProfile({
        name: 'Test',
        basedOn: 'global',
        adjustmentType: 'fixed',
        adjustmentMode: 'increase',
        adjustmentValue: 10,
        selectedProducts: [testProductIds[0]],
      });

      const deleted = pricingService.deleteProfile(created.id);
      expect(deleted).toBe(true);

      const found = pricingService.getProfileById(created.id);
      expect(found).toBeUndefined();
    });

    test('should return false for non-existent profile', () => {
      const deleted = pricingService.deleteProfile('non-existent');
      expect(deleted).toBe(false);
    });
  });

  describe('calculatePrices', () => {
    test('should calculate prices for selected products', () => {
      const calculated = pricingService.calculatePrices(
        'global',
        'dynamic',
        'decrease',
        10,
        [testProductIds[0]]
      );

      expect(calculated).toHaveLength(1);
      expect(calculated[0]).toHaveProperty('productId');
      expect(calculated[0]).toHaveProperty('basedOnPrice');
      expect(calculated[0]).toHaveProperty('adjustmentValue');
      expect(calculated[0]).toHaveProperty('newPrice');
    });

    test('should throw error for invalid adjustment value', () => {
      expect(() => {
        pricingService.calculatePrices('global', 'fixed', 'increase', 0, [testProductIds[0]]);
      }).toThrow('Adjustment value must be greater than 0');
    });

    test('should throw error for empty product array', () => {
      expect(() => {
        pricingService.calculatePrices('global', 'fixed', 'increase', 10, []);
      }).toThrow('No valid products selected');
    });

    test('should calculate for multiple products', () => {
      const calculated = pricingService.calculatePrices(
        'global',
        'dynamic',
        'decrease',
        10,
        [testProductIds[0], testProductIds[1], testProductIds[2]]
      );

      expect(calculated).toHaveLength(3);
    });
  });
});