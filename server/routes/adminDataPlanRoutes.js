const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

const {
    getAllDataPlans,
    createDataPlan,
    updateDataPlan,
    deleteDataPlan,
    toggleDataPlanStatus,
} = require("../controllers/adminDataPlanController");

/**
 * @swagger
 * tags:
 *   - name: Admin Data Plans
 *     description: Manage all data plans
 */

/**
 * @swagger
 * /api/admin/data-plans:
 *   get:
 *     summary: Get all data plans
 *     tags: [Admin Data Plans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data plans retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get(
    "/",
    verifyToken,
    isAdmin,
    getAllDataPlans
);

/**
 * @swagger
 * /api/admin/data-plans:
 *   post:
 *     summary: Create a new data plan
 *     tags: [Admin Data Plans]
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
 *               - plan_name
 *               - plan_code
 *               - amount
 *             properties:
 *               network:
 *                 type: string
 *                 example: MTN
 *               plan_name:
 *                 type: string
 *                 example: 10GB
 *               plan_code:
 *                 type: string
 *                 example: MTN10GB
 *               amount:
 *                 type: number
 *                 example: 3500
 *     responses:
 *       201:
 *         description: Data plan created successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.post(
    "/",
    verifyToken,
    isAdmin,
    createDataPlan
);

/**
 * @swagger
 * /api/admin/data-plans/{id}:
 *   put:
 *     summary: Update a data plan
 *     tags: [Admin Data Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Data plan ID
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
 *               plan_name:
 *                 type: string
 *                 example: 15GB
 *               plan_code:
 *                 type: string
 *                 example: MTN15GB
 *               amount:
 *                 type: number
 *                 example: 5000
 *               is_active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Data plan updated successfully
 *       404:
 *         description: Data plan not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.put(
    "/:id",
    verifyToken,
    isAdmin,
    updateDataPlan
);

/**
 * @swagger
 * /api/admin/data-plans/{id}:
 *   delete:
 *     summary: Delete a data plan
 *     tags: [Admin Data Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Data plan ID
 *     responses:
 *       200:
 *         description: Data plan deleted successfully
 *       404:
 *         description: Data plan not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.delete(
    "/:id",
    verifyToken,
    isAdmin,
    deleteDataPlan
);

/**
 * @swagger
 * /api/admin/data-plans/{id}/status:
 *   patch:
 *     summary: Activate or deactivate a data plan
 *     tags: [Admin Data Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Data plan ID
 *     responses:
 *       200:
 *         description: Data plan status updated successfully
 *       404:
 *         description: Data plan not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.patch(
    "/:id/status",
    verifyToken,
    isAdmin,
    toggleDataPlanStatus
);

module.exports = router;