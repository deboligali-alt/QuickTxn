const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    getProviders,
    verifyBettingCustomer,
    fundWallet,
    getFundingHistory,
} = require("../controllers/bettingController");

/**
 * @swagger
 * tags:
 *   - name: Betting
 *     description: Betting wallet funding services
 */

/**
 * @swagger
 * /api/betting/providers:
 *   get:
 *     summary: Get all supported betting providers
 *     tags: [Betting]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Providers retrieved successfully
 */
router.get("/providers", verifyToken, getProviders);

/**
 * @swagger
 * /api/betting/verify:
 *   post:
 *     summary: Verify betting customer ID
 *     tags: [Betting]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - provider
 *               - customerId
 *             properties:
 *               provider:
 *                 type: string
 *                 example: SPORTYBET
 *               customerId:
 *                 type: string
 *                 example: "987654321"
 *     responses:
 *       200:
 *         description: Customer verified successfully
 */
router.post("/verify", verifyToken, verifyBettingCustomer);

/**
 * @swagger
 * /api/betting/fund:
 *   post:
 *     summary: Fund a betting wallet
 *     tags: [Betting]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - providerCode
 *               - bettingUserId
 *               - amount
 *               - pin
 *             properties:
 *               providerCode:
 *                 type: string
 *                 example: SPORTYBET
 *               bettingUserId:
 *                 type: string
 *                 example: "987654321"
 *               amount:
 *                 type: number
 *                 example: 5000
 *               pin:
 *                 type: string
 *                 example: "2580"
 *     responses:
 *       200:
 *         description: Betting wallet funded successfully
 */
router.post("/fund", verifyToken, fundWallet);

/**
 * @swagger
 * /api/betting/history:
 *   get:
 *     summary: Get betting funding history
 *     tags: [Betting]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Funding history retrieved successfully
 */
router.get("/history", verifyToken, getFundingHistory);

module.exports = router;