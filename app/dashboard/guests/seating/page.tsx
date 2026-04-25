'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type TableType = { id: number; name: string; capacity: number; guests: string[] };

export default function SeatingChartPage() {
  const [tables, setTables] = useState<TableType[]>([
    { id: 1, name: 'Table 1', capacity: 8, guests: ['Areeba', 'Sana'] },
    { id: 2, name: 'Table 2', capacity: 8, guests: ['Usman'] }
  ]);
  const [pool, setPool] = useState(['Ali', 'Hira', 'Mariam', 'Zayan']);

  const addTable = () => setTables([...tables, { id: Date.now(), name: `Table ${tables.length + 1}`, capacity: 8, guests: [] }]);
  const moveGuest = (guest: string, tableId: number) => {
    setPool(pool.filter((g) => g !== guest));
    setTables(tables.map((t) => (t.id === tableId && t.guests.length < t.capacity ? { ...t, guests: [...t.guests, guest] } : t)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Seating Chart Builder</h1>
        <div className="flex gap-2">
          <Button onClick={addTable}>Create Table</Button>
          <Button variant="outline">Export PDF</Button>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <Card className="glass-card border-fuchsia-100">
          <CardHeader><CardTitle>Table Layout</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {tables.map((table) => (
              <div key={table.id} className="rounded-2xl border border-fuchsia-100 bg-fuchsia-50/40 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-semibold">{table.name}</p>
                  <span className="text-xs text-muted-foreground">{table.guests.length}/{table.capacity}</span>
                </div>
                <div className="space-y-2">
                  {table.guests.map((guest) => <p key={guest} className="rounded-lg bg-white px-2 py-1 text-sm">{guest}</p>)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="glass-card border-fuchsia-100">
          <CardHeader><CardTitle>Unassigned Guests</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {pool.map((guest) => (
              <div key={guest} className="flex items-center justify-between rounded-lg border border-fuchsia-100 p-2">
                <span className="text-sm">{guest}</span>
                <div className="flex gap-1">
                  {tables.map((table) => (
                    <button key={table.id} onClick={() => moveGuest(guest, table.id)} className="rounded bg-fuchsia-600 px-2 py-1 text-xs text-white">
                      {table.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
