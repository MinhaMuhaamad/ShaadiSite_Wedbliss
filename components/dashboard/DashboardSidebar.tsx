'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, DollarSign, LayoutGrid, Store, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const menuItems = [
  { href: '/dashboard', icon: LayoutGrid, label: 'Command Center' },
  { href: '/dashboard/profile', icon: User, label: 'My Profile' },
  { href: '/dashboard/vendors', icon: Store, label: 'Vendors' },
  { href: '/dashboard/budget', icon: DollarSign, label: 'Budget' },
  { href: '/dashboard/timeline', icon: Calendar, label: 'Calendar' }
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 border-r border-fuchsia-100/80 bg-white/80 md:flex md:flex-col">
      <div className="sticky top-16 flex-1 overflow-auto p-5">
        <div className="mb-7">
          <p className="text-2xl font-bold text-fuchsia-800">WedBliss Planning</p>
          <p className="text-sm text-muted-foreground">Premium Suite</p>
        </div>

        <div className="space-y-2 mb-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all',
                  isActive
                    ? 'bg-gradient-to-r from-fuchsia-600 to-violet-500 text-white shadow-[0_16px_32px_-16px_rgba(192,38,211,0.9)]'
                    : 'text-muted-foreground hover:bg-fuchsia-50 hover:text-fuchsia-700'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <Button className="w-full rounded-xl border border-fuchsia-200 bg-white text-fuchsia-700 shadow-none hover:bg-fuchsia-50">
          Add New Expense
        </Button>
      </div>
    </aside>
  );
}
