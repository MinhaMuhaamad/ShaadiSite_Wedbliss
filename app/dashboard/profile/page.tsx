'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, Camera, CheckCircle2, Circle, Heart } from 'lucide-react';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  profile: {
    phone?: string;
    avatar?: string;
    bio?: string;
    wedding_date?: string;
    venue?: string;
    guest_count?: number;
  };
  notifications: {
    email_notifications: boolean;
    sms_notifications: boolean;
  };
}

type Wedding = {
  _id: string;
  brideName?: string;
  groomName?: string;
  weddingDate?: string;
};

export default function ProfilePage() {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    wedding_date: '',
    venue: '',
    groomName: ''
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const [userRes, weddingRes] = await Promise.all([
        fetch('http://localhost:5000/api/users/me', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/weddings', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (!userRes.ok) throw new Error('Failed to fetch profile');
      if (!weddingRes.ok) throw new Error('Failed to fetch wedding details');

      const userData = await userRes.json();
      const weddings = (await weddingRes.json()) as Wedding[];
      const activeWedding = weddings?.[0] || null;

      setProfile(userData);
      setWedding(activeWedding);
      setFormData({
        name: userData.name,
        wedding_date: userData.profile?.wedding_date || (activeWedding?.weddingDate ? activeWedding.weddingDate.slice(0, 10) : ''),
        venue: userData.profile?.venue || '',
        groomName: activeWedding?.groomName || ''
      });
    } finally {
      setLoading(false);
    }
  };

  const daysLeft = useMemo(() => {
    const dateStr = formData.wedding_date || (wedding?.weddingDate ? wedding.weddingDate.slice(0, 10) : '');
    if (!dateStr) return null;
    const target = new Date(dateStr).getTime();
    if (Number.isNaN(target)) return null;
    const diff = Math.max(0, target - Date.now());
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [formData.wedding_date, wedding?.weddingDate]);

  const handlePickAvatar = () => fileInputRef.current?.click();

  const handleAvatarSelected = async (file: File | null) => {
    if (!file || !token) return;
    setSaving(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('Failed to read image'));
        reader.readAsDataURL(file);
      });

      const res = await fetch('http://localhost:5000/api/users/avatar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ avatarUrl: dataUrl })
      });
      if (!res.ok) throw new Error('Failed to upload avatar');
      const payload = await res.json();
      setProfile(payload.user);
    } finally {
      setSaving(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const saveGroomName = async () => {
    if (!token || !wedding?._id) return;
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:5000/api/weddings/${wedding._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ groomName: formData.groomName })
      });
      if (!res.ok) throw new Error('Failed to update groom name');
      const payload = await res.json();
      setWedding(payload.wedding);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="relative space-y-6">
      <div className="pointer-events-none absolute -left-20 top-8 h-56 w-56 rounded-full bg-fuchsia-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-8 h-56 w-56 rounded-full bg-violet-400/20 blur-3xl" />

      <div className="grid gap-6 lg:grid-cols-[0.37fr_0.63fr]">
        <Card className="glass-card border-fuchsia-100">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <img
                  src={profile?.profile?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80'}
                  alt="Profile avatar"
                  className="h-28 w-28 rounded-full border-4 border-fuchsia-300 object-cover"
                />
                <button
                  type="button"
                  onClick={handlePickAvatar}
                  disabled={saving}
                  className="absolute -bottom-1 -right-1 rounded-full bg-white p-2 shadow disabled:opacity-60"
                >
                  <Camera className="h-4 w-4 text-fuchsia-700" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleAvatarSelected(e.target.files?.[0] || null)}
                />
              </div>
              <h2 className="mt-4 text-4xl font-bold tracking-tight">{formData.name || user?.name}</h2>
              <p className="text-sm text-muted-foreground">Elite Member Since Jan 2024</p>
              <Button className="mt-6 w-full">Edit Profile Info</Button>
              <Button variant="outline" className="mt-3 w-full">View Public Bio</Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="glass-card border-fuchsia-100">
            <CardContent className="pt-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-fuchsia-700">The Big Day</p>
                  <p className="mt-1 text-2xl font-bold">
                    {formData.wedding_date ? new Date(formData.wedding_date).toLocaleDateString() : 'Set Date'}
                  </p>
                  <p className="mt-3 text-4xl font-bold text-fuchsia-700">{daysLeft ?? '—'}</p>
                  <p className="text-xs text-muted-foreground">Days Left</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Partner Details</p>
                  <div className="mt-2 flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=200&q=80"
                      alt="Partner avatar"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{formData.groomName || 'Add partner name'}</p>
                      <p className="text-xs text-muted-foreground">Groom</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">Contact: {profile?.email}</p>
                  <p className="text-sm text-muted-foreground">{formData.venue || 'Registry Pref: Bespoke Minimalist'}</p>
                  <div className="mt-3 flex gap-2">
                    <Input
                      value={formData.groomName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, groomName: e.target.value }))}
                      placeholder="Groom's name"
                    />
                    <Button type="button" onClick={saveGroomName} disabled={saving || !wedding?._id || !formData.groomName.trim()}>
                      {saving ? 'Saving…' : 'Save'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-fuchsia-100">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Notification Preferences
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {['Vendor Updates', 'Budget Alerts', 'Guest Responses', 'Marketing & Style'].map((item, i) => (
                <div key={item} className="flex items-center justify-between rounded-xl border border-fuchsia-100 bg-white/70 p-3">
                  <div>
                  <p className="text-sm font-medium">{item}</p>
                    <p className="text-xs text-muted-foreground">{i < 2 ? 'Alerts for contract signings & updates' : 'Optional recommendations'}</p>
                  </div>
                  <button className={`h-6 w-10 rounded-full p-0.5 ${i < 2 ? 'bg-fuchsia-500' : 'bg-muted'}`}>
                    <span className={`block h-5 w-5 rounded-full bg-white transition-transform ${i < 2 ? 'translate-x-4' : ''}`} />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-card border-fuchsia-100">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Planning Timeline</CardTitle>
              <button className="text-sm font-medium text-fuchsia-700">View All</button>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                'Cake Tasting Confirmed',
                'Budget Milestone'
              ].map((event, idx) => (
                <div key={event} className="flex gap-3">
                  <span className="mt-1 rounded-full bg-fuchsia-100 p-1.5 text-fuchsia-700">
                    {idx === 0 ? <Heart className="h-3.5 w-3.5" /> : <Bell className="h-3.5 w-3.5" />}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{event}</p>
                    <p className="text-xs text-muted-foreground">
                      {idx === 0 ? 'Scheduled with "Le Sucre Boutique" for Saturday at 2 PM.' : '50% of total wedding budget allocated.'}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="glass-card border-fuchsia-100">
        <CardHeader>
          <CardTitle>Profile Completeness</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full border-[10px] border-fuchsia-500">
            <p className="text-3xl font-bold">75%</p>
          </div>
          <div className="mx-auto mt-5 max-w-sm space-y-2">
            <p className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="h-4 w-4 text-green-600" /> Vendor preferences saved</p>
            <p className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="h-4 w-4 text-green-600" /> Partner details added</p>
            <p className="flex items-center gap-2 text-sm text-muted-foreground"><Circle className="h-4 w-4" /> Payment info pending</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
