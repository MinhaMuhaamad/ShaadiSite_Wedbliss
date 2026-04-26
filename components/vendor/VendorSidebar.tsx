'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  User,
  Calendar,
  MessageCircle,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Store,
  Star,
  DollarSign,
  Clock,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';

const vendorMenuItems = [
  { href: '/vendor/dashboard', icon: LayoutGrid, label: 'Dashboard' },
  { href: '/vendor/profile', icon: User, label: 'My Profile' },
  { href: '/vendor/bookings', icon: Calendar, label: 'Bookings' },
  { href: '/vendor/messages', icon: MessageCircle, label: 'Messages' },
  { href: '/vendor/contracts', icon: FileText, label: 'Contracts' },
  { href: '/vendor/portfolio', icon: Store, label: 'Portfolio' },
  { href: '/vendor/reviews', icon: Star, label: 'Reviews & Ratings' },
  { href: '/vendor/earnings', icon: DollarSign, label: 'Earnings' },
  { href: '/vendor/availability', icon: Clock, label: 'Availability' },
  { href: '/vendor/notifications', icon: Bell, label: 'Notifications' },
  { href: '/vendor/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/vendor/settings', icon: Settings, label: 'Settings' }
];

export default function VendorSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <aside className="hidden w-72 border-r border-border bg-card md:flex md:flex-col">
      <div className="sticky top-16 flex-1 overflow-auto p-5">
        <div className="mb-7">
          <p className="text-2xl font-bold text-primary">WedBliss Vendor</p>
          <p className="text-sm text-muted-foreground">Service Provider Suite</p>
        </div>

        <div className="space-y-2 mb-6">
          {vendorMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all',
                  isActive
                    ? 'bg-gradient-to-r from-primary to-purple-500 text-white shadow-lg'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="border-t pt-4">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start text-destructive hover:text-destructive"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
}
