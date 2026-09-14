const { pool } = require("../config/db");
const walletService = require("../services/walletService");
const transactionService = require("../services/transactionService");
const notificationService = require("../services/notificationService");
const pinService = require("../services/pinService");
const {
    getProducts,
    purchaseWaecPin,
} = require("../services/waecService");

const getWaecProducts = async (req, res) => {
    const products = await getProducts();

    res.json({
        success: true,
        data: products,
    });
};

const purchaseWaec = async (req, res) => {
    const { productCode, amount, pin } = req.body;

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        await pinService.verifyPin(req.user.id, pin, client);

        await walletService.debitWallet(
            req.user.id,
            amount,
            client
        );

        const reference = `WAEC-${Date.now()}`;

        const result = await purchaseWaecPin({
            productCode,
            amount,
            reference,
        });

        await client.query(
            `INSERT INTO waec_purchases
      (
        user_id,
        product_code,
        pin,
        serial,
        amount,
        reference
      )
      VALUES($1,$2,$3,$4,$5,$6)`,
            [
                req.user.id,
                productCode,
                result.pin,
                result.serial,
                amount,
                reference,
            ]
        );

        await transactionService.createTransaction(
            {
                senderId: req.user.id,
                type: "WAEC",
                amount,
                status: "SUCCESS",
                description: "WAEC ePIN Purchase",
                reference,
            },
            client
        );

        await notificationService.createNotification(
            {
                userId: req.user.id,
                title: "WAEC PIN",
                message: "Your WAEC ePIN has been generated.",
            },
            client
        );

        await client.query("COMMIT");

        return res.json({
            success: true,
            message: "WAEC PIN purchased successfully.",
            data: result,
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

const getHistory = async (req, res) => {
    const result = await pool.query(
        `SELECT *
     FROM waec_purchases
     WHERE user_id=$1
     ORDER BY created_at DESC`,
        [req.user.id]
    );

    res.json({
        success: true,
        data: result.rows,
    });
};

module.exports = {
    getWaecProducts,
    purchaseWaec,
    getHistory,
};