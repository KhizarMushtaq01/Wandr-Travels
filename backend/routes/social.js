// social.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Trip = require('../models/Trip');

// Get feed (trips from people I follow)
router.get('/feed', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const trips = await Trip.find({
      $or: [
        { owner: { $in: user.following }, isPublic: true },
        { owner: req.user._id }
      ]
    }).populate('owner', 'firstName lastName avatar').sort('-updatedAt').limit(20);
    res.json({ success: true, trips });
  } catch (err) { next(err); }
});

// Get suggested users to follow
router.get('/suggestions', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const excludeIds = [...user.following, user._id];
    const suggestions = await User.find({ _id: { $nin: excludeIds }, isActive: true })
      .select('firstName lastName avatar bio location travelStyle')
      .limit(10);
    res.json({ success: true, suggestions });
  } catch (err) { next(err); }
});

module.exports = router;
