'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const templates = [
  { id: 'modern-elegance', title: 'Modern Elegance', price: 32, style: 'Modern' },
  { id: 'ethereal-garden', title: 'Ethereal Garden', price: 24, style: 'Minimalist' },
  { id: 'rose-romance', title: 'Rose Romance', price: 28, style: 'Floral' },
  { id: 'nocturnal-blooms', title: 'Nocturnal Blooms', price: 38, style: 'Moody' }
];

export default function InvitationStudioPage() {
  const [query, setQuery] = useState('');
  const [activeStyle, setActiveStyle] = useState('All');

  const filtered = useMemo(
    () =>
      templates.filter((item) => (activeStyle === 'All' ? true : item.style === activeStyle)).filter((item) =>
        `${item.title} ${item.style}`.toLowerCase().includes(query.toLowerCase())
      ),
    [query, activeStyle]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Invitation Studio</h1>
          <p className="text-muted-foreground">Discover high-end digital templates and customize your design.</p>
        </div>
        <Input className="max-w-sm" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search templates..." />
      </div>

      <div className="flex gap-2">
        {['All', 'Minimalist', 'Floral', 'Vintage', 'Modern', 'Bohemian'].map((style) => (
          <Button key={style} variant={activeStyle === style ? 'default' : 'outline'} onClick={() => setActiveStyle(style)}>
            {style}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {filtered.map((item) => (
          <Card key={item.id} className="overflow-hidden border-fuchsia-100">
            <div className="h-56 bg-gradient-to-br from-fuchsia-100 to-violet-100" />
            <CardContent className="space-y-2 p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{item.title}</p>
                <p className="font-semibold text-fuchsia-700">${item.price}</p>
              </div>
              <p className="text-xs text-muted-foreground">{item.style}</p>
              <div className="flex gap-2">
                <Link href={`/dashboard/invitation-studio/editor?template=${item.id}`}><Button size="sm">Edit</Button></Link>
                <Link href={`/dashboard/invitation-studio/send?template=${item.id}`}><Button size="sm" variant="outline">Send</Button></Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
