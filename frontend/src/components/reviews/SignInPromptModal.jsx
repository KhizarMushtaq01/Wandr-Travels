import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion' // eslint-disable-line no-unused-vars

export default function SignInPromptModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="modal-overlay" onClick={onClose}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="modal p-8 max-w-sm text-center" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-xl text-white mb-3">Please Sign In</h3>
            <p className="text-w-muted text-sm mb-6">You need to be signed in to write a review.</p>
            <Link to="/login" className="btn-primary w-full justify-center py-3">Sign In</Link>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
