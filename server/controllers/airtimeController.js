const { pool } = require("../config/db");
const axios = require("axios");
const createSwapRequest = async (req, res) => {
    try {
        const { network, phoneNumber, airtimeAmount } = req.body;

        // Validate input
        if (!network || !phoneNumber || !airtimeAmount) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        if (Number(airtimeAmount) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Airtime amount must be greater than zero."
            });
        }

        // Get current rate
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
                message: "Network not supported."
            });
        }

        const rate = Number(rateResult.rows[0].rate);

        // Calculate receivable amount
        const receivableAmount = (
            Number(airtimeAmount) * rate
        ) / 100;

        // Generate transaction reference
        const reference = "ATS-" + Date.now();

        // Save request
        // Save request
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
                reference
            ]
        );

        // Create Notification
        await pool.query(
            `INSERT INTO notifications
    (
        user_id,
        title,
        message
    )
    VALUES ($1,$2,$3)`,
            [
                req.user.id,
                "Airtime Swap Submitted",
                `Your ${network.toUpperCase()} airtime swap request of ₦${Number(airtimeAmount).toLocaleString()} has been received and is awaiting admin approval.`
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Airtime swap request submitted successfully.",
            data: {
                network: network.toUpperCase(),
                airtimeAmount,
                rate,
                receivableAmount,
                status: "PENDING",
                reference
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

// ====================================
// Get Airtime Rates
// ====================================
const getRates = async (req, res) => {
    try {

        const result = await pool.query(
            `SELECT
                network,
                rate
             FROM airtime_rates
             WHERE is_active = TRUE
             ORDER BY network`
        );

        return res.status(200).json({
            success: true,
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

// ====================================
// Get User Airtime Swap History
// ====================================
const getSwapHistory = async (req, res) => {
    try {

        const result = await pool.query(
            `SELECT
                id,
                network,
                phone_number,
                airtime_amount,
                rate,
                receivable_amount,
                status,
                transaction_reference,
                created_at
             FROM airtime_swaps
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

// ====================================
// BUY AIRTIME
// ====================================
const purchaseAirtime = async (req, res) => {
    const client = await pool.connect();

    try {
        const { network, phone, amount } = req.body;

        if (!network || !phone || !amount) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        await client.query("BEGIN");

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

        // VTU Provider
        await axios.post(
            process.env.VTU_BASE_URL + "/airtime",
            {
                network,
                phone,
                amount,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.VTU_API_KEY}`,
                },
            }
        );

        const newBalance = balance - Number(amount);

        await client.query(
            `UPDATE wallets
             SET balance=$1, updated_at=NOW()
             WHERE user_id=$2`,
            [newBalance, req.user.id]
        );

        const reference = `AIR-${Date.now()}`;

        await client.query(
            `INSERT INTO transactions
            (receiver_id,type,amount,status,reference,description)
            VALUES($1,$2,$3,$4,$5,$6)`,
            [
                req.user.id,
                "AIRTIME",
                amount,
                "success",
                reference,
                `${network} Airtime Purchase`,
            ]
        );

        await client.query(
            `INSERT INTO notifications
            (user_id,title,message)
            VALUES($1,$2,$3)`,
            [
                req.user.id,
                "Airtime Purchase",
                `₦${Number(amount).toLocaleString()} ${network} airtime purchased successfully.`,
            ]
        );

        await client.query("COMMIT");

        const io = req.app.get("io");
        io.to(req.user.id).emit("wallet_updated");
        io.to(req.user.id).emit("new_transaction");

        res.status(200).json({
            success: true,
            message: "Airtime purchased successfully.",
        });

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error.response?.data || error.message);

        res.status(500).json({
            success: false,
            message: "Airtime purchase failed.",
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