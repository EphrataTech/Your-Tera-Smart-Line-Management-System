const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queueController');


// Match the 'join' name from your controller


// Add the status update route for the staff side
router.patch('/status/:ticketId', queueController.updateStatus);

const { verifyToken } = require('../middlewares/authMiddleware'); // Must have curly braces = require('../middlewares/authMiddleware');

router.post('/join', verifyToken, queueController.joinQueue);
router.get('/office/:serviceId', verifyToken, queueController.getOfficeQueue);
router.get('/my-status', verifyToken, queueController.getMyStatus);
router.patch('/cancel/:ticketId', verifyToken, queueController.cancelMyTicket);


module.exports = router;