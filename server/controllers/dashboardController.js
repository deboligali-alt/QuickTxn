const { pool } = require("../config/db");

// ========================================
// Get Dashboard
// ========================================
const getDashboard = async (req, res) => {
    try {
        const userId = req.user.id;

        // Run all queries in parallel
        const [userResult, walletResult, notificationResult, transactionResult] =
            await Promise.all([
                pool.query(
                    `SELECT id, full_name, email
           FROM users
           WHERE id = $1`,
                    [userId]
                ),

                pool.query(
                    `SELECT balance
           FROM wallets
           WHERE user_id = $1`,
                    [userId]
                ),

                pool.query(
                    `SELECT COUNT(*) AS total
           FROM notifications
           WHERE user_id = $1
           AND is_read = FALSE`,
                    [userId]
                ),

                pool.query(
                    `SELECT
              id,
              type,
              amount,
              status,
              reference,
              description,
              created_at
           FROM transactions
           WHERE sender_id = $1
              OR receiver_id = $1
           ORDER BY created_at DESC
           LIMIT 5`,
                    [userId]
                ),
            ]);

        return res.status(200).json({
            success: true,
            user: userResult.rows[0] || null,

            wallet: {
                balance:
                    walletResult.rows.length > 0
                        ? Number(walletResult.rows[0].balance)
                        : 0,
            },

            notifications: {
                unread: Number(notificationResult.rows[0].total),
            },

            transactions: transactionResult.rows,
        });
    } catch (error) {
        console.error("Dashboard Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to load dashboard.",
        });
    }
};

module.exports = {
    getDashboard,
};