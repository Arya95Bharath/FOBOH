import { calculateNewPrice, formatCurrency, formatAdjustment } from '../../utils/priceCalculation';

describe('Price Calculation Utils', () => {
  describe('calculateNewPrice', () => {
    describe('Fixed Adjustments', () => {
      test('should calculate fixed increase correctly', () => {
        const result = calculateNewPrice(100, 'fixed', 'increase', 10);
        
        expect(result.adjustment).toBe(10);
        expect(result.newPrice).toBe(110);
      });

      test('should calculate fixed decrease correctly', () => {
        const result = calculateNewPrice(100, 'fixed', 'decrease', 10);
        
        expect(result.adjustment).toBe(-10);
        expect(result.newPrice).toBe(90);
      });

      test('should handle decimal values', () => {
        const result = calculateNewPrice(279.06, 'fixed', 'increase', 5.50);
        
        expect(result.adjustment).toBe(5.50);
        expect(result.newPrice).toBe(284.56);
      });
    });

    describe('Dynamic Adjustments (Percentage)', () => {
      test('should calculate dynamic increase correctly', () => {
        const result = calculateNewPrice(100, 'dynamic', 'increase', 20);
        
        expect(result.adjustment).toBe(20);
        expect(result.newPrice).toBe(120);
      });

      test('should calculate dynamic decrease correctly', () => {
        const result = calculateNewPrice(100, 'dynamic', 'decrease', 20);
        
        expect(result.adjustment).toBe(-20);
        expect(result.newPrice).toBe(80);
      });

      test('should calculate 10% decrease on real product price', () => {
        const result = calculateNewPrice(279.06, 'dynamic', 'decrease', 10);
        
        expect(result.adjustment).toBe(-27.91);
        expect(result.newPrice).toBe(251.15);
      });

      test('should handle 50% increase', () => {
        const result = calculateNewPrice(120, 'dynamic', 'increase', 50);
        
        expect(result.adjustment).toBe(60);
        expect(result.newPrice).toBe(180);
      });
    });

    describe('Rounding', () => {
      test('should round to 2 decimal places', () => {
        const result = calculateNewPrice(100.33, 'dynamic', 'increase', 33.33);
        
        // 100.33 + 33.33% = 100.33 + 33.44 = 133.77
        expect(result.newPrice).toBe(133.77);
        expect(result.adjustment).toBe(33.44);
      });
    });

    describe('Real-world scenarios', () => {
      test('VIP discount: 10% off High Garden Pinot Noir', () => {
        const result = calculateNewPrice(279.06, 'dynamic', 'decrease', 10);
        
        expect(result.adjustment).toBe(-27.91);
        expect(result.newPrice).toBe(251.15);
      });

      test('Premium markup: $15 increase', () => {
        const result = calculateNewPrice(120, 'fixed', 'increase', 15);
        
        expect(result.adjustment).toBe(15);
        expect(result.newPrice).toBe(135);
      });

      test('Seasonal sale: 25% off', () => {
        const result = calculateNewPrice(215.04, 'dynamic', 'decrease', 25);
        
        expect(result.adjustment).toBe(-53.76);
        expect(result.newPrice).toBe(161.28);
      });
    });
  });

  describe('formatCurrency', () => {
    test('should format whole numbers', () => {
      expect(formatCurrency(100)).toBe('$100.00');
    });

    test('should format decimal numbers', () => {
      expect(formatCurrency(279.06)).toBe('$279.06');
    });

    test('should round to 2 decimal places', () => {
      expect(formatCurrency(100.999)).toBe('$101.00');
    });

    test('should handle zero', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });
  });

  describe('formatAdjustment', () => {
    test('should format positive adjustments with + sign', () => {
      expect(formatAdjustment(10.50)).toBe('+$10.50');
    });

    test('should format negative adjustments with - sign', () => {
      expect(formatAdjustment(-27.91)).toBe('-$27.91');
    });

    test('should handle zero', () => {
      expect(formatAdjustment(0)).toBe('+$0.00');
    });
  });
});