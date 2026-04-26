'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { apiRequest } from '@/lib/dashboard-api';

type Vendor = {
  _id: string;
  name: string;
  priceRange: string;
  rating: number;
  reviewsCount: number;
  city: string;
  category: string;
  availability?: { startDate?: string; endDate?: string };
};

export default function CompareVendorsPage() {
  const [allVendors, setAllVendors] = useState<Vendor[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('vendorCompareShortlist');
    if (stored) {
      try {
        setSelectedIds(JSON.parse(stored));
      } catch {
        setSelectedIds([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('vendorCompareShortlist', JSON.stringify(selectedIds));
  }, [selectedIds]);

  useEffect(() => {
    const load = async () => {
      const vendors = await apiRequest<Vendor[]>('/api/vendors', null);
      setAllVendors(vendors);
    };
    load();
  }, []);

  const selected = useMemo(() => allVendors.filter((vendor) => selectedIds.includes(vendor._id)).slice(0, 3), [allVendors, selectedIds]);

  const removeVendor = (id: string) => {
    setSelectedIds((prev) => prev.filter((value) => value !== id));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Compare Vendors</h1>
      <Card className="glass-card border-fuchsia-100">
        <CardHeader><CardTitle>Side-by-side comparison (up to 3)</CardTitle></CardHeader>
        <CardContent>
          {!selected.length ? (
            <p className="text-sm text-muted-foreground">No vendors shortlisted. Add vendors from Browse Vendors.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field</TableHead>
                  {selected.map((vendor) => <TableHead key={vendor._id}>{vendor.name}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  ['Price Range', 'priceRange'],
                  ['Rating', 'rating'],
                  ['Category', 'category'],
                  ['Availability', 'availability'],
                  ['City', 'city']
                ].map(([label, key]) => (
                  <TableRow key={label}>
                    <TableCell className="font-semibold">{label}</TableCell>
                    {selected.map((vendor) => {
                      const availabilityLabel = vendor.availability?.startDate
                        ? `${vendor.availability.startDate.slice(0, 10)} to ${vendor.availability?.endDate?.slice(0, 10) || 'Open'}`
                        : 'On request';
                      const value = key === 'availability' ? availabilityLabel : String((vendor as unknown as Record<string, unknown>)[key] ?? '-');
                      return <TableCell key={`${vendor._id}-${label}`}>{value}</TableCell>;
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            {selected.map((vendor) => (
              <div key={vendor._id} className="flex items-center gap-2 rounded-xl border border-fuchsia-200 px-3 py-2 text-sm">
                {vendor.name}
                <button onClick={() => removeVendor(vendor._id)}>x</button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            {selected.map((vendor) => (
              <Link key={`${vendor._id}-book`} href={`/dashboard/vendors/book/${vendor._id}`}>
                <Button variant="outline">Book {vendor.name}</Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
