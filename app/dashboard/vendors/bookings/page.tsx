'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/lib/context/AuthContext';
import { apiRequest, formatCurrency } from '@/lib/dashboard-api';

type Wedding = { _id: string };
type Booking = {
  _id: string;
  eventDate?: string;
  serviceId?: string;
  vendorId?: { name?: string };
  quotedPrice?: number;
  finalPrice?: number;
  currency?: string;
  status: string;
};

export default function MyBookingsPage() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [status, setStatus] = useState('all');

  const load = async () => {
    if (!token) return;
    const weddings = await apiRequest<Wedding[]>('/api/weddings', token);
    if (!weddings.length) return setBookings([]);
    const result = await apiRequest<Booking[]>(`/api/bookings/wedding/${weddings[0]._id}`, token);
    setBookings(result);
  };

  useEffect(() => {
    load();
    const poll = setInterval(load, 15000);
    return () => clearInterval(poll);
  }, [token]);

  const filtered = useMemo(
    () => bookings.filter((booking) => status === 'all' || booking.status === status),
    [bookings, status]
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Bookings</h1>
      <Card className="glass-card border-fuchsia-100">
        <CardHeader><CardTitle>Booking List</CardTitle></CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
            {['all', 'inquiry', 'quoted', 'confirmed', 'completed', 'cancelled'].map((value) => (
              <Button key={value} size="sm" variant={status === value ? 'default' : 'outline'} onClick={() => setStatus(value)}>
                {value}
              </Button>
            ))}
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Date</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.eventDate?.slice(0, 10) || '-'}</TableCell>
                  <TableCell>{item.serviceId || '-'}</TableCell>
                  <TableCell>{item.vendorId?.name || '-'}</TableCell>
                  <TableCell>{formatCurrency(item.finalPrice || item.quotedPrice || 0, item.currency || 'USD')}</TableCell>
                  <TableCell>{item.status}</TableCell>
                </TableRow>
              ))}
              {!filtered.length ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No bookings found.</TableCell></TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const seed = [
  { id: 1, date: '2026-04-05', vendor: 'Eternal Florals', package: 'Premium', amount: 1200, status: 'Confirmed' },
  { id: 2, date: '2026-04-09', vendor: 'Frame & Bloom', package: 'Signature', amount: 900, status: 'Pending' },
  { id: 3, date: '2026-04-14', vendor: 'Royal Gardens', package: 'Deluxe', amount: 3200, status: 'Completed' }
];

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState(seed);
  const [status, setStatus] = useState('All');
  const filtered = useMemo(() => bookings.filter((b) => status === 'All' || b.status === status), [bookings, status]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Bookings</h1>
      <Card className="glass-card border-fuchsia-100">
        <CardHeader><CardTitle>Booking List</CardTitle></CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
            {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((s) => (
              <Button key={s} size="sm" variant={status === s ? 'default' : 'outline'} onClick={() => setStatus(s)}>
                {s}
              </Button>
            ))}
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking Date</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.package}</TableCell>
                  <TableCell>{item.vendor}</TableCell>
                  <TableCell>${item.amount}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">View</Button>
                      {item.status === 'Pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setBookings(bookings.map((b) => (b.id === item.id ? { ...b, status: 'Cancelled' } : b)))}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
