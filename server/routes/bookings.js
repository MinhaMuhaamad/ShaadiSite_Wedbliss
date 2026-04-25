const express = require('express');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.get('/wedding/:weddingId', verifyToken, (req, res) => {
  res.json({ message: 'Get wedding bookings endpoint' });
});

router.post('/', verifyToken, (req, res) => {
  res.json({ message: 'Create booking endpoint' });
});

router.put('/:id', verifyToken, (req, res) => {
  res.json({ message: 'Update booking endpoint' });
});

router.get('/:id', verifyToken, (req, res) => {
  res.json({ message: 'Get booking details endpoint' });
});

module.exports = router;
