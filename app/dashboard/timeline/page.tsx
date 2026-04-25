'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, AlertCircle } from 'lucide-react';

const MOCK_TIMELINE = [
  { id: 1, time: '08:00 AM', event: 'Bridal Party Arrives', vendor: 'Makeup Team', notes: 'Bridal suite', duration: '2 hours' },
  { id: 2, time: '10:00 AM', event: 'Hair & Makeup', vendor: 'Glam & Glamour', notes: 'Bride and bridesmaids', duration: '1.5 hours' },
  { id: 3, time: '11:30 AM', event: 'Photos - Getting Ready', vendor: 'Moments Photography', notes: 'Capture preparation', duration: '1 hour' },
  { id: 4, time: '12:30 PM', event: 'Groom Preparation', vendor: 'Self', notes: 'Groom and groomsmen ready', duration: '1 hour' },
  { id: 5, time: '01:00 PM', event: 'First Look', vendor: 'Moments Photography', notes: 'Garden behind venue', duration: '30 mins' },
  { id: 6, time: '01:30 PM', event: 'Family Photos', vendor: 'Moments Photography', notes: 'Before ceremony', duration: '45 mins' },
  { id: 7, time: '02:15 PM', event: 'Guests Arrive', vendor: 'Venue Staff', notes: 'Reception hall opens', duration: '30 mins' },
  { id: 8, time: '02:45 PM', event: 'Ceremony Begins', vendor: 'Officiant', notes: 'Main hall', duration: '30 mins' },
  { id: 9, time: '03:15 PM', event: 'Cocktail Hour', vendor: 'Catering', notes: 'Garden area', duration: '1 hour' },
  { id: 10, time: '04:15 PM', event: 'Reception Begins', vendor: 'Spin City DJ', notes: 'Dinner service starts', duration: '4 hours' },
  { id: 11, time: '05:00 PM', event: 'First Dance', vendor: 'Spin City DJ', notes: 'Grand entrance', duration: '5 mins' },
  { id: 12, time: '10:00 PM', event: 'Cake Cutting', vendor: 'Catering', notes: '', duration: '20 mins' },
  { id: 13, time: '10:30 PM', event: 'Bouquet Toss', vendor: 'Spin City DJ', notes: 'Music announcement', duration: '15 mins' },
  { id: 14, time: '11:00 PM', event: 'Last Dance', vendor: 'Spin City DJ', notes: 'Wind down', duration: '30 mins' },
];

export default function TimelinePage() {
  const [timelineEvents, setTimelineEvents] = useState(MOCK_TIMELINE);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    time: '',
    event: '',
    vendor: '',
    notes: '',
    duration: ''
  });

  const handleAddEvent = () => {
    if (newEvent.time && newEvent.event) {
      setTimelineEvents([...timelineEvents, { id: timelineEvents.length + 1, ...newEvent }]);
      setShowAddEvent(false);
      setNewEvent({ time: '', event: '', vendor: '', notes: '', duration: '' });
    }
  };

  const sortedEvents = [...timelineEvents].sort((a, b) => {
    const timeA = new Date(`2024-01-01 ${a.time}`);
    const timeB = new Date(`2024-01-01 ${b.time}`);
    return timeA - timeB;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Wedding Timeline</h1>
          <p className="text-muted-foreground mt-1">Plan and manage your wedding day schedule</p>
        </div>
        <Dialog open={showAddEvent} onOpenChange={setShowAddEvent}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Timeline Event</DialogTitle>
              <DialogDescription>Add a new event to your wedding day schedule</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
              />
              <Input
                placeholder="Event name"
                value={newEvent.event}
                onChange={(e) => setNewEvent({ ...newEvent, event: e.target.value })}
              />
              <Input
                placeholder="Vendor/Contact"
                value={newEvent.vendor}
                onChange={(e) => setNewEvent({ ...newEvent, vendor: e.target.value })}
              />
              <Input
                placeholder="Duration (e.g., 1 hour)"
                value={newEvent.duration}
                onChange={(e) => setNewEvent({ ...newEvent, duration: e.target.value })}
              />
              <Input
                placeholder="Notes (optional)"
                value={newEvent.notes}
                onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
              />
              <Button onClick={handleAddEvent} className="w-full">Add Event</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Timeline Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Wedding Day Schedule</CardTitle>
          <CardDescription>{sortedEvents.length} events scheduled</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedEvents.map((event, idx) => (
              <div key={event.id} className="relative">
                {idx > 0 && <div className="absolute left-8 top-0 h-4 w-0.5 bg-primary/20 -translate-y-4" />}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-primary mt-1" />
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="font-semibold text-lg">{event.time}</span>
                        </div>
                        <h3 className="text-lg font-semibold mt-1">{event.event}</h3>
                        {event.vendor && (
                          <p className="text-sm text-muted-foreground mt-1">
                            <strong>Vendor:</strong> {event.vendor}
                          </p>
                        )}
                        {event.duration && (
                          <p className="text-sm text-muted-foreground">
                            <strong>Duration:</strong> {event.duration}
                          </p>
                        )}
                        {event.notes && (
                          <p className="text-sm text-muted-foreground mt-1">
                            <strong>Notes:</strong> {event.notes}
                          </p>
                        )}
                      </div>
                      <Badge variant="outline">{event.duration}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Timeline Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">First Event</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sortedEvents[0]?.time}</div>
            <p className="text-xs text-muted-foreground mt-1">{sortedEvents[0]?.event}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sortedEvents.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last Event</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sortedEvents[sortedEvents.length - 1]?.time}</div>
            <p className="text-xs text-muted-foreground mt-1">{sortedEvents[sortedEvents.length - 1]?.event}</p>
          </CardContent>
        </Card>
      </div>

      {/* Coordination Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Coordination Reminders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Confirm all vendors 1 week before wedding</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Share final timeline with all participants</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Do final fitting for attire 2 weeks before</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Confirm final guest count with caterer</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
