'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AddExpensePage() {
  const [form, setForm] = useState({
    category: 'Venue & Catering',
    amount: '',
    vendor: '',
    date: '',
    notes: '',
    receipt: ''
  });
  const [saved, setSaved] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Add / Edit Expense</h1>
          <p className="text-muted-foreground">Record expense details and upload receipt.</p>
        </div>
        <Link href="/dashboard/budget/expenses">
          <Button variant="outline">Expense History</Button>
        </Link>
      </div>

      <Card className="glass-card border-fuchsia-100">
        <CardHeader>
          <CardTitle>Expense Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
            <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" />
            <Input value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} placeholder="Vendor Name" />
            <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="Amount" />
            <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Notes"
              className="min-h-24 rounded-xl border border-input bg-background px-3 py-2 md:col-span-2"
            />
            <div className="md:col-span-2 rounded-2xl border border-dashed border-fuchsia-300 bg-fuchsia-50/50 p-4">
              <p className="text-sm text-muted-foreground">Receipt upload (image/pdf)</p>
              <Input type="file" onChange={(e) => setForm({ ...form, receipt: e.target.value })} className="mt-2" />
            </div>
            <div className="flex gap-3 md:col-span-2">
              <Button type="submit">Save Expense</Button>
              <Button type="button" variant="outline">Delete Entry</Button>
            </div>
          </form>
          {saved && <p className="mt-3 text-sm text-green-700">Expense saved successfully.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
