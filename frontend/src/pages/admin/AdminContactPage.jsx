import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { TrashIcon, EnvelopeOpenIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const statusBadge = { new: 'badge-blue', read: 'badge-gold', replied: 'badge-green' };

export default function AdminContactPage() {
  const [messages, setMessages] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [page, setPage] = useState(1);

  const fetchMessages = () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 20 });
    if (statusFilter) params.set('status', statusFilter);
    api.get('/admin/contact?' + params.toString())
      .then(r => { setMessages(r.data.messages || []); setTotal(r.data.total || 0); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchMessages(); }, [page, statusFilter]);

  const toggleExpand = async (msg) => {
    const opening = expandedId !== msg._id;
    setExpandedId(opening ? msg._id : null);
    if (opening && msg.status === 'new') {
      try {
        await api.patch('/admin/contact/' + msg._id, { status: 'read' });
        setMessages(m => m.map(x => x._id === msg._id ? { ...x, status: 'read' } : x));
      } catch (e) {}
    }
  };

  const markReplied = async (id) => {
    try {
      await api.patch('/admin/contact/' + id, { status: 'replied' });
      setMessages(m => m.map(x => x._id === id ? { ...x, status: 'replied' } : x));
      toast.success('Marked as replied');
    } catch (e) {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.delete('/admin/contact/' + id);
      setMessages(m => m.filter(x => x._id !== id));
      toast.success('Message deleted');
    } catch (e) {}
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header"><h1 className="page-title">Contact Inbox</h1><p className="page-subtitle">{total} submissions</p></div>

      <div className="flex gap-2 flex-wrap">
        {['', 'new', 'read', 'replied'].map(s => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${statusFilter === s ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-wandr-muted border border-wandr-border hover:text-white'}`}>{s || 'All'}</button>
        ))}
      </div>

      <div className="space-y-3">
        {messages.length === 0 ? (
          <div className="card text-center py-16 text-wandr-muted text-sm">No messages found</div>
        ) : messages.map(msg => (
          <div key={msg._id} className="card">
            <div className="flex items-start justify-between gap-3 cursor-pointer" onClick={() => toggleExpand(msg)}>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white font-medium text-sm">{msg.subject}</span>
                  <span className={`${statusBadge[msg.status]} text-xs capitalize`}>{msg.status}</span>
                </div>
                <div className="text-wandr-muted text-xs mt-1">{msg.name} · {msg.email}</div>
              </div>
              <span className="text-xs text-wandr-muted flex-shrink-0">{format(new Date(msg.createdAt), 'MMM d, yyyy')}</span>
            </div>
            {expandedId === msg._id && (
              <div className="mt-4 pt-4 border-t border-wandr-border">
                <p className="text-sm text-wandr-text whitespace-pre-wrap">{msg.message}</p>
                <div className="flex gap-2 mt-4">
                  <a href={`mailto:${msg.email}?subject=Re: ${msg.subject}`} className="btn-secondary text-xs px-3 py-1.5 inline-flex items-center gap-1.5"><EnvelopeOpenIcon className="w-3.5 h-3.5" /> Reply via Email</a>
                  {msg.status !== 'replied' && <button onClick={() => markReplied(msg._id)} className="btn-secondary text-xs px-3 py-1.5">Mark Replied</button>}
                  <button onClick={() => handleDelete(msg._id)} className="p-1.5 rounded-lg text-wandr-muted hover:text-red-400 hover:bg-red-500/10 transition-colors ml-auto"><TrashIcon className="w-4 h-4" /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2">
        <span className="text-sm text-wandr-muted">Showing {messages.length} of {total}</span>
        <div className="flex gap-2">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary text-sm px-3 py-1.5 disabled:opacity-40">← Prev</button>
          <span className="px-3 py-1.5 text-sm text-wandr-muted">Page {page}</span>
          <button disabled={messages.length < 20} onClick={() => setPage(p => p + 1)} className="btn-secondary text-sm px-3 py-1.5 disabled:opacity-40">Next →</button>
        </div>
      </div>
    </div>
  );
}
