const express = require("express");
const router = express.Router();
const {
    getBalance,
    fundWallet,
    verifyPayment,
    transferMoney,
    bankTransfer,
    resolveAccount,
    getBanks,
    getTransferHistory,
    getVirtualAccount,
} = require("../controllers/walletController");
const verifyToken = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   - name: Wallet
 *     description: Wallet management and transactions
 */

/**
 * @swagger
 * /api/wallet/balance:
 *   get:
 *     summary: Get user's wallet balance
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet balance retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/balance",
    verifyToken,
    getBalance
);

/**
 * @swagger
 * /api/wallet/fund:
 *   post:
 *     summary: Initialize wallet funding with Paystack
 *     tags: [Wallet]
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
 *         description: Payment initialized successfully
 *       400:
 *         description: Invalid amount
 *       401:
 *         description: Unauthorized
 */
router.post(
    "/fund",
    verifyToken,
    fundWallet
);

/**
 * @swagger
 * /api/wallet/verify-payment/{reference}:
 *   get:
 *     summary: Verify a Paystack payment
 *     tags: [Wallet]
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
 *       400:
 *         description: Payment verification failed
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/verify-payment/:reference",
    verifyToken,
    verifyPayment
);

/**
 * @swagger
 * /api/wallet/transfer:
 *   post:
 *     summary: Transfer money to another QuickTxn user
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - receiverEmail
 *               - amount
 *             properties:
 *               receiverEmail:
 *                 type: string
 *                 example: receiver@gmail.com
 *               amount:
 *                 type: number
 *                 example: 1000
 *     responses:
 *       200:
 *         description: Transfer successful
 *       400:
 *         description: Transfer failed
 *       401:
 *         description: Unauthorized
 */
router.post(
    "/transfer",
    verifyToken,
    transferMoney
);

/**
 * @swagger
 * /api/wallet/resolve-account:
 *   post:
 *     summary: Resolve a Nigerian bank account using Paystack
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountNumber
 *               - bankCode
 *             properties:
 *               accountNumber:
 *                 type: string
 *                 example: "0123456789"
 *               bankCode:
 *                 type: string
 *                 example: "044"
 *     responses:
 *       200:
 *         description: Account resolved successfully
 *       400:
 *         description: Unable to resolve account
 *       401:
 *         description: Unauthorized
 *       429:
 *         description: Paystack account resolution limit exceeded
 */
router.post(
    "/resolve-account",
    verifyToken,
    resolveAccount
);

/**
 * @swagger
 * /api/wallet/banks:
 *   get:
 *     summary: Get all Nigerian banks
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of supported Nigerian banks
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/banks",
    verifyToken,
    getBanks
);

/**
 * @swagger
 * /api/wallet/bank-transfer:
 *   post:
 *     summary: Transfer money from QuickTxn wallet to a Nigerian bank account
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountNumber
 *               - bankCode
 *               - accountName
 *               - amount
 *               - pin
 *             properties:
 *               accountNumber:
 *                 type: string
 *                 description: Recipient's 10-digit Nigerian bank account number
 *                 example: "0123456789"
 *               bankCode:
 *                 type: string
 *                 description: Paystack bank code
 *                 example: "044"
 *               accountName:
 *                 type: string
 *                 description: Resolved recipient account name
 *                 example: "JOHN DOE"
 *               amount:
 *                 type: number
 *                 description: Amount to transfer in NGN
 *                 example: 5000
 *               pin:
 *                 type: string
 *                 description: User's 4-digit transaction PIN
 *                 example: "2580"
 *     responses:
 *       200:
 *         description: Bank transfer initiated successfully
 *       400:
 *         description: Invalid request, PIN, balance, or bank details
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
    "/bank-transfer",
    verifyToken,
    bankTransfer
);

/**
 * @swagger
 * /api/wallet/bank-history:
 *   get:
 *     summary: Get user's bank transfer history
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bank transfer history retrieved successfully
 */
router.get(
    "/bank-history",
    verifyToken,
    getTransferHistory
);

/**
 * @swagger
 * /api/wallet/virtual-account:
 *   get:
 *     summary: Get user's virtual bank account
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Virtual account retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Virtual account not found
 */
router.get(
    "/virtual-account",
    verifyToken,
    getVirtualAccount
);

module.exports = router;