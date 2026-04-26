'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Phone, Mail } from 'lucide-react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { apiRequest, formatCurrency } from '@/lib/dashboard-api';

type Vendor = {
  _id: string;
  name: string;
  category: string;
  rating: number;
  reviewsCount: number;
  description?: string;
  city: string;
  contact?: { phone?: string; email?: string };
  portfolio?: { imageUrl?: string }[];
  services?: { name: string; description?: string; basePrice?: number; currency?: string }[];
  availability?: { startDate?: string; endDate?: string };
  priceRange?: string;
};

type Review = { userId?: string; rating: number; comment: string; createdAt: string };
type Wedding = { _id: string };
type Booking = { vendorId?: { _id?: string } | string; status: string };

export default function VendorDetailPage() {
  const params = useParams<{ id: string }>();
  const { token } = useAuth();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [canReview, setCanReview] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setError('');
      const [vendorData, reviewsData] = await Promise.all([
        apiRequest<Vendor>(`/api/vendors/${params.id}`, null),
        apiRequest<{ reviews: Review[] }>(`/api/vendors/${params.id}/reviews`, null)
      ]);
      setVendor(vendorData);
      setReviews(reviewsData.reviews || []);

      if (token) {
        const weddings = await apiRequest<Wedding[]>('/api/weddings', token);
        if (weddings.length) {
          const bookings = await apiRequest<Booking[]>(`/api/bookings/wedding/${weddings[0]._id}`, token);
          const hasBooked = bookings.some((booking) => {
            const bookingVendorId = typeof booking.vendorId === 'string' ? booking.vendorId : booking.vendorId?._id;
            return bookingVendorId === params.id && ['confirmed', 'completed'].includes(booking.status);
          });
          setCanReview(hasBooked);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load vendor details.');
    }
  };

  useEffect(() => {
    load();
  }, [params.id, token]);

  const pricingRows = useMemo(() => vendor?.services || [], [vendor]);

  const submitReview = async () => {
    if (!token) return setError('Please login to submit a review.');
    if (!canReview) return setError('Only booked brides can submit verified reviews.');
    if (!reviewText.trim()) return;
    try {
      await apiRequest(`/api/vendors/${params.id}/reviews`, token, {
        method: 'POST',
        body: JSON.stringify({ rating: reviewRating, comment: reviewText })
      });
      setReviewText('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit review.');
    }
  };

  if (error && !vendor) return <p className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</p>;
  if (!vendor) return <p className="text-muted-foreground">Loading vendor profile...</p>;

  return (
    <div className="relative space-y-6 overflow-hidden">
      <div className="pointer-events-none absolute -left-20 top-10 h-56 w-56 rounded-full bg-fuchsia-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-8 h-56 w-56 rounded-full bg-violet-400/20 blur-3xl" />

      <div className="relative">
        <div className="h-96 overflow-hidden rounded-2xl bg-muted">
          <img
            src={vendor.portfolio?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80'}
            alt={vendor.name}
            className="h-full w-full object-cover"
          />
        </div>
        <Card className="glass-card absolute -bottom-6 left-6 right-6 border-fuchsia-100 md:right-auto md:w-[28rem]">
          <CardContent className="pt-6">
            <h1 className="text-2xl font-bold">{vendor.name}</h1>
            <div className="mt-2 flex items-center gap-3">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-lg font-semibold">{vendor.rating?.toFixed(1) || '0.0'}</span>
              <span className="text-muted-foreground">({vendor.reviewsCount || 0} reviews)</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="glass-card border-fuchsia-100">
          <CardHeader><CardTitle>Contact & Availability</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" />{vendor.contact?.phone || 'N/A'}</div>
            <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" />{vendor.contact?.email || 'N/A'}</div>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{vendor.city || 'N/A'}</div>
            <p className="text-muted-foreground">
              {vendor.availability?.startDate ? `From ${vendor.availability.startDate.slice(0, 10)}` : 'Availability shared on request'}
            </p>
            <div className="space-y-2">
              <Link href={`/dashboard/vendors/book/${params.id}`}><Button className="w-full">Initiate Booking</Button></Link>
              <Link href="/dashboard/chat"><Button variant="outline" className="w-full">Send Message / Quote Request</Button></Link>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-fuchsia-100 md:col-span-2">
          <CardHeader><CardTitle>About Vendor</CardTitle></CardHeader>
          <CardContent>
            <div className="mb-3 flex gap-2">
              <Badge>{vendor.category}</Badge>
              {vendor.priceRange ? <Badge variant="outline">{vendor.priceRange}</Badge> : null}
            </div>
            <p className="text-muted-foreground">{vendor.description || 'No description added yet.'}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-fuchsia-100">
        <CardHeader><CardTitle>Portfolio Gallery</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {(vendor.portfolio?.length ? vendor.portfolio : [{}, {}, {}, {}]).map((item, index) => (
              <img
                key={`${item.imageUrl || 'fallback'}-${index}`}
                src={item.imageUrl || 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80'}
                alt="portfolio"
                className="h-40 w-full rounded-xl object-cover"
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-fuchsia-100">
        <CardHeader><CardTitle>Packages & Pricing</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {pricingRows.length ? pricingRows.map((pkg) => (
            <div key={`${pkg.name}-${pkg.basePrice}`} className="rounded-xl border border-fuchsia-100 bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{pkg.name}</p>
                <p className="font-semibold">{formatCurrency(pkg.basePrice || 0, pkg.currency || 'USD')}</p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{pkg.description || 'Customizable service package.'}</p>
              <Link href={`/dashboard/vendors/book/${params.id}`}><Button className="mt-3" variant="outline">Book this Package</Button></Link>
            </div>
          )) : <p className="text-sm text-muted-foreground">Pricing will be shared after inquiry.</p>}
        </CardContent>
      </Card>

      <Card className="glass-card border-fuchsia-100">
        <CardHeader><CardTitle>Verified Reviews</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reviews.map((review, idx) => (
              <div key={`${review.createdAt}-${idx}`} className="rounded-xl border border-fuchsia-100 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-medium">Verified Bride</p>
                  <div className="flex">{[1, 2, 3, 4, 5].map((star) => <Star key={star} className={`h-4 w-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} />)}</div>
                </div>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
              </div>
            ))}
            {!reviews.length ? <p className="text-sm text-muted-foreground">No reviews yet.</p> : null}
          </div>

          <div className="mt-6 rounded-xl border border-fuchsia-100 bg-fuchsia-50/50 p-4">
            <p className="mb-2 font-semibold">Submit Verified Review</p>
            <div className="mb-2 flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setReviewRating(star)} className={star <= reviewRating ? 'text-yellow-500' : 'text-muted-foreground'}>
                  ★
                </button>
              ))}
            </div>
            <Textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder={canReview ? 'Share your experience...' : 'Book this vendor to unlock review posting.'} />
            <Button className="mt-3" onClick={submitReview} disabled={!canReview}>Submit Review</Button>
            {error ? <p className="mt-2 text-sm text-rose-700">{error}</p> : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
