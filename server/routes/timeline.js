const express = require('express');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, (req, res) => {
  res.json({ message: 'Get timeline endpoint' });
});

router.post('/', verifyToken, (req, res) => {
  res.json({ message: 'Create timeline event endpoint' });
});

router.put('/:id', verifyToken, (req, res) => {
  res.json({ message: 'Update timeline event endpoint' });
});

module.exports = router;
