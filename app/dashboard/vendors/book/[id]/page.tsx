'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/context/AuthContext';
import { apiRequest, formatCurrency } from '@/lib/dashboard-api';

type Wedding = { _id: string };
type Vendor = { _id: string; name: string; services?: { name: string; basePrice?: number; currency?: string }[] };

export default function BookVendorPage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const details = await apiRequest<Vendor>(`/api/vendors/${id}`, null);
      setVendor(details);
      setServiceName(details.services?.[0]?.name || '');
    };
    load();
  }, [id]);

  const createBooking = async () => {
    if (!token) return setError('Please login to continue.');
    try {
      const weddings = await apiRequest<Wedding[]>('/api/weddings', token);
      if (!weddings.length) throw new Error('Please create a wedding first.');
      const selectedService = vendor?.services?.find((service) => service.name === serviceName);
      await apiRequest('/api/bookings', token, {
        method: 'POST',
        body: JSON.stringify({
          weddingId: weddings[0]._id,
          vendorId: id,
          serviceId: serviceName,
          eventDate: date,
          status: 'confirmed',
          quotedPrice: selectedService?.basePrice || 0,
          notes
        })
      });
      setPaid(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create booking.');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Book Vendor</h1>
      <Card className="glass-card border-fuchsia-100">
        <CardHeader><CardTitle>Package & Deposit</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl border border-fuchsia-100 bg-fuchsia-50/50 p-4">
            <p className="font-semibold">Selected Vendor: {vendor?.name || id}</p>
            {vendor?.services?.length ? (
              <select className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-2" value={serviceName} onChange={(e) => setServiceName(e.target.value)}>
                {vendor.services.map((service) => (
                  <option key={service.name} value={service.name}>
                    {service.name} ({formatCurrency(service.basePrice || 0, service.currency || 'USD')})
                  </option>
                ))}
              </select>
            ) : null}
          </div>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Special notes"
            className="min-h-24 w-full rounded-xl border border-input bg-background px-3 py-2"
          />
          <Button onClick={createBooking}>Confirm Booking</Button>
          {error ? <p className="text-sm text-rose-700">{error}</p> : null}
        </CardContent>
      </Card>
      {paid ? (
        <Card className="border-green-200 bg-green-50">
          <CardHeader><CardTitle>Booking Confirmed</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-green-800">Your booking is saved and visible in real time.</p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
