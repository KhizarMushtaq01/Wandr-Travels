// destinations.js
const express = require('express');
const router = express.Router();
const popularDestinations = require('../data/popularDestinations');

// Popular destinations (static)
router.get('/popular', async (req, res) => {
  res.json({ success: true, destinations: popularDestinations });
});

module.exports = router;
