import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { HeartIcon, TrashIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const moods = { amazing: '🤩', happy: '😊', neutral: '😐', tired: '😴', challenging: '😤' };

export default function JournalEntryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    api.get('/journal/' + id).then(r => setEntry(r.data.entry)).catch(() => navigate('/journal'));
  }, [id]);

  const handleLike = async () => {
    try { const r = await api.post('/journal/' + id + '/like'); setEntry(e => ({ ...e, likes: { length: r.data.likesCount } })); } catch (e) {}
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try { const r = await api.post('/journal/' + id + '/comments', { text: comment }); setEntry(r.data.entry); setComment(''); } catch (e) {}
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this entry?')) return;
    await api.delete('/journal/' + id);
    toast.success('Entry deleted');
    navigate('/journal');
  };

  if (!entry) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-wandr-accent border-t-transparent rounded-full" /></div>;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <button onClick={() => navigate('/journal')} className="flex items-center gap-2 text-wandr-muted hover:text-white transition-colors mb-6">
        <ArrowLeftIcon className="w-4 h-4" /> Back to Journal
      </button>
      <div className="card space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{moods[entry.mood] || '😊'}</span>
              {entry.isPublic && <span className="badge-blue text-xs">Public</span>}
            </div>
            <h1 className="font-display text-3xl text-white font-semibold">{entry.title}</h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-wandr-muted">
              {entry.location && <span>📍 {entry.location}</span>}
              <span>{format(new Date(entry.date), 'MMMM d, yyyy')}</span>
            </div>
          </div>
          <button onClick={handleDelete} className="p-2 text-wandr-muted hover:text-red-400 transition-colors">
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="divider" />
        <div className="text-wandr-text leading-relaxed whitespace-pre-wrap">{entry.content}</div>
        <div className="divider" />
        <div className="flex items-center gap-4">
          <button onClick={handleLike} className="flex items-center gap-2 text-wandr-muted hover:text-red-400 transition-colors">
            <HeartIcon className="w-5 h-5" /><span className="text-sm">{entry.likes?.length || 0} likes</span>
          </button>
          <span className="text-wandr-muted text-sm">{entry.comments?.length || 0} comments</span>
        </div>
        {entry.comments?.length > 0 && (
          <div className="space-y-3">
            {entry.comments.map((c, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-xl bg-wandr-blue/20">
                <div className="w-8 h-8 rounded-full bg-wandr-mid flex items-center justify-center text-sm font-semibold text-wandr-accent flex-shrink-0">
                  {c.user?.firstName?.[0]}
                </div>
                <div>
                  <span className="text-sm font-medium text-white">{c.user?.firstName} {c.user?.lastName}</span>
                  <p className="text-sm text-wandr-muted mt-0.5">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <form onSubmit={handleComment} className="flex gap-3">
          <input className="input-field flex-1" placeholder="Add a comment..." value={comment} onChange={e => setComment(e.target.value)} />
          <button type="submit" className="btn-primary px-4">Post</button>
        </form>
      </div>
    </div>
  );
}
