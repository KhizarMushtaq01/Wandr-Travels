import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { FaDownload } from 'react-icons/fa6';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function toCsv(rows, columns) {
  const header = columns.map(c => c.label).join(',');
  const lines = rows.map(row => columns.map(c => {
    const value = c.value(row);
    const str = value === null || value === undefined ? '' : String(value);
    return '"' + str.replace(/"/g, '""') + '"';
  }).join(','));
  return [header, ...lines].join('\n');
}

function downloadCsv(filename, csv) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function AdminReportsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState('');

  useEffect(() => {
    api.get('/admin/stats').then(r => { setStats(r.data.stats); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const revenueData = (stats?.monthlyRevenue || []).map(m => ({
    name: new Date(m._id.year, m._id.month - 1).toLocaleDateString('default', { month: 'short' }),
    total: m.total
  }));

  const exportUsers = async () => {
    setExporting('users');
    try {
      const r = await api.get('/users?limit=1000');
      const csv = toCsv(r.data.users || [], [
        { label: 'First Name', value: u => u.firstName },
        { label: 'Last Name', value: u => u.lastName },
        { label: 'Email', value: u => u.email },
        { label: 'Role', value: u => u.role },
        { label: 'Active', value: u => u.isActive },
        { label: 'Plan', value: u => u.subscriptionPlan },
        { label: 'Joined', value: u => u.createdAt },
      ]);
      downloadCsv('users.csv', csv);
    } catch (e) { toast.error('Export failed'); }
    setExporting('');
  };

  const exportTrips = async () => {
    setExporting('trips');
    try {
      const r = await api.get('/admin/trips?limit=1000');
      const csv = toCsv(r.data.trips || [], [
        { label: 'Name', value: t => t.name },
        { label: 'Owner', value: t => `${t.owner?.firstName || ''} ${t.owner?.lastName || ''}`.trim() },
        { label: 'Status', value: t => t.status },
        { label: 'Public', value: t => t.isPublic },
        { label: 'Featured', value: t => t.isFeatured },
        { label: 'Likes', value: t => t.likes?.length || 0 },
        { label: 'Views', value: t => t.views || 0 },
        { label: 'Created', value: t => t.createdAt },
      ]);
      downloadCsv('trips.csv', csv);
    } catch (e) { toast.error('Export failed'); }
    setExporting('');
  };

  const exportBookings = async () => {
    setExporting('bookings');
    try {
      const r = await api.get('/bookings/all?limit=1000');
      const csv = toCsv(r.data.bookings || [], [
        { label: 'Name', value: b => b.name },
        { label: 'Type', value: b => b.type },
        { label: 'Status', value: b => b.status },
        { label: 'User', value: b => `${b.user?.firstName || ''} ${b.user?.lastName || ''}`.trim() },
        { label: 'Amount', value: b => b.totalAmount },
        { label: 'Currency', value: b => b.currency },
        { label: 'Created', value: b => b.createdAt },
      ]);
      downloadCsv('bookings.csv', csv);
    } catch (e) { toast.error('Export failed'); }
    setExporting('');
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header"><h1 className="page-title">Reports & Export</h1><p className="page-subtitle">Revenue trends and data export</p></div>

      <div className="card">
        <h3 className="font-display text-lg text-white font-semibold mb-5">Monthly Revenue</h3>
        {revenueData.some(d => d.total > 0) ? (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3f6b" />
              <XAxis dataKey="name" tick={{ fill: '#6b8ab8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#6b8ab8', fontSize: 12 }} />
              <Tooltip formatter={(v) => '$' + Number(v).toFixed(2)} contentStyle={{ background: '#162444', border: '1px solid #2a3f6b', borderRadius: '8px', color: '#c8d6e8' }} />
              <Bar dataKey="total" fill="#e8c27a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <div className="h-48 flex items-center justify-center text-wandr-muted text-sm">No confirmed booking revenue yet</div>}
      </div>

      <div className="card">
        <h3 className="font-display text-lg text-white font-semibold mb-5">Export Data</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button onClick={exportUsers} disabled={exporting === 'users'} className="btn-secondary flex items-center justify-center gap-2 py-3">
            <FaDownload className="w-4 h-4" /> {exporting === 'users' ? 'Exporting...' : 'Users CSV'}
          </button>
          <button onClick={exportTrips} disabled={exporting === 'trips'} className="btn-secondary flex items-center justify-center gap-2 py-3">
            <FaDownload className="w-4 h-4" /> {exporting === 'trips' ? 'Exporting...' : 'Trips CSV'}
          </button>
          <button onClick={exportBookings} disabled={exporting === 'bookings'} className="btn-secondary flex items-center justify-center gap-2 py-3">
            <FaDownload className="w-4 h-4" /> {exporting === 'bookings' ? 'Exporting...' : 'Bookings CSV'}
          </button>
        </div>
      </div>
    </div>
  );
}
