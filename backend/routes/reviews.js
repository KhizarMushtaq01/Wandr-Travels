const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { protect } = require('../middleware/auth');
const { containsProfanity } = require('../utils/profanityFilter');

router.post('/', protect, async (req, res, next) => {
  try {
    const { fullName, email, rating, reviewText } = req.body;

    if (!fullName || !email || !rating || !reviewText) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be a whole number between 1 and 5' });
    }

    if (reviewText.trim().length < 10 || reviewText.trim().length > 1000) {
      return res.status(400).json({ success: false, message: 'Review must be between 10 and 1000 characters' });
    }

    if (containsProfanity(fullName) || containsProfanity(reviewText)) {
      return res.status(400).json({ success: false, message: 'Please remove inappropriate language from your review' });
    }

    const review = await Review.findOneAndUpdate(
      { user: req.user._id },
      { user: req.user._id, fullName, email, rating: ratingNum, reviewText, status: 'pending' },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({ success: true, message: 'Review submitted', review });
  } catch (err) { next(err); }
});

router.get('/approved', async (req, res, next) => {
  try {
    const reviews = await Review.find({ status: 'approved' }).sort('-createdAt').limit(50);
    res.json({ success: true, reviews });
  } catch (err) { next(err); }
});

module.exports = router;
