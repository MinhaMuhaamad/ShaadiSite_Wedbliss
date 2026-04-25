const Budget = require('../models/Budget');

// Get wedding budget
exports.getBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({ weddingId: req.params.weddingId });
    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update budget categories
exports.updateBudget = async (req, res) => {
  try {
    const { totalBudget, categories } = req.body;

    const budget = await Budget.findByIdAndUpdate(
      req.params.id,
      {
        totalBudget,
        categories,
        totalSpent: calculateTotalSpent(categories),
        remainingBudget: totalBudget - calculateTotalSpent(categories),
        updatedAt: Date.now()
      },
      { new: true }
    );

    res.json({ message: 'Budget updated', budget });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add budget item
exports.addBudgetItem = async (req, res) => {
  try {
    const { categoryIndex, itemName, vendor, amount, status } = req.body;
    const budget = await Budget.findById(req.params.id);

    budget.categories[categoryIndex].items.push({
      itemName,
      vendor,
      amount,
      status,
      date: new Date()
    });

    budget.totalSpent = calculateTotalSpent(budget.categories);
    budget.remainingBudget = budget.totalBudget - budget.totalSpent;

    await budget.save();

    res.json({ message: 'Budget item added', budget });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update budget item
exports.updateBudgetItem = async (req, res) => {
  try {
    const { categoryIndex, itemIndex, ...updates } = req.body;
    const budget = await Budget.findById(req.params.id);

    budget.categories[categoryIndex].items[itemIndex] = {
      ...budget.categories[categoryIndex].items[itemIndex],
      ...updates
    };

    budget.totalSpent = calculateTotalSpent(budget.categories);
    budget.remainingBudget = budget.totalBudget - budget.totalSpent;

    await budget.save();

    res.json({ message: 'Budget item updated', budget });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete budget item
exports.deleteBudgetItem = async (req, res) => {
  try {
    const { categoryIndex, itemIndex } = req.body;
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    if (!budget.categories[categoryIndex]?.items[itemIndex]) {
      return res.status(404).json({ message: 'Budget item not found' });
    }

    budget.categories[categoryIndex].items.splice(itemIndex, 1);
    budget.totalSpent = calculateTotalSpent(budget.categories);
    budget.remainingBudget = budget.totalBudget - budget.totalSpent;

    await budget.save();
    res.json({ message: 'Budget item deleted', budget });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get budget summary
exports.getBudgetSummary = async (req, res) => {
  try {
    const budget = await Budget.findOne({ weddingId: req.params.weddingId });

    const summary = {
      totalBudget: budget.totalBudget,
      totalSpent: budget.totalSpent,
      remainingBudget: budget.remainingBudget,
      percentageUsed: ((budget.totalSpent / budget.totalBudget) * 100).toFixed(2),
      categories: budget.categories.map(cat => ({
        name: cat.name,
        allocated: cat.allocatedAmount,
        spent: cat.spent,
        percentageUsed: ((cat.spent / cat.allocatedAmount) * 100).toFixed(2)
      }))
    };

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get spending forecast
exports.getSpendingForecast = async (req, res) => {
  try {
    const budget = await Budget.findOne({ weddingId: req.params.weddingId });
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    const forecast = {
      currentMonthSpending: budget.totalSpent,
      projectedTotal: estimateProjectedSpending(budget),
      remainingMonths: getMonthsUntilWedding(budget.weddingDate),
      monthlyAverage: calculateMonthlyAverage(budget)
    };

    res.json(forecast);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper functions
function calculateTotalSpent(categories) {
  return categories.reduce((sum, category) => {
    const categorySpent = category.items.reduce((itemSum, item) => {
      return item.status === 'paid' ? itemSum + item.amount : itemSum;
    }, 0);
    return sum + categorySpent;
  }, 0);
}

function estimateProjectedSpending(budget) {
  const totalSpent = budget.totalSpent || 0;
  const monthsElapsed = Math.ceil((new Date() - new Date(budget.createdAt)) / (1000 * 60 * 60 * 24 * 30));
  return totalSpent * (monthsElapsed || 1);
}

function getMonthsUntilWedding(weddingDate) {
  const now = new Date();
  const wedding = new Date(weddingDate);
  return Math.ceil((wedding - now) / (1000 * 60 * 60 * 24 * 30));
}

function calculateMonthlyAverage(budget) {
  const totalSpent = budget.totalSpent || 0;
  const monthsElapsed = Math.ceil((new Date() - new Date(budget.createdAt)) / (1000 * 60 * 60 * 24 * 30));
  return Math.round(totalSpent / (monthsElapsed || 1));
}
