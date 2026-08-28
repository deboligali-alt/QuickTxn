const router = require("express").Router();
const verifyToken = require("../middleware/authMiddleware");
const {
    purchaseWaecPin,
} = require("../controllers/waecController");

router.post(
    "/purchase",
    verifyToken,
    purchaseWaecPin
);

module.exports = router;