import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { TrashIcon } from '@heroicons/react/24/outline';
import { FaStar } from 'react-icons/fa6';
import { format } from 'date-fns';

const statusBadge = { pending: 'badge-gold', approved: 'badge-green', rejected: 'badge-red' };

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const fetchReviews = () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 20 });
    if (statusFilter) params.set('status', statusFilter);
    api.get('/admin/reviews?' + params.toString())
      .then(r => { setReviews(r.data.reviews || []); setTotal(r.data.total || 0); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchReviews(); }, [page, statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      await api.patch('/admin/reviews/' + id, { status });
      setReviews(r => r.map(x => x._id === id ? { ...x, status } : x));
      toast.success(`Review ${status}`);
    } catch (e) {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await api.delete('/admin/reviews/' + id);
      setReviews(r => r.filter(x => x._id !== id));
      toast.success('Review deleted');
    } catch (e) {}
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header"><h1 className="page-title">Reviews</h1><p className="page-subtitle">{total} submissions</p></div>

      <div className="flex gap-2 flex-wrap">
        {['', 'pending', 'approved', 'rejected'].map(s => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${statusFilter === s ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-wandr-muted border border-wandr-border hover:text-white'}`}>{s || 'All'}</button>
        ))}
      </div>

      <div className="space-y-3">
        {reviews.length === 0 ? (
          <div className="card text-center py-16 text-wandr-muted text-sm">No reviews found</div>
        ) : reviews.map(rev => (
          <div key={rev._id} className="card">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white font-medium text-sm">{rev.fullName}</span>
                  <span className={`${statusBadge[rev.status]} text-xs capitalize`}>{rev.status}</span>
                </div>
                <div className="text-wandr-muted text-xs mt-1">{rev.email}</div>
                <div className="flex gap-0.5 mt-2">
                  {[...Array(5)].map((_, j) => <FaStar key={j} className={`w-3 h-3 ${j < rev.rating ? 'text-purple-400' : 'text-wandr-border'}`} />)}
                </div>
                <p className="text-sm text-wandr-text mt-3 whitespace-pre-wrap">{rev.reviewText}</p>
              </div>
              <span className="text-xs text-wandr-muted flex-shrink-0">{format(new Date(rev.createdAt), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t border-wandr-border">
              {rev.status !== 'approved' && <button onClick={() => updateStatus(rev._id, 'approved')} className="btn-secondary text-xs px-3 py-1.5">Approve</button>}
              {rev.status !== 'rejected' && <button onClick={() => updateStatus(rev._id, 'rejected')} className="btn-secondary text-xs px-3 py-1.5">Reject</button>}
              <button onClick={() => handleDelete(rev._id)} className="p-1.5 rounded-lg text-wandr-muted hover:text-red-400 hover:bg-red-500/10 transition-colors ml-auto"><TrashIcon className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2">
        <span className="text-sm text-wandr-muted">Showing {reviews.length} of {total}</span>
        <div className="flex gap-2">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary text-sm px-3 py-1.5 disabled:opacity-40">← Prev</button>
          <span className="px-3 py-1.5 text-sm text-wandr-muted">Page {page}</span>
          <button disabled={reviews.length < 20} onClick={() => setPage(p => p + 1)} className="btn-secondary text-sm px-3 py-1.5 disabled:opacity-40">Next →</button>
        </div>
      </div>
    </div>
  );
}
