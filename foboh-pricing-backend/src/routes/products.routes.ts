import { Router } from 'express';
import { productsController } from '../controllers/products.controller';

const router = Router();

router.get('/', (req, res) => productsController.getAllProducts(req, res));
router.get('/:id', (req, res) => productsController.getProductById(req, res));

export default router;