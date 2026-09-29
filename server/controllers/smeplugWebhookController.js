const { pool } = require("../config/db");
const { giveCashback } = require("../services/cashbackService");

// ======================================
// SMEPLUG TRANSACTION WEBHOOK
// ======================================
const handleSMEPlugWebhook = async (req, res) => {
    const client = await pool.connect();

    try {
        console.log(
            "========== SMEPLUG WEBHOOK =========="
        );

        console.log(
            JSON.stringify(req.body, null, 2)
        );

        console.log(
            "====================================="
        );

        const transaction = req.body?.transaction;

        if (!transaction) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid SMEPlug webhook payload.",
            });
        }

        const {
            status,
            reference: providerReference,
            customer_reference:
            customerReference,
            type,
            beneficiary,
            memo,
            response,
            price,
        } = transaction;

        console.log(
            "SMEPlug status:",
            status
        );

        console.log(
            "SMEPlug reference:",
            providerReference
        );

        console.log(
            "QuickTxn reference:",
            customerReference
        );

        // ======================================
        // CUSTOMER REFERENCE REQUIRED
        // ======================================
        if (!customerReference) {
            return res.status(400).json({
                success: false,
                message:
                    "Customer reference is missing.",
            });
        }

        // ======================================
        // ONLY HANDLE QUICKTXN TRANSACTIONS
        // ======================================
        if (
            !customerReference.startsWith("AIR-") &&
            !customerReference.startsWith("DATA-")
        ) {
            console.log(
                "Ignoring unknown customer reference:",
                customerReference
            );

            return res.status(200).json({
                success: true,
                message:
                    "Webhook received but reference not handled.",
            });
        }

        // ======================================
        // FIND QUICKTXN TRANSACTION
        // ======================================
        const transactionResult =
            await client.query(
                `SELECT
                    id,
                    receiver_id,
                    type,
                    amount,
                    status,
                    reference,
                    description
                 FROM transactions
                 WHERE reference = $1
                 FOR UPDATE`,
                [customerReference]
            );

        if (
            transactionResult.rows.length === 0
        ) {
            console.log(
                "QuickTxn transaction not found:",
                customerReference
            );

            return res.status(404).json({
                success: false,
                message:
                    "QuickTxn transaction not found.",
            });
        }

        const quickTxnTransaction =
            transactionResult.rows[0];

        // ======================================
        // PREVENT DUPLICATE PROCESSING
        // ======================================
        if (
            quickTxnTransaction.status !==
            "PENDING"
        ) {
            console.log(
                "Transaction already processed:",
                customerReference,
                quickTxnTransaction.status
            );

            return res.status(200).json({
                success: true,
                message:
                    "Transaction already processed.",
            });
        }

        const normalizedStatus =
            String(status || "").toLowerCase();

        // ======================================
        // FAILED TRANSACTION
        // ======================================
        if (
            normalizedStatus === "failed" ||
            normalizedStatus === "failure"
        ) {
            await client.query("BEGIN");

            // ----------------------------------
            // Refund wallet
            // ----------------------------------
            await client.query(
                `UPDATE wallets
                 SET balance = balance + $1,
                     updated_at = NOW()
                 WHERE user_id = $2`,
                [
                    Number(
                        quickTxnTransaction.amount
                    ),
                    quickTxnTransaction.receiver_id,
                ]
            );

            // ----------------------------------
            // Mark transaction FAILED
            // ----------------------------------
            await client.query(
                `UPDATE transactions
                 SET status = 'FAILED'
                 WHERE id = $1`,
                [quickTxnTransaction.id]
            );

            // ----------------------------------
            // Failure notification
            // ----------------------------------
            await client.query(
                `INSERT INTO notifications
                (
                    user_id,
                    title,
                    message
                )
                VALUES ($1,$2,$3)`,
                [
                    quickTxnTransaction.receiver_id,
                    "Airtime Purchase Failed",
                    `Your ₦${Number(
                        quickTxnTransaction.amount
                    ).toLocaleString()} airtime purchase failed. Your wallet has been refunded.`,
                ]
            );

            await client.query("COMMIT");

            console.log(
                "Transaction FAILED and refunded:",
                customerReference
            );

            return res.status(200).json({
                success: true,
                message:
                    "Transaction marked as failed and refunded.",
            });
        }

        // ======================================
        // SUCCESSFUL TRANSACTION
        // ======================================
        if (
            normalizedStatus === "success" ||
            normalizedStatus === "successful"
        ) {
            await client.query("BEGIN");

            // ----------------------------------
            // Mark transaction SUCCESS
            // ----------------------------------
            await client.query(
                `UPDATE transactions
                 SET status = 'SUCCESS'
                 WHERE id = $1`,
                [quickTxnTransaction.id]
            );

            // ----------------------------------
            // Success notification
            // ----------------------------------
            await client.query(
                `INSERT INTO notifications
                (
                    user_id,
                    title,
                    message
                )
                VALUES ($1,$2,$3)`,
                [
                    quickTxnTransaction.receiver_id,
                    "Airtime Purchase Successful",
                    `${quickTxnTransaction.description} was successful.`,
                ]
            );

            // ----------------------------------
            // Cashback
            // ----------------------------------
            const cashback =
                await giveCashback(
                    quickTxnTransaction.receiver_id,
                    quickTxnTransaction.type,
                    Number(
                        quickTxnTransaction.amount
                    ),
                    client
                );

            await client.query("COMMIT");

            console.log(
                "Transaction SUCCESS:",
                customerReference
            );

            console.log(
                "Provider reference:",
                providerReference
            );

            console.log(
                "Cashback:",
                cashback
            );

            return res.status(200).json({
                success: true,
                message:
                    "Transaction marked as successful.",
                data: {
                    reference:
                        customerReference,
                    providerReference,
                    cashback,
                    beneficiary,
                    type,
                    memo,
                    response,
                    price,
                },
            });
        }

        // ======================================
        // UNKNOWN STATUS
        // ======================================
        console.log(
            "Unknown SMEPlug webhook status:",
            status
        );

        return res.status(200).json({
            success: true,
            message:
                "Webhook received with unrecognized status.",
        });
    } catch (error) {
        try {
            await client.query("ROLLBACK");
        } catch (rollbackError) {
            console.error(
                "Webhook rollback error:",
                rollbackError
            );
        }

        console.error(
            "SMEPlug Webhook Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Webhook processing failed.",
        });
    } finally {
        client.release();
    }
};

module.exports = {
    handleSMEPlugWebhook,
};