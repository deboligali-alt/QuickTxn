const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
    getWaecProducts,
    purchaseWaec,
    getHistory,
} = require("../controllers/waecController");

router.get("/products", auth, getWaecProducts);
router.post("/purchase", auth, purchaseWaec);
router.get("/history", auth, getHistory);

module.exports = router;