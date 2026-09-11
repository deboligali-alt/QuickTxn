const crypto = require("crypto");
const { pool } = require("../config/db");

const monnify = require("../services/monnifyService");
const {
    createReservedAccount,
} = require("../services/monnifyReservedAccount");

// ========================================
// Initialize Wallet Funding
// POST /api/monnify/initialize
// ========================================
const initializePayment = async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || Number(amount) < 100) {
            return res.status(400).json({
                success: false,
                message: "Minimum funding amount is ₦100",
            });
        }

        const reference = `QTXN-${Date.now()}`;

        const payment = await monnify.initializePayment({
            amount: Number(amount),
            email: req.user.email,
            name: req.user.full_name || req.user.username,
            reference,
        });

        return res.json({
            success: true,
            checkoutUrl: payment.checkoutUrl,
            reference,
        });
    } catch (err) {
        console.error(err.response?.data || err.message);

        return res.status(500).json({
            success: false,
            message: "Unable to initialize payment",
        });
    }
};

// ========================================
// Verify Payment
// GET /api/monnify/verify/:reference
// ========================================
const verifyPayment = async (req, res) => {
    const client = await pool.connect();

    try {
        const { reference } = req.params;

        const payment = await monnify.verifyPayment(reference);

        if (payment.paymentStatus !== "PAID") {
            return res.status(400).json({
                success: false,
                message: "Payment not completed",
            });
        }

        await client.query("BEGIN");

        const existing = await client.query(
            `SELECT id
       FROM transactions
       WHERE payment_reference = $1`,
            [reference]
        );

        if (existing.rows.length) {
            await client.query("ROLLBACK");

            return res.json({
                success: true,
                message: "Already verified",
            });
        }

        const wallet = await client.query(
            `SELECT balance
       FROM wallets
       WHERE user_id = $1
       FOR UPDATE`,
            [req.user.id]
        );

        const newBalance =
            Number(wallet.rows[0].balance) +
            Number(payment.amountPaid);

        await client.query(
            `UPDATE wallets
       SET balance = $1
       WHERE user_id = $2`,
            [newBalance, req.user.id]
        );

        await client.query(
            `INSERT INTO transactions
      (
        receiver_id,
        type,
        amount,
        status,
        reference,
        description,
        payment_provider,
        payment_reference
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
            [
                req.user.id,
                "FUND",
                payment.amountPaid,
                "SUCCESS",
                reference,
                "Wallet funding via Monnify",
                "MONNIFY",
                reference,
            ]
        );

        await client.query("COMMIT");

        return res.json({
            success: true,
            message: "Wallet funded successfully",
        });
    } catch (err) {
        await client.query("ROLLBACK");

        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Verification failed",
        });
    } finally {
        client.release();
    }
};

// ========================================
// Monnify Webhook
// POST /api/monnify/webhook
// ========================================
const handleWebhook = async (req, res) => {
    const client = await pool.connect();

    try {
        const event = req.body.eventData;

        if (!event || event.paymentStatus !== "PAID") {
            return res.sendStatus(200);
        }

        await client.query("BEGIN");

        // Prevent duplicate credit
        const existing = await client.query(
            `SELECT id
       FROM transactions
       WHERE payment_reference = $1`,
            [event.paymentReference]
        );

        if (existing.rows.length) {
            await client.query("ROLLBACK");
            return res.sendStatus(200);
        }

        // Find owner by virtual account number
        const owner = await client.query(
            `SELECT user_id
       FROM virtual_accounts
       WHERE account_number = $1`,
            [event.destinationAccountInformation.accountNumber]
        );

        if (owner.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.sendStatus(404);
        }

        const userId = owner.rows[0].user_id;

        // Lock wallet
        const wallet = await client.query(
            `SELECT balance
       FROM wallets
       WHERE user_id = $1
       FOR UPDATE`,
            [userId]
        );

        const newBalance =
            Number(wallet.rows[0].balance) +
            Number(event.amountPaid);

        await client.query(
            `UPDATE wallets
       SET balance = $1,
           updated_at = NOW()
       WHERE user_id = $2`,
            [newBalance, userId]
        );

        await client.query(
            `INSERT INTO transactions
      (
        receiver_id,
        type,
        amount,
        status,
        reference,
        description,
        payment_provider,
        payment_reference
      )
      VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,
            [
                userId,
                "FUND",
                event.amountPaid,
                "SUCCESS",
                event.paymentReference,
                "Wallet funding via Monnify Virtual Account",
                "MONNIFY",
                event.paymentReference,
            ]
        );

        await client.query(
            `INSERT INTO notifications
      (
        user_id,
        title,
        message
      )
      VALUES($1,$2,$3)`,
            [
                userId,
                "Wallet Credited",
                `₦${Number(event.amountPaid).toLocaleString()} has been added to your wallet.`,
            ]
        );

        await client.query("COMMIT");

        // Optional Socket.IO
        const io = req.app.get("io");

        if (io) {
            io.to(String(userId)).emit("wallet_updated", {
                balance: newBalance,
                amount: event.amountPaid,
            });
        }

        return res.sendStatus(200);
    } catch (err) {
        await client.query("ROLLBACK");
        console.error(err);
        return res.sendStatus(500);
    } finally {
        client.release();
    }
};

// ========================================
// Create Permanent Virtual Account
// POST /api/monnify/create-account
// ========================================
const createVirtualAccount = async (req, res) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const existing = await client.query(
            `SELECT *
       FROM virtual_accounts
       WHERE user_id = $1`,
            [req.user.id]
        );

        if (existing.rows.length > 0) {
            await client.query("ROLLBACK");

            return res.json({
                success: true,
                data: existing.rows[0],
            });
        }

        const reservationReference = `VA-${req.user.id}`;

        const reserved =
            await createReservedAccount({
                email: req.user.email,
                name:
                    req.user.full_name ||
                    req.user.username,
                reference: reservationReference,
            });

        const account = reserved.accounts[0];

        const result = await client.query(
            `INSERT INTO virtual_accounts
      (
        user_id,
        account_name,
        account_number,
        bank_name,
        bank_code,
        reservation_reference,
        status
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
            [
                req.user.id,
                account.accountName,
                account.accountNumber,
                account.bankName,
                account.bankCode,
                reservationReference,
                "ACTIVE",
            ]
        );

        await client.query("COMMIT");

        return res.status(201).json({
            success: true,
            message:
                "Virtual account created successfully.",
            data: result.rows[0],
        });
    } catch (err) {
        await client.query("ROLLBACK");

        console.error(
            err.response?.data || err.message
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to create virtual account.",
        });
    } finally {
        client.release();
    }
};

// ========================================
// Get Virtual Account
// GET /api/monnify/account
// ========================================
const getVirtualAccount = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
        account_name,
        account_number,
        bank_name,
        bank_code,
        status
      FROM virtual_accounts
      WHERE user_id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No virtual account found.",
            });
        }

        return res.json({
            success: true,
            data: result.rows[0],
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

module.exports = {
    initializePayment,
    verifyPayment,
    handleWebhook,
    createVirtualAccount,
    getVirtualAccount,
};