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
 *   - name: Airtime Swap
 *     description: Airtime to Cash services
 */

/**
 * @swagger
 * /api/airtime/rates:
 *   get:
 *     summary: Get all active airtime swap rates
 *     tags: [Airtime Swap]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Airtime rates retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/rates",
    getRates
);

/**
 * @swagger
 * /api/airtime/history:
 *   get:
 *     summary: Get logged-in user's airtime swap history
 *     tags: [Airtime Swap]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Airtime swap history retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/history",
    authMiddleware,
    getSwapHistory
);

/**
 * @swagger
 * /api/airtime/swap:
 *   post:
 *     summary: Create an airtime-to-cash swap request
 *     description: Submit an airtime transfer request for admin review and wallet credit after approval.
 *     tags: [Airtime Swap]
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
 *         description: Airtime swap request created successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.post(
    "/swap",
    authMiddleware,
    createSwapRequest
);

router.post(
    "/purchase",
    authMiddleware,
    purchaseAirtime
);

module.exports = router;