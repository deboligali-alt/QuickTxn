const express = require("express");
const router = express.Router();

const {
    getProfile,
    updateProfile,
    changePassword,
    setTransactionPin,
    changePin,
    getDashboard
} = require("../controllers/userController");
const verifyToken = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: User profile and dashboard
 */

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get logged-in user's profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/profile",
    verifyToken,
    getProfile
);

/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     summary: Update logged-in user's profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - phone
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Hylondon
 *               phone:
 *                 type: string
 *                 example: "08012345678"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.put(
    "/profile",
    verifyToken,
    updateProfile
);

/**
 * @swagger
 * /api/user/change-password:
 *   patch:
 *     summary: Change logged-in user's password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: OldPassword123
 *               newPassword:
 *                 type: string
 *                 example: NewPassword123
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.patch(
    "/change-password",
    verifyToken,
    changePassword
);

/**
 * @swagger
 * /api/user/set-pin:
 *   post:
 *     summary: Create a transaction PIN
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pin
 *             properties:
 *               pin:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: Transaction PIN created successfully
 *       400:
 *         description: Invalid PIN
 *       401:
 *         description: Unauthorized
 */
router.post(
    "/set-pin",
    verifyToken,
    setTransactionPin
);

/**
 * @swagger
 * /api/user/change-pin:
 *   patch:
 *     summary: Change logged-in user's transaction PIN
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPin
 *               - newPin
 *             properties:
 *               currentPin:
 *                 type: string
 *                 example: "1234"
 *               newPin:
 *                 type: string
 *                 example: "5678"
 *     responses:
 *       200:
 *         description: Transaction PIN changed successfully
 *       400:
 *         description: Invalid PIN
 *       401:
 *         description: Unauthorized
 */
router.patch(
    "/change-pin",
    verifyToken,
    changePin
);

/**
 * @swagger
 * /api/user/dashboard:
 *   get:
 *     summary: Get user dashboard statistics
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/dashboard",
    verifyToken,
    getDashboard
);

module.exports = router;