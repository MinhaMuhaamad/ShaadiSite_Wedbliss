const Chat = require('../models/Chat');

exports.getConversations = async (req, res) => {
  try {
    const chats = await Chat.find({ 'participants.userId': req.user.id }).sort({ updatedAt: -1 });
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

    res.status(201).json({ message: 'Message sent', chat });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createConversation = async (req, res) => {
  try {
    const { participantIds, name, type, weddingId } = req.body;
    const participants = [req.user.id, ...(participantIds || [])];
    const conversationId = `conv_${Date.now()}`;
    const chat = new Chat({
      conversationId,
      participants: participants.map((userId) => ({ userId })),
      weddingId,
      type: type || 'group',
      name,
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
