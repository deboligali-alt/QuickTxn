const { pool } = require("../config/db");

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
    const client = await pool.connect();

    try {
        const { id } = req.params;

        await client.query("BEGIN");

        // Get swap request
        const swapResult = await client.query(
            `SELECT * FROM airtime_swaps WHERE id = $1 FOR UPDATE`,
            [id]
        );

        if (swapResult.rows.length === 0) {
            await client.query("ROLLBACK");

            return res.status(404).json({
                success: false,
                message: "Swap request not found."
            });
        }

        const swap = swapResult.rows[0];

        if (swap.status !== "PENDING") {
            await client.query("ROLLBACK");

            return res.status(400).json({
                success: false,
                message: "This request has already been processed."
            });
        }

        // Credit user's wallet
        await client.query(
            `
            UPDATE wallets
            SET balance = balance + $1
            WHERE user_id = $2
            `,
            [swap.receivable_amount, swap.user_id]
        );

        // Approve request
        await client.query(
            `
            UPDATE airtime_swaps
            SET status='APPROVED',
                updated_at = NOW()
            WHERE id=$1
            `,
            [id]
        );

        // Save transaction
        await client.query(
            `
            INSERT INTO transactions
            (
                receiver_id,
                type,
                amount,
                description,
                status,
                reference
            )
            VALUES
            ($1,$2,$3,$4,$5,$6)
            `,
            [
                swap.user_id,
                "AIRTIME_SWAP",
                swap.receivable_amount,
                "Airtime swap approved",
                "SUCCESS",
                swap.transaction_reference
            ]
        );

        // Create Notification
        await client.query(
            `
    INSERT INTO notifications
    (
        user_id,
        title,
        message
    )
    VALUES
    ($1,$2,$3)
    `,
            [
                swap.user_id,
                "Airtime Swap Approved",
                `Your airtime swap of ₦${Number(swap.airtime_amount).toLocaleString()} has been approved. ₦${Number(swap.receivable_amount).toLocaleString()} has been credited to your wallet.`
            ]
        );

        await client.query("COMMIT");

        return res.json({
            success: true,
            message: "Airtime swap approved successfully."
        });

    } catch (error) {

        await client.query("ROLLBACK");

        console.error("Approve Airtime Error:");
        console.error(error);
        console.error(error.message);
        console.error(error.stack);

        return res.status(500).json({
            success: false,
            message: error.message
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

            await pool.query(
                `
        INSERT INTO notifications
        (
            user_id,
            title,
            message
        )
        VALUES
        ($1,$2,$3)
        `,
                [
                    swap.user_id,
                    "Airtime Swap Rejected",
                    `Your airtime swap request of ₦${Number(swap.airtime_amount).toLocaleString()} was rejected. Reason: ${swap.admin_note}.`
                ]
            );
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

module.exports = {
    getDashboardStats,
    getAllAirtimeSwaps,
    getSingleAirtimeSwap,
    approveAirtimeSwap,
    rejectAirtimeSwap,
    getAllUsers
};