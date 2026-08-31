const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
    submitKYC,
    getMyKYC,
} = require("../controllers/kycController");

router.post("/submit", auth, submitKYC);
router.get("/me", auth, getMyKYC);

module.exports = router;