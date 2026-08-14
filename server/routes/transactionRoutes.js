const express = require("express");
const router = express.Router();

const {
    getTransactions,
    transferMoney,
    getTransactionByReference
} = require("../controllers/transactionController");

const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   - name: Transactions
 *     description: Money transfers and transaction history
 */

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get logged-in user's transaction history
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records per page
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           example: DEBIT
 *         description: Filter by transaction type
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           example: SUCCESS
 *         description: Filter by transaction status
 *       - in: query
 *         name: reference
 *         schema:
 *           type: string
 *         description: Search by transaction reference
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: End date
 *     responses:
 *       200:
 *         description: Transaction history retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", authMiddleware, getTransactions);

/**
 * @swagger
 * /api/transactions/transfer:
 *   post:
 *     summary: Transfer money to another QuickTxn user
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipientEmail
 *               - amount
 *               - pin
 *             properties:
 *               recipientEmail:
 *                 type: string
 *                 example: receiver@gmail.com
 *               amount:
 *                 type: number
 *                 example: 1000
 *               description:
 *                 type: string
 *                 example: Payment for groceries
 *               pin:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: Transfer completed successfully
 *       400:
 *         description: Invalid request, invalid PIN or insufficient wallet balance
 *       401:
 *         description: Unauthorized
 */
router.post("/transfer", authMiddleware, transferMoney);

/**
 * @swagger
 * /api/transactions/{reference}:
 *   get:
 *     summary: Get transaction details by reference
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reference
 *         required: true
 *         schema:
 *           type: string
 *         example: TRX-DB-1785092847458
 *     responses:
 *       200:
 *         description: Transaction retrieved successfully
 *       404:
 *         description: Transaction not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:reference", authMiddleware, getTransactionByReference);

module.exports = router;