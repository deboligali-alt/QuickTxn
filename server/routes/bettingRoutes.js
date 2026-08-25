const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    verifyCustomer,
    getProviders,
    fundBettingWallet,
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
 *               - company
 *               - customerId
 *             properties:
 *               company:
 *                 type: string
 *                 example: sporty
 *               customerId:
 *                 type: string
 *                 example: "987654321"
 *     responses:
 *       200:
 *         description: Customer verified successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.post("/verify", verifyToken, verifyCustomer);

/**
 * @swagger
 * /api/betting/providers:
 *   get:
 *     summary: Get all betting providers
 *     tags: [Betting]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Providers retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/providers", verifyToken, getProviders);

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
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: Betting wallet funded successfully
 *       400:
 *         description: Invalid request, invalid PIN or insufficient wallet balance
 *       401:
 *         description: Unauthorized
 */
router.post("/fund", verifyToken, fundBettingWallet);

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
 *         description: Betting funding history retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/history", verifyToken, getFundingHistory);

module.exports = router;