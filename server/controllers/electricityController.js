const { pool } = require("../config/db");
const walletService = require("../services/walletService");
const transactionService = require("../services/transactionService");
const notificationService = require("../services/notificationService");
const pinService = require("../services/pinService");
const { purchaseElectricityVTU } = require("../services/electricityService");
const { giveCashback } = require("../services/cashbackService");
// ========================================
// VERIFY METER
// ========================================
const verifyMeter = async (req, res) => {
    try {
        const { disco, meterType, meterNumber } = req.body;

        if (!disco || !meterType || !meterNumber) {
            return res.status(400).json({
                success: false,
                message: "Disco, meter type and meter number are required.",
            });
        }

        // Sandbox response (replace with VTpass later)
        return res.json({
            success: true,
            message: "Meter verified successfully.",
            data: {
                customerName: "ADEBOWALE IBRAHIM",
                disco,
                meterType,
                meterNumber,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ========================================
// ELECTRICITY HISTORY
// ========================================
const getElectricityHistory = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT *
             FROM transactions
             WHERE sender_id=$1
             AND type='ELECTRICITY'
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
const purchaseElectricity = async (req, res) => {
    const { disco, meterType, meterNumber, amount, pin } = req.body;

    if (!disco || !meterType || !meterNumber || !amount || !pin) {
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

        const reference = `ELEC-${Date.now()}`;

        // Live Provider
        const provider = await purchaseElectricityVTU({
            disco,
            meterType,
            meterNumber,
            amount,
            reference,
            phone: req.user.phone,
        });

        if (!provider.success) {
            throw new Error(provider.message);
        }

        await walletService.debitWallet(req.user.id, amount, client);

        await transactionService.createTransaction(
            {
                senderId: req.user.id,
                type: "ELECTRICITY",
                amount,
                status: "SUCCESS",
                description: `${disco} Electricity`,
                reference,
            },
            client
        );

        await notificationService.createNotification(
            {
                userId: req.user.id,
                title: "Electricity Payment",
                message: `₦${Number(amount).toLocaleString()} electricity purchased successfully.`,
            },
            client
        );

        const cashback = await giveCashback(
            req.user.id,
            "ELECTRICITY",
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
                    description: "Electricity Cashback",
                    reference: `CB-${Date.now()}`,
                },
                client
            );
        }

        await client.query("COMMIT");

        return res.json({
            success: true,
            message: "Electricity purchased successfully.",
            data: {
                disco,
                meterNumber,
                amount,
                token: provider.token,
                units: provider.units,
                reference,
                cashback,
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
module.exports = {
    verifyMeter,
    purchaseElectricity,
    getElectricityHistory,
};