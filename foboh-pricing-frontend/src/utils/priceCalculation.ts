export function calculateNewPrice(
  basedOnPrice: number,
  adjustmentType: 'fixed' | 'dynamic',
  adjustmentMode: 'increase' | 'decrease',
  adjustmentValue: number
): { adjustment: number; newPrice: number } {
  let adjustment: number;
  let newPrice: number;

  if (adjustmentType === 'fixed') {
    adjustment = adjustmentMode === 'increase' ? adjustmentValue : -adjustmentValue;
    newPrice = basedOnPrice + adjustment;
  } else {
    // Dynamic (percentage)
    const percentageAmount = basedOnPrice * (adjustmentValue / 100);
    adjustment = adjustmentMode === 'increase' ? percentageAmount : -percentageAmount;
    newPrice = basedOnPrice + adjustment;
  }

  // Round to 2 decimal places
  return {
    adjustment: Math.round(adjustment * 100) / 100,
    newPrice: Math.round(newPrice * 100) / 100,
  };
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function formatAdjustment(adjustment: number): string {
  const sign = adjustment >= 0 ? '+' : '';
  return `${sign}${formatCurrency(adjustment)}`;
}