const { pool } = require("../config/db");
const walletService = require("../services/walletService");
const transactionService = require("../services/transactionService");
const notificationService = require("../services/notificationService");
const pinService = require("../services/pinService");
const { purchaseDataVTU, getDataPlansVTU } = require("../services/vtuService");
const { giveCashback } = require("../services/cashbackService");

// ========================================
// PURCHASE DATA
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

        // Fetch plan from DB
        const planResult = await client.query(
            `SELECT *
             FROM data_plans
             WHERE plan_code=$1
             AND network=$2
             AND is_active=TRUE`,
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

        // Lock wallet
        const walletResult = await client.query(
            `SELECT balance
             FROM wallets
             WHERE user_id=$1
             FOR UPDATE`,
            [req.user.id]
        );

        const balance = Number(walletResult.rows[0].balance);

        if (balance < Number(plan.amount)) {
            await client.query("ROLLBACK");
            return res.status(400).json({
                success: false,
                message: "Insufficient wallet balance.",
            });
        }

        const reference = `DATA-${Date.now()}`;

        // Live VTU Provider
        const provider = await purchaseDataVTU({
            network,
            planCode,
            phone: phoneNumber,
            amount: plan.amount,
            reference,
        });

        if (!provider.success) {
            throw new Error(provider.message);
        }

        // Debit wallet
        await walletService.debitWallet(
            req.user.id,
            plan.amount,
            client
        );

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
                provider.provider,
                reference,
            ]
        );

        // Transaction
        await transactionService.createTransaction(
            {
                senderId: req.user.id,
                type: "DATA",
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
                message: `You purchased ${plan.plan_name} (${network.toUpperCase()}) successfully.`,
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
        }

        await client.query("COMMIT");

        return res.json({
            success: true,
            message: "Data purchased successfully.",
            data: {
                network,
                plan: plan.plan_name,
                amount: plan.amount,
                cashback,
                reference,
                balance: balance - Number(plan.amount) + cashback,
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

// ========================================
// GET LIVE DATA PLANS
// ========================================
const getDataPlans = async (req, res) => {
    try {
        const { network } = req.query;

        if (!network) {
            return res.status(400).json({
                success: false,
                message: "Network is required.",
            });
        }

        const plans = await getDataPlansVTU(network);

        return res.json({
            success: true,
            data: plans,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to fetch data plans.",
        });
    }
};

// ========================================
// PURCHASE HISTORY
// ========================================
const getDataHistory = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT *
             FROM data_purchases
             WHERE user_id=$1
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

module.exports = {
    purchaseData,
    getDataPlans,
    getDataHistory,
};