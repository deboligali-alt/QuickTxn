const { pool } = require("../config/db");
const notificationService = require("../services/notificationService");

// Submit Airtime Swap
const createSwap = async (req, res) => {
    const { network, senderPhone, amount, screenshot } = req.body;

    if (!network || !senderPhone || !amount || !screenshot) {
        return res.status(400).json({
            success: false,
            message: "Complete all fields.",
        });
    }

    try {
        const result = await pool.query(
            `INSERT INTO airtime_swap_requests
            (
                user_id,
                network,
                sender_phone,
                amount,
                screenshot
            )
            VALUES ($1,$2,$3,$4,$5)
            RETURNING *`,
            [
                req.user.id,
                network,
                senderPhone,
                amount,
                screenshot,
            ]
        );

        await notificationService.createNotification({
            userId: req.user.id,
            title: "Swap Submitted",
            message:
                "Your airtime swap request has been submitted for approval.",
        });

        return res.status(201).json({
            success: true,
            message: "Request submitted successfully.",
            data: result.rows[0],
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// User History
const getMySwaps = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT *
             FROM airtime_swap_requests
             WHERE user_id = $1
             ORDER BY created_at DESC`,
            [req.user.id]
        );

        return res.json({
            success: true,
            data: result.rows,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

module.exports = {
    createSwap,
    getMySwaps,
};