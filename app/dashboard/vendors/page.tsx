'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Heart, Mail, MapPin, Phone, Star } from 'lucide-react';
import Link from 'next/link';
import { apiRequest } from '@/lib/dashboard-api';

type Vendor = {
  _id: string;
  name: string;
  category: string;
  rating: number;
  reviewsCount: number;
  city: string;
  description?: string;
  contact?: { phone?: string; email?: string };
  priceRange: '$' | '$$' | '$$$';
  portfolio?: { imageUrl?: string }[];
};

const CATEGORIES = ['all', 'venue', 'catering', 'photography', 'videography', 'flowers', 'makeup', 'entertainment', 'other'];

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [city, setCity] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [ratingFloor, setRatingFloor] = useState('all');
  const [availabilityDate, setAvailabilityDate] = useState('');
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [error, setError] = useState('');

  const loadVendors = async () => {
    try {
      setError('');
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.set('category', selectedCategory);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      if (ratingFloor !== 'all') params.set('minRating', ratingFloor);
      if (city !== 'all') params.set('city', city);
      if (priceRange !== 'all') params.set('priceRange', priceRange);
      if (availabilityDate) params.set('availableOn', availabilityDate);
      params.set('sortBy', sortBy);

      const result = await apiRequest<Vendor[]>(`/api/vendors?${params.toString()}`, null);
      setVendors(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load vendors.');
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem('vendorCompareShortlist');
    if (stored) {
      try {
        setShortlist(JSON.parse(stored));
      } catch {
        setShortlist([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('vendorCompareShortlist', JSON.stringify(shortlist));
  }, [shortlist]);

  useEffect(() => {
    loadVendors();
  }, [selectedCategory, searchQuery, ratingFloor, city, priceRange, availabilityDate, sortBy]);

  const cityOptions = useMemo(
    () => ['all', ...Array.from(new Set(vendors.map((vendor) => vendor.city).filter(Boolean)))],
    [vendors]
  );

  const toggleShortlist = (id: string) => {
    setShortlist((prev) => {
      if (prev.includes(id)) return prev.filter((value) => value !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  return (
    <div className="relative space-y-6 overflow-hidden">
      <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-fuchsia-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-8 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl" />

      <div>
        <h1 className="text-3xl font-bold">Browse Vendors</h1>
        <p className="mt-1 text-muted-foreground">Find vendors by category, city, budget, rating, and availability.</p>
      </div>

      {error ? <p className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</p> : null}

      <Card className="glass-card border-fuchsia-100">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Input
              placeholder="Search vendors by name or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
              <select className="rounded-xl border border-input bg-background px-3 py-2" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>)}
              </select>
              <select className="rounded-xl border border-input bg-background px-3 py-2" value={city} onChange={(e) => setCity(e.target.value)}>
                {cityOptions.map((opt) => <option key={opt} value={opt}>{opt === 'all' ? 'All Cities' : opt}</option>)}
              </select>
              <select className="rounded-xl border border-input bg-background px-3 py-2" value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
                <option value="all">Any Price</option>
                <option value="$">$</option>
                <option value="$$">$$</option>
                <option value="$$$">$$$</option>
              </select>
              <select className="rounded-xl border border-input bg-background px-3 py-2" value={ratingFloor} onChange={(e) => setRatingFloor(e.target.value)}>
                <option value="all">Any Rating</option>
                <option value="3">3.0+</option>
                <option value="4">4.0+</option>
                <option value="4.5">4.5+</option>
              </select>
              <Input type="date" value={availabilityDate} onChange={(e) => setAvailabilityDate(e.target.value)} />
              <select className="rounded-xl border border-input bg-background px-3 py-2" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviews</option>
                <option value="price">Lowest Price</option>
                <option value="name">Name</option>
              </select>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-fuchsia-100 bg-fuchsia-50/60 p-3">
              <p className="text-sm">Shortlist: {shortlist.length} / 3 vendors</p>
              <Link href="/dashboard/vendors/compare"><Button size="sm">Compare Vendors</Button></Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-4 text-xl font-semibold">{vendors.length} Vendor Results</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {vendors.map((vendor) => (
            <Card key={vendor._id} className="glass-card surface-3d overflow-hidden border-fuchsia-100 transition-shadow">
              <div className="relative h-44 bg-fuchsia-50">
                <img
                  src={vendor.portfolio?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80'}
                  alt={vendor.name}
                  className="h-full w-full object-cover"
                />
                <button onClick={() => toggleShortlist(vendor._id)} className="absolute right-3 top-3 rounded-full bg-white p-2 shadow">
                  <Heart className={`h-5 w-5 ${shortlist.includes(vendor._id) ? 'fill-rose-500 text-rose-500' : 'text-muted-foreground'}`} />
                </button>
                <Badge className="absolute left-3 top-3 bg-primary/90">{vendor.category}</Badge>
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="line-clamp-1">{vendor.name}</CardTitle>
                  <Badge variant="outline">{vendor.priceRange}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{vendor.rating.toFixed(1)}</span>
                  <span>({vendor.reviewsCount})</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="line-clamp-2 text-sm text-muted-foreground">{vendor.description || 'Wedding service provider.'}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" />{vendor.city || 'City not listed'}</div>
                  <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" />{vendor.contact?.phone || 'N/A'}</div>
                  <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" />{vendor.contact?.email || 'N/A'}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link href={`/dashboard/vendors/${vendor._id}`}><Button className="w-full">View Profile</Button></Link>
                  <Button variant="outline" onClick={() => toggleShortlist(vendor._id)}>{shortlist.includes(vendor._id) ? 'Remove' : 'Shortlist'}</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!vendors.length ? (
          <Card>
            <CardContent className="pb-12 pt-12 text-center">
              <p className="text-lg text-muted-foreground">No vendors found. Try changing filters.</p>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
