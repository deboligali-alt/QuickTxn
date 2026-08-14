const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
    getDashboardStats,
    getAllUsers,
    getAllAirtimeSwaps,
    approveAirtimeSwap,
    rejectAirtimeSwap
} = require("../controllers/adminController");

/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: Administrator operations
 */

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get(
    "/dashboard",
    authMiddleware,
    adminMiddleware,
    getDashboardStats
);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all registered users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get(
    "/users",
    authMiddleware,
    adminMiddleware,
    getAllUsers
);

/**
 * @swagger
 * /api/admin/airtime-swaps:
 *   get:
 *     summary: Get all airtime swap requests
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Airtime swap requests retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get(
    "/airtime-swaps",
    authMiddleware,
    adminMiddleware,
    getAllAirtimeSwaps
);

/**
 * @swagger
 * /api/admin/airtime-swaps/{id}/approve:
 *   patch:
 *     summary: Approve an airtime swap request
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: b8a3c8b2-7f55-4d90-9f55-f1f2b6c31abc
 *     responses:
 *       200:
 *         description: Airtime swap approved successfully
 *       404:
 *         description: Swap request not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.patch(
    "/airtime-swaps/:id/approve",
    authMiddleware,
    adminMiddleware,
    approveAirtimeSwap
);

/**
 * @swagger
 * /api/admin/airtime-swaps/{id}/reject:
 *   patch:
 *     summary: Reject an airtime swap request
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: b8a3c8b2-7f55-4d90-9f55-f1f2b6c31abc
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               adminNote:
 *                 type: string
 *                 example: Airtime transfer could not be verified.
 *     responses:
 *       200:
 *         description: Airtime swap rejected successfully
 *       404:
 *         description: Swap request not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.patch(
    "/airtime-swaps/:id/reject",
    authMiddleware,
    adminMiddleware,
    rejectAirtimeSwap
);

module.exports = router;