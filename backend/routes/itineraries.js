// itineraries.js - manages day-by-day itinerary within a trip
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Trip = require('../models/Trip');

// Get itinerary for a trip
router.get('/:tripId', protect, async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    const isAuthorized = trip.owner.toString() === req.user._id.toString() ||
      trip.collaborators.some(c => c.user.toString() === req.user._id.toString());
    if (!isAuthorized) return res.status(403).json({ success: false, message: 'Access denied' });
    res.json({ success: true, destinations: trip.destinations });
  } catch (err) { next(err); }
});

// Add activity to a destination day
router.post('/:tripId/destinations/:destId/activities', protect, async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    if (trip.owner.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Not authorized' });
    const dest = trip.destinations.id(req.params.destId);
    if (!dest) return res.status(404).json({ success: false, message: 'Destination not found' });
    dest.activities.push(req.body);
    await trip.save();
    res.status(201).json({ success: true, trip });
  } catch (err) { next(err); }
});

// Update activity
router.put('/:tripId/destinations/:destId/activities/:actId', protect, async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip || trip.owner.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Not authorized' });
    const dest = trip.destinations.id(req.params.destId);
    const activity = dest?.activities.id(req.params.actId);
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });
    Object.assign(activity, req.body);
    await trip.save();
    res.json({ success: true, trip });
  } catch (err) { next(err); }
});

// Delete activity
router.delete('/:tripId/destinations/:destId/activities/:actId', protect, async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip || trip.owner.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Not authorized' });
    const dest = trip.destinations.id(req.params.destId);
    dest?.activities.pull({ _id: req.params.actId });
    await trip.save();
    res.json({ success: true, message: 'Activity removed' });
  } catch (err) { next(err); }
});

module.exports = router;
