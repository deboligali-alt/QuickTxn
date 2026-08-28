const axios = require("axios");
const { pool } = require("../config/db");

const purchaseElectricity = async (req, res) => {
    const { disco, meterType, meterNumber, amount } = req.body;

    if (!disco || !meterType || !meterNumber || !amount) {
        return res.status(400).json({
            success: false,
            message: "All fields are required.",
        });
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Get wallet
        const wallet = await client.query(
            `SELECT balance
       FROM wallets
       WHERE user_id = $1
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

        // VTpass purchase
        const vtpass = await axios.post(
            "https://sandbox.vtpass.com/api/pay",
            {
                request_id: `QTX-${Date.now()}`,
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
                    "Content-Type": "application/json",
                },
            }
        );

        const token = vtpass.data?.token || "";

        // Deduct wallet
        await client.query(
            `UPDATE wallets
       SET balance = balance - $1
       WHERE user_id = $2`,
            [amount, req.user.id]
        );

        // Save transaction
        await client.query(
            `INSERT INTO transactions
      (
        sender_id,
        type,
        amount,
        description,
        status,
        reference,
        payment_provider
      )
      VALUES
      ($1,'DEBIT',$2,$3,'SUCCESS',$4,'VTPASS')`,
            [
                req.user.id,
                amount,
                `Electricity - ${disco}`,
                `ELEC-${Date.now()}`,
            ]
        );

        // Notification
        await client.query(
            `INSERT INTO notifications
      (user_id,title,message)
      VALUES ($1,$2,$3)`,
            [
                req.user.id,
                "Electricity Purchased",
                `₦${Number(amount).toLocaleString()} electricity purchased successfully.`,
            ]
        );

        await client.query("COMMIT");

        res.status(200).json({
            success: true,
            message: "Electricity purchased successfully.",
            data: {
                disco,
                meterNumber,
                amount,
                token,
            },
        });
    } catch (error) {
        await client.query("ROLLBACK");

        console.error(error.response?.data || error);

        res.status(500).json({
            success: false,
            message: "Electricity purchase failed.",
        });
    } finally {
        client.release();
    }
};

module.exports = {
    purchaseElectricity,
};