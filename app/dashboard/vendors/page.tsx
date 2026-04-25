'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Phone, Mail, ExternalLink, Heart } from 'lucide-react';

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

  const filteredVendors = MOCK_VENDORS
    .filter(vendor => {
      const matchesCategory = selectedCategory === 'All Categories' || vendor.category === selectedCategory;
      const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           vendor.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Vendor Marketplace</h1>
        <p className="text-muted-foreground mt-1">Browse and book trusted vendors for your wedding</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Input
              placeholder="Search vendors by name or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        </CardContent>
      </Card>

      {/* Featured Vendors */}
      {selectedCategory === 'All Categories' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Featured Vendors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_VENDORS.filter(v => v.featured).map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                isFavorite={favorites.includes(vendor.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </div>
      )}

      {/* Vendor Results */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {filteredVendors.length} {selectedCategory === 'All Categories' ? 'Vendors' : selectedCategory}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
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

      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="line-clamp-1">{vendor.name}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
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

        <Button className="w-full">View Details</Button>
      </CardContent>
    </Card>
  );
}
