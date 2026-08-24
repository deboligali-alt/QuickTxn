const crypto = require("crypto");
const { pool } = require("../config/db");

const paystackWebhook = async (req, res) => {
    const client = await pool.connect();

    try {
        // Verify Paystack signature
        const hash = crypto
            .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
            .update(req.body)
            .digest("hex");

        if (hash !== req.headers["x-paystack-signature"]) {
            return res.sendStatus(401);
        }

        const event = JSON.parse(req.body.toString());

        // Ignore unrelated events
        if (event.event !== "charge.success") {
            return res.sendStatus(200);
        }

        const payment = event.data;

        const userId = payment.metadata?.userId;
        const amount = Number(payment.amount) / 100;
        const reference = payment.reference;

        if (!userId) {
            return res.sendStatus(200);
        }

        await client.query("BEGIN");

        // Prevent duplicate credits
        const existing = await client.query(
            `SELECT id
             FROM transactions
             WHERE payment_reference = $1`,
            [reference]
        );

        if (existing.rows.length > 0) {
            await client.query("ROLLBACK");
            return res.sendStatus(200);
        }

        // Lock wallet
        const wallet = await client.query(
            `SELECT balance
             FROM wallets
             WHERE user_id = $1
             FOR UPDATE`,
            [userId]
        );

        if (wallet.rows.length === 0) {
            throw new Error("Wallet not found");
        }

        // Credit wallet
        await client.query(
            `UPDATE wallets
             SET balance = balance + $1,
                 updated_at = NOW()
             WHERE user_id = $2`,
            [amount, userId]
        );

        // Create transaction
        await client.query(
            `INSERT INTO transactions
            (
                sender_id,
                receiver_id,
                type,
                amount,
                description,
                status,
                reference,
                payment_provider,
                payment_reference,
                created_at
            )
            VALUES
            ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW())`,
            [
                null,
                userId,
                "CREDIT",
                amount,
                "Wallet funded via Paystack",
                "SUCCESS",
                `PAY-${Date.now()}`,
                "PAYSTACK",
                reference,
            ]
        );

        // Send notification
        await client.query(
            `INSERT INTO notifications
            (
                user_id,
                title,
                message,
                created_at
            )
            VALUES
            ($1,$2,$3,NOW())`,
            [
                userId,
                "Wallet Funded",
                `₦${amount.toLocaleString("en-NG", {
                    minimumFractionDigits: 2,
                })} has been credited to your wallet successfully.`,
            ]
        );

        await client.query("COMMIT");

        console.log(
            `✅ Wallet credited: ₦${amount} | ${reference}`
        );

        return res.sendStatus(200);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Webhook Error:", error);
        return res.sendStatus(500);

    } finally {
        client.release();
    }
};

module.exports = {
    paystackWebhook,
};