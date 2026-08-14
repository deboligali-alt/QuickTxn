const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

const {
    getAllTransactions,
    getTransaction,
    updateTransactionStatus,
    exportTransactions,
} = require("../controllers/adminTransactionController");

/**
 * @swagger
 * tags:
 *   - name: Admin Transactions
 *     description: Manage all transactions
 */

/**
 * @swagger
 * /api/admin/transactions:
 *   get:
 *     summary: Get all transactions
 *     tags: [Admin Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
 */
router.get(
    "/",
    verifyToken,
    isAdmin,
    getAllTransactions
);

/**
 * @swagger
 * /api/admin/transactions/export:
 *   get:
 *     summary: Export transactions
 *     tags: [Admin Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Transactions exported successfully
 */
router.get(
    "/export",
    verifyToken,
    isAdmin,
    exportTransactions
);

/**
 * @swagger
 * /api/admin/transactions/{id}:
 *   get:
 *     summary: Get a transaction
 *     tags: [Admin Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction retrieved successfully
 */
router.get(
    "/:id",
    verifyToken,
    isAdmin,
    getTransaction
);

/**
 * @swagger
 * /api/admin/transactions/{id}/status:
 *   patch:
 *     summary: Update transaction status
 *     tags: [Admin Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: SUCCESS
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 */
router.patch(
    "/:id/status",
    verifyToken,
    isAdmin,
    updateTransactionStatus
);

module.exports = router;