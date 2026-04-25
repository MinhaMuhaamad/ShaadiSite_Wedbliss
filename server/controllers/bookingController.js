const Booking = require('../models/Booking');

exports.getWeddingBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ weddingId: req.params.weddingId })
      .populate('vendorId', 'businessName category location averageRating pricing contact')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    const saved = await Booking.findById(booking._id).populate(
      'vendorId',
      'businessName category location averageRating pricing contact'
    );
    res.status(201).json({ message: 'Booking created', booking: saved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('vendorId', 'businessName category location averageRating pricing contact');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking updated', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBookingDetails = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      'vendorId',
      'businessName category location averageRating pricing contact services'
    );
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
