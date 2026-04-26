'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Phone, Mail, Download, Check, X, Clock } from 'lucide-react';

interface Booking {
  id: string;
  brideName: string;
  groomName: string;
  eventDate: string;
  eventLocation: string;
  service: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  amount: number;
  advance: number;
  remaining: number;
  phone: string;
  email: string;
  requirements: string;
}

const bookings: Booking[] = [
  {
    id: '1',
    brideName: 'Priya Sharma',
    groomName: 'Raj Kumar',
    eventDate: 'June 15, 2024',
    eventLocation: 'Delhi Convention Center',
    service: 'Wedding Photography',
    status: 'confirmed',
    amount: 2500,
    advance: 1250,
    remaining: 1250,
    phone: '+91 98765 43210',
    email: 'priya@email.com',
    requirements: 'Pre-wedding shoot + Reception coverage, Album design'
  },
  {
    id: '2',
    brideName: 'Anjali Patel',
    groomName: 'Arjun Singh',
    eventDate: 'July 20, 2024',
    eventLocation: 'Mumbai Banquet Hall',
    service: 'Photography + Videography',
    status: 'pending',
    amount: 3500,
    advance: 0,
    remaining: 3500,
    phone: '+91 98765 43211',
    email: 'anjali@email.com',
    requirements: 'Full day coverage with drone shots'
  },
  {
    id: '3',
    brideName: 'Neha Gupta',
    groomName: 'Vikram Patel',
    eventDate: 'August 10, 2024',
    eventLocation: 'Bangalore Wedding Complex',
    service: 'Photography',
    status: 'pending',
    amount: 2000,
    advance: 500,
    remaining: 1500,
    phone: '+91 98765 43212',
    email: 'neha@email.com',
    requirements: 'Pre-wedding only'
  },
  {
    id: '4',
    brideName: 'Pooja Singh',
    groomName: 'Rohit Verma',
    eventDate: 'May 25, 2024',
    eventLocation: 'Jaipur Palace',
    service: 'Wedding Photography',
    status: 'completed',
    amount: 2500,
    advance: 2500,
    remaining: 0,
    phone: '+91 98765 43213',
    email: 'pooja@email.com',
    requirements: 'All events covered'
  }
];

const statusColors = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Awaiting Confirmation' },
  confirmed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmed' },
  completed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Completed' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' }
};

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredBookings = activeTab === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === activeTab);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Bookings</h1>
        <p className="mt-2 text-muted-foreground">
          View, respond to, and manage all your wedding bookings
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Bookings ({bookings.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({bookings.filter(b => b.status === 'pending').length})</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed ({bookings.filter(b => b.status === 'confirmed').length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({bookings.filter(b => b.status === 'completed').length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredBookings.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No bookings found in this category</p>
              </CardContent>
            </Card>
          ) : (
            filteredBookings.map((booking) => {
              const statusInfo = statusColors[booking.status];
              return (
                <Card key={booking.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/50 pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {booking.brideName} & {booking.groomName}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">{booking.service}</p>
                      </div>
                      <Badge className={`${statusInfo.bg} ${statusInfo.text}`}>
                        {statusInfo.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Event Details */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Event Date</p>
                            <p className="font-medium">{booking.eventDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Location</p>
                            <p className="font-medium">{booking.eventLocation}</p>
                          </div>
                        </div>
                        <div className="rounded-lg bg-muted p-3 mt-3">
                          <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                            Requirements
                          </p>
                          <p className="text-sm">{booking.requirements}</p>
                        </div>
                      </div>

                      {/* Contact & Payment */}
                      <div>
                        <div className="space-y-3 mb-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Contact</p>
                            <div className="flex items-center gap-1 mt-1">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <p className="text-sm font-medium">{booking.phone}</p>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-1">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <p className="text-sm font-medium">{booking.email}</p>
                            </div>
                          </div>
                        </div>

                        {/* Payment Status */}
                        <div className="rounded-lg bg-blue-50 p-3 border border-blue-200">
                          <p className="text-xs font-semibold text-blue-900 mb-2">PAYMENT STATUS</p>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Total Amount:</span>
                              <span className="font-semibold">₹{booking.amount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-green-700">
                              <span>Advance Received:</span>
                              <span className="font-semibold">₹{booking.advance.toLocaleString()}</span>
                            </div>
                            <div className="border-t pt-2 flex justify-between text-orange-700">
                              <span>Remaining:</span>
                              <span className="font-semibold">₹{booking.remaining.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex flex-wrap gap-2 border-t pt-4">
                      {booking.status === 'pending' && (
                        <>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <Check className="h-4 w-4 mr-2" />
                            Accept Booking
                          </Button>
                          <Button size="sm" variant="destructive">
                            <X className="h-4 w-4 mr-2" />
                            Decline
                          </Button>
                        </>
                      )}
                      {booking.status === 'confirmed' && (
                        <>
                          <Button size="sm" variant="outline">
                            <Clock className="h-4 w-4 mr-2" />
                            Mark as Completed
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download Contract
                      </Button>
                      <Button size="sm" variant="outline">Send Message</Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
