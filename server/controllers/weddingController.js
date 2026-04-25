const Wedding = require('../models/Wedding');
const Budget = require('../models/Budget');
const Guest = require('../models/Guest');

// Create a new wedding
exports.createWedding = async (req, res) => {
  try {
    const { brideName, groomName, weddingDate, venue, theme, colors, numberOfGuests } = req.body;

    const wedding = new Wedding({
      brideId: req.user.id,
      brideName,
      groomName,
      weddingDate,
      venue,
      theme,
      colors,
      numberOfGuests
    });

    // Create associated budget
    const budget = new Budget({
      weddingId: wedding._id,
      totalBudget: req.body.totalBudget || 0,
      categories: []
    });

    await wedding.save();
    await budget.save();

    wedding.budget = budget._id;
    await wedding.save();

    res.status(201).json({
      message: 'Wedding created successfully',
      wedding
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's weddings
exports.getUserWeddings = async (req, res) => {
  try {
    const weddings = await Wedding.find({ brideId: req.user.id })
      .populate('budget')
      .populate('guests');
    res.json(weddings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get wedding details
exports.getWedding = async (req, res) => {
  try {
    const wedding = await Wedding.findById(req.params.id)
      .populate('budget')
      .populate('guests')
      .populate('timeline')
      .populate('seatingArrangements');
    
    if (!wedding) {
      return res.status(404).json({ message: 'Wedding not found' });
    }

    res.json(wedding);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update wedding
exports.updateWedding = async (req, res) => {
  try {
    const wedding = await Wedding.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    res.json({ message: 'Wedding updated', wedding });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add collaborator
exports.addCollaborator = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const wedding = await Wedding.findByIdAndUpdate(
      req.params.id,
      { $push: { collaborators: { userId, role } } },
      { new: true }
    );

    res.json({ message: 'Collaborator added', wedding });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get wedding stats
exports.getWeddingStats = async (req, res) => {
  try {
    const wedding = await Wedding.findById(req.params.id);
    if (!wedding) {
      return res.status(404).json({ message: 'Wedding not found' });
    }

    const guests = await Guest.find({ weddingId: req.params.id });
    const budget = await Budget.findOne({ weddingId: req.params.id });

    const acceptedGuests = guests.filter(g => g.rsvpStatus === 'accepted').length;
    const totalConfirmed = guests.reduce((sum, g) => {
      return g.rsvpStatus === 'accepted' ? sum + g.numberOfGuests : sum;
    }, 0);

    const stats = {
      weddingId: wedding._id,
      brideName: wedding.brideName,
      groomName: wedding.groomName,
      weddingDate: wedding.weddingDate,
      venue: wedding.venue,
      status: wedding.status,
      totalInvited: guests.length,
      acceptedRsvp: acceptedGuests,
      totalConfirmedGuests: totalConfirmed,
      totalBudget: budget?.totalBudget || 0,
      totalSpent: budget?.totalSpent || 0,
      remainingBudget: budget?.remainingBudget || 0,
      completionPercentage: calculateCompletion(wedding)
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete wedding
exports.deleteWedding = async (req, res) => {
  try {
    const wedding = await Wedding.findByIdAndDelete(req.params.id);
    if (!wedding) {
      return res.status(404).json({ message: 'Wedding not found' });
    }

    // Delete associated data
    await Budget.deleteOne({ weddingId: wedding._id });
    await Guest.deleteMany({ weddingId: wedding._id });

    res.json({ message: 'Wedding deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

function calculateCompletion(wedding) {
  let completed = 0;
  const total = 6;

  if (wedding.brideName && wedding.groomName) completed++;
  if (wedding.weddingDate) completed++;
  if (wedding.venue?.name) completed++;
  if (wedding.theme) completed++;
  if (wedding.colors?.primary) completed++;
  if (wedding.numberOfGuests) completed++;

  return Math.round((completed / total) * 100);
}
