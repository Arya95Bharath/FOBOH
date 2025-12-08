import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import productsRoutes from './routes/products.routes';
import pricingRoutes from './routes/pricing.routes';
import referenceRoutes from './routes/reference.routes';

const app: Application = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/products', productsRoutes);
app.use('/api/pricing-profiles', pricingRoutes);
app.use('/api/reference', referenceRoutes);

// Health check
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'FOBOH Pricing API',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      pricingProfiles: '/api/pricing-profiles',
      reference: '/api/reference',
    },
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    details: err.message,
  });
});

export default app;