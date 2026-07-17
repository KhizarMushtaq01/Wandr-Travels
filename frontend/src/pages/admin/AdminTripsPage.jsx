import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { FaMap, FaStar, FaRegStar, FaHeart, FaEye, FaGlobe } from 'react-icons/fa6';
import { format } from 'date-fns';

export default function AdminTripsPage() {
  const [trips, setTrips] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      const r = await api.get('/admin/trips?' + params.toString());
      setTrips(r.data.trips || []);
      setTotal(r.data.total || 0);
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => { fetchTrips(); }, [page, statusFilter]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchTrips(); };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this trip?')) return;
    await api.delete('/trips/' + id);
    setTrips(t => t.filter(x => x._id !== id));
    toast.success('Trip deleted');
  };

  const toggleFeatured = async (trip) => {
    try {
      const r = await api.patch('/admin/trips/' + trip._id, { isFeatured: !trip.isFeatured });
      setTrips(t => t.map(x => x._id === trip._id ? r.data.trip : x));
      toast.success(trip.isFeatured ? 'Removed from featured' : <>Marked as featured <FaStar className="inline w-4 h-4 ml-1" /></>);
    } catch (e) {}
  };

  const togglePublic = async (trip) => {
    try {
      const r = await api.patch('/admin/trips/' + trip._id, { isPublic: !trip.isPublic });
      setTrips(t => t.map(x => x._id === trip._id ? r.data.trip : x));
      toast.success(trip.isPublic ? 'Trip unpublished' : 'Trip published');
    } catch (e) {}
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Trips Management</h1>
        <p className="page-subtitle">{total} total trips</p>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-wandr-muted" />
              <input className="input-field pl-10" placeholder="Search by trip name..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button type="submit" className="btn-primary px-4">Search</button>
          </form>
          <select className="input-field sm:w-40" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">All Statuses</option>
            <option value="planning">Planning</option>
            <option value="upcoming">Upcoming</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="overflow-x-auto">
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
              {trips.map(trip => (
                <tr key={trip._id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-wandr-blue flex items-center justify-center text-sm flex-shrink-0"><FaMap className="w-4 h-4" /></div>
                      <div>
                        <div className="text-white font-medium text-sm">{trip.name}</div>
                        <div className="flex gap-1 mt-0.5">
                          {trip.isFeatured && <span className="badge-gold text-xs inline-flex items-center gap-1"><FaStar className="w-3 h-3" /> Featured</span>}
                          <span className={`badge-${trip.isPublic ? 'green' : 'blue'} text-xs`}>{trip.isPublic ? 'Public' : 'Private'}</span>
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
                      <button onClick={() => togglePublic(trip)} className={`p-1.5 rounded-lg transition-colors text-xs ${trip.isPublic ? 'text-emerald-400 bg-emerald-400/10' : 'text-wandr-muted hover:text-emerald-400 hover:bg-emerald-400/10'}`} title={trip.isPublic ? 'Unpublish' : 'Publish'}><FaGlobe className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(trip._id)} className="p-1.5 rounded-lg text-wandr-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"><TrashIcon className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {trips.length === 0 && <div className="text-center py-10 text-wandr-muted text-sm">No trips found</div>}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-wandr-border">
          <span className="text-sm text-wandr-muted">Showing {trips.length} of {total}</span>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary text-sm px-3 py-1.5 disabled:opacity-40">← Prev</button>
            <span className="px-3 py-1.5 text-sm text-wandr-muted">Page {page}</span>
            <button disabled={trips.length < 20} onClick={() => setPage(p => p + 1)} className="btn-secondary text-sm px-3 py-1.5 disabled:opacity-40">Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
