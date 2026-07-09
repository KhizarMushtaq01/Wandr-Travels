const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middleware/auth');
const {
  createTrip, getTrips, getTrip, updateTrip, deleteTrip,
  inviteCollaborator, likeTrip, copyTrip, getPublicTrips
} = require('../controllers/tripsController');

router.get('/public', optionalAuth, getPublicTrips);
router.get('/', protect, getTrips);
router.post('/', protect, createTrip);
router.get('/:id', protect, getTrip);
router.put('/:id', protect, updateTrip);
router.delete('/:id', protect, deleteTrip);
router.post('/:id/invite', protect, inviteCollaborator);
router.post('/:id/like', protect, likeTrip);
router.post('/:id/copy', protect, copyTrip);

module.exports = router;
