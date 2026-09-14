const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const { purchaseWaec } = require("../controllers/waecController");

/**
 * @swagger
 * tags:
 *   - name: WAEC
 *     description: WAEC Result Checker services
 */

/**
 * @swagger
 * /api/waec/purchase:
 *   post:
 *     summary: Purchase WAEC Result Checker PIN
 *     tags: [WAEC]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *               - pin
 *             properties:
 *               quantity:
 *                 type: number
 *                 example: 1
 *               pin:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: WAEC PIN purchased successfully
 */
router.post("/purchase", verifyToken, purchaseWaec);

module.exports = router;