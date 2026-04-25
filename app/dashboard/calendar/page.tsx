'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/context/AuthContext';
import { apiRequest, getActiveWeddingId } from '@/lib/dashboard-api';

type Task = {
  _id: string;
  eventName: string;
  startTime: string;
  status: string;
};

export default function PlannerCalendarPage() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

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

  const daily = useMemo(
    () => tasks.filter((task) => task.startTime.slice(0, 10) === selectedDate),
    [tasks, selectedDate]
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
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="rounded-xl border border-input bg-background px-3 py-2"
            />
            <div className="mt-4 space-y-2">
              {tasks.slice(0, 10).map((task) => (
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
