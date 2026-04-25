'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Trash2, UserPlus } from 'lucide-react';

interface Collaborator {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  role: string;
  permissions: string[];
}

export default function SettingsPage() {
  const { token } = useAuth();
  const [weddingId, setWeddingId] = useState('');
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [addingCollaborator, setAddingCollaborator] = useState(false);
  const [newCollaborator, setNewCollaborator] = useState({
    email: '',
    role: 'family'
  });

  useEffect(() => {
    // Get wedding ID from URL or use first wedding
    const params = new URLSearchParams(window.location.search);
    const wId = params.get('weddingId') || '';
    setWeddingId(wId);

    if (wId) {
      fetchCollaborators(wId);
    }
  }, []);

  const fetchCollaborators = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/collaborators/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch collaborators');

      const data = await response.json();
      setCollaborators(data);
    } catch (err) {
      setError('Failed to load collaborators');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCollaborator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weddingId) {
      setError('Please select a wedding first');
      return;
    }

    setAddingCollaborator(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/collaborators', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          weddingId,
          email: newCollaborator.email,
          role: newCollaborator.role
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to add collaborator');
      }

      setSuccess('Collaborator added successfully');
      setNewCollaborator({ email: '', role: 'family' });
      fetchCollaborators(weddingId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add collaborator');
    } finally {
      setAddingCollaborator(false);
    }
  };

  const handleRemoveCollaborator = async (collaboratorId: string) => {
    if (!window.confirm('Are you sure you want to remove this collaborator?')) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/collaborators/${weddingId}/${collaboratorId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!response.ok) throw new Error('Failed to remove collaborator');

      setSuccess('Collaborator removed');
      fetchCollaborators(weddingId);
    } catch (err) {
      setError('Failed to remove collaborator');
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Wedding Settings</h1>
        <p className="text-muted-foreground">Manage collaborators and permissions</p>
      </div>

      <div className="space-y-6">
        {/* Add Collaborator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Invite Collaborators
            </CardTitle>
            <CardDescription>Invite family members to help plan the wedding</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddCollaborator} className="space-y-4">
              {error && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-md flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm">
                  {success}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="collaborator@example.com"
                    value={newCollaborator.email}
                    onChange={(e) => setNewCollaborator({ ...newCollaborator, email: e.target.value })}
                    required
                    disabled={addingCollaborator}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={newCollaborator.role}
                    onValueChange={(value) => setNewCollaborator({ ...newCollaborator, role: value })}
                  >
                    <SelectTrigger disabled={addingCollaborator}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="family">Family Member</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="planner">Wedding Planner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button type="submit" className="w-full" disabled={addingCollaborator}>
                    {addingCollaborator ? 'Adding...' : 'Invite'}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Collaborators List */}
        <Card>
          <CardHeader>
            <CardTitle>Current Collaborators</CardTitle>
            <CardDescription>Manage who has access to this wedding</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : collaborators.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No collaborators yet. Invite someone to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {collaborators.map((collaborator) => (
                  <div
                    key={collaborator._id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{collaborator.userId.name}</p>
                      <p className="text-sm text-muted-foreground">{collaborator.userId.email}</p>
                      <p className="text-xs text-muted-foreground capitalize mt-1">
                        Role: {collaborator.role}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCollaborator(collaborator._id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
