const router = require("express").Router();
const verifyToken = require("../middleware/authMiddleware");
const {
    purchaseElectricity,
} = require("../controllers/electricityController");

router.post(
    "/purchase",
    verifyToken,
    purchaseElectricity
);

module.exports = router;