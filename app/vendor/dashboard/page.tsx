'use client';

import { useState, useEffect } from 'react';
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
  Settings,
  Eye,
  TrendingDown,
  Zap,
  Award,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

interface Booking {
  id: string;
  brideName: string;
  groomName: string;
  eventDate: string;
  service: string;
  status: 'pending' | 'confirmed' | 'completed';
  amount: number;
  location: string;
  guestCount: number;
  advance: number;
}

interface Message {
  id: string;
  from: string;
  preview: string;
  unread: boolean;
  timestamp: string;
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
      groomName: 'Rahul Verma',
      eventDate: 'June 15, 2024',
      service: 'Photography',
      status: 'confirmed',
      amount: 75000,
      location: 'New Delhi',
      guestCount: 450,
      advance: 37500
    },
    {
      id: '2',
      brideName: 'Anjali Patel',
      groomName: 'Arjun Singh',
      eventDate: 'July 20, 2024',
      service: 'Photography',
      status: 'pending',
      amount: 85000,
      location: 'Mumbai',
      guestCount: 500,
      advance: 0
    },
    {
      id: '3',
      brideName: 'Neha Gupta',
      groomName: 'Vikram Mehta',
      eventDate: 'August 10, 2024',
      service: 'Photography',
      status: 'pending',
      amount: 80000,
      location: 'Bangalore',
      guestCount: 400,
      advance: 0
    },
    {
      id: '4',
      brideName: 'Sneha Desai',
      groomName: 'Karan Khanna',
      eventDate: 'May 28, 2024',
      service: 'Photography',
      status: 'completed',
      amount: 75000,
      location: 'Pune',
      guestCount: 350,
      advance: 75000
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      from: 'Priya Sharma',
      preview: 'Can you do pre-wedding shoot? We want candid moments...',
      unread: true,
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      from: 'Anjali Patel',
      preview: 'Confirm booking for July 20. Need to discuss pricing and timeline...',
      unread: true,
      timestamp: '4 hours ago'
    },
    {
      id: '3',
      from: 'Neha Gupta',
      preview: 'Thanks for the invoice. Will send contract soon.',
      unread: false,
      timestamp: '1 day ago'
    },
    {
      id: '4',
      from: 'Sneha Desai',
      preview: 'Loved the final photos! Sharing with all guests. Thank you!',
      unread: false,
      timestamp: '3 days ago'
    }
  ]);

  const [stats, setStats] = useState({
    activeBookings: 3,
    totalBookings: 18,
    revenue: 315000,
    rating: 4.8,
    reviews: 42,
    unreadMessages: 2,
    responseRate: 98,
    profileViews: 1240,
    conversionRate: 16.7
  });

  const [budget, setBudget] = useState<number | null>(null);
  const [budgetInput, setBudgetInput] = useState('');
  const [budgetMessage, setBudgetMessage] = useState('');

  const totalBookingValue = bookings.reduce((sum, b) => sum + b.amount, 0);
  const budgetRemaining = budget !== null ? Math.max(0, budget - totalBookingValue) : 0;
  const budgetUsedPct = budget !== null ? Math.min(100, Math.round((totalBookingValue / budget) * 100)) : 0;

  const handleBudgetSave = () => {
    const value = Number(budgetInput);
    if (!value || value <= 0) {
      setBudgetMessage('Please enter a valid budget amount.');
      return;
    }
    setBudget(value);
    setBudgetMessage(`Budget set to ₹${value.toLocaleString()}`);
    localStorage.setItem('vendorBudget', value.toString());
  };

  useEffect(() => {
    const savedBudget = typeof window !== 'undefined' ? localStorage.getItem('vendorBudget') : null;
    if (savedBudget) {
      setBudget(Number(savedBudget));
    }
  }, []);

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        profileViews: prev.profileViews + Math.floor(Math.random() * 5)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const bookingStats = {
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length
  };

  const statusConfig = {
    pending: { 
      bg: 'bg-yellow-50 hover:bg-yellow-100', 
      border: 'border-yellow-200',
      badge: 'bg-yellow-100 text-yellow-800',
      icon: Clock, 
      label: 'Awaiting Response' 
    },
    confirmed: { 
      bg: 'bg-green-50 hover:bg-green-100', 
      border: 'border-green-200',
      badge: 'bg-green-100 text-green-800',
      icon: CheckCircle, 
      label: 'Confirmed' 
    },
    completed: { 
      bg: 'bg-blue-50 hover:bg-blue-100', 
      border: 'border-blue-200',
      badge: 'bg-blue-100 text-blue-800',
      icon: CheckCircle, 
      label: 'Completed' 
    }
  };

  const totalEarnings = bookings.reduce((sum, b) => sum + (b.status === 'completed' ? b.amount : 0), 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Gradient Background */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#D62985] via-[#9333EA] to-[#6043D6] px-6 py-12 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative z-10">
          <h1 className="text-5xl font-bold">Welcome back, {user?.name}! 👋</h1>
          <p className="mt-3 text-lg text-white/90">Manage your bookings, track earnings, and grow your photography business</p>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-8">
        {/* Budget Setup */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-3 border-0 shadow-lg">
            <CardHeader className="border-b border-input-border pb-4">
              <CardTitle className="text-xl">Client Budget</CardTitle>
              <CardDescription>Set your client’s expected budget so all booking insights reflect it.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-end gap-4">
                <div className="flex-1 min-w-[220px]">
                  <label className="text-sm font-medium text-foreground">Budget amount (INR)</label>
                  <input
                    type="number"
                    value={budgetInput}
                    onChange={(event) => setBudgetInput(event.target.value)}
                    placeholder="Enter your budget"
                    className="mt-2 w-full rounded-2xl border border-input bg-background px-3 py-3 text-sm outline-none focus:border-[#D62985]"
                  />
                </div>
                <Button className="min-w-[140px] bg-gradient-to-r from-[#D62985] to-[#6043D6] text-white" onClick={handleBudgetSave}>
                  Save Budget
                </Button>
              </div>
              {budgetMessage && (
                <p className="mt-4 text-sm text-foreground-secondary">{budgetMessage}</p>
              )}
              {budget !== null && (
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-3xl border border-input bg-muted p-4">
                    <p className="text-sm text-foreground-secondary">Budget</p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">₹{budget.toLocaleString()}</p>
                  </div>
                  <div className="rounded-3xl border border-input bg-muted p-4">
                    <p className="text-sm text-foreground-secondary">Used by Bookings</p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">₹{totalBookingValue.toLocaleString()}</p>
                  </div>
                  <div className="rounded-3xl border border-input bg-muted p-4">
                    <p className="text-sm text-foreground-secondary">Remaining</p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">₹{budgetRemaining.toLocaleString()}</p>
                    <p className="mt-2 text-sm text-foreground-secondary">{budgetUsedPct}% used</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Key Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* Active Bookings */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground-secondary">
                <div className="p-2 bg-gradient-to-br from-[#D62985] to-[#6043D6] rounded-lg">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                Active Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-foreground">{stats.activeBookings}</div>
              <p className="mt-2 text-sm text-foreground-secondary">
                <span className="font-semibold">{bookingStats.pending}</span> pending, <span className="font-semibold">{bookingStats.confirmed}</span> confirmed
              </p>
            </CardContent>
          </Card>

          {/* Total Revenue */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground-secondary">
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                  <DollarSign className="h-4 w-4 text-white" />
                </div>
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-foreground">₹{(stats.revenue / 100000).toFixed(1)}L</div>
              <p className="mt-2 text-sm text-foreground-secondary">This season</p>
            </CardContent>
          </Card>

          {/* Rating */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground-secondary">
                <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg">
                  <Star className="h-4 w-4 text-white" />
                </div>
                Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-foreground">{stats.rating}</div>
              <p className="mt-2 text-sm text-foreground-secondary">{stats.reviews} reviews</p>
            </CardContent>
          </Card>

          {/* Profile Views */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground-secondary">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
                  <Eye className="h-4 w-4 text-white" />
                </div>
                Profile Views
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-foreground">{stats.profileViews}</div>
              <p className="mt-2 text-sm text-foreground-secondary">Last 30 days (live)</p>
            </CardContent>
          </Card>

          {/* Response Rate */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground-secondary">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                Response Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-foreground">{stats.responseRate}%</div>
              <p className="mt-2 text-sm text-foreground-secondary">Avg: 2 hours</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Button className="h-24 flex-col items-center justify-center gap-3 rounded-2xl bg-gradient-to-br from-[#D62985] to-[#9333EA] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all">
            <FileText className="h-6 w-6" />
            <span className="text-sm font-semibold">Upload Contract</span>
          </Button>
          <Button className="h-24 flex-col items-center justify-center gap-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all">
            <MessageSquare className="h-6 w-6" />
            <span className="text-sm font-semibold">Messages ({stats.unreadMessages})</span>
          </Button>
          <Button className="h-24 flex-col items-center justify-center gap-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all">
            <Users className="h-6 w-6" />
            <span className="text-sm font-semibold">Edit Profile</span>
          </Button>
          <Button className="h-24 flex-col items-center justify-center gap-3 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all">
            <Settings className="h-6 w-6" />
            <span className="text-sm font-semibold">Settings</span>
          </Button>
        </div>

        {/* Upcoming Bookings & Messages */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Upcoming Bookings */}
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader className="border-b border-input-border pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Upcoming Bookings</CardTitle>
                  <CardDescription className="mt-1">Your scheduled wedding events</CardDescription>
                </div>
                <Button size="sm" className="bg-gradient-to-r from-[#D62985] to-[#6043D6] text-white">
                  <Plus className="h-4 w-4 mr-1" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {bookings.slice(0, 3).map((booking) => {
                  const config = statusConfig[booking.status];
                  const StatusIcon = config.icon;

                  return (
                    <div
                      key={booking.id}
                      className={`rounded-xl border-2 p-4 transition-all cursor-pointer ${config.bg} ${config.border}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-bold text-foreground text-lg">{booking.brideName} & {booking.groomName}</h4>
                            <Badge className={config.badge}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {config.label}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-foreground-secondary">
                              <Calendar className="h-4 w-4" />
                              {booking.eventDate}
                            </div>
                            <div className="flex items-center gap-2 text-foreground-secondary">
                              <MapPin className="h-4 w-4" />
                              {booking.location}
                            </div>
                            <div className="col-span-2 text-foreground-secondary">
                              👥 {booking.guestCount} guests | 📸 {booking.service}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-foreground">₹{(booking.amount / 1000).toFixed(0)}K</p>
                          {budget !== null ? (
                            <p className="text-xs text-foreground-secondary mt-1">
                              This booking uses {Math.round((booking.amount / budget) * 100)}% of budget
                            </p>
                          ) : (
                            <p className="text-xs text-foreground-secondary mt-1">Enter a budget to compare bookings.</p>
                          )}
                          {booking.advance > 0 && (
                            <p className="text-sm text-green-600 font-semibold">Advanced: ₹{(booking.advance / 1000).toFixed(0)}K</p>
                          )}
                          <Button size="sm" variant="ghost" className="mt-2 text-[#D62985]">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Messages */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-input-border pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Messages</CardTitle>
                  <CardDescription className="mt-1">{stats.unreadMessages} unread</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2">
                {messages.slice(0, 4).map((msg) => (
                  <div
                    key={msg.id}
                    className={`rounded-lg p-3 cursor-pointer transition-all border-2 ${
                      msg.unread 
                        ? 'bg-gradient-to-r from-[#D62985]/10 to-[#6043D6]/10 border-[#D62985]/30' 
                        : 'bg-muted border-input-border hover:border-[#D62985]/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground">{msg.from}</p>
                        <p className="mt-1 line-clamp-2 text-xs text-foreground-secondary">
                          {msg.preview}
                        </p>
                      </div>
                      {msg.unread && (
                        <div className="h-3 w-3 rounded-full bg-gradient-to-r from-[#D62985] to-[#6043D6] flex-shrink-0 mt-1 animate-pulse" />
                      )}
                    </div>
                    <p className="mt-2 text-xs text-foreground-secondary">{msg.timestamp}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Status & Services */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Profile Status */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-input-border pb-4">
              <CardTitle className="text-xl">Profile Status</CardTitle>
              <CardDescription>Your verification and completeness</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                <span className="font-semibold text-foreground">Verification</span>
                <Badge className="bg-green-600 text-white">Verified ✓</Badge>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-foreground">Profile Completeness</span>
                  <span className="text-sm font-bold text-[#D62985]">92%</span>
                </div>
                <div className="h-2 bg-input-border rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#D62985] to-[#6043D6]" style={{ width: '92%' }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs text-foreground-secondary font-semibold">Portfolio</p>
                  <p className="text-lg font-bold text-foreground mt-1">24 images</p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs text-foreground-secondary font-semibold">Services</p>
                  <p className="text-lg font-bold text-foreground mt-1">6 active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-input-border pb-4">
              <CardTitle className="text-xl">Your Services</CardTitle>
              <CardDescription>Service offerings & pricing</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {[
                  { name: 'Pre-Wedding Shoots', price: '₹30,000' },
                  { name: 'Full Wedding Day', price: '₹75,000' },
                  { name: 'Reception Photos', price: '₹25,000' },
                  { name: 'Album Design', price: '₹15,000' }
                ].map((service) => (
                  <div key={service.name} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-background-outer to-background border border-input-border hover:border-[#D62985]/50 transition-all">
                    <p className="font-semibold text-foreground text-sm">{service.name}</p>
                    <p className="font-bold text-[#D62985]">{service.price}</p>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 bg-gradient-to-r from-[#D62985] to-[#6043D6] text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add New Service
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
