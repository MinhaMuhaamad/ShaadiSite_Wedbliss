'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Sparkles } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'bride'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Registration failed');
        return;
      }

      localStorage.setItem('registeredEmail', formData.email);
      router.push('/auth/verify-email');
    } catch (err) {
      setError('Connection error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_bottom_right,_#f8d8ff,_#e6ddff_35%,_#f4efff_70%,_#ffffff)] p-4 md:p-8">
      <div className="pointer-events-none absolute -left-20 top-16 h-72 w-72 rounded-full bg-fuchsia-400/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-violet-500/25 blur-3xl" />

      <div className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/60 bg-white/60 shadow-[0_24px_80px_-24px_rgba(123,31,162,0.45)] backdrop-blur-xl md:grid-cols-2">
        <div className="relative flex items-center justify-center p-5 sm:p-8">
          <div className="w-full max-w-md rounded-3xl border border-fuchsia-100 bg-white/90 p-6 shadow-[0_16px_45px_-20px_rgba(147,51,234,0.5)]">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-fuchsia-950">Create account</h1>
                <p className="mt-1 text-sm text-fuchsia-700/80">Make your wedding planning workspace.</p>
              </div>
              <Sparkles className="h-5 w-5 text-fuchsia-500" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-600">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-fuchsia-900">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="h-11 rounded-xl border-fuchsia-200 bg-white/90 focus-visible:ring-fuchsia-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-fuchsia-900">Role</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger disabled={loading} className="h-11 rounded-xl border-fuchsia-200 bg-white/90 focus:ring-fuchsia-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bride">Bride/Groom</SelectItem>
                      <SelectItem value="family">Family</SelectItem>
                      <SelectItem value="vendor">Vendor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-fuchsia-900">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="h-11 rounded-xl border-fuchsia-200 bg-white/90 focus-visible:ring-fuchsia-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-fuchsia-900">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="h-11 rounded-xl border-fuchsia-200 bg-white/90 focus-visible:ring-fuchsia-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-fuchsia-900">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="h-11 rounded-xl border-fuchsia-200 bg-white/90 focus-visible:ring-fuchsia-400"
                />
              </div>

              <Button
                type="submit"
                className="h-11 w-full rounded-xl bg-gradient-to-r from-fuchsia-600 via-pink-500 to-violet-500 text-white shadow-lg shadow-fuchsia-400/30 transition hover:opacity-95"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create an Account'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-fuchsia-700/85">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-semibold text-fuchsia-900 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div
          className="relative hidden min-h-[720px] flex-col justify-between p-8 text-white md:flex"
          style={{
            backgroundImage:
              "linear-gradient(130deg, rgba(52,14,86,0.45), rgba(115,45,161,0.3)), url('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Heart className="h-5 w-5 fill-current" />
            WedBliss
          </div>
          <div className="rounded-3xl border border-white/30 bg-black/20 p-6 backdrop-blur-md">
            <p className="text-4xl font-semibold leading-tight">Create your vision.</p>
            <p className="mt-3 text-sm text-white/85">
              Build your timeline, manage guests, and design every detail with a modern elegant experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
