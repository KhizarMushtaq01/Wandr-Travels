import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion' // eslint-disable-line no-unused-vars
import { FaStar } from 'react-icons/fa6'
import api from '../../utils/api'
import toast from 'react-hot-toast'

export default function ReviewFormModal({ open, onClose }) {
  const [form, setForm] = useState({ fullName: '', email: '', rating: 0, reviewText: '' })
  const [hoverRating, setHoverRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.rating) { setError('Please select a star rating'); return }
    setSubmitting(true)
    try {
      await api.post('/reviews', form)
      toast.success('Review submitted! It will appear once approved.')
      setForm({ fullName: '', email: '', rating: 0, reviewText: '' })
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
    setSubmitting(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="modal-overlay" onClick={onClose}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="modal p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-xl text-white font-semibold mb-5">Write a Review</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="label">Full Name</label>
                  <input className="input" placeholder="Alex Rivera" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} required /></div>
                <div><label className="label">Email Address</label>
                  <input type="email" className="input" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
              </div>
              <div>
                <label className="label">Rating</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button type="button" key={n} onClick={() => setForm({ ...form, rating: n })}
                      onMouseEnter={() => setHoverRating(n)} onMouseLeave={() => setHoverRating(0)}>
                      <FaStar className={`w-6 h-6 transition-colors ${n <= (hoverRating || form.rating) ? 'text-w-accent' : 'text-w-border'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div><label className="label">Review</label>
                <textarea className="input resize-none min-h-[120px]" placeholder="Tell us about your experience..." value={form.reviewText} onChange={e => setForm({ ...form, reviewText: e.target.value })} minLength={10} maxLength={1000} required /></div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button type="submit" disabled={submitting} className="btn-primary w-full py-3.5 disabled:opacity-60">{submitting ? 'Submitting...' : 'Submit Review'}</button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
