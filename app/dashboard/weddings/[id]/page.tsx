'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, DollarSign, Calendar, MapPin } from 'lucide-react';

interface WeddingStats {
  weddingId: string;
  brideName: string;
  groomName: string;
  weddingDate: string;
  venue: {
    name: string;
  };
  status: string;
  totalInvited: number;
  acceptedRsvp: number;
  totalConfirmedGuests: number;
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  completionPercentage: number;
}

export default function WeddingDetailsPage() {
  const { token } = useAuth();
  const params = useParams();
  const weddingId = params.id as string;
  const [stats, setStats] = useState<WeddingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (weddingId) {
      fetchWeddingStats();
    }
  }, [weddingId]);

  const fetchWeddingStats = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/weddings/${weddingId}/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch wedding stats');

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError('Failed to load wedding details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error || !stats) {
    return <div className="p-6 text-red-600">{error || 'Wedding not found'}</div>;
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl">
      <Link href="/dashboard/weddings" className="flex items-center gap-2 text-primary hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Weddings
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {stats.brideName} & {stats.groomName}
        </h1>
        <p className="text-muted-foreground flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {formatDate(stats.weddingDate)}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Completion */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Planning Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-foreground">{stats.completionPercentage}%</div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${stats.completionPercentage}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guests */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Guest Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">{stats.acceptedRsvp}</div>
              <div className="text-xs text-muted-foreground">
                Accepted out of {stats.totalInvited}
              </div>
              <div className="text-sm font-medium text-primary mt-2">
                {stats.totalConfirmedGuests} total guests
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Budget Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(stats.remainingBudget)}
              </div>
              <div className="text-xs text-muted-foreground">
                Remaining
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Spent: {formatCurrency(stats.totalSpent)} of {formatCurrency(stats.totalBudget)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Venue */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Venue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium text-foreground">
              {stats.venue?.name || 'TBD'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Actions */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Planning Tasks</CardTitle>
              <CardDescription>Quick access to key planning areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Link href={`/dashboard/guests?wedding=${weddingId}`}>
                  <Button variant="outline" className="w-full justify-center gap-2">
                    <Users className="w-4 h-4" />
                    Manage Guests
                  </Button>
                </Link>
                <Link href={`/dashboard/budget?wedding=${weddingId}`}>
                  <Button variant="outline" className="w-full justify-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Budget Tracker
                  </Button>
                </Link>
                <Link href={`/dashboard/vendors?wedding=${weddingId}`}>
                  <Button variant="outline" className="w-full justify-center gap-2">
                    Vendors
                  </Button>
                </Link>
                <Link href={`/dashboard/timeline?wedding=${weddingId}`}>
                  <Button variant="outline" className="w-full justify-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Timeline
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Budget Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Budget Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Budget</span>
                  <span className="font-semibold">{formatCurrency(stats.totalBudget)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Spent</span>
                  <span className="font-semibold text-destructive">{formatCurrency(stats.totalSpent)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="font-medium">Remaining</span>
                  <span className="font-semibold text-primary">{formatCurrency(stats.remainingBudget)}</span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className="bg-primary h-3 rounded-full transition-all"
                  style={{ width: `${(stats.totalSpent / stats.totalBudget) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {((stats.totalSpent / stats.totalBudget) * 100).toFixed(1)}% of budget used
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Guest Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Total Invited</span>
                  <span className="font-semibold">{stats.totalInvited}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Accepted</span>
                  <span className="font-semibold text-green-600">{stats.acceptedRsvp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Confirmed Guests</span>
                  <span className="font-semibold">{stats.totalConfirmedGuests}</span>
                </div>
              </div>
              <Link href={`/dashboard/guests?wedding=${weddingId}`}>
                <Button variant="outline" className="w-full">
                  View Guest List
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${
                stats.status === 'completed' ? 'bg-green-100 text-green-700' :
                stats.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {stats.status}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
