const express = require('express');
const { verifyToken } = require('../middleware/auth');
const weddingController = require('../controllers/weddingController');

const router = express.Router();

router.post('/', verifyToken, weddingController.createWedding);
router.get('/', verifyToken, weddingController.getUserWeddings);
router.get('/:id', verifyToken, weddingController.getWedding);
router.get('/:id/stats', verifyToken, weddingController.getWeddingStats);
router.put('/:id', verifyToken, weddingController.updateWedding);
router.delete('/:id', verifyToken, weddingController.deleteWedding);
router.post('/:id/collaborators', verifyToken, weddingController.addCollaborator);

module.exports = router;
