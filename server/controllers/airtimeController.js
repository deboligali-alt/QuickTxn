const { pool } = require("../config/db");
const { purchaseAirtimeVTU } = require("../services/vtuService");
const bcrypt = require("bcryptjs");
const { giveCashback } = require("../services/cashbackService");

// ====================================
// CREATE AIRTIME SWAP REQUEST
// ====================================
const createSwapRequest = async (req, res) => {
    try {
        const { network, phoneNumber, airtimeAmount } = req.body;

        if (!network || !phoneNumber || !airtimeAmount) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        const rateResult = await pool.query(
            `SELECT rate
             FROM airtime_rates
             WHERE network = $1
             AND is_active = TRUE`,
            [network.toUpperCase()]
        );

        if (rateResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Network not supported.",
            });
        }

        const rate = Number(rateResult.rows[0].rate);
        const receivableAmount = (Number(airtimeAmount) * rate) / 100;
        const reference = `ATS-${Date.now()}`;

        await pool.query(
            `INSERT INTO airtime_swaps
            (
                user_id,
                network,
                phone_number,
                airtime_amount,
                rate,
                receivable_amount,
                transaction_reference
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7)`,
            [
                req.user.id,
                network.toUpperCase(),
                phoneNumber,
                airtimeAmount,
                rate,
                receivableAmount,
                reference,
            ]
        );

        await pool.query(
            `INSERT INTO notifications
            (user_id,title,message)
            VALUES($1,$2,$3)`,
            [
                req.user.id,
                "Airtime Swap Submitted",
                `Your ${network.toUpperCase()} airtime swap request of ₦${Number(
                    airtimeAmount
                ).toLocaleString()} has been received.`,
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Swap request submitted successfully.",
            data: {
                reference,
                rate,
                receivableAmount,
                status: "PENDING",
            },
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// ====================================
// GET AIRTIME RATES
// ====================================
const getRates = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT network, rate
             FROM airtime_rates
             WHERE is_active = TRUE
             ORDER BY network`
        );

        return res.json({
            success: true,
            data: result.rows,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// ====================================
// GET SWAP HISTORY
// ====================================
const getSwapHistory = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT *
             FROM airtime_swaps
             WHERE user_id = $1
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

// ====================================
// PURCHASE AIRTIME (LIVE CLUBKONNECT)
// ====================================
const purchaseAirtime = async (req, res) => {
    const client = await pool.connect();

    try {
        console.log("REQUEST BODY:", req.body);

        const {
            network,
            phoneNumber,
            amount,
            pin,
        } = req.body;

        const phone = String(phoneNumber || "").trim();

        console.log("PHONE:", phone);

        if (!network || !phone || !amount || !pin) {
            return res.status(400).json({
                success: false,
                message: "Network, phone number, amount and PIN are required.",
            });
        }

        await client.query("BEGIN");

        // ...keep the rest of your function unchanged

        // continue with the rest of your code...


        // Verify transaction PIN
        const userResult = await client.query(
            `SELECT transaction_pin
             FROM users
             WHERE id = $1`,
            [req.user.id]
        );

        if (userResult.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const validPin = await bcrypt.compare(
            pin,
            userResult.rows[0].transaction_pin
        );

        if (!validPin) {
            await client.query("ROLLBACK");
            return res.status(400).json({
                success: false,
                message: "Invalid transaction PIN.",
            });
        }

        // Lock wallet
        const walletResult = await client.query(
            `SELECT balance
             FROM wallets
             WHERE user_id = $1
             FOR UPDATE`,
            [req.user.id]
        );

        const balance = Number(walletResult.rows[0].balance);

        if (balance < Number(amount)) {
            await client.query("ROLLBACK");
            return res.status(400).json({
                success: false,
                message: "Insufficient wallet balance.",
            });
        }

        const reference = `AIR-${Date.now()}`;

        // ===== LIVE CLUBKONNECT =====
        const provider = await purchaseAirtimeVTU({
            network,
            phone,
            amount,
            reference,
        });

        console.log("======= ClubKonnect Airtime =======");
        console.log(provider);
        console.log("==================================");

        if (!provider.success) {
            await client.query("ROLLBACK");
            return res.status(400).json({
                success: false,
                message: provider.message,
                provider,
            });
        }

        const newBalance = balance - Number(amount);

        // Update wallet
        await client.query(
            `UPDATE wallets
             SET balance = $1,
                 updated_at = NOW()
             WHERE user_id = $2`,
            [newBalance, req.user.id]
        );

        // Save transaction
        await client.query(
            `INSERT INTO transactions
            (
                receiver_id,
                type,
                amount,
                status,
                reference,
                description
            )
            VALUES ($1,$2,$3,$4,$5,$6)`,
            [
                req.user.id,
                "AIRTIME",
                amount,
                "SUCCESS",
                reference,
                `${network.toUpperCase()} Airtime - ${phone}`,
            ]
        );

        // Notification
        await client.query(
            `INSERT INTO notifications
            (user_id,title,message)
            VALUES ($1,$2,$3)`,
            [
                req.user.id,
                "Airtime Purchase",
                `₦${Number(amount).toLocaleString()} ${network.toUpperCase()} airtime sent to ${phone}.`,
            ]
        );

        // Cashback
        const cashback = await giveCashback(
            req.user.id,
            "AIRTIME",
            Number(amount),
            client
        );

        if (cashback > 0) {
            await client.query(
                `UPDATE wallets
                 SET balance = balance + $1
                 WHERE user_id = $2`,
                [cashback, req.user.id]
            );

            await client.query(
                `INSERT INTO transactions
                (
                    receiver_id,
                    type,
                    amount,
                    status,
                    reference,
                    description
                )
                VALUES ($1,$2,$3,$4,$5,$6)`,
                [
                    req.user.id,
                    "CASHBACK",
                    cashback,
                    "SUCCESS",
                    `CB-${Date.now()}`,
                    "2% Cashback Reward",
                ]
            );
        }

        await client.query("COMMIT");

        return res.json({
            success: true,
            message: "Airtime purchased successfully.",
            data: {
                network,
                phone,
                amount,
                reference,
                cashback,
                balance: newBalance + cashback,
            },
        });
    } catch (error) {
        await client.query("ROLLBACK");

        console.error("Airtime Purchase Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Airtime purchase failed.",
        });
    } finally {
        client.release();
    }
};

module.exports = {
    createSwapRequest,
    getRates,
    getSwapHistory,
    purchaseAirtime,
};