const express = require('express');
const { verifyToken } = require('../middleware/auth');
const chatController = require('../controllers/chatController');

const router = express.Router();

router.get('/conversations', verifyToken, chatController.getConversations);

router.get('/conversation/:conversationId', verifyToken, chatController.getConversationMessages);

router.post('/message', verifyToken, chatController.sendMessage);

router.post('/conversation', verifyToken, chatController.createConversation);

// Quotes & negotiation
router.post('/quote', verifyToken, chatController.createQuote);
router.post('/quote/action', verifyToken, chatController.quoteAction);

// Safety
router.post('/conversation/:conversationId/block', verifyToken, chatController.blockConversation);
router.post('/conversation/:conversationId/report', verifyToken, chatController.reportConversation);

module.exports = router;
