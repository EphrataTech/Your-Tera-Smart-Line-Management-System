'use strict';
const notificationService = require('../services/notificationService');

const getNotifications = async (req, res) => {
    try {
        const notifications = await notificationService.getUserNotifications(req.params.userId);
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateStatus = async (req, res) => {
    try {
        await notificationService.markAsRead(req.params.id);
        res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getNotifications,
    updateStatus
};