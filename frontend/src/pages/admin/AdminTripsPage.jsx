import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { TrashIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { FaMap, FaStar, FaRegStar, FaHeart, FaEye } from 'react-icons/fa6';
import { format } from 'date-fns';

export default function AdminTripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/trips/public?limit=50').then(r => { setTrips(r.data.trips || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this trip?')) return;
    await api.delete('/trips/' + id);
    setTrips(t => t.filter(x => x._id !== id));
    toast.success('Trip deleted');
  };

  const toggleFeatured = async (trip) => {
    try {
      await api.put('/trips/' + trip._id, { isFeatured: !trip.isFeatured });
      setTrips(t => t.map(x => x._id === trip._id ? { ...x, isFeatured: !x.isFeatured } : x));
      toast.success(trip.isFeatured ? 'Removed from featured' : <>Marked as featured <FaStar className="inline w-4 h-4 ml-1" /></>);
    } catch (e) {}
  };

  const filtered = filter === 'all' ? trips : trips.filter(t => t.status === filter || (filter === 'featured' && t.isFeatured));

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Trips Management</h1>
        <p className="page-subtitle">{trips.length} public trips</p>
      </div>

      <div className="flex gap-2 flex-wrap mb-4">
        {['all', 'planning', 'active', 'completed', 'featured'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${filter === f ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-wandr-muted border border-wandr-border hover:text-white'}`}>{f}</button>
        ))}
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-wandr-border">
              <th className="table-header text-left">Trip</th>
              <th className="table-header text-left hidden md:table-cell">Owner</th>
              <th className="table-header text-left hidden sm:table-cell">Destinations</th>
              <th className="table-header text-left">Status</th>
              <th className="table-header text-left hidden lg:table-cell">Created</th>
              <th className="table-header text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(trip => (
              <tr key={trip._id} className="table-row">
                <td className="table-cell">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-wandr-blue flex items-center justify-center text-sm flex-shrink-0"><FaMap className="w-4 h-4" /></div>
                    <div>
                      <div className="text-white font-medium text-sm">{trip.name}</div>
                      <div className="flex gap-1 mt-0.5">
                        {trip.isFeatured && <span className="badge-gold text-xs inline-flex items-center gap-1"><FaStar className="w-3 h-3" /> Featured</span>}
                        <span className="text-xs text-wandr-muted inline-flex items-center gap-2">
                          <span className="inline-flex items-center gap-1"><FaHeart className="w-3 h-3" />{trip.likes?.length || 0}</span>
                          <span className="inline-flex items-center gap-1"><FaEye className="w-3 h-3" />{trip.views || 0}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="table-cell hidden md:table-cell text-wandr-muted text-sm">{trip.owner?.firstName} {trip.owner?.lastName}</td>
                <td className="table-cell hidden sm:table-cell text-wandr-muted text-sm truncate max-w-xs">{trip.destinations?.map(d => d.name).join(', ') || '—'}</td>
                <td className="table-cell">
                  <span className={`badge-${trip.status === 'active' ? 'green' : 'blue'} text-xs capitalize`}>{trip.status}</span>
                </td>
                <td className="table-cell hidden lg:table-cell text-wandr-muted text-sm">{format(new Date(trip.createdAt), 'MMM d, yyyy')}</td>
                <td className="table-cell text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => toggleFeatured(trip)} className={`p-1.5 rounded-lg transition-colors text-xs ${trip.isFeatured ? 'text-yellow-400 bg-yellow-400/10' : 'text-wandr-muted hover:text-yellow-400 hover:bg-yellow-400/10'}`} title="Toggle Featured">{trip.isFeatured ? <FaStar className="w-4 h-4" /> : <FaRegStar className="w-4 h-4" />}</button>
                    <button onClick={() => handleDelete(trip._id)} className="p-1.5 rounded-lg text-wandr-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"><TrashIcon className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-10 text-wandr-muted text-sm">No trips found</div>}
      </div>
    </div>
  );
}
