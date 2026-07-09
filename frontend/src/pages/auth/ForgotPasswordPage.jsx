import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import toast from 'react-hot-toast'

function AuthShell({ children }) {
  return (
    <div className="min-h-screen bg-w-dark flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1400&q=70" alt="" className="w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-w-dark/80 to-w-dark" />
      </div>
      <div className="relative z-10 w-full max-w-md">
        <Link to="/" className="flex items-center gap-2.5 justify-center mb-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-w-accent to-w-gold flex items-center justify-center text-w-dark font-display font-bold shadow-[0_0_24px_rgba(232,194,122,0.4)]">W</div>
          <span className="font-display text-2xl font-medium text-white tracking-widest">WANDR</span>
        </Link>
        {children}
      </div>
    </div>
  )
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
      setSent(true)
    } catch (e) {}
    setLoading(false)
  }

  return (
    <AuthShell>
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl text-white font-light mb-2">Reset Password</h1>
        <p className="text-w-muted">Enter your email to receive a reset link</p>
      </div>
      <div className="bg-w-navy/80 backdrop-blur-xl border border-w-border rounded-2xl p-8">
        {sent ? (
          <div className="text-center py-4">
            <div className="text-5xl mb-4">📬</div>
            <h3 className="text-white font-semibold text-lg mb-2">Check Your Inbox</h3>
            <p className="text-w-muted text-sm mb-6">We sent a reset link to <strong className="text-white">{email}</strong>. It expires in 1 hour.</p>
            <Link to="/login" className="btn-primary">Back to Sign In</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div><label className="label">Email Address</label><input type="email" className="input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required /></div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">{loading ? 'Sending...' : 'Send Reset Link'}</button>
            <div className="text-center"><Link to="/login" className="text-sm text-w-muted hover:text-w-accent transition-colors">← Back to Sign In</Link></div>
          </form>
        )}
      </div>
    </AuthShell>
  )
}
