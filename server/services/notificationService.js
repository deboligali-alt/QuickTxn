const { pool } = require("../config/db");

// ========================================
// Create Notification
// ========================================
const createNotification = async ({
    userId,
    title,
    message
}, client = pool) => {

    const result = await client.query(
        `INSERT INTO notifications
        (
            user_id,
            title,
            message
        )
        VALUES
        ($1,$2,$3)
        RETURNING *`,
        [
            userId,
            title,
            message
        ]
    );

    return result.rows[0];
};

// ========================================
// Get User Notifications
// ========================================
const getUserNotifications = async (
    userId,
    client = pool
) => {

    const result = await client.query(
        `SELECT
            id,
            title,
            message,
            is_read,
            created_at
         FROM notifications
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId]
    );

    return result.rows;
};

// ========================================
// Mark Notification As Read
// ========================================
const markAsRead = async (
    notificationId,
    userId,
    client = pool
) => {

    const result = await client.query(
        `UPDATE notifications
         SET is_read = TRUE
         WHERE id = $1
         AND user_id = $2
         RETURNING *`,
        [
            notificationId,
            userId
        ]
    );

    return result.rows[0];
};

// ========================================
// Delete Notification
// ========================================
const deleteNotification = async (
    notificationId,
    userId,
    client = pool
) => {
    const result = await client.query(
        `DELETE FROM notifications
         WHERE id = $1
         AND user_id = $2
         RETURNING *`,
        [
            notificationId,
            userId
        ]
    );

    console.log("Delete notification:", {
        notificationId,
        userId,
        deleted: result.rows[0] || null
    });

    return result.rows[0];
};

module.exports = {
    createNotification,
    getUserNotifications,
    markAsRead,
    deleteNotification
};