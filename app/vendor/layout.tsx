'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import VendorSidebar from '@/components/vendor/VendorSidebar';
import VendorNavigation from '@/components/vendor/VendorNavigation';

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

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      <VendorSidebar />
      <div className="flex flex-1 flex-col">
        <VendorNavigation />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
