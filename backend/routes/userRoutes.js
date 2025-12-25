const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/profile', authMiddleware, userController.getProfile);

router.get('/all', authMiddleware, roleMiddleware('Admin'), userController.getAllUsers);

module.exports = router;