'use strict';
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Only Admins/Staff should be able to call the next customer
router.patch('/next', authMiddleware, roleMiddleware('Admin'), adminController.callNext);
router.patch('/complete/:id', authMiddleware, roleMiddleware('Admin'), adminController.completeTicket);

module.exports = router;