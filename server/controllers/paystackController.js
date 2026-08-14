const crypto = require("crypto");
const axios = require("axios");
const { pool } = require("../config/db");

const handlePaystackWebhook = async (req, res) => {
    console.log("PAYSTACK WEBHOOK HIT");
    console.log("BODY:", req.body);

    try {
        // ==========================================
        // 1. Get Paystack signature
        // ==========================================

        const signature =
            req.headers["x-paystack-signature"];

        if (!signature) {
            return res.status(401).json({
                success: false,
                message:
                    "Missing Paystack signature.",
            });
        }

        // ==========================================
        // 2. Verify webhook signature
        // ==========================================

        const hash = crypto
            .createHmac(
                "sha512",
                process.env.PAYSTACK_SECRET_KEY
            )
            .update(req.rawBody)
            .digest("hex");

        if (hash !== signature) {
            console.warn(
                "Invalid Paystack webhook signature."
            );

            return res.status(401).json({
                success: false,
                message:
                    "Invalid webhook signature.",
            });
        }

        // ==========================================
        // 3. Get event
        // ==========================================

        const event = req.body;

        console.log(
            "================================"
        );

        console.log(
            "PAYSTACK WEBHOOK RECEIVED"
        );

        console.log(
            "Event:",
            event.event
        );

        console.log(
            "Reference:",
            event.data?.reference
        );

        console.log(
            "================================"
        );

        // ==========================================
        // 4. Only process successful charges
        // ==========================================

        if (
            event.event !==
            "charge.success"
        ) {
            return res.status(200).json({
                success: true,
                message:
                    "Event received.",
            });
        }

        const payment = event.data;

        if (!payment) {
            return res.status(400).json({
                success: false,
                message:
                    "Payment data missing.",
            });
        }

        const reference =
            payment.reference;

        if (!reference) {
            return res.status(400).json({
                success: false,
                message:
                    "Payment reference missing.",
            });
        }

        if (
            payment.status !==
            "success"
        ) {
            return res.status(200).json({
                success: true,
                message:
                    "Payment is not successful.",
            });
        }

        // ==========================================
        // 5. Verify transaction directly with Paystack
        // ==========================================

        const verification =
            await axios.get(
                `https://api.paystack.co/transaction/verify/${reference}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    },
                }
            );

        const verifiedPayment =
            verification.data.data;

        if (
            verifiedPayment.status !==
            "success"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Payment verification failed.",
            });
        }

        // ==========================================
        // 6. Get email
        // ==========================================

        const email =
            verifiedPayment.customer?.email;

        if (!email) {
            return res.status(400).json({
                success: false,
                message:
                    "Customer email not found.",
            });
        }

        // ==========================================
        // 7. Start DB transaction
        // ==========================================

        const client =
            await pool.connect();

        try {
            await client.query(
                "BEGIN"
            );

            // ======================================
            // 8. Prevent duplicate processing
            // ======================================

            const existingTransaction =
                await client.query(
                    `
                    SELECT id
                    FROM transactions
                    WHERE payment_reference = $1
                    LIMIT 1
                    `,
                    [reference]
                );

            if (
                existingTransaction.rows
                    .length > 0
            ) {
                await client.query(
                    "ROLLBACK"
                );

                console.log(
                    "Payment already processed:",
                    reference
                );

                return res.status(200).json({
                    success: true,
                    message:
                        "Payment already processed.",
                });
            }

            // ======================================
            // 9. Find QuickTxn user
            // ======================================

            const userResult =
                await client.query(
                    `
                    SELECT id
                    FROM users
                    WHERE email = $1
                    LIMIT 1
                    `,
                    [email]
                );

            if (
                userResult.rows.length === 0
            ) {
                await client.query(
                    "ROLLBACK"
                );

                return res.status(404).json({
                    success: false,
                    message:
                        "QuickTxn user not found.",
                });
            }

            const userId =
                userResult.rows[0].id;

            // ======================================
            // 10. Get and lock wallet
            // ======================================

            const walletResult =
                await client.query(
                    `
                    SELECT balance
                    FROM wallets
                    WHERE user_id = $1
                    FOR UPDATE
                    `,
                    [userId]
                );

            if (
                walletResult.rows.length === 0
            ) {
                await client.query(
                    "ROLLBACK"
                );

                return res.status(404).json({
                    success: false,
                    message:
                        "Wallet not found.",
                });
            }

            // ======================================
            // 11. Calculate amount
            // ======================================

            const amount =
                Number(
                    verifiedPayment.amount
                ) / 100;

            if (amount <= 0) {
                await client.query(
                    "ROLLBACK"
                );

                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid payment amount.",
                });
            }

            const currentBalance =
                Number(
                    walletResult.rows[0]
                        .balance
                );

            const newBalance =
                currentBalance + amount;

            // ======================================
            // 12. Credit wallet
            // ======================================

            await client.query(
                `
                UPDATE wallets
                SET balance = $1,
                    updated_at = NOW()
                WHERE user_id = $2
                `,
                [
                    newBalance,
                    userId,
                ]
            );

            // ======================================
            // 13. Save transaction
            // ======================================

            await client.query(
                `
                INSERT INTO transactions
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
                ($1,$2,$3,$4,$5,$6,$7,$8,$9)
                `,
                [
                    userId,
                    userId,
                    "FUND",
                    amount,
                    "success",
                    `TXN-${Date.now()}`,
                    "Wallet funding via Paystack",
                    "Paystack",
                    reference,
                ]
            );

            // ======================================
            // 14. Notification
            // ======================================

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
                    userId,
                    "Wallet Funded",
                    `₦${amount.toLocaleString()} has been credited to your wallet.`,
                ]
            );

            // ======================================
            // 15. Commit
            // ======================================

            await client.query(
                "COMMIT"
            );

            console.log(
                "================================"
            );

            console.log(
                "WALLET FUNDING SUCCESSFUL"
            );

            console.log(
                "User:",
                userId
            );

            console.log(
                "Amount:",
                `₦${amount.toLocaleString()}`
            );

            console.log(
                "New Balance:",
                `₦${newBalance.toLocaleString()}`
            );

            console.log(
                "Reference:",
                reference
            );

            console.log(
                "================================"
            );

            return res.status(200).json({
                success: true,
                message:
                    "Webhook processed successfully.",
            });

        } catch (error) {
            await client.query(
                "ROLLBACK"
            );

            throw error;

        } finally {
            client.release();
        }

    } catch (error) {
        console.error(
            "Paystack webhook error:",
            error.response?.data ||
            error.message
        );

        return res.status(500).json({
            success: false,
            message:
                "Webhook processing failed.",
        });
    }
};

module.exports = {
    handlePaystackWebhook,
};