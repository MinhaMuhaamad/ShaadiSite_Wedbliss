'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/context/AuthContext';
import { apiRequest } from '@/lib/dashboard-api';

type Wedding = {
  _id: string;
  brideName?: string;
  groomName?: string;
  weddingDate: string;
  venue?: { city?: string; name?: string };
  status?: string;
};

export default function MyEventsPage() {
  const { token } = useAuth();
  const [weddings, setWeddings] = useState<Wedding[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      const rows = await apiRequest<Wedding[]>('/api/weddings', token);
      setWeddings(rows);
    };
    load();
  }, [token]);

  const filtered = useMemo(
    () =>
      weddings.filter((item) =>
        `${item.brideName || ''} ${item.groomName || ''} ${item.venue?.name || ''}`.toLowerCase().includes(query.toLowerCase())
      ),
    [weddings, query]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Events</h1>
          <p className="text-muted-foreground">Manage your events in real time.</p>
        </div>
        <Input className="max-w-sm" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search events..." />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((wedding) => (
          <Card key={wedding._id} className="border-fuchsia-100">
            <CardContent className="space-y-3 p-4">
              <p className="text-xs font-semibold uppercase text-fuchsia-700">Next Up</p>
              <h3 className="text-xl font-bold">{wedding.brideName} & {wedding.groomName}</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(wedding.weddingDate).toLocaleDateString()} • {wedding.venue?.city || 'City TBD'}
              </p>
              <div className="h-2 rounded-full bg-fuchsia-100">
                <div className="h-2 w-2/3 rounded-full bg-gradient-to-r from-fuchsia-600 to-violet-500" />
              </div>
              <Link href={`/dashboard/weddings/${wedding._id}`}><Button className="w-full">Manage Event</Button></Link>
            </CardContent>
          </Card>
        ))}
        <Card className="border-dashed border-fuchsia-300">
          <CardContent className="flex h-full min-h-56 flex-col items-center justify-center gap-3 p-6 text-center">
            <p className="text-lg font-semibold">Create New Event</p>
            <p className="text-sm text-muted-foreground">Begin planning your next masterpiece.</p>
            <Link href="/dashboard/weddings/new"><Button variant="outline">Get Started</Button></Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
