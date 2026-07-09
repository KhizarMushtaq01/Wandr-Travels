const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const emailService = require('../utils/emailService');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);
  res.status(statusCode).json({ success: true, token, user: user.toPublicJSON() });
};

// @desc Register
exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ firstName, lastName, email, password });

    // Send welcome email
    try { await emailService.sendWelcomeEmail(user); } catch (e) { console.error('Welcome email failed:', e.message); }

    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// @desc Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Your account has been deactivated' });
    }

    // Update last login & history
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const device = req.headers['user-agent'] || 'Unknown Device';
    user.lastLogin = new Date();
    user.loginHistory.unshift({ ip, device, timestamp: new Date() });
    if (user.loginHistory.length > 10) user.loginHistory = user.loginHistory.slice(0, 10);
    await user.save();

    // Send sign-in notification email
    if (user.notifications?.email) {
      try {
        await emailService.sendSignInEmail(user, {
          ip,
          device: device.substring(0, 100),
          time: new Date().toLocaleString()
        });
      } catch (e) { console.error('Sign-in email failed:', e.message); }
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc Get current user
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user.toPublicJSON() });
};

// @desc Forgot password
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account with that email' });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    try {
      await emailService.sendPasswordResetEmail(user, resetToken);
      res.json({ success: true, message: 'Password reset email sent' });
    } catch (e) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ success: false, message: 'Email could not be sent' });
    }
  } catch (err) {
    next(err);
  }
};

// @desc Reset password
exports.resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    try { await emailService.sendPasswordChangedEmail(user); } catch (e) {}

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc Update password
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }
    user.password = req.body.newPassword;
    await user.save();

    try { await emailService.sendPasswordChangedEmail(user); } catch (e) {}

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc Logout (client-side, but we track it)
exports.logout = async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};
