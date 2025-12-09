import { ProductsService } from '../../services/products.service';

describe('ProductsService', () => {
  let productsService: ProductsService;

  beforeEach(() => {
    productsService = new ProductsService();
  });

  describe('getAllProducts', () => {
    test('should return all 5 products without filters', () => {
      const products = productsService.getAllProducts();
      
      expect(products).toHaveLength(5);
      expect(products[0]).toHaveProperty('id');
      expect(products[0]).toHaveProperty('title');
      expect(products[0]).toHaveProperty('skuCode');
      expect(products[0]).toHaveProperty('globalWholesalePrice');
    });

    test('should have correct product titles', () => {
      const products = productsService.getAllProducts();
      const titles = products.map(p => p.title);
      
      expect(titles).toContain('High Garden Pinot Noir 2021');
      expect(titles).toContain('Koyama Methode Brut Nature NV');
      expect(titles).toContain('Koyama Riesling 2018');
      expect(titles).toContain('Koyama Tussock Riesling 2019');
      expect(titles).toContain('LacourteGodbillon Brut Cru NV');
    });
  });

  describe('Search functionality', () => {
    test('should search by product title (case-insensitive)', () => {
      const products = productsService.getAllProducts({ search: 'pinot' });
      
      expect(products).toHaveLength(1);
      expect(products[0].title).toBe('High Garden Pinot Noir 2021');
    });

    test('should search by SKU code', () => {
      const products = productsService.getAllProducts({ search: 'HGVPIN216' });
      
      expect(products).toHaveLength(1);
      expect(products[0].skuCode).toBe('HGVPIN216');
    });

    test('should search with partial match', () => {
      const products = productsService.getAllProducts({ search: 'koyama' });
      
      expect(products).toHaveLength(3);
      products.forEach(p => {
        expect(p.title.toLowerCase()).toContain('koyama');
      });
    });

    test('should be case-insensitive', () => {
      const lowerCase = productsService.getAllProducts({ search: 'riesling' });
      const upperCase = productsService.getAllProducts({ search: 'RIESLING' });
      const mixedCase = productsService.getAllProducts({ search: 'RiEsLiNg' });
      
      expect(lowerCase).toHaveLength(2);
      expect(upperCase).toHaveLength(2);
      expect(mixedCase).toHaveLength(2);
    });

    test('should return empty array for no matches', () => {
      const products = productsService.getAllProducts({ search: 'nonexistent' });
      
      expect(products).toHaveLength(0);
    });
  });

  describe('Filter by brand', () => {
    test('should filter by High Garden brand', () => {
      const products = productsService.getAllProducts({ brand: 'High Garden' });
      
      expect(products).toHaveLength(1);
      expect(products[0].brand).toBe('High Garden');
    });

    test('should filter by Koyama Wines brand', () => {
      const products = productsService.getAllProducts({ brand: 'Koyama Wines' });
      
      expect(products).toHaveLength(3);
      products.forEach(p => {
        expect(p.brand).toBe('Koyama Wines');
      });
    });

    test('should filter by LacourteGodbillon brand', () => {
      const products = productsService.getAllProducts({ brand: 'LacourteGodbillon' });
      
      expect(products).toHaveLength(1);
      expect(products[0].brand).toBe('LacourteGodbillon');
    });
  });

  describe('Filter by sub-category', () => {
    test('should filter by wine sub-category', () => {
      const products = productsService.getAllProducts({ subCategory: 'wine' });
      
      expect(products).toHaveLength(5);
      products.forEach(p => {
        expect(p.subCategoryId).toBe('wine');
      });
    });

    test('should return empty for non-wine categories', () => {
      const products = productsService.getAllProducts({ subCategory: 'beer' });
      
      expect(products).toHaveLength(0);
    });
  });

  describe('Filter by segment', () => {
    test('should filter by red segment', () => {
      const products = productsService.getAllProducts({ segment: 'red' });
      
      expect(products).toHaveLength(1);
      expect(products[0].segmentId).toBe('red');
    });

    test('should filter by sparkling segment', () => {
      const products = productsService.getAllProducts({ segment: 'sparkling' });
      
      expect(products).toHaveLength(2);
      products.forEach(p => {
        expect(p.segmentId).toBe('sparkling');
      });
    });

    test('should filter by white segment', () => {
      const products = productsService.getAllProducts({ segment: 'white' });
      
      expect(products).toHaveLength(1);
      expect(products[0].segmentId).toBe('white');
    });

    test('should filter by port-dessert segment', () => {
      const products = productsService.getAllProducts({ segment: 'port-dessert' });
      
      expect(products).toHaveLength(1);
      expect(products[0].segmentId).toBe('port-dessert');
    });
  });

  describe('Combined filters (AND logic)', () => {
    test('should filter by brand AND segment', () => {
      const products = productsService.getAllProducts({
        brand: 'Koyama Wines',
        segment: 'sparkling',
      });
      
      expect(products).toHaveLength(1);
      expect(products[0].title).toBe('Koyama Methode Brut Nature NV');
    });

    test('should filter by search AND brand', () => {
      const products = productsService.getAllProducts({
        search: 'riesling',
        brand: 'Koyama Wines',
      });
      
      expect(products).toHaveLength(2);
      products.forEach(p => {
        expect(p.brand).toBe('Koyama Wines');
        expect(p.title.toLowerCase()).toContain('riesling');
      });
    });

    test('should return empty when filters do not match', () => {
      const products = productsService.getAllProducts({
        brand: 'High Garden',
        segment: 'sparkling',
      });
      
      expect(products).toHaveLength(0);
    });
  });

  describe('getProductById', () => {
    test('should return product by ID', () => {
      const allProducts = productsService.getAllProducts();
      const firstProduct = allProducts[0];
      
      const product = productsService.getProductById(firstProduct.id);
      
      expect(product).toBeDefined();
      expect(product?.id).toBe(firstProduct.id);
    });

    test('should return undefined for non-existent ID', () => {
      const product = productsService.getProductById('non-existent-id');
      
      expect(product).toBeUndefined();
    });
  });

  describe('getProductsByIds', () => {
    test('should return multiple products by IDs', () => {
      const allProducts = productsService.getAllProducts();
      const ids = [allProducts[0].id, allProducts[1].id];
      
      const products = productsService.getProductsByIds(ids);
      
      expect(products).toHaveLength(2);
      expect(products[0].id).toBe(ids[0]);
      expect(products[1].id).toBe(ids[1]);
    });

    test('should return empty array for non-existent IDs', () => {
      const products = productsService.getProductsByIds(['id1', 'id2']);
      
      expect(products).toHaveLength(0);
    });

    test('should return only valid products', () => {
      const allProducts = productsService.getAllProducts();
      const ids = [allProducts[0].id, 'non-existent-id'];
      
      const products = productsService.getProductsByIds(ids);
      
      expect(products).toHaveLength(1);
      expect(products[0].id).toBe(allProducts[0].id);
    });
  });
});