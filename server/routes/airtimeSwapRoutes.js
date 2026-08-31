const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware"); // use your real filename
const {
    createSwap,
    getMySwaps,
} = require("../controllers/airtimeSwapController");

router.post("/", auth, createSwap);
router.get("/my", auth, getMySwaps);

module.exports = router;