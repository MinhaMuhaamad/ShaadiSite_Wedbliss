'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Plus } from 'lucide-react';

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

export default function BudgetPage() {
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState({
    category: '',
    description: '',
    budgeted: '',
    spent: ''
  });

  const mockBudgetData = {
    totalBudget: 45000,
    totalSpent: 32500,
    items: [
      { category: 'Venue & Rentals', budgeted: 15000, spent: 12000 },
      { category: 'Catering & Drinks', budgeted: 10000, spent: 8500 },
      { category: 'Attire & Beauty', budgeted: 5000, spent: 4200 },
      { category: 'Flowers & Decor', budgeted: 3000, spent: 3450 },
      { category: 'Photography & Video', budgeted: 4000, spent: 2100 },
      { category: 'Music & Entertainment', budgeted: 2500, spent: 1500 },
      { category: 'Stationery & Favors', budgeted: 1000, spent: 450 },
      { category: 'Rings & Jewelry', budgeted: 2000, spent: 1200 },
      { category: 'Transport & Lodging', budgeted: 1500, spent: 500 },
      { category: 'Admin & Legal', budgeted: 1000, spent: 150 }
    ]
  };

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
    <div className="relative space-y-6 overflow-hidden">
      <div className="pointer-events-none absolute -left-24 top-8 h-64 w-64 rounded-full bg-fuchsia-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-12 h-72 w-72 rounded-full bg-violet-400/20 blur-3xl" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">WedBliss Budget</h1>
          <p className="mt-1 text-muted-foreground">Premium budget control panel for your celebration.</p>
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

      <Card className="glass-card surface-3d overflow-hidden border-fuchsia-100">
        <CardContent className="p-0">
          <div className="grid gap-4 p-6 md:grid-cols-[1.4fr_0.6fr]">
            <div>
              <p className="text-sm text-muted-foreground">Total Budget Overview</p>
              <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Target</p>
                  <p className="text-xl font-semibold">${mockBudgetData.totalBudget.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Spent</p>
                  <p className="text-xl font-semibold text-fuchsia-700">${mockBudgetData.totalSpent.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Remaining</p>
                  <p className="text-xl font-semibold text-green-600">${remainingBudget.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-5 h-3 w-full rounded-full bg-fuchsia-100">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500"
                  style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                />
              </div>
            </div>
            <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4">
              <p className="text-sm text-rose-700">Over Budget Alert</p>
              <p className="mt-2 font-semibold text-rose-900">Flowers & Decor</p>
              <p className="mt-1 text-sm text-rose-700">Current spend is 15% above allocated amount.</p>
              <Button variant="outline" className="mt-4 w-full border-rose-300 text-rose-700 hover:bg-rose-100">
                Adjust Allocation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-fuchsia-100">
        <CardHeader className="pb-3">
          <CardTitle>Category Tracking</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {mockBudgetData.items.map((item) => {
            const progress = Math.round((item.spent / item.budgeted) * 100);
            const over = item.spent > item.budgeted;
            return (
              <div key={item.category}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <p className={`font-medium ${over ? 'text-rose-700' : 'text-foreground'}`}>{item.category}</p>
                  <p className={`text-xs ${over ? 'font-semibold text-rose-700' : 'text-muted-foreground'}`}>
                    ${item.spent.toLocaleString()} / ${item.budgeted.toLocaleString()}
                  </p>
                </div>
                <div className="h-2.5 rounded-full bg-fuchsia-100">
                  <div
                    className={`h-2.5 rounded-full ${over ? 'bg-rose-500' : 'bg-gradient-to-r from-fuchsia-500 to-violet-500'}`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass-card border-fuchsia-100">
          <CardHeader>
            <CardTitle>Spending Trend</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex h-60 items-end justify-between rounded-2xl bg-fuchsia-50/70 px-6 pb-4">
              {[35, 58, 42, 80, 47, 62, 54].map((height, idx) => (
                <div key={idx} className="flex w-8 flex-col items-center gap-2">
                  <div
                    className={`w-full rounded-md ${idx === 3 ? 'bg-gradient-to-t from-fuchsia-600 to-violet-500' : 'bg-fuchsia-200'}`}
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-muted-foreground">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][idx]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-fuchsia-100">
          <CardHeader>
            <CardTitle>Smart Savings Tip</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Based on your current vendors, you could save up to $1,200 by bundling photography and videography packages with "Elite Memories".
            </p>
            <Button className="mt-5">Explore Bundles</Button>
            <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50/70 p-3 text-sm text-rose-700">
              <div className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="h-4 w-4" />
                Flowers & Decor is over budget.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-fuchsia-100">
        <CardHeader>
          <CardTitle>Record Wedding Expense</CardTitle>
          <CardDescription>Keep your budget on track with detailed expense logging</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4 rounded-2xl border border-fuchsia-100 bg-white/60 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Input placeholder="Venue & Catering" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Vendor Name</label>
                  <Input placeholder="e.g. Royal Garden Estates" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount</label>
                  <Input type="number" placeholder="$ 0.00" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Transaction Date</label>
                  <Input type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes & Details</label>
                  <textarea
                    placeholder="Include any specific details about the payment or installment..."
                    className="min-h-28 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                  />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">Discard</Button>
                <Button className="flex-1">Save Expense</Button>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-dashed border-fuchsia-300 bg-fuchsia-50/50 p-6 text-center">
                <p className="font-medium text-fuchsia-900">Upload Receipt</p>
                <p className="mt-2 text-sm text-muted-foreground">Drag and drop your digital invoice or photo of the receipt here.</p>
                <Button variant="outline" className="mt-4 border-fuchsia-300 text-fuchsia-800">Browse Files</Button>
              </div>
              <div className="rounded-2xl border border-fuchsia-100 bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-semibold">Budget Context</p>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">ON TRACK</span>
                </div>
                <p className="text-sm text-muted-foreground">Total Allocated</p>
                <p className="text-lg font-bold">$45,000</p>
                <div className="mt-3 h-2 rounded-full bg-fuchsia-100">
                  <div className="h-2 w-2/3 rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500" />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-lg bg-fuchsia-50 p-2"><p className="text-xs text-muted-foreground">SPENT</p><p className="font-semibold">$27,900</p></div>
                  <div className="rounded-lg bg-fuchsia-50 p-2"><p className="text-xs text-muted-foreground">REMAINING</p><p className="font-semibold text-fuchsia-700">$17,100</p></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
