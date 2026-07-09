// destinations.js
const express = require('express');
const router = express.Router();

// Popular destinations (static + dynamic from trips)
router.get('/popular', async (req, res) => {
  const destinations = [
    { name: 'Bali', country: 'Indonesia', continent: 'Asia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600', tags: ['Beach', 'Culture', 'Adventure'], rating: 4.8 },
    { name: 'Santorini', country: 'Greece', continent: 'Europe', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600', tags: ['Romantic', 'Beach', 'Luxury'], rating: 4.9 },
    { name: 'Kyoto', country: 'Japan', continent: 'Asia', image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600', tags: ['Culture', 'History', 'Nature'], rating: 4.9 },
    { name: 'Machu Picchu', country: 'Peru', continent: 'South America', image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600', tags: ['Adventure', 'History', 'Hiking'], rating: 4.9 },
    { name: 'Paris', country: 'France', continent: 'Europe', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600', tags: ['Romantic', 'Culture', 'City'], rating: 4.7 },
    { name: 'Safari - Serengeti', country: 'Tanzania', continent: 'Africa', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600', tags: ['Adventure', 'Nature', 'Wildlife'], rating: 4.9 },
    { name: 'Amalfi Coast', country: 'Italy', continent: 'Europe', image: 'https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?w=600', tags: ['Luxury', 'Beach', 'Scenic'], rating: 4.8 },
    { name: 'Patagonia', country: 'Argentina', continent: 'South America', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600', tags: ['Adventure', 'Hiking', 'Nature'], rating: 4.8 },
    { name: 'Maldives', country: 'Maldives', continent: 'Asia', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600', tags: ['Luxury', 'Beach', 'Romantic'], rating: 5.0 },
    { name: 'Iceland', country: 'Iceland', continent: 'Europe', image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600', tags: ['Adventure', 'Nature', 'Northern Lights'], rating: 4.9 },
    { name: 'New Zealand', country: 'New Zealand', continent: 'Oceania', image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=600', tags: ['Adventure', 'Nature', 'Hiking'], rating: 4.9 },
    { name: 'Morocco', country: 'Morocco', continent: 'Africa', image: 'https://images.unsplash.com/photo-1539020140153-e479b8f22986?w=600', tags: ['Culture', 'Desert', 'Adventure'], rating: 4.7 },
  ];
  res.json({ success: true, destinations });
});

module.exports = router;
