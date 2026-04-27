const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { setIo } = require('./socket');

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});
setIo(io);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB Connection
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error('MONGODB_URI environment variable is not set');
  process.exit(1);
}

mongoose.connect(mongoUri, {
  retryWrites: true,
  w: 'majority'
})
  .then(() => console.log('MongoDB Atlas connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// Health Check Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'WedBliss backend is running',
    docs: '/api/health'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'WedBliss API is running', timestamp: new Date() });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/weddings', require('./routes/weddings'));
app.use('/api/users', require('./routes/users'));
app.use('/api/collaborators', require('./routes/collaborators'));
app.use('/api/vendors', require('./routes/vendors'));
app.use('/api/budget', require('./routes/budget'));
app.use('/api/guests', require('./routes/guests'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/invitations', require('./routes/invitations'));
app.use('/api/timeline', require('./routes/timeline'));
app.use('/api/seating', require('./routes/seating'));
app.use('/api/media', require('./routes/media'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/admin', require('./routes/admin'));

// Socket.io for real-time chat
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join-chat', (roomId) => {
    socket.join(roomId);
  });

  socket.on('send-message', (roomId, message) => {
    io.to(roomId).emit('receive-message', message);
  });

  // Wedding-scoped realtime updates (budget, guests, timeline, etc.)
  socket.on('join-wedding', (weddingId) => {
    if (!weddingId) return;
    socket.join(`wedding:${weddingId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, io };
