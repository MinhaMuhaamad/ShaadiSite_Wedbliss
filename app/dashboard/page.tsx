'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Calendar, CheckCircle2, Clock3, DollarSign, Heart, Plus, Users } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-fuchsia-100 bg-gradient-to-r from-violet-300 to-fuchsia-500 text-white">
        <CardContent className="p-7">
          <p className="text-sm text-white/80">Welcome back</p>
          <h1 className="mt-1 text-4xl font-bold">124 Days to Say "I Do"</h1>
          <div className="mt-5 flex gap-8">
            {[
              { label: 'DAYS', value: '124' },
              { label: 'TASKS', value: '18' },
              { label: 'VENDORS', value: '42' }
            ].map((item) => (
              <div key={item.label}>
                <p className="text-3xl font-semibold">{item.value}</p>
                <p className="text-xs tracking-widest text-white/75">{item.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Card className="border-fuchsia-100 bg-white/90">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Next Task</CardTitle>
            <span className="rounded-full bg-fuchsia-100 px-3 py-1 text-xs font-semibold text-fuchsia-700">DUE TODAY</span>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">Final Cake Tasting</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Confirm flavor combinations with "Delite Bakery" and finalize table design by 5:30 pm.
            </p>
            <div className="mt-5 flex gap-3">
              <Button variant="outline">View Details</Button>
              <Button>Mark as Complete</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-fuchsia-100 bg-white/90">
          <CardHeader>
            <CardTitle>Budget Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full border-[12px] border-fuchsia-500 text-center">
              <div>
                <p className="text-3xl font-bold">$42,500</p>
                <p className="text-xs text-muted-foreground">allocated</p>
              </div>
            </div>
            <div className="mt-4 h-2 rounded-full bg-fuchsia-100">
              <div className="h-2 w-[72%] rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500" />
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>spent $30,500</span>
              <span>remaining $12,000</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {quickStats.map((item) => (
          <Card key={item.label} className="border-fuchsia-100 bg-white/85">
            <CardContent className="flex items-center gap-3 p-4">
              <span className="rounded-xl bg-fuchsia-100 p-2 text-fuchsia-700">
                <item.icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-2xl font-bold">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-fuchsia-100 bg-white/90">
          <CardHeader>
            <CardTitle>Activity Stream</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.title} className="flex items-start gap-3 rounded-xl border border-fuchsia-100 bg-fuchsia-50/50 p-3">
                <span className="mt-0.5 rounded-full bg-white p-1.5 text-fuchsia-600 shadow">
                  <activity.icon className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-fuchsia-100 bg-gradient-to-br from-fuchsia-50 to-white">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/weddings/new"><Button className="w-full justify-start gap-2"><Plus className="h-4 w-4" /> New Wedding</Button></Link>
            <Link href="/dashboard/guests"><Button variant="outline" className="w-full justify-start gap-2"><Users className="h-4 w-4" /> Guests</Button></Link>
            <Link href="/dashboard/budget"><Button variant="outline" className="w-full justify-start gap-2"><DollarSign className="h-4 w-4" /> Budget</Button></Link>
            <Link href="/dashboard/timeline"><Button variant="outline" className="w-full justify-start gap-2"><Calendar className="h-4 w-4" /> Timeline</Button></Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const quickStats = [
  { label: 'Tasks Completed', value: '142 / 180', icon: CheckCircle2 },
  { label: 'Vendors Booked', value: '12 / 15', icon: Heart },
  { label: 'Days Remaining', value: '28', icon: Clock3 }
];

const activities = [
  {
    title: 'David marked "Guest List" as 100% complete.',
    description: '2h ago by David',
    icon: CheckCircle2
  },
  {
    title: 'New RSVP received from "The Miller Family".',
    description: '3h ago by RSVP System',
    icon: Users
  },
  {
    title: 'Vendor "Enchanted Florals" uploaded a new contract.',
    description: 'Yesterday at 6:20 PM',
    icon: DollarSign
  }
];
