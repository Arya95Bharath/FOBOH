import { Router } from 'express';
import { referenceController } from '../controllers/reference.controller';

const router = Router();

/**
 * @swagger
 * /api/reference/categories:
 *   get:
 *     summary: Get reference data
 *     tags: [Reference]
 *     description: Retrieve all reference data including sub-categories, segments, and brands
 *     responses:
 *       200:
 *         description: Successfully retrieved reference data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     subCategories:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["wine", "beer", "liquor-spirits", "cider"]
 *                     segments:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["red", "white", "sparkling", "rose"]
 *                     brands:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["High Garden", "Koyama Wines", "LacourteGodbillon"]
 *       500:
 *         description: Server error
 */
router.get('/categories', (req, res) => referenceController.getCategories(req, res));

export default router;