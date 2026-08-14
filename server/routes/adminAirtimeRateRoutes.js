const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

const {
    getAllAirtimeRates,
    createAirtimeRate,
    updateAirtimeRate,
    deleteAirtimeRate,
    toggleAirtimeRateStatus,
} = require("../controllers/adminAirtimeRateController");

/**
 * @swagger
 * tags:
 *   - name: Admin Airtime Rates
 *     description: Manage airtime swap rates
 */

/**
 * @swagger
 * /api/admin/airtime-rates:
 *   get:
 *     summary: Get all airtime rates
 *     tags: [Admin Airtime Rates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Airtime rates retrieved successfully
 */
router.get("/", verifyToken, isAdmin, getAllAirtimeRates);

/**
 * @swagger
 * /api/admin/airtime-rates:
 *   post:
 *     summary: Create airtime rate
 *     tags: [Admin Airtime Rates]
 *     security:
 *       - bearerAuth: []
 */
router.post("/", verifyToken, isAdmin, createAirtimeRate);

/**
 * @swagger
 * /api/admin/airtime-rates/{id}:
 *   put:
 *     summary: Update airtime rate
 *     tags: [Admin Airtime Rates]
 *     security:
 *       - bearerAuth: []
 */
router.put("/:id", verifyToken, isAdmin, updateAirtimeRate);

/**
 * @swagger
 * /api/admin/airtime-rates/{id}:
 *   delete:
 *     summary: Delete airtime rate
 *     tags: [Admin Airtime Rates]
 *     security:
 *       - bearerAuth: []
 */
router.delete("/:id", verifyToken, isAdmin, deleteAirtimeRate);

/**
 * @swagger
 * /api/admin/airtime-rates/{id}/status:
 *   patch:
 *     summary: Activate or deactivate an airtime rate
 *     tags: [Admin Airtime Rates]
 *     security:
 *       - bearerAuth: []
 */
router.patch("/:id/status", verifyToken, isAdmin, toggleAirtimeRateStatus);

module.exports = router;