'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/context/AuthContext';
import { apiRequest, getActiveWeddingId } from '@/lib/dashboard-api';

type Guest = { _id: string; firstName: string; lastName: string; email?: string; relationship?: string };

export default function SendInvitationsPage() {
  const { token } = useAuth();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState('We would love to celebrate with you.');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      const weddingId = await getActiveWeddingId(token);
      if (!weddingId) return;
      const rows = await apiRequest<Guest[]>(`/api/guests/wedding/${weddingId}`, token);
      setGuests(rows);
      setSelected(rows.filter((guest) => guest.email).map((guest) => guest._id).slice(0, 3));
    };
    load();
  }, [token]);

  const selectedGuests = useMemo(
    () => guests.filter((guest) => selected.includes(guest._id) && guest.email),
    [guests, selected]
  );

  const sendNow = async (event: FormEvent) => {
    event.preventDefault();
    if (!token || !selectedGuests.length) return;
    const weddingId = await getActiveWeddingId(token);
    if (!weddingId) return;
    try {
      await apiRequest('/api/invitations/bulk/send', token, {
        method: 'POST',
        body: JSON.stringify({
          weddingId,
          message,
          guestEmails: selectedGuests.map((guest) => ({
            email: guest.email,
            name: `${guest.firstName} ${guest.lastName}`
          }))
        })
      });
      setStatus(`Sent to ${selectedGuests.length} guests.`);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Unable to send invitations.');
    }
  };

  return (
    <form className="space-y-6" onSubmit={sendNow}>
      <div>
        <h1 className="text-5xl font-bold">Send Invitations</h1>
        <p className="text-muted-foreground">Review your invitation and select your guest list for distribution.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[0.42fr_0.58fr]">
        <Card className="border-fuchsia-100">
          <CardContent className="p-4">
            <div className="h-[30rem] rounded-xl bg-gradient-to-br from-fuchsia-100 to-violet-100" />
            <p className="mt-3 font-semibold">Modern Elegance</p>
            <p className="text-xs text-muted-foreground">Digital invite set</p>
          </CardContent>
        </Card>
        <Card className="border-fuchsia-100">
          <CardHeader><CardTitle>Guest Selection</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {guests.map((guest) => (
              <label key={guest._id} className="flex items-center justify-between rounded-lg border border-fuchsia-100 p-3">
                <div>
                  <p className="font-medium">{guest.firstName} {guest.lastName}</p>
                  <p className="text-xs text-muted-foreground">{guest.email || 'No email'}</p>
                </div>
                <input
                  type="checkbox"
                  checked={selected.includes(guest._id)}
                  disabled={!guest.email}
                  onChange={(event) =>
                    setSelected((prev) =>
                      event.target.checked ? [...prev, guest._id] : prev.filter((id) => id !== guest._id)
                    )
                  }
                />
              </label>
            ))}
            <textarea
              className="min-h-24 w-full rounded-xl border border-input bg-background px-3 py-2"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
            <div className="grid gap-2 md:grid-cols-2">
              <Input type="date" />
              <Input type="time" />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex gap-3">
        <Button type="button" variant="outline">Save Draft</Button>
        <Button type="submit">Send Now</Button>
      </div>
      {status ? <p className="text-sm text-fuchsia-700">{status}</p> : null}
    </form>
  );
}
