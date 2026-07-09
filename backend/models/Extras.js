const mongoose = require('mongoose');

// Budget / Expense Model
const expenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
  category: { type: String, enum: ['accommodation', 'transport', 'food', 'activities', 'shopping', 'health', 'visa', 'insurance', 'other'], required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  convertedAmount: Number,
  date: { type: Date, default: Date.now },
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  splitWith: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, share: Number, settled: { type: Boolean, default: false } }],
  receipt: String,
  notes: String,
  tags: [String]
}, { timestamps: true });

// PackingList Model
const packingItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, default: 'General' },
  quantity: { type: Number, default: 1 },
  isPacked: { type: Boolean, default: false },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isEssential: { type: Boolean, default: false },
  notes: String
});

const packingListSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
  name: { type: String, default: 'My Packing List' },
  items: [packingItemSchema],
  isShared: { type: Boolean, default: false },
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  template: { type: String, enum: ['beach', 'mountains', 'city', 'business', 'camping', 'backpacking', 'custom'], default: 'custom' }
}, { timestamps: true });

// Journal Model
const journalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
  title: { type: String, required: true },
  content: { type: String, required: true },
  images: [{ url: String, caption: String }],
  location: String,
  mood: { type: String, enum: ['amazing', 'happy', 'neutral', 'tired', 'challenging'], default: 'happy' },
  weather: String,
  date: { type: Date, default: Date.now },
  isPublic: { type: Boolean, default: false },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
  tags: [String]
}, { timestamps: true });

// Notification Model
const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['trip_invite', 'booking_confirmed', 'booking_cancelled', 'follow', 'like', 'comment', 'trip_reminder', 'system', 'achievement'], required: true },
  title: String,
  message: String,
  data: mongoose.Schema.Types.Mixed,
  isRead: { type: Boolean, default: false },
  link: String,
}, { timestamps: true });

const Expense = mongoose.model('Expense', expenseSchema);
const PackingList = mongoose.model('PackingList', packingListSchema);
const Journal = mongoose.model('Journal', journalSchema);
const Notification = mongoose.model('Notification', notificationSchema);

module.exports = { Expense, PackingList, Journal, Notification };
