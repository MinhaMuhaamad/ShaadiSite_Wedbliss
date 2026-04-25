'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Heart, Users, DollarSign, Calendar } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-muted-foreground">Here&apos;s your wedding planning hub</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link href="/dashboard/weddings/new">
          <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
            <Heart className="w-6 h-6 text-primary" />
            <span>New Wedding</span>
          </Button>
        </Link>
        <Link href="/dashboard/guests">
          <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            <span>Guests</span>
          </Button>
        </Link>
        <Link href="/dashboard/budget">
          <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
            <DollarSign className="w-6 h-6 text-primary" />
            <span>Budget</span>
          </Button>
        </Link>
        <Link href="/dashboard/timeline">
          <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
            <Calendar className="w-6 h-6 text-primary" />
            <span>Timeline</span>
          </Button>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>Complete these steps to get your wedding planned</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Heart className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Create your wedding</h3>
                  <p className="text-sm text-muted-foreground">Set your wedding date, venue, and theme</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-1">
                  <Users className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Add guests</h3>
                  <p className="text-sm text-muted-foreground">Create your guest list and send invitations</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-1">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Set your budget</h3>
                  <p className="text-sm text-muted-foreground">Allocate funds and track expenses</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-1">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Create timeline</h3>
                  <p className="text-sm text-muted-foreground">Plan your wedding day hour by hour</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Weddings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">0</div>
              <p className="text-sm text-muted-foreground">weddings planned</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Guest Count</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">0</div>
              <p className="text-sm text-muted-foreground">invited guests</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Budget Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">$0</div>
              <p className="text-sm text-muted-foreground">total allocated</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
