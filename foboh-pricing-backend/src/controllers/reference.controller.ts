import { Request, Response } from 'express';
import { referenceData } from '../data/seed';

export class ReferenceController {
  getCategories(req: Request, res: Response) {
    try {
      res.json({
        success: true,
        data: referenceData,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch reference data',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

export const referenceController = new ReferenceController();