const { pool } = require("../config/db");
const { Parser } = require("json2csv");
// ========================================
// Get All Transactions
// ========================================
const getAllTransactions = async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                t.id,
                t.reference,
                t.amount,
                t.type,
                t.status,
                t.description,
                t.payment_provider,
                t.payment_reference,
                t.created_at,

                sender.full_name AS sender_name,
                receiver.full_name AS receiver_name

            FROM transactions t

            LEFT JOIN users sender
                ON t.sender_id = sender.id

            LEFT JOIN users receiver
                ON t.receiver_id = receiver.id

            ORDER BY t.created_at DESC
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
// Get Single Transaction
// ========================================
const getTransaction = async (req, res) => {

    const { id } = req.params;

    try {

        const result = await pool.query(
            `
            SELECT
                t.id,
                t.reference,
                t.amount,
                t.type,
                t.status,
                t.description,
                t.payment_provider,
                t.payment_reference,
                t.created_at,

                sender.id AS sender_id,
                sender.full_name AS sender_name,
                sender.email AS sender_email,

                receiver.id AS receiver_id,
                receiver.full_name AS receiver_name,
                receiver.email AS receiver_email

            FROM transactions t

            LEFT JOIN users sender
                ON t.sender_id = sender.id

            LEFT JOIN users receiver
                ON t.receiver_id = receiver.id

            WHERE t.id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found.",
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
// Update Transaction Status
// ========================================
const updateTransactionStatus = async (req, res) => {

    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
        "PENDING",
        "SUCCESS",
        "FAILED",
    ];

    try {

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid transaction status.",
            });
        }

        const transaction = await pool.query(
            `
            SELECT
                id
            FROM transactions
            WHERE id = $1
            `,
            [id]
        );

        if (transaction.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found.",
            });
        }

        const result = await pool.query(
            `
            UPDATE transactions
            SET status = $1
            WHERE id = $2
            RETURNING *
            `,
            [
                status,
                id,
            ]
        );

        return res.status(200).json({
            success: true,
            message: "Transaction status updated successfully.",
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
// Export Transactions
// ========================================
const exportTransactions = async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                reference,
                amount,
                type,
                status,
                description,
                payment_provider,
                payment_reference,
                created_at
            FROM transactions
            ORDER BY created_at DESC
        `);

        const fields = [
            "reference",
            "amount",
            "type",
            "status",
            "description",
            "payment_provider",
            "payment_reference",
            "created_at",
        ];

        const parser = new Parser({ fields });

        const csv = parser.parse(result.rows);

        res.header(
            "Content-Type",
            "text/csv"
        );

        res.attachment("transactions.csv");

        return res.send(csv);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });

    }

};

module.exports = {
    getAllTransactions,
    getTransaction,
    updateTransactionStatus,
    exportTransactions,
};