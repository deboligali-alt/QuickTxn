const express = require("express");
const router = express.Router();

const { paystackWebhook } = require("../controllers/webhookController");
const {
  clubkonnectWebhook,
} = require("../controllers/clubkonnectWebhookController");

const {
  handleWebhook,
} = require("../controllers/monnifyController");

// ========================================
// Paystack Webhook
// ========================================
router.post(
  "/paystack",
  express.raw({ type: "application/json" }),
  paystackWebhook
);

// ========================================
// ClubKonnect Callback
// ========================================
router.get(
  "/clubkonnect",
  clubkonnectWebhook
);

// ========================================
// Monnify Webhook
// ========================================
router.post(
  "/monnify",
  express.json(),
  handleWebhook
);

module.exports = router;