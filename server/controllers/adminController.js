const { pool } = require("../config/db");

const { creditWallet } = require("../services/walletService");

const { createTransaction } = require("../services/transactionService");
// Get all airtime swap requests
const getAllAirtimeSwaps = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                a.id,
                u.full_name,
                u.email,
                a.network,
                a.phone_number,
                a.airtime_amount,
                a.rate,
                a.receivable_amount,
                a.status,
                a.transaction_reference,
                a.created_at
            FROM airtime_swaps a
            JOIN users u
            ON a.user_id = u.id
            ORDER BY a.created_at DESC
        `);

        return res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

const getSingleAirtimeSwap = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            `
            SELECT
                a.*,
                u.full_name,
                u.email,
                u.phone
            FROM airtime_swaps a
            JOIN users u
            ON a.user_id = u.id
            WHERE a.id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Conversion not found."
            });
        }

        return res.json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};

// Approve airtime swap
const approveAirtimeSwap = async (req, res) => {
    const { id } = req.params;
    const adminId = req.user.id;

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const swapResult = await client.query(
            `SELECT * FROM airtime_swaps
             WHERE id = $1
             FOR UPDATE`,
            [id]
        );

        if (swapResult.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({
                success: false,
                message: "Airtime swap not found.",
            });
        }

        // Initialize swap FIRST
        const swap = swapResult.rows[0];

        // Then initialize amount
        const amount = Number(swap.receivable_amount);

        if (swap.status !== "PENDING") {
            await client.query("ROLLBACK");
            return res.status(400).json({
                success: false,
                message: `Already ${swap.status}`,
            });
        }

        await creditWallet(swap.user_id, amount, client);

        const reference = `ATC-${Date.now()}`;

        await client.query(
            `INSERT INTO transactions
            (
                sender_id,
                receiver_id,
                type,
                amount,
                description,
                status,
                reference,
                payment_provider,
                payment_reference
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
            [
                null,
                swap.user_id,
                "CREDIT",
                amount,
                `Airtime swap approved - ${swap.network}`,
                "SUCCESS",
                reference,
                "AIRTIME_SWAP",
                swap.transaction_reference,
            ]
        );

        const updated = await client.query(
            `UPDATE airtime_swaps
             SET status='APPROVED',
                 approved_by=$1,
                 approved_at=NOW(),
                 updated_at=NOW()
             WHERE id=$2
             RETURNING *`,
            [adminId, id]
        );

        await client.query(
            `INSERT INTO notifications
            (user_id,title,message)
            VALUES ($1,$2,$3)`,
            [
                swap.user_id,
                "Wallet Funded",
                `₦${amount.toLocaleString()} has been credited to your wallet successfully.`,
            ]
        );

        await client.query("COMMIT");

        return res.status(200).json({
            success: true,
            message: "Airtime swap approved successfully.",
            data: updated.rows[0],
        });

    } catch (error) {
        await client.query("ROLLBACK");
        console.error("APPROVE ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    } finally {
        client.release();
    }
};

const rejectAirtimeSwap = async (req, res) => {
    try {
        const { id } = req.params;
        const { adminNote } = req.body;

        const result = await pool.query(
            `UPDATE airtime_swaps
     SET status = 'REJECTED',
         admin_note = $1,
         updated_at = NOW()
     WHERE id = $2
     AND status = 'PENDING'
     RETURNING *`,
            [adminNote || "Rejected by admin", id]
        );

        if (result.rows.length > 0) {
            const swap = result.rows[0];

            // Save notification
            await pool.query(
                `
        INSERT INTO notifications
        (user_id, title, message)
        VALUES ($1, $2, $3)
        `,
                [
                    swap.user_id,
                    "Airtime Swap Rejected",
                    `Your airtime swap request of ₦${Number(
                        swap.airtime_amount
                    ).toLocaleString()} was rejected. Reason: ${swap.admin_note}.`
                ]
            );

            // Send instant notification
            const io = req.app.get("io");

            io.to(swap.user_id).emit("notification", {
                title: "Airtime Swap Rejected",
                message: `Your airtime swap request of ₦${Number(
                    swap.airtime_amount
                ).toLocaleString()} was rejected. Reason: ${swap.admin_note}.`,
            });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Pending swap request not found."
            });
        }

        return res.json({
            success: true,
            message: "Airtime swap rejected successfully.",
            data: result.rows[0]
        });

    } catch (error) {

        console.error("Reject Airtime Error:");
        console.error(error);
        console.error(error.message);
        console.error(error.stack);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin Dashboard Statistics
const getDashboardStats = async (req, res) => {
    try {
        // Total Users
        const users = await pool.query(
            "SELECT COUNT(*) AS total_users FROM users"
        );

        // Total Airtime Swaps
        const swaps = await pool.query(
            "SELECT COUNT(*) AS total_swaps FROM airtime_swaps"
        );

        // Pending Swaps
        const pending = await pool.query(
            "SELECT COUNT(*) AS pending_swaps FROM airtime_swaps WHERE status = 'PENDING'"
        );

        // Approved Swaps
        const approved = await pool.query(
            "SELECT COUNT(*) AS approved_swaps FROM airtime_swaps WHERE status = 'APPROVED'"
        );

        // Rejected Swaps
        const rejected = await pool.query(
            "SELECT COUNT(*) AS rejected_swaps FROM airtime_swaps WHERE status = 'REJECTED'"
        );


        // Total Transactions
        const transactions = await pool.query(
            "SELECT COUNT(*) AS total_transactions FROM transactions"
        );

        // Total Wallet Balance
        const wallets = await pool.query(
            "SELECT COALESCE(SUM(balance),0) AS total_wallet_balance FROM wallets"
        );

        return res.status(200).json({
            success: true,
            data: {
                totalUsers: users.rows[0].total_users,
                totalWalletBalance: wallets.rows[0].total_wallet_balance,
                totalTransactions: transactions.rows[0].total_transactions,
                totalAirtimeSwaps: swaps.rows[0].total_swaps,
                pendingSwaps: pending.rows[0].pending_swaps,
                approvedSwaps: approved.rows[0].approved_swaps,
                rejectedSwaps: rejected.rows[0].rejected_swaps
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

// ========================================
// Airtime Conversion Statistics
// ========================================

const getAirtimeSwapStats = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                COUNT(*) FILTER (
                    WHERE status = 'PENDING'
                ) AS pending,

                COUNT(*) FILTER (
                    WHERE status = 'APPROVED'
                ) AS approved,

                COUNT(*) FILTER (
                    WHERE status = 'REJECTED'
                ) AS rejected,

                COALESCE(
                    SUM(
                        CASE
                            WHEN status = 'APPROVED'
                            AND approved_at >= CURRENT_DATE
                            THEN receivable_amount
                            ELSE 0
                        END
                    ),
                    0
                ) AS today_volume

            FROM airtime_swaps
        `);

        return res.status(200).json({
            success: true,
            data: {
                pending: Number(result.rows[0].pending),
                approved: Number(result.rows[0].approved),
                rejected: Number(result.rows[0].rejected),
                todayVolume: Number(result.rows[0].today_volume)
            }
        });

    } catch (error) {
        console.error("Airtime Swap Stats Error:");
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Unable to load airtime swap statistics."
        });
    }
};

// Get All Users
const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                u.id,
                u.full_name,
                u.email,
                u.phone,
                u.role,
                w.balance,
                u.created_at
            FROM users u
            LEFT JOIN wallets w
            ON u.id = w.user_id
            ORDER BY u.created_at DESC
        `);

        return res.status(200).json({
            success: true,
            count: result.rows.length,
            users: result.rows
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

// Broadcast notification to all users
const broadcastNotification = async (req, res) => {
    try {
        const { title, message } = req.body;

        if (!title || !message) {
            return res.status(400).json({
                success: false,
                message: "Title and message are required.",
            });
        }

        // Get all users
        const users = await pool.query(
            "SELECT id FROM users"
        );

        const io = req.app.get("io");

        // Save + Send notification
        for (const user of users.rows) {
            await pool.query(
                `
                INSERT INTO notifications
                (user_id, title, message)
                VALUES ($1, $2, $3)
                `,
                [user.id, title, message]
            );

            // Real-time popup
            io.to(user.id).emit("notification", {
                title,
                message,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Broadcast sent successfully.",
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
    getDashboardStats,
    getAirtimeSwapStats,
    getAllAirtimeSwaps,
    getSingleAirtimeSwap,
    approveAirtimeSwap,
    rejectAirtimeSwap,
    getAllUsers,
    broadcastNotification,
};