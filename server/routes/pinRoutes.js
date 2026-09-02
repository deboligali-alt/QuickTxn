const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    createPin,
    changePin,
    verifyPin,
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
 */
router.post("/create", verifyToken, createPin);

/**
 * @swagger
 * /api/pin/change:
 *   patch:
 *     summary: Change transaction PIN
 *     tags: [Transaction PIN]
 *     security:
 *       - bearerAuth: []
 */
router.patch("/change", verifyToken, changePin);

/**
 * @swagger
 * /api/pin/verify:
 *   post:
 *     summary: Verify transaction PIN
 *     tags: [Transaction PIN]
 *     security:
 *       - bearerAuth: []
 */
router.post("/verify", verifyToken, verifyPin);

module.exports = router;