/**
 * Seed script — populates Wandr with demo data
 * Run: node utils/seedData.js
 */

require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Trip = require('../models/Trip');
const Booking = require('../models/Booking');
const { Expense, PackingList, Journal, Notification } = require('../models/Extras');
const Review = require('../models/Review');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/wandr';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Trip.deleteMany({}),
    Booking.deleteMany({}),
    Expense.deleteMany({}),
    PackingList.deleteMany({}),
    Journal.deleteMany({}),
    Notification.deleteMany({}),
    Review.deleteMany({}),
  ]);
  console.log('🧹 Cleared existing data');

  // Create users
  const adminUser = await User.create({
    firstName: 'Alex',
    lastName: 'Admin',
    email: 'admin@wandr.travel',
    password: 'admin123',
    role: 'admin',
    isEmailVerified: true,
    bio: 'Wandr platform administrator and avid traveler.',
    location: 'San Francisco, CA',
    travelStyle: ['Adventure', 'Cultural', 'City'],
    countriesVisited: 32,
    tripsCompleted: 18,
    subscriptionPlan: 'premium',
  });

  const user1 = await User.create({
    firstName: 'Sarah',
    lastName: 'Explorer',
    email: 'sarah@example.com',
    password: 'password123',
    role: 'user',
    isEmailVerified: true,
    bio: 'Solo traveler, coffee addict, and sunset chaser.',
    location: 'London, UK',
    travelStyle: ['Solo', 'Adventure', 'Beach'],
    countriesVisited: 24,
    tripsCompleted: 11,
    subscriptionPlan: 'pro',
  });

  const user2 = await User.create({
    firstName: 'Marco',
    lastName: 'Journeys',
    email: 'marco@example.com',
    password: 'password123',
    role: 'user',
    isEmailVerified: true,
    bio: 'Budget backpacker who has circled the globe twice.',
    location: 'Berlin, Germany',
    travelStyle: ['Budget', 'Cultural', 'Mountain'],
    countriesVisited: 48,
    tripsCompleted: 29,
    subscriptionPlan: 'free',
  });

  // Follow relationships
  user1.following.push(user2._id);
  user2.followers.push(user1._id);
  await user1.save();
  await user2.save();

  console.log('👥 Created 3 users (admin@wandr.travel / admin123)');

  // Create trips
  const trip1 = await Trip.create({
    name: 'Southeast Asia Adventure',
    description: 'A 3-week backpacking journey through Thailand, Cambodia, and Vietnam.',
    owner: user1._id,
    status: 'upcoming',
    startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 51 * 24 * 60 * 60 * 1000),
    duration: 21,
    tripType: 'solo',
    totalBudget: 3000,
    currency: 'USD',
    isPublic: true,
    tags: ['backpacking', 'asia', 'budget', 'adventure'],
    destinations: [
      {
        name: 'Bangkok',
        country: 'Thailand',
        nights: 3,
        arrivalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        accommodation: 'Lub d Bangkok Silom Hostel',
        activities: [
          { name: 'Grand Palace Tour', time: '9:00 AM', duration: '3 hours', cost: 15, category: 'sightseeing' },
          { name: 'Street Food Tour at Yaowarat', time: '7:00 PM', duration: '2 hours', cost: 20, category: 'dining' },
          { name: 'Muay Thai Match', time: '8:00 PM', duration: '2 hours', cost: 25, category: 'adventure' },
        ]
      },
      {
        name: 'Chiang Mai',
        country: 'Thailand',
        nights: 4,
        accommodation: 'The Yard Hostel',
        activities: [
          { name: 'Doi Inthanon National Park', time: '7:00 AM', duration: 'Full day', cost: 40, category: 'adventure' },
          { name: 'Thai Cooking Class', time: '10:00 AM', duration: '4 hours', cost: 35, category: 'dining' },
        ]
      },
      {
        name: 'Siem Reap',
        country: 'Cambodia',
        nights: 3,
        accommodation: 'Onederz Hostel',
        activities: [
          { name: 'Angkor Wat Sunrise', time: '5:00 AM', duration: '6 hours', cost: 37, category: 'sightseeing' },
          { name: 'Pub Street Night', time: '9:00 PM', duration: '3 hours', cost: 15, category: 'dining' },
        ]
      },
      {
        name: 'Hoi An',
        country: 'Vietnam',
        nights: 4,
        accommodation: 'Little Gem Hoi An Hotel',
        activities: [
          { name: 'Ancient Town Walking Tour', time: '8:00 AM', duration: '3 hours', cost: 10, category: 'sightseeing' },
          { name: 'Lantern Making Class', time: '2:00 PM', duration: '2 hours', cost: 25, category: 'other' },
          { name: 'Pho Bo Breakfast', time: '7:30 AM', duration: '1 hour', cost: 3, category: 'dining' },
        ]
      }
    ],
  });

  const trip2 = await Trip.create({
    name: 'Iceland Ring Road',
    description: 'Circumnavigating Iceland on the famous Route 1 in 10 days.',
    owner: user2._id,
    status: 'completed',
    startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000),
    duration: 10,
    tripType: 'couple',
    totalBudget: 5000,
    currency: 'USD',
    isPublic: true,
    isFeatured: true,
    tags: ['road-trip', 'nature', 'northern-lights', 'europe'],
    destinations: [
      {
        name: 'Reykjavik',
        country: 'Iceland',
        nights: 2,
        accommodation: 'Canopy by Hilton',
        activities: [
          { name: 'Blue Lagoon Geothermal Spa', time: '2:00 PM', duration: '3 hours', cost: 85, category: 'adventure', completed: true },
          { name: 'Hallgrimskirkja Church', time: '10:00 AM', duration: '1 hour', cost: 0, category: 'sightseeing', completed: true },
        ]
      },
      {
        name: 'Vik',
        country: 'Iceland',
        nights: 2,
        accommodation: 'Hotel Vik',
        activities: [
          { name: 'Black Sand Beach (Reynisfjara)', time: '10:00 AM', duration: '2 hours', cost: 0, category: 'sightseeing', completed: true },
          { name: 'Northern Lights Hunt', time: '10:00 PM', duration: '4 hours', cost: 60, category: 'adventure', completed: true },
        ]
      },
    ],
    likes: [user1._id],
    views: 342,
    copies: 28,
  });

  const adminTrip = await Trip.create({
    name: 'Japan Cherry Blossom',
    description: 'Two weeks chasing sakura across Tokyo, Kyoto, and Osaka.',
    owner: adminUser._id,
    status: 'planning',
    startDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    duration: 14,
    tripType: 'couple',
    totalBudget: 7000,
    currency: 'USD',
    isPublic: true,
    isFeatured: true,
    tags: ['japan', 'cherry-blossom', 'culture', 'luxury'],
    destinations: [
      { name: 'Tokyo', country: 'Japan', nights: 5, accommodation: 'Park Hyatt Tokyo' },
      { name: 'Kyoto', country: 'Japan', nights: 4, accommodation: 'Hoshinoya Kyoto' },
      { name: 'Osaka', country: 'Japan', nights: 3, accommodation: 'The St. Regis Osaka' },
      { name: 'Hiroshima', country: 'Japan', nights: 2, accommodation: 'Sheraton Grand' },
    ],
  });

  console.log('🗺️  Created 3 trips');

  // Create bookings
  await Booking.create({
    user: user1._id,
    trip: trip1._id,
    type: 'flight',
    name: 'LHR → BKK (Thai Airways)',
    provider: 'Thai Airways',
    bookingReference: 'TG-89234',
    status: 'confirmed',
    checkIn: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    totalAmount: 680,
    currency: 'USD',
    origin: 'London Heathrow',
    destination: 'Bangkok Suvarnabhumi',
  });

  await Booking.create({
    user: user1._id,
    trip: trip1._id,
    type: 'hotel',
    name: 'Lub d Bangkok Silom',
    provider: 'Booking.com',
    bookingReference: 'BK-447821',
    status: 'confirmed',
    checkIn: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    checkOut: new Date(Date.now() + 33 * 24 * 60 * 60 * 1000),
    totalAmount: 120,
    currency: 'USD',
    destination: 'Bangkok',
  });

  await Booking.create({
    user: user2._id,
    trip: trip2._id,
    type: 'car',
    name: 'Iceland Rental - Dacia Duster 4WD',
    provider: 'Hertz Iceland',
    bookingReference: 'HZ-09312',
    status: 'completed',
    checkIn: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    checkOut: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000),
    totalAmount: 1200,
    currency: 'USD',
  });

  console.log('📅 Created 3 bookings');

  // Create expenses
  const expCategories = ['accommodation', 'transport', 'food', 'activities', 'shopping'];
  for (let i = 0; i < 15; i++) {
    await Expense.create({
      user: user1._id,
      trip: trip1._id,
      category: expCategories[i % expCategories.length],
      description: ['Hostel Bangkok 3 nights', 'Grab taxi to airport', 'Pad Thai + Mango Sticky Rice', 'Angkor Wat pass', 'Silk scarf souvenir', 'Bus from BKK to Chiang Mai', 'Cooking class', 'Boat to islands', 'Street food market', 'Temple offerings', 'SIM card', 'Train ticket', 'Visa on arrival', 'Coffee + breakfast', 'Night market haul'][i],
      amount: [120, 15, 12, 37, 45, 25, 35, 55, 20, 8, 12, 18, 30, 9, 28][i],
      currency: 'USD',
      date: new Date(Date.now() - i * 2 * 24 * 60 * 60 * 1000),
    });
  }

  console.log('💰 Created 15 expenses');

  // Create packing list
  await PackingList.create({
    user: user1._id,
    trip: trip1._id,
    name: 'SEA Backpacking Essentials',
    template: 'backpacking',
    items: [
      { name: 'Passport + copies', category: 'Documents', quantity: 1, isEssential: true, isPacked: true },
      { name: 'Travel insurance', category: 'Documents', quantity: 1, isEssential: true, isPacked: true },
      { name: 'Vaccination record', category: 'Documents', quantity: 1, isEssential: true },
      { name: 'Lightweight backpack (40L)', category: 'Clothing', quantity: 1, isEssential: true, isPacked: true },
      { name: 'Quick-dry t-shirts', category: 'Clothing', quantity: 6 },
      { name: 'Lightweight trousers', category: 'Clothing', quantity: 2 },
      { name: 'Flip flops', category: 'Clothing', quantity: 1, isPacked: true },
      { name: 'Sunscreen SPF50', category: 'Toiletries', quantity: 2, isEssential: true },
      { name: 'Mosquito repellent', category: 'Toiletries', quantity: 1, isEssential: true },
      { name: 'Travel towel', category: 'Accessories', quantity: 1 },
      { name: 'Universal power adapter', category: 'Electronics', quantity: 1, isEssential: true, isPacked: true },
      { name: 'Portable charger', category: 'Electronics', quantity: 1 },
      { name: 'Malaria tablets', category: 'Health', quantity: 1, isEssential: true },
      { name: 'Water purification tablets', category: 'Health', quantity: 1, isEssential: true },
    ]
  });

  console.log('🎒 Created packing list');

  // Create journal entries
  await Journal.create({
    user: user2._id,
    trip: trip2._id,
    title: 'Chasing the Northern Lights in Vik',
    content: 'We had almost given up after two cloudy nights when suddenly, around 11pm, the sky erupted in ribbons of green and purple. We stood on the black sand beach at Reynisfjara, completely silent, watching the aurora dance above the basalt columns. No photo could ever capture the feeling. My partner grabbed my hand and we just stood there for what felt like an hour. This is why we travel.',
    location: 'Vik, Iceland',
    mood: 'amazing',
    isPublic: true,
    date: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000),
    likes: [user1._id, adminUser._id],
    comments: [
      { user: user1._id, text: 'This made me tear up! Iceland is on my bucket list now.' },
      { user: adminUser._id, text: 'Incredible writing! The aurora is truly magical.' },
    ],
    tags: ['northern-lights', 'iceland', 'bucket-list'],
  });

  await Journal.create({
    user: user1._id,
    trip: trip1._id,
    title: 'First Morning in Bangkok',
    content: 'Woke up at 5am to jet lag and an immediate craving for street food. Wandered out of the hostel into the already-bustling lanes of Silom and found a woman making pad krapow gai at a tiny street stall. Best 50 baht I have ever spent. Bangkok hits you like a wave - the smells, the noise, the energy - and you either drown or learn to swim. I am learning to swim.',
    location: 'Bangkok, Thailand',
    mood: 'happy',
    isPublic: true,
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    likes: [user2._id],
    tags: ['bangkok', 'street-food', 'solo-travel'],
  });

  console.log('📔 Created 2 journal entries');

  // Create notifications
  await Notification.create({ user: user1._id, type: 'follow', title: 'New Follower', message: 'Marco Journeys started following you', isRead: false });
  await Notification.create({ user: user1._id, type: 'booking_confirmed', title: 'Booking Confirmed', message: 'Your flight LHR → BKK has been confirmed!', isRead: false });
  await Notification.create({ user: user1._id, type: 'like', title: 'Journal Liked', message: 'Alex Admin liked your journal entry', isRead: true });
  await Notification.create({ user: user2._id, type: 'trip_reminder', title: 'Trip Reminder', message: 'Your Iceland Ring Road trip starts in 3 days!', isRead: true });

  console.log('🔔 Created notifications');

  // Create dummy approved reviews (site testimonials)
  const dummyReviews = [
    { fullName: 'Elena K.', email: 'elena.k@example.com', rating: 5, reviewText: 'Wandr is the only travel app I actually keep using. It turned planning from a chore into a joy.' },
    { fullName: 'Marcus Chen', email: 'marcus.chen@example.com', rating: 5, reviewText: 'We planned our entire Patagonia trek — 18 days — without a single spreadsheet. Pure magic.' },
    { fullName: 'Yuki Tanaka', email: 'yuki.tanaka@example.com', rating: 5, reviewText: 'The journal feature alone is worth it. I have detailed memories of every trip since 2023.' },
    { fullName: 'Priya Nair', email: 'priya.nair@example.com', rating: 4, reviewText: 'Booking manager saved my sanity on a 6-country trip. Wish the mobile app had offline maps too, but otherwise fantastic.' },
    { fullName: "James O'Connor", email: 'james.oconnor@example.com', rating: 5, reviewText: 'Switched from three different apps to just Wandr. The budget tracker with currency split made our group trip painless.' },
    { fullName: 'Sofia Rossi', email: 'sofia.rossi@example.com', rating: 5, reviewText: 'Discover feed introduced me to a route through the Dolomites I never would have found on my own. Already planning the next one.' },
  ];
  for (const r of dummyReviews) {
    await Review.create({ ...r, user: new mongoose.Types.ObjectId(), status: 'approved' });
  }
  console.log(`⭐ Created ${dummyReviews.length} dummy approved reviews`);

  console.log('\n✅ Seed complete!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Demo Accounts:');
  console.log('  Admin:  admin@wandr.travel  / admin123');
  console.log('  User 1: sarah@example.com   / password123');
  console.log('  User 2: marco@example.com   / password123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
