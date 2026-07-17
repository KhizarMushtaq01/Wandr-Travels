import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { SparklesIcon, MagnifyingGlassIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import useAuthStore from '../../context/authStore';

export default function DiscoverPage() {
  const { user, setUser } = useAuthStore();
  const [trips, setTrips] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('trending');
  const saved = user?.savedDestinations || [];

  const toggleWishlist = async (name) => {
    try {
      const res = await api.post('/users/me/wishlist', { destination: name });
      setUser({ ...user, savedDestinations: res.data.savedDestinations });
      toast.success(res.data.saved ? 'Saved to wishlist' : 'Removed from wishlist');
    } catch (e) {}
  };

  useEffect(() => {
    Promise.all([
      api.get('/discover/trending'),
      api.get('/discover/featured'),
      api.get('/destinations/popular'),
    ]).then(([trending, feat, dests]) => {
      setTrips(trending.data.trips || []);
      setFeatured(feat.data.trips || []);
      setDestinations(dests.data.destinations || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    try {
      const r = await api.get('/discover/search?q=' + encodeURIComponent(search));
      setTrips(r.data.trips || []);
      setFilter('search');
    } catch (e) {}
  };

  const copyTrip = async (tripId, tripName) => {
    try {
      await api.post('/trips/' + tripId + '/copy');
      toast.success('Trip copied to your trips!');
    } catch (e) {}
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-wandr-accent border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Discover</h1>
        <p className="page-subtitle">Explore itineraries from the Wandr community</p>
      </div>

      <form onSubmit={handleSearch} className="relative">
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-wandr-muted" />
        <input className="input-field pl-12 pr-24" placeholder="Search destinations, trip types, tags..." value={search} onChange={e => setSearch(e.target.value)} />
        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary text-sm px-4 py-2">Search</button>
      </form>

      {destinations.length > 0 && (
        <div>
          <h2 className="font-display text-xl text-white font-semibold mb-4">Popular Destinations</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {destinations.slice(0, 12).map((dest, i) => {
              const isSaved = saved.includes(dest.name);
              return (
                <div key={i} onClick={() => { setSearch(dest.name); handleSearch({ preventDefault: () => {} }); }}
                  className="relative p-3 rounded-xl bg-wandr-blue/30 border border-wandr-border hover:border-wandr-accent/30 hover:bg-wandr-blue/50 transition-all text-center cursor-pointer">
                  <button onClick={(e) => { e.stopPropagation(); toggleWishlist(dest.name); }}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-wandr-dark/60 hover:bg-wandr-dark transition-colors"
                    aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}>
                    {isSaved ? <HeartSolid className="w-3.5 h-3.5 text-red-400" /> : <HeartIcon className="w-3.5 h-3.5 text-white" />}
                  </button>
                  <div className="text-white font-medium text-sm truncate pr-4">{dest.name}</div>
                  {dest.country && <div className="text-wandr-muted text-xs truncate">{dest.country}</div>}
                  {dest.rating && <div className="text-wandr-muted text-xs mt-1">⭐ {dest.rating}</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl text-white font-semibold">
            {filter === 'search' ? 'Search Results' : filter === 'trending' ? 'Trending Trips' : 'Featured'}
          </h2>
          <div className="flex gap-2">
            <button onClick={() => setFilter('trending')} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${filter === 'trending' ? 'bg-wandr-accent/15 text-wandr-accent border border-wandr-accent/30' : 'text-wandr-muted border border-wandr-border hover:text-white'}`}>Trending</button>
            <button onClick={() => setFilter('featured')} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${filter === 'featured' ? 'bg-wandr-accent/15 text-wandr-accent border border-wandr-accent/30' : 'text-wandr-muted border border-wandr-border hover:text-white'}`}>Featured</button>
          </div>
        </div>

        {(filter === 'featured' ? featured : trips).length === 0 ? (
          <div className="card text-center py-16">
            <SparklesIcon className="w-12 h-12 mx-auto mb-3 text-wandr-muted opacity-30" />
            <p className="text-wandr-muted text-sm">No trips found. Be the first to share a public trip!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {(filter === 'featured' ? featured : trips).map(trip => (
              <div key={trip._id} className="card-hover group overflow-hidden">
                <div className="h-40 -mx-6 -mt-6 mb-5 overflow-hidden bg-wandr-blue">
                  {trip.coverImage ? <img src={trip.coverImage} alt={trip.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full bg-gradient-to-br from-wandr-mid to-wandr-blue flex items-center justify-center text-5xl">🗺️</div>}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  {trip.owner?.avatar ? <img src={trip.owner.avatar} alt="" className="w-6 h-6 rounded-full object-cover" /> : <div className="w-6 h-6 rounded-full bg-wandr-mid flex items-center justify-center text-xs text-wandr-accent font-semibold">{trip.owner?.firstName?.[0]}</div>}
                  <span className="text-xs text-wandr-muted">{trip.owner?.firstName} {trip.owner?.lastName}</span>
                  {trip.tags?.slice(0,2).map(tag => <span key={tag} className="badge-blue text-xs">{tag}</span>)}
                </div>
                <h3 className="font-display text-lg text-white font-semibold mb-1 group-hover:text-wandr-accent transition-colors">{trip.name}</h3>
                <p className="text-sm text-wandr-muted line-clamp-2 mb-4">{trip.description || trip.destinations?.map(d => d.name).join(' → ') || 'Adventure awaits!'}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-wandr-muted">
                    <span><HeartIcon className="w-3.5 h-3.5 inline mr-1" />{trip.likes?.length || 0}</span>
                    <span>{trip.views || 0} views</span>
                    {trip.duration && <span>{trip.duration}d</span>}
                  </div>
                  <button onClick={() => copyTrip(trip._id, trip.name)} className="btn-primary text-xs px-3 py-1.5">Copy Trip</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
