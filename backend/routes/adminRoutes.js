const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/analytics', adminController.getAnalytics);
router.delete('/tickets/:service_id', adminController.deleteServiceTickets);
router.delete('/services/:service_id/tickets/:ticket_id', adminController.deleteTicket);

module.exports = router;