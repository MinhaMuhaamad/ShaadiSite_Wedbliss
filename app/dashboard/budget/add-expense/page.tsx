'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/context/AuthContext';
import { apiRequest } from '@/lib/dashboard-api';

type Wedding = { _id: string };
type BudgetItem = { itemName: string; vendor: string; amount: number; status: string; date?: string; notes?: string };
type Category = { name: string; items: BudgetItem[] };
type Budget = { _id: string; categories: Category[] };

export default function AddExpensePage() {
  const { token } = useAuth();
  const params = useSearchParams();
  const editCategoryIndex = Number(params.get('categoryIndex') ?? '-1');
  const editItemIndex = Number(params.get('itemIndex') ?? '-1');
  const isEdit = Number.isInteger(editCategoryIndex) && Number.isInteger(editItemIndex) && editCategoryIndex >= 0 && editItemIndex >= 0;

  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [receiptName, setReceiptName] = useState('');
  const [form, setForm] = useState({
    categoryIndex: '',
    category: '',
    amount: '',
    vendor: '',
    date: '',
    notes: '',
    title: ''
  });

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        const weddings = await apiRequest<Wedding[]>('/api/weddings', token);
        if (!weddings.length) return setLoading(false);
        const budgetData = await apiRequest<Budget>(`/api/budget/wedding/${weddings[0]._id}`, token);
        setBudget(budgetData);

        if (isEdit) {
          const category = budgetData.categories[editCategoryIndex];
          const item = category?.items?.[editItemIndex];
          if (category && item) {
            setForm({
              categoryIndex: String(editCategoryIndex),
              category: category.name,
              amount: String(item.amount || ''),
              vendor: item.vendor || '',
              date: item.date ? item.date.slice(0, 10) : '',
              notes: item.notes || '',
              title: item.itemName || ''
            });
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load expense form.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token, isEdit, editCategoryIndex, editItemIndex]);

  const categoryOptions = useMemo(() => budget?.categories || [], [budget]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token || !budget) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      if (!form.categoryIndex || !form.title || !form.amount) {
        throw new Error('Category, title, and amount are required.');
      }

      const payload = {
        categoryIndex: Number(form.categoryIndex),
        itemName: form.title,
        vendor: form.vendor,
        amount: Number(form.amount),
        status: 'paid',
        date: form.date || undefined,
        notes: receiptName ? `${form.notes}\nReceipt:${receiptName}`.trim() : form.notes
      };

      if (isEdit) {
        await apiRequest(`/api/budget/${budget._id}/items`, token, {
          method: 'PUT',
          body: JSON.stringify({ ...payload, itemIndex: editItemIndex })
        });
      } else {
        await apiRequest(`/api/budget/${budget._id}/items`, token, {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }
      setSuccess(isEdit ? 'Expense updated successfully.' : 'Expense saved successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save expense.');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!token || !budget || !isEdit) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await apiRequest(`/api/budget/${budget._id}/items`, token, {
        method: 'DELETE',
        body: JSON.stringify({ categoryIndex: editCategoryIndex, itemIndex: editItemIndex })
      });
      setSuccess('Expense deleted successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete expense.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading expense form...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Add / Edit Expense</h1>
          <p className="text-muted-foreground">Manage budget entries with receipt and notes.</p>
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
            <select
              className="rounded-xl border border-input bg-background px-3 py-2"
              value={form.categoryIndex}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  categoryIndex: e.target.value,
                  category: categoryOptions[Number(e.target.value)]?.name || ''
                }))
              }
            >
              <option value="">Select Category</option>
              {categoryOptions.map((category, idx) => (
                <option key={category.name} value={idx}>
                  {category.name}
                </option>
              ))}
            </select>
            <Input value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} placeholder="Vendor Name" />
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Expense Title" />
            <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="Amount" />
            <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <div className="rounded-2xl border border-dashed border-fuchsia-300 bg-fuchsia-50/50 p-4">
              <p className="text-sm text-muted-foreground">Receipt image upload</p>
              <Input type="file" accept="image/*" onChange={(e) => setReceiptName(e.target.files?.[0]?.name || '')} className="mt-2" />
              {receiptName ? <p className="mt-2 text-xs text-fuchsia-700">{receiptName}</p> : null}
            </div>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Notes"
              className="min-h-24 rounded-xl border border-input bg-background px-3 py-2 md:col-span-2"
            />
            <div className="flex gap-3 md:col-span-2">
              <Button type="submit" disabled={saving}>{saving ? 'Saving...' : isEdit ? 'Update Expense' : 'Save Expense'}</Button>
              <Button type="button" variant="outline" disabled={!isEdit || saving} onClick={onDelete}>Delete Entry</Button>
            </div>
          </form>
          {error ? <p className="mt-3 text-sm text-rose-700">{error}</p> : null}
          {success ? <p className="mt-3 text-sm text-green-700">{success}</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
