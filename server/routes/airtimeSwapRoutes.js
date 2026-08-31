
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createSwapRequest,
    getRates,
    getSwapHistory,
} = require("../controllers/airtimeSwapController");

// Conversion rates
router.get("/rates", authMiddleware, getRates);

// User history
router.get("/history", authMiddleware, getSwapHistory);

// Submit request
router.post("/", authMiddleware, createSwapRequest);

module.exports = router;