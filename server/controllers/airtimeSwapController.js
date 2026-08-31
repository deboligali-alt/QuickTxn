
const { pool } = require("../config/db");
const bcrypt = require("bcryptjs");

// ====================================
// Submit Airtime Swap Request
// ====================================
const createSwapRequest = async (req, res) => {
    try {
        const {
            network,
            senderPhone,
            amount,
            screenshot,
            pin,
        } = req.body;

        // Validation
        if (
            !network ||
            !senderPhone ||
            !amount ||
            !screenshot ||
            !pin
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        if (pin.length !== 4) {
            return res.status(400).json({
                success: false,
                message: "Transaction PIN must be 4 digits.",
            });
        }

        // Verify user's PIN
        const userResult = await pool.query(
            `SELECT transaction_pin
       FROM users
       WHERE id = $1`,
            [req.user.id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const validPin = await bcrypt.compare(
            pin,
            userResult.rows[0].transaction_pin
        );

        if (!validPin) {
            return res.status(401).json({
                success: false,
                message: "Incorrect transaction PIN.",
            });
        }

        // Get current conversion rate
        const rateResult = await pool.query(
            `SELECT rate
       FROM airtime_rates
       WHERE network = $1
       AND is_active = TRUE`,
            [network.toUpperCase()]
        );

        if (rateResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Conversion rate not available.",
            });
        }

        const rate = Number(rateResult.rows[0].rate);

        // Calculate receivable amount
        const receivableAmount = Math.floor(
            (Number(amount) * rate) / 100
        );

        const reference = `ATS-${Date.now()}`;

        // Save request
        await pool.query(
            `INSERT INTO airtime_swaps
      (
        user_id,
        network,
        phone_number,
        airtime_amount,
        rate,
        receivable_amount,
        screenshot,
        transaction_reference
      )
      VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,
            [
                req.user.id,
                network.toUpperCase(),
                senderPhone,
                Number(amount),
                rate,
                receivableAmount,
                screenshot,
                reference,
            ]
        );

        // Notification
        await pool.query(
            `INSERT INTO notifications
      (
        user_id,
        title,
        message
      )
      VALUES($1,$2,$3)`,
            [
                req.user.id,
                "Airtime Swap Submitted",
                `Your ₦${Number(amount).toLocaleString()} airtime conversion request is awaiting approval.`,
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Swap request submitted successfully.",
            data: {
                rate,
                receivableAmount,
                reference,
                status: "PENDING",
            },
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// ====================================
// Get Conversion Rates
// ====================================
const getRates = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
        network,
        rate
      FROM airtime_rates
      WHERE is_active = TRUE
      ORDER BY network`
        );

        return res.status(200).json({
            success: true,
            data: result.rows,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Unable to load rates.",
        });
    }
};

// ====================================
// User Swap History
// ====================================
const getSwapHistory = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
        id,
        network,
        phone_number,
        airtime_amount,
        rate,
        receivable_amount,
        screenshot,
        status,
        transaction_reference,
        created_at
      FROM airtime_swaps
      WHERE user_id = $1
      ORDER BY created_at DESC`,
            [req.user.id]
        );

        return res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

module.exports = {
    createSwapRequest,
    getRates,
    getSwapHistory,
};