import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { CheckIcon, TrashIcon, BellIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { NOTIFICATION_TYPE_ICONS } from '../../utils/icons';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = () => api.get('/notifications').then(r => { setNotifications(r.data.notifications || []); setLoading(false); }).catch(() => setLoading(false));
  useEffect(() => { fetchNotifications(); }, []);

  const markAllRead = async () => {
    await api.patch('/notifications/read-all');
    setNotifications(n => n.map(x => ({ ...x, isRead: true })));
    toast.success('All marked as read');
  };

  const markRead = async (id) => {
    await api.patch('/notifications/' + id + '/read');
    setNotifications(n => n.map(x => x._id === id ? { ...x, isRead: true } : x));
  };

  const deleteNotification = async (id) => {
    await api.delete('/notifications/' + id);
    setNotifications(n => n.filter(x => x._id !== id));
  };

  const unread = notifications.filter(n => !n.isRead).length;

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-wandr-accent border-t-transparent rounded-full" /></div>;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Notifications</h1>
          {unread > 0 && <p className="page-subtitle">{unread} unread</p>}
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="btn-secondary text-sm flex items-center gap-2">
            <CheckIcon className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="card text-center py-16">
          <BellIcon className="w-14 h-14 mx-auto mb-4 text-wandr-muted opacity-30" />
          <h3 className="text-white font-semibold text-lg mb-2">All caught up!</h3>
          <p className="text-wandr-muted text-sm">No notifications yet. Start planning trips and interacting with the community!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => (
            <div key={n._id} className={`flex gap-4 p-4 rounded-2xl border transition-all ${!n.isRead ? 'border-wandr-accent/20 bg-wandr-accent/5' : 'border-wandr-border bg-wandr-card hover:border-wandr-border'}`}
              onClick={() => !n.isRead && markRead(n._id)}>
              <span className="flex-shrink-0 mt-0.5">{NOTIFICATION_TYPE_ICONS[n.type] || NOTIFICATION_TYPE_ICONS.system}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-white font-medium text-sm">{n.title}</p>
                    <p className="text-wandr-muted text-sm mt-0.5">{n.message}</p>
                    <p className="text-wandr-muted text-xs mt-1.5">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!n.isRead && <div className="w-2 h-2 bg-wandr-accent rounded-full" />}
                    <button onClick={(e) => { e.stopPropagation(); deleteNotification(n._id); }} className="p-1.5 text-wandr-muted hover:text-red-400 transition-colors">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
