'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { Bell, User, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VendorNavigation() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <Link href="/vendor/dashboard" className="text-xl font-bold text-primary">
          WedBliss
        </Link>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground">Service Provider</p>
            </div>

            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
              {user?.name?.charAt(0) || 'V'}
            </div>
          </div>

          <Button variant="ghost" size="icon" asChild>
            <Link href="/vendor/settings">
              <Settings className="h-5 w-5" />
            </Link>
          </Button>

          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
