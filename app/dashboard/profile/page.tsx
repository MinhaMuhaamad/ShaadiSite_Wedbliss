'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle } from 'lucide-react';

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

export default function ProfilePage() {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bio: '',
    wedding_date: '',
    venue: '',
    guest_count: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch profile');

      const data = await response.json();
      setProfile(data);
      setFormData({
        name: data.name,
        phone: data.profile?.phone || '',
        bio: data.profile?.bio || '',
        wedding_date: data.profile?.wedding_date || '',
        venue: data.profile?.venue || '',
        guest_count: data.profile?.guest_count?.toString() || ''
      });
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          bio: formData.bio,
          wedding_date: formData.wedding_date || null,
          venue: formData.venue,
          guest_count: formData.guest_count ? parseInt(formData.guest_count) : null
        })
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const data = await response.json();
      setProfile(data.user);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-md flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-50 text-green-700 rounded-md">
                  {success}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile?.email}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Account Type</Label>
                  <Input
                    id="role"
                    type="text"
                    value={profile?.role.charAt(0).toUpperCase() + profile?.role.slice(1)}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={handleChange}
                  className="min-h-24"
                />
              </div>

              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Wedding Information */}
        <Card>
          <CardHeader>
            <CardTitle>Wedding Information</CardTitle>
            <CardDescription>Details about your wedding</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="wedding_date">Wedding Date</Label>
                  <Input
                    id="wedding_date"
                    name="wedding_date"
                    type="date"
                    value={formData.wedding_date}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guest_count">Expected Guest Count</Label>
                  <Input
                    id="guest_count"
                    name="guest_count"
                    type="number"
                    value={formData.guest_count}
                    onChange={handleChange}
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="venue">Venue</Label>
                  <Input
                    id="venue"
                    name="venue"
                    placeholder="Wedding venue location"
                    value={formData.venue}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <Button type="button" onClick={handleSubmit} disabled={saving}>
                {saving ? 'Saving...' : 'Save Wedding Details'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Security */}
        <Card>
          <CardHeader>
            <CardTitle>Account Security</CardTitle>
            <CardDescription>Manage your security settings</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline">Change Password</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
