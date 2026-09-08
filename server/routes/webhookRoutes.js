const express = require("express");
const router = express.Router();

const { paystackWebhook } = require("../controllers/webhookController");

const {
  clubkonnectWebhook,
} = require("../controllers/clubkonnectWebhookController");

// Paystack webhook
router.post(
  "/paystack",
  express.raw({ type: "application/json" }),
  paystackWebhook
);

// ClubKonnect callback
router.get(
  "/clubkonnect",
  clubkonnectWebhook
);

module.exports = router;