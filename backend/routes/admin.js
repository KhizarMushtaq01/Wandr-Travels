const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getDashboardStats, getActivityLog, sendBroadcastEmail, getSystemHealth, getAuditLog, getAllJournalAdmin, adminDeleteJournal, getAllContactMessages, updateContactMessageStatus, deleteContactMessage } = require('../controllers/adminController');
const { getAllTripsAdmin, adminUpdateTrip, adminDeleteTrip } = require('../controllers/tripsController');

router.use(protect, authorize('admin', 'superadmin'));

router.get('/stats', getDashboardStats);
router.get('/activity', getActivityLog);
router.get('/audit-log', getAuditLog);
router.get('/trips', getAllTripsAdmin);
router.patch('/trips/:id', adminUpdateTrip);
router.delete('/trips/:id', adminDeleteTrip);
router.get('/journal', getAllJournalAdmin);
router.delete('/journal/:id', adminDeleteJournal);
router.get('/contact', getAllContactMessages);
router.patch('/contact/:id', updateContactMessageStatus);
router.delete('/contact/:id', deleteContactMessage);
router.get('/health', getSystemHealth);
router.post('/broadcast', sendBroadcastEmail);

module.exports = router;
