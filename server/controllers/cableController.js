const { pool } = require("../config/db");
const walletService = require("../services/walletService");
const transactionService = require("../services/transactionService");
const notificationService = require("../services/notificationService");
const pinService = require("../services/pinService");
const {
    purchaseCable,
    verifyDecoder,
    getCablePackages,
} = require("../services/cableService");
const { giveCashback } = require("../services/cashbackService");

// ==========================================
// VERIFY DECODER
// ==========================================
const verifyCable = async (req, res) => {
    try {
        const { provider, smartCard } = req.body;

        if (!provider || !smartCard) {
            return res.status(400).json({
                success: false,
                message: "Provider and smart card are required.",
            });
        }

        const result = await verifyDecoder({
            provider,
            smartcardNumber: smartCard,
        });

        return res.json(result);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ==========================================
// GET PACKAGES
// ==========================================
const getPackages = async (req, res) => {
    try {
        const { provider } = req.query;

        if (!provider) {
            return res.status(400).json({
                success: false,
                message: "Provider is required.",
            });
        }

        const packages = await getCablePackages(provider);

        return res.json({
            success: true,
            data: packages,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ==========================================
// PURCHASE CABLE
// ==========================================
const subscribeCable = async (req, res) => {
    const { provider, smartCard, bouquet, amount, pin } = req.body;

    if (!provider || !smartCard || !bouquet || !amount || !pin) {
        return res.status(400).json({
            success: false,
            message: "All fields are required.",
        });
    }

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

        if (balance < Number(amount)) {
            await client.query("ROLLBACK");

            return res.status(400).json({
                success: false,
                message: "Insufficient wallet balance.",
            });
        }

        const reference = `CBL-${Date.now()}`;

        const providerResult = await purchaseCable({
            provider,
            smartcardNumber: smartCard,
            packageCode: bouquet,
            amount,
            reference,
        });

        if (!providerResult.success) {
            throw new Error(providerResult.message);
        }

        await walletService.debitWallet(req.user.id, amount, client);

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

        return res.json({
            success: true,
            message: "Subscription successful.",
            data: {
                provider,
                smartCard,
                bouquet,
                amount,
                cashback,
                reference,
                customerName: providerResult.customerName,
            },
        });
    } catch (error) {
        await client.query("ROLLBACK");

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    } finally {
        client.release();
    }
};

// ==========================================
// HISTORY
// ==========================================
const getCableHistory = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT *
       FROM transactions
       WHERE sender_id=$1
       AND type='CABLE'
       ORDER BY created_at DESC`,
            [req.user.id]
        );

        return res.json({
            success: true,
            count: result.rows.length,
            data: result.rows,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

module.exports = {
    verifyCable,
    getPackages,
    subscribeCable,
    getCableHistory,
};