'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SiteBuilderPage() {
  const [gallery, setGallery] = useState(true);
  const [rsvp, setRsvp] = useState(true);
  const [venueMap, setVenueMap] = useState(false);
  const [theme, setTheme] = useState('Classic Blush');
  const [font, setFont] = useState('Noto Serif + Manrope');

  return (
    <div className="grid gap-6 lg:grid-cols-[0.32fr_0.68fr]">
      <Card className="border-fuchsia-100">
        <CardHeader>
          <CardTitle className="text-4xl">Site Builder</CardTitle>
          <p className="text-muted-foreground">Customize your digital invitation.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Visual Theme</p>
            <div className="grid grid-cols-2 gap-2">
              {['Classic Blush', 'Garden Eve'].map((item) => (
                <Button key={item} variant={theme === item ? 'default' : 'outline'} onClick={() => setTheme(item)}>
                  {item}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Navigation Sections</p>
            <Toggle label="Gallery" value={gallery} onChange={setGallery} />
            <Toggle label="RSVP Form" value={rsvp} onChange={setRsvp} />
            <Toggle label="Venue Map" value={venueMap} onChange={setVenueMap} />
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Font Pairing</p>
            <select className="w-full rounded-xl border border-input bg-background px-3 py-2" value={font} onChange={(event) => setFont(event.target.value)}>
              <option>Noto Serif + Manrope</option>
              <option>Playfair + Inter</option>
              <option>Merriweather + Lato</option>
            </select>
          </div>
          <Button className="w-full">Publish Website</Button>
        </CardContent>
      </Card>

      <Card className="border-fuchsia-100">
        <CardContent className="p-4">
          <div className="overflow-hidden rounded-xl border border-fuchsia-100">
            <div className="h-80 bg-gradient-to-br from-fuchsia-200 to-violet-200 p-6">
              <p className="text-sm font-semibold text-white/90">SAVE THE DATE</p>
              <p className="mt-3 text-6xl font-bold text-white">Elena &amp; Julian</p>
              <p className="mt-2 text-xl text-white/95">September 24th, 2026 • Tuscany, Italy</p>
            </div>
            <div className="space-y-4 bg-white p-6 text-center">
              <p className="text-5xl font-bold text-fuchsia-700">Our Journey</p>
              <p className="mx-auto max-w-xl text-muted-foreground">
                A chance meeting in a rainy bookstore in London led to a lifetime of adventures.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {gallery ? <div className="h-28 rounded-lg bg-fuchsia-100" /> : null}
                {rsvp ? <div className="h-28 rounded-lg bg-violet-100" /> : null}
              </div>
              {venueMap ? <div className="h-24 rounded-lg bg-fuchsia-50 text-sm text-muted-foreground">Venue Map Section</div> : null}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (value: boolean) => void }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-fuchsia-100 px-3 py-2">
      <span className="text-sm">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`h-6 w-12 rounded-full ${value ? 'bg-fuchsia-600' : 'bg-fuchsia-100'} p-1`}
      >
        <span className={`block h-4 w-4 rounded-full bg-white transition ${value ? 'translate-x-6' : ''}`} />
      </button>
    </div>
  );
}
