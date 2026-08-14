const { pool } = require("../config/db");

const walletService = require("../services/walletService");
const transactionService = require("../services/transactionService");
const notificationService = require("../services/notificationService");
const pinService = require("../services/pinService");

// =============================
// Get Transaction History
// =============================
const getTransactions = async (req, res) => {
    try {

        const userId = req.user.id;

        let {
            page = 1,
            limit = 10,
            type,
            status,
            reference,
            from,
            to
        } = req.query;

        page = Number(page);
        limit = Number(limit);

        const offset = (page - 1) * limit;

        let query = `
            SELECT
                id,
                reference,
                type,
                amount,
                status,
                description,
                created_at
            FROM transactions
            WHERE
                (sender_id = $1 OR receiver_id = $1)
        `;

        const values = [userId];
        let index = 2;

        if (type) {
            query += ` AND type = $${index}`;
            values.push(type.toUpperCase());
            index++;
        }

        if (status) {
            query += ` AND status = $${index}`;
            values.push(status);
            index++;
        }

        if (reference) {
            query += ` AND reference ILIKE $${index}`;
            values.push(`%${reference}%`);
            index++;
        }

        if (from) {
            query += ` AND created_at >= $${index}`;
            values.push(from);
            index++;
        }

        if (to) {
            query += ` AND created_at <= $${index}`;
            values.push(to);
            index++;
        }

        // Total count
        const countQuery = `
            SELECT COUNT(*) AS total
            FROM (${query}) AS transactions
        `;

        const countResult = await pool.query(countQuery, values);
        const total = Number(countResult.rows[0].total);

        query += `
            ORDER BY created_at DESC
            LIMIT $${index}
            OFFSET $${index + 1}
        `;

        values.push(limit);
        values.push(offset);

        const result = await pool.query(query, values);

        return res.status(200).json({
            success: true,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
            count: result.rows.length,
            transactions: result.rows
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};
// =============================
// Transfer Money
// =============================
const transferMoney = async (req, res) => {

    const client = await pool.connect();

    try {

        const senderId = req.user.id;

        const {
            recipientEmail,
            amount,
            description,
            pin
        } = req.body;

        // Validate request
        if (!recipientEmail || !amount || !pin) {
            return res.status(400).json({
                success: false,
                message: "Recipient email, amount and transaction PIN are required."
            });
        }

        if (Number(amount) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Amount must be greater than zero."
            });
        }

        // Find recipient
        const recipientResult = await client.query(
            `SELECT id, email
             FROM users
             WHERE email = $1`,
            [recipientEmail]
        );

        if (recipientResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Recipient not found."
            });
        }

        const recipient = recipientResult.rows[0];

        // Prevent self transfer
        if (recipient.id === senderId) {
            return res.status(400).json({
                success: false,
                message: "You cannot transfer money to yourself."
            });
        }

        await client.query("BEGIN");

        // Verify Transaction PIN
        await pinService.verifyPin(
            senderId,
            pin,
            client
        );

        // Check recipient wallet
        const recipientWalletExists = await walletService.walletExists(
            recipient.id,
            client
        );

        if (!recipientWalletExists) {

            await client.query("ROLLBACK");

            return res.status(404).json({
                success: false,
                message: "Recipient wallet not found."
            });

        }

        // Transfer funds
        await walletService.transfer(
            senderId,
            recipient.id,
            amount,
            client
        );

        const senderReference = `TRX-DB-${Date.now()}`;
        const receiverReference = `TRX-CR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Save both transactions
        await transactionService.createTransferTransactions({

            senderId,

            receiverId: recipient.id,

            amount,

            senderReference,

            receiverReference,

            senderDescription:
                description || `Transfer to ${recipient.email}`,

            receiverDescription:
                description || `Transfer from ${req.user.email}`

        }, client);

        // Notify sender
        await notificationService.createNotification({

            userId: senderId,

            title: "Money Sent",

            message: `You sent ₦${Number(amount).toLocaleString()} to ${recipient.email}.`

        }, client);

        // Notify recipient
        await notificationService.createNotification({

            userId: recipient.id,

            title: "Money Received",

            message: `You received ₦${Number(amount).toLocaleString()} from ${req.user.email}.`

        }, client);

        await client.query("COMMIT");

        return res.status(200).json({
            success: true,
            message: "Transfer completed successfully.",
            data: {
                recipient: recipient.email,
                amount,
                reference: senderReference
            }
        });

    } catch (error) {

        await client.query("ROLLBACK");

        console.error(error);

        if (
            error.message === "Invalid transaction PIN." ||
            error.message === "Transaction PIN has not been set." ||
            error.message === "Insufficient wallet balance."
        ) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    } finally {

        client.release();

    }

};
// =============================
// Get Transaction By Reference
// =============================
const getTransactionByReference = async (req, res) => {
    try {
        const userId = req.user.id;
        const { reference } = req.params;

        if (!reference) {
            return res.status(400).json({
                success: false,
                message: "Transaction reference is required."
            });
        }

        const result = await pool.query(
            `SELECT
                t.id,
                t.reference,
                t.type,
                t.amount,
                t.status,
                t.description,
                t.created_at,
                sender.email AS sender_email,
                receiver.email AS receiver_email
             FROM transactions t
             LEFT JOIN users sender
                ON t.sender_id = sender.id
             LEFT JOIN users receiver
                ON t.receiver_id = receiver.id
             WHERE t.reference = $1
             AND (
                t.sender_id = $2
                OR t.receiver_id = $2
             )`,
            [
                reference,
                userId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found."
            });
        }

        return res.status(200).json({
            success: true,
            transaction: result.rows[0]
        });

    } catch (error) {

        console.error(
            "Get transaction by reference error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};



module.exports = {
    getTransactions,
    transferMoney,
    getTransactionByReference
};