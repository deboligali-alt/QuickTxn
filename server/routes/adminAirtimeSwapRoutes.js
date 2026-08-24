const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
    getAllAirtimeSwaps,
    getAirtimeSwap,
    approveAirtimeSwap,
    rejectAirtimeSwap,
} = require("../controllers/adminAirtimeSwapController");

// ========================================
// Get All Airtime Swaps
// ========================================
router.get(
    "/",
    authMiddleware,
    adminMiddleware("SUPER_ADMIN", "ADMIN", "AGENT"),
    getAllAirtimeSwaps
);

// ========================================
// Get Single Airtime Swap
// ========================================
router.get(
    "/:id",
    authMiddleware,
    adminMiddleware("SUPER_ADMIN", "ADMIN", "AGENT"),
    getAirtimeSwap
);

// ========================================
// Approve Airtime Swap
// ========================================
router.patch(
    "/:id/approve",
    authMiddleware,
    adminMiddleware("SUPER_ADMIN", "ADMIN"),
    approveAirtimeSwap
);

// ========================================
// Reject Airtime Swap
// ========================================
router.patch(
    "/:id/reject",
    authMiddleware,
    adminMiddleware("SUPER_ADMIN", "ADMIN"),
    rejectAirtimeSwap
);

module.exports = router;