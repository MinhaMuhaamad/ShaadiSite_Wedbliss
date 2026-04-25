'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Phone, Video } from 'lucide-react';

const MOCK_CONVERSATIONS = [
  {
    id: 1,
    name: 'Wedding Planning Team',
    type: 'group',
    members: ['You', 'Mom', 'Maid of Honor', 'Groom'],
    unread: 3,
    lastMessage: 'Vendor confirmations sent!',
    timestamp: '2 hours ago'
  },
  {
    id: 2,
    name: 'Mom',
    type: 'direct',
    unread: 0,
    lastMessage: 'Can&apos;t wait for the wedding!',
    timestamp: 'Yesterday'
  },
  {
    id: 3,
    name: 'The Grand Ballroom',
    type: 'vendor',
    unread: 1,
    lastMessage: 'Final setup details confirmed',
    timestamp: '1 hour ago'
  },
  {
    id: 4,
    name: 'Catering',
    type: 'vendor',
    unread: 0,
    lastMessage: 'Menu finalized',
    timestamp: '2 days ago'
  }
];

const MOCK_MESSAGES = [
  { id: 1, sender: 'Mom', timestamp: '10:30 AM', message: 'How are the preparations going?', type: 'received' },
  { id: 2, sender: 'You', timestamp: '10:32 AM', message: 'Everything is on track! Just confirmed with the venue.', type: 'sent' },
  { id: 3, sender: 'Maid of Honor', timestamp: '10:45 AM', message: 'I&apos;ve sent reminders to all bridesmaids!', type: 'received' },
  { id: 4, sender: 'You', timestamp: '10:50 AM', message: 'Thanks so much! You&apos;re the best.', type: 'sent' },
  { id: 5, sender: 'Wedding Planning Team', timestamp: '11:00 AM', message: 'Vendor confirmations sent!', type: 'received' },
];

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState(MOCK_CONVERSATIONS[0].id);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        sender: 'You',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        message: messageInput,
        type: 'sent'
      }]);
      setMessageInput('');
    }
  };

  const currentConversation = MOCK_CONVERSATIONS.find(c => c.id === selectedConversation);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messaging</h1>
        <p className="text-muted-foreground mt-1">Chat with family, vendors, and your planning team</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Conversations</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {MOCK_CONVERSATIONS.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`w-full text-left px-4 py-3 border-b border-border hover:bg-muted transition-colors ${
                    selectedConversation === conversation.id ? 'bg-muted border-l-2 border-l-primary' : ''
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
                  <p className="text-xs text-muted-foreground mt-1">{conversation.timestamp}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-3">
          <CardHeader className="border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{currentConversation?.name}</CardTitle>
                <CardDescription>
                  {currentConversation?.type === 'group' && `${currentConversation.members?.length} members`}
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
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.type === 'sent'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {msg.type === 'received' && (
                      <p className="text-xs font-semibold mb-1">{msg.sender}</p>
                    )}
                    <p className="text-sm">{msg.message}</p>
                    <p className={`text-xs mt-1 ${msg.type === 'sent' ? 'opacity-75' : 'opacity-50'}`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-border p-4 flex gap-2">
              <Input
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
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
