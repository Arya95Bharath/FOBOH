import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FOBOH Pricing API',
      version: '1.0.0',
      description: 'API for managing product pricing profiles with dynamic and fixed adjustments',
      contact: {
        name: 'FOBOH',
        email: 'info@foboh.com.au',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'Products',
        description: 'Product management endpoints',
      },
      {
        name: 'Pricing Profiles',
        description: 'Pricing profile management endpoints',
      },
      {
        name: 'Reference',
        description: 'Reference data endpoints',
      },
    ],
    components: {
      schemas: {
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '550e8400-e29b-41d4-a716-446655440001',
            },
            title: {
              type: 'string',
              example: 'High Garden Pinot Noir 2021',
            },
            skuCode: {
              type: 'string',
              example: 'HGVPIN216',
            },
            brand: {
              type: 'string',
              example: 'High Garden',
            },
            categoryId: {
              type: 'string',
              example: 'alcoholic-beverage',
            },
            subCategoryId: {
              type: 'string',
              example: 'wine',
            },
            segmentId: {
              type: 'string',
              example: 'red',
            },
            globalWholesalePrice: {
              type: 'number',
              format: 'float',
              example: 279.06,
            },
          },
        },
        PricingProfile: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
              example: 'VIP Customer Discount',
            },
            description: {
              type: 'string',
              example: '10% discount for VIP customers',
            },
            basedOn: {
              type: 'string',
              example: 'global',
            },
            adjustmentType: {
              type: 'string',
              enum: ['fixed', 'dynamic'],
              example: 'dynamic',
            },
            adjustmentMode: {
              type: 'string',
              enum: ['increase', 'decrease'],
              example: 'decrease',
            },
            adjustmentValue: {
              type: 'number',
              example: 10,
            },
            selectedProducts: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['550e8400-e29b-41d4-a716-446655440001'],
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        CalculatedPrice: {
          type: 'object',
          properties: {
            productId: {
              type: 'string',
            },
            productTitle: {
              type: 'string',
            },
            skuCode: {
              type: 'string',
            },
            category: {
              type: 'string',
            },
            basedOnPrice: {
              type: 'number',
            },
            adjustmentValue: {
              type: 'number',
            },
            newPrice: {
              type: 'number',
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              example: 'Error message',
            },
            details: {
              type: 'string',
              example: 'Detailed error information',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // Path to the API routes
};

export const swaggerSpec = swaggerJsdoc(options);