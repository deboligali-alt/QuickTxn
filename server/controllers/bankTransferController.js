const { pool } = require("../config/db");

const pinService = require("../services/pinService");
const walletService = require("../services/walletService");
const transactionService = require("../services/transactionService");
const notificationService = require("../services/notificationService");

const paystackTransfer = require("../services/paystackTransferService");

// ==========================================
// Get Banks
// ==========================================
const getBanks = async (req, res) => {
    try {
        const banks = await paystackTransfer.getBanks();

        return res.status(200).json({
            success: true,
            data: banks,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to fetch banks",
        });
    }
};

// ==========================================
// Resolve Account
// ==========================================
const resolveAccount = async (req, res) => {
    const { accountNumber, bankCode } = req.body;

    if (!accountNumber || !bankCode) {
        return res.status(400).json({
            success: false,
            message: "Account number and bank code are required",
        });
    }

    try {
        const account = await paystackTransfer.resolveAccount(
            accountNumber,
            bankCode
        );

        return res.json({
            success: true,
            data: account,
        });
    } catch {
        return res.status(400).json({
            success: false,
            message: "Invalid account details",
        });
    }
};

// ==========================================
// Transfer Money
// ==========================================
const transferMoney = async (req, res) => {
    const client = await pool.connect();

    try {
        const {
            accountName,
            accountNumber,
            bankCode,
            bankName,
            amount,
            pin,
        } = req.body;

        if (
            !accountName ||
            !accountNumber ||
            !bankCode ||
            !bankName ||
            !amount ||
            !pin
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        await client.query("BEGIN");

        // Verify PIN
        await pinService.verifyPin(req.user.id, pin, client);

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
            throw new Error("Insufficient wallet balance.");
        }

        // Create recipient
        const recipient = await paystackTransfer.createRecipient({
            accountName,
            accountNumber,
            bankCode,
        });

        const reference = `TRF-${Date.now()}`;

        // Initiate Paystack transfer
        const transfer = await paystackTransfer.initiateTransfer({
            amount,
            recipientCode: recipient.recipient_code,
            reference,
            reason: "QuickTxn Bank Transfer",
        });

        // Debit wallet
        await walletService.debitWallet(req.user.id, amount, client);

        // Save transfer
        await client.query(
            `INSERT INTO bank_transfers
      (
        user_id,
        account_name,
        account_number,
        bank_code,
        bank_name,
        amount,
        reference,
        provider_reference,
        status
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
            [
                req.user.id,
                accountName,
                accountNumber,
                bankCode,
                bankName,
                amount,
                reference,
                transfer.transfer_code,
                "SUCCESS",
            ]
        );

        // Save transaction
        await transactionService.createTransaction(
            {
                senderId: req.user.id,
                type: "BANK_TRANSFER",
                amount,
                status: "SUCCESS",
                description: `Transfer to ${accountName}`,
                reference,
            },
            client
        );

        // Notification
        await notificationService.createNotification(
            {
                userId: req.user.id,
                title: "Bank Transfer",
                message: `₦${amount} sent to ${accountName}`,
            },
            client
        );

        await client.query("COMMIT");

        // Real-time update
        const io = req.app.get("io");
        io.to(String(req.user.id)).emit("wallet_updated");
        io.to(String(req.user.id)).emit("new_transaction");
        io.to(String(req.user.id)).emit("notification");

        return res.status(201).json({
            success: true,
            message: "Transfer successful",
            data: {
                reference,
                transferCode: transfer.transfer_code,
            },
        });
    } catch (error) {
        await client.query("ROLLBACK");

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    } finally {
        client.release();
    }
};

// ==========================================
// Transfer History
// ==========================================
const getTransferHistory = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT *
       FROM bank_transfers
       WHERE user_id = $1
       ORDER BY created_at DESC`,
            [req.user.id]
        );

        return res.json({
            success: true,
            data: result.rows,
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

module.exports = {
    getBanks,
    resolveAccount,
    transferMoney,
    getTransferHistory,
};