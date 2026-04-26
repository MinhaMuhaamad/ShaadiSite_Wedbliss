'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DashboardNavigation from '@/components/dashboard/DashboardNavigation';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Not authenticated - redirect to login
      if (!token) {
        router.push('/auth/login');
        return;
      }

      // Admin users should use admin dashboard
      if (user?.role === 'admin') {
        router.push('/admin/dashboard');
        return;
      }

      // Vendor users should use vendor dashboard
      if (user?.role === 'vendor') {
        router.push('/vendor/dashboard');
        return;
      }

      // Allow bride, groom, family to access this dashboard
      if (user?.role && !['bride', 'groom', 'family'].includes(user.role)) {
        router.push('/auth/login');
      }
    }
  }, [token, user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!token || !user || !['bride', 'groom', 'family'].includes(user.role)) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-fuchsia-50/40 via-background to-background">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col">
        <DashboardNavigation />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
