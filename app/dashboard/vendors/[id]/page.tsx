'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Phone, Mail, Calendar, DollarSign } from 'lucide-react';
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
  image: 'https://via.placeholder.com/800x400?text=Grand+Ballroom',
  contact: { phone: '(555) 123-4567', email: 'info@grandballroom.com' },
  availability: {
    minDate: '2024-06-01',
    maxDate: '2025-12-31',
    availableDates: ['2024-06-15', '2024-06-22', '2024-07-06', '2024-07-13', '2024-08-10']
  },
  amenities: [
    'Banquet Hall (10,000 sq ft)',
    'Bridal Suite',
    'Groom\'s Room',
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
  const vendorId = params.id;
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  const handleBooking = () => {
    if (selectedDate && selectedPackage) {
      // API call would happen here
      setShowBookingForm(false);
      setSelectedDate('');
      setSelectedPackage('');
      setSpecialRequests('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Vendor Header */}
      <div className="relative">
        <div className="h-96 bg-muted rounded-lg overflow-hidden">
          <img
            src={MOCK_VENDOR.image}
            alt={MOCK_VENDOR.name}
            className="w-full h-full object-cover"
          />
        </div>
        <Card className="absolute -bottom-6 left-6 right-6 md:right-auto md:w-96">
          <CardContent className="pt-6">
            <h1 className="text-2xl font-bold">{MOCK_VENDOR.name}</h1>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(MOCK_VENDOR.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted'
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold">{MOCK_VENDOR.rating}</span>
              <span className="text-muted-foreground">({MOCK_VENDOR.reviews} reviews)</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vendor Info */}
      <div className="mt-20 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Contact & Details */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <a href={`tel:${MOCK_VENDOR.contact.phone}`} className="text-sm hover:underline">
                  {MOCK_VENDOR.contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <a href={`mailto:${MOCK_VENDOR.contact.email}`} className="text-sm hover:underline">
                  {MOCK_VENDOR.contact.email}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-sm">{MOCK_VENDOR.location}</span>
              </div>

              <Button className="w-full mt-4" onClick={() => setShowBookingForm(true)}>
                Request Quote
              </Button>
            </CardContent>
          </Card>

          {/* Quick Details */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground font-semibold">Category</p>
                <Badge className="mt-1">{MOCK_VENDOR.category}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-semibold">Price Range</p>
                <Badge variant="outline" className="mt-1">{MOCK_VENDOR.price}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-semibold">Capacity</p>
                <p className="text-sm mt-1">{MOCK_VENDOR.capacity}</p>
              </div>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground font-semibold">Available Dates</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {MOCK_VENDOR.availability.availableDates.map((date) => (
                    <Badge key={date} variant="secondary" className="text-xs">
                      {new Date(date).toLocaleDateString()}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button className="w-full" onClick={() => setShowBookingForm(true)}>
                Check Availability
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{MOCK_VENDOR.description}</p>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card>
          <CardHeader>
            <CardTitle>Amenities & Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_VENDOR.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm">{amenity}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Packages */}
        <Card>
          <CardHeader>
            <CardTitle>Service Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {MOCK_VENDOR.packages.map((pkg) => (
                <Card key={pkg.name} className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg">{pkg.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold text-primary">${pkg.price}</div>
                    <p className="text-sm text-muted-foreground">{pkg.description}</p>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => {
                        setSelectedPackage(pkg.name);
                        setShowBookingForm(true);
                      }}
                    >
                      Select Package
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {MOCK_VENDOR.recentReviews.map((review, idx) => (
                <div key={idx} className="border-b border-border pb-6 last:border-b-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold">{review.author}</p>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Booking Form Modal */}
        {showBookingForm && (
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle>Request Booking</CardTitle>
              <CardDescription>Fill out the form below to request a booking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-semibold">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={MOCK_VENDOR.availability.minDate}
                  max={MOCK_VENDOR.availability.maxDate}
                  className="w-full mt-2 px-3 py-2 border border-border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Select Package</label>
                <select
                  value={selectedPackage}
                  onChange={(e) => setSelectedPackage(e.target.value)}
                  className="w-full mt-2 px-3 py-2 border border-border rounded-lg"
                >
                  <option value="">Choose a package...</option>
                  {MOCK_VENDOR.packages.map((pkg) => (
                    <option key={pkg.name} value={pkg.name}>
                      {pkg.name} (${pkg.price})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold">Special Requests</label>
                <Textarea
                  placeholder="Let the vendor know about your specific needs..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div className="flex gap-2">
                <Button className="flex-1" onClick={handleBooking}>
                  Send Request
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowBookingForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
