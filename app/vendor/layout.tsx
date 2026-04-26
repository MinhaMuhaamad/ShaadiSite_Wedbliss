'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Not authenticated - redirect to login
      if (!token) {
        router.push('/auth/login');
        return;
      }

      // Only vendor users can access vendor dashboard
      if (user?.role !== 'vendor') {
        // Redirect non-vendor users based on their role
        if (user?.role === 'admin') {
          router.push('/admin/dashboard');
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

  if (!token || user?.role !== 'vendor') {
    return null;
  }

  return <>{children}</>;
}
