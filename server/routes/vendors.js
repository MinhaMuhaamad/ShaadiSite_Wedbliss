const express = require('express');
const { verifyToken } = require('../middleware/auth');
const vendorController = require('../controllers/vendorController');

const router = express.Router();

// Public vendor routes
router.get('/', vendorController.getAllVendors);
router.get('/:id', vendorController.getVendor);
router.get('/:id/reviews', vendorController.getVendorReviews);

// Vendor registration and management (authenticated)
router.post('/', verifyToken, vendorController.registerVendor);
router.put('/:id', verifyToken, vendorController.updateVendor);
router.put('/:id/availability', verifyToken, vendorController.updateAvailability);

// Review management
router.post('/:id/reviews', verifyToken, vendorController.addReview);

// Vendor's own profile
router.get('/me/profile', verifyToken, vendorController.getMyVendorProfile);

module.exports = router;
