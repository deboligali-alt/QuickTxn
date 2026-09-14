const express = require("express");
const router = express.Router();

const {
    createSwapRequest,
    getRates,
    getSwapHistory,
    purchaseAirtime,
} = require("../controllers/airtimeController");

const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   - name: Airtime
 *     description: Airtime purchase & airtime-to-cash services
 */

/**
 * @swagger
 * /api/airtime/rates:
 *   get:
 *     summary: Get active airtime swap rates
 *     tags: [Airtime]
 *     responses:
 *       200:
 *         description: Airtime rates retrieved successfully
 */
router.get("/rates", getRates);

/**
 * @swagger
 * /api/airtime/history:
 *   get:
 *     summary: Get logged-in user's airtime swap history
 *     tags: [Airtime]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Swap history retrieved successfully
 */
router.get("/history", authMiddleware, getSwapHistory);

/**
 * @swagger
 * /api/airtime/swap:
 *   post:
 *     summary: Submit an airtime-to-cash request
 *     tags: [Airtime]
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
 *               - phoneNumber
 *               - airtimeAmount
 *             properties:
 *               network:
 *                 type: string
 *                 example: MTN
 *               phoneNumber:
 *                 type: string
 *                 example: "08031234567"
 *               airtimeAmount:
 *                 type: number
 *                 example: 5000
 *     responses:
 *       201:
 *         description: Swap request submitted successfully
 */
router.post("/swap", authMiddleware, createSwapRequest);

/**
 * @swagger
 * /api/airtime/purchase:
 *   post:
 *     summary: Buy airtime using wallet balance
 *     tags: [Airtime]
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
 *               - phone
 *               - amount
 *               - pin
 *             properties:
 *               network:
 *                 type: string
 *                 enum: [MTN, GLO, AIRTEL, 9MOBILE]
 *                 example: MTN
 *               phone:
 *                 type: string
 *                 example: "08031234567"
 *               amount:
 *                 type: number
 *                 example: 500
 *               pin:
 *                 type: string
 *                 example: "2580"
 *     responses:
 *       200:
 *         description: Airtime purchased successfully
 *       400:
 *         description: Invalid PIN, insufficient balance or invalid request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Provider error
 */
router.post("/purchase", authMiddleware, purchaseAirtime);

module.exports = router;