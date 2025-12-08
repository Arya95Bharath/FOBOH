import { Product } from '../models/product.model';
import { seedProducts } from '../data/seed';

export class ProductsService {
  private products: Product[] = [...seedProducts];

  getAllProducts(filters?: {
    search?: string;
    brand?: string;
    subCategory?: string;
    segment?: string;
  }): Product[] {
    let filtered = [...this.products];

    if (filters) {
      // Search by title or SKU
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(searchLower) ||
            p.skuCode.toLowerCase().includes(searchLower)
        );
      }

      // Filter by brand
      if (filters.brand) {
        filtered = filtered.filter((p) => p.brand === filters.brand);
      }

      // Filter by sub-category
      if (filters.subCategory) {
        filtered = filtered.filter((p) => p.subCategoryId === filters.subCategory);
      }

      // Filter by segment
      if (filters.segment) {
        filtered = filtered.filter((p) => p.segmentId === filters.segment);
      }
    }

    return filtered;
  }

  getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  getProductsByIds(ids: string[]): Product[] {
    return this.products.filter((p) => ids.includes(p.id));
  }
}

export const productsService = new ProductsService();