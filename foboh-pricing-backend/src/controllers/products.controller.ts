import { Request, Response } from 'express';
import { productsService } from '../services/products.service';

export class ProductsController {
  getAllProducts(req: Request, res: Response) {
    try {
      const { search, brand, subCategory, segment } = req.query;

      const products = productsService.getAllProducts({
        search: search as string,
        brand: brand as string,
        subCategory: subCategory as string,
        segment: segment as string,
      });

      res.json({
        success: true,
        data: products,
        count: products.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch products',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = productsService.getProductById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Product not found',
        });
      }

      res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch product',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

export const productsController = new ProductsController();