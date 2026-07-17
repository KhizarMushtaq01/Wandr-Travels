import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PlusIcon, MapIcon, TrashIcon, PencilIcon, UserPlusIcon, GlobeAltIcon, HeartIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import useAuthStore from '../../context/authStore';

// ─── Trips List ───────────────────────────────────────────────────────────────
export function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/trips').then(r => { setTrips(r.data.trips || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? trips : trips.filter(t => t.status === filter);
  const statusColors = { planning: 'badge-blue', upcoming: 'badge-gold', active: 'badge-green', completed: 'text-gray-400 bg-gray-500/10 border-gray-500/20 badge', cancelled: 'badge-red' };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-wandr-accent border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="page-header mb-0">
          <h1 className="page-title">My Trips</h1>
          <p className="page-subtitle">{trips.length} trips total</p>
        </div>
        <Link to="/trips/new" className="btn-primary flex items-center gap-2 self-start">
          <PlusIcon className="w-5 h-5" /> New Trip
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'planning', 'upcoming', 'active', 'completed', 'cancelled'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filter === s ? 'bg-wandr-accent/15 text-wandr-accent border border-wandr-accent/30' : 'text-wandr-muted border border-wandr-border hover:border-wandr-accent/30 hover:text-white'}`}>
            {s} {s === 'all' ? `(${trips.length})` : `(${trips.filter(t => t.status === s).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <MapIcon className="w-14 h-14 mx-auto mb-4 text-wandr-muted opacity-30" />
          <h3 className="text-white font-semibold text-lg mb-2">No trips yet</h3>
          <p className="text-wandr-muted text-sm mb-6">Create your first trip to get started!</p>
          <Link to="/trips/new" className="btn-primary inline-flex items-center gap-2"><PlusIcon className="w-4 h-4" /> Create Trip</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(trip => (
            <Link key={trip._id} to={`/trips/${trip._id}`} className="card-hover group overflow-hidden relative">
              <div className="h-36 -mx-6 -mt-6 mb-5 overflow-hidden bg-wandr-blue">
                {trip.coverImage ? (
                  <img src={trip.coverImage} alt={trip.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-wandr-mid to-wandr-blue flex items-center justify-center text-5xl">🗺️</div>
                )}
                <div className="absolute top-3 right-3">
                  <span className={`${statusColors[trip.status] || 'badge-blue'} text-[11px]`}>{trip.status}</span>
                </div>
              </div>
              <h3 className="font-display text-lg text-white font-semibold mb-1 group-hover:text-wandr-accent transition-colors">{trip.name}</h3>
              <p className="text-sm text-wandr-muted truncate mb-3">{trip.destinations?.map(d => d.name).join(' → ') || 'No destinations yet'}</p>
              <div className="flex items-center justify-between text-xs text-wandr-muted">
                <span>{trip.startDate ? format(new Date(trip.startDate), 'MMM d, yyyy') : 'Dates TBD'}</span>
                <span>{trip.duration ? `${trip.duration}d` : ''} · {trip.collaborators?.length + 1 || 1} traveler{trip.collaborators?.length > 0 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-wandr-border/50 text-xs text-wandr-muted">
                <HeartIcon className="w-4 h-4" />{trip.likes?.length || 0}
                <GlobeAltIcon className="w-4 h-4 ml-2" />{trip.views || 0} views
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Create Trip ──────────────────────────────────────────────────────────────
export function CreateTripPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', startDate: '', endDate: '', duration: '',
    tripType: 'solo', currency: 'USD', totalBudget: '', isPublic: false,
    tags: '', status: 'planning'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [] };
      const res = await api.post('/trips', payload);
      toast.success('Trip created! 🗺️');
      navigate(`/trips/${res.data.trip._id}`);
    } catch (e) { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Plan New Trip</h1>
        <p className="page-subtitle">Set the foundation for your next adventure</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label className="label">Trip Name *</label>
          <input className="input-field" placeholder="e.g. Southeast Asia Explorer" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        </div>

        <div>
          <label className="label">Description</label>
          <textarea className="input-field min-h-[90px] resize-none" placeholder="What's this trip about?" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Start Date</label>
            <input type="date" className="input-field" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
          </div>
          <div>
            <label className="label">End Date</label>
            <input type="date" className="input-field" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Trip Type</label>
            <select className="input-field" value={form.tripType} onChange={e => setForm({ ...form, tripType: e.target.value })}>
              {['solo', 'couple', 'family', 'group', 'business'].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Currency</label>
            <select className="input-field" value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })}>
              {['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'INR'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Total Budget ({form.currency})</label>
            <input type="number" className="input-field" placeholder="0.00" value={form.totalBudget} onChange={e => setForm({ ...form, totalBudget: e.target.value })} />
          </div>
          <div>
            <label className="label">Duration (days)</label>
            <input type="number" className="input-field" placeholder="Auto-calculated" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
          </div>
        </div>

        <div>
          <label className="label">Tags (comma separated)</label>
          <input className="input-field" placeholder="beach, adventure, backpacking" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl bg-wandr-blue/20 border border-wandr-border">
          <input type="checkbox" id="isPublic" checked={form.isPublic} onChange={e => setForm({ ...form, isPublic: e.target.checked })} className="w-4 h-4 accent-wandr-accent" />
          <label htmlFor="isPublic" className="text-sm text-wandr-text cursor-pointer">
            <span className="font-medium">Make this trip public</span>
            <span className="text-wandr-muted ml-1">— share with the Wandr community</span>
          </label>
        </div>

        <div className="flex gap-4 pt-2">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? 'Creating...' : 'Create Trip 🚀'}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Trip Detail ──────────────────────────────────────────────────────────────
export function TripDetailPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    api.get(`/trips/${id}`).then(r => {
      setTrip(r.data.trip);
      setLiked(r.data.trip.likes?.some(l => l._id === user?._id || l === user?._id));
      setLoading(false);
    }).catch(() => { toast.error('Trip not found'); navigate('/trips'); });
  }, [id]);

  const handleLike = async () => {
    try { const r = await api.post(`/trips/${id}/like`); setLiked(r.data.liked); setTrip(t => ({ ...t, likes: { length: r.data.likesCount } })); } catch (e) {}
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    try { await api.post(`/trips/${id}/invite`, { email: inviteEmail, role: 'editor' }); toast.success('Invitation sent!'); setShowInvite(false); setInviteEmail(''); } catch (e) {}
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this trip?')) return;
    try { await api.delete(`/trips/${id}`); toast.success('Trip deleted'); navigate('/trips'); } catch (e) {}
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-wandr-accent border-t-transparent rounded-full" /></div>;
  if (!trip) return null;

  const isOwner = trip.owner?._id === user?._id || trip.owner === user?._id;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="relative rounded-2xl overflow-hidden">
        <div className="h-56 bg-gradient-to-br from-wandr-mid to-wandr-blue flex items-center justify-center">
          {trip.coverImage ? <img src={trip.coverImage} alt={trip.name} className="w-full h-full object-cover" /> : <span className="text-7xl">🗺️</span>}
          <div className="absolute inset-0 bg-gradient-to-t from-wandr-dark/80 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`badge-${trip.status === 'active' ? 'green' : trip.status === 'upcoming' ? 'gold' : 'blue'} text-xs`}>{trip.status}</span>
                <span className="text-xs text-white/70 capitalize">{trip.tripType}</span>
              </div>
              <h1 className="font-display text-3xl text-white font-bold">{trip.name}</h1>
              {trip.description && <p className="text-white/70 text-sm mt-1 max-w-lg">{trip.description}</p>}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={handleLike} className={`p-2.5 rounded-xl border transition-all ${liked ? 'bg-red-500/20 border-red-500/40 text-red-400' : 'bg-white/10 border-white/20 text-white hover:bg-red-500/20'}`}>
                {liked ? <HeartSolid className="w-5 h-5" /> : <HeartIcon className="w-5 h-5" />}
              </button>
              {isOwner && <>
                <button onClick={() => setShowInvite(true)} className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-wandr-accent/20 transition-all"><UserPlusIcon className="w-5 h-5" /></button>
                <Link to={`/trips/${id}/itinerary`} className="btn-primary text-sm px-4 py-2">Open Itinerary</Link>
                <button onClick={handleDelete} className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"><TrashIcon className="w-5 h-5" /></button>
              </>}
            </div>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Start Date', value: trip.startDate ? format(new Date(trip.startDate), 'MMM d, yyyy') : 'TBD', icon: '📅' },
          { label: 'Duration', value: trip.duration ? `${trip.duration} days` : 'TBD', icon: '⏱️' },
          { label: 'Budget', value: trip.totalBudget ? `${trip.currency} ${trip.totalBudget}` : 'TBD', icon: '💰' },
          { label: 'Travelers', value: (trip.collaborators?.length || 0) + 1, icon: '👥' },
        ].map(({ label, value, icon }) => (
          <div key={label} className="stat-card text-center py-4">
            <div className="text-2xl mb-1">{icon}</div>
            <div className="text-white font-semibold">{value}</div>
            <div className="text-wandr-muted text-xs mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Destinations */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl text-white font-semibold">Destinations</h2>
          {isOwner && <Link to={`/trips/${id}/itinerary`} className="btn-primary text-sm px-4 py-2">Manage Itinerary</Link>}
        </div>
        {trip.destinations?.length > 0 ? (
          <div className="space-y-3">
            {trip.destinations.map((dest, i) => (
              <div key={dest._id || i} className="flex items-center gap-4 p-4 rounded-xl bg-wandr-blue/20 border border-wandr-border hover:border-wandr-accent/30 transition-colors">
                <div className="w-8 h-8 rounded-full bg-wandr-accent/20 border border-wandr-accent/30 flex items-center justify-center text-wandr-accent font-bold text-sm flex-shrink-0">{i + 1}</div>
                <div className="flex-1">
                  <div className="font-medium text-white">{dest.name}{dest.country ? `, ${dest.country}` : ''}</div>
                  {(dest.arrivalDate || dest.nights) && (
                    <div className="text-xs text-wandr-muted mt-0.5">
                      {dest.arrivalDate && format(new Date(dest.arrivalDate), 'MMM d')}
                      {dest.nights ? ` · ${dest.nights} night${dest.nights > 1 ? 's' : ''}` : ''}
                    </div>
                  )}
                </div>
                {dest.accommodation && <div className="text-xs text-wandr-muted hidden sm:block">🏨 {dest.accommodation}</div>}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-wandr-muted">
            <p className="text-sm">No destinations added yet.</p>
            {isOwner && <Link to={`/trips/${id}/itinerary`} className="btn-primary mt-3 inline-block text-sm">Add Destinations</Link>}
          </div>
        )}
      </div>

      {/* Collaborators */}
      {trip.collaborators?.length > 0 && (
        <div className="card">
          <h2 className="font-display text-xl text-white font-semibold mb-4">Travel Companions</h2>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-wandr-blue/20 border border-wandr-accent/20">
              <div className="w-7 h-7 rounded-full bg-wandr-accent/20 flex items-center justify-center text-xs font-semibold text-wandr-accent">
                {trip.owner?.firstName?.[0]}{trip.owner?.lastName?.[0]}
              </div>
              <span className="text-sm text-white">{trip.owner?.firstName} {trip.owner?.lastName}</span>
              <span className="text-[10px] text-wandr-accent">Owner</span>
            </div>
            {trip.collaborators.map(c => (
              <div key={c._id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-wandr-blue/20 border border-wandr-border">
                <div className="w-7 h-7 rounded-full bg-wandr-mid flex items-center justify-center text-xs font-semibold text-wandr-muted">
                  {c.user?.firstName?.[0]}{c.user?.lastName?.[0]}
                </div>
                <span className="text-sm text-wandr-text">{c.user?.firstName} {c.user?.lastName}</span>
                <span className="text-[10px] text-wandr-muted capitalize">{c.role}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInvite && (
        <div className="modal-overlay" onClick={() => setShowInvite(false)}>
          <div className="modal p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-xl text-white font-semibold mb-4">Invite Travel Companion</h3>
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="label">Email Address</label>
                <input type="email" className="input-field" placeholder="friend@example.com" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} required />
              </div>
              <p className="text-xs text-wandr-muted">They'll receive an email invitation to join this trip as an editor.</p>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowInvite(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Send Invite ✉️</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TripsPage;
