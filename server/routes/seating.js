const express = require('express');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, (req, res) => {
  res.json({ message: 'Get seating arrangements endpoint' });
});

router.post('/', verifyToken, (req, res) => {
  res.json({ message: 'Create seating arrangement endpoint' });
});

router.put('/:id', verifyToken, (req, res) => {
  res.json({ message: 'Update seating arrangement endpoint' });
});

module.exports = router;
