const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    verifyMeter,
    purchaseElectricity,
    getElectricityHistory,
} = require("../controllers/electricityController");

/**
 * @swagger
 * tags:
 *   - name: Electricity
 *     description: Electricity bill payment services
 */

/**
 * @swagger
 * /api/electricity/verify:
 *   post:
 *     summary: Verify electricity meter number
 *     tags: [Electricity]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - disco
 *               - meterType
 *               - meterNumber
 *             properties:
 *               disco:
 *                 type: string
 *                 example: IKEDC
 *               meterType:
 *                 type: string
 *                 enum: [PREPAID, POSTPAID]
 *               meterNumber:
 *                 type: string
 *                 example: "12345678901"
 *     responses:
 *       200:
 *         description: Meter verified successfully
 */
router.post("/verify", verifyToken, verifyMeter);

/**
 * @swagger
 * /api/electricity/purchase:
 *   post:
 *     summary: Purchase electricity using wallet
 *     tags: [Electricity]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - disco
 *               - meterType
 *               - meterNumber
 *               - amount
 *               - pin
 *             properties:
 *               disco:
 *                 type: string
 *                 example: IKEDC
 *               meterType:
 *                 type: string
 *                 enum: [PREPAID, POSTPAID]
 *               meterNumber:
 *                 type: string
 *                 example: "12345678901"
 *               amount:
 *                 type: number
 *                 example: 5000
 *               pin:
 *                 type: string
 *                 example: "2580"
 *     responses:
 *       200:
 *         description: Electricity purchased successfully
 */
router.post("/purchase", verifyToken, purchaseElectricity);

/**
 * @swagger
 * /api/electricity/history:
 *   get:
 *     summary: Get electricity payment history
 *     tags: [Electricity]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment history retrieved successfully
 */
router.get("/history", verifyToken, getElectricityHistory);

module.exports = router;