const axios = require("axios");
const { pool } = require("../config/db");

const purchaseCable = async (req, res) => {
    const { provider, smartCard, bouquet, amount } = req.body;

    if (!provider || !smartCard || !bouquet || !amount) {
        return res.status(400).json({
            success: false,
            message: "All fields are required.",
        });
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Check wallet balance
        const wallet = await client.query(
            `SELECT balance
             FROM wallets
             WHERE user_id = $1
             FOR UPDATE`,
            [req.user.id]
        );

        const balance = Number(wallet.rows[0].balance);

        if (balance < Number(amount)) {
            await client.query("ROLLBACK");

            return res.status(400).json({
                success: false,
                message: "Insufficient wallet balance.",
            });
        }

        // VTpass purchase
        const vtpass = await axios.post(
            "https://sandbox.vtpass.com/api/pay",
            {
                request_id: `QTX-${Date.now()}`,
                serviceID: provider,
                billersCode: smartCard,
                variation_code: bouquet,
                amount: Number(amount),
                phone: req.user.phone || "08000000000",
            },
            {
                headers: {
                    "api-key": process.env.VTPASS_API_KEY,
                    "secret-key": process.env.VTPASS_SECRET_KEY,
                    "Content-Type": "application/json",
                },
            }
        );

        // Deduct wallet
        await client.query(
            `UPDATE wallets
             SET balance = balance - $1
             WHERE user_id = $2`,
            [amount, req.user.id]
        );

        // Save transaction
        await client.query(
            `INSERT INTO transactions
            (
                sender_id,
                type,
                amount,
                description,
                status,
                reference,
                payment_provider
            )
            VALUES
            ($1,'DEBIT',$2,$3,'SUCCESS',$4,'VTPASS')`,
            [
                req.user.id,
                amount,
                `Cable TV - ${provider.toUpperCase()}`,
                `CBL-${Date.now()}`,
            ]
        );

        // Notification
        await client.query(
            `INSERT INTO notifications
            (user_id,title,message)
            VALUES ($1,$2,$3)`,
            [
                req.user.id,
                "Cable Subscription",
                `₦${Number(amount).toLocaleString()} ${provider.toUpperCase()} subscription successful.`,
            ]
        );

        await client.query("COMMIT");

        return res.status(200).json({
            success: true,
            message: "Subscription successful.",
            data: {
                provider,
                smartCard,
                bouquet,
                amount,
                reference: vtpass.data?.requestId || `CBL-${Date.now()}`,
            },
        });

    } catch (error) {
        await client.query("ROLLBACK");

        console.error(error.response?.data || error);

        return res.status(500).json({
            success: false,
            message: "Cable subscription failed.",
        });

    } finally {
        client.release();
    }
};

module.exports = {
    purchaseCable,
};