'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/context/AuthContext';
import { apiRequest, getActiveWeddingId } from '@/lib/dashboard-api';

type Task = {
  _id: string;
  eventName: string;
  startTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  eventType?: string;
  notes?: string;
  weddingId: string;
};

export default function ChecklistPage() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskName, setTaskName] = useState('');
  const [taskDeadline, setTaskDeadline] = useState(() => new Date().toISOString().slice(0, 16));
  const [error, setError] = useState('');

  const load = async () => {
    if (!token) return;
    try {
      setError('');
      const weddingId = await getActiveWeddingId(token);
      if (!weddingId) return setTasks([]);
      const rows = await apiRequest<Task[]>(`/api/timeline?weddingId=${weddingId}`, token);
      setTasks(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load checklist.');
    }
  };

  useEffect(() => {
    load();
    const poll = setInterval(load, 12000);
    return () => clearInterval(poll);
  }, [token]);

  const progress = useMemo(() => {
    if (!tasks.length) return 0;
    const completed = tasks.filter((task) => task.status === 'completed').length;
    return Math.round((completed / tasks.length) * 100);
  }, [tasks]);

  const addTask = async (event: FormEvent) => {
    event.preventDefault();
    if (!token || !taskName.trim()) return;
    try {
      const weddingId = await getActiveWeddingId(token);
      if (!weddingId) return;
      await apiRequest('/api/timeline', token, {
        method: 'POST',
        body: JSON.stringify({
          weddingId,
          eventName: taskName,
          startTime: new Date(taskDeadline).toISOString(),
          status: 'pending',
          eventType: 'other'
        })
      });
      setTaskName('');
      setTaskDeadline(new Date().toISOString().slice(0, 16));
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to add task.');
    }
  };

  const toggleTask = async (task: Task) => {
    if (!token) return;
    const next = task.status === 'completed' ? 'pending' : 'completed';
    await apiRequest(`/api/timeline/${task._id}`, token, {
      method: 'PUT',
      body: JSON.stringify({ status: next })
    });
    setTasks((prev) => prev.map((item) => (item._id === task._id ? { ...item, status: next } : item)));
  };

  return (
    <div className="space-y-6">
      <Card className="border-fuchsia-100 bg-fuchsia-50/60">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <h1 className="text-4xl font-bold">Wedding Checklist</h1>
            <p className="mt-2 text-muted-foreground">Live task tracking for your coordination team.</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-fuchsia-700">{progress}%</p>
            <p className="text-xs text-muted-foreground">COMPLETE</p>
          </div>
        </CardContent>
      </Card>

      {error ? <p className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</p> : null}

      <form onSubmit={addTask} className="grid gap-2 md:grid-cols-[1fr_240px_auto]">
        <Input value={taskName} onChange={(event) => setTaskName(event.target.value)} placeholder="Add task..." />
        <Input
          type="datetime-local"
          value={taskDeadline}
          onChange={(event) => setTaskDeadline(event.target.value)}
          className="min-w-0"
        />
        <Button type="submit">Add Task</Button>
      </form>

      <Card className="border-fuchsia-100">
        <CardHeader><CardTitle>Task List</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {tasks.map((task) => (
            <div key={task._id} className="flex flex-col gap-3 rounded-xl border border-fuchsia-100 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>{task.eventName}</p>
                <p className="text-xs text-muted-foreground">Deadline: {new Date(task.startTime).toLocaleString()}</p>
              </div>
              <Button size="sm" variant={task.status === 'completed' ? 'outline' : 'default'} onClick={() => toggleTask(task)}>
                {task.status === 'completed' ? 'Reopen' : 'Mark Done'}
              </Button>
            </div>
          ))}
          {!tasks.length ? <p className="text-sm text-muted-foreground">No tasks yet.</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
