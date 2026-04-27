'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser, setToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      // Save token and user to localStorage and context
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Update context
      setToken(data.token);
      setUser(data.user);

      // Role-based redirect
      if (data.user?.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (data.user?.role === 'vendor') {
        router.push('/vendor/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Connection error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_#f8d8ff,_#e6ddff_35%,_#f4efff_70%,_#ffffff)] p-4 md:p-8">
      <div className="pointer-events-none absolute -left-28 top-20 h-72 w-72 rounded-full bg-fuchsia-400/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-20 h-80 w-80 rounded-full bg-violet-400/30 blur-3xl" />

      <div className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/60 bg-white/60 shadow-[0_24px_80px_-24px_rgba(123,31,162,0.45)] backdrop-blur-xl md:grid-cols-2">
        <div
          className="relative hidden min-h-[720px] flex-col justify-between p-8 text-white md:flex"
          style={{
            backgroundImage:
              "linear-gradient(150deg, rgba(41,10,73,0.45), rgba(112,34,132,0.25)), url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Heart className="h-5 w-5 fill-current" />
            WedBliss
          </div>
          <div className="rounded-3xl border border-white/30 bg-black/20 p-6 backdrop-blur-md">
            <p className="text-4xl font-semibold leading-tight">Celebrate every wedding moment in style.</p>
            <p className="mt-3 text-sm text-white/85">
              Elegant planning tools, beautiful timeline views, and seamless collaboration for your big day.
            </p>
          </div>
        </div>

        <div className="relative flex items-center justify-center p-5 sm:p-8">
          <div className="w-full max-w-md rounded-3xl border border-fuchsia-100 bg-white/90 p-6 shadow-[0_16px_45px_-20px_rgba(147,51,234,0.5)]">
            <div className="mb-7 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-fuchsia-950">Welcome back</h1>
                <p className="mt-1 text-sm text-fuchsia-700/80">Sign in to continue planning.</p>
              </div>
              <Sparkles className="h-5 w-5 text-fuchsia-500" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-600">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-fuchsia-900">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="h-11 rounded-xl border-fuchsia-200 bg-white/90 focus-visible:ring-fuchsia-400"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-fuchsia-900">Password</Label>
                  <Link href="/auth/forgot-password" className="text-xs text-fuchsia-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-fuchsia-700/85">
              Don&apos;t have an account?{' '}
              <Link href="/auth/register" className="font-semibold text-fuchsia-900 hover:underline">
                Sign up
              </Link>
            </p>

            <p className="mt-2 text-center text-xs text-fuchsia-700/85">
              Platform manager?{' '}
              <Link href="/auth/admin-login" className="font-semibold text-fuchsia-900 hover:underline">
                Login as Admin
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
