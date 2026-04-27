'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/lib/context/AuthContext';
import { apiRequest, getActiveWeddingId } from '@/lib/dashboard-api';
import { getSocket, joinWeddingRoom } from '@/lib/realtime';

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
  const weddingIdRef = useRef<string | null>(null);
  const loadRef = useRef<(() => Promise<void>) | null>(null);

  const load = async () => {
    if (!token) return;
    try {
      setError('');
      const weddingId = await getActiveWeddingId(token);
      weddingIdRef.current = weddingId;
      joinWeddingRoom(weddingId);
      if (!weddingId) return setGuests([]);
      const rows = await apiRequest<Guest[]>(`/api/guests/wedding/${weddingId}`, token);
      setGuests(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load RSVP tracker.');
    }
  };

  useEffect(() => {
    loadRef.current = load;
    load();
  }, [token]);

  useEffect(() => {
    if (!token) return;
    const socket = getSocket();
    const handler = (payload: { weddingId?: string }) => {
      if (!payload?.weddingId) return;
      if (payload.weddingId !== weddingIdRef.current) return;
      void loadRef.current?.();
    };
    socket.on('guests:updated', handler);
    return () => socket.off('guests:updated', handler);
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
