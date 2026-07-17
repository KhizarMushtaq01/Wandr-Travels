import React from 'react';
import {
  FaHouse, FaMap, FaCalendarDays, FaSackDollar, FaBoxesPacking, FaCompass, FaHeart, FaBookOpen,
  FaUsers, FaUser, FaGear, FaBell, FaShieldHalved, FaRightFromBracket, FaChartLine, FaClockRotateLeft,
  FaPlane, FaHotel, FaBullseye, FaCar, FaTrain, FaShip, FaLocationDot,
  FaCircleCheck, FaCircleXmark, FaComment, FaClock, FaTrophy,
  FaFaceGrinStars, FaFaceSmile, FaFaceMeh, FaFaceTired, FaFaceAngry,
  FaXTwitter, FaLinkedin, FaInstagram, FaYoutube,
  FaLandmark, FaUtensils, FaPersonHiking, FaBus, FaPills, FaClipboard, FaBagShopping,
} from 'react-icons/fa6';

const ICON = 'w-5 h-5';

export const NAV_ICONS = {
  dashboard: <FaHouse className={ICON} />,
  trips: <FaMap className={ICON} />,
  bookings: <FaCalendarDays className={ICON} />,
  budget: <FaSackDollar className={ICON} />,
  packing: <FaBoxesPacking className={ICON} />,
  discover: <FaCompass className={ICON} />,
  wishlist: <FaHeart className={ICON} />,
  journal: <FaBookOpen className={ICON} />,
  social: <FaUsers className={ICON} />,
  profile: <FaUser className={ICON} />,
  settings: <FaGear className={ICON} />,
  notifications: <FaBell className={ICON} />,
  admin: <FaShieldHalved className={ICON} />,
  signOut: <FaRightFromBracket className={ICON} />,
};

export const ADMIN_NAV_ICONS = {
  dashboard: <FaChartLine className={ICON} />,
  users: <FaUsers className={ICON} />,
  trips: <FaMap className={ICON} />,
  bookings: <FaCalendarDays className={ICON} />,
  activity: <FaClockRotateLeft className={ICON} />,
  settings: <FaGear className={ICON} />,
  clientView: <FaHouse className={ICON} />,
  signOut: <FaRightFromBracket className={ICON} />,
};

export const BOOKING_TYPE_ICONS = {
  flight: <FaPlane className={ICON} />,
  hotel: <FaHotel className={ICON} />,
  activity: <FaBullseye className={ICON} />,
  car: <FaCar className={ICON} />,
  train: <FaTrain className={ICON} />,
  ferry: <FaShip className={ICON} />,
  tour: <FaMap className={ICON} />,
  other: <FaLocationDot className={ICON} />,
};

export const BUDGET_CATEGORY_ICONS = {
  accommodation: <FaHotel className={ICON} />,
  transport: <FaBus className={ICON} />,
  food: <FaUtensils className={ICON} />,
  activities: <FaBullseye className={ICON} />,
  shopping: <FaBagShopping className={ICON} />,
  health: <FaPills className={ICON} />,
  visa: <FaClipboard className={ICON} />,
  insurance: <FaShieldHalved className={ICON} />,
  other: <FaLocationDot className={ICON} />,
};

export const ITINERARY_CATEGORY_ICONS = {
  sightseeing: <FaLandmark className={ICON} />,
  dining: <FaUtensils className={ICON} />,
  adventure: <FaPersonHiking className={ICON} />,
  transport: <FaBus className={ICON} />,
  accommodation: <FaHotel className={ICON} />,
  other: <FaLocationDot className={ICON} />,
};

export const NOTIFICATION_TYPE_ICONS = {
  trip_invite: <FaPlane className={ICON} />,
  booking_confirmed: <FaCircleCheck className={ICON} />,
  booking_cancelled: <FaCircleXmark className={ICON} />,
  follow: <FaUsers className={ICON} />,
  like: <FaHeart className={ICON} />,
  comment: <FaComment className={ICON} />,
  trip_reminder: <FaClock className={ICON} />,
  system: <FaBell className={ICON} />,
  achievement: <FaTrophy className={ICON} />,
};

export const JOURNAL_MOOD_ICONS = {
  amazing: <FaFaceGrinStars className={ICON} />,
  happy: <FaFaceSmile className={ICON} />,
  neutral: <FaFaceMeh className={ICON} />,
  tired: <FaFaceTired className={ICON} />,
  challenging: <FaFaceAngry className={ICON} />,
};

export const SOCIAL_ICONS = {
  x: <FaXTwitter className="w-4 h-4" />,
  linkedin: <FaLinkedin className="w-4 h-4" />,
  instagram: <FaInstagram className="w-4 h-4" />,
  youtube: <FaYoutube className="w-4 h-4" />,
};
