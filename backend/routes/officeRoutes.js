const express = require('express');
const router = express.Router();
const officeController = require('../controllers/officeController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');


router.get('/', authMiddleware, officeController.getOffice);


router.post('/add',
    authMiddleware, 
    roleMiddleware('Admin'),
    officeController.addOffice
);

module.exports = router;