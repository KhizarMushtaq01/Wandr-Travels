import React from 'react'
import { AnimatePresence, motion } from 'framer-motion' // eslint-disable-line no-unused-vars
import { FaStar } from 'react-icons/fa6'

export default function ViewAllReviewsModal({ open, onClose, reviews }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="modal-overlay" onClick={onClose}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="modal p-6 max-w-3xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-xl text-white font-semibold">All Reviews</h3>
              <button onClick={onClose} className="text-w-muted hover:text-white text-sm">Close</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto pr-1">
              {reviews.map(r => (
                <div key={r._id} className="card border border-w-border">
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, j) => <FaStar key={j} className={`w-3.5 h-3.5 ${j < r.rating ? 'text-w-accent' : 'text-w-border'}`} />)}
                  </div>
                  <p className="text-w-text text-sm leading-relaxed italic mb-4">"{r.reviewText}"</p>
                  <div className="text-white font-medium text-sm">{r.fullName}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
