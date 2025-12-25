const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Ensure this function name matches the one exported in the controller
router.get('/analytics', adminController.getAnalytics);

module.exports = router;