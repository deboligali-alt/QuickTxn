const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

const {
    getAllUsers,
    getUser,
    toggleUserStatus,
    resetUserPin,
    resetPassword,
    deleteUser,
} = require("../controllers/adminUserController");

/**
 * @swagger
 * tags:
 *   - name: Admin Users
 *     description: Manage QuickTxn users
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin Users]
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
    "/",
    verifyToken,
    isAdmin,
    getAllUsers
);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: Get a single user
 *     tags: [Admin Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get(
    "/:id",
    verifyToken,
    isAdmin,
    getUser
);

/**
 * @swagger
 * /api/admin/users/{id}/status:
 *   patch:
 *     summary: Suspend or activate a user
 *     tags: [Admin Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User status updated successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.patch(
    "/:id/status",
    verifyToken,
    isAdmin,
    toggleUserStatus
);

/**
 * @swagger
 * /api/admin/users/{id}/reset-pin:
 *   patch:
 *     summary: Reset a user's transaction PIN
 *     tags: [Admin Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Transaction PIN reset successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.patch(
    "/:id/reset-pin",
    verifyToken,
    isAdmin,
    resetUserPin
);

/**
 * @swagger
 * /api/admin/users/{id}/reset-password:
 *   patch:
 *     summary: Send password reset to a user
 *     tags: [Admin Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Password reset initiated successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.patch(
    "/:id/reset-password",
    verifyToken,
    isAdmin,
    resetPassword
);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Admin Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.delete(
    "/:id",
    verifyToken,
    isAdmin,
    deleteUser
);

module.exports = router;