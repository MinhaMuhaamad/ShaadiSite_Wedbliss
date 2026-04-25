'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, LogOut, Menu } from 'lucide-react';
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
    <header className="bg-card border-b border-border sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-primary fill-primary" />
          <span className="text-lg font-bold text-foreground">WedBliss</span>
        </Link>

        <div className="hidden md:flex items-center gap-4">
          <div className="text-sm">
            <p className="font-semibold text-foreground">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
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
        <div className="md:hidden border-t border-border p-4 space-y-2">
          <div className="text-sm mb-4">
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
