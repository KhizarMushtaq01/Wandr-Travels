// discover.js
const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/auth');
const Trip = require('../models/Trip');
const User = require('../models/User');

router.get('/featured', optionalAuth, async (req, res, next) => {
  try {
    const trips = await Trip.find({ isPublic: true, isFeatured: true })
      .populate('owner', 'firstName lastName avatar').limit(6).sort('-likes');
    res.json({ success: true, trips });
  } catch (err) { next(err); }
});

router.get('/trending', optionalAuth, async (req, res, next) => {
  try {
    const trips = await Trip.find({ isPublic: true })
      .populate('owner', 'firstName lastName avatar')
      .sort({ likes: -1, views: -1 }).limit(12);
    res.json({ success: true, trips });
  } catch (err) { next(err); }
});

router.get('/search', optionalAuth, async (req, res, next) => {
  try {
    const { q, tags, tripType } = req.query;
    const query = { isPublic: true };
    if (q) query.$or = [{ name: { $regex: q, $options: 'i' } }, { description: { $regex: q, $options: 'i' } }, { tags: { $regex: q, $options: 'i' } }];
    if (tags) query.tags = { $in: tags.split(',') };
    if (tripType) query.tripType = tripType;
    const trips = await Trip.find(query).populate('owner', 'firstName lastName avatar').sort('-createdAt').limit(20);
    res.json({ success: true, trips });
  } catch (err) { next(err); }
});

router.get('/destinations', optionalAuth, async (req, res, next) => {
  try {
    // Aggregate popular destinations from trips
    const destinations = await Trip.aggregate([
      { $match: { isPublic: true } },
      { $unwind: '$destinations' },
      { $group: { _id: '$destinations.name', country: { $first: '$destinations.country' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);
    res.json({ success: true, destinations });
  } catch (err) { next(err); }
});

module.exports = router;
