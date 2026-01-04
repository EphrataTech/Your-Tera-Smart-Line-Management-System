'use strict';
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.post('/create', notificationController.sendNotification);
router.get('/:userId', notificationController.getNotifications);
router.put('/status/:id', notificationController.updateStatus);

module.exports = router;