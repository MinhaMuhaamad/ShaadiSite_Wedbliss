const express = require('express');
const { verifyToken, checkRole } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(verifyToken, checkRole(['admin']));

router.get('/dashboard', (req, res) => {
  res.json({ message: 'Get admin dashboard data endpoint' });
});

router.get('/users', (req, res) => {
  res.json({ message: 'Get all users endpoint' });
});

router.put('/users/:id', (req, res) => {
  res.json({ message: 'Update user endpoint' });
});

router.delete('/users/:id', (req, res) => {
  res.json({ message: 'Delete user endpoint' });
});

router.get('/analytics', (req, res) => {
  res.json({ message: 'Get analytics endpoint' });
});

module.exports = router;
