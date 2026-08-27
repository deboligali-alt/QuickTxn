const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    getDataPlans,
    purchaseData,
    getDataHistory,
} = require("../controllers/dataPurchaseController");

/**
 * ==========================================
 * DATA PURCHASE ROUTES
 * Base URL: /api/data
 * ==========================================
 */

// Get all available data plans
router.get(
    "/plans",
    verifyToken,
    getDataPlans
);

// Purchase data bundle
router.post(
    "/purchase",
    verifyToken,
    purchaseData
);

// User data purchase history
router.get(
    "/history",
    verifyToken,
    getDataHistory
);

module.exports = router;