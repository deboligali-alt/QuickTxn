const pinService = require("../services/pinService");

// ================================
// Create PIN
// ================================
const createPin = async (req, res) => {
    try {
        const { pin } = req.body;

        if (!pin) {
            return res.status(400).json({
                success: false,
                message: "PIN is required.",
            });
        }

        if (!/^\d{4}$/.test(pin)) {
            return res.status(400).json({
                success: false,
                message: "PIN must be exactly 4 digits.",
            });
        }

        await pinService.createPin(req.user.id, pin);

        return res.status(201).json({
            success: true,
            message: "Transaction PIN created successfully.",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================================
// Change PIN
// ================================
const changePin = async (req, res) => {
    try {
        const { currentPin, newPin } = req.body;

        if (!currentPin || !newPin) {
            return res.status(400).json({
                success: false,
                message: "Current PIN and new PIN are required.",
            });
        }

        if (!/^\d{4}$/.test(newPin)) {
            return res.status(400).json({
                success: false,
                message: "New PIN must be exactly 4 digits.",
            });
        }

        await pinService.changePin(
            req.user.id,
            currentPin,
            newPin
        );

        return res.status(200).json({
            success: true,
            message: "Transaction PIN changed successfully.",
        });
    } catch (error) {
        console.error(error);

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// ================================
// Verify PIN
// ================================
const verifyPin = async (req, res) => {
    try {
        const { pin } = req.body;

        if (!pin) {
            return res.status(400).json({
                success: false,
                message: "PIN is required.",
            });
        }

        await pinService.verifyPin(req.user.id, pin);

        return res.status(200).json({
            success: true,
            message: "PIN verified successfully.",
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createPin,
    changePin,
    verifyPin,
};