'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function VendorProfilePage() {
  const [form, setForm] = useState({
    businessName: 'Eternal Florals',
    category: 'Florist',
    city: 'Lahore',
    priceRange: '$$',
    certifications: 'Certified Event Designer, Luxury Floral Guild',
    notifications: true
  });
  const [gallery, setGallery] = useState<string[]>([
    'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=600&q=80'
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Vendor Profile</h1>
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card className="glass-card border-fuchsia-100">
          <CardHeader><CardTitle>Business Details</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} placeholder="Business Name" />
            <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" />
            <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" />
            <Input value={form.priceRange} onChange={(e) => setForm({ ...form, priceRange: e.target.value })} placeholder="Pricing Range" />
            <Input value={form.certifications} onChange={(e) => setForm({ ...form, certifications: e.target.value })} placeholder="Certifications" />
            <div className="flex gap-2">
              <Button>Save Details</Button>
              <Button variant="outline">Account Settings</Button>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-fuchsia-100">
          <CardHeader><CardTitle>Portfolio Gallery</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {gallery.map((img) => <img key={img} src={img} alt="portfolio" className="h-32 w-full rounded-xl object-cover" />)}
            </div>
            <Input className="mt-3" placeholder="Image URL" onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const value = (e.target as HTMLInputElement).value.trim();
                if (value) {
                  setGallery([...gallery, value]);
                  (e.target as HTMLInputElement).value = '';
                }
              }
            }} />
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Profile completeness: 82%</p>
              <label className="text-sm">
                <input type="checkbox" checked={form.notifications} onChange={(e) => setForm({ ...form, notifications: e.target.checked })} className="mr-2" />
                Notifications
              </label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
