const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    initializePayment,
    handlePaystackWebhook,
} = require("../controllers/paystackController");

/**
 * ==========================================
 * Initialize Wallet Funding
 * POST /api/paystack/initialize
 * ==========================================
 */
router.post(
    "/initialize",
    authMiddleware,
    initializePayment
);

/**
 * ==========================================
 * Paystack Webhook
 * POST /api/paystack/webhook
 * ==========================================
 */
router.post(
    "/webhook",
    handlePaystackWebhook
);

module.exports = router;