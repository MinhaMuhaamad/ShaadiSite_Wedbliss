'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function BookVendorPage() {
  const { id } = useParams<{ id: string }>();
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [paid, setPaid] = useState(false);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Book Vendor</h1>
      <Card className="glass-card border-fuchsia-100">
        <CardHeader><CardTitle>Package & Deposit</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl border border-fuchsia-100 bg-fuchsia-50/50 p-4">
            <p className="font-semibold">Selected Vendor ID: {id}</p>
            <p className="text-sm text-muted-foreground">Premium package · Total $1200 · Deposit $300</p>
          </div>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Special notes"
            className="min-h-24 w-full rounded-xl border border-input bg-background px-3 py-2"
          />
          <div className="rounded-xl border border-fuchsia-200 p-4">
            <p className="text-sm font-medium">Stripe Deposit Form (Mock)</p>
            <div className="mt-2 grid gap-2 md:grid-cols-3">
              <Input placeholder="Card Number" />
              <Input placeholder="MM/YY" />
              <Input placeholder="CVC" />
            </div>
          </div>
          <Button onClick={() => setPaid(true)}>Pay Deposit & Confirm Booking</Button>
        </CardContent>
      </Card>
      {paid && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader><CardTitle>Booking Confirmed</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-green-800">Your booking is successful. Save this confirmation for records.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
