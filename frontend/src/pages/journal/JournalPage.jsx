import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { PlusIcon, TrashIcon, BookOpenIcon, HeartIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const moods = { amazing: '🤩', happy: '😊', neutral: '😐', tired: '😴', challenging: '😤' };

export default function JournalPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', location: '', mood: 'happy', isPublic: false, date: new Date().toISOString().split('T')[0] });

  const fetchEntries = () => api.get('/journal').then(r => { setEntries(r.data.entries || []); setLoading(false); }).catch(() => setLoading(false));
  useEffect(() => { fetchEntries(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try { await api.post('/journal', form); toast.success('Journal entry saved!'); setShowAdd(false); setForm({ title: '', content: '', location: '', mood: 'happy', isPublic: false, date: new Date().toISOString().split('T')[0] }); fetchEntries(); } catch (e) {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete entry?')) return;
    await api.delete('/journal/' + id);
    toast.success('Entry deleted');
    setEntries(e => e.filter(x => x._id !== id));
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-wandr-accent border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="page-header mb-0"><h1 className="page-title">Travel Journal</h1><p className="page-subtitle">Document your adventures</p></div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2"><PlusIcon className="w-5 h-5" /> New Entry</button>
      </div>
      {entries.length === 0 ? (
        <div className="card text-center py-16">
          <BookOpenIcon className="w-14 h-14 mx-auto mb-4 text-wandr-muted opacity-30" />
          <h3 className="text-white font-semibold text-lg mb-2">No journal entries yet</h3>
          <button onClick={() => setShowAdd(true)} className="btn-primary mt-2 inline-flex items-center gap-2"><PlusIcon className="w-4 h-4" /> Write First Entry</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {entries.map(entry => (
            <div key={entry._id} className="card-hover group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{moods[entry.mood]}</span>
                  {entry.isPublic && <span className="badge-blue text-xs">Public</span>}
                </div>
                <div className="flex gap-1">
                  <Link to={'/journal/' + entry._id} className="btn-ghost text-xs px-2 py-1">View</Link>
                  <button onClick={() => handleDelete(entry._id)} className="p-1.5 text-wandr-muted hover:text-red-400 transition-colors"><TrashIcon className="w-4 h-4" /></button>
                </div>
              </div>
              <h3 className="font-display text-lg text-white font-semibold mb-2 group-hover:text-wandr-accent transition-colors">{entry.title}</h3>
              <p className="text-sm text-wandr-muted line-clamp-3 mb-4">{entry.content}</p>
              <div className="flex items-center justify-between text-xs text-wandr-muted">
                <div>{entry.location && <span>📍 {entry.location} · </span>}{format(new Date(entry.date), 'MMM d, yyyy')}</div>
                <span><HeartIcon className="w-3.5 h-3.5 inline mr-1" />{entry.likes?.length || 0}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-content p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-xl text-white font-semibold mb-5">New Journal Entry</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div><label className="label">Title *</label><input className="input-field" placeholder="A Perfect Day in Kyoto" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
              <div><label className="label">Story *</label><textarea className="input-field resize-none min-h-[120px]" placeholder="Write about your experience..." value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Location</label><input className="input-field" placeholder="Kyoto, Japan" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /></div>
                <div><label className="label">Date</label><input type="date" className="input-field" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
              </div>
              <div>
                <label className="label">Mood</label>
                <div className="flex gap-2">
                  {Object.entries(moods).map(([mood, emoji]) => (
                    <button key={mood} type="button" onClick={() => setForm({ ...form, mood })} className={`flex-1 py-2 rounded-xl border transition-all text-lg ${form.mood === mood ? 'bg-wandr-accent/15 border-wandr-accent/30' : 'border-wandr-border hover:border-wandr-accent/30'}`}>{emoji}</button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-wandr-blue/20 border border-wandr-border">
                <input type="checkbox" id="jPublic" checked={form.isPublic} onChange={e => setForm({ ...form, isPublic: e.target.checked })} className="w-4 h-4 accent-wandr-accent" />
                <label htmlFor="jPublic" className="text-sm text-wandr-text cursor-pointer">Make this entry public</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAdd(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Save Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
