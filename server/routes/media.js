const express = require('express');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, (req, res) => {
  res.json({ message: 'Get media endpoint' });
});

router.post('/upload', verifyToken, (req, res) => {
  res.json({ message: 'Upload media endpoint' });
});

router.delete('/:id', verifyToken, (req, res) => {
  res.json({ message: 'Delete media endpoint' });
});

module.exports = router;
