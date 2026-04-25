const Timeline = require('../models/Timeline');

exports.getTimeline = async (req, res) => {
  try {
    const weddingId = req.query.weddingId || req.params.weddingId;
    if (!weddingId) {
      return res.status(400).json({ message: 'weddingId is required' });
    }
    const events = await Timeline.find({ weddingId }).sort({ startTime: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTimelineEvent = async (req, res) => {
  try {
    const event = new Timeline(req.body);
    await event.save();
    res.status(201).json({ message: 'Timeline event created', event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTimelineEvent = async (req, res) => {
  try {
    const event = await Timeline.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!event) {
      return res.status(404).json({ message: 'Timeline event not found' });
    }
    res.json({ message: 'Timeline event updated', event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTimelineEvent = async (req, res) => {
  try {
    const event = await Timeline.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Timeline event not found' });
    }
    res.json({ message: 'Timeline event deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
