'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, DollarSign, LayoutGrid, MessageCircle, Store, User, Users, WalletCards, CheckSquare, Heart, Mail, FileText, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const menuItems = [
  { href: '/dashboard', icon: LayoutGrid, label: 'Wedding Dashboard' },
  { href: '/dashboard/profile', icon: User, label: 'My Profile' },
  { href: '/dashboard/weddings', icon: Calendar, label: 'Wedding Setup' },
  { href: '/dashboard/my-events', icon: Calendar, label: 'My Events' },
  { href: '/dashboard/checklist', icon: CheckSquare, label: 'Checklist' },
  { href: '/dashboard/calendar', icon: Calendar, label: 'Planner Calendar' },
  { href: '/dashboard/invitation-studio', icon: Mail, label: 'Invitation Studio' },
  { href: '/dashboard/invitation-studio/editor', icon: Mail, label: 'Invitation Editor' },
  { href: '/dashboard/invitation-studio/send', icon: Mail, label: 'Send Invitations' },
  { href: '/dashboard/inbox', icon: Inbox, label: 'Inbox' },
  { href: '/dashboard/site-builder', icon: LayoutGrid, label: 'Site Builder' },
  { href: '/dashboard/contracts', icon: FileText, label: 'Contracts' },
  { href: '/dashboard/guests', icon: Users, label: 'Guest Management' },
  { href: '/dashboard/guests/add', icon: Users, label: 'Add / Edit Guest' },
  { href: '/dashboard/guests/rsvp', icon: CheckSquare, label: 'RSVP Tracker' },
  { href: '/dashboard/guests/seating', icon: Users, label: 'Seating Plan' },
  { href: '/dashboard/budget', icon: DollarSign, label: 'Budget Overview' },
  { href: '/dashboard/budget/add-expense', icon: DollarSign, label: 'Add Expense' },
  { href: '/dashboard/budget/expenses', icon: WalletCards, label: 'Expense History' },
  { href: '/dashboard/vendors', icon: Store, label: 'Browse Vendors' },
  { href: '/dashboard/vendors/compare', icon: Store, label: 'Compare Vendors' },
  { href: '/dashboard/vendors/bookings', icon: Store, label: 'My Bookings' },
  { href: '/dashboard/timeline', icon: Calendar, label: 'Checklist Timeline' },
  { href: '/dashboard/chat', icon: MessageCircle, label: 'Messages' },
  { href: '/dashboard/memories', icon: Heart, label: 'Memories' }
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

        <Link href="/dashboard/budget/add-expense">
          <Button className="w-full rounded-xl border border-fuchsia-200 bg-white text-fuchsia-700 shadow-none hover:bg-fuchsia-50">
            Add New Expense
          </Button>
        </Link>
      </div>
    </aside>
  );
}
