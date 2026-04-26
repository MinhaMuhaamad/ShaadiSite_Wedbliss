'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Edit2, Save, Camera, X, Plus, Star } from 'lucide-react';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    businessName: 'Premium Photography Studios',
    ownerName: 'Raj Kumar',
    email: 'raj@photostudios.com',
    phone: '+91 98765 43210',
    businessType: 'Photographer',
    location: 'Delhi',
    yearsExperience: 8,
    bio: 'Professional wedding photographer with 8 years of experience capturing beautiful moments.',
    website: 'www.photostudios.com',
    services: ['Wedding Photography', 'Pre-wedding Shoots', 'Reception Photography', 'Album Design']
  });

  const [formData, setFormData] = useState(profile);

  const handleSave = () => {
    setProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profile Management</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your business profile and attract more bookings
          </p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button onClick={handleCancel} variant="outline">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Profile Picture Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Upload your profile photo for brides to recognize you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
              RK
            </div>
            {isEditing && (
              <Button variant="outline">
                <Camera className="h-4 w-4 mr-2" />
                Change Photo
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium mb-2 block">Business Name</label>
              <Input
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Owner Name</label>
              <Input
                name="ownerName"
                value={formData.ownerName}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Phone</label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Business Type</label>
              <Input
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Location</label>
              <Input
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Years of Experience</label>
              <Input
                name="yearsExperience"
                type="number"
                value={formData.yearsExperience}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Website</label>
              <Input
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Bio</label>
            <Textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              disabled={!isEditing}
              rows={4}
              placeholder="Tell brides about your experience and style"
            />
          </div>
        </CardContent>
      </Card>

      {/* Services */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Services Offered</CardTitle>
            <CardDescription>Select the services you provide</CardDescription>
          </div>
          {isEditing && (
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Add Service
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {profile.services.map((service, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium">{service}</span>
                {isEditing && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        services: formData.services.filter((_, i) => i !== idx)
                      });
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Portfolio */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio</CardTitle>
          <CardDescription>Showcase your best work</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((img) => (
              <div
                key={img}
                className="aspect-square rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/80 transition cursor-pointer"
              >
                <Camera className="h-8 w-8" />
              </div>
            ))}
            {isEditing && (
              <Button variant="outline" className="aspect-square">
                <Plus className="h-6 w-6" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Rating & Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Your Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">4.8</div>
              <div className="flex items-center justify-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-2">12 reviews</p>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">5 ★</div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-4/5 bg-yellow-400" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">8 reviews</p>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">4 ★</div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-1/5 bg-yellow-400" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">4 reviews</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
