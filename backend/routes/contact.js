const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');

router.post('/', async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    await ContactMessage.create({ name, email, subject, message });
    res.status(201).json({ success: true, message: 'Message sent — we will get back to you soon' });
  } catch (err) { next(err); }
});

module.exports = router;
