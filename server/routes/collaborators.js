const express = require('express');
const { verifyToken } = require('../middleware/auth');
const collaboratorController = require('../controllers/collaboratorController');

const router = express.Router();

// Get user's shared weddings
router.get('/shared', verifyToken, collaboratorController.getUserSharedWeddings);

// Get collaborators for a wedding
router.get('/:weddingId', verifyToken, collaboratorController.getCollaborators);

// Add collaborator
router.post('/', verifyToken, collaboratorController.addCollaborator);

// Update collaborator
router.put('/:weddingId/:collaboratorId', verifyToken, collaboratorController.updateCollaborator);

// Remove collaborator
router.delete('/:weddingId/:collaboratorId', verifyToken, collaboratorController.removeCollaborator);

module.exports = router;
