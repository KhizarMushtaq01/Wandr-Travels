import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { format } from 'date-fns';
import { BOOKING_TYPE_ICONS } from '../../utils/icons';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookings/all').then(r => { setBookings(r.data.bookings || []); setTotal(r.data.total || 0); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const statusColors = { pending: 'badge-blue', confirmed: 'badge-green', cancelled: 'badge-red', completed: 'text-gray-400 bg-gray-500/10 border-gray-500/20 badge' };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header"><h1 className="page-title">Bookings Management</h1><p className="page-subtitle">{total} total bookings</p></div>
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-wandr-border">
              <th className="table-header text-left">Booking</th>
              <th className="table-header text-left hidden md:table-cell">User</th>
              <th className="table-header text-left">Status</th>
              <th className="table-header text-left hidden sm:table-cell">Date</th>
              <th className="table-header text-left hidden lg:table-cell">Amount</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b._id} className="table-row">
                <td className="table-cell">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{BOOKING_TYPE_ICONS[b.type] || BOOKING_TYPE_ICONS.other}</span>
                    <div>
                      <div className="text-white font-medium text-sm">{b.name}</div>
                      <div className="text-wandr-muted text-xs capitalize">{b.type}{b.destination && ' · ' + b.destination}</div>
                    </div>
                  </div>
                </td>
                <td className="table-cell hidden md:table-cell text-wandr-muted text-sm">{b.user?.firstName} {b.user?.lastName}<br /><span className="text-xs">{b.user?.email}</span></td>
                <td className="table-cell"><span className={statusColors[b.status] + ' text-xs'}>{b.status}</span></td>
                <td className="table-cell hidden sm:table-cell text-wandr-muted text-sm">{b.checkIn ? format(new Date(b.checkIn), 'MMM d, yyyy') : '—'}</td>
                <td className="table-cell hidden lg:table-cell text-wandr-accent font-medium text-sm">{b.totalAmount ? b.currency + ' ' + b.totalAmount : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && <div className="text-center py-10 text-wandr-muted text-sm">No bookings found</div>}
      </div>
    </div>
  );
}
