'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/context/AuthContext';
import { apiRequest, getActiveWeddingId } from '@/lib/dashboard-api';

type Guest = {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  side?: string;
  relationship?: string;
  rsvpStatus: 'pending' | 'accepted' | 'declined' | 'no_response';
  mealChoice?: string;
};

export default function GuestsPage() {
  const { token } = useAuth();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [error, setError] = useState('');

  const loadGuests = async () => {
    if (!token) return;
    try {
      setError('');
      const weddingId = await getActiveWeddingId(token);
      if (!weddingId) return setGuests([]);
      const result = await apiRequest<Guest[]>(`/api/guests/wedding/${weddingId}`, token);
      setGuests(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load guests.');
    }
  };

  useEffect(() => {
    loadGuests();
    const poll = setInterval(loadGuests, 15000);
    return () => clearInterval(poll);
  }, [token]);

  const filtered = useMemo(() => {
    return guests
      .filter((guest) => (status === 'all' ? true : guest.rsvpStatus === status))
      .filter((guest) =>
        `${guest.firstName} ${guest.lastName} ${guest.email || ''} ${guest.relationship || ''}`
          .toLowerCase()
          .includes(query.toLowerCase())
      );
  }, [guests, query, status]);

  const stats = useMemo(
    () => ({
      total: guests.length,
      accepted: guests.filter((guest) => guest.rsvpStatus === 'accepted').length,
      pending: guests.filter((guest) => guest.rsvpStatus === 'pending' || guest.rsvpStatus === 'no_response').length,
      declined: guests.filter((guest) => guest.rsvpStatus === 'declined').length
    }),
    [guests]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Guest Management</h1>
          <p className="mt-1 text-muted-foreground">Track guests, RSVPs, and meal preferences in real time.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/guests/rsvp"><Button variant="outline">RSVP Tracker</Button></Link>
          <Link href="/dashboard/guests/add"><Button>Add Guest</Button></Link>
        </div>
      </div>

      {error ? <p className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</p> : null}

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total Guests" value={stats.total} />
        <StatCard label="Confirmed" value={stats.accepted} />
        <StatCard label="Pending RSVP" value={stats.pending} />
        <StatCard label="Declined" value={stats.declined} />
      </div>

      <Card className="border-fuchsia-100">
        <CardContent className="pt-6">
          <div className="grid gap-3 md:grid-cols-3">
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search guests..." />
            <select className="rounded-xl border border-input bg-background px-3 py-2" value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="all">All Status</option>
              <option value="accepted">Accepted</option>
              <option value="pending">Pending</option>
              <option value="no_response">No Response</option>
              <option value="declined">Declined</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-fuchsia-100">
        <CardHeader><CardTitle>Guest List</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-3 py-2 text-left">Guest</th>
                <th className="px-3 py-2 text-left">Contact</th>
                <th className="px-3 py-2 text-left">Side</th>
                <th className="px-3 py-2 text-left">RSVP</th>
                <th className="px-3 py-2 text-left">Meal</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((guest) => (
                <tr key={guest._id} className="border-b border-border">
                  <td className="px-3 py-2 font-medium">{guest.firstName} {guest.lastName}</td>
                  <td className="px-3 py-2">{guest.email || guest.phone || '-'}</td>
                  <td className="px-3 py-2 capitalize">{guest.side || '-'}</td>
                  <td className="px-3 py-2 capitalize">{guest.rsvpStatus}</td>
                  <td className="px-3 py-2">{guest.mealChoice || '-'}</td>
                  <td className="px-3 py-2 text-right">
                    <Link href={`/dashboard/guests/add?id=${guest._id}`}><Button size="sm" variant="outline">Edit</Button></Link>
                  </td>
                </tr>
              ))}
              {!filtered.length ? (
                <tr><td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">No guests found.</td></tr>
              ) : null}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card className="border-fuchsia-100">
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
