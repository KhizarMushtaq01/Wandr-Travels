import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { ServerIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function AdminSettingsPage() {
  const [health, setHealth] = useState(null);
  const [broadcast, setBroadcast] = useState({ subject: '', message: '', userRole: '' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api.get('/admin/health').then(r => setHealth(r.data.health)).catch(() => {});
  }, []);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!window.confirm('Send this email to all selected users?')) return;
    setSending(true);
    try {
      const r = await api.post('/admin/broadcast', broadcast);
      toast.success(r.data.message);
      setBroadcast({ subject: '', message: '', userRole: '' });
    } catch (e) {}
    setSending(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header"><h1 className="page-title">Admin Settings</h1><p className="page-subtitle">System configuration and tools</p></div>

      {/* System Health */}
      <div className="card">
        <h3 className="font-display text-lg text-white font-semibold mb-4 flex items-center gap-2"><ServerIcon className="w-5 h-5 text-purple-400" /> System Health</h3>
        {health ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Server', value: health.server, ok: true },
              { label: 'Database', value: health.database, ok: health.database === 'connected' },
              { label: 'Uptime', value: Math.floor(health.uptime / 60) + 'm', ok: true },
              { label: 'Memory', value: Math.floor(health.memory?.heapUsed / 1024 / 1024) + 'MB', ok: true },
            ].map(({ label, value, ok }) => (
              <div key={label} className="p-4 rounded-xl bg-wandr-blue/20 border border-wandr-border text-center">
                <div className={`font-semibold text-lg ${ok ? 'text-emerald-400' : 'text-red-400'}`}>{value}</div>
                <div className="text-wandr-muted text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-wandr-muted text-sm">Loading system health...</div>
        )}
      </div>

      {/* Broadcast Email */}
      <div className="card">
        <h3 className="font-display text-lg text-white font-semibold mb-4 flex items-center gap-2"><EnvelopeIcon className="w-5 h-5 text-purple-400" /> Broadcast Email</h3>
        <p className="text-sm text-wandr-muted mb-5">Send a message to all users or a specific group.</p>
        <form onSubmit={handleBroadcast} className="space-y-4">
          <div>
            <label className="label">Target Audience</label>
            <select className="input-field" value={broadcast.userRole} onChange={e => setBroadcast({ ...broadcast, userRole: e.target.value })}>
              <option value="">All Active Users</option>
              <option value="user">Regular Users Only</option>
              <option value="admin">Admins Only</option>
            </select>
          </div>
          <div>
            <label className="label">Subject *</label>
            <input className="input-field" placeholder="Email subject line" value={broadcast.subject} onChange={e => setBroadcast({ ...broadcast, subject: e.target.value })} required />
          </div>
          <div>
            <label className="label">Message (HTML supported) *</label>
            <textarea className="input-field resize-none min-h-[120px]" placeholder="<p>Hello explorers...</p>" value={broadcast.message} onChange={e => setBroadcast({ ...broadcast, message: e.target.value })} required />
          </div>
          <div className="p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
            <p className="text-xs text-yellow-400">⚠️ This will send a real email to all matching users. Use with caution.</p>
          </div>
          <button type="submit" disabled={sending} className="btn-primary w-full py-3">
            {sending ? 'Sending...' : 'Send Broadcast Email'}
          </button>
        </form>
      </div>
    </div>
  );
}
