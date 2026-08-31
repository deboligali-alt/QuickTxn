const notificationService = require("../services/notificationService");
const { pool } = require("../config/db");

// ==================================
// Get All Notifications
// ==================================
const getNotifications = async (req, res) => {
    try {
        const notifications =
            await notificationService.getUserNotifications(req.user.id);

        return res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// ==================================
// Get Unread Notification Count
// ==================================
const getUnreadCount = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT COUNT(*) AS total
             FROM notifications
             WHERE user_id = $1
             AND is_read = FALSE`,
            [req.user.id]
        );

        return res.status(200).json({
            success: true,
            count: Number(result.rows[0].total),
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// ==================================
// Mark One Notification As Read
// ==================================
const markAsRead = async (req, res) => {
    const { id } = req.params;

    try {
        const notification =
            await notificationService.markAsRead(
                id,
                req.user.id
            );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Notification marked as read.",
            data: notification,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// ==================================
// Mark All Notifications As Read
// ==================================
const markAllAsRead = async (req, res) => {
    try {
        await pool.query(
            `UPDATE notifications
             SET is_read = TRUE
             WHERE user_id = $1`,
            [req.user.id]
        );

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read.",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// ==================================
// Delete Notification
// ==================================
const deleteNotification = async (req, res) => {
    const { id } = req.params;

    try {
        const notification =
            await notificationService.deleteNotification(
                id,
                req.user.id
            );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Notification deleted successfully.",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

module.exports = {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
};