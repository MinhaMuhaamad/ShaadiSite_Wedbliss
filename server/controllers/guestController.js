const Guest = require('../models/Guest');
const Wedding = require('../models/Wedding');
const { getIo } = require('../socket');

// Add guest
exports.addGuest = async (req, res) => {
  try {
    const { weddingId, firstName, lastName, email, phone, relationship, side, numberOfGuests } = req.body;

    const guest = new Guest({
      weddingId,
      firstName,
      lastName,
      email,
      phone,
      relationship,
      side,
      numberOfGuests
    });

    await guest.save();

    // Update wedding guest count
    await Wedding.findByIdAndUpdate(
      weddingId,
      { $push: { guests: guest._id } }
    );

    res.status(201).json({ message: 'Guest added', guest });
    const io = getIo();
    if (io && guest?.weddingId) {
      io.to(`wedding:${String(guest.weddingId)}`).emit('guests:updated', {
        weddingId: String(guest.weddingId),
        guestId: String(guest._id),
        action: 'add'
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get wedding guests
exports.getWeddingGuests = async (req, res) => {
  try {
    const guests = await Guest.find({ weddingId: req.params.weddingId });
    res.json(guests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update guest
exports.updateGuest = async (req, res) => {
  try {
    const guest = await Guest.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    res.json({ message: 'Guest updated', guest });
    const io = getIo();
    if (io && guest?.weddingId) {
      io.to(`wedding:${String(guest.weddingId)}`).emit('guests:updated', {
        weddingId: String(guest.weddingId),
        guestId: String(guest._id),
        action: 'update'
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update RSVP status
exports.updateRSVP = async (req, res) => {
  try {
    const { rsvpStatus, numberOfGuests, mealChoice, dietaryRestrictions } = req.body;

    const guest = await Guest.findByIdAndUpdate(
      req.params.id,
      {
        rsvpStatus,
        numberOfGuests,
        mealChoice,
        dietaryRestrictions,
        rsvpDate: new Date(),
        updatedAt: Date.now()
      },
      { new: true }
    );

    res.json({ message: 'RSVP updated', guest });
    const io = getIo();
    if (io && guest?.weddingId) {
      io.to(`wedding:${String(guest.weddingId)}`).emit('guests:updated', {
        weddingId: String(guest.weddingId),
        guestId: String(guest._id),
        action: 'rsvp'
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete guest
exports.deleteGuest = async (req, res) => {
  try {
    const guest = await Guest.findByIdAndDelete(req.params.id);

    // Remove from wedding guests array
    await Wedding.findByIdAndUpdate(
      guest.weddingId,
      { $pull: { guests: guest._id } }
    );

    res.json({ message: 'Guest deleted' });
    const io = getIo();
    if (io && guest?.weddingId) {
      io.to(`wedding:${String(guest.weddingId)}`).emit('guests:updated', {
        weddingId: String(guest.weddingId),
        guestId: String(guest._id),
        action: 'delete'
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get guest statistics
exports.getGuestStatistics = async (req, res) => {
  try {
    const weddingId = req.params.weddingId;
    const guests = await Guest.find({ weddingId });

    const stats = {
      totalInvited: guests.length,
      accepted: guests.filter(g => g.rsvpStatus === 'accepted').length,
      declined: guests.filter(g => g.rsvpStatus === 'declined').length,
      pending: guests.filter(g => g.rsvpStatus === 'pending').length,
      totalConfirmedGuests: guests.reduce((sum, g) => {
        return g.rsvpStatus === 'accepted' ? sum + g.numberOfGuests : sum;
      }, 0)
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
