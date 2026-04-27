'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/context/AuthContext';
import { apiRequest } from '@/lib/dashboard-api';
import { getSocket } from '@/lib/realtime';

type Conversation = {
  conversationId: string;
  name: string;
  lastMessage: string;
  unread: number;
  updatedAt?: string;
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
  quotes?: Quote[];
};

type QuoteItem = { name: string; qty?: number; notes?: string };
type QuoteOffer = { offeredBy: string; amount: number; currency?: string; notes?: string; createdAt: string };
type Quote = {
  _id: string;
  title: string;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  items: QuoteItem[];
  offers: QuoteOffer[];
  createdAt: string;
  updatedAt: string;
};

export default function InboxPage() {
  const { token, user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState('');
  const [details, setDetails] = useState<ConversationDetails | null>(null);
  const [message, setMessage] = useState('');
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [quoteTitle, setQuoteTitle] = useState('Quote Request');
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([{ name: '', qty: 1, notes: '' }]);
  const [quoteAmount, setQuoteAmount] = useState('');
  const [quoteCurrency, setQuoteCurrency] = useState('USD');
  const [quoteNotes, setQuoteNotes] = useState('');
  const [counterAmount, setCounterAmount] = useState<Record<string, string>>({});
  const [decisionNotes, setDecisionNotes] = useState<Record<string, string>>({});
  const loadConversationsRef = useRef<(() => Promise<void>) | null>(null);
  const loadMessagesRef = useRef<((conversationId: string) => Promise<void>) | null>(null);

  const loadConversations = async () => {
    if (!token) return;
    try {
      setError('');
      const rows = await apiRequest<Conversation[]>('/api/chat/conversations', token);
      setConversations(rows);
      if (!selectedConversationId && rows[0]) {
        setSelectedConversationId(rows[0].conversationId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load conversations.');
    }
  };

  const loadMessages = async (conversationId: string) => {
    if (!token || !conversationId) return;
    try {
      setError('');
      const row = await apiRequest<ConversationDetails>(`/api/chat/conversation/${conversationId}`, token);
      setDetails(row);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load conversation.');
    }
  };

  useEffect(() => {
    loadConversationsRef.current = loadConversations;
    loadMessagesRef.current = loadMessages;
    loadConversations();
  }, [token]);

  useEffect(() => {
    if (selectedConversationId) loadMessages(selectedConversationId);
  }, [selectedConversationId, token]);

  useEffect(() => {
    if (!token) return;
    const socket = getSocket();

    const onReceive = (payload: { conversationId?: string }) => {
      if (!payload?.conversationId) return;
      void loadConversationsRef.current?.();
      if (payload.conversationId === selectedConversationId) {
        void loadMessagesRef.current?.(payload.conversationId);
      }
    };

    socket.on('receive-message', onReceive);
    return () => {
      socket.off('receive-message', onReceive);
    };
  }, [token, selectedConversationId]);

  useEffect(() => {
    if (!selectedConversationId) return;
    const socket = getSocket();
    socket.emit('join-chat', selectedConversationId);
  }, [selectedConversationId]);

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

  const createQuote = async (event: FormEvent) => {
    event.preventDefault();
    if (!token || !selectedConversationId) return;
    const cleanedItems = quoteItems
      .map((it) => ({ ...it, name: (it.name || '').trim() }))
      .filter((it) => it.name);
    if (!cleanedItems.length) return setError('Add at least one quote item.');
    if (!quoteAmount || Number(quoteAmount) <= 0) return setError('Enter a valid quote amount.');

    await apiRequest('/api/chat/quote', token, {
      method: 'POST',
      body: JSON.stringify({
        conversationId: selectedConversationId,
        title: quoteTitle,
        items: cleanedItems,
        amount: Number(quoteAmount),
        currency: quoteCurrency,
        notes: quoteNotes
      })
    });

    setQuoteTitle('Quote Request');
    setQuoteItems([{ name: '', qty: 1, notes: '' }]);
    setQuoteAmount('');
    setQuoteNotes('');
    await loadMessages(selectedConversationId);
    await loadConversations();
  };

  const quoteAction = async (quoteId: string, action: 'accept' | 'decline' | 'counter') => {
    if (!token || !selectedConversationId) return;
    const amount = counterAmount[quoteId];
    await apiRequest('/api/chat/quote/action', token, {
      method: 'POST',
      body: JSON.stringify({
        conversationId: selectedConversationId,
        quoteId,
        action,
        amount: action === 'counter' ? Number(amount) : undefined,
        currency: quoteCurrency,
        notes: action === 'counter' ? (decisionNotes[quoteId] || '') : undefined,
        decisionNotes: action !== 'counter' ? (decisionNotes[quoteId] || '') : undefined
      })
    });
    await loadMessages(selectedConversationId);
    await loadConversations();
  };

  const blockConversation = async () => {
    if (!token || !selectedConversationId) return;
    await apiRequest(`/api/chat/conversation/${selectedConversationId}/block`, token, { method: 'POST' });
    setDetails(null);
    await loadConversations();
  };

  const reportConversation = async () => {
    if (!token || !selectedConversationId) return;
    await apiRequest(`/api/chat/conversation/${selectedConversationId}/report`, token, {
      method: 'POST',
      body: JSON.stringify({ reason: 'report', details: 'User submitted report' })
    });
    setError('Report submitted.');
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((c) => c.name.toLowerCase().includes(q));
  }, [conversations, query]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-5xl font-bold">Messaging</h1>
        <Input
          className="max-w-sm"
          placeholder="Search by vendor name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {error ? <p className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</p> : null}

      <div className="grid gap-6 lg:grid-cols-[0.32fr_0.68fr]">
        <Card className="border-fuchsia-100">
          <CardHeader><CardTitle>Recent Conversations</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {filtered.map((conv) => (
              <button
                key={conv.conversationId}
                onClick={() => setSelectedConversationId(conv.conversationId)}
                className={`w-full rounded-xl border p-3 text-left ${selectedConversationId === conv.conversationId ? 'border-fuchsia-500 bg-fuchsia-50' : 'border-fuchsia-100'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold">{conv.name}</p>
                  {conv.unread ? (
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-fuchsia-600 px-2 text-xs text-white">
                      {conv.unread}
                    </span>
                  ) : null}
                </div>
                <p className="text-xs text-muted-foreground">{conv.lastMessage || 'No messages yet'}</p>
                {conv.updatedAt ? (
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {new Date(conv.updatedAt).toLocaleString()}
                  </p>
                ) : null}
              </button>
            ))}
            {!filtered.length ? <p className="text-sm text-muted-foreground">No conversations found.</p> : null}
          </CardContent>
        </Card>

        <Card className="border-fuchsia-100">
          <CardHeader><CardTitle>{details?.name || 'Conversation'}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={blockConversation} disabled={!selectedConversationId}>
                Block Vendor
              </Button>
              <Button type="button" variant="outline" onClick={reportConversation} disabled={!selectedConversationId}>
                Report Vendor
              </Button>
            </div>
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

            <Card className="border-fuchsia-100">
              <CardHeader>
                <CardTitle>Quote Requests & Negotiation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={createQuote} className="space-y-3 rounded-xl border border-fuchsia-100 bg-fuchsia-50/40 p-4">
                  <p className="text-sm font-semibold">Submit a structured quote request</p>
                  <Input value={quoteTitle} onChange={(e) => setQuoteTitle(e.target.value)} placeholder="Quote title" />
                  <div className="space-y-2">
                    {quoteItems.map((item, idx) => (
                      <div key={idx} className="grid gap-2 md:grid-cols-[1fr_110px_1fr_90px]">
                        <Input
                          value={item.name}
                          onChange={(e) =>
                            setQuoteItems((prev) => prev.map((x, i) => (i === idx ? { ...x, name: e.target.value } : x)))
                          }
                          placeholder="Item name"
                        />
                        <Input
                          type="number"
                          value={String(item.qty ?? 1)}
                          onChange={(e) =>
                            setQuoteItems((prev) => prev.map((x, i) => (i === idx ? { ...x, qty: Number(e.target.value) } : x)))
                          }
                          placeholder="Qty"
                        />
                        <Input
                          value={item.notes || ''}
                          onChange={(e) =>
                            setQuoteItems((prev) => prev.map((x, i) => (i === idx ? { ...x, notes: e.target.value } : x)))
                          }
                          placeholder="Notes (optional)"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setQuoteItems((prev) => prev.filter((_, i) => i !== idx))}
                          disabled={quoteItems.length <= 1}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={() => setQuoteItems((prev) => [...prev, { name: '', qty: 1, notes: '' }])}>
                      Add Item
                    </Button>
                  </div>
                  <div className="grid gap-2 md:grid-cols-3">
                    <Input type="number" value={quoteAmount} onChange={(e) => setQuoteAmount(e.target.value)} placeholder="Total amount" />
                    <select className="rounded-xl border border-input bg-background px-3 py-2" value={quoteCurrency} onChange={(e) => setQuoteCurrency(e.target.value)}>
                      <option value="USD">USD</option>
                      <option value="PKR">PKR</option>
                      <option value="AED">AED</option>
                      <option value="SAR">SAR</option>
                    </select>
                    <Input value={quoteNotes} onChange={(e) => setQuoteNotes(e.target.value)} placeholder="Offer notes (optional)" />
                  </div>
                  <Button type="submit" disabled={!selectedConversationId}>Send Quote Request</Button>
                </form>

                <div className="space-y-3">
                  {(details?.quotes || []).map((quote) => {
                    const lastOffer = quote.offers?.[quote.offers.length - 1];
                    return (
                      <div key={quote._id} className="rounded-xl border border-fuchsia-100 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="font-semibold">{quote.title}</p>
                            <p className="text-xs text-muted-foreground">
                              Status: <span className="capitalize">{quote.status}</span>
                            </p>
                          </div>
                          <div className="text-sm font-semibold">
                            {lastOffer ? `${lastOffer.currency || 'USD'} ${lastOffer.amount}` : '—'}
                          </div>
                        </div>

                        <div className="mt-3 space-y-1 text-sm">
                          <p className="font-medium">Items</p>
                          <ul className="list-disc pl-5 text-muted-foreground">
                            {quote.items.map((it, i) => (
                              <li key={`${it.name}-${i}`}>{it.name} {it.qty ? `×${it.qty}` : ''}{it.notes ? ` — ${it.notes}` : ''}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-3 space-y-2 text-sm">
                          <p className="font-medium">Negotiation history</p>
                          <div className="space-y-1">
                            {quote.offers.map((offer, i) => (
                              <div key={`${offer.createdAt}-${i}`} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-fuchsia-50 px-3 py-2">
                                <span className="text-muted-foreground">
                                  {new Date(offer.createdAt).toLocaleString()}
                                </span>
                                <span className="font-semibold">
                                  {offer.currency || 'USD'} {offer.amount}
                                </span>
                                {offer.notes ? <span className="text-muted-foreground">{offer.notes}</span> : null}
                              </div>
                            ))}
                          </div>
                        </div>

                        {quote.status === 'pending' ? (
                          <div className="mt-3 grid gap-2 md:grid-cols-[1fr_1fr_1fr]">
                            <Button type="button" variant="outline" onClick={() => quoteAction(quote._id, 'accept')}>Accept</Button>
                            <Button type="button" variant="outline" onClick={() => quoteAction(quote._id, 'decline')}>Decline</Button>
                            <div className="flex gap-2">
                              <Input
                                type="number"
                                value={counterAmount[quote._id] || ''}
                                onChange={(e) => setCounterAmount((prev) => ({ ...prev, [quote._id]: e.target.value }))}
                                placeholder="Counter amount"
                              />
                              <Button type="button" onClick={() => quoteAction(quote._id, 'counter')}>Counter</Button>
                            </div>
                            <div className="md:col-span-3">
                              <Input
                                value={decisionNotes[quote._id] || ''}
                                onChange={(e) => setDecisionNotes((prev) => ({ ...prev, [quote._id]: e.target.value }))}
                                placeholder="Notes for accept/decline/counter (optional)"
                              />
                            </div>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                  {!details?.quotes?.length ? (
                    <p className="text-sm text-muted-foreground">No quotes yet. Create the first quote request above.</p>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
