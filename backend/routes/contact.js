const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');
const User = require('../models/User');
const emailService = require('../utils/emailService');

router.post('/', async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const contactMsg = await ContactMessage.create({ name, email, subject, message });

    try { await emailService.sendContactReceivedEmail(contactMsg); } catch (e) {}
    try {
      const admins = await User.find({ role: { $in: ['admin', 'superadmin'] }, isActive: true }).select('email');
      for (const admin of admins) {
        try { await emailService.sendNewContactMessageAdminEmail(admin.email, contactMsg); } catch (e) {}
      }
    } catch (e) {}

    res.status(201).json({ success: true, message: 'Message sent — we will get back to you soon' });
  } catch (err) { next(err); }
});

module.exports = router;
