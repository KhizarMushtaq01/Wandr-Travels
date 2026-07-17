import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { UsersIcon, MapIcon, CalendarIcon, CurrencyDollarIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import { FaMap, FaClipboard } from 'react-icons/fa6';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { format } from 'date-fns';

const StatCard = ({ icon: Icon, label, value, sub, color = 'text-wandr-accent', trend }) => (
  <div className="stat-card">
    <div className="flex items-start justify-between mb-4">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-wandr-accent/10 border border-wandr-accent/20">
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      {trend && <span className="flex items-center gap-1 text-xs text-emerald-400"><ArrowUpIcon className="w-3 h-3" />+{trend}</span>}
    </div>
    <div className={`font-display text-3xl font-bold ${color} mb-1`}>{value}</div>
    <div className="text-white font-medium text-sm">{label}</div>
    {sub && <div className="text-wandr-muted text-xs mt-1">{sub}</div>}
  </div>
);

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full" /></div>;
  if (!data) return null;

  const { stats, recentUsers, recentTrips, recentBookings } = data;

  const monthlyData = (stats.monthlySignups || []).map(m => ({
    name: new Date(m._id.year, m._id.month - 1).toLocaleDateString('default', { month: 'short' }),
    users: m.count
  }));

  const bookingTypeData = (stats.bookingTypeStats || []).map(b => ({ name: b._id, count: b.count }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Platform overview — {new Date().toLocaleDateString('default', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={UsersIcon} label="Total Users" value={stats.users.total} sub={`${stats.users.active} active · ${stats.users.newToday} today`} trend={stats.users.newThisMonth} />
        <StatCard icon={MapIcon} label="Total Trips" value={stats.trips.total} sub={`${stats.trips.active} active · ${stats.trips.public} public`} color="text-blue-400" />
        <StatCard icon={CalendarIcon} label="Bookings" value={stats.bookings.total} sub={`${stats.bookings.confirmed} confirmed · ${stats.bookings.pending} pending`} color="text-emerald-400" />
        <StatCard icon={CurrencyDollarIcon} label="Revenue" value={'$' + (stats.revenue.total || 0).toFixed(0)} sub="Total booking value" color="text-purple-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Signups */}
        <div className="card">
          <h3 className="font-display text-lg text-white font-semibold mb-5">Monthly Signups</h3>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3f6b" />
                <XAxis dataKey="name" tick={{ fill: '#6b8ab8', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6b8ab8', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#162444', border: '1px solid #2a3f6b', borderRadius: '8px', color: '#c8d6e8' }} />
                <Line type="monotone" dataKey="users" stroke="#e8c27a" strokeWidth={2} dot={{ fill: '#e8c27a', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <div className="h-48 flex items-center justify-center text-wandr-muted text-sm">No data yet</div>}
        </div>

        {/* Booking Types */}
        <div className="card">
          <h3 className="font-display text-lg text-white font-semibold mb-5">Bookings by Type</h3>
          {bookingTypeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={bookingTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3f6b" />
                <XAxis dataKey="name" tick={{ fill: '#6b8ab8', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6b8ab8', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#162444', border: '1px solid #2a3f6b', borderRadius: '8px', color: '#c8d6e8' }} />
                <Bar dataKey="count" fill="#e8c27a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="h-48 flex items-center justify-center text-wandr-muted text-sm">No bookings yet</div>}
        </div>
      </div>

      {/* Recent Activity Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="font-display text-lg text-white font-semibold mb-4">Recent Users</h3>
          <div className="space-y-3">
            {(recentUsers || []).map(u => (
              <div key={u._id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-wandr-mid flex items-center justify-center text-xs font-semibold text-wandr-accent flex-shrink-0">{u.firstName?.[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white font-medium truncate">{u.firstName} {u.lastName}</div>
                  <div className="text-xs text-wandr-muted truncate">{u.email}</div>
                </div>
                <span className={`badge-${u.role === 'admin' ? 'red' : 'blue'} text-xs capitalize flex-shrink-0`}>{u.role}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="font-display text-lg text-white font-semibold mb-4">Recent Trips</h3>
          <div className="space-y-3">
            {(recentTrips || []).map(t => (
              <div key={t._id} className="flex items-center gap-3">
                <FaMap className="w-4 h-4 flex-shrink-0 text-wandr-accent" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white font-medium truncate">{t.name}</div>
                  <div className="text-xs text-wandr-muted">{t.owner?.firstName} · {t.status}</div>
                </div>
                <span className={`badge-${t.isPublic ? 'green' : 'blue'} text-xs`}>{t.isPublic ? 'Public' : 'Private'}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="font-display text-lg text-white font-semibold mb-4">Recent Bookings</h3>
          <div className="space-y-3">
            {(recentBookings || []).map(b => (
              <div key={b._id} className="flex items-center gap-3">
                <FaClipboard className="w-4 h-4 flex-shrink-0 text-wandr-accent" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white font-medium truncate">{b.name}</div>
                  <div className="text-xs text-wandr-muted">{b.user?.firstName} · {b.type}</div>
                </div>
                <span className={`badge-${b.status === 'confirmed' ? 'green' : 'blue'} text-xs`}>{b.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
