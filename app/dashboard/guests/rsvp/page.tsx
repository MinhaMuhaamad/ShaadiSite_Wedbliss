'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const seed = [
  { id: 1, name: 'Areeba Khan', email: 'areeba@mail.com', event: 'Barat', status: 'Attending' },
  { id: 2, name: 'Usman Shah', email: 'usman@mail.com', event: 'Mehndi', status: 'Declined' },
  { id: 3, name: 'Sana Ali', email: 'sana@mail.com', event: 'Walima', status: 'Awaiting' }
];

export default function RsvpTrackerPage() {
  const [rows, setRows] = useState(seed);
  const counts = useMemo(() => ({
    attending: rows.filter((r) => r.status === 'Attending').length,
    declined: rows.filter((r) => r.status === 'Declined').length,
    awaiting: rows.filter((r) => r.status === 'Awaiting').length
  }), [rows]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">RSVP Tracker</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Attending</p><p className="text-2xl font-bold">{counts.attending}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Declined</p><p className="text-2xl font-bold">{counts.declined}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Awaiting</p><p className="text-2xl font-bold">{counts.awaiting}</p></CardContent></Card>
      </div>

      <Card className="glass-card border-fuchsia-100">
        <CardHeader><CardTitle>Responses</CardTitle></CardHeader>
        <CardContent>
          <div className="mb-3 flex gap-2">
            <Button>Send RSVP Links</Button>
            <Button variant="outline">Bulk Send</Button>
            <Button variant="outline">Send Reminders</Button>
          </div>
          <Table>
            <TableHeader><TableRow><TableHead>Guest</TableHead><TableHead>Email</TableHead><TableHead>Event</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>{r.email}</TableCell>
                  <TableCell>{r.event}</TableCell>
                  <TableCell>{r.status}</TableCell>
                  <TableCell className="flex gap-2">
                    {['Attending', 'Declined', 'Awaiting'].map((s) => (
                      <Button key={s} size="sm" variant="outline" onClick={() => setRows(rows.map((x) => (x.id === r.id ? { ...x, status: s } : x)))}>
                        {s}
                      </Button>
                    ))}
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
