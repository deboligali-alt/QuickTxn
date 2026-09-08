const { pool } = require("../config/db");

const clubkonnectWebhook = async (req, res) => {
    try {
        const {
            orderid,
            requestid,
            statuscode,
            orderstatus,
            orderremark,
        } = req.query;

        if (!requestid && !orderid) {
            return res.status(400).send("Invalid callback");
        }

        const status =
            statuscode === "200" ? "success" : "failed";

        await pool.query(
            `UPDATE transactions
       SET status = $1,
           provider_reference = $2,
           provider_message = $3,
           updated_at = NOW()
       WHERE reference = $4`,
            [
                status,
                orderid,
                orderremark,
                requestid,
            ]
        );

        return res.status(200).send("OK");

    } catch (error) {
        console.error(error);
        return res.status(500).send("Webhook Error");
    }
};

module.exports = {
    clubkonnectWebhook,
};