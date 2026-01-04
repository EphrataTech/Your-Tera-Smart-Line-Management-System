
'use strict';
const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const authMiddleware = require('../middlewares/authMiddleware');

// --- Public Routes (Anyone can see these) ---

// 1. List all active services
router.get('/', serviceController.listServices);

// 2. Get details for one specific service
router.get('/:id', serviceController.getServiceById);


// --- Admin Protected Routes (Require Token + Admin Role) ---

// 3. Add a new service
router.post('/add', authMiddleware, serviceController.addService);

// 4. Update an existing service
router.put('/:id', authMiddleware, serviceController.updateService);

// 5. Delete a service
router.delete('/:id', authMiddleware, serviceController.deleteService);

const roleMiddleware = require('../middlewares/roleMiddleware');


router.get('/office/:officeId', verifyToken, serviceController.getServiceByOffice);
router.post('/add', verifyToken, roleMiddleware('Admin'), serviceController.createService);



module.exports = router;