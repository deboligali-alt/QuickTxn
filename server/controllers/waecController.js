const axios = require("axios");
const { pool } = require("../config/db");
const walletService = require("../services/walletService");
const transactionService = require("../services/transactionService");
const notificationService = require("../services/notificationService");
const pinService = require("../services/pinService");
const { giveCashback } = require("../services/cashbackService");

// WAEC Result Checker
const purchaseWaec = async (req, res) => {
    const { quantity, pin } = req.body;

    if (!quantity || !pin) {
        return res.status(400).json({
            success: false,
            message: "Quantity and transaction PIN are required.",
        });
    }

    const amount = Number(quantity) * 4500; // Example price

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        await pinService.verifyPin(req.user.id, pin, client);

        const wallet = await client.query(
            `SELECT balance
             FROM wallets
             WHERE user_id=$1
             FOR UPDATE`,
            [req.user.id]
        );

        const balance = Number(wallet.rows[0].balance);

        if (balance < amount) {
            await client.query("ROLLBACK");
            return res.status(400).json({
                success: false,
                message: "Insufficient wallet balance.",
            });
        }

        const requestId = `WAEC-${Date.now()}`;

        const vtpass = await axios.post(
            "https://sandbox.vtpass.com/api/pay",
            {
                request_id: requestId,
                serviceID: "waec",
                variation_code: "waecdirect",
                quantity,
                phone: req.user.phone || "08000000000",
            },
            {
                headers: {
                    "api-key": process.env.VTPASS_API_KEY,
                    "secret-key": process.env.VTPASS_SECRET_KEY,
                },
            }
        );

        await walletService.debitWallet(req.user.id, amount, client);

        await transactionService.createTransaction(
            {
                senderId: req.user.id,
                type: "WAEC",
                amount,
                status: "SUCCESS",
                description: "WAEC Result Checker Purchase",
                reference: requestId,
            },
            client
        );

        await notificationService.createNotification(
            {
                userId: req.user.id,
                title: "WAEC Purchased",
                message: `${quantity} WAEC result checker PIN purchased successfully.`,
            },
            client
        );

        const cashback = await giveCashback(
            req.user.id,
            "WAEC",
            amount,
            client
        );

        if (cashback > 0) {
            await walletService.creditWallet(
                req.user.id,
                cashback,
                client
            );
        }

        await client.query("COMMIT");

        return res.json({
            success: true,
            message: "WAEC PIN purchased successfully.",
            data: {
                quantity,
                amount,
                reference: requestId,
                provider: vtpass.data,
            },
        });

    } catch (error) {
        await client.query("ROLLBACK");

        return res.status(500).json({
            success: false,
            message:
                error.response?.data?.message ||
                error.message ||
                "WAEC purchase failed.",
        });

    } finally {
        client.release();
    }
};

module.exports = { purchaseWaec };