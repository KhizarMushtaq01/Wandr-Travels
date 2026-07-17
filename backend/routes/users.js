const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, authorize } = require('../middleware/auth');
const {
  getProfile, updateProfile, uploadAvatar, deleteAccount,
  toggleFollow, searchUsers, getAllUsers, toggleUserStatus, changeUserRole, toggleWishlist
} = require('../controllers/usersController');

// Multer config for avatar uploads — buffered in memory, streamed straight to Cloudinary, never written to disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    if (allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'));
    }
  }
});

router.get('/search', protect, searchUsers);
router.get('/profile/:id', protect, getProfile);
router.get('/me', protect, getProfile);
router.put('/me', protect, updateProfile);
router.post('/me/avatar', protect, upload.single('avatar'), uploadAvatar);
router.delete('/me', protect, deleteAccount);
router.post('/me/wishlist', protect, toggleWishlist);
router.post('/:id/follow', protect, toggleFollow);

// Admin routes
router.get('/', protect, authorize('admin', 'superadmin'), getAllUsers);
router.patch('/:id/status', protect, authorize('admin', 'superadmin'), toggleUserStatus);
router.patch('/:id/role', protect, authorize('superadmin'), changeUserRole);

module.exports = router;
