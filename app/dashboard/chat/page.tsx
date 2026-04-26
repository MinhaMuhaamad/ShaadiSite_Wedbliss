'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Phone, Video } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/lib/context/AuthContext';
import { API_BASE_URL, apiRequest } from '@/lib/dashboard-api';
import { getActiveWeddingId } from '@/lib/dashboard-api';

type Conversation = {
  _id: string;
  conversationId: string;
  name: string;
  type: 'direct' | 'group' | 'vendor';
  lastMessage: string;
  updatedAt: string;
  unread: number;
};

type ChatMessage = {
  senderId: string;
  text?: string;
  mediaUrl?: string;
  timestamp: string;
  isRead: boolean;
};

type ChatThread = {
  _id: string;
  conversationId: string;
  name?: string;
  type: Conversation['type'];
  messages: ChatMessage[];
};

export default function ChatPage() {
  const { token, user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [thread, setThread] = useState<ChatThread | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  const selectedConversation = useMemo(
    () => conversations.find((c) => c.conversationId === selectedConversationId) || null,
    [conversations, selectedConversationId]
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [thread?.messages?.length]);

  useEffect(() => {
    if (!token) return;

    const load = async () => {
      try {
        setError('');
        const rows = await apiRequest<Conversation[]>('/api/chat/conversations', token);
        setConversations(rows);
        if (!selectedConversationId && rows.length) {
          setSelectedConversationId(rows[0].conversationId);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load conversations.');
      }
    };

    load();
  }, [token, selectedConversationId]);

  useEffect(() => {
    if (!token || !selectedConversationId) return;

    const loadThread = async () => {
      try {
        setError('');
        const chat = await apiRequest<ChatThread>(`/api/chat/conversation/${selectedConversationId}`, token);
        setThread(chat);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load conversation.');
      }
    };

    loadThread();
  }, [token, selectedConversationId]);

  useEffect(() => {
    if (!token) return;

    const socket = io(API_BASE_URL, {
      transports: ['websocket'],
      reconnection: true
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      // no-op
    });

    socket.on('receive-message', (payload: { conversationId?: string; message?: ChatMessage }) => {
      if (!payload?.conversationId || !payload?.message) return;
      if (payload.conversationId !== selectedConversationId) return;

      setThread((prev) => {
        if (!prev) return prev;
        const already = prev.messages.some(
          (m) => m.timestamp === payload.message!.timestamp && m.senderId === payload.message!.senderId && m.text === payload.message!.text
        );
        if (already) return prev;
        return { ...prev, messages: [...prev.messages, payload.message!] };
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, selectedConversationId]);

  useEffect(() => {
    if (!selectedConversationId || !socketRef.current) return;
    socketRef.current.emit('join-chat', selectedConversationId);
  }, [selectedConversationId]);

  const handleSendMessage = () => {
    void sendMessage();
  };

  const sendMessage = async () => {
    if (!token) return setError('Please login to send messages.');
    if (!selectedConversationId) return;
    const text = messageInput.trim();
    if (!text) return;

    try {
      setError('');
      setMessageInput('');

      const result = await apiRequest<{ chat: ChatThread }>('/api/chat/message', token, {
        method: 'POST',
        body: JSON.stringify({ conversationId: selectedConversationId, text })
      });

      const latest = result.chat?.messages?.[result.chat.messages.length - 1];
      if (latest && socketRef.current) {
        socketRef.current.emit('send-message', selectedConversationId, {
          conversationId: selectedConversationId,
          message: {
            senderId: String(latest.senderId),
            text: latest.text,
            mediaUrl: latest.mediaUrl,
            timestamp: new Date(latest.timestamp).toISOString(),
            isRead: latest.isRead
          } satisfies ChatMessage
        });
      }

      // Re-sync thread from API to avoid drift
      const updated = await apiRequest<ChatThread>(`/api/chat/conversation/${selectedConversationId}`, token);
      setThread(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send message.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messaging</h1>
        <p className="text-muted-foreground mt-1">Chat with family, vendors, and your planning team</p>
      </div>

      {error ? <p className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</p> : null}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Conversations</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {conversations.map((conversation) => (
                <button
                  key={conversation.conversationId}
                  onClick={() => setSelectedConversationId(conversation.conversationId)}
                  className={`w-full text-left px-4 py-3 border-b border-border hover:bg-muted transition-colors ${
                    selectedConversationId === conversation.conversationId ? 'bg-muted border-l-2 border-l-primary' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{conversation.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unread > 0 && (
                      <Badge className="h-5 w-5 flex items-center justify-center rounded-full p-0 text-xs">
                        {conversation.unread}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {conversation.updatedAt ? new Date(conversation.updatedAt).toLocaleString() : ''}
                  </p>
                </button>
              ))}
              {!conversations.length ? (
                <div className="p-4 text-sm text-muted-foreground">No conversations yet.</div>
              ) : null}
            </div>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-3">
          <CardHeader className="border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{selectedConversation?.name || 'Conversation'}</CardTitle>
                <CardDescription>
                  {selectedConversation?.type ? selectedConversation.type : ''}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="gap-2">
                  <Phone className="w-4 h-4" />
                  Call
                </Button>
                <Button size="sm" variant="outline" className="gap-2">
                  <Video className="w-4 h-4" />
                  Video
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col h-96">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {(thread?.messages || []).map((msg, idx) => {
                const isMine = user?.id && String(msg.senderId) === String(user.id);
                const label = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                return (
                <div
                  key={`${msg.timestamp}-${idx}`}
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      isMine
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <p className="text-sm">{msg.text || (msg.mediaUrl ? 'Media' : '')}</p>
                    <p className={`text-xs mt-1 ${isMine ? 'opacity-75' : 'opacity-50'}`}>
                      {label}
                    </p>
                  </div>
                </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-border p-4 flex gap-2">
              <Input
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} className="gap-2">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
