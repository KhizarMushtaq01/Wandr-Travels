const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
  type: { type: String, enum: ['flight', 'hotel', 'activity', 'car', 'train', 'ferry', 'tour', 'other'], required: true },
  name: { type: String, required: true },
  provider: String,
  bookingReference: String,
  confirmationNumber: String,
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  checkIn: Date,
  checkOut: Date,
  departureTime: Date,
  arrivalTime: Date,
  origin: String,
  destination: String,
  passengers: { type: Number, default: 1 },
  totalAmount: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
  paidAmount: { type: Number, default: 0 },
  isPaid: { type: Boolean, default: false },
  cancellationPolicy: String,
  notes: String,
  documents: [{ name: String, url: String }],
  address: String,
  contactInfo: String,
  rating: { type: Number, min: 1, max: 5 },
  review: String,
  tags: [String],
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
