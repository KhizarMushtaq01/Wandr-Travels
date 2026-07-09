const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { PackingList } = require('../models/Extras');

router.get('/', protect, async (req, res, next) => {
  try {
    const query = { user: req.user._id };
    if (req.query.trip) query.trip = req.query.trip;
    const lists = await PackingList.find(query);
    res.json({ success: true, lists });
  } catch (err) { next(err); }
});

router.post('/', protect, async (req, res, next) => {
  try {
    const list = await PackingList.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, list });
  } catch (err) { next(err); }
});

router.get('/:id', protect, async (req, res, next) => {
  try {
    const list = await PackingList.findOne({ _id: req.params.id, user: req.user._id });
    if (!list) return res.status(404).json({ success: false, message: 'List not found' });
    res.json({ success: true, list });
  } catch (err) { next(err); }
});

router.put('/:id', protect, async (req, res, next) => {
  try {
    const list = await PackingList.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
    if (!list) return res.status(404).json({ success: false, message: 'List not found' });
    res.json({ success: true, list });
  } catch (err) { next(err); }
});

router.delete('/:id', protect, async (req, res, next) => {
  try {
    await PackingList.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ success: true, message: 'Packing list deleted' });
  } catch (err) { next(err); }
});

// Toggle item packed status
router.patch('/:id/items/:itemId/toggle', protect, async (req, res, next) => {
  try {
    const list = await PackingList.findOne({ _id: req.params.id, user: req.user._id });
    if (!list) return res.status(404).json({ success: false, message: 'List not found' });
    const item = list.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    item.isPacked = !item.isPacked;
    await list.save();
    res.json({ success: true, list });
  } catch (err) { next(err); }
});

module.exports = router;
