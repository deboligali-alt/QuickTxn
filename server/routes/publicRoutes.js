const express = require("express");
const router = express.Router();

const {
    getPublicStats,
    getPublicTestimonials,
} = require("../controllers/publicController");

/**
 * @swagger
 * tags:
 *   - name: Public
 *     description: Public APIs for the QuickTxn landing page
 */

/**
 * @swagger
 * /api/public/stats:
 *   get:
 *     summary: Get QuickTxn public statistics
 *     tags: [Public]
 *     responses:
 *       200:
 *         description: Public statistics retrieved successfully
 */
router.get("/stats", getPublicStats);

/**
 * @swagger
 * /api/public/testimonials:
 *   get:
 *     summary: Get public testimonials
 *     tags: [Public]
 *     responses:
 *       200:
 *         description: Testimonials retrieved successfully
 */
router.get("/testimonials", getPublicTestimonials);

module.exports = router;