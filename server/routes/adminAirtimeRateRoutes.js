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
 *     summary: Create a new airtime rate
 *     tags: [Admin Airtime Rates]
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
 *               - rate
 *             properties:
 *               network:
 *                 type: string
 *                 example: MTN
 *               rate:
 *                 type: number
 *                 example: 80
 *     responses:
 *       201:
 *         description: Airtime rate created successfully
 */
router.post("/", verifyToken, isAdmin, createAirtimeRate);

/**
 * @swagger
 * /api/admin/airtime-rates/{id}:
 *   put:
 *     summary: Update an airtime rate
 *     tags: [Admin Airtime Rates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               network:
 *                 type: string
 *                 example: MTN
 *               rate:
 *                 type: number
 *                 example: 82
 *               is_active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Airtime rate updated successfully
 */
router.put("/:id", verifyToken, isAdmin, updateAirtimeRate);

/**
 * @swagger
 * /api/admin/airtime-rates/{id}:
 *   delete:
 *     summary: Delete an airtime rate
 *     tags: [Admin Airtime Rates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Airtime rate deleted successfully
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Airtime rate status updated successfully
 */
router.patch("/:id/status", verifyToken, isAdmin, toggleAirtimeRateStatus);

module.exports = router;