const { pool } = require("../config/db");

const purchaseWaecPin = async (req, res) => {
    const { exam, examNumber, examYear } = req.body;

    if (!exam || !examNumber || !examYear) {
        return res.status(400).json({
            success: false,
            message: "All fields are required.",
        });
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Check wallet balance
        const wallet = await client.query(
            `SELECT balance FROM wallets WHERE user_id = $1 FOR UPDATE`,
            [req.user.id]
        );

        const balance = Number(wallet.rows[0]?.balance || 0);

        if (balance < 1500) {
            await client.query("ROLLBACK");
            return res.status(400).json({
                success: false,
                message: "Insufficient wallet balance.",
            });
        }

        // Deduct ₦1,500
        await client.query(
            `UPDATE wallets
       SET balance = balance - 1500
       WHERE user_id = $1`,
            [req.user.id]
        );

        // Generate demo PIN & Serial (replace with VTpass later)
        const pin = Math.random().toString().slice(2, 14);
        const serial = `SN${Date.now()}`;

        // Save transaction
        await client.query(
            `INSERT INTO transactions
      (sender_id,type,amount,description,status)
      VALUES ($1,'DEBIT',1500,$2,'SUCCESS')`,
            [req.user.id, `${exam.toUpperCase()} Result Checker`]
        );

        // Notification
        await client.query(
            `INSERT INTO notifications
      (user_id,title,message)
      VALUES ($1,$2,$3)`,
            [
                req.user.id,
                "WAEC/NECO PIN Purchased",
                "Your result checker PIN has been generated.",
            ]
        );

        await client.query("COMMIT");

        res.json({
            success: true,
            data: {
                exam,
                examYear,
                pin,
                serial,
            },
        });
    } catch (err) {
        await client.query("ROLLBACK");
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Purchase failed.",
        });
    } finally {
        client.release();
    }
};

module.exports = {
    purchaseWaecPin,
};