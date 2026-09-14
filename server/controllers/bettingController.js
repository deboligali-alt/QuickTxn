const { pool } = require("../config/db");
const walletService = require("../services/walletService");
const transactionService = require("../services/transactionService");
const notificationService = require("../services/notificationService");
const pinService = require("../services/pinService");
const {
    verifyCustomer,
    fundBettingWallet,
} = require("../services/bettingService");
const { giveCashback } = require("../services/cashbackService");

// ========================================
// GET BETTING PROVIDERS
// ========================================
const getProviders = async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT provider_name, provider_code
      FROM betting_providers
      WHERE is_active = TRUE
      ORDER BY provider_name
    `);

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

// ========================================
// VERIFY CUSTOMER
// ========================================
const verifyBettingCustomer = async (req, res) => {
    try {
        const { provider, customerId } = req.body;

        if (!provider || !customerId) {
            return res.status(400).json({
                success: false,
                message: "Provider and customer ID are required.",
            });
        }

        const result = await verifyCustomer({
            provider,
            customerId,
        });

        return res.json(result);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ========================================
// FUND BETTING WALLET
// ========================================
const fundWallet = async (req, res) => {
    const { providerCode, bettingUserId, amount, pin } = req.body;

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        await pinService.verifyPin(req.user.id, pin, client);

        const providerResult = await client.query(
            `SELECT *
       FROM betting_providers
       WHERE provider_code=$1
       AND is_active=TRUE`,
            [providerCode]
        );

        if (providerResult.rows.length === 0) {
            throw new Error("Betting provider not found.");
        }

        const provider = providerResult.rows[0];

        const reference = `BET-${Date.now()}`;

        await fundBettingWallet({
            provider: provider.provider_code,
            customerId: bettingUserId,
            amount,
            reference,
        });

        await walletService.debitWallet(
            req.user.id,
            amount,
            client
        );

        await client.query(
            `INSERT INTO betting_transactions
      (
        user_id,
        provider_name,
        provider_code,
        betting_user_id,
        amount,
        status,
        provider,
        reference
      )
      VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,
            [
                req.user.id,
                provider.provider_name,
                provider.provider_code,
                bettingUserId,
                amount,
                "SUCCESS",
                "QuickTxn Sandbox",
                reference,
            ]
        );

        await transactionService.createTransaction(
            {
                senderId: req.user.id,
                type: "BETTING",
                amount,
                status: "SUCCESS",
                description: `Funded ${provider.provider_name}`,
                reference,
            },
            client
        );

        await notificationService.createNotification(
            {
                userId: req.user.id,
                title: "Betting Wallet Funded",
                message: `₦${Number(amount).toLocaleString()} sent to ${provider.provider_name}.`,
            },
            client
        );

        const cashback = await giveCashback(
            req.user.id,
            "BETTING",
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

        const io = req.app.get("io");
        io.to(req.user.id).emit("wallet_updated");
        io.to(req.user.id).emit("new_transaction");

        return res.json({
            success: true,
            message: "Betting wallet funded successfully.",
            data: {
                provider: provider.provider_name,
                bettingUserId,
                amount,
                cashback,
                reference,
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

// ========================================
// HISTORY
// ========================================
const getFundingHistory = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT *
       FROM betting_transactions
       WHERE user_id=$1
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
    getProviders,
    verifyBettingCustomer,
    fundWallet,
    getFundingHistory,
};