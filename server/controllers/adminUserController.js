const { pool } = require("../config/db");
const crypto = require("crypto");
// ========================================
// Get All Users
// ========================================
const getAllUsers = async (req, res) => {
    try {

        const result = await pool.query(`
            SELECT
                id,
                full_name,
                email,
                phone,
                role,
                is_active,
                created_at
            FROM users
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

// ========================================
// Get Single User
// ========================================
const getUser = async (req, res) => {

    const { id } = req.params;

    try {

        // User Details
        const userResult = await pool.query(
            `
            SELECT
                id,
                full_name,
                email,
                phone,
                role,
                is_verified,
                balance,
                created_at
            FROM users
            WHERE id = $1
            `,
            [id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Total Transactions
        const transactionResult = await pool.query(
            `
            SELECT COUNT(*) AS total_transactions
            FROM transactions
            WHERE sender_id = $1
               OR receiver_id = $1
            `,
            [id]
        );

        // Airtime Swaps
        const airtimeSwapResult = await pool.query(
            `
            SELECT COUNT(*) AS total_airtime_swaps
            FROM airtime_swaps
            WHERE user_id = $1
            `,
            [id]
        );

        // Data Purchases
        const dataPurchaseResult = await pool.query(
            `
            SELECT COUNT(*) AS total_data_purchases
            FROM data_purchases
            WHERE user_id = $1
            `,
            [id]
        );

        return res.status(200).json({
            success: true,
            data: {
                ...userResult.rows[0],
                total_transactions: Number(
                    transactionResult.rows[0].total_transactions
                ),
                total_airtime_swaps: Number(
                    airtimeSwapResult.rows[0].total_airtime_swaps
                ),
                total_data_purchases: Number(
                    dataPurchaseResult.rows[0].total_data_purchases
                ),
            },
        });

    } catch (error) {

        console.error("Get User Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });

    }

};
// ========================================
// Suspend / Activate User
// ========================================
const toggleUserStatus = async (req, res) => {

    const { id } = req.params;

    try {

        const existingUser = await pool.query(
            `
            SELECT
                id,
                full_name,
                is_active
            FROM users
            WHERE id = $1
            `,
            [id]
        );

        if (existingUser.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const currentStatus = existingUser.rows[0].is_active;

        const result = await pool.query(
            `
            UPDATE users
            SET
                is_active = $1
            WHERE id = $2
            RETURNING
                id,
                full_name,
                email,
                phone,
                role,
                is_verified,
                is_active,
                created_at
            `,
            [
                !currentStatus,
                id,
            ]
        );

        return res.status(200).json({
            success: true,
            message: !currentStatus
                ? "User activated successfully."
                : "User suspended successfully.",
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

// ========================================
// Reset Transaction PIN
// ========================================
const resetUserPin = async (req, res) => {

    const { id } = req.params;

    try {

        const userResult = await pool.query(
            `
            SELECT
                id,
                full_name
            FROM users
            WHERE id = $1
            `,
            [id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        await pool.query(
            `
            UPDATE users
            SET
                transaction_pin = NULL,
                transaction_pin_set = FALSE
            WHERE id = $1
            `,
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "Transaction PIN has been reset successfully.",
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });

    }

};


// ========================================
// Reset Password
// ========================================
const resetPassword = async (req, res) => {

    const { id } = req.params;

    try {

        const userResult = await pool.query(
            `
            SELECT
                id,
                email,
                full_name
            FROM users
            WHERE id = $1
            `,
            [id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");

        const expires = new Date(
            Date.now() + 60 * 60 * 1000
        );

        await pool.query(
            `
            UPDATE users
            SET
                reset_token = $1,
                reset_token_expires = $2
            WHERE id = $3
            `,
            [
                resetToken,
                expires,
                id,
            ]
        );

        return res.status(200).json({
            success: true,
            message: "Password reset token generated successfully.",
            data: {
                email: userResult.rows[0].email,
                reset_token: resetToken,
                expires_at: expires,
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
// ========================================
// Delete User (Soft Delete)
// ========================================
const deleteUser = async (req, res) => {

    const { id } = req.params;

    try {

        const userResult = await pool.query(
            `
            SELECT
                id,
                full_name
            FROM users
            WHERE id = $1
            `,
            [id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        await pool.query(
            `
            UPDATE users
            SET
                is_active = FALSE
            WHERE id = $1
            `,
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "User account deactivated successfully.",
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
    getAllUsers,
    getUser,
    toggleUserStatus,
    resetUserPin,
    resetPassword,
    deleteUser,
};