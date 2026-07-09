const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createBooking, getBookings, getBooking,
  updateBooking, deleteBooking, getAllBookings
} = require('../controllers/bookingsController');

router.get('/', protect, getBookings);
router.post('/', protect, createBooking);
router.get('/all', protect, authorize('admin', 'superadmin'), getAllBookings);
router.get('/:id', protect, getBooking);
router.put('/:id', protect, updateBooking);
router.delete('/:id', protect, deleteBooking);

module.exports = router;
