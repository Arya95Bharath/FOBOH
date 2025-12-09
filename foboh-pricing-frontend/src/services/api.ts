import axios from 'axios';
import { Product, PricingProfile, CalculatedPrice, ReferenceData, ApiResponse } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
export const productsAPI = {
  getAll: async (params?: {
    search?: string;
    brand?: string;
    subCategory?: string;
    segment?: string;
  }): Promise<ApiResponse<Product[]>> => {
    const response = await apiClient.get('/products', { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Product>> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },
};

// Pricing Profiles API
export const pricingAPI = {
  calculatePrices: async (data: {
    basedOn: string;
    adjustmentType: string;
    adjustmentMode: string;
    adjustmentValue: number;
    productIds: string[];
  }): Promise<ApiResponse<CalculatedPrice[]>> => {
    const response = await apiClient.post('/pricing-profiles/calculate', data);
    return response.data;
  },

  createProfile: async (data: {
    name: string;
    description?: string;
    basedOn: string;
    adjustmentType: string;
    adjustmentMode: string;
    adjustmentValue: number;
    selectedProducts: string[];
  }): Promise<ApiResponse<PricingProfile>> => {
    const response = await apiClient.post('/pricing-profiles', data);
    return response.data;
  },

  getProfiles: async (): Promise<ApiResponse<PricingProfile[]>> => {
    const response = await apiClient.get('/pricing-profiles');
    return response.data;
  },

  getProfileById: async (id: string): Promise<ApiResponse<PricingProfile>> => {
    const response = await apiClient.get(`/pricing-profiles/${id}`);
    return response.data;
  },

  updateProfile: async (id: string, data: Partial<PricingProfile>): Promise<ApiResponse<PricingProfile>> => {
    const response = await apiClient.put(`/pricing-profiles/${id}`, data);
    return response.data;
  },

  deleteProfile: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.delete(`/pricing-profiles/${id}`);
    return response.data;
  },
};

// Reference Data API
export const referenceAPI = {
  getCategories: async (): Promise<ApiResponse<ReferenceData>> => {
    const response = await apiClient.get('/reference/categories');
    return response.data;
  },
};