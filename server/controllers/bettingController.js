const { pool } = require("../config/db");

const walletService = require("../services/walletService");
const transactionService = require("../services/transactionService");
const notificationService = require("../services/notificationService");
const pinService = require("../services/pinService");
// ========================================
// Get Betting Providers
// ========================================
const getProviders = async (req, res) => {
    try {

        const result = await pool.query(
            `SELECT
                provider_name,
                provider_code
             FROM betting_providers
             WHERE is_active = TRUE
             ORDER BY provider_name`
        );

        return res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};

// ========================================
// Fund Betting Wallet
// ========================================
const fundBettingWallet = async (req, res) => {

    const {
        providerCode,
        bettingUserId,
        amount,
        pin
    } = req.body;
    if (!providerCode || !bettingUserId || !amount || !pin) {
        return res.status(400).json({
            success: false,
            message: "Provider, betting ID, amount and transaction PIN are required."
        });
    }

    if (Number(amount) <= 0) {
        return res.status(400).json({
            success: false,
            message: "Amount must be greater than zero."
        });
    }

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        // Verify Transaction PIN
        await pinService.verifyPin(
            req.user.id,
            pin,
            client
        );

        // Get Provider
        const providerResult = await client.query(
            `SELECT *
             FROM betting_providers
             WHERE provider_code = $1
             AND is_active = TRUE`,
            [providerCode]
        );

        if (providerResult.rows.length === 0) {

            await client.query("ROLLBACK");

            return res.status(404).json({
                success: false,
                message: "Betting provider not found."
            });

        }

        const provider = providerResult.rows[0];

        // Debit Wallet
        await walletService.debitWallet(
            req.user.id,
            amount,
            client
        );

        const reference = `BET-${Date.now()}`;

        // Save Betting Transaction
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
            VALUES
            ($1,$2,$3,$4,$5,$6,$7,$8)`,
            [
                req.user.id,
                provider.provider_name,
                provider.provider_code,
                bettingUserId,
                amount,
                "SUCCESS",
                "SIMULATION",
                reference
            ]
        );

        // Save Financial Transaction
        await transactionService.createTransaction({
            senderId: req.user.id,
            type: "BETTING_FUNDING",
            amount,
            status: "SUCCESS",
            description: `Funded ${provider.provider_name} wallet`,
            reference
        }, client);

        // Create Notification
        await notificationService.createNotification({
            userId: req.user.id,
            title: "Betting Wallet Funded",
            message: `₦${Number(amount).toLocaleString()} has been used to fund your ${provider.provider_name} wallet.`
        }, client);

        await client.query("COMMIT");

        return res.status(200).json({
            success: true,
            message: "Betting wallet funded successfully.",
            data: {
                provider: provider.provider_name,
                bettingUserId,
                amount,
                reference
            }
        });

    } catch (error) {

        await client.query("ROLLBACK");

        console.error(error);

        if (
            error.message === "Invalid transaction PIN." ||
            error.message === "Transaction PIN has not been set." ||
            error.message === "Insufficient wallet balance."
        ) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    } finally {

        client.release();

    }

};

// ========================================
// Funding History
// ========================================
const getFundingHistory = async (req, res) => {

    try {

        const result = await pool.query(
            `SELECT
                provider_name,
                betting_user_id,
                amount,
                status,
                reference,
                created_at
             FROM betting_transactions
             WHERE user_id = $1
             ORDER BY created_at DESC`,
            [req.user.id]
        );

        return res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};

module.exports = {
    getProviders,
    fundBettingWallet,
    getFundingHistory
};