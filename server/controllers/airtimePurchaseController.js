const { pool } = require("../config/db");

const walletService = require("../services/walletService");
const transactionService = require("../services/transactionService");
const notificationService = require("../services/notificationService");
const pinService = require("../services/pinService");

// ========================================
// Purchase Airtime
// ========================================
const purchaseAirtime = async (req, res) => {

    const { network, phoneNumber, amount, pin } = req.body;

    if (!network || !phoneNumber || !amount || !pin) {
        return res.status(400).json({
            success: false,
            message: "Network, phone number, amount and transaction PIN are required."
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

        // Start database transaction
        await client.query("BEGIN");

        // Verify transaction PIN
        await pinService.verifyPin(
            req.user.id,
            pin,
            client
        );

        // Debit wallet
        await walletService.debitWallet(
            req.user.id,
            amount,
            client
        );

        const reference = `AIR-${Date.now()}`;

        // Save airtime purchase
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
                network.toUpperCase(),
                phoneNumber,
                amount,
                "SUCCESS",
                "SIMULATION",
                reference
            ]
        );

        // Save financial transaction
        await transactionService.createTransaction({
            senderId: req.user.id,
            type: "AIRTIME_PURCHASE",
            amount,
            status: "SUCCESS",
            description: `Purchased ${network.toUpperCase()} airtime`,
            reference
        }, client);

        // Create notification
        await notificationService.createNotification({
            userId: req.user.id,
            title: "Airtime Purchase",
            message: `You successfully purchased ₦${Number(amount).toLocaleString()} ${network.toUpperCase()} airtime for ${phoneNumber}.`
        }, client);

        // Commit transaction
        await client.query("COMMIT");

        return res.status(201).json({
            success: true,
            message: "Airtime purchased successfully.",
            data: {
                network: network.toUpperCase(),
                phoneNumber,
                amount,
                reference,
                status: "SUCCESS"
            }
        });

    } catch (error) {

        // Roll back only if a transaction has started
        try {
            await client.query("ROLLBACK");
        } catch (rollbackError) {
            console.error("Rollback Error:", rollbackError);
        }

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
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