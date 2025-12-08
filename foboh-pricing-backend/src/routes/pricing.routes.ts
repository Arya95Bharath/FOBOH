import { Router } from 'express';
import { pricingController } from '../controllers/pricing.controller';

const router = Router();

router.get('/', (req, res) => pricingController.getAllProfiles(req, res));
router.post('/', (req, res) => pricingController.createProfile(req, res));
router.get('/:id', (req, res) => pricingController.getProfileById(req, res));
router.put('/:id', (req, res) => pricingController.updateProfile(req, res));
router.delete('/:id', (req, res) => pricingController.deleteProfile(req, res));
router.post('/calculate', (req, res) => pricingController.calculatePrices(req, res));

export default router;