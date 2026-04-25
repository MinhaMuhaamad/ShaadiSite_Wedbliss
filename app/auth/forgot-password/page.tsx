'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage('');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || 'Request failed.');
        return;
      }
      setMessage(`Reset link generated. Dev token: ${data.resetToken}`);
    } catch {
      setMessage('Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#fde7ff,_#efe6ff_45%,_#fff)] p-6">
      <div className="mx-auto mt-20 max-w-lg rounded-3xl border border-fuchsia-100 bg-white/90 p-8">
        <h1 className="text-3xl font-bold">Forgot Password</h1>
        <p className="mt-2 text-sm text-muted-foreground">Enter your email to receive a secure password reset link.</p>
        <form onSubmit={handleRequest} className="mt-6 space-y-4">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
        {message && <p className="mt-4 rounded-xl bg-fuchsia-50 p-3 text-xs text-fuchsia-800">{message}</p>}
        <p className="mt-6 text-sm">
          Back to{' '}
          <Link href="/auth/login" className="font-semibold text-fuchsia-700 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
