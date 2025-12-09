import { calculationService } from '../../services/calculation.service';

describe('CalculationService', () => {
  describe('Fixed Adjustment', () => {
    test('should calculate fixed increase correctly', () => {
      const result = calculationService.calculatePrice(500, 'fixed', 'increase', 20);
      
      expect(result.adjustment).toBe(20);
      expect(result.newPrice).toBe(520);
    });

    test('should calculate fixed decrease correctly', () => {
      const result = calculationService.calculatePrice(500, 'fixed', 'decrease', 20);
      
      expect(result.adjustment).toBe(-20);
      expect(result.newPrice).toBe(480);
    });

    test('should handle decimal fixed increase', () => {
      const result = calculationService.calculatePrice(279.06, 'fixed', 'increase', 5.50);
      
      expect(result.adjustment).toBe(5.50);
      expect(result.newPrice).toBe(284.56);
    });

    test('should handle decimal fixed decrease', () => {
      const result = calculationService.calculatePrice(279.06, 'fixed', 'decrease', 5.50);
      
      expect(result.adjustment).toBe(-5.50);
      expect(result.newPrice).toBe(273.56);
    });
  });

  describe('Dynamic Adjustment (Percentage)', () => {
    test('should calculate dynamic increase correctly', () => {
      const result = calculationService.calculatePrice(500, 'dynamic', 'increase', 20);
      
      expect(result.adjustment).toBe(100);
      expect(result.newPrice).toBe(600);
    });

    test('should calculate dynamic decrease correctly', () => {
      const result = calculationService.calculatePrice(500, 'dynamic', 'decrease', 20);
      
      expect(result.adjustment).toBe(-100);
      expect(result.newPrice).toBe(400);
    });

    test('should calculate 10% decrease correctly', () => {
      const result = calculationService.calculatePrice(279.06, 'dynamic', 'decrease', 10);
      
      expect(result.adjustment).toBe(-27.91);
      expect(result.newPrice).toBe(251.15);
    });

    test('should calculate 50% increase correctly', () => {
      const result = calculationService.calculatePrice(120, 'dynamic', 'increase', 50);
      
      expect(result.adjustment).toBe(60);
      expect(result.newPrice).toBe(180);
    });

    test('should calculate 100% increase (double price)', () => {
      const result = calculationService.calculatePrice(100, 'dynamic', 'increase', 100);
      
      expect(result.adjustment).toBe(100);
      expect(result.newPrice).toBe(200);
    });
  });

  describe('Edge Cases', () => {
    test('should throw error for negative price result', () => {
      expect(() => {
        calculationService.calculatePrice(10, 'fixed', 'decrease', 20);
      }).toThrow('Calculated price cannot be negative');
    });

    test('should throw error for 100% decrease', () => {
      expect(() => {
        calculationService.calculatePrice(100, 'dynamic', 'decrease', 100);
      }).toThrow('Calculated price cannot be negative');
    });

    test('should throw error for >100% decrease', () => {
      expect(() => {
        calculationService.calculatePrice(100, 'dynamic', 'decrease', 150);
      }).toThrow('Calculated price cannot be negative');
    });

    test('should handle very small adjustments', () => {
      const result = calculationService.calculatePrice(100, 'fixed', 'increase', 0.01);
      
      expect(result.adjustment).toBe(0.01);
      expect(result.newPrice).toBe(100.01);
    });

    test('should handle 1% dynamic adjustment', () => {
      const result = calculationService.calculatePrice(100, 'dynamic', 'increase', 1);
      
      expect(result.adjustment).toBe(1);
      expect(result.newPrice).toBe(101);
    });

    test('should round to 2 decimal places', () => {
      const result = calculationService.calculatePrice(100.33, 'dynamic', 'increase', 33.33);
      
      // 100.33 + 33.33% = 100.33 + 33.44 = 133.77
      expect(result.newPrice).toBe(133.77);
    });
  });

  describe('Real World Scenarios', () => {
    test('VIP discount: 10% off on High Garden Pinot Noir', () => {
      const result = calculationService.calculatePrice(279.06, 'dynamic', 'decrease', 10);
      
      expect(result.adjustment).toBe(-27.91);
      expect(result.newPrice).toBe(251.15);
    });

    test('Premium markup: $15 increase on Koyama Methode', () => {
      const result = calculationService.calculatePrice(120, 'fixed', 'increase', 15);
      
      expect(result.adjustment).toBe(15);
      expect(result.newPrice).toBe(135);
    });

    test('Seasonal sale: 25% off on all wines', () => {
      const result = calculationService.calculatePrice(215.04, 'dynamic', 'decrease', 25);
      
      expect(result.adjustment).toBe(-53.76);
      expect(result.newPrice).toBe(161.28);
    });

    test('Bulk order discount: $50 off on premium wines', () => {
      const result = calculationService.calculatePrice(409.32, 'fixed', 'decrease', 50);
      
      expect(result.adjustment).toBe(-50);
      expect(result.newPrice).toBe(359.32);
    });
  });
});