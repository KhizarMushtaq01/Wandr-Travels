const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: String,
  coordinates: { lat: Number, lng: Number },
  arrivalDate: Date,
  departureDate: Date,
  nights: { type: Number, default: 1 },
  accommodation: String,
  notes: String,
  images: [String],
  activities: [{
    name: String,
    time: String,
    duration: String,
    cost: Number,
    notes: String,
    category: { type: String, enum: ['sightseeing', 'dining', 'adventure', 'transport', 'accommodation', 'other'], default: 'other' },
    completed: { type: Boolean, default: false }
  }]
});

const tripSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, maxlength: 1000 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  collaborators: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['viewer', 'editor'], default: 'viewer' },
    addedAt: { type: Date, default: Date.now }
  }],
  destinations: [destinationSchema],
  coverImage: { type: String, default: '' },
  status: { type: String, enum: ['planning', 'upcoming', 'active', 'completed', 'cancelled'], default: 'planning' },
  startDate: Date,
  endDate: Date,
  duration: Number,
  totalBudget: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
  tripType: { type: String, enum: ['solo', 'couple', 'family', 'group', 'business'], default: 'solo' },
  tags: [String],
  isPublic: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  views: { type: Number, default: 0 },
  copies: { type: Number, default: 0 },
  packingListId: { type: mongoose.Schema.Types.ObjectId, ref: 'PackingList' },
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);
