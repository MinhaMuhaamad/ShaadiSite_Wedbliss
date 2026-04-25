const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const crypto = require('crypto');

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'your_jwt_secret_key',
    { expiresIn: '7d' }
  );
};

// Register User
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
      role: role || 'bride',
      verificationToken: crypto.randomBytes(24).toString('hex')
    });

    await user.save();

    const token = generateToken(user);
    res.status(201).json({
      message: 'User registered successfully. Verify your email to activate the account.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      },
      verificationToken: user.verificationToken
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: 'Please verify your email before logging in.',
        code: 'EMAIL_NOT_VERIFIED',
        email: user.email
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Current User
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout (client-side token deletion)
exports.logout = (req, res) => {
  res.json({ message: 'Logout successful' });
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification link.' });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    return res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    user.verificationToken = crypto.randomBytes(24).toString('hex');
    await user.save();

    return res.json({
      message: 'Verification email resent successfully.',
      verificationToken: user.verificationToken
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email.' });
    }

    const token = crypto.randomBytes(24).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 30);
    await user.save();

    return res.json({
      message: 'Password reset link generated.',
      resetToken: token
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Reset link is invalid or expired.' });
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
