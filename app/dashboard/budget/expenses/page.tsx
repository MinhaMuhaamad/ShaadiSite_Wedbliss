'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/lib/context/AuthContext';
import { apiRequest, formatCurrency } from '@/lib/dashboard-api';

type Wedding = { _id: string };
type Budget = {
  _id: string;
  currency?: string;
  categories: {
    name: string;
    items: { itemName: string; vendor: string; amount: number; date?: string; notes?: string; status?: string }[];
  }[];
};

type FlatExpense = {
  id: string;
  date: string;
  category: string;
  title: string;
  vendor: string;
  amount: number;
  receipt: string;
  categoryIndex: number;
  itemIndex: number;
};

export default function ExpenseHistoryPage() {
  const { token } = useAuth();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [error, setError] = useState('');

  const loadExpenses = async () => {
    if (!token) return;
    try {
      setError('');
      const weddings = await apiRequest<Wedding[]>('/api/weddings', token);
      if (!weddings.length) {
        setBudget(null);
        return;
      }
      const budgetData = await apiRequest<Budget>(`/api/budget/wedding/${weddings[0]._id}`, token);
      setBudget(budgetData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load expenses.');
    }
  };

  useEffect(() => {
    loadExpenses();
    const poll = setInterval(loadExpenses, 12000);
    return () => clearInterval(poll);
  }, [token]);

  const flattened = useMemo<FlatExpense[]>(() => {
    if (!budget) return [];
    return budget.categories.flatMap((cat, categoryIndex) =>
      (cat.items || []).map((item, itemIndex) => ({
        id: `${categoryIndex}-${itemIndex}-${item.itemName}`,
        date: item.date ? item.date.slice(0, 10) : '',
        category: cat.name,
        title: item.itemName,
        vendor: item.vendor || '-',
        amount: item.amount || 0,
        receipt: item.notes?.split('\n').find((line) => line.startsWith('Receipt:'))?.replace('Receipt:', '') || '-',
        categoryIndex,
        itemIndex
      }))
    );
  }, [budget]);

  const categories = useMemo(() => Array.from(new Set(flattened.map((item) => item.category))), [flattened]);

  const filtered = useMemo(() => {
    const next = flattened
      .filter((expense) => (category === 'all' ? true : expense.category === category))
      .filter((expense) => `${expense.title} ${expense.vendor} ${expense.category}`.toLowerCase().includes(query.toLowerCase()))
      .filter((expense) => (fromDate ? expense.date >= fromDate : true))
      .filter((expense) => (toDate ? expense.date <= toDate : true));

    return next.sort((a, b) => (sortBy === 'amount' ? b.amount - a.amount : +new Date(b.date) - +new Date(a.date)));
  }, [flattened, category, query, fromDate, toDate, sortBy]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Expense History</h1>
          <p className="text-muted-foreground">Search, filter, sort, edit, and delete live expense records.</p>
        </div>
        <Link href="/dashboard/budget/add-expense"><Button>Add Expense</Button></Link>
      </div>

      {error ? <p className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</p> : null}

      <Card className="glass-card border-fuchsia-100">
        <CardHeader><CardTitle>Filters</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-5">
          <Input placeholder="Search by keyword" value={query} onChange={(e) => setQuery(e.target.value)} />
          <select className="rounded-xl border border-input bg-background px-3" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
          <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          <div className="flex gap-2">
            <Button variant={sortBy === 'date' ? 'default' : 'outline'} onClick={() => setSortBy('date')}>Sort by Date</Button>
            <Button variant={sortBy === 'amount' ? 'default' : 'outline'} onClick={() => setSortBy('amount')}>Sort by Amount</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-fuchsia-100">
        <CardHeader><CardTitle>All Logged Expenses</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Receipt</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.date || '-'}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.vendor}</TableCell>
                  <TableCell>{formatCurrency(item.amount, budget?.currency || 'USD')}</TableCell>
                  <TableCell>{item.receipt || '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/budget/add-expense?categoryIndex=${item.categoryIndex}&itemIndex=${item.itemIndex}`}>
                        <Button size="sm" variant="outline">Edit</Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!filtered.length ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No expenses match your filters.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
