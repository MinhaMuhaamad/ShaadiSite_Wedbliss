'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function NewWeddingPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    brideName: '',
    groomName: '',
    weddingDate: '',
    venueName: '',
    venueCity: '',
    venueState: '',
    theme: '',
    primaryColor: '#D4A5A5',
    secondaryColor: '#F5E6E0',
    numberOfGuests: '',
    totalBudget: '',
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/weddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          brideName: formData.brideName,
          groomName: formData.groomName,
          weddingDate: formData.weddingDate,
          venue: {
            name: formData.venueName,
            city: formData.venueCity,
            state: formData.venueState
          },
          theme: formData.theme,
          colors: {
            primary: formData.primaryColor,
            secondary: formData.secondaryColor
          },
          numberOfGuests: formData.numberOfGuests ? parseInt(formData.numberOfGuests) : 0,
          totalBudget: formData.totalBudget ? parseFloat(formData.totalBudget) : 0,
          description: formData.description
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create wedding');
      }

      const data = await response.json();
      router.push(`/dashboard/weddings/${data.wedding._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create wedding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <Link href="/dashboard/weddings" className="flex items-center gap-2 text-primary hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Weddings
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Wedding</CardTitle>
          <CardDescription>Get started by filling in your wedding details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-destructive/10 text-destructive rounded-md flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            {/* Couple Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Couple Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brideName">Bride&apos;s Name</Label>
                  <Input
                    id="brideName"
                    name="brideName"
                    value={formData.brideName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="groomName">Groom&apos;s Name</Label>
                  <Input
                    id="groomName"
                    name="groomName"
                    value={formData.groomName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Wedding Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Wedding Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weddingDate">Wedding Date</Label>
                  <Input
                    id="weddingDate"
                    name="weddingDate"
                    type="date"
                    value={formData.weddingDate}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numberOfGuests">Expected Guests</Label>
                  <Input
                    id="numberOfGuests"
                    name="numberOfGuests"
                    type="number"
                    value={formData.numberOfGuests}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Venue Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Venue Information</h3>
              <div className="space-y-2">
                <Label htmlFor="venueName">Venue Name</Label>
                <Input
                  id="venueName"
                  name="venueName"
                  value={formData.venueName}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="venueCity">City</Label>
                  <Input
                    id="venueCity"
                    name="venueCity"
                    value={formData.venueCity}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="venueState">State/Province</Label>
                  <Input
                    id="venueState"
                    name="venueState"
                    value={formData.venueState}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Theme & Colors */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Theme & Colors</h3>
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Input
                  id="theme"
                  name="theme"
                  placeholder="e.g., Romantic Garden, Modern Minimalist"
                  value={formData.theme}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      name="primaryColor"
                      type="color"
                      value={formData.primaryColor}
                      onChange={handleChange}
                      className="w-16 h-10 p-1"
                      disabled={loading}
                    />
                    <Input
                      type="text"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      name="secondaryColor"
                      type="color"
                      value={formData.secondaryColor}
                      onChange={handleChange}
                      className="w-16 h-10 p-1"
                      disabled={loading}
                    />
                    <Input
                      type="text"
                      value={formData.secondaryColor}
                      onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Budget */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Budget</h3>
              <div className="space-y-2">
                <Label htmlFor="totalBudget">Total Budget (USD)</Label>
                <Input
                  id="totalBudget"
                  name="totalBudget"
                  type="number"
                  step="0.01"
                  value={formData.totalBudget}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Additional Notes</h3>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Add any additional notes or ideas for your wedding..."
                  value={formData.description}
                  onChange={handleChange}
                  className="min-h-24"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Creating Wedding...' : 'Create Wedding'}
              </Button>
              <Link href="/dashboard/weddings" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
