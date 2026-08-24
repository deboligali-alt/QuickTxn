const { pool } = require("../config/db");
const { creditWallet } = require("../services/walletService");

// ========================================
// Get All Airtime Swap Requests
// ========================================
const getAllAirtimeSwaps = async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT
        a.*,
        u.full_name,
        u.email
      FROM airtime_swaps a
      LEFT JOIN users u
        ON a.user_id = u.id
      ORDER BY a.created_at DESC
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
// Get Single Airtime Swap
// ========================================
const getAirtimeSwap = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `
      SELECT
        a.*,
        u.full_name,
        u.email,
        u.phone
      FROM airtime_swaps a
      LEFT JOIN users u
        ON a.user_id = u.id
      WHERE a.id = $1
    `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Airtime swap not found.",
            });
        }

        return res.status(200).json({
            success: true,
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
// Approve Airtime Swap
// ========================================
const approveAirtimeSwap = async (req, res) => {
    const { id } = req.params;
    const adminId = req.user.id;

    const client = await pool.connect();

    try {
        console.log("STEP 1: BEGIN");
        await client.query("BEGIN");

        console.log("STEP 2: Fetch swap");
        const swapResult = await client.query(
            "SELECT * FROM airtime_swaps WHERE id=$1 FOR UPDATE",
            [id]
        );

        if (swapResult.rows.length === 0)
            throw new Error("Swap not found");

        const swap = swapResult.rows[0];
        const amount = Number(swap.receivable_amount);

        console.log("STEP 3: Credit wallet");
        await creditWallet(swap.user_id, amount, client);

        console.log("STEP 4: Create transaction");
        await client.query(
            `INSERT INTO transactions
      (receiver_id,type,amount,description,status,reference,payment_provider,payment_reference)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,
            [
                swap.user_id,
                "CREDIT",
                amount,
                `Airtime swap approved`,
                "SUCCESS",
                `ATC-${Date.now()}`,
                "AIRTIME_SWAP",
                swap.transaction_reference,
            ]
        );

        console.log("STEP 5: Update swap");
        await client.query(
            `UPDATE airtime_swaps
       SET status='APPROVED',
           approved_by=$1,
           approved_at=NOW()
       WHERE id=$2`,
            [adminId, id]
        );

        console.log("STEP 6: Notification");
        await client.query(
            `INSERT INTO notifications(user_id,title,message)
       VALUES($1,$2,$3)`,
            [
                swap.user_id,
                "Airtime Swap Approved",
                "Your wallet has been credited.",
            ]
        );

        console.log("STEP 7: COMMIT");
        await client.query("COMMIT");

        return res.json({
            success: true,
            message: "Approved successfully",
        });
    } catch (err) {
        await client.query("ROLLBACK");

        console.log("FAILED AT:");
        console.log(err);

        return res.status(500).json({
            success: false,
            message: err.message,
        });
    } finally {
        client.release();
    }
};

// ========================================
// Reject Airtime Swap
// ========================================
const rejectAirtimeSwap = async (req, res) => {
    const { id } = req.params;
    const { rejectionReason, adminNote } = req.body;

    try {
        const result = await pool.query(
            `
      UPDATE airtime_swaps
      SET
        status='REJECTED',
        rejection_reason=$1,
        admin_note=$2,
        updated_at=NOW()
      WHERE id=$3
      RETURNING *
    `,
            [rejectionReason, adminNote || null, id]
        );

        return res.status(200).json({
            success: true,
            data: result.rows[0],
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to reject airtime swap.",
        });
    }
};

module.exports = {
    getAllAirtimeSwaps,
    getAirtimeSwap,
    approveAirtimeSwap,
    rejectAirtimeSwap,
};