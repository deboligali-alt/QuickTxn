const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
    initializePayment,
    verifyPayment,
    handleWebhook,
    createVirtualAccount,
    getVirtualAccount,
} = require("../controllers/monnifyController");

/**
 * @swagger
 * tags:
 *   - name: Monnify
 *     description: Monnify payments and virtual accounts
 */

/**
 * @swagger
 * /api/monnify/initialize:
 *   post:
 *     summary: Initialize Monnify checkout payment
 *     tags: [Monnify]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 5000
 *     responses:
 *       200:
 *         description: Checkout URL generated
 */
router.post("/initialize", auth, initializePayment);

/**
 * @swagger
 * /api/monnify/verify/{reference}:
 *   get:
 *     summary: Verify a Monnify payment
 *     tags: [Monnify]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reference
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment verified successfully
 */
router.get("/verify/:reference", auth, verifyPayment);

/**
 * @swagger
 * /api/monnify/create-account:
 *   post:
 *     summary: Create a permanent Monnify virtual account
 *     tags: [Monnify]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Virtual account created successfully
 *       200:
 *         description: User already has a virtual account
 */
router.post("/create-account", auth, createVirtualAccount);

/**
 * @swagger
 * /api/monnify/account:
 *   get:
 *     summary: Get logged-in user's virtual account
 *     tags: [Monnify]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Virtual account retrieved successfully
 *       404:
 *         description: Virtual account not found
 */
router.get("/account", auth, getVirtualAccount);

/**
 * @swagger
 * /api/monnify/webhook:
 *   post:
 *     summary: Monnify webhook callback
 *     tags: [Monnify]
 *     responses:
 *       200:
 *         description: Webhook received successfully
 */
router.post("/webhook", handleWebhook);

module.exports = router;