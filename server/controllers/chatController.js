const Chat = require('../models/Chat');
const { getIo } = require('../socket');

exports.getConversations = async (req, res) => {
  try {
    const chats = await Chat.find({
      'participants.userId': req.user.id,
      blockedBy: { $ne: req.user.id }
    }).sort({ updatedAt: -1 });
    const conversations = chats.map((chat) => ({
      _id: chat._id,
      conversationId: chat.conversationId,
      name: chat.name || 'Conversation',
      type: chat.type,
      lastMessage: chat.lastMessage?.text || '',
      updatedAt: chat.updatedAt,
      unread: chat.messages.filter((message) => !message.isRead && String(message.senderId) !== String(req.user.id)).length
    }));
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getConversationMessages = async (req, res) => {
  try {
    const chat = await Chat.findOne({ conversationId: req.params.conversationId });
    if (!chat) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    if (Array.isArray(chat.blockedBy) && chat.blockedBy.some((id) => String(id) === String(req.user.id))) {
      return res.status(403).json({ message: 'Conversation is blocked' });
    }

    // Mark unread messages as read for this user
    let changed = false;
    chat.messages.forEach((message) => {
      if (!message.isRead && String(message.senderId) !== String(req.user.id)) {
        message.isRead = true;
        message.readBy = message.readBy || [];
        const exists = message.readBy.some((r) => String(r.userId) === String(req.user.id));
        if (!exists) {
          message.readBy.push({ userId: req.user.id, readAt: new Date() });
        }
        changed = true;
      }
    });
    if (changed) {
      await chat.save();
    }
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, text, mediaUrl } = req.body;
    const chat = await Chat.findOne({ conversationId });
    if (!chat) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    if (Array.isArray(chat.blockedBy) && chat.blockedBy.length) {
      return res.status(403).json({ message: 'Conversation is blocked' });
    }

    const message = {
      senderId: req.user.id,
      text,
      mediaUrl,
      timestamp: new Date(),
      isRead: false
    };

    chat.messages.push(message);
    chat.lastMessage = {
      text: text || 'Media',
      timestamp: new Date(),
      senderId: req.user.id
    };
    chat.updatedAt = new Date();
    await chat.save();

    const io = getIo();
    if (io) {
      io.to(chat.conversationId).emit('receive-message', {
        conversationId: chat.conversationId,
        message: {
          senderId: String(req.user.id),
          text: text || undefined,
          mediaUrl: mediaUrl || undefined,
          timestamp: new Date(message.timestamp).toISOString(),
          isRead: false
        }
      });
    }

    res.status(201).json({ message: 'Message sent', chat });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createConversation = async (req, res) => {
  try {
    const { participantIds, name, type, weddingId, vendorId } = req.body;
    const participants = [req.user.id, ...(participantIds || [])];
    const conversationId = `conv_${Date.now()}`;
    const chat = new Chat({
      conversationId,
      participants: participants.map((userId) => ({ userId })),
      weddingId,
      type: type || 'group',
      name,
      vendorId: vendorId || undefined,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await chat.save();
    res.status(201).json({ message: 'Conversation created', chat });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createQuote = async (req, res) => {
  try {
    const { conversationId, title, items, amount, currency, notes } = req.body;
    const chat = await Chat.findOne({ conversationId });
    if (!chat) return res.status(404).json({ message: 'Conversation not found' });
    if (Array.isArray(chat.blockedBy) && chat.blockedBy.length) {
      return res.status(403).json({ message: 'Conversation is blocked' });
    }
    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ message: 'At least one item is required' });
    }
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: 'Valid amount is required' });
    }

    chat.quotes = chat.quotes || [];
    const quote = {
      title: title || 'Quote Request',
      status: 'pending',
      createdBy: req.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      items: items.map((it) => ({
        name: String(it?.name || '').trim(),
        qty: Number(it?.qty || 1) || 1,
        notes: it?.notes ? String(it.notes) : undefined
      })),
      offers: [
        {
          offeredBy: req.user.id,
          amount: numericAmount,
          currency: currency || 'USD',
          notes: notes || undefined,
          createdAt: new Date()
        }
      ]
    };
    chat.quotes.push(quote);
    chat.lastMessage = {
      text: `Quote requested: ${quote.title}`,
      timestamp: new Date(),
      senderId: req.user.id
    };
    chat.updatedAt = new Date();
    await chat.save();

    const io = getIo();
    if (io) {
      io.to(chat.conversationId).emit('quote:updated', { conversationId: chat.conversationId });
      io.to(chat.conversationId).emit('receive-message', {
        conversationId: chat.conversationId,
        message: {
          senderId: String(req.user.id),
          text: `Quote requested: ${quote.title}`,
          timestamp: new Date().toISOString(),
          isRead: false
        }
      });
    }

    res.status(201).json({ message: 'Quote created', chat });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.quoteAction = async (req, res) => {
  try {
    const { conversationId, quoteId, action, amount, currency, notes, decisionNotes } = req.body;
    const chat = await Chat.findOne({ conversationId });
    if (!chat) return res.status(404).json({ message: 'Conversation not found' });
    if (Array.isArray(chat.blockedBy) && chat.blockedBy.length) {
      return res.status(403).json({ message: 'Conversation is blocked' });
    }
    const quote = (chat.quotes || []).id(quoteId);
    if (!quote) return res.status(404).json({ message: 'Quote not found' });
    if (quote.status !== 'pending') return res.status(400).json({ message: 'Quote already finalized' });

    if (action === 'counter') {
      const numericAmount = Number(amount);
      if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        return res.status(400).json({ message: 'Valid counter amount is required' });
      }
      quote.offers.push({
        offeredBy: req.user.id,
        amount: numericAmount,
        currency: currency || quote.offers?.[0]?.currency || 'USD',
        notes: notes || undefined,
        createdAt: new Date()
      });
      quote.updatedAt = new Date();
      chat.lastMessage = {
        text: `Counter-offer: ${quote.title}`,
        timestamp: new Date(),
        senderId: req.user.id
      };
    } else if (action === 'accept' || action === 'decline') {
      quote.status = action === 'accept' ? 'accepted' : 'declined';
      quote.decision = {
        decidedBy: req.user.id,
        decidedAt: new Date(),
        decisionNotes: decisionNotes || undefined
      };
      quote.updatedAt = new Date();
      chat.lastMessage = {
        text: `${action === 'accept' ? 'Accepted' : 'Declined'} quote: ${quote.title}`,
        timestamp: new Date(),
        senderId: req.user.id
      };
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    chat.updatedAt = new Date();
    await chat.save();

    const io = getIo();
    if (io) {
      io.to(chat.conversationId).emit('quote:updated', { conversationId: chat.conversationId, quoteId: String(quote._id), action });
      io.to(chat.conversationId).emit('receive-message', {
        conversationId: chat.conversationId,
        message: {
          senderId: String(req.user.id),
          text: chat.lastMessage.text,
          timestamp: new Date().toISOString(),
          isRead: false
        }
      });
    }

    res.json({ message: 'Quote updated', chat });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.blockConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const chat = await Chat.findOne({ conversationId });
    if (!chat) return res.status(404).json({ message: 'Conversation not found' });
    chat.blockedBy = chat.blockedBy || [];
    const already = chat.blockedBy.some((id) => String(id) === String(req.user.id));
    if (!already) chat.blockedBy.push(req.user.id);
    chat.updatedAt = new Date();
    await chat.save();

    const io = getIo();
    if (io) {
      io.to(chat.conversationId).emit('conversation:blocked', { conversationId: chat.conversationId });
    }
    res.json({ message: 'Conversation blocked' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.reportConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { reason, details } = req.body;
    const chat = await Chat.findOne({ conversationId });
    if (!chat) return res.status(404).json({ message: 'Conversation not found' });
    chat.reports = chat.reports || [];
    chat.reports.push({
      reportedBy: req.user.id,
      reason: reason || 'other',
      details: details || '',
      createdAt: new Date()
    });
    chat.updatedAt = new Date();
    await chat.save();
    res.json({ message: 'Report submitted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
