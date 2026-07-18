import React from 'react'
import { AnimatePresence, motion } from 'framer-motion' // eslint-disable-line no-unused-vars

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="modal-overlay" onClick={onCancel}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="modal p-6 max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-lg text-white font-semibold mb-2">{title}</h3>
            <p className="text-w-muted text-sm mb-6">{message}</p>
            <div className="flex gap-2 justify-end">
              <button onClick={onCancel} className="btn-secondary text-sm px-4 py-2">Cancel</button>
              <button onClick={onConfirm} className="btn-danger text-sm px-4 py-2">{confirmLabel}</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
