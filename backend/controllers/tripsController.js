const Trip = require('../models/Trip');
const emailService = require('../utils/emailService');

exports.createTrip = async (req, res, next) => {
  try {
    const trip = await Trip.create({ ...req.body, owner: req.user._id });
    try { await emailService.sendTripCreatedEmail(req.user, trip); } catch (e) {}
    res.status(201).json({ success: true, trip });
  } catch (err) { next(err); }
};

exports.getTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find({
      $or: [{ owner: req.user._id }, { 'collaborators.user': req.user._id }]
    }).populate('owner', 'firstName lastName avatar').sort('-updatedAt');
    res.json({ success: true, trips });
  } catch (err) { next(err); }
};

exports.getTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('owner', 'firstName lastName avatar')
      .populate('collaborators.user', 'firstName lastName avatar')
      .populate('likes', 'firstName lastName avatar');

    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    const isOwner = trip.owner._id.toString() === req.user?._id?.toString();
    const isCollab = trip.collaborators.some(c => c.user?._id?.toString() === req.user?._id?.toString());

    if (!trip.isPublic && !isOwner && !isCollab) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    if (!isOwner && !isCollab) { trip.views += 1; await trip.save(); }

    res.json({ success: true, trip });
  } catch (err) { next(err); }
};

exports.updateTrip = async (req, res, next) => {
  try {
    let trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    if (trip.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, trip });
  } catch (err) { next(err); }
};

exports.deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    if (trip.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await trip.deleteOne();
    res.json({ success: true, message: 'Trip deleted' });
  } catch (err) { next(err); }
};

exports.inviteCollaborator = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id).populate('owner');
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    if (trip.owner._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const { email, role } = req.body;
    const User = require('../models/User');
    const invitee = await User.findOne({ email });
    if (!invitee) return res.status(404).json({ success: false, message: 'User not found' });

    const alreadyAdded = trip.collaborators.some(c => c.user.toString() === invitee._id.toString());
    if (alreadyAdded) return res.status(400).json({ success: false, message: 'Already a collaborator' });

    trip.collaborators.push({ user: invitee._id, role: role || 'viewer' });
    await trip.save();
    try { await emailService.sendTripInviteEmail(invitee, req.user, trip); } catch (e) {}
    res.json({ success: true, message: 'Collaborator invited' });
  } catch (err) { next(err); }
};

exports.likeTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    const liked = trip.likes.includes(req.user._id);
    if (liked) {
      trip.likes.pull(req.user._id);
    } else {
      trip.likes.push(req.user._id);
    }
    await trip.save();
    res.json({ success: true, liked: !liked, likesCount: trip.likes.length });
  } catch (err) { next(err); }
};

exports.copyTrip = async (req, res, next) => {
  try {
    const originalTrip = await Trip.findById(req.params.id);
    if (!originalTrip || (!originalTrip.isPublic && originalTrip.owner.toString() !== req.user._id.toString())) {
      return res.status(404).json({ success: false, message: 'Trip not found or not public' });
    }
    const copied = await Trip.create({
      name: `${originalTrip.name} (Copy)`,
      description: originalTrip.description,
      owner: req.user._id,
      destinations: originalTrip.destinations,
      coverImage: originalTrip.coverImage,
      status: 'planning',
      tripType: originalTrip.tripType,
      tags: originalTrip.tags,
      duration: originalTrip.duration,
      currency: originalTrip.currency,
    });
    originalTrip.copies += 1;
    await originalTrip.save();
    res.status(201).json({ success: true, trip: copied });
  } catch (err) { next(err); }
};

exports.getPublicTrips = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const query = { isPublic: true };
    if (req.query.tags) query.tags = { $in: req.query.tags.split(',') };
    if (req.query.tripType) query.tripType = req.query.tripType;

    const [trips, total] = await Promise.all([
      Trip.find(query).populate('owner', 'firstName lastName avatar').sort('-likes -views').skip(skip).limit(limit),
      Trip.countDocuments(query)
    ]);
    res.json({ success: true, trips, total, page, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};
