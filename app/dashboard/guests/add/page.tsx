'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
  relationship?: string;
  side?: string;
  mealChoice?: string;
  notes?: string;
};

export default function AddEditGuestPage() {
  const { token } = useAuth();
  const params = useSearchParams();
  const guestId = params.get('id');
  const isEdit = Boolean(guestId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    relationship: '',
    side: 'bride',
    mealChoice: '',
    notes: ''
  });

  useEffect(() => {
    if (!token || !guestId) return;
    const load = async () => {
      setLoading(true);
      try {
        const weddingId = await getActiveWeddingId(token);
        if (!weddingId) return;
        const guests = await apiRequest<Guest[]>(`/api/guests/wedding/${weddingId}`, token);
        const found = guests.find((guest) => guest._id === guestId);
        if (!found) return;
        setForm({
          firstName: found.firstName || '',
          lastName: found.lastName || '',
          phone: found.phone || '',
          email: found.email || '',
          relationship: found.relationship || '',
          side: found.side || 'bride',
          mealChoice: found.mealChoice || '',
          notes: found.notes || ''
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token, guestId]);

  const saveGuest = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) return;
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        email: form.email,
        relationship: form.relationship || 'other',
        side: form.side,
        mealChoice: form.mealChoice,
        notes: form.notes
      };

      if (isEdit && guestId) {
        await apiRequest(`/api/guests/${guestId}`, token, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } else {
        const weddingId = await getActiveWeddingId(token);
        if (!weddingId) throw new Error('Please create a wedding first.');
        await apiRequest('/api/guests', token, {
          method: 'POST',
          body: JSON.stringify({ ...payload, weddingId })
        });
      }
      setSuccess(isEdit ? 'Guest updated successfully.' : 'Guest created successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save guest.');
    } finally {
      setLoading(false);
    }
  };

  const deleteGuest = async () => {
    if (!token || !guestId) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await apiRequest(`/api/guests/${guestId}`, token, { method: 'DELETE' });
      setSuccess('Guest deleted successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete guest.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Add / Edit Guest</h1>
        <Link href="/dashboard/guests"><Button variant="outline">Back to Guests</Button></Link>
      </div>
      <Card className="glass-card border-fuchsia-100">
        <CardHeader><CardTitle>Guest Form</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={saveGuest} className="grid gap-4 md:grid-cols-2">
            <Input placeholder="First Name" value={form.firstName} onChange={(event) => setForm({ ...form, firstName: event.target.value })} required />
            <Input placeholder="Last Name" value={form.lastName} onChange={(event) => setForm({ ...form, lastName: event.target.value })} required />
            <Input placeholder="Phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
            <Input placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            <select className="rounded-xl border border-input bg-background px-3 py-2" value={form.side} onChange={(event) => setForm({ ...form, side: event.target.value })}>
              <option value="bride">Bride Side</option>
              <option value="groom">Groom Side</option>
              <option value="both">Both</option>
            </select>
            <Input placeholder="Relationship" value={form.relationship} onChange={(event) => setForm({ ...form, relationship: event.target.value })} />
            <Input placeholder="Meal Preference" value={form.mealChoice} onChange={(event) => setForm({ ...form, mealChoice: event.target.value })} />
            <textarea
              placeholder="Notes"
              value={form.notes}
              onChange={(event) => setForm({ ...form, notes: event.target.value })}
              className="min-h-24 rounded-xl border border-input bg-background px-3 py-2 md:col-span-2"
            />
            <div className="md:col-span-2 flex gap-2">
              <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Guest'}</Button>
              <Button type="button" variant="outline" disabled={!isEdit || loading} onClick={deleteGuest}>Delete</Button>
            </div>
          </form>
        </CardContent>
      </Card>
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}
      {success ? <p className="text-sm text-green-700">{success}</p> : null}
    </div>
  );
}
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AddEditGuestPage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    relation: '',
    side: 'Bride',
    events: 'Mehndi, Barat',
    meal: 'Veg'
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add / Edit Guest</h1>
      <Card className="glass-card border-fuchsia-100">
        <CardHeader><CardTitle>Guest Form</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input placeholder="Relation" value={form.relation} onChange={(e) => setForm({ ...form, relation: e.target.value })} />
          <Input placeholder="Side (Bride/Groom)" value={form.side} onChange={(e) => setForm({ ...form, side: e.target.value })} />
          <Input placeholder="Event assignments" value={form.events} onChange={(e) => setForm({ ...form, events: e.target.value })} />
          <Input placeholder="Meal preference" value={form.meal} onChange={(e) => setForm({ ...form, meal: e.target.value })} />
          <div className="md:col-span-2 flex gap-2">
            <Button onClick={() => setSaved(true)}>Save Guest</Button>
            <Button variant="outline">Delete</Button>
          </div>
        </CardContent>
      </Card>
      {saved && <p className="text-sm text-green-700">Guest saved successfully.</p>}
    </div>
  );
}
