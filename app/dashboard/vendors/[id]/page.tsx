'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Phone, Mail } from 'lucide-react';
import { useParams } from 'next/navigation';

const MOCK_VENDOR = {
  id: 1,
  name: 'The Grand Ballroom',
  category: 'Venue',
  rating: 4.9,
  reviews: 128,
  price: '$$$',
  description: 'Elegant venue with stunning architecture and impeccable service. Perfect for weddings up to 500 guests.',
  location: 'Downtown',
  image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
  contact: { phone: '(555) 123-4567', email: 'info@grandballroom.com' },
  availability: {
    minDate: '2024-06-01',
    maxDate: '2025-12-31',
    availableDates: ['2024-06-15', '2024-06-22', '2024-07-06', '2024-07-13', '2024-08-10']
  },
  amenities: [
    'Banquet Hall (10,000 sq ft)',
    'Bridal Suite',
    "Groom's Room",
    'Dance Floor',
    'Sound System',
    'Lighting Package',
    'Parking (500 spaces)',
    'Accessibility Access'
  ],
  capacity: '50-500 guests',
  packages: [
    { name: 'Elegant', price: 3500, description: 'Venue rental with basic setup' },
    { name: 'Premium', price: 5500, description: 'Venue rental with premium setup and coordination' },
    { name: 'Deluxe', price: 7500, description: 'Full-service package with coordination and decor' }
  ],
  recentReviews: [
    {
      author: 'Sarah & John',
      date: '2024-03-15',
      rating: 5,
      text: 'Absolutely stunning venue! The staff was incredible and made our day perfect.'
    },
    {
      author: 'Emma & Mike',
      date: '2024-02-20',
      rating: 5,
      text: 'Beautiful space with excellent service. Highly recommend!'
    },
    {
      author: 'Jessica & Tom',
      date: '2024-01-10',
      rating: 4,
      text: 'Great venue with professional staff. Minor issues with timing but resolved quickly.'
    }
  ]
};

export default function VendorDetailPage() {
  const params = useParams();
  const _vendorId = params.id;
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  const handleBooking = () => {
    if (selectedDate && selectedPackage) {
      setShowBookingForm(false);
      setSelectedDate('');
      setSelectedPackage('');
      setSpecialRequests('');
    }
  };

  return (
    <div className="relative space-y-6 overflow-hidden">
      <div className="pointer-events-none absolute -left-20 top-10 h-56 w-56 rounded-full bg-fuchsia-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-8 h-56 w-56 rounded-full bg-violet-400/20 blur-3xl" />

      <div className="relative">
        <div className="h-96 overflow-hidden rounded-2xl bg-muted">
          <img src={MOCK_VENDOR.image} alt={MOCK_VENDOR.name} className="h-full w-full object-cover" />
        </div>
        <Card className="glass-card absolute -bottom-6 left-6 right-6 border-fuchsia-100 md:right-auto md:w-96">
          <CardContent className="pt-6">
            <h1 className="text-2xl font-bold">Eternal Florals</h1>
            <div className="mt-2 flex items-center gap-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(MOCK_VENDOR.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold">{MOCK_VENDOR.rating}</span>
              <span className="text-muted-foreground">({MOCK_VENDOR.reviews} reviews)</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-20 space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="glass-card border-fuchsia-100">
            <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3"><Phone className="h-5 w-5 text-primary" /><a href={`tel:${MOCK_VENDOR.contact.phone}`} className="text-sm hover:underline">{MOCK_VENDOR.contact.phone}</a></div>
              <div className="flex items-center gap-3"><Mail className="h-5 w-5 text-primary" /><a href={`mailto:${MOCK_VENDOR.contact.email}`} className="text-sm hover:underline">{MOCK_VENDOR.contact.email}</a></div>
              <div className="flex items-start gap-3"><MapPin className="mt-0.5 h-5 w-5 text-primary" /><span className="text-sm">{MOCK_VENDOR.location}</span></div>
              <Button className="mt-4 w-full" onClick={() => setShowBookingForm(true)}>Public Preview</Button>
            </CardContent>
          </Card>

          <Card className="glass-card border-fuchsia-100">
            <CardHeader><CardTitle>Quick Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><p className="text-sm font-semibold text-muted-foreground">Category</p><Badge className="mt-1">{MOCK_VENDOR.category}</Badge></div>
              <div><p className="text-sm font-semibold text-muted-foreground">Price Range</p><Badge variant="outline" className="mt-1">{MOCK_VENDOR.price}</Badge></div>
              <div><p className="text-sm font-semibold text-muted-foreground">Capacity</p><p className="mt-1 text-sm">{MOCK_VENDOR.capacity}</p></div>
            </CardContent>
          </Card>

          <Card className="glass-card border-fuchsia-100">
            <CardHeader><CardTitle>Completion Score</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-[8px] border-fuchsia-500">
                <p className="text-xl font-bold">80%</p>
              </div>
              <p className="text-center text-sm text-muted-foreground">Your profile is nearly complete.</p>
              <Button className="w-full" onClick={() => setShowBookingForm(true)}>Complete Now</Button>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card border-fuchsia-100">
          <CardHeader><CardTitle>About the Business</CardTitle></CardHeader>
          <CardContent><p className="leading-relaxed text-muted-foreground">{MOCK_VENDOR.description}</p></CardContent>
        </Card>

        <Card className="glass-card border-fuchsia-100">
          <CardHeader><CardTitle>Portfolio Gallery</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=600&q=80',
                'https://images.unsplash.com/photo-1465495976277-4387d4b0b7d6?auto=format&fit=crop&w=600&q=80',
                'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=600&q=80',
                'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80'
              ].map((src) => (
                <img key={src} src={src} alt="portfolio" className="h-40 w-full rounded-xl object-cover" />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-fuchsia-100">
          <CardHeader><CardTitle>Service Packages</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {MOCK_VENDOR.packages.map((pkg) => (
                <Card key={pkg.name} className="border-primary/20">
                  <CardHeader><CardTitle className="text-lg">{pkg.name}</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold text-primary">${pkg.price}</div>
                    <p className="text-sm text-muted-foreground">{pkg.description}</p>
                    <Button className="w-full" variant="outline" onClick={() => { setSelectedPackage(pkg.name); setShowBookingForm(true); }}>Select Package</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-fuchsia-100">
          <CardHeader><CardTitle>Recent Reviews</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-6">
              {MOCK_VENDOR.recentReviews.map((review, idx) => (
                <div key={idx} className="border-b border-border pb-6 last:border-b-0">
                  <div className="mb-2 flex items-start justify-between">
                    <div><p className="font-semibold">{review.author}</p><p className="text-xs text-muted-foreground">{review.date}</p></div>
                    <div className="flex">{[...Array(5)].map((_, i) => (<Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} />))}</div>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {showBookingForm && (
          <Card className="glass-card border-primary/50 bg-primary/5">
            <CardHeader><CardTitle>Request Booking</CardTitle><CardDescription>Fill out the form below to request a booking</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-semibold">Select Date</label>
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} min={MOCK_VENDOR.availability.minDate} max={MOCK_VENDOR.availability.maxDate} className="mt-2 w-full rounded-lg border border-border px-3 py-2" />
              </div>
              <div>
                <label className="text-sm font-semibold">Select Package</label>
                <select value={selectedPackage} onChange={(e) => setSelectedPackage(e.target.value)} className="mt-2 w-full rounded-lg border border-border px-3 py-2">
                  <option value="">Choose a package...</option>
                  {MOCK_VENDOR.packages.map((pkg) => (<option key={pkg.name} value={pkg.name}>{pkg.name} (${pkg.price})</option>))}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold">Special Requests</label>
                <Textarea placeholder="Let the vendor know about your specific needs..." value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} className="mt-2" />
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={handleBooking}>Send Request</Button>
                <Button variant="outline" className="flex-1" onClick={() => setShowBookingForm(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
