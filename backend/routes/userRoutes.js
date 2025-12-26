'use strict';
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const verifyToken = require('../middlewares/authMiddleware');

// 1. Static/Specific routes first
router.get('/all', authMiddleware, roleMiddleware('Admin'), userController.getAllUsers);
router.get('/profile', authMiddleware, userController.getProfile); 
// 2. Dynamic parameter routes last
router.get('/:id', userController.getUserProfile);               

router.patch('/update', verifyToken, userController.updateProfile);
module.exports = router;