'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Heart, Share2, Download, Upload } from 'lucide-react';

const MOCK_ALBUMS = [
  {
    id: 1,
    name: 'Ceremony',
    photoCount: 45,
    coverImage: 'https://via.placeholder.com/400x300?text=Ceremony',
    likes: 128,
    sharedWith: ['All Guests'],
    createdDate: '3 days ago'
  },
  {
    id: 2,
    name: 'Reception',
    photoCount: 87,
    coverImage: 'https://via.placeholder.com/400x300?text=Reception',
    likes: 256,
    sharedWith: ['All Guests'],
    createdDate: '3 days ago'
  },
  {
    id: 3,
    name: 'Getting Ready',
    photoCount: 32,
    coverImage: 'https://via.placeholder.com/400x300?text=Getting+Ready',
    likes: 89,
    sharedWith: ['Bride&apos;s Family'],
    createdDate: '3 days ago'
  },
  {
    id: 4,
    name: 'Cocktail Hour',
    photoCount: 56,
    coverImage: 'https://via.placeholder.com/400x300?text=Cocktail',
    likes: 145,
    sharedWith: ['All Guests'],
    createdDate: '2 days ago'
  },
  {
    id: 5,
    name: 'First Dance & Cake',
    photoCount: 28,
    coverImage: 'https://via.placeholder.com/400x300?text=First+Dance',
    likes: 198,
    sharedWith: ['All Guests'],
    createdDate: '2 days ago'
  },
  {
    id: 6,
    name: 'Guest Candids',
    photoCount: 124,
    coverImage: 'https://via.placeholder.com/400x300?text=Guests',
    likes: 312,
    sharedWith: ['All Guests'],
    createdDate: '1 day ago'
  }
];

export default function MemoriesPage() {
  const [albums, setAlbums] = useState(MOCK_ALBUMS);
  const [likedAlbums, setLikedAlbums] = useState<number[]>([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');

  const totalPhotos = albums.reduce((sum, a) => sum + a.photoCount, 0);
  const totalLikes = albums.reduce((sum, a) => sum + a.likes, 0);

  const handleLike = (albumId: number) => {
    setLikedAlbums(prev =>
      prev.includes(albumId)
        ? prev.filter(id => id !== albumId)
        : [...prev, albumId]
    );
  };

  const handleCreateAlbum = () => {
    if (newAlbumName.trim()) {
      setAlbums([...albums, {
        id: albums.length + 1,
        name: newAlbumName,
        photoCount: 0,
        coverImage: 'https://via.placeholder.com/400x300?text=New+Album',
        likes: 0,
        sharedWith: [],
        createdDate: 'Just now'
      }]);
      setShowUploadDialog(false);
      setNewAlbumName('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Wedding Memories</h1>
          <p className="text-muted-foreground mt-1">Share and preserve your wedding photos and videos</p>
        </div>
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Album
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Album</DialogTitle>
              <DialogDescription>Create a new album to organize your memories</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Album name"
                value={newAlbumName}
                onChange={(e) => setNewAlbumName(e.target.value)}
              />
              <Button onClick={handleCreateAlbum} className="w-full">Create Album</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Albums</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{albums.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPhotos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Likes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLikes + likedAlbums.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">My Likes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{likedAlbums.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Albums Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Photo Albums</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => (
            <Card key={album.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative h-48 bg-muted overflow-hidden">
                <img
                  src={album.coverImage}
                  alt={album.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
                <Badge className="absolute top-3 left-3 bg-black/50">{album.photoCount} photos</Badge>
              </div>

              <CardHeader>
                <CardTitle className="text-lg">{album.name}</CardTitle>
                <CardDescription>Created {album.createdDate}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {album.sharedWith.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2">Shared with:</p>
                      <div className="flex flex-wrap gap-1">
                        {album.sharedWith.map((share) => (
                          <Badge key={share} variant="secondary" className="text-xs">
                            {share}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <button
                      onClick={() => handleLike(album.id)}
                      className="flex items-center gap-1 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Heart
                        className={`w-4 h-4 ${likedAlbums.includes(album.id) ? 'fill-destructive text-destructive' : ''}`}
                      />
                      <span className="text-xs">{album.likes + (likedAlbums.includes(album.id) ? 1 : 0)}</span>
                    </button>

                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="h-8 gap-1">
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 gap-1">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Photos
          </CardTitle>
          <CardDescription>Add photos and videos to your wedding albums</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">Drag and drop your photos here or click to browse</p>
            <Button variant="outline" className="gap-2">
              <Upload className="w-4 h-4" />
              Choose Files
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
