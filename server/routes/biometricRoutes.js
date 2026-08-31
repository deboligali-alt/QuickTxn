const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    registerBiometric,
    getBiometric,
    deleteBiometric,
} = require("../controllers/biometricController");

// Get biometric status
router.get("/", authMiddleware, getBiometric);

// Register fingerprint / Face ID
router.post("/register", authMiddleware, registerBiometric);

// Remove biometric
router.delete("/", authMiddleware, deleteBiometric);

module.exports = router;