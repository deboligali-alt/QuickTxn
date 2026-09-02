const axios = require("axios");
const { pool } = require("../config/db");
const walletService = require("../services/walletService");
const transactionService = require("../services/transactionService");
const notificationService = require("../services/notificationService");
const pinService = require("../services/pinService");
const { giveCashback } = require("../services/cashbackService");

const purchaseCable = async (req, res) => {
    const {
        provider,
        smartCard,
        bouquet,
        amount,
        pin,
    } = req.body;

    if (
        !provider ||
        !smartCard ||
        !bouquet ||
        !amount ||
        !pin
    ) {
        return res.status(400).json({
            success: false,
            status: "FAILED",
            message: "All fields are required.",
        });
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Verify PIN
        await pinService.verifyPin(req.user.id, pin, client);

        // Wallet
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
                status: "FAILED",
                message: "Insufficient wallet balance.",
            });
        }

        // VTpass
        const vtpass = await axios.post(
            "https://sandbox.vtpass.com/api/pay",
            {
                request_id: `CBL-${Date.now()}`,
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
                },
            }
        );

        const reference = `CBL-${Date.now()}`;

        await walletService.debitWallet(
            req.user.id,
            amount,
            client
        );

        await transactionService.createTransaction(
            {
                senderId: req.user.id,
                type: "CABLE",
                amount,
                status: "SUCCESS",
                description: `${provider.toUpperCase()} Subscription`,
                reference,
            },
            client
        );

        await notificationService.createNotification(
            {
                userId: req.user.id,
                title: "Cable Subscription",
                message: `₦${Number(amount).toLocaleString()} ${provider.toUpperCase()} subscription successful.`,
            },
            client
        );

        const cashback = await giveCashback(
            req.user.id,
            "CABLE",
            amount,
            client
        );

        if (cashback > 0) {
            await walletService.creditWallet(
                req.user.id,
                cashback,
                client
            );

            await transactionService.createTransaction(
                {
                    senderId: req.user.id,
                    type: "CASHBACK",
                    amount: cashback,
                    status: "SUCCESS",
                    description: "Cable Cashback",
                    reference: `CB-${Date.now()}`,
                },
                client
            );
        }

        await client.query("COMMIT");

        return res.status(200).json({
            success: true,
            status: "SUCCESS",
            message: "Subscription successful.",
            data: {
                provider,
                smartCard,
                bouquet,
                amount,
                cashback,
                reference,
            },
        });

    } catch (error) {
        await client.query("ROLLBACK");

        return res.status(500).json({
            success: false,
            status: "FAILED",
            message:
                error.response?.data?.message ||
                error.message ||
                "Cable subscription failed.",
        });

    } finally {
        client.release();
    }
};

module.exports = { purchaseCable };