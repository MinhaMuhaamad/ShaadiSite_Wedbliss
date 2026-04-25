'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/lib/context/AuthContext';
import { apiRequest, getActiveWeddingId } from '@/lib/dashboard-api';

type Guest = {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  rsvpStatus: 'accepted' | 'declined' | 'pending' | 'no_response';
};

export default function RsvpTrackerPage() {
  const { token } = useAuth();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [error, setError] = useState('');

  const load = async () => {
    if (!token) return;
    try {
      setError('');
      const weddingId = await getActiveWeddingId(token);
      if (!weddingId) return setGuests([]);
      const rows = await apiRequest<Guest[]>(`/api/guests/wedding/${weddingId}`, token);
      setGuests(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load RSVP tracker.');
    }
  };

  useEffect(() => {
    load();
    const poll = setInterval(load, 12000);
    return () => clearInterval(poll);
  }, [token]);

  const updateStatus = async (guestId: string, status: Guest['rsvpStatus']) => {
    if (!token) return;
    try {
      await apiRequest(`/api/guests/${guestId}/rsvp`, token, {
        method: 'PUT',
        body: JSON.stringify({ rsvpStatus: status })
      });
      setGuests((prev) => prev.map((guest) => (guest._id === guestId ? { ...guest, rsvpStatus: status } : guest)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update RSVP.');
    }
  };

  const counts = useMemo(() => ({
    attending: guests.filter((guest) => guest.rsvpStatus === 'accepted').length,
    declined: guests.filter((guest) => guest.rsvpStatus === 'declined').length,
    awaiting: guests.filter((guest) => guest.rsvpStatus === 'pending' || guest.rsvpStatus === 'no_response').length
  }), [guests]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">RSVP Tracker</h1>
      {error ? <p className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</p> : null}
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Attending</p><p className="text-2xl font-bold">{counts.attending}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Declined</p><p className="text-2xl font-bold">{counts.declined}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Awaiting</p><p className="text-2xl font-bold">{counts.awaiting}</p></CardContent></Card>
      </div>

      <Card className="glass-card border-fuchsia-100">
        <CardHeader><CardTitle>Responses</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Guest</TableHead><TableHead>Email</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {guests.map((guest) => (
                <TableRow key={guest._id}>
                  <TableCell>{guest.firstName} {guest.lastName}</TableCell>
                  <TableCell>{guest.email || '-'}</TableCell>
                  <TableCell className="capitalize">{guest.rsvpStatus}</TableCell>
                  <TableCell className="flex gap-2">
                    {(['accepted', 'declined', 'pending'] as const).map((status) => (
                      <Button key={status} size="sm" variant="outline" onClick={() => updateStatus(guest._id, status)}>
                        {status}
                      </Button>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
              {!guests.length ? (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No guests found.</TableCell></TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const seed = [
  { id: 1, name: 'Areeba Khan', email: 'areeba@mail.com', event: 'Barat', status: 'Attending' },
  { id: 2, name: 'Usman Shah', email: 'usman@mail.com', event: 'Mehndi', status: 'Declined' },
  { id: 3, name: 'Sana Ali', email: 'sana@mail.com', event: 'Walima', status: 'Awaiting' }
];

export default function RsvpTrackerPage() {
  const [rows, setRows] = useState(seed);
  const counts = useMemo(() => ({
    attending: rows.filter((r) => r.status === 'Attending').length,
    declined: rows.filter((r) => r.status === 'Declined').length,
    awaiting: rows.filter((r) => r.status === 'Awaiting').length
  }), [rows]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">RSVP Tracker</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Attending</p><p className="text-2xl font-bold">{counts.attending}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Declined</p><p className="text-2xl font-bold">{counts.declined}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Awaiting</p><p className="text-2xl font-bold">{counts.awaiting}</p></CardContent></Card>
      </div>

      <Card className="glass-card border-fuchsia-100">
        <CardHeader><CardTitle>Responses</CardTitle></CardHeader>
        <CardContent>
          <div className="mb-3 flex gap-2">
            <Button>Send RSVP Links</Button>
            <Button variant="outline">Bulk Send</Button>
            <Button variant="outline">Send Reminders</Button>
          </div>
          <Table>
            <TableHeader><TableRow><TableHead>Guest</TableHead><TableHead>Email</TableHead><TableHead>Event</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>{r.email}</TableCell>
                  <TableCell>{r.event}</TableCell>
                  <TableCell>{r.status}</TableCell>
                  <TableCell className="flex gap-2">
                    {['Attending', 'Declined', 'Awaiting'].map((s) => (
                      <Button key={s} size="sm" variant="outline" onClick={() => setRows(rows.map((x) => (x.id === r.id ? { ...x, status: s } : x)))}>
                        {s}
                      </Button>
                    ))}
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
