const express = require('express');
const { verifyToken } = require('../middleware/auth');
const guestController = require('../controllers/guestController');

const router = express.Router();

router.get('/wedding/:weddingId', verifyToken, guestController.getWeddingGuests);
router.get('/stats/:weddingId', verifyToken, guestController.getGuestStatistics);
router.post('/', verifyToken, guestController.addGuest);
router.put('/:id', verifyToken, guestController.updateGuest);
router.put('/:id/rsvp', verifyToken, guestController.updateRSVP);
router.delete('/:id', verifyToken, guestController.deleteGuest);

module.exports = router;
