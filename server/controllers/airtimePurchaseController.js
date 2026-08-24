const { pool } = require("../config/db");

const walletService = require("../services/walletService");
const transactionService = require("../services/transactionService");
const notificationService = require("../services/notificationService");
const pinService = require("../services/pinService");
const airtimeService = require("../services/airtimeService");

// ========================================
// Purchase Airtime
// ========================================
const purchaseAirtime = async (req, res) => {

    const {
        network,
        phoneNumber,
        amount,
        pin
    } = req.body;

    // ========================================
    // Validate request
    // ========================================
    if (
        !network ||
        !phoneNumber ||
        !amount ||
        !pin
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Network, phone number, amount and transaction PIN are required."
        });
    }

    if (Number(amount) <= 0) {
        return res.status(400).json({
            success: false,
            message:
                "Amount must be greater than zero."
        });
    }

    // ========================================
    // Normalize network
    // ========================================
    const normalizedNetwork =
        network.toUpperCase();

    const supportedNetworks = [
        "MTN",
        "AIRTEL",
        "GLO",
        "9MOBILE"
    ];

    if (
        !supportedNetworks.includes(
            normalizedNetwork
        )
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Unsupported network."
        });
    }

    // ========================================
    // Database connection
    // ========================================
    const client =
        await pool.connect();

    try {

        // ========================================
        // Start transaction
        // ========================================
        await client.query("BEGIN");

        // ========================================
        // Verify transaction PIN
        // ========================================
        await pinService.verifyPin(
            req.user.id,
            pin,
            client
        );

        // ========================================
        // Purchase airtime from VTpass
        // ========================================
        const providerResult =
            await airtimeService.purchaseAirtime({
                network:
                    normalizedNetwork,
                phoneNumber,
                amount
            });

        // ========================================
        // Make sure provider succeeded
        // ========================================
        if (!providerResult.success) {

            await client.query(
                "ROLLBACK"
            );

            return res.status(400).json({
                success: false,
                message:
                    providerResult.message ||
                    "Airtime purchase failed."
            });
        }

        // ========================================
        // Debit wallet ONLY after
        // VTpass confirms success
        // ========================================
        await walletService.debitWallet(
            req.user.id,
            amount,
            client
        );

        // ========================================
        // Generate QuickTxn reference
        // ========================================
        const reference =
            `AIR-${Date.now()}`;

        // ========================================
        // Save airtime purchase
        // ========================================
        await client.query(
            `INSERT INTO airtime_purchases
            (
                user_id,
                network,
                phone_number,
                amount,
                status,
                provider,
                reference
            )
            VALUES
            ($1,$2,$3,$4,$5,$6,$7)`,
            [
                req.user.id,
                normalizedNetwork,
                phoneNumber,
                amount,
                "SUCCESS",
                "VTPASS",
                reference
            ]
        );

        // ========================================
        // Save financial transaction
        // ========================================
        await transactionService.createTransaction(
            {
                senderId:
                    req.user.id,

                type:
                    "AIRTIME_PURCHASE",

                amount,

                status:
                    "SUCCESS",

                description:
                    `Purchased ${normalizedNetwork} airtime`,

                reference
            },
            client
        );

        // ========================================
        // Create notification
        // ========================================
        await notificationService.createNotification(
            {
                userId:
                    req.user.id,

                title:
                    "Airtime Purchase",

                message:
                    `You successfully purchased ₦${Number(amount).toLocaleString()} ${normalizedNetwork} airtime for ${phoneNumber}.`
            },
            client
        );

        // ========================================
        // Commit transaction
        // ========================================
        await client.query(
            "COMMIT"
        );

        return res.status(201).json({
            success: true,

            message:
                "Airtime purchased successfully.",

            data: {
                network:
                    normalizedNetwork,

                phoneNumber,

                amount,

                reference,

                provider:
                    "VTPASS",

                providerReference:
                    providerResult.providerReference,

                status:
                    "SUCCESS"
            }
        });

  } catch (error) {

    try {
        await client.query("ROLLBACK");
    } catch (rollbackError) {
        console.error(
            "Rollback Error:",
            rollbackError
        );
    }

    console.error(
        "Airtime Purchase Error:",
        error.message
    );

    const providerFailure =
        error.message === "TRANSACTION FAILED" ||
        error.message === "Airtime purchase failed.";

    if (providerFailure) {
        return res.status(502).json({
            success: false,
            message:
                "Airtime transaction failed. Your wallet was not debited."
        });
    }

    if (
        error.message ===
        "Invalid transaction PIN." ||
        error.message ===
        "Transaction PIN has not been set."
    ) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    if (
        error.message ===
        "Insufficient wallet balance."
    ) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    return res.status(500).json({
        success: false,
        message:
            "Unable to complete airtime purchase."
    });

} finally {

        client.release();

    }
};

// ========================================
// Airtime Purchase History
// ========================================
const getAirtimeHistory = async (req, res) => {

    try {

        const result = await pool.query(
            `SELECT
                id,
                network,
                phone_number,
                amount,
                status,
                provider,
                reference,
                created_at
             FROM airtime_purchases
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
    purchaseAirtime,
    getAirtimeHistory
};