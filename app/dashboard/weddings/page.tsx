'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Heart, Plus, Trash2 } from 'lucide-react';

interface WeddingCard {
  _id: string;
  brideName: string;
  groomName: string;
  weddingDate: string;
  venue: {
    name: string;
  };
  theme: string;
  status: string;
  numberOfGuests: number;
}

export default function WeddingsPage() {
  const { token } = useAuth();
  const [weddings, setWeddings] = useState<WeddingCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWeddings();
  }, []);

  const fetchWeddings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/weddings', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch weddings');

      const data = await response.json();
      setWeddings(data);
    } catch (err) {
      setError('Failed to load weddings');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWedding = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this wedding? This cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/weddings/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete wedding');

      setWeddings(weddings.filter(w => w._id !== id));
    } catch (err) {
      setError('Failed to delete wedding');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">My Weddings</h1>
          <p className="text-muted-foreground">Manage your wedding plans</p>
        </div>
        <Link href="/dashboard/weddings/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Wedding
          </Button>
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Empty State */}
      {weddings.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent className="space-y-4">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No weddings yet</h3>
              <p className="text-muted-foreground mb-6">Create your first wedding to get started with planning</p>
              <Link href="/dashboard/weddings/new">
                <Button>Create Wedding</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {weddings.map((wedding) => (
            <Card key={wedding._id} className="hover:shadow-lg transition-shadow overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {wedding.brideName} & {wedding.groomName}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {formatDate(wedding.weddingDate)}
                    </CardDescription>
                  </div>
                  <button
                    onClick={() => handleDeleteWedding(wedding._id)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">{wedding.venue?.name || 'TBD'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Theme:</span>
                    <span className="font-medium">{wedding.theme || 'TBD'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Guests:</span>
                    <span className="font-medium">{wedding.numberOfGuests || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className={`font-medium capitalize px-2 py-1 rounded text-xs ${
                      wedding.status === 'completed' ? 'bg-green-100 text-green-700' :
                      wedding.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {wedding.status}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <Link href={`/dashboard/weddings/${wedding._id}`}>
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
