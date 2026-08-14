const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    createPin,
    changePin,
    verifyPin
} = require("../controllers/pinController");

/**
 * @swagger
 * tags:
 *   - name: Transaction PIN
 *     description: Manage transaction PIN
 */

/**
 * @swagger
 * /api/pin/create:
 *   post:
 *     summary: Create a transaction PIN
 *     tags: [Transaction PIN]
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
 *       201:
 *         description: Transaction PIN created successfully
 *       400:
 *         description: Invalid PIN
 *       401:
 *         description: Unauthorized
 */
router.post("/create", verifyToken, createPin);

/**
 * @swagger
 * /api/pin/change:
 *   post:
 *     summary: Change transaction PIN
 *     tags: [Transaction PIN]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPin
 *               - newPin
 *             properties:
 *               oldPin:
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
router.post("/change", verifyToken, changePin);

/**
 * @swagger
 * /api/pin/verify:
 *   post:
 *     summary: Verify transaction PIN
 *     tags: [Transaction PIN]
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
 *         description: PIN verified successfully
 *       400:
 *         description: Invalid PIN
 *       401:
 *         description: Unauthorized
 */
router.post("/verify", verifyToken, verifyPin);

module.exports = router;