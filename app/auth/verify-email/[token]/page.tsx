'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function VerifyTokenPage() {
  const { token } = useParams<{ token: string }>();
  const [message, setMessage] = useState('Verifying your email...');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/auth/verify-email/${token}`);
        const data = await response.json();
        setMessage(data.message || 'Verification completed.');
        setSuccess(response.ok);
      } catch {
        setMessage('Unable to verify email.');
      }
    };
    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fde7ff,_#efe6ff_45%,_#fff)] p-6">
      <div className="mx-auto mt-20 max-w-xl rounded-3xl border border-fuchsia-100 bg-white/90 p-8 text-center">
        <h1 className="text-3xl font-bold">Email Verification</h1>
        <p className="mt-4 text-sm">{message}</p>
        <Link href="/auth/login"><Button className="mt-6">{success ? 'Continue to Login' : 'Back to Login'}</Button></Link>
      </div>
    </div>
  );
}
