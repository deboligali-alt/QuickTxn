const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const { purchaseCable } = require("../controllers/cableController");

router.post("/purchase", verifyToken, purchaseCable);

module.exports = router;