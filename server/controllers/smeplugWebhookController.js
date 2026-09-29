const { pool } = require("../config/db");
const { giveCashback } = require("../services/cashbackService");

const handleSMEPlugWebhook = async (req, res) => {
    const client = await pool.connect();

    try {
        console.log("========== SMEPLUG WEBHOOK ==========");
        console.log(
            JSON.stringify(req.body, null, 2)
        );
        console.log("=====================================");

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
            customer_reference: customerReference,
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
        // VALIDATE CUSTOMER REFERENCE
        // ======================================

        if (!customerReference) {
            return res.status(400).json({
                success: false,
                message:
                    "Customer reference is missing.",
            });
        }

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
        // DETERMINE QUICKTXN SERVICE
        // ======================================

        const service =
            customerReference.startsWith("DATA-")
                ? "DATA"
                : "AIRTIME";

        // ======================================
        // NORMALIZE PROVIDER STATUS
        // ======================================

        const normalizedStatus =
            String(status || "").toLowerCase();

        // ======================================
        // START DATABASE TRANSACTION
        // ======================================

        await client.query("BEGIN");

        // ======================================
        // LOCK TRANSACTION
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
            await client.query("ROLLBACK");

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
        // IDEMPOTENCY
        // ======================================

        if (
            quickTxnTransaction.status !==
            "PENDING"
        ) {
            await client.query("COMMIT");

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

        // ======================================
        // FAILED TRANSACTION
        // ======================================

        if (
            normalizedStatus === "failed" ||
            normalizedStatus === "failure"
        ) {

            // ----------------------------------
            // REFUND WALLET
            // ----------------------------------

            await client.query(
                `UPDATE wallets
                 SET
                    balance = balance + $1,
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
            // MARK TRANSACTION FAILED
            // ----------------------------------

            await client.query(
                `UPDATE transactions
                 SET
                    status = 'FAILED',
                    payment_reference = COALESCE(
                        payment_reference,
                        $1
                    ),
                    payment_provider = 'SMEPLUG'
                 WHERE id = $2`,
                [
                    providerReference,
                    quickTxnTransaction.id,
                ]
            );

            // ----------------------------------
            // UPDATE DATA PURCHASE
            // ----------------------------------

            if (service === "DATA") {
                await client.query(
                    `UPDATE data_purchases
                     SET status = 'FAILED'
                     WHERE reference = $1`,
                    [customerReference]
                );
            }

            // ----------------------------------
            // FAILURE NOTIFICATION
            // ----------------------------------

            const failureTitle =
                service === "DATA"
                    ? "Data Purchase Failed"
                    : "Airtime Purchase Failed";

            const failureMessage =
                service === "DATA"
                    ? `Your ₦${Number(
                        quickTxnTransaction.amount
                    ).toLocaleString()} data purchase failed. Your wallet has been refunded.`
                    : `Your ₦${Number(
                        quickTxnTransaction.amount
                    ).toLocaleString()} airtime purchase failed. Your wallet has been refunded.`;

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
                    failureTitle,
                    failureMessage,
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

            // ----------------------------------
            // MARK TRANSACTION SUCCESS
            // ----------------------------------

            await client.query(
                `UPDATE transactions
                 SET
                    status = 'SUCCESS',
                    payment_reference = COALESCE(
                        payment_reference,
                        $1
                    ),
                    payment_provider = 'SMEPLUG'
                 WHERE id = $2`,
                [
                    providerReference,
                    quickTxnTransaction.id,
                ]
            );

            // ----------------------------------
            // UPDATE DATA PURCHASE
            // ----------------------------------

            if (service === "DATA") {

                await client.query(
                    `UPDATE data_purchases
                     SET
                        status = 'SUCCESS'
                     WHERE reference = $1`,
                    [customerReference]
                );
            }

            // ----------------------------------
            // SUCCESS NOTIFICATION
            // ----------------------------------

            const successTitle =
                service === "DATA"
                    ? "Data Purchase Successful"
                    : "Airtime Purchase Successful";

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
                    successTitle,
                    `${quickTxnTransaction.description} was successful.`,
                ]
            );

            // ----------------------------------
            // CASHBACK
            // ----------------------------------

            const cashback =
                await giveCashback(
                    quickTxnTransaction.receiver_id,
                    service,
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
                "Service:",
                service
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
                    service,
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

        await client.query("COMMIT");

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
            await client.query(
                "ROLLBACK"
            );
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