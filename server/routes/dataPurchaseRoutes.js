const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    purchaseData,
    getDataPlans,
    getDataHistory
} = require("../controllers/dataPurchaseController");

/**
 * @swagger
 * tags:
 *   - name: Data Purchase
 *     description: Purchase mobile data bundles
 */

/**
 * @swagger
 * /api/data/plans:
 *   get:
 *     summary: Get all available data plans
 *     tags: [Data Purchase]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data plans retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/plans", getDataPlans);

/**
 * @swagger
 * /api/data/purchase:
 *   post:
 *     summary: Purchase a data plan
 *     tags: [Data Purchase]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - network
 *               - planCode
 *               - phoneNumber
 *               - pin
 *             properties:
 *               network:
 *                 type: string
 *                 example: MTN
 *               planCode:
 *                 type: string
 *                 example: MTN1GB
 *               phoneNumber:
 *                 type: string
 *                 example: "08031234567"
 *               pin:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       201:
 *         description: Data purchased successfully
 *       400:
 *         description: Invalid request, invalid PIN or insufficient wallet balance
 *       401:
 *         description: Unauthorized
 */
router.post("/purchase", verifyToken, purchaseData);

/**
 * @swagger
 * /api/data/history:
 *   get:
 *     summary: Get data purchase history
 *     tags: [Data Purchase]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data purchase history retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/history", verifyToken, getDataHistory);

module.exports = router;