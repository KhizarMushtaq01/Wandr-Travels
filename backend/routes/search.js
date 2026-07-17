const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Trip = require('../models/Trip');
const Booking = require('../models/Booking');
const { Journal } = require('../models/Extras');
const popularDestinations = require('../data/popularDestinations');

router.get('/', protect, async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) {
      return res.json({ success: true, trips: [], bookings: [], journal: [], destinations: [] });
    }
    const re = { $regex: q, $options: 'i' };
    const [trips, bookings, journal] = await Promise.all([
      Trip.find({ owner: req.user._id, name: re }).select('name').limit(5),
      Booking.find({ user: req.user._id, name: re }).select('name').limit(5),
      Journal.find({ user: req.user._id, title: re }).select('title').limit(5),
    ]);
    const qLower = q.toLowerCase();
    const destinations = popularDestinations
      .filter(d => d.name.toLowerCase().includes(qLower) || (d.country && d.country.toLowerCase().includes(qLower)))
      .slice(0, 5);
    res.json({ success: true, trips, bookings, journal, destinations });
  } catch (err) { next(err); }
});

module.exports = router;
