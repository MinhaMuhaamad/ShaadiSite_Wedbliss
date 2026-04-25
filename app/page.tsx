'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, Users, ShieldCheck, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b border-fuchsia-200/70 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-primary fill-primary" />
              <span className="text-xl font-bold text-foreground">WedBliss</span>
            </Link>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <Link href="/auth/admin-login">
                <Button variant="outline" className="border-fuchsia-200 text-fuchsia-800 hover:bg-fuchsia-50">
                  Admin Login
                </Button>
              </Link>
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

      <section className="relative overflow-hidden pb-16 pt-16 sm:pb-24 sm:pt-24">
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-fuchsia-400/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-violet-500/25 blur-3xl" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-fuchsia-200 bg-white/80 px-4 py-1 text-sm text-fuchsia-700">
              <Sparkles className="h-4 w-4" />
              Designed for Perfection
            </p>
            <h1 className="text-balance bg-gradient-to-r from-fuchsia-800 via-pink-700 to-violet-700 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl md:text-6xl">
              Your Dream Wedding, Perfectly Orchestrated.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              WedBliss is your all-in-one wedding planning studio with elegant design, smart collaboration, and
              real-time organization from first RSVP to final celebration.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/auth/register">
                <Button size="lg" className="text-base">
                  Start Your Journey
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="text-base">
                  Continue Planning
                </Button>
              </Link>
            </div>
          </div>

          <div className="glass-card surface-3d rounded-3xl p-4 sm:p-6">
            <img
              src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80"
              alt="Wedding setup"
              className="h-[420px] w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </section>

      <section id="features" className="bg-white/65 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-foreground sm:text-4xl">The Architecture of Celebration</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            Every tool is crafted to keep your planning smooth, joyful, and absolutely stunning.
          </p>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="glass-card surface-3d rounded-2xl p-5">
                <feature.icon className="mb-3 h-8 w-8 text-primary" />
                <h3 className="text-base font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="glass-card surface-3d rounded-3xl p-5 sm:p-6">
            <img
              src="https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=80"
              alt="Wedding details"
              className="h-72 w-full rounded-2xl object-cover"
            />
            <p className="mt-4 text-lg font-semibold text-foreground">The Artisan Collective</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Discover vendors, compare portfolios, and create dream teams for every event moment.
            </p>
          </div>
          <div className="glass-card surface-3d rounded-3xl p-5 sm:p-6">
            <img
              src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=80"
              alt="Happy wedding couple"
              className="h-72 w-full rounded-2xl object-cover"
            />
            <p className="mt-4 text-lg font-semibold text-foreground">Memories That Last Forever</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Build collaborative albums, secure media backups, and relive your wedding beautifully.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-foreground sm:text-4xl">Investment Into Perfection</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`surface-3d rounded-3xl border p-6 ${
                  plan.highlight
                    ? 'border-fuchsia-300 bg-gradient-to-b from-fuchsia-100/80 to-white shadow-[0_20px_45px_-24px_rgba(168,85,247,0.8)]'
                    : 'glass-card'
                }`}
              >
                <p className="text-sm text-muted-foreground">{plan.name}</p>
                <p className="mt-2 text-3xl font-bold text-foreground">${plan.price}</p>
                <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                  {plan.items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-fuchsia-500" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button className="mt-6 w-full gap-2">
                  Choose Plan <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="surface-3d rounded-3xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-8 py-14 text-center text-white">
            <p className="text-3xl font-semibold text-balance">Elegance is the only beauty that never fades.</p>
            <p className="mt-3 text-white/85">Start planning your wedding with the most aesthetic experience.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/auth/register">
                <Button className="bg-white text-fuchsia-700 hover:bg-white/90">Get Started</Button>
              </Link>
              <Link href="/auth/admin-login">
                <Button variant="outline" className="border-white/60 text-white hover:bg-white/10">
                  Admin Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-fuchsia-200/70 bg-slate-950 text-slate-200">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-10 sm:px-6 md:flex-row lg:px-8">
          <div>
            <p className="text-lg font-semibold text-fuchsia-400">WedBliss</p>
            <p className="mt-2 text-sm text-slate-400">Wedding planning with elegance, intelligence, and collaboration.</p>
          </div>
          <div className="text-sm text-slate-400">
            <p>Resources</p>
            <p className="mt-2">Privacy Policy</p>
            <p>Contact</p>
          </div>
          <div className="text-sm text-slate-400">
            <p>Admin</p>
            <Link href="/auth/admin-login" className="mt-2 block text-fuchsia-300 hover:text-fuchsia-200">
              Platform Manager Login
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

const features = [
  {
    icon: Heart,
    title: 'Wedding Workspace',
    description: 'Build timelines, guest lists, vendor boards, and tasks in one coordinated place.'
  },
  {
    icon: Users,
    title: 'Collaborator Access',
    description: 'Invite family members and planners with role-based access and updates.'
  },
  {
    icon: ShieldCheck,
    title: 'Secure Platform',
    description: 'Protected user accounts, controlled data access, and secure authentication.'
  },
  {
    icon: Sparkles,
    title: 'Aesthetic Experience',
    description: 'Pink-purple visual system with modern cards, depth, and elegant interactions.'
  }
];

const plans = [
  {
    name: 'Starter',
    price: '0',
    items: ['Single wedding project', 'Budget & guest tools', 'Basic timeline'],
    highlight: false
  },
  {
    name: 'Premium',
    price: '49',
    items: ['Everything in Starter', 'Vendor management', 'Memories & media', 'Priority support'],
    highlight: true
  },
  {
    name: 'Enterprise',
    price: '99',
    items: ['Admin analytics access', 'Team management', 'Automation & integrations'],
    highlight: false
  }
];
