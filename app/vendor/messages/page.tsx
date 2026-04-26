'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Search, Archive, Trash2, Pin } from 'lucide-react';

interface Message {
  id: string;
  from: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  pinned: boolean;
  bookingId: string;
}

interface ChatMessage {
  id: string;
  sender: 'vendor' | 'customer';
  content: string;
  timestamp: string;
  avatar?: string;
}

const conversations: Message[] = [
  {
    id: '1',
    from: 'Priya Sharma',
    avatar: 'PS',
    lastMessage: 'Great! When can you visit for the pre-wedding shoot?',
    timestamp: '2 hours ago',
    unread: true,
    pinned: true,
    bookingId: '1'
  },
  {
    id: '2',
    from: 'Anjali Patel',
    avatar: 'AP',
    lastMessage: 'Can you provide the quotation breakdown?',
    timestamp: '5 hours ago',
    unread: true,
    pinned: false,
    bookingId: '2'
  },
  {
    id: '3',
    from: 'Neha Gupta',
    avatar: 'NG',
    lastMessage: 'Thank you for the wonderful service!',
    timestamp: '1 day ago',
    unread: false,
    pinned: false,
    bookingId: '3'
  },
  {
    id: '4',
    from: 'Pooja Singh',
    avatar: 'PS',
    lastMessage: 'The photos look amazing! Can you send the editorials?',
    timestamp: '2 days ago',
    unread: false,
    pinned: false,
    bookingId: '4'
  }
];

const chatMessages: ChatMessage[] = [
  {
    id: '1',
    sender: 'customer',
    content: 'Hi! We loved your portfolio. Can you do our wedding on June 15?',
    timestamp: '10:30 AM',
    avatar: 'PS'
  },
  {
    id: '2',
    sender: 'vendor',
    content: 'Thank you! Yes, June 15 is available. Let me check my calendar and get back to you with the quotation.',
    timestamp: '10:45 AM'
  },
  {
    id: '3',
    sender: 'customer',
    content: 'Great! When can you visit for the pre-wedding shoot?',
    timestamp: '11:15 AM',
    avatar: 'PS'
  }
];

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string>('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const filteredConversations = conversations.filter((conv) =>
    conv.from.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedChat = conversations.find((c) => c.id === selectedConversation);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="mt-2 text-muted-foreground">
          Chat with brides and discuss event details
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Conversations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search conversations"
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-2 max-h-[600px] overflow-auto">
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`cursor-pointer rounded-lg border p-3 transition ${
                    selectedConversation === conv.id
                      ? 'bg-primary/10 border-primary'
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                        {conv.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${conv.unread ? 'font-bold' : ''}`}>
                          {conv.from}
                        </p>
                      </div>
                    </div>
                    {conv.pinned && (
                      <Pin className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-muted-foreground">{conv.timestamp}</p>
                    {conv.unread && (
                      <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary">
                        1
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 flex flex-col">
          {selectedChat ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center text-white font-semibold">
                      {selectedChat.avatar}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{selectedChat.from}</CardTitle>
                      <CardDescription className="text-xs">Booking #{selectedChat.bookingId}</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost">
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages Display */}
              <CardContent className="flex-1 overflow-auto space-y-4 py-4">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${msg.sender === 'vendor' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'customer' && (
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                        {msg.avatar}
                      </div>
                    )}
                    <div
                      className={`max-w-xs rounded-lg p-3 ${
                        msg.sender === 'vendor'
                          ? 'bg-primary text-white'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p
                        className={`mt-1 text-xs ${
                          msg.sender === 'vendor'
                            ? 'text-white/70'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>

              {/* Message Input */}
              <CardHeader className="border-t py-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        setNewMessage('');
                      }
                    }}
                  />
                  <Button size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full text-muted-foreground">
              Select a conversation to start chatting
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
