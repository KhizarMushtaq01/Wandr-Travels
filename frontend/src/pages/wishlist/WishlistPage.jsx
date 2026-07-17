import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { FaMap } from 'react-icons/fa6';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import useAuthStore from '../../context/authStore';

export default function WishlistPage() {
  const { user, setUser } = useAuthStore();
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/destinations/popular').then(r => { setPopular(r.data.destinations || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const saved = user?.savedDestinations || [];

  const remove = async (name) => {
    try {
      const res = await api.post('/users/me/wishlist', { destination: name });
      setUser({ ...user, savedDestinations: res.data.savedDestinations });
      toast.success('Removed from wishlist');
    } catch (e) {}
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-wandr-accent border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Wishlist</h1>
        <p className="page-subtitle">Destinations you've saved for later</p>
      </div>

      {saved.length === 0 ? (
        <div className="card text-center py-16">
          <HeartIcon className="w-12 h-12 mx-auto mb-3 text-wandr-muted opacity-30" />
          <p className="text-wandr-muted text-sm mb-4">No saved destinations yet — browse Discover to save some.</p>
          <Link to="/discover" className="btn-primary inline-flex items-center gap-2">Browse Discover</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {saved.map(name => {
            const match = popular.find(d => d.name === name);
            return (
              <div key={name} className="card-hover group relative overflow-hidden text-center">
                <button onClick={() => remove(name)} className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-wandr-dark/70 hover:bg-wandr-dark transition-colors" aria-label="Remove from wishlist">
                  <HeartSolid className="w-4 h-4 text-red-400" />
                </button>
                {match?.image ? (
                  <div className="h-24 -mx-6 -mt-6 mb-3 overflow-hidden bg-wandr-blue">
                    <img src={match.image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ) : (
                  <div className="h-24 -mx-6 -mt-6 mb-3 bg-gradient-to-br from-wandr-mid to-wandr-blue flex items-center justify-center"><FaMap className="w-8 h-8 text-wandr-accent" /></div>
                )}
                <div className="text-white font-medium text-sm truncate">{name}</div>
                {match?.country && <div className="text-wandr-muted text-xs truncate">{match.country}</div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
