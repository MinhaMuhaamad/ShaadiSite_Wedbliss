const express = require('express');
const { verifyToken } = require('../middleware/auth');
const chatController = require('../controllers/chatController');

const router = express.Router();

router.get('/conversations', verifyToken, chatController.getConversations);

router.get('/conversation/:conversationId', verifyToken, chatController.getConversationMessages);

router.post('/message', verifyToken, chatController.sendMessage);

router.post('/conversation', verifyToken, chatController.createConversation);

module.exports = router;
