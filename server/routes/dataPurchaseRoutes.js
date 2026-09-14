const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    getDataPlans,
    purchaseData,
    getDataHistory,
} = require("../controllers/dataPurchaseController");

/**
 * @swagger
 * tags:
 *   - name: Data
 *     description: Data bundle purchase services
 */

/**
 * @swagger
 * /api/data/plans:
 *   get:
 *     summary: Get available data plans by network
 *     tags: [Data]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: network
 *         required: true
 *         schema:
 *           type: string
 *           enum: [MTN, AIRTEL, GLO, 9MOBILE]
 *         example: MTN
 *     responses:
 *       200:
 *         description: Data plans retrieved successfully
 *       400:
 *         description: Network is required
 *       401:
 *         description: Unauthorized
 */
router.get("/plans", verifyToken, getDataPlans);

/**
 * @swagger
 * /api/data/purchase:
 *   post:
 *     summary: Purchase a data bundle using wallet balance
 *     tags: [Data]
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
 *                 enum: [MTN, AIRTEL, GLO, 9MOBILE]
 *                 example: MTN
 *               planCode:
 *                 type: string
 *                 example: MTN1GB
 *               phoneNumber:
 *                 type: string
 *                 example: "08031234567"
 *               pin:
 *                 type: string
 *                 example: "2580"
 *     responses:
 *       200:
 *         description: Data purchased successfully
 *       400:
 *         description: Invalid PIN or insufficient balance
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Data plan not found
 */
router.post("/purchase", verifyToken, purchaseData);

/**
 * @swagger
 * /api/data/history:
 *   get:
 *     summary: Get user's data purchase history
 *     tags: [Data]
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