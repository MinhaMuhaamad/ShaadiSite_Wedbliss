const express = require('express');
const { verifyToken } = require('../middleware/auth');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get('/wedding/:weddingId', verifyToken, bookingController.getWeddingBookings);

router.post('/', verifyToken, bookingController.createBooking);

router.put('/:id', verifyToken, bookingController.updateBooking);

router.get('/:id', verifyToken, bookingController.getBookingDetails);

module.exports = router;
