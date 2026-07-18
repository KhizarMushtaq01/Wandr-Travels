const User = require('../models/User');
const Trip = require('../models/Trip');
const Booking = require('../models/Booking');
const { Expense, Journal, Notification } = require('../models/Extras');
const { AdminAuditLog, logAdminAction } = require('../models/AdminAuditLog');
const ContactMessage = require('../models/ContactMessage');
const Review = require('../models/Review');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers, activeUsers, newUsersToday, newUsersThisMonth,
      totalTrips, activeTrips, publicTrips,
      totalBookings, confirmedBookings, pendingBookings,
      totalRevenue
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ createdAt: { $gte: new Date(new Date().setHours(0,0,0,0)) } }),
      User.countDocuments({ createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } }),
      Trip.countDocuments(),
      Trip.countDocuments({ status: 'active' }),
      Trip.countDocuments({ isPublic: true }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.countDocuments({ status: 'pending' }),
      Booking.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }])
    ]);

    // Monthly signups (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlySignups = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Monthly revenue (last 6 months)
    const monthlyRevenue = await Booking.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, status: 'confirmed' } },
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, total: { $sum: '$totalAmount' } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Recent activity
    const recentUsers = await User.find().sort('-createdAt').limit(5).select('firstName lastName email avatar createdAt role');
    const recentTrips = await Trip.find().sort('-createdAt').limit(5).populate('owner', 'firstName lastName');
    const recentBookings = await Booking.find().sort('-createdAt').limit(5).populate('user', 'firstName lastName email');

    // User roles distribution
    const roleStats = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    // Booking types distribution
    const bookingTypeStats = await Booking.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      stats: {
        users: { total: totalUsers, active: activeUsers, newToday: newUsersToday, newThisMonth: newUsersThisMonth },
        trips: { total: totalTrips, active: activeTrips, public: publicTrips },
        bookings: { total: totalBookings, confirmed: confirmedBookings, pending: pendingBookings },
        revenue: { total: totalRevenue[0]?.total || 0 },
        monthlySignups,
        monthlyRevenue,
        roleStats,
        bookingTypeStats
      },
      recentUsers,
      recentTrips,
      recentBookings
    });
  } catch (err) { next(err); }
};

exports.getActivityLog = async (req, res, next) => {
  try {
    // Aggregate recent user logins
    const recentLogins = await User.find({ lastLogin: { $exists: true } })
      .select('firstName lastName email lastLogin loginHistory')
      .sort('-lastLogin')
      .limit(50);
    res.json({ success: true, activity: recentLogins });
  } catch (err) { next(err); }
};

exports.sendBroadcastEmail = async (req, res, next) => {
  try {
    const { subject, message, userRole } = req.body;
    const query = userRole ? { role: userRole, isActive: true } : { isActive: true };
    const users = await User.find(query).select('email firstName');

    const emailService = require('../utils/emailService');
    let sent = 0;
    for (const user of users) {
      try {
        await emailService.sendEmail({ to: user.email, subject, html: message });
        sent++;
      } catch (e) {}
    }
    logAdminAction(req.user._id, 'send_broadcast', 'Broadcast', null, `"${subject}" to ${sent} users (${userRole || 'all'})`);
    res.json({ success: true, message: `Broadcast sent to ${sent} users` });
  } catch (err) { next(err); }
};

exports.getSystemHealth = async (req, res, next) => {
  try {
    const mongoose = require('mongoose');
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({
      success: true,
      health: {
        server: 'running',
        database: dbStatus,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: new Date()
      }
    });
  } catch (err) { next(err); }
};

// @desc Get admin action audit log (admin)
exports.getAuditLog = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      AdminAuditLog.find().populate('admin', 'firstName lastName email').sort('-createdAt').skip(skip).limit(limit),
      AdminAuditLog.countDocuments()
    ]);
    res.json({ success: true, logs, total, page, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

// @desc Get all public journal entries for moderation (admin)
exports.getAllJournalAdmin = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const query = { isPublic: true };

    const [entries, total] = await Promise.all([
      Journal.find(query).populate('user', 'firstName lastName email').sort('-date').skip(skip).limit(limit),
      Journal.countDocuments(query)
    ]);
    res.json({ success: true, entries, total, page, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

// @desc Delete any journal entry, no owner check (admin)
exports.adminDeleteJournal = async (req, res, next) => {
  try {
    const entry = await Journal.findById(req.params.id);
    if (!entry) return res.status(404).json({ success: false, message: 'Journal entry not found' });
    await entry.deleteOne();
    logAdminAction(req.user._id, 'delete_journal', 'Journal', req.params.id, entry.title);
    res.json({ success: true, message: 'Journal entry removed' });
  } catch (err) { next(err); }
};

// @desc List contact form submissions (admin)
exports.getAllContactMessages = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const query = {};
    if (req.query.status) query.status = req.query.status;

    const [messages, total] = await Promise.all([
      ContactMessage.find(query).sort('-createdAt').skip(skip).limit(limit),
      ContactMessage.countDocuments(query)
    ]);
    res.json({ success: true, messages, total, page, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

// @desc Update a contact message's status (admin)
exports.updateContactMessageStatus = async (req, res, next) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    res.json({ success: true, message });
  } catch (err) { next(err); }
};

// @desc Delete a contact message (admin)
exports.deleteContactMessage = async (req, res, next) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    res.json({ success: true, message: 'Message deleted' });
  } catch (err) { next(err); }
};

// @desc List reviews for moderation (admin)
exports.getAllReviews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const query = {};
    if (req.query.status) query.status = req.query.status;

    const [reviews, total] = await Promise.all([
      Review.find(query).sort('-createdAt').skip(skip).limit(limit),
      Review.countDocuments(query)
    ]);
    res.json({ success: true, reviews, total, page, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

// @desc Approve or reject a review (admin)
exports.updateReviewStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be approved or rejected' });
    }
    const review = await Review.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    logAdminAction(req.user._id, status === 'approved' ? 'approve_review' : 'reject_review', 'Review', review._id, review.fullName);
    res.json({ success: true, review });
  } catch (err) { next(err); }
};

// @desc Delete a review (admin)
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    logAdminAction(req.user._id, 'delete_review', 'Review', req.params.id, review.fullName);
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) { next(err); }
};
