import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { formatDistanceToNow } from 'date-fns';

export default function AdminActivityPage() {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/activity').then(r => { setActivity(r.data.activity || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header"><h1 className="page-title">Activity Log</h1><p className="page-subtitle">Recent user sign-in activity</p></div>
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
    </div>
  );
}
