'use strict';
const express = require('express');
const router = express.Router(); // This line was missing!
const notificationController = require('../controllers/notificationController');

// Get notifications for a specific user
router.get('/:userId', notificationController.getNotifications);

// Mark a specific notification as read
router.put('/read/:id', notificationController.updateStatus);

module.exports = router;