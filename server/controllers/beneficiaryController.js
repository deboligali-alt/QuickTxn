const axios = require("axios");
const { pool } = require("../config/db");

// ===============================
// Add Beneficiary
// ===============================
const addBeneficiary = async (req, res) => {
    const {
        accountName,
        accountNumber,
        bankName,
        bankCode
    } = req.body;

    if (!accountName || !accountNumber || !bankName || !bankCode) {
        return res.status(400).json({
            success: false,
            message: "All fields are required."
        });
    }

    try {

        // Check if beneficiary already exists
        const existing = await pool.query(
            `SELECT id
             FROM beneficiaries
             WHERE user_id = $1
             AND account_number = $2
             AND bank_code = $3`,
            [req.user.id, accountNumber, bankCode]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Beneficiary already exists."
            });
        }

        // Create Paystack Transfer Recipient
        const paystackRecipient = await axios.post(
            "https://api.paystack.co/transferrecipient",
            {
                type: "nuban",
                name: accountName,
                account_number: accountNumber,
                bank_code: bankCode,
                currency: "NGN"
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const recipientCode =
            paystackRecipient.data.data.recipient_code;

        // Save Beneficiary
        // Save Beneficiary
        const result = await pool.query(
            `INSERT INTO beneficiaries
    (
        user_id,
        account_name,
        account_number,
        bank_name,
        bank_code,
        recipient_code
    )
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING *`,
            [
                req.user.id,
                accountName,
                accountNumber,
                bankName,
                bankCode,
                recipientCode
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
                "Beneficiary Added",
                `${accountName} has been added to your saved beneficiaries.`
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Beneficiary added successfully.",
            data: result.rows[0]
        });

    } catch (error) {

        console.error(
            error.response?.data || error.message
        );

        return res.status(500).json({
            success: false,
            message: "Unable to add beneficiary.",
            error: error.response?.data || error.message
        });

    }
};

// ===============================
// Get All Beneficiaries
// ===============================
const getBeneficiaries = async (req, res) => {
    try {

        const result = await pool.query(
            `SELECT
                id,
                account_name,
                account_number,
                bank_name,
                bank_code,
                created_at
             FROM beneficiaries
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

// ===============================
// Delete Beneficiary
// ===============================
const deleteBeneficiary = async (req, res) => {
    const { id } = req.params;

    try {

        const result = await pool.query(
            `DELETE FROM beneficiaries
             WHERE id = $1
             AND user_id = $2
             RETURNING *`,
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Beneficiary not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Beneficiary deleted successfully."
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};

// ========================================
// Transfer Using Saved Beneficiary
// ========================================
const transferToBeneficiary = async (req, res) => {
    const { beneficiaryId, amount, pin } = req.body;

    if (!beneficiaryId || !amount || !pin) {
        return res.status(400).json({
            success: false,
            message: "Beneficiary, amount and PIN are required."
        });
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Verify PIN
        const user = await client.query(
            `SELECT transaction_pin
             FROM users
             WHERE id = $1`,
            [req.user.id]
        );

        const bcrypt = require("bcryptjs");

        const validPin = await bcrypt.compare(
            pin,
            user.rows[0].transaction_pin
        );

        if (!validPin) {
            await client.query("ROLLBACK");
            return res.status(400).json({
                success: false,
                message: "Invalid transaction PIN."
            });
        }

        // Get beneficiary
        const beneficiary = await client.query(
            `SELECT *
             FROM beneficiaries
             WHERE id = $1
             AND user_id = $2`,
            [beneficiaryId, req.user.id]
        );

        if (beneficiary.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({
                success: false,
                message: "Beneficiary not found."
            });
        }

        // Check wallet
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
                message: "Insufficient balance."
            });
        }

        // Paystack transfer
        const paystack = await axios.post(
            "https://api.paystack.co/transfer",
            {
                source: "balance",
                amount: Math.round(Number(amount) * 100),
                recipient: beneficiary.rows[0].recipient_code,
                reason: "QuickTxn Beneficiary Transfer"
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

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
                payment_provider,
                payment_reference
            )
            VALUES
            ($1,'DEBIT',$2,$3,'SUCCESS',$4,'PAYSTACK',$5)`,
            [
                req.user.id,
                amount,
                `Transfer to ${beneficiary.rows[0].account_name}`,
                `TRF-${Date.now()}`,
                paystack.data.data.reference
            ]
        );

        // Notification
        await client.query(
            `INSERT INTO notifications
            (user_id,title,message)
            VALUES ($1,$2,$3)`,
            [
                req.user.id,
                "Transfer Successful",
                `₦${Number(amount).toLocaleString()} sent to ${beneficiary.rows[0].account_name}`
            ]
        );

        await client.query("COMMIT");

        return res.status(200).json({
            success: true,
            message: "Transfer completed successfully."
        });

    } catch (error) {
        await client.query("ROLLBACK");

        console.error(error.response?.data || error);

        return res.status(500).json({
            success: false,
            message: "Transfer failed."
        });

    } finally {
        client.release();
    }
};

module.exports = {
    addBeneficiary,
    getBeneficiaries,
    deleteBeneficiary,
    transferToBeneficiary
};