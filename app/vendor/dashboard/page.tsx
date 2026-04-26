'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/context/AuthContext';
import {
  Calendar,
  MessageSquare,
  FileText,
  Star,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowRight,
  DollarSign,
  BarChart3,
  Settings
} from 'lucide-react';

interface Booking {
  id: string;
  brideName: string;
  eventDate: string;
  service: string;
  status: 'pending' | 'confirmed' | 'completed';
  amount: number;
}

interface Message {
  id: string;
  from: string;
  preview: string;
  unread: boolean;
  timestamp: string;
}

export default function VendorDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      brideName: 'Priya Sharma',
      eventDate: 'June 15, 2024',
      service: 'Photography',
      status: 'confirmed',
      amount: 2500
    },
    {
      id: '2',
      brideName: 'Anjali Patel',
      eventDate: 'July 20, 2024',
      service: 'Photography',
      status: 'pending',
      amount: 2500
    },
    {
      id: '3',
      brideName: 'Neha Gupta',
      eventDate: 'August 10, 2024',
      service: 'Photography',
      status: 'pending',
      amount: 2500
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      from: 'Priya Sharma',
      preview: 'Can you do pre-wedding shoot? When are you available?',
      unread: true,
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      from: 'Anjali Patel',
      preview: 'Confirm booking for July 20. Need to discuss pricing...',
      unread: true,
      timestamp: '4 hours ago'
    },
    {
      id: '3',
      from: 'Neha Gupta',
      preview: 'Thanks for the invoice. Will send contract soon.',
      unread: false,
      timestamp: '1 day ago'
    }
  ]);

  const stats = {
    activeBookings: 3,
    totalBookings: 18,
    revenue: 45000,
    rating: 4.8,
    reviews: 12,
    unreadMessages: 2,
    responseRate: 98
  };

  const bookingStats = {
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length
  };

  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending Response' },
    confirmed: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Confirmed' },
    completed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, label: 'Completed' }
  };

  return (
    <div className="flex flex-col gap-8 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Service Provider Dashboard</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Welcome back, <span className="font-semibold">{user?.name}</span>! Manage your bookings and grow your business.
          </p>
        </div>
      </div>

      {/* Key Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Active Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeBookings}</div>
            <p className="mt-1 text-xs text-muted-foreground">{bookingStats.pending} pending, {bookingStats.confirmed} confirmed</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{(stats.revenue / 1000).toFixed(0)}K</div>
            <p className="mt-1 text-xs text-muted-foreground">This season</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Star className="h-4 w-4" />
              Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.rating}</div>
            <p className="mt-1 text-xs text-muted-foreground">{stats.reviews} reviews</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              Response Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.responseRate}%</div>
            <p className="mt-1 text-xs text-muted-foreground">Avg response time: 2h</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your profile, bookings, and communication</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col items-center justify-center gap-2 rounded-xl">
              <FileText className="h-5 w-5" />
              <span className="text-xs">Upload Contract</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col items-center justify-center gap-2 rounded-xl">
              <MessageSquare className="h-5 w-5" />
              <span className="text-xs">Messages ({stats.unreadMessages})</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col items-center justify-center gap-2 rounded-xl">
              <Users className="h-5 w-5" />
              <span className="text-xs">Edit Profile</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col items-center justify-center gap-2 rounded-xl">
              <Settings className="h-5 w-5" />
              <span className="text-xs">Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upcoming Bookings */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle>Upcoming Bookings</CardTitle>
              <CardDescription>Manage your scheduled events</CardDescription>
            </div>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bookings.map((booking) => {
                const statusConfig_ = statusConfig[booking.status];
                const StatusIcon = statusConfig_.icon;

                return (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-muted/50 transition"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-foreground">{booking.brideName}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {booking.service}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        📅 {booking.eventDate}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-semibold text-foreground">₹{booking.amount.toLocaleString()}</p>
                        <Badge className={statusConfig_.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig_.label}
                        </Badge>
                      </div>
                      <Button size="sm" variant="ghost">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle>Messages</CardTitle>
              <CardDescription>{stats.unreadMessages} unread</CardDescription>
            </div>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`rounded-lg border p-3 cursor-pointer transition hover:bg-muted ${
                    msg.unread ? 'bg-blue-50 border-blue-200' : 'border-border'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground">{msg.from}</p>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {msg.preview}
                      </p>
                    </div>
                    {msg.unread && (
                      <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{msg.timestamp}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Status & Services */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Status</CardTitle>
            <CardDescription>Your verification and completeness</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground">Verification Status</span>
              <Badge className="bg-green-100 text-green-800">Verified ✓</Badge>
            </div>
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500" style={{ width: '90%' }} />
            </div>
            <p className="text-xs text-muted-foreground">Profile 90% complete. Add more service images to boost visibility.</p>

            <div className="border-t pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Portfolio Images</span>
                <Badge variant="secondary">8 images</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Service Categories</span>
                <Badge variant="secondary">2 categories</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Pricing Set</span>
                <Badge className="bg-green-100 text-green-800">Complete</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Services</CardTitle>
            <CardDescription>Service categories and availability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {['Pre-Wedding Shoots', 'Wedding Day', 'Reception Photos', 'Album Design'].map((service) => (
                <div key={service} className="rounded-lg bg-muted p-3">
                  <p className="text-sm font-medium text-foreground">{service}</p>
                </div>
              ))}
            </div>
            <Button className="w-full mt-2">
              <Plus className="h-4 w-4 mr-2" />
              Add Service Category
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
