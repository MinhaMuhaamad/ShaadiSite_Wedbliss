const express = require('express');
const { verifyToken } = require('../middleware/auth');
const budgetController = require('../controllers/budgetController');

const router = express.Router();

router.get('/wedding/:weddingId', verifyToken, budgetController.getBudget);
router.get('/summary/:weddingId', verifyToken, budgetController.getBudgetSummary);
router.put('/:id', verifyToken, budgetController.updateBudget);
router.post('/:id/items', verifyToken, budgetController.addBudgetItem);
router.put('/:id/items', verifyToken, budgetController.updateBudgetItem);
router.delete('/:id/items', verifyToken, budgetController.deleteBudgetItem);

module.exports = router;
