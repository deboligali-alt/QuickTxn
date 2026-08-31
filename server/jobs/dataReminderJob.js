const { pool } = require("../config/db");

const sendDataReminders = async () => {
    try {
        const result = await pool.query(`
            SELECT id, user_id, plan_name, expires_at
            FROM data_purchases
            WHERE status = 'SUCCESS'
              AND reminder_sent = FALSE
              AND expires_at <= NOW() + INTERVAL '24 HOURS'
        `);

        for (const plan of result.rows) {
            await pool.query(
                `INSERT INTO notifications
                (user_id, title, message)
                VALUES ($1,$2,$3)`,
                [
                    plan.user_id,
                    "Data Expiry Reminder",
                    `Your ${plan.plan_name} data plan will expire within 24 hours.`,
                ]
            );

            await pool.query(
                `UPDATE data_purchases
                 SET reminder_sent = TRUE
                 WHERE id = $1`,
                [plan.id]
            );
        }

        console.log(`Sent ${result.rows.length} reminders`);
    } catch (err) {
        console.error("Reminder Job Error:", err.message);
    }
};

module.exports = sendDataReminders;