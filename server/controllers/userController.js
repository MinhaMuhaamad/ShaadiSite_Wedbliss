const User = require('../models/User');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, bio, wedding_date, venue, guest_count } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        'profile.phone': phone,
        'profile.bio': bio,
        'profile.wedding_date': wedding_date,
        'profile.venue': venue,
        'profile.guest_count': guest_count,
        updatedAt: Date.now()
      },
      { new: true }
    ).select('-password');

    res.json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update avatar
exports.updateAvatar = async (req, res) => {
  try {
    const { avatarUrl } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 'profile.avatar': avatarUrl },
      { new: true }
    ).select('-password');

    res.json({ message: 'Avatar updated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update notification preferences
exports.updateNotifications = async (req, res) => {
  try {
    const { email_notifications, sms_notifications } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        'notifications.email_notifications': email_notifications,
        'notifications.sms_notifications': sms_notifications
      },
      { new: true }
    ).select('-password');

    res.json({ message: 'Notifications updated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    // Verify old password
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID (public)
exports.getUserPublic = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -notifications');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Deactivate account
exports.deactivateAccount = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user.id,
      { isActive: false },
      { new: true }
    );

    res.json({ message: 'Account deactivated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
