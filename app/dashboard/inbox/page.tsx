'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/context/AuthContext';
import { apiRequest } from '@/lib/dashboard-api';

type Conversation = {
  conversationId: string;
  name: string;
  lastMessage: string;
  unread: number;
};

type Message = {
  _id?: string;
  senderId: string;
  text?: string;
  mediaUrl?: string;
  timestamp: string;
};

type ConversationDetails = {
  conversationId: string;
  name?: string;
  messages: Message[];
};

export default function InboxPage() {
  const { token, user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState('');
  const [details, setDetails] = useState<ConversationDetails | null>(null);
  const [message, setMessage] = useState('');

  const loadConversations = async () => {
    if (!token) return;
    const rows = await apiRequest<Conversation[]>('/api/chat/conversations', token);
    setConversations(rows);
    if (!selectedConversationId && rows[0]) {
      setSelectedConversationId(rows[0].conversationId);
    }
  };

  const loadMessages = async (conversationId: string) => {
    if (!token || !conversationId) return;
    const row = await apiRequest<ConversationDetails>(`/api/chat/conversation/${conversationId}`, token);
    setDetails(row);
  };

  useEffect(() => {
    loadConversations();
    const poll = setInterval(loadConversations, 12000);
    return () => clearInterval(poll);
  }, [token]);

  useEffect(() => {
    if (selectedConversationId) loadMessages(selectedConversationId);
  }, [selectedConversationId, token]);

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault();
    if (!token || !selectedConversationId || !message.trim()) return;
    await apiRequest('/api/chat/message', token, {
      method: 'POST',
      body: JSON.stringify({
        conversationId: selectedConversationId,
        text: message
      })
    });
    setMessage('');
    await loadMessages(selectedConversationId);
    await loadConversations();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-5xl font-bold">Messaging</h1>
        <Input className="max-w-sm" placeholder="Search by vendor name..." />
      </div>
      <div className="grid gap-6 lg:grid-cols-[0.32fr_0.68fr]">
        <Card className="border-fuchsia-100">
          <CardHeader><CardTitle>Recent Conversations</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {conversations.map((conv) => (
              <button
                key={conv.conversationId}
                onClick={() => setSelectedConversationId(conv.conversationId)}
                className={`w-full rounded-xl border p-3 text-left ${selectedConversationId === conv.conversationId ? 'border-fuchsia-500 bg-fuchsia-50' : 'border-fuchsia-100'}`}
              >
                <p className="font-semibold">{conv.name}</p>
                <p className="text-xs text-muted-foreground">{conv.lastMessage || 'No messages yet'}</p>
              </button>
            ))}
            {!conversations.length ? <p className="text-sm text-muted-foreground">No conversations found.</p> : null}
          </CardContent>
        </Card>

        <Card className="border-fuchsia-100">
          <CardHeader><CardTitle>{details?.name || 'Conversation'}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="max-h-[28rem] space-y-3 overflow-y-auto rounded-xl border border-fuchsia-100 p-3">
              {details?.messages?.map((msg, idx) => (
                <div key={`${msg.timestamp}-${idx}`} className={String(msg.senderId) === String(user?.id) ? 'text-right' : 'text-left'}>
                  <div className={`inline-block rounded-xl px-3 py-2 ${String(msg.senderId) === String(user?.id) ? 'bg-gradient-to-r from-fuchsia-600 to-violet-500 text-white' : 'bg-fuchsia-50'}`}>
                    {msg.text || 'Media message'}
                  </div>
                </div>
              ))}
            </div>
            <form className="flex gap-2" onSubmit={sendMessage}>
              <Input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Write your message..." />
              <Button type="submit">Send</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
