import { Router } from 'express';
import { pricingController } from '../controllers/pricing.controller';

const router = Router();

/**
 * @swagger
 * /api/pricing-profiles:
 *   get:
 *     summary: Get all pricing profiles
 *     tags: [Pricing Profiles]
 *     description: Retrieve all pricing profiles
 *     responses:
 *       200:
 *         description: Successfully retrieved pricing profiles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PricingProfile'
 *                 count:
 *                   type: integer
 *       500:
 *         description: Server error
 */
router.get('/', (req, res) => pricingController.getAllProfiles(req, res));

/**
 * @swagger
 * /api/pricing-profiles:
 *   post:
 *     summary: Create a new pricing profile
 *     tags: [Pricing Profiles]
 *     description: Create a new pricing profile with adjustment settings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - basedOn
 *               - adjustmentType
 *               - adjustmentMode
 *               - adjustmentValue
 *               - selectedProducts
 *             properties:
 *               name:
 *                 type: string
 *                 example: VIP Customer Discount
 *               description:
 *                 type: string
 *                 example: 10% discount for VIP customers
 *               basedOn:
 *                 type: string
 *                 example: global
 *               adjustmentType:
 *                 type: string
 *                 enum: [fixed, dynamic]
 *                 example: dynamic
 *               adjustmentMode:
 *                 type: string
 *                 enum: [increase, decrease]
 *                 example: decrease
 *               adjustmentValue:
 *                 type: number
 *                 example: 10
 *               selectedProducts:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["550e8400-e29b-41d4-a716-446655440001"]
 *     responses:
 *       201:
 *         description: Pricing profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/PricingProfile'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/', (req, res) => pricingController.createProfile(req, res));

/**
 * @swagger
 * /api/pricing-profiles/{id}:
 *   get:
 *     summary: Get pricing profile by ID
 *     tags: [Pricing Profiles]
 *     description: Retrieve a single pricing profile by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Profile ID
 *     responses:
 *       200:
 *         description: Successfully retrieved profile
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Server error
 */
router.get('/:id', (req, res) => pricingController.getProfileById(req, res));

/**
 * @swagger
 * /api/pricing-profiles/{id}:
 *   put:
 *     summary: Update pricing profile
 *     tags: [Pricing Profiles]
 *     description: Update an existing pricing profile
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Profile ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               adjustmentValue:
 *                 type: number
 *               adjustmentType:
 *                 type: string
 *                 enum: [fixed, dynamic]
 *               adjustmentMode:
 *                 type: string
 *                 enum: [increase, decrease]
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Server error
 */
router.put('/:id', (req, res) => pricingController.updateProfile(req, res));

/**
 * @swagger
 * /api/pricing-profiles/{id}:
 *   delete:
 *     summary: Delete pricing profile
 *     tags: [Pricing Profiles]
 *     description: Delete a pricing profile by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Profile ID
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', (req, res) => pricingController.deleteProfile(req, res));

/**
 * @swagger
 * /api/pricing-profiles/calculate:
 *   post:
 *     summary: Calculate prices (preview)
 *     tags: [Pricing Profiles]
 *     description: Calculate adjusted prices without saving the profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - basedOn
 *               - adjustmentType
 *               - adjustmentMode
 *               - adjustmentValue
 *               - productIds
 *             properties:
 *               basedOn:
 *                 type: string
 *                 example: global
 *               adjustmentType:
 *                 type: string
 *                 enum: [fixed, dynamic]
 *                 example: dynamic
 *               adjustmentMode:
 *                 type: string
 *                 enum: [increase, decrease]
 *                 example: decrease
 *               adjustmentValue:
 *                 type: number
 *                 example: 10
 *               productIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["550e8400-e29b-41d4-a716-446655440001"]
 *     responses:
 *       200:
 *         description: Prices calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CalculatedPrice'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/calculate', (req, res) => pricingController.calculatePrices(req, res));

export default router;