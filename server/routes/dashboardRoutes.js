const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    getDashboard
} = require("../controllers/dashboardController");

/**
 * @swagger
 * tags:
 *   - name: Dashboard
 *     description: Dashboard overview
 */

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get dashboard summary
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard loaded successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", verifyToken, getDashboard);

module.exports = router;