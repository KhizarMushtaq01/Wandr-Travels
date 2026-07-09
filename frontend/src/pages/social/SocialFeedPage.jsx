import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { UserPlusIcon, MapIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

export default function SocialFeedPage() {
  const [feed, setFeed] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/social/feed'),
      api.get('/social/suggestions'),
    ]).then(([feedRes, sugRes]) => {
      setFeed(feedRes.data.trips || []);
      setSuggestions(sugRes.data.suggestions || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleFollow = async (userId) => {
    try {
      await api.post('/users/' + userId + '/follow');
      setSuggestions(s => s.filter(u => u._id !== userId));
    } catch (e) {}
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-wandr-accent border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Social Feed</h1>
        <p className="page-subtitle">Adventures from people you follow</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feed */}
        <div className="lg:col-span-2 space-y-5">
          {feed.length === 0 ? (
            <div className="card text-center py-16">
              <MapIcon className="w-12 h-12 mx-auto mb-4 text-wandr-muted opacity-30" />
              <h3 className="text-white font-semibold text-lg mb-2">Your feed is empty</h3>
              <p className="text-wandr-muted text-sm mb-4">Follow other travelers to see their adventures here.</p>
            </div>
          ) : (
            feed.map(trip => (
              <div key={trip._id} className="card-hover">
                <div className="flex items-center gap-3 mb-4">
                  {trip.owner?.avatar ? (
                    <img src={trip.owner.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-wandr-mid flex items-center justify-center text-wandr-accent font-semibold">
                      {trip.owner?.firstName?.[0]}
                    </div>
                  )}
                  <div>
                    <Link to={'/profile/' + trip.owner?._id} className="text-white font-medium text-sm hover:text-wandr-accent transition-colors">
                      {trip.owner?.firstName} {trip.owner?.lastName}
                    </Link>
                    <div className="text-xs text-wandr-muted">shared a trip · {format(new Date(trip.updatedAt), 'MMM d')}</div>
                  </div>
                  <span className={`ml-auto badge-${trip.status === 'active' ? 'green' : 'blue'} text-xs capitalize`}>{trip.status}</span>
                </div>
                {trip.coverImage && (
                  <div className="h-44 rounded-xl overflow-hidden mb-4 bg-wandr-blue">
                    <img src={trip.coverImage} alt={trip.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <h3 className="font-display text-lg text-white font-semibold mb-1">{trip.name}</h3>
                <p className="text-sm text-wandr-muted mb-3">{trip.destinations?.map(d => d.name).join(' → ') || trip.description || ''}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-4 text-xs text-wandr-muted">
                    <span>❤️ {trip.likes?.length || 0}</span>
                    <span>👁️ {trip.views || 0}</span>
                    {trip.duration && <span>⏱️ {trip.duration}d</span>}
                  </div>
                  <Link to={'/trips/' + trip._id} className="btn-ghost text-xs px-3 py-1.5">View Trip</Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Suggestions */}
        <div className="space-y-4">
          {suggestions.length > 0 && (
            <div className="card">
              <h3 className="font-display text-lg text-white font-semibold mb-4">Suggested Travelers</h3>
              <div className="space-y-3">
                {suggestions.map(user => (
                  <div key={user._id} className="flex items-center gap-3">
                    {user.avatar ? (
                      <img src={user.avatar} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-wandr-mid flex items-center justify-center text-wandr-accent font-semibold flex-shrink-0">
                        {user.firstName?.[0]}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <Link to={'/profile/' + user._id} className="text-white text-sm font-medium hover:text-wandr-accent transition-colors">
                        {user.firstName} {user.lastName}
                      </Link>
                      {user.location && <div className="text-xs text-wandr-muted truncate">📍 {user.location}</div>}
                    </div>
                    <button onClick={() => handleFollow(user._id)} className="flex items-center gap-1 text-xs text-wandr-accent border border-wandr-accent/30 hover:bg-wandr-accent/10 px-2.5 py-1.5 rounded-lg transition-all flex-shrink-0">
                      <UserPlusIcon className="w-3.5 h-3.5" /> Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card">
            <h3 className="font-display text-lg text-white font-semibold mb-4">Your Travel Stats</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-wandr-muted">Countries Visited</span><span className="text-white font-medium">—</span></div>
              <div className="flex justify-between"><span className="text-wandr-muted">Trips Completed</span><span className="text-white font-medium">—</span></div>
              <div className="flex justify-between"><span className="text-wandr-muted">Journal Entries</span><span className="text-white font-medium">—</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
