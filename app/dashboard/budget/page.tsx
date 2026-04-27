'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Plus } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { apiRequest, formatCurrency } from '@/lib/dashboard-api';
import { getSocket, joinWeddingRoom } from '@/lib/realtime';

type Wedding = { _id: string };
type Budget = {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  categories: { name: string; allocatedAmount: number; spent: number }[];
  currency?: string;
};

export default function BudgetPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [budget, setBudget] = useState<Budget | null>(null);
  const weddingIdRef = useRef<string | null>(null);
  const loadBudgetRef = useRef<(() => Promise<void>) | null>(null);

  useEffect(() => {
    if (!token) return;
    const loadBudget = async () => {
      try {
        setError('');
        const weddings = await apiRequest<Wedding[]>('/api/weddings', token);
        if (!weddings.length) {
          setBudget(null);
          weddingIdRef.current = null;
          setLoading(false);
          return;
        }
        weddingIdRef.current = weddings[0]._id;
        const budgetData = await apiRequest<Budget>(`/api/budget/wedding/${weddings[0]._id}`, token);
        setBudget(budgetData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load budget.');
      } finally {
        setLoading(false);
      }
    };
    loadBudgetRef.current = loadBudget;
    loadBudget();
  }, [token]);

  useEffect(() => {
    if (!token) return;
    const socket = getSocket();

    const handler = (payload: { weddingId?: string }) => {
      if (!payload?.weddingId) return;
      if (payload.weddingId !== weddingIdRef.current) return;
      void loadBudgetRef.current?.();
    };

    socket.on('budget:updated', handler);
    return () => {
      socket.off('budget:updated', handler);
    };
  }, [token]);

  useEffect(() => {
    joinWeddingRoom(weddingIdRef.current);
  }, [token]);

  const spentPercentage = useMemo(() => {
    if (!budget?.totalBudget) return 0;
    return Math.min(100, Math.round((budget.totalSpent / budget.totalBudget) * 100));
  }, [budget]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-fuchsia-600" />
      </div>
    );
  }

  if (error) {
    return <p className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</p>;
  }

  return (
    <div className="relative space-y-6 overflow-hidden">
      <div className="pointer-events-none absolute -left-24 top-8 h-64 w-64 rounded-full bg-fuchsia-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-12 h-72 w-72 rounded-full bg-violet-400/20 blur-3xl" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">WedBliss Budget</h1>
          <p className="mt-1 text-muted-foreground">Live budget insights with real-time updates.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/budget/expenses"><Button variant="outline">Expense History</Button></Link>
          <Link href="/dashboard/budget/add-expense"><Button className="gap-2"><Plus className="h-4 w-4" /> Add Expense</Button></Link>
        </div>
      </div>

      {!budget ? (
        <Card className="border-fuchsia-100 bg-white/90">
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">No budget found for your wedding yet.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="glass-card surface-3d overflow-hidden border-fuchsia-100">
            <CardContent className="p-0">
              <div className="grid gap-4 p-6 md:grid-cols-[1.4fr_0.6fr]">
                <div>
                  <p className="text-sm text-muted-foreground">Total Budget Overview</p>
                  <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Target</p>
                      <p className="text-xl font-semibold">{formatCurrency(budget.totalBudget, budget.currency || 'USD')}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Spent</p>
                      <p className="text-xl font-semibold text-fuchsia-700">{formatCurrency(budget.totalSpent, budget.currency || 'USD')}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Remaining</p>
                      <p className="text-xl font-semibold text-green-600">{formatCurrency(budget.remainingBudget, budget.currency || 'USD')}</p>
                    </div>
                  </div>
                  <div className="mt-5 h-3 w-full rounded-full bg-fuchsia-100">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500"
                      style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="rounded-2xl border border-fuchsia-100 bg-fuchsia-50/70 p-4">
                  <p className="text-sm text-muted-foreground">Budget Usage</p>
                  <p className="mt-2 text-3xl font-bold text-fuchsia-900">{spentPercentage}%</p>
                  <p className="mt-1 text-sm text-muted-foreground">Real-time spend against allocated total.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-fuchsia-100">
            <CardHeader className="pb-3">
              <CardTitle>Category Tracking</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {budget.categories.map((item) => {
                const progress = item.allocatedAmount ? Math.round((item.spent / item.allocatedAmount) * 100) : 0;
                const over = item.spent > item.allocatedAmount;
                return (
                  <div key={item.name}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <p className={`font-medium ${over ? 'text-rose-700' : 'text-foreground'}`}>{item.name}</p>
                      <p className={`text-xs ${over ? 'font-semibold text-rose-700' : 'text-muted-foreground'}`}>
                        {formatCurrency(item.spent, budget.currency || 'USD')} / {formatCurrency(item.allocatedAmount, budget.currency || 'USD')}
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

          <Card className="glass-card border-fuchsia-100">
            <CardHeader>
              <CardTitle>Expense Planner</CardTitle>
              <CardDescription>Use Add Expense to create entries, then manage them in Expense History.</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Link href="/dashboard/budget/add-expense"><Button>Add Expense</Button></Link>
              <Link href="/dashboard/budget/expenses"><Button variant="outline">View History</Button></Link>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
