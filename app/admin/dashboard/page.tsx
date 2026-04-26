'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/context/AuthContext';
import {
  Users,
  Heart,
  DollarSign,
  TrendingUp,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  Settings,
  Bell,
  Plus,
  ArrowRight,
  BarChart3,
  Eye,
  Zap
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalVendors: number;
  totalBookings: number;
  totalRevenue: number;
  platformGrowth: number;
  vendorApprovals: number;
  activeUsers: number;
  conversionRate: number;
}

interface PendingVendor {
  id: string;
  name: string;
  type: string;
  appliedDate: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Platform Manager console: approve vendor registrations, manage user accounts, monitor analytics, configure
          pricing plans, and broadcast announcements.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{ADMIN_STATS.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">{ADMIN_STATS.activeUsers} active today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Total Weddings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{ADMIN_STATS.totalWeddings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Planning & completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Vendors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{ADMIN_STATS.totalVendors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">{ADMIN_STATS.vendorApplications} pending approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${(ADMIN_STATS.totalRevenue / 1000).toFixed(1)}K</div>
            <p className="text-xs text-muted-foreground mt-1">Year to date</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Wedding & Revenue Trends</CardTitle>
            <CardDescription>Last 8 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={WEDDINGS_BY_MONTH}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="weddings" stroke="#d4896b" name="Weddings" />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#8a6482" name="Revenue ($)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Vendor Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Vendors by Category</CardTitle>
            <CardDescription>Distribution across platform</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={VENDOR_CATEGORIES}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {VENDOR_CATEGORIES.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Active Weddings */}
      <Card>
        <CardHeader>
          <CardTitle>Active Weddings</CardTitle>
          <CardDescription>Currently in planning or progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Couple</th>
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-center py-3 px-4 font-semibold">Progress</th>
                </tr>
              </thead>
              <tbody>
                {ACTIVE_WEDDINGS.map((wedding) => (
                  <tr key={wedding.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{wedding.couple}</td>
                    <td className="py-3 px-4">{new Date(wedding.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <Badge variant={wedding.status === 'In Progress' ? 'default' : 'secondary'}>
                        {wedding.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-primary transition-all"
                          style={{ width: `${wedding.progress}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Signups */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Signups</CardTitle>
            <CardDescription>New users and vendors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {RECENT_SIGNUPS.map((signup) => (
                <div key={signup.id} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                  <div>
                    <p className="font-medium text-sm">{signup.name}</p>
                    <p className="text-xs text-muted-foreground">{signup.date}</p>
                  </div>
                  <Badge variant="outline">{signup.type}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Support & Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Platform health</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium">Support Tickets</span>
              <Badge>{ADMIN_STATS.supportTickets} Open</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-border pt-4">
              <span className="text-sm font-medium">Pending Vendor Applications</span>
              <Badge variant="secondary">{ADMIN_STATS.vendorApplications}</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-border pt-4">
              <span className="text-sm font-medium">Database Status</span>
              <Badge className="bg-green-600">Healthy</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-border pt-4">
              <span className="text-sm font-medium">API Uptime</span>
              <Badge className="bg-green-600">99.9%</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
