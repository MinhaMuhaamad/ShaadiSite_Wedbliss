'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    try {
      setLoading(true);
      setMessage('');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || 'Unable to reset password.');
        return;
      }
      setMessage('Password reset successful. Redirecting to login...');
      setTimeout(() => router.push('/auth/login'), 1400);
    } catch {
      setMessage('Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fde7ff,_#efe6ff_45%,_#fff)] p-6">
      <div className="mx-auto mt-20 max-w-lg rounded-3xl border border-fuchsia-100 bg-white/90 p-8">
        <h1 className="text-3xl font-bold">Reset Password</h1>
        <p className="mt-2 text-sm text-muted-foreground">Set your new password using your secure reset token.</p>
        <form onSubmit={handleReset} className="mt-6 space-y-4">
          <Input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Updating...' : 'Set New Password'}
          </Button>
        </form>
        {message && <p className="mt-4 rounded-xl bg-fuchsia-50 p-3 text-xs text-fuchsia-800">{message}</p>}
      </div>
    </div>
  );
}
