const { pool } = require("../config/db");

const handleSMEPlugWebhook = async (req, res) => {
    try {
        console.log("========== SMEPLUG WEBHOOK ==========");
        console.log(JSON.stringify(req.body, null, 2));
        console.log("=====================================");

        const transaction = req.body?.transaction;

        if (!transaction) {
            return res.status(400).json({
                success: false,
                message: "Invalid SMEPlug webhook payload.",
            });
        }

        const {
            status,
            reference,
            customer_reference,
        } = transaction;

        console.log("SMEPlug status:", status);
        console.log("SMEPlug reference:", reference);
        console.log(
            "Customer reference:",
            customer_reference
        );

        // We will connect the transaction update
        // to QuickTxn's transactions table next.

        return res.status(200).json({
            success: true,
            message: "Webhook received.",
        });
    } catch (error) {
        console.error(
            "SMEPlug Webhook Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Webhook processing failed.",
        });
    }
};

module.exports = {
    handleSMEPlugWebhook,
};