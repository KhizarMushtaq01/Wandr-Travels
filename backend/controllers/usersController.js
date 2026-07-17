const User = require('../models/User');
const emailService = require('../utils/emailService');
const { logAdminAction } = require('../models/AdminAuditLog');
const cloudinary = require('../config/cloudinary');

// @desc Get user profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id || req.user._id)
      .populate('followers', 'firstName lastName avatar')
      .populate('following', 'firstName lastName avatar');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const isOwnProfile = !req.params.id || req.params.id === req.user._id.toString();
    const publicUser = user.toPublicJSON();
    if (!isOwnProfile) delete publicUser.savedDestinations;
    res.json({ success: true, user: publicUser });
  } catch (err) { next(err); }
};

// @desc Update profile
exports.updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ['firstName', 'lastName', 'bio', 'location', 'website', 'travelStyle', 'preferredCurrency', 'notifications'];
    const updates = {};
    const changes = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (['firstName', 'lastName'].includes(field) && req.user[field] !== req.body[field]) {
          changes[field] = `${req.user[field]} → ${req.body[field]}`;
        }
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });

    if (Object.keys(changes).length > 0) {
      try { await emailService.sendProfileUpdatedEmail(user, changes); } catch (e) {}
    }

    // Handle email change separately
    if (req.body.email && req.body.email !== req.user.email) {
      const exists = await User.findOne({ email: req.body.email });
      if (exists) return res.status(400).json({ success: false, message: 'Email already in use' });
      const oldEmail = user.email;
      user.email = req.body.email;
      await user.save();
      try { await emailService.sendEmailChangedEmail(user, oldEmail, req.body.email); } catch (e) {}
    }

    res.json({ success: true, user: user.toPublicJSON() });
  } catch (err) { next(err); }
};

// @desc Upload avatar
exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const avatarUrl = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { public_id: `wandr/avatars/user-${req.user._id}`, overwrite: true, resource_type: 'image' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    const user = await User.findByIdAndUpdate(req.user._id, { avatar: avatarUrl }, { new: true });
    try { await emailService.sendAvatarChangedEmail(user); } catch (e) {}
    res.json({ success: true, avatar: avatarUrl, user: user.toPublicJSON() });
  } catch (err) { next(err); }
};

// @desc Delete account
exports.deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.matchPassword(req.body.password))) {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }
    await User.findByIdAndDelete(req.user._id);
    try { await emailService.sendAccountDeletedEmail(user); } catch (e) {}
    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (err) { next(err); }
};

// @desc Follow/Unfollow user
exports.toggleFollow = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot follow yourself' });
    }
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ success: false, message: 'User not found' });

    const isFollowing = req.user.following.includes(req.params.id);

    if (isFollowing) {
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: req.params.id } });
      await User.findByIdAndUpdate(req.params.id, { $pull: { followers: req.user._id } });
      res.json({ success: true, message: 'Unfollowed', isFollowing: false });
    } else {
      await User.findByIdAndUpdate(req.user._id, { $push: { following: req.params.id } });
      await User.findByIdAndUpdate(req.params.id, { $push: { followers: req.user._id } });
      res.json({ success: true, message: 'Followed', isFollowing: true });
    }
  } catch (err) { next(err); }
};

// @desc Search users
exports.searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ success: true, users: [] });
    const users = await User.find({
      $or: [
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ],
      isActive: true
    }).select('firstName lastName avatar bio location countriesVisited').limit(20);
    res.json({ success: true, users });
  } catch (err) { next(err); }
};

// @desc Get all users (admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const query = {};
    if (req.query.search) {
      query.$or = [
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    if (req.query.role) query.role = req.query.role;
    if (req.query.isActive) query.isActive = req.query.isActive === 'true';

    const [users, total] = await Promise.all([
      User.find(query).select('-password').skip(skip).limit(limit).sort('-createdAt'),
      User.countDocuments(query)
    ]);
    res.json({ success: true, users, total, page, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

// @desc Toggle user active status (admin)
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    logAdminAction(req.user._id, user.isActive ? 'activate_user' : 'deactivate_user', 'User', user._id, `${user.firstName} ${user.lastName} (${user.email})`);
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
  } catch (err) { next(err); }
};

// @desc Change user role (admin)
exports.changeUserRole = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    logAdminAction(req.user._id, 'change_role', 'User', user._id, `${user.firstName} ${user.lastName} → ${req.body.role}`);
    res.json({ success: true, user });
  } catch (err) { next(err); }
};

// @desc Toggle a destination in the current user's wishlist
exports.toggleWishlist = async (req, res, next) => {
  try {
    const destination = (req.body.destination || '').trim();
    if (!destination) {
      return res.status(400).json({ success: false, message: 'Destination is required' });
    }
    const isSaved = req.user.savedDestinations.includes(destination);
    const update = isSaved
      ? { $pull: { savedDestinations: destination } }
      : { $push: { savedDestinations: destination } };
    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true });
    res.json({ success: true, saved: !isSaved, savedDestinations: user.savedDestinations });
  } catch (err) { next(err); }
};
