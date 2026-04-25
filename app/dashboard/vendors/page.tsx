'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Heart, Mail, MapPin, Phone, Star } from 'lucide-react';
import Link from 'next/link';

const VENDOR_CATEGORIES = [
  'All Categories',
  'Venue',
  'Catering',
  'Photography',
  'Videography',
  'Florist',
  'DJ/Music',
  'Makeup & Hair',
  'Wedding Planner'
];

const MOCK_VENDORS = [
  {
    id: 1,
    name: 'The Grand Ballroom',
    category: 'Venue',
    rating: 4.9,
    reviews: 128,
    price: '$$$',
    description: 'Elegant venue with stunning architecture and impeccable service',
    location: 'Downtown',
    image: 'https://via.placeholder.com/300x200?text=Grand+Ballroom',
    contact: { phone: '(555) 123-4567', email: 'info@grandballroom.com' },
    featured: true
  },
  {
    id: 2,
    name: 'Culinary Dreams Catering',
    category: 'Catering',
    rating: 4.8,
    reviews: 95,
    price: '$$',
    description: 'Custom menus featuring international and local cuisines',
    location: 'City Center',
    image: 'https://via.placeholder.com/300x200?text=Culinary+Dreams',
    contact: { phone: '(555) 234-5678', email: 'events@culinarydeams.com' },
    featured: true
  },
  {
    id: 3,
    name: 'Moments Photography Studio',
    category: 'Photography',
    rating: 4.95,
    reviews: 156,
    price: '$$',
    description: 'Professional photography capturing your special moments in artistic style',
    location: 'Studio District',
    image: 'https://via.placeholder.com/300x200?text=Moments+Photography',
    contact: { phone: '(555) 345-6789', email: 'hello@momentsphoto.com' },
    featured: false
  },
  {
    id: 4,
    name: 'Bloom & Blossom Flowers',
    category: 'Florist',
    rating: 4.7,
    reviews: 87,
    price: '$$',
    description: 'Custom floral arrangements and wedding decorations',
    location: 'Garden District',
    image: 'https://via.placeholder.com/300x200?text=Bloom+Blossom',
    contact: { phone: '(555) 456-7890', email: 'design@bloom.com' },
    featured: true
  },
  {
    id: 5,
    name: 'Spin City DJ Services',
    category: 'DJ/Music',
    rating: 4.6,
    reviews: 72,
    price: '$',
    description: 'Professional DJ services with extensive music library and MC services',
    location: 'Entertainment District',
    image: 'https://via.placeholder.com/300x200?text=Spin+City+DJ',
    contact: { phone: '(555) 567-8901', email: 'bookings@spincitydj.com' },
    featured: false
  },
  {
    id: 6,
    name: 'Glam & Glamour Makeup',
    category: 'Makeup & Hair',
    rating: 4.85,
    reviews: 110,
    price: '$$',
    description: 'Professional bridal makeup and hair styling services',
    location: 'Salon District',
    image: 'https://via.placeholder.com/300x200?text=Glam+Makeup',
    contact: { phone: '(555) 678-9012', email: 'book@glamglamour.com' },
    featured: true
  }
];

export default function VendorsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState('rating');
  const [city, setCity] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [ratingFloor, setRatingFloor] = useState('all');
  const [availabilityDate, setAvailabilityDate] = useState('');

  const filteredVendors = MOCK_VENDORS
    .filter(vendor => {
      const matchesCategory = selectedCategory === 'All Categories' || vendor.category === selectedCategory;
      const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           vendor.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity = city === 'all' || vendor.location === city;
      const matchesPrice = priceRange === 'all' || vendor.price === priceRange;
      const matchesRating = ratingFloor === 'all' || vendor.rating >= Number(ratingFloor);
      const matchesAvailability = availabilityDate ? Boolean(availabilityDate) : true;
      return matchesCategory && matchesSearch && matchesCity && matchesPrice && matchesRating && matchesAvailability;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.reviews - a.reviews;
      if (sortBy === 'price') return a.price.length - b.price.length;
      return 0;
    });

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  return (
    <div className="relative space-y-6 overflow-hidden">
      <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-fuchsia-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-8 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl" />

      <div>
        <h1 className="text-3xl font-bold">Vendor Profile</h1>
        <p className="mt-1 text-muted-foreground">Discover and connect with the perfect wedding partners.</p>
      </div>

      <Card className="glass-card surface-3d overflow-hidden border-fuchsia-100">
        <CardContent className="p-0">
          <div className="relative h-52">
            <img
              src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80"
              alt="Floral vendor showcase"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
            <div className="absolute bottom-5 left-5 text-white">
              <p className="text-2xl font-bold">Eternal Florals</p>
              <p className="text-sm text-white/85">Curated premium florist with handcrafted bespoke installations.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
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
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VENDOR_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger><SelectValue placeholder="City" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  <SelectItem value="Downtown">Downtown</SelectItem>
                  <SelectItem value="City Center">City Center</SelectItem>
                  <SelectItem value="Garden District">Garden District</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger><SelectValue placeholder="Price" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Price</SelectItem>
                  <SelectItem value="$">$</SelectItem>
                  <SelectItem value="$$">$$</SelectItem>
                  <SelectItem value="$$$">$$$</SelectItem>
                </SelectContent>
              </Select>
              <Select value={ratingFloor} onValueChange={setRatingFloor}>
                <SelectTrigger><SelectValue placeholder="Rating" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Rating</SelectItem>
                  <SelectItem value="4">4.0+</SelectItem>
                  <SelectItem value="4.5">4.5+</SelectItem>
                  <SelectItem value="4.8">4.8+</SelectItem>
                </SelectContent>
              </Select>
              <Input type="date" value={availabilityDate} onChange={(e) => setAvailabilityDate(e.target.value)} />

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                  <SelectItem value="price">Lowest Price</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-fuchsia-100 bg-fuchsia-50/60 p-3">
              <p className="text-sm">Shortlist: {favorites.length} vendor(s)</p>
              <Link href="/dashboard/vendors/compare"><Button size="sm">Compare Vendors</Button></Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-4 text-xl font-semibold">
          {filteredVendors.length} {selectedCategory === 'All Categories' ? 'Vendors' : selectedCategory}
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredVendors.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              isFavorite={favorites.includes(vendor.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>

        {filteredVendors.length === 0 && (
          <Card>
            <CardContent className="pt-12 text-center pb-12">
              <p className="text-muted-foreground text-lg">No vendors found. Try adjusting your filters.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function VendorCard({ vendor, isFavorite, onToggleFavorite }: any) {
  return (
    <Card className="glass-card surface-3d overflow-hidden border-fuchsia-100 transition-shadow">
      <div className="relative h-48 bg-muted">
        <img
          src={vendor.image}
          alt={vendor.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => onToggleFavorite(vendor.id)}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
        >
          <Heart
            className={`w-5 h-5 ${isFavorite ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`}
          />
        </button>
        <Badge className="absolute top-3 left-3 bg-primary/90">{vendor.category}</Badge>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="line-clamp-1">{vendor.name}</CardTitle>
            <div className="mt-1 flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(vendor.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {vendor.rating} ({vendor.reviews})
              </span>
            </div>
          </div>
          <Badge variant="outline">{vendor.price}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{vendor.description}</p>

        <div className="grid grid-cols-2 gap-2">
          <img src="https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=600&q=80" alt="portfolio one" className="h-24 w-full rounded-xl object-cover" />
          <img src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80" alt="portfolio two" className="h-24 w-full rounded-xl object-cover" />
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            {vendor.location}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="w-4 h-4" />
            {vendor.contact.phone}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="w-4 h-4" />
            {vendor.contact.email}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link href={`/dashboard/vendors/${vendor.id}`}><Button className="w-full bg-gradient-to-r from-fuchsia-600 to-violet-500 text-white">View Profile</Button></Link>
          <Button variant="outline" onClick={() => onToggleFavorite(vendor.id)}>{isFavorite ? 'Remove' : 'Shortlist'}</Button>
        </div>
      </CardContent>
    </Card>
  );
}
