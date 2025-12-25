const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');


router.get('/office/:officeId', authMiddleware, serviceController.getServiceByOffice);

router.post('/add', authMiddleware, roleMiddleware('Admin'), serviceController.createService);


module.exports = router;