const { pool } = require("../config/db");

// ========================================
// Send Contact Message
// ========================================

const sendContactMessage = async (req, res) => {
    const {
        fullName,
        email,
        subject,
        message,
    } = req.body;

    if (!fullName || !email || !subject || !message) {
        return res.status(400).json({
            success: false,
            message: "All fields are required.",
        });
    }

    try {
        const result = await pool.query(
            `
            INSERT INTO contact_messages
            (
                full_name,
                email,
                subject,
                message
            )
            VALUES
            ($1,$2,$3,$4)
            RETURNING *
            `,
            [
                fullName,
                email,
                subject,
                message,
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Message sent successfully.",
            data: result.rows[0],
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    }
};

// ========================================
// Get Contact Messages
// ========================================

const getContactMessages = async (req, res) => {

    try {

        const result = await pool.query(
            `
            SELECT *
            FROM contact_messages
            ORDER BY created_at DESC
            `
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
            message: "Internal Server Error",
        });

    }

};

module.exports = {
    sendContactMessage,
    getContactMessages,
};