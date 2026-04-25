const express = require('express');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.get('/conversations', verifyToken, (req, res) => {
  res.json({ message: 'Get user conversations endpoint' });
});

router.get('/conversation/:conversationId', verifyToken, (req, res) => {
  res.json({ message: 'Get conversation messages endpoint' });
});

router.post('/message', verifyToken, (req, res) => {
  res.json({ message: 'Send message endpoint' });
});

router.post('/conversation', verifyToken, (req, res) => {
  res.json({ message: 'Create conversation endpoint' });
});

module.exports = router;
