const express = require('express');
const { verifyToken } = require('../middleware/auth');
const userController = require('../controllers/userController');

const router = express.Router();

// Get current user profile
router.get('/me', verifyToken, userController.getProfile);

// Get public user profile
router.get('/:id', userController.getUserPublic);

// Update profile
router.put('/profile', verifyToken, userController.updateProfile);

// Update avatar
router.put('/avatar', verifyToken, userController.updateAvatar);

// Update notifications
router.put('/notifications', verifyToken, userController.updateNotifications);

// Change password
router.post('/change-password', verifyToken, userController.changePassword);

// Deactivate account
router.delete('/deactivate', verifyToken, userController.deactivateAccount);

module.exports = router;
