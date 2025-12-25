'use strict';
const { Notification } = require('../models');

/**
 * Logic to create a notification for a user
 */
const createNotification = async (user_id, message) => {
    return await Notification.create({
        user_id: user_id,
        message: message,
        // Match the exact ENUM casing (usually lowercase 'unread' or 'waiting')
        status: 'unread', 
        created_at: new Date()
    });
};
/**
 * Logic to get all notifications for a specific user
 */
const getUserNotifications = async (user_id) => {
    return await Notification.findAll({
        where: { user_id },
        order: [['created_at', 'DESC']]
    });
};

/**
 * Logic to mark a notification as read
 */
const markAsRead = async (notification_id) => {
    return await Notification.update(
        { status: 'Read' },
        { where: { id: notification_id } }
    );
};

module.exports = {
    createNotification,
    getUserNotifications,
    markAsRead
};