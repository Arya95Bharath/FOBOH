import { Router } from 'express';
import { referenceController } from '../controllers/reference.controller';

const router = Router();

router.get('/categories', (req, res) => referenceController.getCategories(req, res));

export default router;