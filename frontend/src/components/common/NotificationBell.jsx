import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BellIcon, CheckIcon } from '@heroicons/react/24/outline';
import api from '../../utils/api';
import { formatDistanceToNow } from 'date-fns';
import { NOTIFICATION_TYPE_ICONS } from '../../utils/icons';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications || []);
      setUnread(res.data.unreadCount || 0);
    } catch (e) {}
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setUnread(0);
      setNotifications(n => n.map(x => ({ ...x, isRead: true })));
    } catch (e) {}
  };

  const typeIcon = (type) => NOTIFICATION_TYPE_ICONS[type] || NOTIFICATION_TYPE_ICONS.system;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl text-wandr-muted hover:text-white hover:bg-white/5 transition-all"
      >
        <BellIcon className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-wandr-accent text-wandr-dark text-[10px] font-bold rounded-full flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-72 sm:w-80 max-w-[calc(100vw-2rem)] bg-wandr-navy border border-wandr-border rounded-2xl shadow-2xl z-50 animate-slide-down overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-wandr-border">
            <span className="font-medium text-white text-sm">Notifications</span>
            {unread > 0 && (
              <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-wandr-accent hover:text-wandr-gold transition-colors">
                <CheckIcon className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto scrollbar-hide">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-wandr-muted text-sm">
                <BellIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
                No notifications yet
              </div>
            ) : (
              notifications.slice(0, 10).map(n => (
                <div key={n._id} className={`px-4 py-3 border-b border-wandr-border/50 hover:bg-white/3 transition-colors ${!n.isRead ? 'bg-wandr-accent/5' : ''}`}>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0">{typeIcon(n.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium line-clamp-1">{n.title}</p>
                      <p className="text-xs text-wandr-muted line-clamp-2 mt-0.5">{n.message}</p>
                      <p className="text-[11px] text-wandr-border mt-1">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    {!n.isRead && <div className="w-2 h-2 bg-wandr-accent rounded-full flex-shrink-0 mt-1.5" />}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="px-4 py-3 border-t border-wandr-border">
            <Link to="/notifications" onClick={() => setOpen(false)} className="text-xs text-wandr-accent hover:text-wandr-gold transition-colors font-medium">
              View all notifications →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
