'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Bell, Heart, LogOut, Menu, Settings } from 'lucide-react';
import { useState } from 'react';

export default function DashboardNavigation() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-fuchsia-100 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-primary fill-primary" />
          <span className="bg-gradient-to-r from-fuchsia-600 to-violet-500 bg-clip-text text-lg font-bold text-transparent">WedBliss</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <Link href="/dashboard" className="transition-colors hover:text-fuchsia-600">Dashboard</Link>
          <Link href="/dashboard/vendors" className="transition-colors hover:text-fuchsia-600">Vendors</Link>
          <Link href="/dashboard/budget" className="border-b-2 border-fuchsia-500 pb-1 font-semibold text-fuchsia-700">Budget</Link>
          <Link href="/dashboard/timeline" className="transition-colors hover:text-fuchsia-600">Planning</Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-fuchsia-50 hover:text-fuchsia-600">
            <Bell className="h-4 w-4" />
          </button>
          <button className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-fuchsia-50 hover:text-fuchsia-600">
            <Settings className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2 rounded-full border border-fuchsia-100 bg-white px-2 py-1">
            <img
              src="https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=100&q=80"
              alt="User avatar"
              className="h-8 w-8 rounded-full border border-fuchsia-200 object-cover"
            />
            <div className="text-xs">
              <p className="font-semibold text-foreground">{user?.name}</p>
              <p className="capitalize text-muted-foreground">{user?.role}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4" />
            Exit
          </Button>
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="space-y-2 border-t border-fuchsia-100 p-4 md:hidden">
          <div className="mb-4 text-sm">
            <p className="font-semibold text-foreground">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      )}
    </header>
  );
}
