'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const expensesSeed = [
  { id: 1, date: '2026-04-20', category: 'Venue', title: 'Venue Advance', vendor: 'Royal Gardens', amount: 2000, receipt: 'receipt-001.jpg' },
  { id: 2, date: '2026-04-19', category: 'Photography', title: 'Engagement Shoot', vendor: 'Frame & Bloom', amount: 650, receipt: 'receipt-002.jpg' },
  { id: 3, date: '2026-04-18', category: 'Decor', title: 'Floral Installations', vendor: 'Eternal Florals', amount: 1200, receipt: 'receipt-003.jpg' }
];

export default function ExpenseHistoryPage() {
  const [expenses, setExpenses] = useState(expensesSeed);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  const filtered = useMemo(() => {
    const next = expenses
      .filter((e) => (category === 'all' ? true : e.category === category))
      .filter((e) => `${e.title} ${e.vendor}`.toLowerCase().includes(query.toLowerCase()));
    return next.sort((a, b) =>
      sortBy === 'amount' ? b.amount - a.amount : +new Date(b.date) - +new Date(a.date)
    );
  }, [expenses, category, query, sortBy]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Expense History</h1>
        <p className="text-muted-foreground">Search, filter, sort and manage all expense records.</p>
      </div>
      <Card className="glass-card border-fuchsia-100">
        <CardHeader><CardTitle>Filters</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          <Input placeholder="Search by title/vendor" value={query} onChange={(e) => setQuery(e.target.value)} />
          <select className="rounded-xl border border-input bg-background px-3" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="Venue">Venue</option>
            <option value="Photography">Photography</option>
            <option value="Decor">Decor</option>
          </select>
          <Input type="date" />
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
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.vendor}</TableCell>
                  <TableCell>${item.amount}</TableCell>
                  <TableCell>{item.receipt}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="outline" onClick={() => setExpenses(expenses.filter((x) => x.id !== item.id))}>Delete</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
