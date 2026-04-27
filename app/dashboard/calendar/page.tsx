'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/lib/context/AuthContext';
import { apiRequest, getActiveWeddingId } from '@/lib/dashboard-api';

type Task = {
  _id: string;
  eventName: string;
  startTime: string;
  status: string;
  eventType?: string;
  assignedTo?: string | { _id: string; name?: string };
  vendors?: Array<string | { _id: string; name?: string }>;
};

export default function PlannerCalendarPage() {
  const { user, token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedEntity, setSelectedEntity] = useState('all');

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      const weddingId = await getActiveWeddingId(token);
      if (!weddingId) return setTasks([]);
      const rows = await apiRequest<Task[]>(`/api/timeline?weddingId=${weddingId}`, token);
      setTasks(rows);
    };
    load();
  }, [token]);

  const entityOptions = useMemo(() => {
    const options = [{ value: 'all', label: 'All Tasks' }];
    if (user) options.push({ value: 'me', label: 'My Tasks' });
    if (tasks.some((task) => Array.isArray(task.vendors) && task.vendors.length > 0)) {
      options.push({ value: 'vendor', label: 'Vendor Tasks' });
    }

    const eventTypes = Array.from(new Set(tasks.map((task) => task.eventType || 'other')));
    eventTypes.forEach((eventType) => {
      options.push({
        value: `type:${eventType}`,
        label: `${eventType.charAt(0).toUpperCase() + eventType.slice(1)} tasks`
      });
    });

    return options;
  }, [tasks, user]);

  const filteredTasks = useMemo(() => {
    if (selectedEntity === 'all') return tasks;
    if (selectedEntity === 'me') {
      return tasks.filter((task) => {
        if (!user?.id) return false;
        const assigned = task.assignedTo;
        if (!assigned) return false;
        if (typeof assigned === 'string') return assigned === user.id;
        return typeof assigned === 'object' && assigned._id === user.id;
      });
    }
    if (selectedEntity === 'vendor') {
      return tasks.filter((task) => Array.isArray(task.vendors) && task.vendors.length > 0);
    }
    if (selectedEntity.startsWith('type:')) {
      const type = selectedEntity.split(':')[1];
      return tasks.filter((task) => (task.eventType || 'other') === type);
    }
    return tasks;
  }, [selectedEntity, tasks, user]);

  const daily = useMemo(
    () => filteredTasks.filter((task) => task.startTime.slice(0, 10) === selectedDate),
    [filteredTasks, selectedDate]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Timeline Calendar</h1>
        <p className="text-muted-foreground">The countdown to your perfect day starts here.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <Card className="border-fuchsia-100">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-[1.4fr_1fr] items-end">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Entity calendar</p>
                <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                  <SelectTrigger className="w-full rounded-xl border border-input bg-background px-3 py-2">
                    <SelectValue placeholder="Select entity" />
                  </SelectTrigger>
                  <SelectContent>
                    {entityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date</p>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2"
                />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {filteredTasks.slice(0, 10).map((task) => (
                <div key={task._id} className="rounded-lg border border-fuchsia-100 px-3 py-2 text-sm">
                  <span className="font-medium">{task.startTime.slice(0, 10)}</span> • {task.eventName}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-fuchsia-100">
            <CardHeader><CardTitle>Daily Tasks</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {daily.map((task) => (
                <div key={task._id} className="rounded-lg border border-fuchsia-100 p-2 text-sm">
                  <p className="font-medium">{task.eventName}</p>
                  <p className="text-xs text-muted-foreground">{new Date(task.startTime).toLocaleTimeString()}</p>
                </div>
              ))}
              {!daily.length ? <p className="text-sm text-muted-foreground">No tasks for selected date.</p> : null}
            </CardContent>
          </Card>
          <Card className="border-fuchsia-100 bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white">
            <CardContent className="p-4">
              <p className="text-sm text-white/80">Final Countdown</p>
              <p className="text-3xl font-bold">{tasks.length}</p>
              <p className="text-xs text-white/80">planned timeline items</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
