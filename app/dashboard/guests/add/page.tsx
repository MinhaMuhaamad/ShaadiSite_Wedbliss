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
