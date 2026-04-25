'use client';

import Link from 'next/link';
import { Heart, Mail, Sparkles, Star } from 'lucide-react';

const planningLinks = [
  { label: 'Checklist', href: '/dashboard' },
  { label: 'Budgeter', href: '/dashboard/budget' },
  { label: 'Vendors', href: '/dashboard/vendors' },
  { label: 'Guest List', href: '/dashboard/guests' }
];

const supportLinks = [
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' }
];

const legalLinks = [
  { label: 'Real Weddings', href: '/real-weddings' },
  { label: 'Venues', href: '/dashboard/vendors' },
  { label: 'Legal', href: '/terms' }
];

export default function SiteFooter() {
  return (
    <footer className="mt-14 border-t border-fuchsia-100/80 bg-gradient-to-b from-white to-fuchsia-50/40">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold text-foreground">
            <Heart className="h-5 w-5 fill-fuchsia-500 text-fuchsia-500" />
            <span className="bg-gradient-to-r from-fuchsia-600 to-violet-500 bg-clip-text text-transparent">WedBliss</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
            Crafting timeless moments with modern elegance and thoughtful planning tools.
          </p>
          <div className="mt-5 flex gap-3 text-fuchsia-600">
            <span className="rounded-full bg-fuchsia-100 p-2">
              <Heart className="h-4 w-4" />
            </span>
            <span className="rounded-full bg-fuchsia-100 p-2">
              <Star className="h-4 w-4" />
            </span>
            <span className="rounded-full bg-fuchsia-100 p-2">
              <Mail className="h-4 w-4" />
            </span>
          </div>
        </div>

        <div>
          <p className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Sparkles className="h-4 w-4 text-fuchsia-500" />
            Planning
          </p>
          <div className="space-y-2">
            {planningLinks.map((item) => (
              <Link key={item.label} href={item.href} className="block text-sm text-muted-foreground transition-colors hover:text-fuchsia-700">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-4 text-lg font-semibold">Support</p>
          <div className="space-y-2">
            {supportLinks.map((item) => (
              <Link key={item.label} href={item.href} className="block text-sm text-muted-foreground transition-colors hover:text-fuchsia-700">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-4 text-lg font-semibold">Stay Inspired</p>
          <p className="mb-4 text-sm text-muted-foreground">Join our newsletter for luxury wedding planning insights.</p>
          <div className="flex overflow-hidden rounded-full border border-fuchsia-200 bg-white">
            <input
              type="email"
              placeholder="Your Email"
              className="w-full bg-transparent px-4 py-2 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              type="button"
              className="bg-gradient-to-r from-fuchsia-600 to-violet-500 px-5 text-sm font-medium text-white"
            >
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-fuchsia-100/80">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-6 py-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2024 WedBliss Wedding Planning. Crafted for elegant celebrations.</p>
          <div className="flex items-center gap-5">
            {legalLinks.map((item) => (
              <Link key={item.label} href={item.href} className="transition-colors hover:text-fuchsia-700">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
