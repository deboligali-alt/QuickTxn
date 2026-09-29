const express = require("express");

const {
    handleSMEPlugWebhook,
} = require("../controllers/smeplugWebhookController");

const router = express.Router();

router.post(
    "/smeplug",
    handleSMEPlugWebhook
);

module.exports = router;