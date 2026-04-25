const Wedding = require('../models/Wedding');
const User = require('../models/User');

// Add collaborator to wedding
exports.addCollaborator = async (req, res) => {
  try {
    const { weddingId, email, role } = req.body;

    // Find user by email
    const collaborator = await User.findOne({ email });
    if (!collaborator) {
      return res.status(404).json({ message: 'User not found' });
    }

    const wedding = await Wedding.findById(weddingId);
    if (!wedding) {
      return res.status(404).json({ message: 'Wedding not found' });
    }

    // Check if already a collaborator
    const isCollaborator = wedding.collaborators.some(c => c.userId.toString() === collaborator._id.toString());
    if (isCollaborator) {
      return res.status(400).json({ message: 'User is already a collaborator' });
    }

    // Add collaborator
    wedding.collaborators.push({
      userId: collaborator._id,
      role,
      permissions: ['view', 'edit']
    });

    await wedding.save();

    res.json({ message: 'Collaborator added', wedding });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get wedding collaborators
exports.getCollaborators = async (req, res) => {
  try {
    const wedding = await Wedding.findById(req.params.weddingId)
      .populate('collaborators.userId', 'name email');

    if (!wedding) {
      return res.status(404).json({ message: 'Wedding not found' });
    }

    res.json(wedding.collaborators);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update collaborator role
exports.updateCollaborator = async (req, res) => {
  try {
    const { weddingId, collaboratorId } = req.params;
    const { role, permissions } = req.body;

    const wedding = await Wedding.findById(weddingId);
    if (!wedding) {
      return res.status(404).json({ message: 'Wedding not found' });
    }

    const collaborator = wedding.collaborators.find(c => c._id.toString() === collaboratorId);
    if (!collaborator) {
      return res.status(404).json({ message: 'Collaborator not found' });
    }

    collaborator.role = role;
    collaborator.permissions = permissions;

    await wedding.save();

    res.json({ message: 'Collaborator updated', wedding });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove collaborator
exports.removeCollaborator = async (req, res) => {
  try {
    const { weddingId, collaboratorId } = req.params;

    const wedding = await Wedding.findByIdAndUpdate(
      weddingId,
      { $pull: { collaborators: { _id: collaboratorId } } },
      { new: true }
    );

    if (!wedding) {
      return res.status(404).json({ message: 'Wedding not found' });
    }

    res.json({ message: 'Collaborator removed', wedding });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's shared weddings
exports.getUserSharedWeddings = async (req, res) => {
  try {
    const weddings = await Wedding.find({
      'collaborators.userId': req.user.id
    })
      .populate('brideId', 'name email')
      .populate('budget');

    res.json(weddings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
