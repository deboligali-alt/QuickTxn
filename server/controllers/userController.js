const { pool } = require("../config/db");
const bcrypt = require("bcryptjs");

// ===============================
// Get Profile
// ===============================
const getProfile = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                id,
                full_name,
                email,
                phone,
                balance,
                is_verified,
                created_at
             FROM users
             WHERE id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile retrieved successfully.",
            user: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

// ===============================
// User Dashboard
// ===============================
const getDashboard = async (req, res) => {
    try {
        const userId = req.user.id;

        // Wallet Balance
        const wallet = await pool.query(
            `SELECT balance
             FROM wallets
             WHERE user_id = $1`,
            [userId]
        );

        // Total Transactions
        const transactions = await pool.query(
            `SELECT COUNT(*) AS total
             FROM transactions
             WHERE sender_id = $1
                OR receiver_id = $1`,
            [userId]
        );

        // Total Wallet Funding
        const funding = await pool.query(
            `SELECT COALESCE(SUM(amount), 0) AS total
             FROM transactions
             WHERE receiver_id = $1
             AND type = 'FUND'
             AND status = 'success'`,
            [userId]
        );

        // Total Transfers
        const transfers = await pool.query(
            `SELECT COALESCE(SUM(amount), 0) AS total
             FROM transactions
             WHERE sender_id = $1
             AND type = 'TRANSFER'
             AND status = 'success'`,
            [userId]
        );

        // Airtime Swaps
        const swaps = await pool.query(
            `SELECT COUNT(*) AS total
             FROM airtime_swaps
             WHERE user_id = $1`,
            [userId]
        );

        // Beneficiaries
        const beneficiaries = await pool.query(
            `SELECT COUNT(*) AS total
             FROM beneficiaries
             WHERE user_id = $1`,
            [userId]
        );

        // Unread Notifications
        const notifications = await pool.query(
            `SELECT COUNT(*) AS total
             FROM notifications
             WHERE user_id = $1
             AND is_read = FALSE`,
            [userId]
        );

        return res.status(200).json({
            success: true,
            data: {
                walletBalance:
                    wallet.rows[0]?.balance || 0,

                totalTransactions:
                    Number(
                        transactions.rows[0].total
                    ),

                totalFunding:
                    Number(
                        funding.rows[0].total
                    ),

                totalTransfers:
                    Number(
                        transfers.rows[0].total
                    ),

                totalAirtimeSwaps:
                    Number(
                        swaps.rows[0].total
                    ),

                savedBeneficiaries:
                    Number(
                        beneficiaries.rows[0].total
                    ),

                unreadNotifications:
                    Number(
                        notifications.rows[0].total
                    )
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

// ===============================
// Update Profile
// ===============================
const updateProfile = async (req, res) => {
    try {
        const {
            fullName,
            phone
        } = req.body;

        if (!fullName || !phone) {
            return res.status(400).json({
                success: false,
                message:
                    "Full name and phone are required."
            });
        }

        const result = await pool.query(
            `
            UPDATE users
            SET
                full_name = $1,
                phone = $2,
                updated_at = NOW()
            WHERE id = $3
            RETURNING
                id,
                full_name,
                email,
                phone,
                is_verified,
                created_at
            `,
            [
                fullName,
                phone,
                req.user.id
            ]
        );

        return res.status(200).json({
            success: true,
            message:
                "Profile updated successfully.",
            user: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

// ===============================
// Change Password
// ===============================
const changePassword = async (req, res) => {
    try {
        const {
            currentPassword,
            newPassword
        } = req.body;

        if (
            !currentPassword ||
            !newPassword
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Current password and new password are required."
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "New password must be at least 6 characters."
            });
        }

        const result = await pool.query(
            `SELECT password
             FROM users
             WHERE id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const user = result.rows[0];

        const isMatch =
            await bcrypt.compare(
                currentPassword,
                user.password
            );

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message:
                    "Current password is incorrect."
            });
        }

        if (
            currentPassword ===
            newPassword
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "New password must be different from the current password."
            });
        }

        const hashedPassword =
            await bcrypt.hash(
                newPassword,
                10
            );

        await pool.query(
            `UPDATE users
             SET password = $1
             WHERE id = $2`,
            [
                hashedPassword,
                req.user.id
            ]
        );

        return res.status(200).json({
            success: true,
            message:
                "Password changed successfully."
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

// ===============================
// Set Transaction PIN
// ===============================
const setTransactionPin = async (
    req,
    res
) => {
    try {
        const { pin } = req.body;

        if (!pin) {
            return res.status(400).json({
                success: false,
                message:
                    "Transaction PIN is required."
            });
        }

        if (!/^\d{4}$/.test(pin)) {
            return res.status(400).json({
                success: false,
                message:
                    "PIN must be exactly 4 digits."
            });
        }

        const userResult =
            await pool.query(
                `SELECT transaction_pin
                 FROM users
                 WHERE id = $1`,
                [req.user.id]
            );

        if (
            userResult.rows.length === 0
        ) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        if (
            userResult.rows[0]
                .transaction_pin
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Transaction PIN already exists. Please change it instead."
            });
        }

        const hashedPin =
            await bcrypt.hash(
                pin,
                10
            );

        await pool.query(
            `UPDATE users
             SET transaction_pin = $1
             WHERE id = $2`,
            [
                hashedPin,
                req.user.id
            ]
        );

        return res.status(200).json({
            success: true,
            message:
                "Transaction PIN created successfully."
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

// ===============================
// Change Transaction PIN
// ===============================
const changeTransactionPin = async (
    req,
    res
) => {
    try {
        const {
            currentPin,
            newPin
        } = req.body;

        // Validate required fields
        if (
            !currentPin ||
            !newPin
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Current PIN and new PIN are required."
            });
        }

        // Validate current PIN
        if (
            !/^\d{4}$/.test(
                currentPin
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Current PIN must be exactly 4 digits."
            });
        }

        // Validate new PIN
        if (
            !/^\d{4}$/.test(
                newPin
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "New PIN must be exactly 4 digits."
            });
        }

        // Make sure PINs are different
        if (
            currentPin ===
            newPin
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "New PIN must be different from the current PIN."
            });
        }

        // Get existing PIN
        const result =
            await pool.query(
                `SELECT transaction_pin
                 FROM users
                 WHERE id = $1`,
                [req.user.id]
            );

        if (
            result.rows.length === 0
        ) {
            return res.status(404).json({
                success: false,
                message:
                    "User not found."
            });
        }

        const storedPin =
            result.rows[0]
                .transaction_pin;

        // User has no PIN
        if (!storedPin) {
            return res.status(400).json({
                success: false,
                message:
                    "Transaction PIN has not been set. Please create a PIN first."
            });
        }

        // Verify current PIN
        const isMatch =
            await bcrypt.compare(
                currentPin,
                storedPin
            );

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message:
                    "Current transaction PIN is incorrect."
            });
        }

        // Hash new PIN
        const hashedNewPin =
            await bcrypt.hash(
                newPin,
                10
            );

        // Update PIN
        await pool.query(
            `UPDATE users
             SET transaction_pin = $1
             WHERE id = $2`,
            [
                hashedNewPin,
                req.user.id
            ]
        );

        return res.status(200).json({
            success: true,
            message:
                "Transaction PIN changed successfully."
        });

    } catch (error) {
        console.error(
            "CHANGE TRANSACTION PIN ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};




const changePin = async (req, res) => {
    const { currentPin, newPin } = req.body;
    const userId = req.user.id;

    try {
        if (!currentPin || !newPin) {
            return res.status(400).json({
                success: false,
                message: "Current PIN and new PIN are required.",
            });
        }

        if (newPin.length !== 4) {
            return res.status(400).json({
                success: false,
                message: "PIN must be exactly 4 digits.",
            });
        }

        const result = await pool.query(
            "SELECT transaction_pin FROM users WHERE id = $1",
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const validPin = await bcrypt.compare(
            currentPin,
            result.rows[0].transaction_pin
        );

        if (!validPin) {
            return res.status(401).json({
                success: false,
                message: "Current PIN is incorrect.",
            });
        }

        const hashedPin = await bcrypt.hash(newPin, 10);

        await pool.query(
            `UPDATE users
       SET transaction_pin = $1,
           updated_at = NOW()
       WHERE id = $2`,
            [hashedPin, userId]
        );

        return res.status(200).json({
            success: true,
            message: "Transaction PIN updated successfully.",
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server error.",
        });
    }
};

// ===============================
// Export Controllers
// ===============================
module.exports = {
    getProfile,
    updateProfile,
    changePassword,
    setTransactionPin,
    changeTransactionPin,
    changePin,
    getDashboard,
};