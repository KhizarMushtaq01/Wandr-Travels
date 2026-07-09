const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middleware/auth');
const { Journal } = require('../models/Extras');

router.get('/', protect, async (req, res, next) => {
  try {
    const query = { user: req.user._id };
    if (req.query.trip) query.trip = req.query.trip;
    const entries = await Journal.find(query).sort('-date');
    res.json({ success: true, entries });
  } catch (err) { next(err); }
});

router.get('/public', optionalAuth, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const entries = await Journal.find({ isPublic: true })
      .populate('user', 'firstName lastName avatar')
      .sort('-date')
      .skip((page - 1) * limit)
      .limit(limit);
    res.json({ success: true, entries });
  } catch (err) { next(err); }
});

router.post('/', protect, async (req, res, next) => {
  try {
    const entry = await Journal.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, entry });
  } catch (err) { next(err); }
});

router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const entry = await Journal.findById(req.params.id)
      .populate('user', 'firstName lastName avatar')
      .populate('comments.user', 'firstName lastName avatar');
    if (!entry) return res.status(404).json({ success: false, message: 'Entry not found' });
    if (!entry.isPublic && entry.user._id.toString() !== req.user?._id?.toString()) {
      return res.status(403).json({ success: false, message: 'Private entry' });
    }
    res.json({ success: true, entry });
  } catch (err) { next(err); }
});

router.put('/:id', protect, async (req, res, next) => {
  try {
    const entry = await Journal.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
    if (!entry) return res.status(404).json({ success: false, message: 'Entry not found' });
    res.json({ success: true, entry });
  } catch (err) { next(err); }
});

router.delete('/:id', protect, async (req, res, next) => {
  try {
    await Journal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ success: true, message: 'Entry deleted' });
  } catch (err) { next(err); }
});

router.post('/:id/like', protect, async (req, res, next) => {
  try {
    const entry = await Journal.findById(req.params.id);
    if (!entry) return res.status(404).json({ success: false, message: 'Not found' });
    const liked = entry.likes.includes(req.user._id);
    liked ? entry.likes.pull(req.user._id) : entry.likes.push(req.user._id);
    await entry.save();
    res.json({ success: true, liked: !liked, likesCount: entry.likes.length });
  } catch (err) { next(err); }
});

router.post('/:id/comments', protect, async (req, res, next) => {
  try {
    const entry = await Journal.findById(req.params.id);
    if (!entry) return res.status(404).json({ success: false, message: 'Not found' });
    entry.comments.push({ user: req.user._id, text: req.body.text });
    await entry.save();
    res.json({ success: true, entry });
  } catch (err) { next(err); }
});

module.exports = router;
