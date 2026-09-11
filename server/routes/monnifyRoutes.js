const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
    initializePayment,
    verifyPayment,
    handleWebhook,
    createVirtualAccount,
    getVirtualAccount,
} = require("../controllers/monnifyController");

// ========================================
// Wallet Funding
// ========================================
router.post(
    "/initialize",
    auth,
    initializePayment
);

router.get(
    "/verify/:reference",
    auth,
    verifyPayment
);

// ========================================
// Permanent Virtual Account
// ========================================
router.post(
    "/create-account",
    auth,
    createVirtualAccount
);

router.get(
    "/account",
    auth,
    getVirtualAccount
);

// ========================================
// Monnify Webhook
// ========================================
router.post(
    "/webhook",
    handleWebhook
);

module.exports = router;