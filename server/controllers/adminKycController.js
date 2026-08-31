const { pool } = require("../config/db");

// Get all KYC requests
const getAllKYC = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                k.*,
                u.email,
                u.phone
            FROM kyc_verifications k
            JOIN users u
            ON k.user_id = u.id
            ORDER BY k.created_at DESC
        `);

        res.json({
            success: true,
            data: result.rows,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Approve KYC
const approveKYC = async (req, res) => {
    const { id } = req.params;

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const kyc = await client.query(
            `SELECT * FROM kyc_verifications WHERE id=$1`,
            [id]
        );

        if (kyc.rows.length === 0)
            throw new Error("KYC not found");

        const userId = kyc.rows[0].user_id;

        await client.query(
            `UPDATE kyc_verifications
             SET status='VERIFIED',
                 updated_at=NOW()
             WHERE id=$1`,
            [id]
        );

        await client.query(
            `UPDATE users
             SET is_verified=TRUE
             WHERE id=$1`,
            [userId]
        );

        await client.query(
            `INSERT INTO notifications
            (user_id,title,message)
            VALUES($1,$2,$3)`,
            [
                userId,
                "KYC Approved",
                "Congratulations! Your identity has been verified.",
            ]
        );

        await client.query("COMMIT");

        res.json({
            success: true,
            message: "KYC approved successfully.",
        });

    } catch (error) {
        await client.query("ROLLBACK");

        res.status(500).json({
            success: false,
            message: error.message,
        });

    } finally {
        client.release();
    }
};

// Reject KYC
const rejectKYC = async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;

    try {
        const result = await pool.query(
            `UPDATE kyc_verifications
             SET status='REJECTED',
                 admin_note=$1,
                 updated_at=NOW()
             WHERE id=$2
             RETURNING user_id`,
            [reason || "Verification rejected", id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "KYC not found",
            });
        }

        await pool.query(
            `INSERT INTO notifications
            (user_id,title,message)
            VALUES($1,$2,$3)`,
            [
                result.rows[0].user_id,
                "KYC Rejected",
                reason || "Please resubmit your verification.",
            ]
        );

        res.json({
            success: true,
            message: "KYC rejected.",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

module.exports = {
    getAllKYC,
    approveKYC,
    rejectKYC,
};