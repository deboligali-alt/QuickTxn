const { pool } = require("../config/db");
const notificationService = require("../services/notificationService");

const sendDataReminders = async () => {
    const client = await pool.connect();

    try {
        const result = await client.query(`
      SELECT *
      FROM data_purchases
      WHERE reminder_sent = FALSE
      AND expires_at <= NOW()
      AND status = 'SUCCESS'
    `);

        for (const plan of result.rows) {
            await notificationService.createNotification({
                userId: plan.user_id,
                title: "Data Plan Expired",
                message: `Your ${plan.plan_name} ${plan.network} data bundle has likely expired. Renew now to stay connected.`,
            });

            await client.query(
                `UPDATE data_purchases
         SET reminder_sent = TRUE
         WHERE id = $1`,
                [plan.id]
            );
        }
    } catch (err) {
        console.error(err);
    } finally {
        client.release();
    }
};

module.exports = sendDataReminders;