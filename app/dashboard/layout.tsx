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
  const { user, token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !token) {
      router.push('/auth/login');
    }
  }, [token, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!token) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNavigation />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
