'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { apiRequest, getActiveWeddingId } from '@/lib/dashboard-api';
import { getSocket, joinWeddingRoom } from '@/lib/realtime';

type TimelineEvent = {
  _id: string;
  weddingId: string;
  eventName: string;
  eventType?: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  location?: string;
  notes?: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
};

export default function TimelinePage() {
  const { token } = useAuth();
  const [weddingId, setWeddingId] = useState<string | null>(null);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newEvent, setNewEvent] = useState({
    startTime: '',
    endTime: '',
    eventName: '',
    location: '',
    notes: '',
    eventType: 'other'
  });

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        setError('');
        const id = await getActiveWeddingId(token);
        setWeddingId(id);
        joinWeddingRoom(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load wedding.');
      }
    };
    load();
  }, [token]);

  const loadTimeline = async (id: string) => {
    if (!token) return;
    try {
      setError('');
      const events = await apiRequest<TimelineEvent[]>(`/api/timeline?weddingId=${id}`, token);
      setTimelineEvents(events);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load timeline.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!weddingId) return;
    setLoading(true);
    void loadTimeline(weddingId);
  }, [weddingId, token]);

  useEffect(() => {
    if (!token) return;
    const socket = getSocket();
    const handler = (payload: { weddingId?: string }) => {
      if (!payload?.weddingId) return;
      if (payload.weddingId !== weddingId) return;
      void loadTimeline(weddingId);
    };
    socket.on('timeline:updated', handler);
    return () => socket.off('timeline:updated', handler);
  }, [token, weddingId]);

  const handleAddEvent = async () => {
    if (!token) return setError('Please login to continue.');
    if (!weddingId) return setError('Please create a wedding first.');
    if (!newEvent.startTime || !newEvent.eventName.trim()) return;

    try {
      setError('');
      await apiRequest('/api/timeline', token, {
        method: 'POST',
        body: JSON.stringify({
          weddingId,
          eventName: newEvent.eventName.trim(),
          eventType: newEvent.eventType,
          startTime: new Date(newEvent.startTime).toISOString(),
          endTime: newEvent.endTime ? new Date(newEvent.endTime).toISOString() : undefined,
          location: newEvent.location || undefined,
          notes: newEvent.notes || undefined
        })
      });

      setShowAddEvent(false);
      setNewEvent({ startTime: '', endTime: '', eventName: '', location: '', notes: '', eventType: 'other' });
      await loadTimeline(weddingId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to add event.');
    }
  };

  const sortedEvents = useMemo(
    () => [...timelineEvents].sort((a, b) => +new Date(a.startTime) - +new Date(b.startTime)),
    [timelineEvents]
  );

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
                type="datetime-local"
                value={newEvent.startTime}
                onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
              />
              <Input
                placeholder="Event name"
                value={newEvent.eventName}
                onChange={(e) => setNewEvent({ ...newEvent, eventName: e.target.value })}
              />
              <Input
                placeholder="Location (optional)"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              />
              <Input
                type="datetime-local"
                placeholder="End time (optional)"
                value={newEvent.endTime}
                onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
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

      {error ? <p className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</p> : null}

      {/* Timeline Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Wedding Day Schedule</CardTitle>
          <CardDescription>{sortedEvents.length} events scheduled</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? <p className="text-sm text-muted-foreground">Loading timeline...</p> : null}
            {sortedEvents.map((event, idx) => (
              <div key={event._id} className="relative">
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
                          <span className="font-semibold text-lg">
                            {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold mt-1">{event.eventName}</h3>
                        {event.location ? (
                          <p className="text-sm text-muted-foreground mt-1">
                            <strong>Location:</strong> {event.location}
                          </p>
                        ) : null}
                        {event.notes ? (
                          <p className="text-sm text-muted-foreground mt-1">
                            <strong>Notes:</strong> {event.notes}
                          </p>
                        ) : null}
                      </div>
                      <Badge variant="outline">{event.status || 'pending'}</Badge>
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
            <div className="text-2xl font-bold">
              {sortedEvents[0]?.startTime ? new Date(sortedEvents[0].startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{sortedEvents[0]?.eventName || '-'}</p>
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
            <div className="text-2xl font-bold">
              {sortedEvents[sortedEvents.length - 1]?.startTime
                ? new Date(sortedEvents[sortedEvents.length - 1].startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : '-'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{sortedEvents[sortedEvents.length - 1]?.eventName || '-'}</p>
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
