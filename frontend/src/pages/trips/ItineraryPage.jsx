import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlusIcon, TrashIcon, CheckIcon, MapPinIcon } from '@heroicons/react/24/outline';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { ITINERARY_CATEGORY_ICONS } from '../../utils/icons';
import { FaMoon, FaHotel, FaCalendarDays, FaClock } from 'react-icons/fa6';

export default function ItineraryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDestIdx, setActiveDestIdx] = useState(0);
  const [showAddDest, setShowAddDest] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [newDest, setNewDest] = useState({ name: '', country: '', nights: 1, arrivalDate: '', accommodation: '', notes: '' });
  const [newActivity, setNewActivity] = useState({ name: '', time: '', duration: '', cost: 0, category: 'sightseeing', notes: '' });

  const fetchTrip = () => api.get(`/trips/${id}`).then(r => { setTrip(r.data.trip); setLoading(false); }).catch(() => navigate('/trips'));

  useEffect(() => { fetchTrip(); }, [id]);

  const addDestination = async (e) => {
    e.preventDefault();
    try {
      const updated = { destinations: [...(trip.destinations || []), newDest] };
      const r = await api.put(`/trips/${id}`, updated);
      setTrip(r.data.trip);
      setShowAddDest(false);
      setNewDest({ name: '', country: '', nights: 1, arrivalDate: '', accommodation: '', notes: '' });
      toast.success('Destination added!');
    } catch (e) {}
  };

  const removeDestination = async (destId) => {
    if (!window.confirm('Remove this destination?')) return;
    try {
      const updated = { destinations: trip.destinations.filter(d => d._id !== destId) };
      const r = await api.put(`/trips/${id}`, updated);
      setTrip(r.data.trip);
      setActiveDestIdx(0);
      toast.success('Destination removed');
    } catch (e) {}
  };

  const addActivity = async (e) => {
    e.preventDefault();
    const dest = trip.destinations[activeDestIdx];
    if (!dest) return;
    try {
      const r = await api.post(`/itineraries/${id}/destinations/${dest._id}/activities`, newActivity);
      setTrip(r.data.trip);
      setShowAddActivity(false);
      setNewActivity({ name: '', time: '', duration: '', cost: 0, category: 'sightseeing', notes: '' });
      toast.success('Activity added!');
    } catch (e) {}
  };

  const toggleActivity = async (destId, actId) => {
    const dest = trip.destinations.find(d => d._id === destId);
    const act = dest?.activities.find(a => a._id === actId);
    if (!act) return;
    try {
      const r = await api.put(`/itineraries/${id}/destinations/${destId}/activities/${actId}`, { completed: !act.completed });
      setTrip(r.data.trip);
    } catch (e) {}
  };

  const removeActivity = async (destId, actId) => {
    try {
      const r = await api.delete(`/itineraries/${id}/destinations/${destId}/activities/${actId}`);
      setTrip(r.data.trip);
      toast.success('Activity removed');
    } catch (e) {}
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-wandr-accent border-t-transparent rounded-full" /></div>;

  const activeDest = trip.destinations?.[activeDestIdx];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">{trip.name}</h1>
          <p className="page-subtitle">Day-by-Day Itinerary Builder</p>
        </div>
        <button onClick={() => setShowAddDest(true)} className="btn-primary flex items-center gap-2">
          <PlusIcon className="w-4 h-4" /> Add Destination
        </button>
      </div>

      {trip.destinations?.length === 0 ? (
        <div className="card text-center py-16">
          <MapPinIcon className="w-12 h-12 mx-auto mb-4 text-wandr-muted opacity-30" />
          <h3 className="text-white font-semibold text-lg mb-2">No destinations yet</h3>
          <p className="text-wandr-muted text-sm mb-6">Add your first destination to start building your itinerary</p>
          <button onClick={() => setShowAddDest(true)} className="btn-primary inline-flex items-center gap-2"><PlusIcon className="w-4 h-4" /> Add First Destination</button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Destination Tabs */}
          <div className="lg:w-56 flex-shrink-0">
            <div className="card p-3 space-y-1">
              <div className="text-xs text-wandr-muted uppercase tracking-widest px-2 mb-2">Destinations</div>
              {trip.destinations.map((dest, i) => (
                <button key={dest._id} onClick={() => setActiveDestIdx(i)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all group flex items-center justify-between ${i === activeDestIdx ? 'bg-wandr-accent/15 text-wandr-accent border border-wandr-accent/20' : 'text-wandr-muted hover:text-white hover:bg-white/5'}`}>
                  <div>
                    <div className="font-medium">{dest.name}</div>
                    {dest.nights && <div className="text-xs opacity-70">{dest.nights} night{dest.nights > 1 ? 's' : ''}</div>}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); removeDestination(dest._id); }} className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all">
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                </button>
              ))}
            </div>
          </div>

          {/* Activities Panel */}
          <div className="flex-1 card">
            {activeDest && (
              <>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="font-display text-2xl text-white font-semibold">{activeDest.name}</h2>
                    {activeDest.country && <p className="text-wandr-muted text-sm">{activeDest.country}</p>}
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-wandr-muted">
                      {activeDest.nights && <span className="inline-flex items-center gap-1"><FaMoon className="w-3 h-3" /> {activeDest.nights} night{activeDest.nights > 1 ? 's' : ''}</span>}
                      {activeDest.accommodation && <span className="inline-flex items-center gap-1"><FaHotel className="w-3 h-3" /> {activeDest.accommodation}</span>}
                      {activeDest.arrivalDate && <span className="inline-flex items-center gap-1"><FaCalendarDays className="w-3 h-3" /> Arrives {new Date(activeDest.arrivalDate).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <button onClick={() => setShowAddActivity(true)} className="btn-primary text-sm px-4 py-2 flex items-center gap-2">
                    <PlusIcon className="w-4 h-4" /> Add Activity
                  </button>
                </div>

                {activeDest.activities?.length === 0 ? (
                  <div className="text-center py-10 text-wandr-muted">
                    <p className="text-sm">No activities yet for {activeDest.name}.</p>
                    <button onClick={() => setShowAddActivity(true)} className="btn-secondary mt-4 text-sm">Add First Activity</button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeDest.activities.map(act => (
                      <div key={act._id} className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${act.completed ? 'border-emerald-500/20 bg-emerald-500/5 opacity-70' : 'border-wandr-border bg-wandr-blue/20 hover:border-wandr-accent/30'}`}>
                        <button onClick={() => toggleActivity(activeDest._id, act._id)} className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center mt-0.5 transition-all ${act.completed ? 'bg-emerald-500 border-emerald-500' : 'border-wandr-border hover:border-wandr-accent'}`}>
                          {act.completed && <CheckIcon className="w-3.5 h-3.5 text-white" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm">{ITINERARY_CATEGORY_ICONS[act.category]}</span>
                            <span className={`font-medium text-sm ${act.completed ? 'line-through text-wandr-muted' : 'text-white'}`}>{act.name}</span>
                            {act.time && <span className="text-xs text-wandr-muted inline-flex items-center gap-1"><FaClock className="w-3 h-3" /> {act.time}</span>}
                            {act.duration && <span className="text-xs text-wandr-muted">({act.duration})</span>}
                            {act.cost > 0 && <span className="text-xs text-wandr-accent">${act.cost}</span>}
                          </div>
                          {act.notes && <p className="text-xs text-wandr-muted mt-1">{act.notes}</p>}
                        </div>
                        <button onClick={() => removeActivity(activeDest._id, act._id)} className="p-1.5 text-wandr-muted hover:text-red-400 transition-colors flex-shrink-0">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Add Destination Modal */}
      {showAddDest && (
        <div className="modal-overlay" onClick={() => setShowAddDest(false)}>
          <div className="modal p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-xl text-white font-semibold mb-5">Add Destination</h3>
            <form onSubmit={addDestination} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="label">City / Place *</label><input className="input-field" placeholder="Bali" value={newDest.name} onChange={e => setNewDest({ ...newDest, name: e.target.value })} required /></div>
                <div><label className="label">Country</label><input className="input-field" placeholder="Indonesia" value={newDest.country} onChange={e => setNewDest({ ...newDest, country: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="label">Arrival Date</label><input type="date" className="input-field" value={newDest.arrivalDate} onChange={e => setNewDest({ ...newDest, arrivalDate: e.target.value })} /></div>
                <div><label className="label">Nights</label><input type="number" min="1" className="input-field" value={newDest.nights} onChange={e => setNewDest({ ...newDest, nights: Number(e.target.value) })} /></div>
              </div>
              <div><label className="label">Accommodation</label><input className="input-field" placeholder="Hotel name or Airbnb" value={newDest.accommodation} onChange={e => setNewDest({ ...newDest, accommodation: e.target.value })} /></div>
              <div><label className="label">Notes</label><textarea className="input-field resize-none" rows={2} value={newDest.notes} onChange={e => setNewDest({ ...newDest, notes: e.target.value })} /></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddDest(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Add Destination</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Activity Modal */}
      {showAddActivity && (
        <div className="modal-overlay" onClick={() => setShowAddActivity(false)}>
          <div className="modal p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-xl text-white font-semibold mb-5">Add Activity — {activeDest?.name}</h3>
            <form onSubmit={addActivity} className="space-y-4">
              <div><label className="label">Activity Name *</label><input className="input-field" placeholder="Visit Temple" value={newActivity.name} onChange={e => setNewActivity({ ...newActivity, name: e.target.value })} required /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="label">Category</label>
                  <select className="input-field" value={newActivity.category} onChange={e => setNewActivity({ ...newActivity, category: e.target.value })}>
                    {Object.keys(ITINERARY_CATEGORY_ICONS).map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
                <div><label className="label">Time</label><input className="input-field" placeholder="9:00 AM" value={newActivity.time} onChange={e => setNewActivity({ ...newActivity, time: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="label">Duration</label><input className="input-field" placeholder="2 hours" value={newActivity.duration} onChange={e => setNewActivity({ ...newActivity, duration: e.target.value })} /></div>
                <div><label className="label">Cost ($)</label><input type="number" min="0" className="input-field" value={newActivity.cost} onChange={e => setNewActivity({ ...newActivity, cost: Number(e.target.value) })} /></div>
              </div>
              <div><label className="label">Notes</label><textarea className="input-field resize-none" rows={2} value={newActivity.notes} onChange={e => setNewActivity({ ...newActivity, notes: e.target.value })} /></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddActivity(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Add Activity</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
