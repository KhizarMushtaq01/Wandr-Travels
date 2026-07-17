const User = require('../models/User');
const Trip = require('../models/Trip');
const Booking = require('../models/Booking');
const { Expense, Journal, Notification } = require('../models/Extras');
const { AdminAuditLog, logAdminAction } = require('../models/AdminAuditLog');

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
        await emailService.sendEmail?.({ to: user.email, subject, html: message }) ||
          console.log(`Would send to ${user.email}`);
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
