const express = require('express');
const { verifyToken } = require('../middleware/auth');
const invitationController = require('../controllers/invitationController');

const router = express.Router();

// Create invitation
router.post('/', verifyToken, invitationController.createInvitation);

// Get invitations for wedding
router.get('/wedding/:weddingId', verifyToken, invitationController.getInvitations);

// Get invitation stats
router.get('/stats/:weddingId', verifyToken, invitationController.getInvitationStats);

// Get single invitation
router.get('/:id', invitationController.getInvitation);

// Update RSVP
router.put('/:id/rsvp', invitationController.updateRsvp);

// Send reminder
router.post('/:id/reminder', verifyToken, invitationController.sendReminder);

// Send bulk invitations
router.post('/bulk/send', verifyToken, invitationController.sendBulkInvitations);

module.exports = router;
