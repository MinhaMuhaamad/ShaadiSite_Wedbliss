'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function BrideProfilePage() {
  const { token } = useAuth();
  const [form, setForm] = useState({
    avatar: '',
    weddingDate: '2026-10-24',
    partnerName: '',
    city: 'Lahore',
    theme: 'Bespoke Minimalist',
    bio: 'Dreaming of a pastel garden celebration.',
    notifications: true
  });

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        const [meRes, weddingsRes] = await Promise.all([
          fetch('http://localhost:5000/api/users/me', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('http://localhost:5000/api/weddings', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        if (!meRes.ok || !weddingsRes.ok) return;
        const me = await meRes.json();
        const weddings = await weddingsRes.json();
        const wedding = weddings?.[0];
        setForm((prev) => ({
          ...prev,
          avatar: me?.profile?.avatar || '',
          weddingDate: (me?.profile?.wedding_date || wedding?.weddingDate || prev.weddingDate).slice(0, 10),
          partnerName: wedding?.groomName || prev.partnerName,
          theme: wedding?.theme || prev.theme
        }));
      } catch {
        // ignore demo page load failures
      }
    };
    load();
  }, [token]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Bride Profile</h1>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="glass-card border-fuchsia-100">
          <CardHeader><CardTitle>Profile Overview</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Avatar URL" value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} />
            <Input type="date" value={form.weddingDate} onChange={(e) => setForm({ ...form, weddingDate: e.target.value })} />
            <Input placeholder="Partner Name" value={form.partnerName} onChange={(e) => setForm({ ...form, partnerName: e.target.value })} />
            <Input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <Input placeholder="Wedding Theme" value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })} />
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="min-h-24 w-full rounded-xl border border-input px-3 py-2"
            />
          </CardContent>
        </Card>
        <Card className="glass-card border-fuchsia-100">
          <CardHeader><CardTitle>Completeness & Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex h-32 w-32 items-center justify-center rounded-full border-[10px] border-fuchsia-500">
              <p className="text-2xl font-bold">78%</p>
            </div>
            <div className="rounded-xl border border-fuchsia-100 p-3">
              <p className="font-semibold">Notification Preferences</p>
              <label className="mt-2 flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.notifications} onChange={(e) => setForm({ ...form, notifications: e.target.checked })} />
                Enable alerts and reminders
              </label>
            </div>
            <div className="flex gap-2">
              <Button>Save Profile</Button>
              <Button variant="outline">Change Password</Button>
              <Button variant="outline">Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
