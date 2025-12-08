import { randomUUID } from 'crypto';
import { Product } from '../models/product.model';

export const seedProducts: Product[] = [
  {
    id: randomUUID(),
    title: 'High Garden Pinot Noir 2021',
    skuCode: 'HGVPIN216',
    brand: 'High Garden',
    categoryId: 'alcoholic-beverage',
    subCategoryId: 'wine',
    segmentId: 'red',
    globalWholesalePrice: 279.06,
  },
  {
    id: randomUUID(),
    title: 'Koyama Methode Brut Nature NV',
    skuCode: 'KOYBRUNV6',
    brand: 'Koyama Wines',
    categoryId: 'alcoholic-beverage',
    subCategoryId: 'wine',
    segmentId: 'sparkling',
    globalWholesalePrice: 120.0,
  },
  {
    id: randomUUID(),
    title: 'Koyama Riesling 2018',
    skuCode: 'KOYNR1837',
    brand: 'Koyama Wines',
    categoryId: 'alcoholic-beverage',
    subCategoryId: 'wine',
    segmentId: 'port-dessert',
    globalWholesalePrice: 215.04,
  },
  {
    id: randomUUID(),
    title: 'Koyama Tussock Riesling 2019',
    skuCode: 'KOYRIE19',
    brand: 'Koyama Wines',
    categoryId: 'alcoholic-beverage',
    subCategoryId: 'wine',
    segmentId: 'white',
    globalWholesalePrice: 215.04,
  },
  {
    id: randomUUID(),
    title: 'LacourteGodbillon Brut Cru NV',
    skuCode: 'LACBNATNV6',
    brand: 'LacourteGodbillon',
    categoryId: 'alcoholic-beverage',
    subCategoryId: 'wine',
    segmentId: 'sparkling',
    globalWholesalePrice: 409.32,
  },
];

export const referenceData = {
  subCategories: [
    'wine',
    'beer',
    'liquor-spirits',
    'cider',
    'premixed-ready-to-drink',
    'other',
  ],
  segments: [
    'red',
    'white',
    'rose',
    'orange',
    'sparkling',
    'port-dessert',
  ],
  brands: [
    'High Garden',
    'Koyama Wines',
    'LacourteGodbillon',
  ],
};