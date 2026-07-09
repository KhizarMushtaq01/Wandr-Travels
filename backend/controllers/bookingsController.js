const Booking = require('../models/Booking');
const emailService = require('../utils/emailService');

exports.createBooking = async (req, res, next) => {
  try {
    const booking = await Booking.create({ ...req.body, user: req.user._id });
    try { await emailService.sendBookingConfirmationEmail(req.user, booking); } catch (e) {}
    res.status(201).json({ success: true, booking });
  } catch (err) { next(err); }
};

exports.getBookings = async (req, res, next) => {
  try {
    const query = { user: req.user._id };
    if (req.query.trip) query.trip = req.query.trip;
    if (req.query.type) query.type = req.query.type;
    if (req.query.status) query.status = req.query.status;
    const bookings = await Booking.find(query).sort('-createdAt');
    res.json({ success: true, bookings });
  } catch (err) { next(err); }
};

exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, booking });
  } catch (err) { next(err); }
};

exports.updateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    if (req.body.status === 'confirmed') {
      try { await emailService.sendBookingConfirmationEmail(req.user, booking); } catch (e) {}
    } else if (req.body.status === 'cancelled') {
      try { await emailService.sendBookingCancelledEmail(req.user, booking); } catch (e) {}
    }
    res.json({ success: true, booking });
  } catch (err) { next(err); }
};

exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, message: 'Booking deleted' });
  } catch (err) { next(err); }
};

// Admin
exports.getAllBookings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const [bookings, total] = await Promise.all([
      Booking.find().populate('user', 'firstName lastName email').skip(skip).limit(limit).sort('-createdAt'),
      Booking.countDocuments()
    ]);
    res.json({ success: true, bookings, total });
  } catch (err) { next(err); }
};
