const { pool } = require("../config/db");
const walletService = require("../services/walletService");
const transactionService = require("../services/transactionService");
const notificationService = require("../services/notificationService");
const pinService = require("../services/pinService");
const dataService = require("../services/dataService");
const { giveCashback } = require("../services/cashbackService");

// ========================================
// Purchase Data
// ========================================
const purchaseData = async (req, res) => {
    const { network, planCode, phoneNumber, pin } = req.body;

    if (!network || !planCode || !phoneNumber || !pin) {
        return res.status(400).json({
            success: false,
            message:
                "Network, plan code, phone number and transaction PIN are required.",
        });
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Verify PIN
        await pinService.verifyPin(req.user.id, pin, client);

        // Get selected plan
        const planResult = await client.query(
            `SELECT *
       FROM data_plans
       WHERE plan_code = $1
       AND network = $2
       AND is_active = TRUE`,
            [planCode, network.toUpperCase()]
        );

        if (planResult.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({
                success: false,
                message: "Data plan not found.",
            });
        }

        const plan = planResult.rows[0];

        // Check wallet
        const walletResult = await client.query(
            `SELECT balance
       FROM wallets
       WHERE user_id = $1
       FOR UPDATE`,
            [req.user.id]
        );

        if (walletResult.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(400).json({
                success: false,
                message: "Wallet not found.",
            });
        }

        const balance = Number(walletResult.rows[0].balance);

        if (balance < Number(plan.amount)) {
            await client.query("ROLLBACK");
            return res.status(400).json({
                success: false,
                message: "Insufficient wallet balance.",
            });
        }

        // Purchase from VTpass
        const providerResult = await dataService.purchaseData({
            network: network.toUpperCase(),
            planCode: plan.plan_code,
            phoneNumber,
            amount: plan.amount,
        });

        if (
            !providerResult.success ||
            providerResult.provider !== "VTPASS"
        ) {
            throw new Error(
                "Data purchase was not confirmed by VTpass."
            );
        }

        // Debit wallet
        await walletService.debitWallet(
            req.user.id,
            plan.amount,
            client
        );

        const reference = `DATA-${Date.now()}`;

        const duration = plan.duration_days || 30;

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + duration);

        // Save purchase
        await client.query(
            `INSERT INTO data_purchases
      (
        user_id,
        network,
        plan_name,
        plan_code,
        phone_number,
        amount,
        duration_days,
        expires_at,
        status,
        provider,
        reference
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
            [
                req.user.id,
                network.toUpperCase(),
                plan.plan_name,
                plan.plan_code,
                phoneNumber,
                plan.amount,
                duration,
                expiresAt,
                "SUCCESS",
                "VTPASS",
                reference,
            ]
        );

        // Save transaction
        await transactionService.createTransaction(
            {
                senderId: req.user.id,
                type: "DATA_PURCHASE",
                amount: plan.amount,
                status: "SUCCESS",
                description: `${plan.plan_name} ${network.toUpperCase()} Data Purchase`,
                reference,
            },
            client
        );

        // Notification
        await notificationService.createNotification(
            {
                userId: req.user.id,
                title: "Data Purchase",
                message: `You successfully purchased ${plan.plan_name} (${network.toUpperCase()}) for ₦${plan.amount}.`,
            },
            client
        );

        // Cashback
        const cashback = await giveCashback(
            req.user.id,
            "DATA",
            plan.amount,
            client
        );

        if (cashback > 0) {
            await client.query(
                `UPDATE wallets
         SET balance = balance + $1
         WHERE user_id = $2`,
                [cashback, req.user.id]
            );

            await transactionService.createTransaction(
                {
                    senderId: req.user.id,
                    type: "CASHBACK",
                    amount: cashback,
                    status: "SUCCESS",
                    description: "Data Cashback Reward",
                    reference: `CB-${Date.now()}`,
                },
                client
            );

            await notificationService.createNotification(
                {
                    userId: req.user.id,
                    title: "Cashback Reward",
                    message: `₦${cashback} cashback has been added to your wallet.`,
                },
                client
            );
        }

        await client.query("COMMIT");

        return res.status(201).json({
            success: true,
            message: "Data purchased successfully.",
            data: {
                network: network.toUpperCase(),
                plan: plan.plan_name,
                amount: plan.amount,
                cashback,
                reference,
                status: "SUCCESS",
            },
        });
    } catch (error) {
        await client.query("ROLLBACK");

        console.error("Data Purchase Error:", error.message);

        if (
            error.message === "Invalid transaction PIN." ||
            error.message ===
            "Transaction PIN has not been set." ||
            error.message === "Insufficient wallet balance."
        ) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message || "Data purchase failed.",
        });
    } finally {
        client.release();
    }
};

// ========================================
// Get Data Plans
// GET /api/data/plans?network=MTN
// ========================================
const getDataPlans = async (req, res) => {
    try {
        const { network } = req.query;

        let query = `
      SELECT
        id,
        network,
        plan_name,
        plan_code,
        amount
      FROM data_plans
      WHERE is_active = TRUE
    `;

        const values = [];

        if (network) {
            query += ` AND UPPER(network)=UPPER($1)`;
            values.push(network);
        }

        query += ` ORDER BY amount ASC`;

        const result = await pool.query(query, values);

        return res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// ========================================
// Get Purchase History
// ========================================
const getDataHistory = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT *
       FROM data_purchases
       WHERE user_id = $1
       ORDER BY created_at DESC`,
            [req.user.id]
        );

        return res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

module.exports = {
    purchaseData,
    getDataPlans,
    getDataHistory,
};