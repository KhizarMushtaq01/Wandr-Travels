// BookingsPage
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PlusIcon, TrashIcon, CalendarIcon } from '@heroicons/react/24/outline';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const bookingTypes = ['flight', 'hotel', 'activity', 'car', 'train', 'ferry', 'tour', 'other'];
const typeIcons = { flight: '✈️', hotel: '🏨', activity: '🎯', car: '🚗', train: '🚂', ferry: '⛴️', tour: '🗺️', other: '📌' };
const statusColors = { pending: 'badge-blue', confirmed: 'badge-green', cancelled: 'badge-red', completed: 'text-gray-400 bg-gray-500/10 border-gray-500/20 badge' };

export function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ type: 'hotel', name: '', provider: '', bookingReference: '', checkIn: '', checkOut: '', totalAmount: '', currency: 'USD', status: 'pending', destination: '', notes: '' });

  const fetch = () => api.get('/bookings').then(r => { setBookings(r.data.bookings || []); setLoading(false); }).catch(() => setLoading(false));
  useEffect(() => { fetch(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/bookings', form);
      toast.success('Booking added! ✅');
      setShowAdd(false);
      fetch();
    } catch (e) {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this booking?')) return;
    await api.delete(`/bookings/${id}`);
    toast.success('Booking deleted');
    setBookings(b => b.filter(x => x._id !== id));
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter || b.type === filter);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-wandr-accent border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="page-header mb-0">
          <h1 className="page-title">Bookings</h1>
          <p className="page-subtitle">Manage all your reservations</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2 self-start">
          <PlusIcon className="w-5 h-5" /> Add Booking
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'confirmed', 'cancelled', ...bookingTypes].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${filter === f ? 'bg-wandr-accent/15 text-wandr-accent border border-wandr-accent/30' : 'text-wandr-muted border border-wandr-border hover:text-white'}`}>
            {typeIcons[f] || ''} {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <CalendarIcon className="w-14 h-14 mx-auto mb-4 text-wandr-muted opacity-30" />
          <h3 className="text-white font-semibold text-lg mb-2">No bookings yet</h3>
          <p className="text-wandr-muted text-sm mb-6">Add your first booking to keep everything organized</p>
          <button onClick={() => setShowAdd(true)} className="btn-primary inline-flex items-center gap-2"><PlusIcon className="w-4 h-4" /> Add Booking</button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(b => (
            <div key={b._id} className="card-hover flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-wandr-blue flex items-center justify-center text-2xl flex-shrink-0">{typeIcons[b.type]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-white">{b.name}</span>
                  <span className={`${statusColors[b.status]} text-xs`}>{b.status}</span>
                </div>
                <div className="flex gap-3 text-xs text-wandr-muted mt-1 flex-wrap">
                  {b.destination && <span>📍 {b.destination}</span>}
                  {b.checkIn && <span>📅 {format(new Date(b.checkIn), 'MMM d, yyyy')}</span>}
                  {b.checkOut && <span>→ {format(new Date(b.checkOut), 'MMM d, yyyy')}</span>}
                  {b.bookingReference && <span>Ref: {b.bookingReference}</span>}
                  {b.totalAmount && <span className="text-wandr-accent font-medium">{b.currency} {b.totalAmount}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link to={`/bookings/${b._id}`} className="btn-ghost text-xs px-3 py-1.5">View</Link>
                <button onClick={() => handleDelete(b._id)} className="p-2 rounded-lg text-wandr-muted hover:text-red-400 hover:bg-red-500/10 transition-all"><TrashIcon className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-xl text-white font-semibold mb-5">Add New Booking</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Type</label>
                  <select className="input-field" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    {bookingTypes.map(t => <option key={t} value={t}>{typeIcons[t]} {t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
                <div><label className="label">Status</label>
                  <select className="input-field" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    {['pending', 'confirmed', 'cancelled', 'completed'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="label">Name *</label><input className="input-field" placeholder="e.g. Aloft Bangkok Hotel" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Provider</label><input className="input-field" placeholder="Booking.com" value={form.provider} onChange={e => setForm({ ...form, provider: e.target.value })} /></div>
                <div><label className="label">Reference #</label><input className="input-field" placeholder="ABC123" value={form.bookingReference} onChange={e => setForm({ ...form, bookingReference: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Check-in / Date</label><input type="date" className="input-field" value={form.checkIn} onChange={e => setForm({ ...form, checkIn: e.target.value })} /></div>
                <div><label className="label">Check-out</label><input type="date" className="input-field" value={form.checkOut} onChange={e => setForm({ ...form, checkOut: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Total Amount</label><input type="number" className="input-field" placeholder="0.00" value={form.totalAmount} onChange={e => setForm({ ...form, totalAmount: e.target.value })} /></div>
                <div><label className="label">Currency</label>
                  <select className="input-field" value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })}>
                    {['USD', 'EUR', 'GBP', 'JPY', 'AUD'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="label">Destination</label><input className="input-field" placeholder="Bangkok, Thailand" value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} /></div>
              <div><label className="label">Notes</label><textarea className="input-field resize-none" rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAdd(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Add Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export function BookingDetailPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  useEffect(() => { api.get(`/bookings/${id}`).then(r => setBooking(r.data.booking)).catch(() => {}); }, [id]);
  if (!booking) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-wandr-accent border-t-transparent rounded-full" /></div>;
  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">{typeIcons[booking.type]} {booking.name}</h1>
      </div>
      <div className="card space-y-4">
        {[
          ['Type', booking.type],
          ['Status', booking.status],
          ['Provider', booking.provider],
          ['Reference', booking.bookingReference],
          ['Destination', booking.destination],
          ['Check-in', booking.checkIn && format(new Date(booking.checkIn), 'MMMM d, yyyy')],
          ['Check-out', booking.checkOut && format(new Date(booking.checkOut), 'MMMM d, yyyy')],
          ['Total', booking.totalAmount ? `${booking.currency} ${booking.totalAmount}` : null],
          ['Notes', booking.notes],
        ].filter(([, v]) => v).map(([label, value]) => (
          <div key={label} className="flex justify-between py-2 border-b border-wandr-border/50">
            <span className="text-wandr-muted text-sm">{label}</span>
            <span className="text-white text-sm font-medium capitalize">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookingsPage;
