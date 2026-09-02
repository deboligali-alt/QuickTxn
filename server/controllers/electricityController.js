const axios = require("axios");
const { pool } = require("../config/db");
const walletService = require("../services/walletService");
const transactionService = require("../services/transactionService");
const notificationService = require("../services/notificationService");
const pinService = require("../services/pinService");
const { giveCashback } = require("../services/cashbackService");

const purchaseElectricity = async (req, res) => {
    const {
        disco,
        meterType,
        meterNumber,
        amount,
        pin,
    } = req.body;

    if (
        !disco ||
        !meterType ||
        !meterNumber ||
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

        // Check wallet
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
                request_id: `ELEC-${Date.now()}`,
                serviceID: disco.toLowerCase(),
                billersCode: meterNumber,
                variation_code: meterType,
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

        const reference = `ELEC-${Date.now()}`;

        await walletService.debitWallet(
            req.user.id,
            amount,
            client
        );

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

        return res.status(200).json({
            success: true,
            status: "SUCCESS",
            message: "Electricity purchased successfully.",
            data: {
                disco,
                meterNumber,
                amount,
                token: vtpass.data?.token || "",
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
                "Electricity purchase failed.",
        });

    } finally {
        client.release();
    }
};

module.exports = { purchaseElectricity };