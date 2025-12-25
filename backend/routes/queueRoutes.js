const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queueController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/join', authMiddleware, queueController.joinQueue);
router.get('/office/:serviceId', authMiddleware, queueController.getOfficeQueue);
router.patch('/status/:ticketId', authMiddleware, queueController.updateTicketStatus);
module.exports = router;