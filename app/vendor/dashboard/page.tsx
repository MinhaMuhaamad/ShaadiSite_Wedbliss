'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/context/AuthContext';
import { Calendar, MessageSquare, FileText, Star, TrendingUp, Users } from 'lucide-react';

export default function VendorDashboard() {
  const { user } = useAuth();

  const VENDOR_STATS = {
    activeBookings: 5,
    totalBookings: 23,
    revenue: 12500,
    rating: 4.8,
    reviews: 18,
    messages: 7
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Service Provider Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome, {user?.name}! Manage your bookings, chat with brides, and upload contracts.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Active Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{VENDOR_STATS.activeBookings}</div>
            <p className="text-xs text-muted-foreground mt-1">Out of {VENDOR_STATS.totalBookings} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${(VENDOR_STATS.revenue / 1000).toFixed(1)}K</div>
            <p className="text-xs text-muted-foreground mt-1">This season</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Star className="w-4 h-4" />
              Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{VENDOR_STATS.rating}</div>
            <p className="text-xs text-muted-foreground mt-1">{VENDOR_STATS.reviews} reviews</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your profile and services</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
              <FileText className="w-5 h-5 mb-1" />
              <span className="text-sm">Upload Contracts</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
              <MessageSquare className="w-5 h-5 mb-1" />
              <span className="text-sm">View Messages</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
              <Users className="w-5 h-5 mb-1" />
              <span className="text-sm">Edit Profile</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
              <Calendar className="w-5 h-5 mb-1" />
              <span className="text-sm">View Bookings</span>
            </Button>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Status</CardTitle>
            <CardDescription>Current verification status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Verification</span>
                <Badge className="bg-green-600">Verified</Badge>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Bookings Active</span>
                <Badge variant="secondary">{VENDOR_STATS.activeBookings}</Badge>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Response Rate</span>
                <Badge className="bg-blue-600">98%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Bookings</CardTitle>
          <CardDescription>Your scheduled weddings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((booking) => (
              <div key={booking} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition">
                <div>
                  <p className="font-medium">Wedding #{booking}</p>
                  <p className="text-sm text-muted-foreground">June {10 + booking}, 2024</p>
                </div>
                <Badge>Pending Response</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
