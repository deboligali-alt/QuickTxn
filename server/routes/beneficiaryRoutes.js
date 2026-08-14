const express = require("express");
const router = express.Router();

const {
    addBeneficiary,
    getBeneficiaries,
    deleteBeneficiary,
    transferToBeneficiary
} = require("../controllers/beneficiaryController");

const verifyToken = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   - name: Beneficiaries
 *     description: Manage saved beneficiaries
 */

/**
 * @swagger
 * /api/beneficiaries:
 *   post:
 *     summary: Save a beneficiary
 *     tags: [Beneficiaries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountName
 *               - accountNumber
 *               - bankName
 *               - bankCode
 *             properties:
 *               accountName:
 *                 type: string
 *                 example: John Doe
 *               accountNumber:
 *                 type: string
 *                 example: "0123456789"
 *               bankName:
 *                 type: string
 *                 example: Access Bank
 *               bankCode:
 *                 type: string
 *                 example: "044"
 *     responses:
 *       201:
 *         description: Beneficiary added successfully
 *       409:
 *         description: Beneficiary already exists
 */
router.post("/", verifyToken, addBeneficiary);

/**
 * @swagger
 * /api/beneficiaries:
 *   get:
 *     summary: Get all saved beneficiaries
 *     tags: [Beneficiaries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Beneficiaries retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", verifyToken, getBeneficiaries);

/**
 * @swagger
 * /api/beneficiaries/{id}:
 *   delete:
 *     summary: Delete a saved beneficiary
 *     tags: [Beneficiaries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "54f8c8df-cc21-404a-82b2-5a99eec806d5"
 *     responses:
 *       200:
 *         description: Beneficiary deleted successfully
 *       404:
 *         description: Beneficiary not found
 */
router.delete("/:id", verifyToken, deleteBeneficiary);

/**
 * @swagger
 * /api/beneficiaries/transfer:
 *   post:
 *     summary: Transfer using a saved beneficiary
 *     tags: [Beneficiaries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - beneficiaryId
 *               - amount
 *             properties:
 *               beneficiaryId:
 *                 type: string
 *                 example: "c10ea5f0-df93-4dc2-8fa1-60f2019f2b3e"
 *               amount:
 *                 type: number
 *                 example: 5000
 *     responses:
 *       200:
 *         description: Beneficiary retrieved successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Beneficiary not found
 */
router.post("/transfer", verifyToken, transferToBeneficiary);

module.exports = router;