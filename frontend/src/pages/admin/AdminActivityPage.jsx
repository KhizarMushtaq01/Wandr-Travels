import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { formatDistanceToNow } from 'date-fns';
import { FaClockRotateLeft, FaUserShield } from 'react-icons/fa6';

const ACTION_LABELS = {
  activate_user: 'Activated user',
  deactivate_user: 'Deactivated user',
  change_role: 'Changed role',
  feature_trip: 'Featured trip',
  unfeature_trip: 'Unfeatured trip',
  publish_trip: 'Published trip',
  unpublish_trip: 'Unpublished trip',
  delete_trip: 'Deleted trip',
  delete_journal: 'Deleted journal entry',
  send_broadcast: 'Sent broadcast email',
};

export default function AdminActivityPage() {
  const [view, setView] = useState('logins');
  const [activity, setActivity] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (view === 'logins') {
      api.get('/admin/activity').then(r => { setActivity(r.data.activity || []); setLoading(false); }).catch(() => setLoading(false));
    } else {
      api.get('/admin/audit-log').then(r => { setAuditLogs(r.data.logs || []); setLoading(false); }).catch(() => setLoading(false));
    }
  }, [view]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header"><h1 className="page-title">Activity Log</h1><p className="page-subtitle">User sign-ins and admin actions</p></div>

      <div className="flex gap-2">
        <button onClick={() => setView('logins')} className={`px-4 py-2 rounded-xl text-sm font-medium inline-flex items-center gap-2 transition-all ${view === 'logins' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-wandr-muted border border-wandr-border hover:text-white'}`}><FaClockRotateLeft className="w-4 h-4" /> User Logins</button>
        <button onClick={() => setView('admin')} className={`px-4 py-2 rounded-xl text-sm font-medium inline-flex items-center gap-2 transition-all ${view === 'admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-wandr-muted border border-wandr-border hover:text-white'}`}><FaUserShield className="w-4 h-4" /> Admin Actions</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full" /></div>
      ) : view === 'logins' ? (
        <div className="card space-y-3">
          {activity.length === 0 ? (
            <div className="text-center py-10 text-wandr-muted text-sm">No activity logged yet.</div>
          ) : activity.map(user => (
            <div key={user._id} className="p-4 rounded-xl bg-wandr-blue/20 border border-wandr-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-wandr-mid flex items-center justify-center text-xs font-semibold text-wandr-accent">{user.firstName?.[0]}</div>
                <div>
                  <span className="text-white font-medium text-sm">{user.firstName} {user.lastName}</span>
                  <span className="text-wandr-muted text-xs ml-2">{user.email}</span>
                </div>
                {user.lastLogin && <span className="ml-auto text-xs text-wandr-muted">{formatDistanceToNow(new Date(user.lastLogin), { addSuffix: true })}</span>}
              </div>
              <div className="space-y-1.5 pl-11">
                {(user.loginHistory || []).slice(0, 3).map((log, i) => (
                  <div key={i} className="text-xs text-wandr-muted flex gap-4 flex-wrap">
                    <span className="text-wandr-text">{new Date(log.timestamp).toLocaleString()}</span>
                    <span>{log.ip}</span>
                    <span className="truncate hidden md:block">{log.device?.substring(0, 50)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card space-y-3">
          {auditLogs.length === 0 ? (
            <div className="text-center py-10 text-wandr-muted text-sm">No admin actions logged yet.</div>
          ) : auditLogs.map(log => (
            <div key={log._id} className="flex items-center gap-3 p-3 rounded-xl bg-wandr-blue/20 border border-wandr-border">
              <div className="w-8 h-8 rounded-full bg-wandr-mid flex items-center justify-center text-xs font-semibold text-wandr-accent flex-shrink-0">{log.admin?.firstName?.[0]}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white font-medium truncate">{log.admin?.firstName} {log.admin?.lastName} — {ACTION_LABELS[log.action] || log.action}</div>
                {log.details && <div className="text-xs text-wandr-muted truncate">{log.details}</div>}
              </div>
              <span className="text-xs text-wandr-muted flex-shrink-0">{formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
