const { pool } = require("../config/db");
const axios = require("axios");
const pinService = require("../services/pinService");

// ======================================
// GET WALLET BALANCE
// ======================================
const getBalance = async (req, res) => {
    try {
        const userId = req.user.id;

        let wallet = await pool.query(
            "SELECT * FROM wallets WHERE user_id = $1",
            [userId]
        );

        if (wallet.rows.length === 0) {
            wallet = await pool.query(
                `INSERT INTO wallets (user_id, balance)
         VALUES ($1,0)
         RETURNING *`,
                [userId]
            );
        }

        return res.status(200).json({
            success: true,
            data: wallet.rows[0],
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch wallet.",
        });
    }
};

// ======================================
// INITIALIZE WALLET FUNDING (PAYSTACK)
// ======================================
const fundWallet = async (req, res) => {
    const { amount } = req.body;

    if (!amount || Number(amount) <= 0) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid amount.",
        });
    }

    try {
        const userResult = await pool.query(
            "SELECT full_name,email FROM users WHERE id=$1",
            [req.user.id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const user = userResult.rows[0];

        const reference = `QTXN-${Date.now()}`;

        const callbackUrl =
            `${process.env.PAYSTACK_CALLBACK_URL}?reference=${reference}`;

        const response = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            {
                email: user.email,
                amount: Number(amount) * 100,
                reference,
                callback_url: callbackUrl,
                metadata: {
                    userId: req.user.id,
                    fullName: user.full_name,
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return res.status(200).json({
            success: true,
            message: "Payment initialized successfully.",
            data: response.data.data,
        });
    } catch (error) {
        console.error(error.response?.data || error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to initialize payment.",
        });
    }
};

// ======================================
// VERIFY PAYSTACK PAYMENT
// ======================================
const verifyPayment = async (req, res) => {
    const { reference } = req.params;

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const verify = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                },
            }
        );

        const payment = verify.data.data;

        if (!payment || payment.status !== "success") {
            await client.query("ROLLBACK");

            return res.status(400).json({
                success: false,
                message: "Payment verification failed.",
            });
        }

        const existing = await client.query(
            `SELECT id FROM transactions
       WHERE payment_reference=$1`,
            [reference]
        );

        if (existing.rows.length > 0) {
            await client.query("ROLLBACK");

            return res.status(200).json({
                success: true,
                alreadyProcessed: true,
                message: "Payment already verified.",
            });
        }

        const userId = payment.metadata.userId;
        const amount = Number(payment.amount) / 100;

        const wallet = await client.query(
            `SELECT balance
       FROM wallets
       WHERE user_id=$1
       FOR UPDATE`,
            [userId]
        );

        let currentBalance = 0;

        if (wallet.rows.length === 0) {
            await client.query(
                `INSERT INTO wallets(user_id,balance)
         VALUES($1,0)`,
                [userId]
            );
        } else {
            currentBalance = Number(wallet.rows[0].balance);
        }

        const newBalance = currentBalance + amount;
        // ======================================
        // UPDATE WALLET
        // ======================================
        await client.query(
            `UPDATE wallets
       SET balance=$1,
           updated_at=NOW()
       WHERE user_id=$2`,
            [newBalance, userId]
        );

        // ======================================
        // SAVE TRANSACTION
        // ======================================
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
                "WALLET_FUNDING",
                amount,
                "success",
                `TXN-${Date.now()}`,
                "Wallet Funding",
                "Paystack",
                reference,
            ]
        );

        // ======================================
        // CREATE NOTIFICATION
        // ======================================
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
                `₦${amount.toLocaleString()} has been added to your wallet.`,
            ]
        );

        // ======================================
        // COMMIT DATABASE
        // ======================================
        await client.query("COMMIT");

        // ======================================
        // REALTIME SOCKET.IO
        // ======================================
        const io = req.app.get("io");

        io.to(userId).emit("wallet_updated");
        io.to(userId).emit("new_transaction");

        console.log(`
====================================
Wallet credited successfully
User: ${userId}
Amount: ₦${amount}
Balance: ₦${newBalance}
Reference: ${reference}
====================================
`);

        return res.status(200).json({
            success: true,
            message: "Wallet funded successfully.",
            alreadyProcessed: false,
            data: {
                reference,
                amount,
                balance: newBalance,
            },
        });

    } catch (error) {

        await client.query("ROLLBACK");

        console.error(
            error.response?.data || error.message
        );

        return res.status(500).json({
            success: false,
            message: "Payment verification failed.",
        });

    } finally {

        client.release();
    }
};

// ======================================
// WALLET TO WALLET TRANSFER
// ======================================
const transferMoney = async (req, res) => {
    const { receiverEmail, amount } = req.body;

    if (!receiverEmail || !amount || Number(amount) <= 0) {
        return res.status(400).json({
            success: false,
            message: "Receiver email and valid amount are required.",
        });
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Sender wallet
        const senderWallet = await client.query(
            `SELECT balance
       FROM wallets
       WHERE user_id=$1
       FOR UPDATE`,
            [req.user.id]
        );

        if (senderWallet.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({
                success: false,
                message: "Sender wallet not found.",
            });
        }

        // Receiver
        const receiverUser = await client.query(
            `SELECT id
       FROM users
       WHERE email=$1`,
            [receiverEmail]
        );

        if (receiverUser.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({
                success: false,
                message: "Receiver not found.",
            });
        }

        const receiverId = receiverUser.rows[0].id;

        if (receiverId === req.user.id) {
            await client.query("ROLLBACK");
            return res.status(400).json({
                success: false,
                message: "You cannot transfer to yourself.",
            });
        }

        const receiverWallet = await client.query(
            `SELECT balance
       FROM wallets
       WHERE user_id=$1
       FOR UPDATE`,
            [receiverId]
        );

        const senderBalance = Number(senderWallet.rows[0].balance);

        if (senderBalance < Number(amount)) {
            await client.query("ROLLBACK");
            return res.status(400).json({
                success: false,
                message: "Insufficient balance.",
            });
        }

        const receiverBalance = Number(receiverWallet.rows[0].balance);

        // Debit sender
        await client.query(
            `UPDATE wallets
       SET balance=$1, updated_at=NOW()
       WHERE user_id=$2`,
            [senderBalance - Number(amount), req.user.id]
        );

        // Credit receiver
        await client.query(
            `UPDATE wallets
       SET balance=$1, updated_at=NOW()
       WHERE user_id=$2`,
            [receiverBalance + Number(amount), receiverId]
        );

        // Transaction
        await client.query(
            `INSERT INTO transactions
      (
        sender_id,
        receiver_id,
        type,
        amount,
        status,
        reference,
        description
      )
      VALUES($1,$2,$3,$4,$5,$6,$7)`,
            [
                req.user.id,
                receiverId,
                "TRANSFER",
                amount,
                "success",
                `TXN-${Date.now()}`,
                "QuickTxn Wallet Transfer",
            ]
        );

        // Sender notification
        await client.query(
            `INSERT INTO notifications
      (user_id,title,message)
      VALUES($1,$2,$3)`,
            [
                req.user.id,
                "Transfer Successful",
                `You sent ₦${Number(amount).toLocaleString()} to ${receiverEmail}.`,
            ]
        );

        // Receiver notification
        await client.query(
            `INSERT INTO notifications
      (user_id,title,message)
      VALUES($1,$2,$3)`,
            [
                receiverId,
                "Money Received",
                `You received ₦${Number(amount).toLocaleString()} from another QuickTxn user.`,
            ]
        );

        // Commit
        await client.query("COMMIT");

        // ======================================
        // REALTIME SOCKET.IO
        // ======================================
        const io = req.app.get("io");

        // Sender
        io.to(req.user.id).emit("wallet_updated");
        io.to(req.user.id).emit("new_transaction");

        // Receiver
        io.to(receiverId).emit("wallet_updated");
        io.to(receiverId).emit("new_transaction");

        return res.status(200).json({
            success: true,
            message: "Transfer completed successfully.",
        });

    } catch (error) {

        await client.query("ROLLBACK");

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });

    } finally {

        client.release();
    }
};

// ======================================
// RESOLVE BANK ACCOUNT
// ======================================
const resolveAccount = async (req, res) => {
    const { accountNumber, bankCode } = req.body;

    if (!accountNumber || !bankCode) {
        return res.status(400).json({
            success: false,
            message: "Account number and bank code are required.",
        });
    }

    try {
        const response = await axios.get(
            "https://api.paystack.co/bank/resolve",
            {
                params: {
                    account_number: accountNumber,
                    bank_code: bankCode,
                },
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                },
            }
        );

        return res.status(200).json({
            success: true,
            data: response.data.data,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Unable to resolve account.",
        });

    }
};

// ======================================
// GET ALL BANKS
// ======================================
const getBanks = async (req, res) => {
    try {

        const response = await axios.get(
            "https://api.paystack.co/bank?country=nigeria",
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                },
            }
        );

        return res.status(200).json({
            success: true,
            data: response.data.data,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Unable to fetch banks.",
        });

    }
};

// ======================================
// BANK TRANSFER
// ======================================
const bankTransfer = async (req, res) => {
    const {
        accountNumber,
        bankCode,
        accountName,
        amount,
        pin,
    } = req.body;

    if (
        !accountNumber ||
        !bankCode ||
        !accountName ||
        !amount ||
        !pin
    ) {
        return res.status(400).json({
            success: false,
            message: "All fields are required.",
        });
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        await pinService.verifyPin(
            req.user.id,
            pin,
            client
        );

        const wallet = await client.query(
            `SELECT balance
       FROM wallets
       WHERE user_id=$1
       FOR UPDATE`,
            [req.user.id]
        );

        const balance = Number(wallet.rows[0].balance);

        if (balance < Number(amount)) {
            await client.query("ROLLBACK");

            return res.status(400).json({
                success: false,
                message: "Insufficient balance.",
            });
        }

        // Create recipient
        const recipient = await axios.post(
            "https://api.paystack.co/transferrecipient",
            {
                type: "nuban",
                name: accountName,
                account_number: accountNumber,
                bank_code: bankCode,
                currency: "NGN",
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                },
            }
        );

        // Initiate transfer
        const transfer = await axios.post(
            "https://api.paystack.co/transfer",
            {
                source: "balance",
                amount: Number(amount) * 100,
                recipient:
                    recipient.data.data.recipient_code,
                reason: "QuickTxn Withdrawal",
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                },
            }
        );

        // Debit wallet
        await client.query(
            `UPDATE wallets
       SET balance=$1,
           updated_at=NOW()
       WHERE user_id=$2`,
            [
                balance - Number(amount),
                req.user.id,
            ]
        );

        // Save transaction
        await client.query(
            `INSERT INTO transactions
      (
        sender_id,
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
                req.user.id,
                "BANK_TRANSFER",
                amount,
                "pending",
                `TXN-${Date.now()}`,
                "Wallet to Bank",
                "Paystack",
                transfer.data.data.reference,
            ]
        );

        // Notification
        await client.query(
            `INSERT INTO notifications
      (user_id,title,message)
      VALUES($1,$2,$3)`,
            [
                req.user.id,
                "Bank Transfer",
                `₦${Number(amount).toLocaleString()} transfer initiated.`,
            ]
        );

        await client.query("COMMIT");

        // REALTIME UPDATE
        const io = req.app.get("io");

        io.to(req.user.id).emit("wallet_updated");
        io.to(req.user.id).emit("new_transaction");

        return res.status(200).json({
            success: true,
            message: "Transfer initiated successfully.",
            data: transfer.data.data,
        });

    } catch (error) {

        await client.query("ROLLBACK");

        return res.status(500).json({
            success: false,
            message: "Bank transfer failed.",
        });

    } finally {

        client.release();
    }
};

// ======================================
// GET USER VIRTUAL ACCOUNT
// ======================================
const getVirtualAccount = async (req, res) => {
    try {

        const result = await pool.query(
            `SELECT
        bank_name,
        account_name,
        account_number
       FROM virtual_accounts
       WHERE user_id=$1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Virtual account not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: result.rows[0],
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Server error",
        });

    }
};

// ======================================
// EXPORTS
// ======================================
module.exports = {
    getBalance,
    fundWallet,
    verifyPayment,
    transferMoney,
    resolveAccount,
    getBanks,
    bankTransfer,
    getVirtualAccount,
};