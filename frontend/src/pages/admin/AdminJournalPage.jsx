import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { TrashIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { JOURNAL_MOOD_ICONS } from '../../utils/icons';

export default function AdminJournalPage() {
  const [entries, setEntries] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchEntries = () => {
    setLoading(true);
    api.get('/admin/journal?page=' + page + '&limit=20')
      .then(r => { setEntries(r.data.entries || []); setTotal(r.data.total || 0); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchEntries(); }, [page]);

  const handleRemove = async (id) => {
    if (!window.confirm('Remove this journal entry?')) return;
    try {
      await api.delete('/admin/journal/' + id);
      setEntries(e => e.filter(x => x._id !== id));
      toast.success('Entry removed');
    } catch (e) {}
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header"><h1 className="page-title">Journal Moderation</h1><p className="page-subtitle">{total} public journal entries</p></div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-wandr-border">
                <th className="table-header text-left">Entry</th>
                <th className="table-header text-left hidden md:table-cell">Author</th>
                <th className="table-header text-left hidden sm:table-cell">Date</th>
                <th className="table-header text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(entry => (
                <tr key={entry._id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <span className="flex-shrink-0">{JOURNAL_MOOD_ICONS[entry.mood] || JOURNAL_MOOD_ICONS.happy}</span>
                      <div className="min-w-0">
                        <div className="text-white font-medium text-sm truncate">{entry.title}</div>
                        <div className="text-wandr-muted text-xs truncate max-w-xs">{entry.content}</div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell hidden md:table-cell text-wandr-muted text-sm">{entry.user?.firstName} {entry.user?.lastName}</td>
                  <td className="table-cell hidden sm:table-cell text-wandr-muted text-sm">{format(new Date(entry.date), 'MMM d, yyyy')}</td>
                  <td className="table-cell text-right">
                    <button onClick={() => handleRemove(entry._id)} className="p-1.5 rounded-lg text-wandr-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"><TrashIcon className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {entries.length === 0 && <div className="text-center py-10 text-wandr-muted text-sm">No public journal entries</div>}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-wandr-border">
          <span className="text-sm text-wandr-muted">Showing {entries.length} of {total}</span>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary text-sm px-3 py-1.5 disabled:opacity-40">← Prev</button>
            <span className="px-3 py-1.5 text-sm text-wandr-muted">Page {page}</span>
            <button disabled={entries.length < 20} onClick={() => setPage(p => p + 1)} className="btn-secondary text-sm px-3 py-1.5 disabled:opacity-40">Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
