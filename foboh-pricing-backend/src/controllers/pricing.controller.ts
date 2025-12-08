import { Request, Response } from 'express';
import { pricingService } from '../services/pricing.service';

export class PricingController {
  getAllProfiles(req: Request, res: Response) {
    try {
      const profiles = pricingService.getAllProfiles();

      res.json({
        success: true,
        data: profiles,
        count: profiles.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch pricing profiles',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  getProfileById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const profile = pricingService.getProfileById(id);

      if (!profile) {
        return res.status(404).json({
          success: false,
          error: 'Pricing profile not found',
        });
      }

      res.json({
        success: true,
        data: profile,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch pricing profile',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  createProfile(req: Request, res: Response) {
    try {
      const { name, description, basedOn, adjustmentType, adjustmentMode, adjustmentValue, selectedProducts } = req.body;

      // Validation
      if (!name || !basedOn || !adjustmentType || !adjustmentMode || adjustmentValue === undefined || !selectedProducts) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
          details: ['name, basedOn, adjustmentType, adjustmentMode, adjustmentValue, and selectedProducts are required'],
        });
      }

      if (!Array.isArray(selectedProducts) || selectedProducts.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: ['selectedProducts must be a non-empty array'],
        });
      }

      const profile = pricingService.createProfile({
        name,
        description,
        basedOn,
        adjustmentType,
        adjustmentMode,
        adjustmentValue: Number(adjustmentValue),
        selectedProducts,
      });

      res.status(201).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: 'Failed to create pricing profile',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  updateProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Validate adjustment value if provided
      if (updates.adjustmentValue !== undefined && Number(updates.adjustmentValue) <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: ['adjustmentValue must be greater than 0'],
        });
      }

      const profile = pricingService.updateProfile(id, updates);

      res.json({
        success: true,
        data: profile,
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        error: 'Failed to update pricing profile',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  deleteProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = pricingService.deleteProfile(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Pricing profile not found',
        });
      }

      res.json({
        success: true,
        message: 'Pricing profile deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to delete pricing profile',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  calculatePrices(req: Request, res: Response) {
    try {
      const { basedOn, adjustmentType, adjustmentMode, adjustmentValue, productIds } = req.body;

      // Validation
      if (!basedOn || !adjustmentType || !adjustmentMode || adjustmentValue === undefined || !productIds) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
          details: ['basedOn, adjustmentType, adjustmentMode, adjustmentValue, and productIds are required'],
        });
      }

      if (!Array.isArray(productIds) || productIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: ['productIds must be a non-empty array'],
        });
      }

      const calculatedPrices = pricingService.calculatePrices(
        basedOn,
        adjustmentType,
        adjustmentMode,
        Number(adjustmentValue),
        productIds
      );

      res.json({
        success: true,
        data: calculatedPrices,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: 'Failed to calculate prices',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

export const pricingController = new PricingController();