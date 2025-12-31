'use strict';
const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Anyone logged in can see the list of services
router.get('/', authMiddleware, serviceController.listServices);

// Only Admins can add new services
// Changed serviceController.addOffice to serviceController.addService
router.post('/add', authMiddleware, roleMiddleware('Admin'), serviceController.addService);

module.exports = router;