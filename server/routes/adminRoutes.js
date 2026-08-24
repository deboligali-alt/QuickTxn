const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
    getDashboardStats,
    getAirtimeSwapStats,
    getAllUsers,
    getAllAirtimeSwaps,
    getSingleAirtimeSwap,
    approveAirtimeSwap,
    rejectAirtimeSwap,
    broadcastNotification,
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
 */
router.get(
    "/dashboard",
    authMiddleware,
    adminMiddleware("SUPER_ADMIN", "ADMIN"),
    getDashboardStats
);

/**
 * @swagger
 * /api/admin/airtime-swaps:
 *   get:
 *     summary: Get all airtime swap requests
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.get(
    "/airtime-swaps",
    authMiddleware,
    adminMiddleware("SUPER_ADMIN", "ADMIN", "AGENT"),
    getAllAirtimeSwaps
);

/**
 * @swagger
 * /api/admin/airtime-swaps/stats:
 *   get:
 *     summary: Get airtime swap statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.get(
    "/airtime-swaps/stats",
    authMiddleware,
    adminMiddleware("SUPER_ADMIN", "ADMIN", "AGENT"),
    getAirtimeSwapStats
);

/**
 * @swagger
 * /api/admin/airtime-swaps/{id}:
 *   get:
 *     summary: Get a single airtime swap
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.get(
    "/airtime-swaps/:id",
    authMiddleware,
    adminMiddleware("SUPER_ADMIN", "ADMIN", "AGENT"),
    getSingleAirtimeSwap
);

/**
 * @swagger
 * /api/admin/airtime-swaps/{id}/approve:
 *   patch:
 *     summary: Approve an airtime swap
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.patch(
    "/airtime-swaps/:id/approve",
    authMiddleware,
    adminMiddleware("SUPER_ADMIN", "ADMIN"),
    approveAirtimeSwap
);

/**
 * @swagger
 * /api/admin/airtime-swaps/{id}/reject:
 *   patch:
 *     summary: Reject an airtime swap
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 */
router.patch(
    "/airtime-swaps/:id/reject",
    authMiddleware,
    adminMiddleware("SUPER_ADMIN", "ADMIN"),
    rejectAirtimeSwap
);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.get(
    "/users",
    authMiddleware,
    adminMiddleware("SUPER_ADMIN", "ADMIN", "SUPPORT"),
    getAllUsers
);

/**
 * @swagger
 * /api/admin/broadcast:
 *   post:
 *     summary: Send a broadcast notification to all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.post(
    "/broadcast",
    authMiddleware,
    adminMiddleware("SUPER_ADMIN", "ADMIN"),
    broadcastNotification
);

module.exports = router;