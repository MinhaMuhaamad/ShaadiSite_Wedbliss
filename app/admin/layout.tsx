'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Not authenticated - redirect to admin login
      if (!token) {
        router.push('/auth/admin-login');
        return;
      }

      // Only admin users can access admin dashboard
      if (user?.role !== 'admin') {
        // Redirect non-admin users based on their role
        if (user?.role === 'vendor') {
          router.push('/vendor/dashboard');
        } else {
          router.push('/dashboard');
        }
      }
    }
  }, [user, token, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  if (!token || user?.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
}

