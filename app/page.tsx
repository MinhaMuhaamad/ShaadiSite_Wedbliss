'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, Users, DollarSign, Calendar, Camera, MessageSquare } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-fuchsia-200/70 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-primary fill-primary" />
              <span className="text-xl font-bold text-foreground">WedBliss</span>
            </Link>
            <div className="flex gap-4">
              <Link href="/auth/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-fuchsia-400/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-violet-500/25 blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-6 text-pretty bg-gradient-to-r from-fuchsia-800 via-pink-700 to-violet-700 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl md:text-6xl">
              Plan Your Perfect Wedding
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-balance">
              From budgets to guest lists, seating charts to vendor management. WedBliss makes wedding planning seamless and stress-free.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="text-base">
                  Start Planning
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="text-base">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-foreground mb-12 text-balance">
            Everything You Need
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.id} className="glass-card surface-3d rounded-2xl p-6">
                <feature.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32">
        <div className="glass-card surface-3d max-w-3xl mx-auto rounded-3xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 text-balance">
            Ready to plan your big day?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 text-balance">
            Join thousands of couples who've used WedBliss to create the perfect wedding.
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="text-base">
              Sign Up Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-fuchsia-200/70 bg-white/70 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Security</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Terms</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Connect</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Twitter</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Instagram</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Facebook</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2024 WedBliss. All rights reserved.</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

const features = [
  {
    id: 1,
    icon: DollarSign,
    title: 'Budget Management',
    description: 'Track expenses across categories, set spending limits, and manage payments to vendors in one place.'
  },
  {
    id: 2,
    icon: Users,
    title: 'Guest Management',
    description: 'Create guest lists, send digital invitations, track RSVPs, and manage dietary preferences.'
  },
  {
    id: 3,
    icon: Heart,
    title: 'Vendor Marketplace',
    description: 'Browse verified vendors, compare quotes, manage bookings, and communicate directly.'
  },
  {
    id: 4,
    icon: Calendar,
    title: 'Timeline Planning',
    description: 'Create detailed wedding day timeline, set reminders, and coordinate with your team.'
  },
  {
    id: 5,
    icon: MessageSquare,
    title: 'Real-time Chat',
    description: 'Communicate instantly with family, vendors, and your planning team.'
  },
  {
    id: 6,
    icon: Camera,
    title: 'Memory Album',
    description: 'Upload and share photos, create shared albums, and preserve memories forever.'
  }
];
