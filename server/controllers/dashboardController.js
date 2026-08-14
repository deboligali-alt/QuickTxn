const { pool } = require("../config/db");

const getDashboard = async (req, res) => {
    try {

        const userId = req.user.id;

        // Wallet Balance
        const walletResult = await pool.query(
            `SELECT balance
             FROM wallets
             WHERE user_id = $1`,
            [userId]
        );

        const walletBalance =
            walletResult.rows.length > 0
                ? Number(walletResult.rows[0].balance)
                : 0;

        // Total Transactions
        const transactionResult = await pool.query(
            `SELECT COUNT(*) AS total
             FROM transactions
             WHERE sender_id = $1
                OR receiver_id = $1`,
            [userId]
        );

        // Unread Notifications
        const notificationResult = await pool.query(
            `SELECT COUNT(*) AS total
             FROM notifications
             WHERE user_id = $1
             AND is_read = FALSE`,
            [userId]
        );

        // Recent Transactions
        const recentTransactions = await pool.query(
            `SELECT
                reference,
                type,
                amount,
                status,
                description,
                created_at
             FROM transactions
             WHERE sender_id = $1
                OR receiver_id = $1
             ORDER BY created_at DESC
             LIMIT 5`,
            [userId]
        );

        return res.status(200).json({
            success: true,
            data: {
                walletBalance,
                totalTransactions: Number(transactionResult.rows[0].total),
                unreadNotifications: Number(notificationResult.rows[0].total),
                recentTransactions: recentTransactions.rows
            }
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};

module.exports = {
    getDashboard
};