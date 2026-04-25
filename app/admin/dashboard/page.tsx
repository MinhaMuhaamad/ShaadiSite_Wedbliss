'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Heart, DollarSign, TrendingUp, Calendar } from 'lucide-react';

const ADMIN_STATS = {
  totalUsers: 1247,
  totalWeddings: 523,
  totalVendors: 156,
  totalRevenue: 125650,
  activeUsers: 342,
  vendorApplications: 18,
  supportTickets: 24
};

const WEDDINGS_BY_MONTH = [
  { month: 'Jan', weddings: 32, revenue: 8500 },
  { month: 'Feb', weddings: 45, revenue: 12000 },
  { month: 'Mar', weddings: 38, revenue: 10500 },
  { month: 'Apr', weddings: 52, revenue: 14200 },
  { month: 'May', weddings: 48, revenue: 13800 },
  { month: 'Jun', weddings: 61, revenue: 16500 },
  { month: 'Jul', weddings: 58, revenue: 15800 },
  { month: 'Aug', weddings: 67, revenue: 18200 },
];

const VENDOR_CATEGORIES = [
  { name: 'Photography', value: 35, fill: '#d4896b' },
  { name: 'Catering', value: 28, fill: '#e8b4a8' },
  { name: 'Venue', value: 22, fill: '#d4a5a5' },
  { name: 'Florist', value: 18, fill: '#c9989e' },
  { name: 'DJ/Music', value: 15, fill: '#b88b97' },
  { name: 'Other', value: 38, fill: '#997189' },
];

const ACTIVE_WEDDINGS = [
  { id: 1, couple: 'Sarah & John', date: '2024-06-15', status: 'Planning', progress: 75 },
  { id: 2, couple: 'Emma & Mike', date: '2024-07-20', status: 'In Progress', progress: 90 },
  { id: 3, couple: 'Jessica & Tom', date: '2024-08-10', status: 'Planning', progress: 60 },
  { id: 4, couple: 'Lisa & David', date: '2024-09-05', status: 'Planning', progress: 45 },
  { id: 5, couple: 'Rachel & Chris', date: '2024-10-12', status: 'In Progress', progress: 85 },
];

const RECENT_SIGNUPS = [
  { id: 1, name: 'Amanda Wilson', type: 'Bride', date: '2 hours ago' },
  { id: 2, name: 'Photography Studio', type: 'Vendor', date: '5 hours ago' },
  { id: 3, name: 'Michael Johnson', type: 'Groom', date: '1 day ago' },
  { id: 4, name: 'Elegant Catering', type: 'Vendor', date: '2 days ago' },
  { id: 5, name: 'Nicole Brooks', type: 'Bride', date: '2 days ago' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Platform overview and analytics</p>
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
