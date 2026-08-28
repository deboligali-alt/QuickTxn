const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const verifyAdmin = require("../middleware/adminMiddleware");

const {
    getAllUsers,
    getUser,
    toggleUserStatus,
    resetUserPin,
    resetPassword,
    deleteUser,
    fundUserWallet,
} = require("../controllers/adminUserController");

// All routes require admin access
router.use(verifyToken, verifyAdmin);

// Dashboard
router.get("/", getAllUsers);

// Single user
router.get("/:id", getUser);

// Fund wallet
router.post("/:id/fund", fundUserWallet);

// Suspend / Activate
router.patch("/:id/status", toggleUserStatus);

// Reset PIN
router.patch("/:id/reset-pin", resetUserPin);

// Reset Password
router.patch("/:id/reset-password", resetPassword);

// Soft delete
router.delete("/:id", deleteUser);

module.exports = router;