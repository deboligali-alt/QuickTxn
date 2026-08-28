const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    getBanks,
    resolveAccount,
    transferMoney,
    getTransferHistory,
} = require("../controllers/bankTransferController");

/**
 * @swagger
 * tags:
 *   name: Bank Transfer
 *   description: Nigerian bank transfer endpoints
 */

// Get all banks
router.get("/banks", verifyToken, getBanks);

// Resolve account number
router.post("/resolve", verifyToken, resolveAccount);

// Send money
router.post("/transfer", verifyToken, transferMoney);

// Transfer history
router.get("/history", verifyToken, getTransferHistory);

module.exports = router;