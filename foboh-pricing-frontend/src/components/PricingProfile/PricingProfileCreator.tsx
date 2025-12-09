import React, { useState, useEffect, useCallback } from 'react';
import { Product, CalculatedPrice, ReferenceData } from '../../types';
import { productsAPI, pricingAPI, referenceAPI } from '../../services/api';
import { formatCurrency, formatAdjustment } from '../../utils/priceCalculation';

export const PricingProfileCreator: React.FC = () => {
  // State for products
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [subCategoryFilter, setSubCategoryFilter] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('');

  // State for reference data
  const [referenceData, setReferenceData] = useState<ReferenceData>({
    subCategories: [],
    segments: [],
    brands: [],
  });

  // State for pricing configuration
  const [selectionType, setSelectionType] = useState<'one' | 'multiple' | 'all'>('multiple');
  const [profileName, setProfileName] = useState('');
  const [basedOn, setBasedOn] = useState('global');
  const [adjustmentType, setAdjustmentType] = useState<'fixed' | 'dynamic'>('dynamic');
  const [adjustmentMode, setAdjustmentMode] = useState<'increase' | 'decrease'>('decrease');
  const [adjustmentValue, setAdjustmentValue] = useState<string>('10');

  // State for calculated prices
  const [calculatedPrices, setCalculatedPrices] = useState<CalculatedPrice[]>([]);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load products and reference data on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = [...allProducts];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.title.toLowerCase().includes(query) ||
          p.skuCode.toLowerCase().includes(query)
      );
    }

    if (brandFilter) {
      filtered = filtered.filter(p => p.brand === brandFilter);
    }

    if (subCategoryFilter) {
      filtered = filtered.filter(p => p.subCategoryId === subCategoryFilter);
    }

    if (segmentFilter) {
      filtered = filtered.filter(p => p.segmentId === segmentFilter);
    }

    setFilteredProducts(filtered);
  }, [searchQuery, brandFilter, subCategoryFilter, segmentFilter, allProducts]);

  // Apply filters whenever they change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Handle selection type change
  useEffect(() => {
    if (selectionType === 'all') {
      setSelectedProductIds(filteredProducts.map(p => p.id));
    } else if (selectionType === 'one') {
      setSelectedProductIds([]);
    }
  }, [selectionType, filteredProducts]);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [productsResponse, referenceResponse] = await Promise.all([
        productsAPI.getAll(),
        referenceAPI.getCategories(),
      ]);

      setAllProducts(productsResponse.data);
      setFilteredProducts(productsResponse.data);
      setReferenceData(referenceResponse.data);
    } catch (err) {
      setError('Failed to load data. Please make sure the backend is running on port 3001.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductSelect = (productId: string) => {
    if (selectionType === 'one') {
      setSelectedProductIds([productId]);
    } else if (selectionType === 'multiple') {
      setSelectedProductIds(prev =>
        prev.includes(productId)
          ? prev.filter(id => id !== productId)
          : [...prev, productId]
      );
    }
  };

  const handleSelectAll = () => {
    if (selectedProductIds.length === filteredProducts.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredProducts.map(p => p.id));
    }
  };

  const handleRecalculate = async () => {
    setError(null);
    
    if (selectedProductIds.length === 0) {
      setError('Please select at least one product');
      return;
    }

    const adjValue = parseFloat(adjustmentValue);
    if (isNaN(adjValue) || adjValue <= 0) {
      setError('Adjustment value must be a positive number');
      return;
    }

    setIsCalculating(true);
    try {
      const response = await pricingAPI.calculatePrices({
        basedOn,
        adjustmentType,
        adjustmentMode,
        adjustmentValue: adjValue,
        productIds: selectedProductIds,
      });

      setCalculatedPrices(response.data);
      setSuccessMessage('Prices calculated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.details || 'Failed to calculate prices');
      console.error(err);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSaveProfile = async () => {
    setError(null);

    if (!profileName.trim()) {
      setError('Please enter a profile name');
      return;
    }

    if (calculatedPrices.length === 0) {
      setError('Please calculate prices before saving');
      return;
    }

    setIsSaving(true);
    try {
      await pricingAPI.createProfile({
        name: profileName,
        basedOn,
        adjustmentType,
        adjustmentMode,
        adjustmentValue: parseFloat(adjustmentValue),
        selectedProducts: selectedProductIds,
      });

      setSuccessMessage('Pricing profile saved successfully!');
      setTimeout(() => {
        setSuccessMessage(null);
        handleReset();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.details || 'Failed to save profile');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setBrandFilter('');
    setSubCategoryFilter('');
    setSegmentFilter('');
    setSelectedProductIds([]);
    setProfileName('');
    setBasedOn('global');
    setAdjustmentType('dynamic');
    setAdjustmentMode('decrease');
    setAdjustmentValue('10');
    setCalculatedPrices([]);
    setError(null);
  };

  const getCalculatedPriceForProduct = (productId: string): CalculatedPrice | undefined => {
    return calculatedPrices.find(cp => cp.productId === productId);
  };

  if (isLoading) {
    return (
      <div className="loading">
        <div>Loading</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="max-width-container">
        <div className="card">
          {/* Header */}
          <div>
            <h1>Create Pricing Profile</h1>
            <p className="subtitle">Setup your pricing profile, select products and configure price adjustments</p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="alert alert-success">
              {successMessage}
            </div>
          )}

          {/* Basic Profile Info Section */}
          <div className="section">
            <div className="section-title">
              <span>Basic Pricing Profile</span>
            </div>
            <div className="section-description">Create a descriptive name for this pricing profile</div>
            
            <div className="form-group">
              <label>Profile Name</label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="e.g., VIP Customer Discount"
              />
            </div>
          </div>

          {/* Product Selection Section */}
          <div className="section">
            <div className="section-title">
              <span>Set Product Pricing</span>
            </div>
            <div className="section-description">Select products and configure pricing adjustments</div>

            {/* Selection Type */}
            <div className="form-group">
              <label>You are creating a Pricing Profile for</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    value="one"
                    checked={selectionType === 'one'}
                    onChange={(e) => setSelectionType(e.target.value as 'one')}
                  />
                  <span>One Product</span>
                </label>
                <label>
                  <input
                    type="radio"
                    value="multiple"
                    checked={selectionType === 'multiple'}
                    onChange={(e) => setSelectionType(e.target.value as 'multiple')}
                  />
                  <span>Multiple Products</span>
                </label>
                <label>
                  <input
                    type="radio"
                    value="all"
                    checked={selectionType === 'all'}
                    onChange={(e) => setSelectionType(e.target.value as 'all')}
                  />
                  <span>All Products</span>
                </label>
              </div>
            </div>

            {/* Search */}
            <div className="form-group">
              <label>Search for Products</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by product name or SKU..."
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-3">
              <div className="form-group">
                <label>Category</label>
                <select
                  value={subCategoryFilter}
                  onChange={(e) => setSubCategoryFilter(e.target.value)}
                >
                  <option value="">All</option>
                  {referenceData.subCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Segment</label>
                <select
                  value={segmentFilter}
                  onChange={(e) => setSegmentFilter(e.target.value)}
                  disabled={subCategoryFilter !== 'wine'}
                >
                  <option value="">All</option>
                  {referenceData.segments.map(seg => (
                    <option key={seg} value={seg}>{seg}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Brand</label>
                <select
                  value={brandFilter}
                  onChange={(e) => setBrandFilter(e.target.value)}
                >
                  <option value="">All</option>
                  {referenceData.brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Product Results Info */}
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              Showing <strong>{filteredProducts.length} Result</strong> for <strong>(Product Name or SKU Code)</strong> · <strong>(Brand)</strong> · <strong>(Brand)</strong>
            </div>

            {/* Select All/Deselect All */}
            {selectionType !== 'all' && (
              <div style={{ marginBottom: '1rem' }}>
                <button onClick={handleSelectAll} className="table-link">
                  {selectedProductIds.length === filteredProducts.length ? 'Deselect All' : 'Select all'}
                </button>
              </div>
            )}
          </div>

          {/* Product Table Section */}
          <div className="table-section">
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th>Product Title</th>
                    <th>SKU Code</th>
                    <th>Category</th>
                    <th className="text-right">Based On Price</th>
                    <th className="text-right">Adjustment</th>
                    <th className="text-right">New Price</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(product => {
                    const calculatedPrice = getCalculatedPriceForProduct(product.id);
                    const isSelected = selectedProductIds.includes(product.id);

                    return (
                      <tr
                        key={product.id}
                        className={isSelected ? 'selected' : ''}
                      >
                        <td>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleProductSelect(product.id)}
                            disabled={selectionType === 'all'}
                          />
                        </td>
                        <td className="text-bold">{product.title}</td>
                        <td>{product.skuCode}</td>
                        <td>{product.subCategoryId}</td>
                        <td className="text-right price">
                          {calculatedPrice ? formatCurrency(calculatedPrice.basedOnPrice) : formatCurrency(product.globalWholesalePrice)}
                        </td>
                        <td className="text-right price">
                          {calculatedPrice ? (
                            <span className={calculatedPrice.adjustmentValue >= 0 ? 'text-success' : 'text-danger'}>
                              {formatAdjustment(calculatedPrice.adjustmentValue)}
                            </span>
                          ) : (
                            <span className="text-gray">-</span>
                          )}
                        </td>
                        <td className="text-right price text-bold">
                          {calculatedPrice ? (
                            formatCurrency(calculatedPrice.newPrice)
                          ) : (
                            <span className="text-gray">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredProducts.length === 0 && (
                <div className="empty-state">
                  No products found. Try adjusting your filters.
                </div>
              )}
            </div>

            {/* Selected Products Info */}
            {selectedProductIds.length > 0 && (
              <div style={{ padding: '1rem 2rem', background: '#f9fafb', borderTop: '1px solid #e5e7eb', fontSize: '0.875rem', color: '#6b7280' }}>
                You've selected <strong>{selectedProductIds.length} Products</strong>, these will be added <strong>(Profile Name)</strong>
              </div>
            )}
          </div>

          {/* Pricing Configuration Section */}
          <div className="section">
            <div className="section-title">Based on</div>
            
            <div className="form-group">
              <select
                value={basedOn}
                onChange={(e) => setBasedOn(e.target.value)}
              >
                <option value="global">Based on Price</option>
              </select>
            </div>

            <div className="section-title mt-4">Set Price Adjustment Mode</div>
            
            <div className="form-group">
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    value="fixed"
                    checked={adjustmentType === 'fixed'}
                    onChange={(e) => setAdjustmentType(e.target.value as 'fixed')}
                  />
                  <span>Fixed ($)</span>
                </label>
                <label>
                  <input
                    type="radio"
                    value="dynamic"
                    checked={adjustmentType === 'dynamic'}
                    onChange={(e) => setAdjustmentType(e.target.value as 'dynamic')}
                  />
                  <span>Dynamic (%)</span>
                </label>
              </div>
            </div>

            <div className="section-title mt-4">Set Price Adjustment Increment Mode</div>
            
            <div className="form-group">
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    value="increase"
                    checked={adjustmentMode === 'increase'}
                    onChange={(e) => setAdjustmentMode(e.target.value as 'increase')}
                  />
                  <span>Increase +</span>
                </label>
                <label>
                  <input
                    type="radio"
                    value="decrease"
                    checked={adjustmentMode === 'decrease'}
                    onChange={(e) => setAdjustmentMode(e.target.value as 'decrease')}
                  />
                  <span>Decrease -</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Adjustment Value</label>
              <input
                type="number"
                value={adjustmentValue}
                onChange={(e) => setAdjustmentValue(e.target.value)}
                placeholder="10"
                min="0"
                step="0.01"
              />
            </div>

            {calculatedPrices.length === 0 && (
              <div style={{ fontSize: '0.875rem', color: '#d97706', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>⚠</span>
                <span>The adjusted price will be calculated from <strong>Based on Price</strong> selected above</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="btn-group-split">
            <button
              onClick={handleReset}
              className="btn btn-secondary"
            >
              Reset
            </button>

            <div className="btn-group">
              <button
                onClick={handleRecalculate}
                disabled={isCalculating || selectedProductIds.length === 0}
                className="btn btn-primary"
              >
                {isCalculating ? 'Calculating...' : 'Recalculate Prices'}
              </button>

              <button
                onClick={handleSaveProfile}
                disabled={isSaving || calculatedPrices.length === 0 || !profileName.trim()}
                className="btn btn-success"
              >
                {isSaving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};