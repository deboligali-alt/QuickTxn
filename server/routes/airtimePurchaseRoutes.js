const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    purchaseAirtime,
    getAirtimeHistory
} = require("../controllers/airtimePurchaseController");

/**
 * @swagger
 * tags:
 *   - name: Airtime Purchase
 *     description: Buy airtime using wallet balance
 */

/**
 * @swagger
 * /api/airtime-purchase/purchase:
 *   post:
 *     summary: Purchase airtime
 *     tags: [Airtime Purchase]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - network
 *               - phoneNumber
 *               - amount
 *               - pin
 *             properties:
 *               network:
 *                 type: string
 *                 example: MTN
 *               phoneNumber:
 *                 type: string
 *                 example: "08031234567"
 *               amount:
 *                 type: number
 *                 example: 1000
 *               pin:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       201:
 *         description: Airtime purchased successfully
 *       400:
 *         description: Invalid request or transaction PIN
 *       401:
 *         description: Unauthorized
 */
router.post(
    "/purchase",
    verifyToken,
    purchaseAirtime
);

/**
 * @swagger
 * /api/airtime-purchase/history:
 *   get:
 *     summary: Get airtime purchase history
 *     tags: [Airtime Purchase]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Airtime history retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/history",
    verifyToken,
    getAirtimeHistory
);

module.exports = router;