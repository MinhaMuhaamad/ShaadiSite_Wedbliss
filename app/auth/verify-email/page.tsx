'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MailCheck, RefreshCcw } from 'lucide-react';

export default function VerifyEmailPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const resendEmail = async () => {
    try {
      setLoading(true);
      setStatus('');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok) {
        setStatus(data.message || 'Unable to resend verification email.');
        return;
      }
      setStatus(`Verification email sent. Dev token: ${data.verificationToken}`);
    } catch {
      setStatus('Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fde7ff,_#efe6ff_45%,_#fff)] p-6">
      <div className="mx-auto mt-16 max-w-xl rounded-3xl border border-fuchsia-100 bg-white/90 p-8 shadow-[0_18px_40px_-22px_rgba(192,38,211,0.45)]">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-fuchsia-100 text-fuchsia-700">
          <MailCheck className="h-6 w-6" />
        </div>
        <h1 className="text-center text-3xl font-bold text-fuchsia-950">Verify your email</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          We sent an account activation link to your registered email address.
        </p>

        <div className="mt-6 space-y-3">
          <Input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={resendEmail} disabled={loading || !email} className="w-full gap-2">
            <RefreshCcw className="h-4 w-4" />
            {loading ? 'Resending...' : 'Resend Verification Email'}
          </Button>
        </div>

        {status && <p className="mt-4 rounded-xl bg-fuchsia-50 p-3 text-xs text-fuchsia-800">{status}</p>}

        <p className="mt-6 text-center text-sm">
          Already verified?{' '}
          <Link href="/auth/login" className="font-semibold text-fuchsia-700 hover:underline">
            Continue to login
          </Link>
        </p>
      </div>
    </div>
  );
}
