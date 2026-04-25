'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, Plus, TrendingUp, AlertCircle } from 'lucide-react';

const BUDGET_CATEGORIES = [
  'Venue',
  'Catering',
  'Photography',
  'Videography',
  'Flowers & Decorations',
  'Music & Entertainment',
  'Invitations & Stationery',
  'Attire',
  'Transportation',
  'Accommodations',
  'Favors & Gifts',
  'Other'
];

const COLORS = ['#d4896b', '#e8b4a8', '#d4a5a5', '#c9989e', '#b88b97', '#a87e90', '#997189', '#8a6482'];

export default function BudgetPage() {
  const [budgets, setBudgets] = useState([]);
  const [selectedWedding, setSelectedWedding] = useState(null);
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState({
    category: '',
    description: '',
    budgeted: '',
    spent: ''
  });

  // Mock data for demonstration
  const mockBudgetData = {
    totalBudget: 50000,
    totalSpent: 32500,
    items: [
      { category: 'Venue', budgeted: 15000, spent: 15000, items: 1 },
      { category: 'Catering', budgeted: 12000, spent: 9500, items: 1 },
      { category: 'Photography', budgeted: 5000, spent: 5000, items: 1 },
      { category: 'Flowers & Decorations', budgeted: 4000, spent: 2000, items: 3 },
      { category: 'Music & Entertainment', budgeted: 3500, spent: 1000, items: 2 },
      { category: 'Attire', budgeted: 2500, spent: 0, items: 2 },
      { category: 'Other', budgeted: 3000, spent: 0, items: 1 }
    ]
  };

  useEffect(() => {
    // Simulate fetching budgets
    setBudgets([mockBudgetData]);
  }, []);

  const remainingBudget = mockBudgetData.totalBudget - mockBudgetData.totalSpent;
  const spentPercentage = Math.round((mockBudgetData.totalSpent / mockBudgetData.totalBudget) * 100);

  const handleAddItem = () => {
    if (newItem.category && newItem.budgeted) {
      // API call would happen here
      setShowAddItem(false);
      setNewItem({ category: '', description: '', budgeted: '', spent: '' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Wedding Budget</h1>
          <p className="text-muted-foreground mt-1">Track and manage your wedding expenses</p>
        </div>
        <Dialog open={showAddItem} onOpenChange={setShowAddItem}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Budget Item</DialogTitle>
              <DialogDescription>Add a new expense category to your budget</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {BUDGET_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Description (optional)"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="Budgeted amount"
                  value={newItem.budgeted}
                  onChange={(e) => setNewItem({ ...newItem, budgeted: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Amount spent"
                  value={newItem.spent}
                  onChange={(e) => setNewItem({ ...newItem, spent: e.target.value })}
                />
              </div>

              <Button onClick={handleAddItem} className="w-full">Add Item</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockBudgetData.totalBudget.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">${mockBudgetData.totalSpent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">{spentPercentage}% of budget</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${remainingBudget > 0 ? 'text-green-600' : 'text-destructive'}`}>
              ${remainingBudget.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockBudgetData.items.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Breakdown</CardTitle>
            <CardDescription>Distribution of budgeted amounts by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockBudgetData.items}
                  dataKey="budgeted"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {mockBudgetData.items.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Budgeted vs Spent */}
        <Card>
          <CardHeader>
            <CardTitle>Budgeted vs Spent</CardTitle>
            <CardDescription>Comparison of planned vs actual spending</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockBudgetData.items}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" angle={-45} height={80} interval={0} textAnchor="end" fontSize={12} />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="budgeted" fill="#d4896b" name="Budgeted" />
                <Bar dataKey="spent" fill="#8a6482" name="Spent" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Budget Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Items</CardTitle>
          <CardDescription>Detailed breakdown of all expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Category</th>
                  <th className="text-right py-3 px-4 font-semibold">Budgeted</th>
                  <th className="text-right py-3 px-4 font-semibold">Spent</th>
                  <th className="text-right py-3 px-4 font-semibold">Remaining</th>
                  <th className="text-center py-3 px-4 font-semibold">Progress</th>
                </tr>
              </thead>
              <tbody>
                {mockBudgetData.items.map((item) => {
                  const remaining = item.budgeted - item.spent;
                  const progress = Math.round((item.spent / item.budgeted) * 100);
                  const isOverBudget = item.spent > item.budgeted;

                  return (
                    <tr key={item.category} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4">{item.category}</td>
                      <td className="text-right py-3 px-4">${item.budgeted.toLocaleString()}</td>
                      <td className={`text-right py-3 px-4 ${isOverBudget ? 'text-destructive font-semibold' : ''}`}>
                        ${item.spent.toLocaleString()}
                      </td>
                      <td className={`text-right py-3 px-4 ${remaining < 0 ? 'text-destructive' : 'text-green-600'}`}>
                        ${remaining.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              isOverBudget ? 'bg-destructive' : 'bg-primary'
                            }`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{progress}%</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Budget Alerts */}
      {mockBudgetData.items.some(item => item.spent > item.budgeted) && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              Over Budget Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {mockBudgetData.items.filter(item => item.spent > item.budgeted).length} category/categories are over budget.
              Review and adjust your spending plan.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
