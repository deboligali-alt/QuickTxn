const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
    getAllKYC,
    approveKYC,
    rejectKYC,
} = require("../controllers/adminKycController");

router.get("/", auth, admin("ADMIN", "SUPER_ADMIN"), getAllKYC);

router.patch("/:id/approve", auth, admin("ADMIN", "SUPER_ADMIN"), approveKYC);

router.patch("/:id/reject", auth, admin("ADMIN", "SUPER_ADMIN"), rejectKYC);

module.exports = router;