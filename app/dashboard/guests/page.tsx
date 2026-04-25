'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, MoreVertical, Mail, Phone, User, CheckCircle, Clock, XCircle } from 'lucide-react';

const MOCK_GUESTS = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah@email.com', phone: '(555) 123-4567', side: 'bride', party: 'immediate family', plusOnes: 1, rsvpStatus: 'accepted', dietaryRestrictions: 'Vegetarian', notes: 'Bringing spouse' },
  { id: 2, name: 'Michael Johnson', email: 'michael@email.com', phone: '(555) 234-5678', side: 'bride', party: 'immediate family', plusOnes: 0, rsvpStatus: 'accepted', dietaryRestrictions: 'None', notes: '' },
  { id: 3, name: 'Emma Davis', email: 'emma@email.com', phone: '(555) 345-6789', side: 'groom', party: 'friends', plusOnes: 1, rsvpStatus: 'pending', dietaryRestrictions: 'Gluten-free', notes: '' },
  { id: 4, name: 'James Wilson', email: 'james@email.com', phone: '(555) 456-7890', side: 'groom', party: 'colleagues', plusOnes: 0, rsvpStatus: 'declined', dietaryRestrictions: 'None', notes: 'Work conflict' },
  { id: 5, name: 'Jessica Brown', email: 'jessica@email.com', phone: '(555) 567-8901', side: 'bride', party: 'friends', plusOnes: 1, rsvpStatus: 'accepted', dietaryRestrictions: 'Vegan', notes: '' },
  { id: 6, name: 'David Miller', email: 'david@email.com', phone: '(555) 678-9012', side: 'groom', party: 'immediate family', plusOnes: 2, rsvpStatus: 'accepted', dietaryRestrictions: 'Kosher', notes: 'Bringing family' },
];

export default function GuestsPage() {
  const [guests, setGuests] = useState(MOCK_GUESTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRsvp, setFilterRsvp] = useState('all');
  const [filterSide, setFilterSide] = useState('all');
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [newGuest, setNewGuest] = useState({
    name: '',
    email: '',
    phone: '',
    side: 'bride',
    party: '',
    plusOnes: 0,
    dietaryRestrictions: 'None'
  });

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRsvp = filterRsvp === 'all' || guest.rsvpStatus === filterRsvp;
    const matchesSide = filterSide === 'all' || guest.side === filterSide;
    return matchesSearch && matchesRsvp && matchesSide;
  });

  const stats = {
    total: guests.length,
    accepted: guests.filter(g => g.rsvpStatus === 'accepted').length,
    pending: guests.filter(g => g.rsvpStatus === 'pending').length,
    declined: guests.filter(g => g.rsvpStatus === 'declined').length,
    totalWithPlusOnes: guests.reduce((sum, g) => sum + g.plusOnes + 1, 0)
  };

  const handleAddGuest = () => {
    if (newGuest.name && newGuest.email) {
      setGuests([...guests, { id: guests.length + 1, ...newGuest, rsvpStatus: 'pending' }]);
      setShowAddGuest(false);
      setNewGuest({ name: '', email: '', phone: '', side: 'bride', party: '', plusOnes: 0, dietaryRestrictions: 'None' });
    }
  };

  const updateRsvp = (id: number, status: string) => {
    setGuests(guests.map(g => g.id === id ? { ...g, rsvpStatus: status } : g));
  };

  const deleteGuest = (id: number) => {
    setGuests(guests.filter(g => g.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Guest Management</h1>
          <p className="text-muted-foreground mt-1">Manage your guest list and track RSVPs</p>
        </div>
        <Dialog open={showAddGuest} onOpenChange={setShowAddGuest}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Guest
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Guest</DialogTitle>
              <DialogDescription>Add a new guest to your wedding guest list</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Guest name"
                value={newGuest.name}
                onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
              />
              <Input
                type="email"
                placeholder="Email"
                value={newGuest.email}
                onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
              />
              <Input
                placeholder="Phone"
                value={newGuest.phone}
                onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
              />
              <Select value={newGuest.side} onValueChange={(value) => setNewGuest({ ...newGuest, side: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bride">Bride&apos;s Side</SelectItem>
                  <SelectItem value="groom">Groom&apos;s Side</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Party (e.g., family, friends)"
                value={newGuest.party}
                onChange={(e) => setNewGuest({ ...newGuest, party: e.target.value })}
              />
              <Input
                type="number"
                min="0"
                placeholder="Plus-ones"
                value={newGuest.plusOnes}
                onChange={(e) => setNewGuest({ ...newGuest, plusOnes: parseInt(e.target.value) || 0 })}
              />
              <Button onClick={handleAddGuest} className="w-full">Add Guest</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Guests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">{stats.totalWithPlusOnes} with plus-ones</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Accepted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{stats.accepted}</div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Declined</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{stats.declined}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Response Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total > 0 ? Math.round(((stats.accepted + stats.declined) / stats.total) * 100) : 0}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search guests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select value={filterRsvp} onValueChange={setFilterRsvp}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All RSVP Status</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterSide} onValueChange={setFilterSide}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Both Sides</SelectItem>
                <SelectItem value="bride">Bride&apos;s Side</SelectItem>
                <SelectItem value="groom">Groom&apos;s Side</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Guest List Table */}
      <Card>
        <CardHeader>
          <CardTitle>Guest List</CardTitle>
          <CardDescription>{filteredGuests.length} guests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Contact</th>
                  <th className="text-left py-3 px-4 font-semibold">Party</th>
                  <th className="text-center py-3 px-4 font-semibold">+1s</th>
                  <th className="text-left py-3 px-4 font-semibold">Dietary</th>
                  <th className="text-center py-3 px-4 font-semibold">RSVP</th>
                  <th className="text-center py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGuests.map((guest) => (
                  <tr key={guest.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{guest.name}</td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs">
                          <Mail className="w-3 h-3" />
                          {guest.email}
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <Phone className="w-3 h-3" />
                          {guest.phone}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="text-xs capitalize">
                        {guest.party}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center font-semibold">{guest.plusOnes}</td>
                    <td className="py-3 px-4 text-xs">{guest.dietaryRestrictions}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        {guest.rsvpStatus === 'accepted' && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                        {guest.rsvpStatus === 'pending' && (
                          <Clock className="w-4 h-4 text-yellow-600" />
                        )}
                        {guest.rsvpStatus === 'declined' && (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span className="text-xs capitalize">{guest.rsvpStatus}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Invitation Section */}
      <Card>
        <CardHeader>
          <CardTitle>Send Invitations</CardTitle>
          <CardDescription>Send digital invitations to pending guests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {stats.pending} guest(s) are still pending responses. Send them a reminder invitation.
            </p>
            <Button>Send Invitations to Pending Guests</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
