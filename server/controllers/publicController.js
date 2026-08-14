const { pool } = require("../config/db");

// =======================================
// Get Public Statistics
// =======================================
const getPublicStats = async (req, res) => {
    try {
        // Total Users
        const usersResult = await pool.query(`
            SELECT COUNT(*) AS total
            FROM users
        `);

        // Total Transactions
        const transactionsResult = await pool.query(`
            SELECT COUNT(*) AS total
            FROM transactions
        `);

        // Total Airtime Swaps
        const swapsResult = await pool.query(`
            SELECT COUNT(*) AS total
            FROM airtime_swaps
        `);

        // Total Wallet Funding
        const walletVolumeResult = await pool.query(`
            SELECT COALESCE(SUM(amount), 0) AS total
            FROM transactions
            WHERE type = 'FUND'
              AND status = 'success'
        `);

        return res.status(200).json({
            success: true,
            data: {
                users: Number(usersResult.rows[0].total),
                transactions: Number(transactionsResult.rows[0].total),
                airtimeSwaps: Number(swapsResult.rows[0].total),
                walletVolume: Number(walletVolumeResult.rows[0].total),
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

// =======================================
// Get Public Testimonials
// =======================================
const getPublicTestimonials = async (req, res) => {
    try {

        const result = await pool.query(`
            SELECT
                id,
                name,
                location,
                message,
                rating
            FROM testimonials
            WHERE is_active = TRUE
            ORDER BY created_at DESC
        `);

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
    getPublicStats,
    getPublicTestimonials,
};