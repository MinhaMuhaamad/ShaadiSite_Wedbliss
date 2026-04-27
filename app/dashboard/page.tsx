'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Calendar, CheckCircle2, DollarSign, Loader2, MessageCircle, Plus, Users } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { apiRequest, formatCurrency } from '@/lib/dashboard-api';

type Wedding = { _id: string; brideName?: string; groomName?: string; weddingDate: string };
type Budget = {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  categories: { name: string; items: { itemName: string; status: string; amount: number; date?: string }[] }[];
};
type GuestStats = { totalInvited: number; accepted: number; pending: number };
type Booking = { _id: string; status: string; vendorId?: { businessName?: string }; eventDate?: string; createdAt: string };
type Vendor = { _id: string };

export default function DashboardPage() {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [guestStats, setGuestStats] = useState<GuestStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vendorCount, setVendorCount] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [selectedWeddingDate, setSelectedWeddingDate] = useState('');
  const [quickWeddingDate, setQuickWeddingDate] = useState('');
  const [savingDate, setSavingDate] = useState(false);
  const inFlightRef = useRef(false);

  const loadDashboard = async () => {
    if (!token) return;
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    try {
      setError('');
      const weddings = await apiRequest<Wedding[]>('/api/weddings', token);
      const activeWedding = weddings[0] || null;
      setWedding(activeWedding);
      setSelectedWeddingDate(activeWedding?.weddingDate ? activeWedding.weddingDate.slice(0, 10) : '');
      if (!activeWedding) return;

      const [budgetData, stats, bookingData, vendors] = await Promise.all([
        apiRequest<Budget | null>(`/api/budget/wedding/${activeWedding._id}`, token),
        apiRequest<GuestStats>(`/api/guests/stats/${activeWedding._id}`, token),
        apiRequest<Booking[]>(`/api/bookings/wedding/${activeWedding._id}`, token),
        apiRequest<Vendor[]>('/api/vendors', token)
      ]);

      setBudget(budgetData);
      setGuestStats(stats);
      setBookings(bookingData);
      setVendorCount(vendors.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load dashboard.');
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    loadDashboard();
    const refresh = setInterval(loadDashboard, 20000);
    return () => clearInterval(refresh);
  }, [token]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const countdown = useMemo(() => {
    if (!wedding?.weddingDate) return { days: 0, hours: 0, minutes: 0 };
    const target = new Date(wedding.weddingDate).getTime();
    const diff = Math.max(0, target - now);
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60)
    };
  }, [wedding?.weddingDate, now]);

  const taskSummary = useMemo(() => {
    const items = budget?.categories.flatMap((category) => category.items || []) || [];
    return {
      pending: items.filter((item) => item.status === 'pending').length,
      inProgress: items.filter((item) => item.status === 'confirmed').length,
      completed: items.filter((item) => item.status === 'paid').length
    };
  }, [budget]);

  const upcomingAppointments = useMemo(
    () =>
      bookings.filter((booking) => booking.eventDate && new Date(booking.eventDate) >= new Date()).slice(0, 3),
    [bookings]
  );

  const activities = useMemo(() => {
    const budgetActivities =
      budget?.categories
        .flatMap((category) => category.items || [])
        .slice(-4)
        .map((item) => ({
          title: `Expense update: ${item.itemName}`,
          description: `${item.status.toUpperCase()} • ${formatCurrency(item.amount)}`
        })) || [];

    const bookingActivities = bookings.slice(0, 3).map((booking) => ({
      title: `Booking ${booking.status}`,
      description: booking.vendorId?.businessName || 'Vendor'
    }));

    return [...bookingActivities, ...budgetActivities].slice(0, 6);
  }, [bookings, budget]);

  const spentPercentage = budget?.totalBudget
    ? Math.min(100, Math.round((budget.totalSpent / budget.totalBudget) * 100))
    : 0;

  const saveWeddingDate = async () => {
    if (!token || !wedding || !selectedWeddingDate) return;
    setSavingDate(true);
    try {
      await apiRequest(`/api/weddings/${wedding._id}`, token, {
        method: 'PUT',
        body: JSON.stringify({ weddingDate: selectedWeddingDate })
      });
      await loadDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save wedding date.');
    } finally {
      setSavingDate(false);
    }
  };

  const createWeddingFromDate = async () => {
    if (!token || !quickWeddingDate) return;
    setSavingDate(true);
    try {
      await apiRequest('/api/weddings', token, {
        method: 'POST',
        body: JSON.stringify({
          weddingDate: quickWeddingDate,
          brideName: user?.name || 'Bride',
          groomName: ''
        })
      });
      await loadDashboard();
      setQuickWeddingDate('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create wedding date.');
    } finally {
      setSavingDate(false);
    }
  };

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

  if (!wedding) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Wedding Dashboard</h1>
        <p className="text-muted-foreground">Select your wedding date to start the live countdown.</p>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={quickWeddingDate}
            onChange={(event) => setQuickWeddingDate(event.target.value)}
            className="rounded-xl border border-input bg-background px-3 py-2"
          />
          <Button onClick={createWeddingFromDate} disabled={!quickWeddingDate || savingDate}>
            {savingDate ? 'Saving...' : 'Start Countdown'}
          </Button>
        </div>
        <Link href="/dashboard/weddings/new">
          <Button>Set up Wedding</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-fuchsia-100 bg-gradient-to-r from-violet-300 to-fuchsia-500 text-white shadow-lg shadow-fuchsia-400/20">
        <CardContent className="p-7">
          <p className="text-sm text-white/80">Welcome back, {user?.name || wedding.brideName || 'Bride'}</p>
          <h1 className="mt-1 text-4xl font-bold">Your Wedding Dashboard</h1>
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-white/20 p-2">
            <input
              type="date"
              value={selectedWeddingDate}
              onChange={(event) => setSelectedWeddingDate(event.target.value)}
              className="rounded-lg border border-white/40 bg-white/20 px-3 py-2 text-sm text-white"
            />
            <Button variant="secondary" size="sm" onClick={saveWeddingDate} disabled={savingDate || !selectedWeddingDate}>
              {savingDate ? 'Saving...' : 'Set Wedding Date'}
            </Button>
            <p className="text-xs text-white/85">Select your wedding date to start the countdown.</p>
          </div>
          <div className="mt-5 flex gap-8">
            <div>
              <p className="text-3xl font-semibold">{countdown.days}</p>
              <p className="text-xs tracking-widest text-white/75">DAYS</p>
            </div>
            <div>
              <p className="text-3xl font-semibold">{countdown.hours}</p>
              <p className="text-xs tracking-widest text-white/75">HOURS</p>
            </div>
            <div>
              <p className="text-3xl font-semibold">{countdown.minutes}</p>
              <p className="text-xs tracking-widest text-white/75">MINUTES</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card className="border-fuchsia-100 bg-white/90">
          <CardHeader>
            <CardTitle>Task Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-3">
            <TaskCard label="Pending" value={taskSummary.pending} />
            <TaskCard label="In Progress" value={taskSummary.inProgress} />
            <TaskCard label="Completed" value={taskSummary.completed} />
          </CardContent>
        </Card>
        <Card className="border-fuchsia-100 bg-white/90">
          <CardHeader>
            <CardTitle>Budget Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full border-[12px] border-fuchsia-500 text-center">
              <div>
                <p className="text-2xl font-bold">{formatCurrency(budget?.totalBudget || 0)}</p>
                <p className="text-xs text-muted-foreground">allocated</p>
              </div>
            </div>
            <div className="mt-4 h-2 rounded-full bg-fuchsia-100">
              <div className="h-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500" style={{ width: `${spentPercentage}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>spent {formatCurrency(budget?.totalSpent || 0)}</span>
              <span>remaining {formatCurrency(budget?.remainingBudget || 0)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Total Invited', value: guestStats?.totalInvited || 0, icon: Users },
          { label: 'Upcoming Appointments', value: upcomingAppointments.length, icon: Calendar },
          { label: 'Vendors Available', value: vendorCount, icon: DollarSign }
        ].map((item) => (
          <Card key={item.label} className="border-fuchsia-100 bg-white/85">
            <CardContent className="flex items-center gap-3 p-4">
              <span className="rounded-xl bg-fuchsia-100 p-2 text-fuchsia-700">
                <item.icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-2xl font-bold">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-fuchsia-100 bg-white/90">
          <CardHeader>
            <CardTitle>Activity Stream</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.title} className="flex items-start gap-3 rounded-xl border border-fuchsia-100 bg-fuchsia-50/50 p-3">
                <span className="mt-0.5 rounded-full bg-white p-1.5 text-fuchsia-600 shadow">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-fuchsia-100 bg-gradient-to-br from-fuchsia-50 to-white">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/guests/add"><Button className="w-full justify-start gap-2"><Plus className="h-4 w-4" /> Add Guest</Button></Link>
            <Link href="/dashboard/budget/add-expense"><Button variant="outline" className="w-full justify-start gap-2"><DollarSign className="h-4 w-4" /> Add Expense</Button></Link>
            <Link href="/dashboard/chat"><Button variant="outline" className="w-full justify-start gap-2"><MessageCircle className="h-4 w-4" /> Message Vendor</Button></Link>
            <Link href="/dashboard/timeline"><Button variant="outline" className="w-full justify-start gap-2"><Calendar className="h-4 w-4" /> View Checklist</Button></Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function TaskCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-fuchsia-100 bg-fuchsia-50/70 p-3 text-center">
      <p className="text-2xl font-bold text-fuchsia-900">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
