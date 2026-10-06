const { pool } = require("../config/db");
const walletService = require("../services/walletService");
const transactionService = require("../services/transactionService");
const notificationService = require("../services/notificationService");
const pinService = require("../services/pinService");
const {
    getDataPlans: fetchSMEPlugPlans,
} = require("../services/smeplug");
const { giveCashback } = require("../services/cashbackService");
const {
    isAllowedQuickTxnPlan,
} = require("../utils/dataPlanPolicy");
const {
    purchaseDataVTU,
} = require("../services/vtuService");


// ========================================
// PURCHASE DATA - SMEPLUG
// ========================================
const purchaseData = async (req, res) => {
    const {
        network,
        planId,
        phoneNumber,
        pin,


    } = req.body;

    // ======================================
    // VALIDATE INPUT
    // ======================================
    if (
        !network ||
        !planId ||
        !phoneNumber ||
        !pin
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Network, plan ID, phone number and transaction PIN are required.",
        });
    }

    const normalizedNetwork =
        String(network).toUpperCase();

    const networkMap = {
        MTN: "1",
        AIRTEL: "2",
        "9MOBILE": "3",
        GLO: "4",
    };

    const networkId =
        networkMap[normalizedNetwork];

    if (!networkId) {
        return res.status(400).json({
            success: false,
            message:
                `Unsupported network: ${network}`,
        });
    }

    const client = await pool.connect();

    let reference = null;
    let amount = 0;
    let plan = null;

    try {

        // ======================================
        // VERIFY PIN
        // ======================================
        await client.query("BEGIN");

        await pinService.verifyPin(
            req.user.id,
            pin,
            client
        );

        // ======================================
        // GET LIVE SMEPLUG PLANS
        // ======================================
        const smeplugResponse =
            await fetchSMEPlugPlans();

        if (
            !smeplugResponse?.status ||
            !smeplugResponse.data
        ) {
            await client.query("ROLLBACK");

            return res.status(502).json({
                success: false,
                message:
                    "Unable to retrieve SMEPlug data plans.",
            });
        }

        const plans =
            smeplugResponse.data[
            networkId
            ] || [];

        // ======================================
        // FIND SELECTED PLAN
        // ======================================
        plan = plans.find(
            (item) =>
                String(item.id) === String(planId) &&
                isAllowedQuickTxnPlan(item)
        );

        if (!plan) {
            await client.query("ROLLBACK");

            return res.status(404).json({
                success: false,
                message:
                    "Selected data plan is no longer available.",
            });
        }

        // ======================================
        // VALIDATE PLAN PRICE
        // ======================================
        amount = Number(plan.price);

        if (
            !Number.isFinite(amount) ||
            amount <= 0
        ) {
            await client.query("ROLLBACK");

            return res.status(400).json({
                success: false,
                message:
                    "This data plan is currently unavailable for purchase.",
            });
        }

        // ======================================
        // LOCK USER WALLET
        // ======================================
        const walletResult =
            await client.query(
                `SELECT balance
                 FROM wallets
                 WHERE user_id = $1
                 FOR UPDATE`,
                [req.user.id]
            );

        if (
            walletResult.rows.length === 0
        ) {
            await client.query("ROLLBACK");

            return res.status(404).json({
                success: false,
                message:
                    "Wallet not found.",
            });
        }

        const balance =
            Number(
                walletResult.rows[0].balance
            );

        if (balance < amount) {
            await client.query("ROLLBACK");

            return res.status(400).json({
                success: false,
                message:
                    "Insufficient wallet balance.",
            });
        }

        // ======================================
        // GENERATE QUICKTXN REFERENCE
        // ======================================
        reference =
            `DATA-${Date.now()}-${Math.floor(
                Math.random() * 1000
            )}`;

        // ======================================
        // DEBIT WALLET
        // ======================================
        await walletService.debitWallet(
            req.user.id,
            amount,
            client
        );

        // ======================================
        // CREATE PENDING TRANSACTION
        // ======================================
        await client.query(
            `INSERT INTO transactions
            (
                receiver_id,
                type,
                amount,
                description,
                status,
                reference,
                payment_provider
            )
            VALUES
            ($1,$2,$3,$4,$5,$6,$7)`,
            [
                req.user.id,
                "DATA",
                amount,
                `${plan.name} ${normalizedNetwork} Data Purchase`,
                "PENDING",
                reference,
                "SMEPLUG",
            ]
        );

        // ======================================
        // CREATE PENDING DATA PURCHASE
        // ======================================
        await client.query(
            `INSERT INTO data_purchases
            (
                user_id,
                network,
                phone_number,
                plan_name,
                amount,
                status,
                reference,
                provider,
                plan_code,
                duration_days,
                expires_at
            )
            VALUES
            ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
            [
                req.user.id,
                normalizedNetwork,
                phoneNumber,
                plan.name,
                amount,
                "PENDING",
                reference,
                "SMEPLUG",
                String(plan.id),
                null,
                null,
            ]
        );

        // ======================================
        // COMMIT WALLET DEBIT + PENDING RECORD
        // ======================================
        await client.query("COMMIT");

    } catch (error) {

        try {
            await client.query("ROLLBACK");
        } catch (rollbackError) {
            console.error(
                "DATA PURCHASE ROLLBACK ERROR:",
                rollbackError
            );
        }

        console.error(
            "DATA PURCHASE PREPARATION ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Unable to prepare data purchase.",
        });

    } finally {
        client.release();
    }

    // ======================================
    // SEND PURCHASE TO SMEPLUG
    // ======================================
    let provider;

    try {

        provider =
            await purchaseDataVTU({
                network: normalizedNetwork,
                planId: plan.id,
                phone: phoneNumber,
                reference,
            });

    } catch (error) {

        console.error(
            "DATA PROVIDER CALL ERROR:",
            error
        );

        provider = {
            success: false,
            uncertain: true,
            message:
                "Unable to confirm SMEPlug data transaction status.",
        };
    }

    // ======================================
    // PROVIDER DEFINITIVELY REJECTED
    // ======================================
    if (
        !provider.success &&
        provider.uncertain === false
    ) {

        const refundClient =
            await pool.connect();

        try {

            await refundClient.query(
                "BEGIN"
            );

            await refundClient.query(
                `UPDATE wallets
                 SET balance = balance + $1,
                     updated_at = NOW()
                 WHERE user_id = $2`,
                [
                    amount,
                    req.user.id,
                ]
            );

            await refundClient.query(
                `UPDATE transactions
                 SET status = 'FAILED'
                 WHERE reference = $1`,
                [reference]
            );

            await refundClient.query(
                `UPDATE data_purchases
                 SET status = 'FAILED'
                 WHERE reference = $1`,
                [reference]
            );

            await refundClient.query(
                `INSERT INTO notifications
                (
                    user_id,
                    title,
                    message
                )
                VALUES ($1,$2,$3)`,
                [
                    req.user.id,
                    "Data Purchase Failed",
                    `Your ₦${amount.toLocaleString()} ${plan.name} purchase failed. Your wallet has been refunded.`,
                ]
            );

            await refundClient.query(
                "COMMIT"
            );

        } catch (refundError) {

            await refundClient.query(
                "ROLLBACK"
            );

            console.error(
                "DATA PURCHASE REFUND ERROR:",
                refundError
            );

        } finally {
            refundClient.release();
        }

        return res.status(400).json({
            success: false,
            message:
                provider.message ||
                "Data purchase failed.",
            reference,
        });
    }

    // ======================================
    // SMEPLUG ACCEPTED / STATUS UNCERTAIN
    // ======================================
    return res.status(200).json({
        success: true,
        message:
            "Data purchase request received and is being processed.",
        data: {
            network: normalizedNetwork,
            planId: String(plan.id),
            plan: plan.name,
            amount,
            phoneNumber,
            reference,
            providerReference:
                provider.providerReference ||
                null,
            status: "PENDING",
        },
    });
};

// ========================================
// GET SMEPLUG DATA PLANS
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

        const networkMap = {
            MTN: "1",
            AIRTEL: "2",
            "9MOBILE": "3",
            GLO: "4",
        };

        const normalizedNetwork =
            network.toUpperCase();

        const networkId =
            networkMap[normalizedNetwork];

        if (!networkId) {
            return res.status(400).json({
                success: false,
                message: `Unsupported network: ${network}`,
            });
        }

        const response =
            await fetchSMEPlugPlans();

        if (!response?.status) {
            return res.status(502).json({
                success: false,
                message:
                    "Unable to retrieve SMEPlug data plans.",
            });
        }

        const plans =
            response.data?.[networkId] || [];

        const allowedPlans = plans.filter(
            isAllowedQuickTxnPlan
        );

        return res.json({
            success: true,
            network: normalizedNetwork,
            networkId,
            count: allowedPlans.length,
            data: allowedPlans,
        });

    } catch (error) {
        console.error(
            "SMEPLUG DATA PLANS ERROR:",
            error.response?.data ||
            error.message
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to fetch SMEPlug data plans.",
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