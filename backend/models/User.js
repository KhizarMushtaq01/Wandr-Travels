const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true, maxlength: 50 },
  lastName: { type: String, required: true, trim: true, maxlength: 50 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  avatar: { type: String, default: '' },
  bio: { type: String, maxlength: 300, default: '' },
  location: { type: String, default: '' },
  website: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' },
  isActive: { type: Boolean, default: true },
  isEmailVerified: { type: Boolean, default: false },
  emailVerifyToken: String,
  emailVerifyExpire: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  travelStyle: {
    type: [String],
    enum: ['Adventure', 'Cultural', 'Luxury', 'Budget', 'Solo', 'Family', 'Romantic', 'Beach', 'Mountain', 'City'],
    default: []
  },
  preferredCurrency: { type: String, default: 'USD' },
  countriesVisited: { type: Number, default: 0 },
  tripsCompleted: { type: Number, default: 0 },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  savedDestinations: [{ type: String }],
  notifications: {
    email: { type: Boolean, default: true },
    tripReminders: { type: Boolean, default: true },
    socialUpdates: { type: Boolean, default: true },
    bookingAlerts: { type: Boolean, default: true },
  },
  lastLogin: { type: Date },
  loginHistory: [{
    ip: String,
    device: String,
    timestamp: { type: Date, default: Date.now }
  }],
  subscriptionPlan: { type: String, enum: ['free', 'pro', 'premium'], default: 'free' },
  subscriptionExpiry: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate reset token
userSchema.methods.getResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
  return resetToken;
};

// Generate email verify token
userSchema.methods.getEmailVerifyToken = function() {
  const verifyToken = crypto.randomBytes(20).toString('hex');
  this.emailVerifyToken = crypto.createHash('sha256').update(verifyToken).digest('hex');
  this.emailVerifyExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return verifyToken;
};

userSchema.methods.toPublicJSON = function() {
  return {
    _id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    avatar: this.avatar,
    bio: this.bio,
    location: this.location,
    role: this.role,
    travelStyle: this.travelStyle,
    countriesVisited: this.countriesVisited,
    tripsCompleted: this.tripsCompleted,
    followers: this.followers,
    following: this.following,
    subscriptionPlan: this.subscriptionPlan,
    notifications: this.notifications,
    isEmailVerified: this.isEmailVerified,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
