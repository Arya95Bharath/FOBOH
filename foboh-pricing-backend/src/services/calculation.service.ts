export class CalculationService {
  calculatePrice(
    basedOnPrice: number,
    adjustmentType: 'fixed' | 'dynamic',
    adjustmentMode: 'increase' | 'decrease',
    adjustmentValue: number
  ): { adjustment: number; newPrice: number } {
    let adjustment: number;
    let newPrice: number;

    if (adjustmentType === 'fixed') {
      // Fixed adjustment: add or subtract dollar amount
      adjustment = adjustmentMode === 'increase' ? adjustmentValue : -adjustmentValue;
      newPrice = basedOnPrice + adjustment;
    } else {
      // Dynamic adjustment: add or subtract percentage
      const percentageAmount = basedOnPrice * (adjustmentValue / 100);
      adjustment = adjustmentMode === 'increase' ? percentageAmount : -percentageAmount;
      newPrice = basedOnPrice + adjustment;
    }

    // Prevent negative prices
    if (newPrice < 0) {
      throw new Error('Calculated price cannot be negative. Adjustment value is too large.');
    }

    // Round to 2 decimal places
    return {
      adjustment: Math.round(adjustment * 100) / 100,
      newPrice: Math.round(newPrice * 100) / 100,
    };
  }
}

export const calculationService = new CalculationService();