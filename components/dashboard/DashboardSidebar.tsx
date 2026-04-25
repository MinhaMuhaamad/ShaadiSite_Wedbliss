'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Users, DollarSign, Calendar, Settings, MessageSquare, Camera, Store } from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { href: '/dashboard', icon: Heart, label: 'Dashboard', role: 'all' },
  { href: '/dashboard/weddings', icon: Heart, label: 'Weddings', role: 'all' },
  { href: '/dashboard/guests', icon: Users, label: 'Guests', role: ['bride', 'family'] },
  { href: '/dashboard/budget', icon: DollarSign, label: 'Budget', role: ['bride', 'family'] },
  { href: '/dashboard/vendors', icon: Store, label: 'Vendors', role: 'all' },
  { href: '/dashboard/timeline', icon: Calendar, label: 'Timeline', role: ['bride', 'family'] },
  { href: '/dashboard/chat', icon: MessageSquare, label: 'Chat', role: 'all' },
  { href: '/dashboard/memories', icon: Camera, label: 'Memories', role: 'all' },
];

const settingsItems = [
  { href: '/dashboard/profile', icon: Settings, label: 'Profile', role: 'all' },
  { href: '/dashboard/settings', icon: Settings, label: 'Collaborators', role: 'all' },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 bg-card border-r border-border flex-col">
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-2 mb-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-muted-foreground hover:bg-muted'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="border-t border-border pt-4">
          {settingsItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm',
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-muted-foreground hover:bg-muted'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
