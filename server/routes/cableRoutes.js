const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    verifyCable,
    getPackages,
    subscribeCable,
    getCableHistory,
} = require("../controllers/cableController");

/**
 * @swagger
 * tags:
 *   - name: Cable TV
 *     description: DSTV, GOTV & Startimes subscription services
 */

/**
 * @swagger
 * /api/cable/verify:
 *   post:
 *     summary: Verify decoder/smartcard number
 *     tags: [Cable TV]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - provider
 *               - smartCard
 *             properties:
 *               provider:
 *                 type: string
 *                 enum: [DSTV, GOTV, STARTIMES]
 *                 example: DSTV
 *               smartCard:
 *                 type: string
 *                 example: "7031234567"
 *     responses:
 *       200:
 *         description: Customer verified successfully
 */
router.post("/verify", verifyToken, verifyCable);

/**
 * @swagger
 * /api/cable/packages:
 *   get:
 *     summary: Get available cable bouquets
 *     tags: [Cable TV]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: provider
 *         required: true
 *         schema:
 *           type: string
 *           enum: [DSTV, GOTV, STARTIMES]
 *         example: DSTV
 *     responses:
 *       200:
 *         description: Packages retrieved successfully
 */
router.get("/packages", verifyToken, getPackages);

/**
 * @swagger
 * /api/cable/purchase:
 *   post:
 *     summary: Subscribe to a cable TV package
 *     tags: [Cable TV]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - provider
 *               - smartCard
 *               - bouquet
 *               - amount
 *               - pin
 *             properties:
 *               provider:
 *                 type: string
 *                 enum: [DSTV, GOTV, STARTIMES]
 *                 example: DSTV
 *               smartCard:
 *                 type: string
 *                 example: "7031234567"
 *               bouquet:
 *                 type: string
 *                 example: DSTV-CONFAM
 *               amount:
 *                 type: number
 *                 example: 11000
 *               pin:
 *                 type: string
 *                 example: "2580"
 *     responses:
 *       200:
 *         description: Subscription successful
 */
router.post("/purchase", verifyToken, subscribeCable);

/**
 * @swagger
 * /api/cable/history:
 *   get:
 *     summary: Get cable subscription history
 *     tags: [Cable TV]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: History retrieved successfully
 */
router.get("/history", verifyToken, getCableHistory);

module.exports = router;