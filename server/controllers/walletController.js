const { pool } = require("../config/db");
const axios = require("axios");

const pinService = require("../services/pinService");

// ===============================
// Get Wallet Balance
// ===============================
const getBalance = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT balance
             FROM wallets
             WHERE user_id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found."
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                balance: result.rows[0].balance
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
// Initialize Wallet Funding
// Paystack
// ===============================
const fundWallet = async (req, res) => {

    const { amount } = req.body;

    if (!amount || Number(amount) <= 0) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid amount."
        });
    }

    try {

        // Get logged-in user's email
        const userResult = await pool.query(
            "SELECT email FROM users WHERE id = $1",
            [req.user.id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const email = userResult.rows[0].email;

        // Generate our own transaction reference
        const reference = `QTXN-${Date.now()}`;

        // Add reference to callback URL
        const callbackUrl =
            `${process.env.PAYSTACK_CALLBACK_URL}?reference=${encodeURIComponent(reference)}`;

        console.log("==================================");
        console.log("Paystack Reference:", reference);
        console.log("Paystack Callback URL:", callbackUrl);
        console.log("==================================");

        // Initialize Paystack payment
        const response = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            {
                email,
                amount: Number(amount) * 100,
                reference,
                callback_url: callbackUrl
            },
            {
                headers: {
                    Authorization:
                        `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    "Content-Type":
                        "application/json"
                }
            }
        );

        return res.status(200).json({
            success: true,
            message: "Payment initialized successfully.",
            data: {
                authorization_url:
                    response.data.data.authorization_url,

                access_code:
                    response.data.data.access_code,

                reference:
                    response.data.data.reference
            }
        });

    } catch (error) {

        console.error(
            error.response?.data ||
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Unable to initialize payment."
        });
    }
};


// ===============================
// Verify Paystack Payment
// ===============================
const verifyPayment = async (req, res) => {

    const { reference } = req.params;

    if (!reference) {
        return res.status(400).json({
            success: false,
            message: "Payment reference is required."
        });
    }

    const client = await pool.connect();

    try {

        // ==========================================
        // 1. Verify payment with Paystack
        // ==========================================
        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization:
                        `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }
        );

        const payment = response.data.data;

        console.log("Paystack verification:", {
            reference: payment.reference,
            status: payment.status,
            amount: payment.amount,
            currency: payment.currency,
            customer: payment.customer?.email
        });

        // ==========================================
        // 2. Check payment status
        // ==========================================
        if (payment.status !== "success") {
            return res.status(400).json({
                success: false,
                message: "Payment not successful."
            });
        }

        await client.query("BEGIN");

        // ==========================================
        // 3. Check if webhook already processed it
        // ==========================================
        const existingTransaction =
            await client.query(
                `SELECT
                    id,
                    receiver_id,
                    amount,
                    status,
                    reference,
                    payment_reference
                 FROM transactions
                 WHERE payment_reference = $1
                 AND type = 'FUND'
                 LIMIT 1`,
                [reference]
            );

        if (existingTransaction.rows.length > 0) {

            const transaction =
                existingTransaction.rows[0];

            // Make sure this payment belongs
            // to the currently logged-in user
            if (
                transaction.receiver_id !==
                req.user.id
            ) {

                await client.query("ROLLBACK");

                return res.status(403).json({
                    success: false,
                    message:
                        "You are not authorized to view this payment."
                });
            }

            // Get current wallet balance
            const walletResult =
                await client.query(
                    `SELECT balance
                     FROM wallets
                     WHERE user_id = $1`,
                    [req.user.id]
                );

            await client.query("COMMIT");

            return res.status(200).json({
                success: true,
                message:
                    "Payment already processed successfully.",
                alreadyProcessed: true,
                data: {
                    reference,
                    amount:
                        Number(transaction.amount),
                    status:
                        transaction.status,
                    balance:
                        walletResult.rows[0]?.balance ?? 0
                }
            });
        }

        // ==========================================
        // 4. Find user from Paystack email
        // ==========================================
        const userResult = await client.query(
            `SELECT id
             FROM users
             WHERE email = $1`,
            [payment.customer.email]
        );

        if (userResult.rows.length === 0) {

            await client.query("ROLLBACK");

            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const userId =
            userResult.rows[0].id;

        // ==========================================
        // 5. Make sure logged-in user owns payment
        // ==========================================
        if (userId !== req.user.id) {

            await client.query("ROLLBACK");

            return res.status(403).json({
                success: false,
                message:
                    "You are not authorized to verify this payment."
            });
        }

        // ==========================================
        // 6. Get wallet
        // ==========================================
        const walletResult =
            await client.query(
                `SELECT balance
                 FROM wallets
                 WHERE user_id = $1
                 FOR UPDATE`,
                [userId]
            );

        if (walletResult.rows.length === 0) {

            await client.query("ROLLBACK");

            return res.status(404).json({
                success: false,
                message: "Wallet not found."
            });
        }

        // ==========================================
        // 7. Calculate amount
        // ==========================================
        const currentBalance =
            Number(walletResult.rows[0].balance);

        const amount =
            Number(payment.amount) / 100;

        const newBalance =
            currentBalance + amount;

        // ==========================================
        // 8. Update wallet
        // ==========================================
        await client.query(
            `UPDATE wallets
             SET balance = $1,
                 updated_at = NOW()
             WHERE user_id = $2`,
            [
                newBalance,
                userId
            ]
        );

        // ==========================================
        // 9. Save transaction
        // ==========================================
        await client.query(
            `INSERT INTO transactions
            (
                sender_id,
                receiver_id,
                type,
                amount,
                status,
                reference,
                description,
                payment_provider,
                payment_reference
            )
            VALUES
            ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
            [
                userId,
                userId,
                "FUND",
                amount,
                "success",
                `TXN-${Date.now()}`,
                "Wallet funding via Paystack",
                "Paystack",
                reference
            ]
        );

        // ==========================================
        // 10. Create notification
        // ==========================================
        await client.query(
            `INSERT INTO notifications
            (
                user_id,
                title,
                message
            )
            VALUES
            ($1,$2,$3)`,
            [
                userId,
                "Wallet Funded",
                `₦${amount.toLocaleString()} has been credited to your wallet successfully.`
            ]
        );

        // ==========================================
        // 11. Commit everything
        // ==========================================
        await client.query("COMMIT");

        console.log(
            `Wallet credited successfully.
User: ${userId}
Amount: ₦${amount}
New Balance: ₦${newBalance}
Reference: ${reference}`
        );

        return res.status(200).json({
            success: true,
            message:
                "Wallet funded successfully.",
            alreadyProcessed: false,
            data: {
                reference,
                amount,
                balance: newBalance
            }
        });

    } catch (error) {

        try {
            await client.query("ROLLBACK");
        } catch (rollbackError) {
            console.error(
                "Rollback error:",
                rollbackError
            );
        }

        console.error(
            "Payment verification error:",
            error.response?.data ||
            error.message
        );

        return res.status(500).json({
            success: false,
            message:
                "Payment verification failed."
        });

    } finally {

        client.release();
    }
};


// ===============================
// Wallet Transfer
// ===============================
const transferMoney = async (req, res) => {

    const {
        receiverEmail,
        amount
    } = req.body;

    if (
        !receiverEmail ||
        !amount ||
        Number(amount) <= 0
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Receiver email and a valid amount are required."
        });
    }

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        // ===============================
        // Sender wallet
        // ===============================
        const senderWallet =
            await client.query(
                `SELECT balance
                 FROM wallets
                 WHERE user_id = $1
                 FOR UPDATE`,
                [req.user.id]
            );

        if (
            senderWallet.rows.length === 0
        ) {

            await client.query("ROLLBACK");

            return res.status(404).json({
                success: false,
                message:
                    "Sender wallet not found."
            });
        }

        // ===============================
        // Receiver
        // ===============================
        const receiverUser =
            await client.query(
                `SELECT id
                 FROM users
                 WHERE email = $1`,
                [receiverEmail]
            );

        if (
            receiverUser.rows.length === 0
        ) {

            await client.query("ROLLBACK");

            return res.status(404).json({
                success: false,
                message:
                    "Receiver not found."
            });
        }

        const receiverId =
            receiverUser.rows[0].id;

        // ===============================
        // Prevent self transfer
        // ===============================
        if (
            receiverId === req.user.id
        ) {

            await client.query("ROLLBACK");

            return res.status(400).json({
                success: false,
                message:
                    "You cannot transfer money to yourself."
            });
        }

        // ===============================
        // Receiver wallet
        // ===============================
        const receiverWallet =
            await client.query(
                `SELECT balance
                 FROM wallets
                 WHERE user_id = $1
                 FOR UPDATE`,
                [receiverId]
            );

        if (
            receiverWallet.rows.length === 0
        ) {

            await client.query("ROLLBACK");

            return res.status(404).json({
                success: false,
                message:
                    "Receiver wallet not found."
            });
        }

        const senderBalance =
            Number(
                senderWallet.rows[0].balance
            );

        // ===============================
        // Check balance
        // ===============================
        if (
            senderBalance <
            Number(amount)
        ) {

            await client.query("ROLLBACK");

            return res.status(400).json({
                success: false,
                message:
                    "Insufficient balance."
            });
        }

        const receiverBalance =
            Number(
                receiverWallet.rows[0].balance
            );

        // ===============================
        // Debit sender
        // ===============================
        await client.query(
            `UPDATE wallets
             SET balance = $1,
                 updated_at = NOW()
             WHERE user_id = $2`,
            [
                senderBalance -
                Number(amount),
                req.user.id
            ]
        );

        // ===============================
        // Credit receiver
        // ===============================
        await client.query(
            `UPDATE wallets
             SET balance = $1,
                 updated_at = NOW()
             WHERE user_id = $2`,
            [
                receiverBalance +
                Number(amount),
                receiverId
            ]
        );

        // ===============================
        // Create transaction
        // ===============================
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
            VALUES
            ($1,$2,$3,$4,$5,$6,$7)`,
            [
                req.user.id,
                receiverId,
                "TRANSFER",
                amount,
                "success",
                `TXN-${Date.now()}`,
                "Wallet transfer"
            ]
        );

        // ===============================
        // Notify sender
        // ===============================
        await client.query(
            `INSERT INTO notifications
            (
                user_id,
                title,
                message
            )
            VALUES
            ($1,$2,$3)`,
            [
                req.user.id,
                "Transfer Successful",
                `You sent ₦${Number(amount).toLocaleString()} to ${receiverEmail}.`
            ]
        );

        // ===============================
        // Notify receiver
        // ===============================
        await client.query(
            `INSERT INTO notifications
            (
                user_id,
                title,
                message
            )
            VALUES
            ($1,$2,$3)`,
            [
                receiverId,
                "Money Received",
                `You received ₦${Number(amount).toLocaleString()} from another QuickTxn user.`
            ]
        );

        await client.query("COMMIT");

        return res.status(200).json({
            success: true,
            message:
                "Transfer completed successfully."
        });

    } catch (error) {

        await client.query("ROLLBACK");

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });

    } finally {

        client.release();
    }
};


// ===============================
// Resolve Bank Account
// ===============================
const resolveAccount = async (req, res) => {

    const {
        accountNumber,
        bankCode
    } = req.body;

    if (!accountNumber || !bankCode) {
        return res.status(400).json({
            success: false,
            message:
                "Account number and bank code are required."
        });
    }

    try {

        const response = await axios.get(
            "https://api.paystack.co/bank/resolve",
            {
                params: {
                    account_number:
                        accountNumber,
                    bank_code:
                        bankCode
                },
                headers: {
                    Authorization:
                        `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    "Content-Type":
                        "application/json"
                }
            }
        );

        return res.status(200).json({
            success: true,
            message:
                "Account resolved successfully.",
            data:
                response.data.data
        });

    } catch (error) {

        console.error(
            "========== PAYSTACK ACCOUNT RESOLUTION ERROR =========="
        );

        console.error(
            "Message:",
            error.message
        );

        console.error(
            "Status:",
            error.response?.status
        );

        console.error(
            "Paystack Response:",
            error.response?.data
        );

        console.error(
            "========================================================"
        );

        return res.status(
            error.response?.status || 500
        ).json({
            success: false,
            message:
                error.response?.data?.message ||
                "Unable to resolve account.",
            error:
                error.response?.data ||
                null
        });
    }
};


// ===============================
// Get All Banks
// ===============================
const getBanks = async (
    req,
    res
) => {

    try {

        const response =
            await axios.get(
                "https://api.paystack.co/bank?country=nigeria",
                {
                    headers: {
                        Authorization:
                            `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                    }
                }
            );

        return res.status(200).json({
            success: true,
            count:
                response.data.data.length,
            data:
                response.data.data
        });

    } catch (error) {

        console.error(
            error.response?.data ||
            error.message
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to fetch banks."
        });
    }
};


// ===============================
// Bank Transfer
// ===============================
const bankTransfer = async (
    req,
    res
) => {

    const {
        accountNumber,
        bankCode,
        accountName,
        amount,
        pin
    } = req.body;

    // ===============================
    // Validate request
    // ===============================
    if (
        !accountNumber ||
        !bankCode ||
        !accountName ||
        !amount ||
        !pin
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Account number, bank, account name, amount and transaction PIN are required."
        });
    }

    if (Number(amount) <= 0) {
        return res.status(400).json({
            success: false,
            message:
                "Amount must be greater than zero."
        });
    }

    if (!/^\d{4}$/.test(String(pin))) {
        return res.status(400).json({
            success: false,
            message:
                "Transaction PIN must be 4 digits."
        });
    }

    if (!/^\d{10}$/.test(String(accountNumber))) {
        return res.status(400).json({
            success: false,
            message:
                "Account number must be 10 digits."
        });
    }

    const client =
        await pool.connect();

    try {

        await client.query("BEGIN");

        // ===============================
        // Verify Transaction PIN
        // ===============================
        await pinService.verifyPin(
            req.user.id,
            pin,
            client
        );

        // ===============================
        // Get sender wallet
        // ===============================
        const wallet =
            await client.query(
                `SELECT balance
                 FROM wallets
                 WHERE user_id = $1
                 FOR UPDATE`,
                [req.user.id]
            );

        if (
            wallet.rows.length === 0
        ) {

            await client.query("ROLLBACK");

            return res.status(404).json({
                success: false,
                message:
                    "Wallet not found."
            });
        }

        const balance =
            Number(
                wallet.rows[0].balance
            );

        // ===============================
        // Check wallet balance
        // ===============================
        if (
            balance <
            Number(amount)
        ) {

            await client.query("ROLLBACK");

            return res.status(400).json({
                success: false,
                message:
                    "Insufficient wallet balance."
            });
        }

        // ===============================
        // Create Paystack recipient
        // ===============================
        const recipient =
            await axios.post(
                "https://api.paystack.co/transferrecipient",
                {
                    type: "nuban",
                    name: accountName,
                    account_number:
                        accountNumber,
                    bank_code:
                        bankCode,
                    currency: "NGN"
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                    }
                }
            );

        const recipientCode =
            recipient.data.data
                .recipient_code;

        // ===============================
        // Initiate Paystack transfer
        // ===============================
        const transfer =
            await axios.post(
                "https://api.paystack.co/transfer",
                {
                    source: "balance",
                    amount:
                        Number(amount) * 100,
                    recipient:
                        recipientCode,
                    reason:
                        "QuickTxn Wallet Withdrawal"
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                    }
                }
            );

        // ===============================
        // Debit QuickTxn wallet
        // ===============================
        await client.query(
            `UPDATE wallets
             SET balance = $1,
                 updated_at = NOW()
             WHERE user_id = $2`,
            [
                balance -
                Number(amount),
                req.user.id
            ]
        );

        // ===============================
        // Save transaction
        // ===============================
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
            VALUES
            ($1,$2,$3,$4,$5,$6,$7,$8)`,
            [
                req.user.id,
                "BANK_TRANSFER",
                amount,
                "pending",
                `TXN-${Date.now()}`,
                "Wallet to Bank Transfer",
                "Paystack",
                transfer.data.data.reference
            ]
        );

        // ===============================
        // Notification
        // ===============================
        await client.query(
            `INSERT INTO notifications
            (
                user_id,
                title,
                message
            )
            VALUES
            ($1,$2,$3)`,
            [
                req.user.id,
                "Bank Transfer Initiated",
                `Your bank transfer of ₦${Number(amount).toLocaleString()} to ${accountName} has been initiated.`
            ]
        );

        // ===============================
        // Commit
        // ===============================
        await client.query("COMMIT");

        return res.status(200).json({
            success: true,
            message:
                "Transfer initiated successfully.",
            data:
                transfer.data.data
        });

    } catch (error) {

        try {
            await client.query("ROLLBACK");
        } catch (rollbackError) {
            console.error(
                "Rollback error:",
                rollbackError
            );
        }

        console.error(
            "========== PAYSTACK BANK TRANSFER ERROR =========="
        );

        console.error(
            "Message:",
            error.message
        );

        console.error(
            "Response:",
            error.response?.data
        );

        console.error(
            "Status:",
            error.response?.status
        );

        console.error(
            "=================================================="
        );

        // ===============================
        // PIN errors
        // ===============================
        if (
            error.message ===
            "Invalid transaction PIN." ||
            error.message ===
            "Transaction PIN has not been set."
        ) {
            return res.status(400).json({
                success: false,
                message:
                    error.message
            });
        }

        // ===============================
        // Insufficient balance
        // ===============================
        if (
            error.message ===
            "Insufficient wallet balance."
        ) {
            return res.status(400).json({
                success: false,
                message:
                    error.message
            });
        }

        // ===============================
        // Paystack errors
        // ===============================
        if (error.response?.data) {

            return res.status(
                error.response.status || 400
            ).json({
                success: false,
                message:
                    error.response.data.message ||
                    "Paystack transfer failed.",
                error:
                    error.response.data
            });
        }

        return res.status(500).json({
            success: false,
            message:
                "Bank transfer failed."
        });

    } finally {

        client.release();
    }
};


// ===============================
// Export Controllers
// ===============================
module.exports = {
    getBalance,
    fundWallet,
    verifyPayment,
    transferMoney,
    resolveAccount,
    getBanks,
    bankTransfer
};