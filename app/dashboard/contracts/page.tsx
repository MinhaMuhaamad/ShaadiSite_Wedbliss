'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/context/AuthContext';
import { apiRequest, getActiveWeddingId, formatCurrency } from '@/lib/dashboard-api';

type Booking = {
  _id: string;
  vendorId?: { name?: string };
  serviceId?: string;
  status: string;
  quotedPrice?: number;
  finalPrice?: number;
  currency?: string;
  updatedAt?: string;
};

export default function ContractsPage() {
  const { token } = useAuth();
  const [contracts, setContracts] = useState<Booking[]>([]);

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      const weddingId = await getActiveWeddingId(token);
      if (!weddingId) return setContracts([]);
      const rows = await apiRequest<Booking[]>(`/api/bookings/wedding/${weddingId}`, token);
      setContracts(rows);
    };
    load();
  }, [token]);

  const overview = useMemo(
    () => ({
      acknowledged: contracts.filter((c) => c.status === 'confirmed' || c.status === 'completed').length,
      pending: contracts.filter((c) => c.status !== 'confirmed' && c.status !== 'completed').length
    }),
    [contracts]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-bold">Legal Contracts</h1>
          <p className="text-muted-foreground">Manage your event agreements and vendor signatures.</p>
        </div>
        <Button>Upload Contract</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.33fr_0.67fr]">
        <div className="space-y-4">
          <Card className="border-fuchsia-100">
            <CardHeader><CardTitle>Overview</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-xl bg-green-50 p-3">
                <p className="text-sm">Acknowledged</p>
                <p className="text-3xl font-bold">{overview.acknowledged}</p>
              </div>
              <div className="rounded-xl bg-fuchsia-50 p-3">
                <p className="text-sm">Pending</p>
                <p className="text-3xl font-bold">{overview.pending}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-fuchsia-100">
            <CardHeader><CardTitle>Recent Documents</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {contracts.slice(0, 5).map((item) => (
                <div key={item._id} className="rounded-lg border border-fuchsia-100 p-2">
                  <p className="font-medium">{item.vendorId?.name || 'Vendor Agreement'}</p>
                  <p className="text-xs text-muted-foreground">{item.serviceId || 'Service'} • {item.status}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="border-fuchsia-100">
          <CardHeader><CardTitle>Contract Preview</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {contracts.map((item) => (
              <div key={item._id} className="rounded-xl border border-fuchsia-100 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{item.vendorId?.name || 'Vendor Contract'}</p>
                    <p className="text-xs text-muted-foreground">{item.serviceId || 'Service package'}</p>
                  </div>
                  <p className="font-bold">{formatCurrency(item.finalPrice || item.quotedPrice || 0, item.currency || 'USD')}</p>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline">Request Change</Button>
                  <Button size="sm">Finalize &amp; Lock</Button>
                </div>
              </div>
            ))}
            {!contracts.length ? <p className="text-sm text-muted-foreground">No contract records yet.</p> : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
