import { io, type Socket } from 'socket.io-client';
import { API_BASE_URL } from '@/lib/dashboard-api';

let socket: Socket | null = null;
let joinedWeddingId: string | null = null;

export function getSocket(): Socket {
  if (socket) return socket;
  socket = io(API_BASE_URL, {
    transports: ['websocket'],
    reconnection: true
  });
  return socket;
}

export function joinWeddingRoom(weddingId: string | null | undefined) {
  if (!weddingId) return;
  const s = getSocket();
  if (joinedWeddingId === weddingId) return;
  joinedWeddingId = weddingId;
  s.emit('join-wedding', weddingId);
}

