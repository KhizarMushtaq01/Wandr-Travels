const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getDashboardStats, getActivityLog, sendBroadcastEmail, getSystemHealth } = require('../controllers/adminController');

router.use(protect, authorize('admin', 'superadmin'));

router.get('/stats', getDashboardStats);
router.get('/activity', getActivityLog);
router.get('/health', getSystemHealth);
router.post('/broadcast', sendBroadcastEmail);

module.exports = router;
