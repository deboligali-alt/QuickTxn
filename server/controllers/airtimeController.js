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
// PURCHASE AIRTIME (LIVE SMEPLUG)
// ====================================
const purchaseAirtime = async (req, res) => {
    const client = await pool.connect();

    try {
        console.log("REQUEST BODY:", req.body);

        const {
            network,
            phone,
            amount,
            pin,
        } = req.body;
        
        const numericAmount = Number(amount);
        console.log("PHONE:", phone);

        // ====================================
        // VALIDATION
        // ====================================
        if (!network || !phone || !amount || !pin) {
            return res.status(400).json({
                success: false,
                message:
                    "Network, phone number, amount and PIN are required.",
            });
        }

        if (
            !Number.isFinite(numericAmount) ||
            numericAmount <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid airtime amount.",
            });
        }

        // ====================================
        // START TRANSACTION
        // ====================================
        await client.query("BEGIN");

        // ====================================
        // VERIFY TRANSACTION PIN
        // ====================================
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

        // ====================================
        // LOCK WALLET
        // ====================================
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

        const balance = Number(
            walletResult.rows[0].balance
        );

        // ====================================
        // CHECK BALANCE
        // ====================================
        if (balance < numericAmount) {
            await client.query("ROLLBACK");

            return res.status(400).json({
                success: false,
                message: "Insufficient wallet balance.",
            });
        }

        // ====================================
        // CREATE QUICKTXN REFERENCE
        // ====================================
        const reference = `AIR-${Date.now()}-${req.user.id}`;

        // ====================================
        // RESERVE / DEDUCT WALLET
        // ====================================
        const newBalance =
            balance - numericAmount;

        await client.query(
            `UPDATE wallets
             SET balance = $1,
                 updated_at = NOW()
             WHERE user_id = $2`,
            [
                newBalance,
                req.user.id,
            ]
        );

        // ====================================
        // CREATE PENDING TRANSACTION
        // ====================================
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
                numericAmount,
                "PENDING",
                reference,
                `${network.toUpperCase()} Airtime - ${phone}`,
            ]
        );

        // ====================================
        // COMMIT WALLET RESERVATION
        // ====================================
        await client.query("COMMIT");

        // ====================================
        // CALL SMEPLUG
        // ====================================
        const provider = await purchaseAirtimeVTU({
            network,
            phone,
            amount: numericAmount,
            reference,
        });

        console.log(
            "======= SMEPlug Airtime ======="
        );
        console.log(provider);
        console.log(
            "==============================="
        );

        // ======================================
        // PROVIDER RESPONSE
        // ======================================

        if (!provider.success) {

            // ======================================
            // UNKNOWN / UNCERTAIN PROVIDER STATUS
            // ======================================
            if (provider.uncertain) {
                console.warn(
                    "SMEPlug status uncertain. Transaction remains PENDING:",
                    reference
                );

                return res.status(202).json({
                    success: true,
                    message:
                        "Airtime purchase is still being verified.",
                    data: {
                        network:
                            network.toUpperCase(),
                        phone,
                        amount: numericAmount,
                        reference,
                        status: "PENDING",
                        balance: newBalance,
                    },
                });
            }

            // ======================================
            // DEFINITIVE PROVIDER FAILURE
            // ======================================

            const refundClient =
                await pool.connect();

            try {
                await refundClient.query("BEGIN");

                const transactionResult =
                    await refundClient.query(
                        `SELECT id, status
                 FROM transactions
                 WHERE reference = $1
                 FOR UPDATE`,
                        [reference]
                    );

                if (
                    transactionResult.rows.length > 0 &&
                    transactionResult.rows[0].status ===
                    "PENDING"
                ) {
                    // Refund wallet
                    await refundClient.query(
                        `UPDATE wallets
                 SET balance = balance + $1,
                     updated_at = NOW()
                 WHERE user_id = $2`,
                        [
                            numericAmount,
                            req.user.id,
                        ]
                    );

                    // Mark failed
                    await refundClient.query(
                        `UPDATE transactions
                 SET status = 'FAILED'
                 WHERE reference = $1`,
                        [reference]
                    );

                    // Notification
                    await refundClient.query(
                        `INSERT INTO notifications
                (user_id, title, message)
                VALUES ($1, $2, $3)`,
                        [
                            req.user.id,
                            "Airtime Purchase Failed",
                            `Your ₦${numericAmount.toLocaleString()} ${network.toUpperCase()} airtime purchase failed. Your wallet has been refunded.`,
                        ]
                    );
                }

                await refundClient.query("COMMIT");

            } catch (refundError) {

                await refundClient.query("ROLLBACK");

                console.error(
                    "AIRTIME REFUND ERROR:",
                    refundError
                );

            } finally {
                refundClient.release();
            }

            return res.status(400).json({
                success: false,
                message:
                    provider.message ||
                    "Airtime purchase failed.",
                reference,
            });
        }

        // ====================================
        // SMEPLUG ACCEPTED REQUEST
        // WAIT FOR WEBHOOK
        // ====================================
        return res.status(200).json({
            success: true,
            message:
                "Airtime purchase is being processed.",
            data: {
                network:
                    network.toUpperCase(),
                phone,
                amount: numericAmount,
                reference,
                provider:
                    "SMEPLUG",
                providerReference:
                    provider.providerReference ||
                    null,
                status: "PENDING",
                balance: newBalance,
            },
        });
    } catch (error) {
        try {
            await client.query("ROLLBACK");
        } catch (rollbackError) {
            console.error(
                "ROLLBACK ERROR:",
                rollbackError
            );
        }

        console.error(
            "Airtime Purchase Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Airtime purchase failed.",
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