// budget.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { Expense } = require('../models/Extras');

router.get('/', protect, async (req, res, next) => {
  try {
    const query = { user: req.user._id };
    if (req.query.trip) query.trip = req.query.trip;
    const expenses = await Expense.find(query).sort('-date');
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const byCategory = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});
    res.json({ success: true, expenses, total, byCategory });
  } catch (err) { next(err); }
});

router.post('/', protect, async (req, res, next) => {
  try {
    const expense = await Expense.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, expense });
  } catch (err) { next(err); }
});

router.put('/:id', protect, async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });
    res.json({ success: true, expense });
  } catch (err) { next(err); }
});

router.delete('/:id', protect, async (req, res, next) => {
  try {
    await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ success: true, message: 'Expense deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
