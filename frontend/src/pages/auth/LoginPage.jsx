import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import useAuthStore from '../../context/authStore'
import toast from 'react-hot-toast'

const BG = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const { login, loading } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const r = await login(form)
    if (r.success) { toast.success('Welcome back! 🌍'); navigate('/dashboard') }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — travel image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img src={BG} alt="mountain travel" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-w-dark/20 to-w-dark/60" />
        <div className="relative z-10 h-full flex flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-w-accent to-w-gold flex items-center justify-center text-w-dark font-bold text-sm">W</div>
            <span className="font-display text-xl text-white tracking-widest">WANDR</span>
          </Link>
          <div>
            <p className="font-display text-4xl text-white font-light leading-snug mb-4">"Not all those who wander are lost."</p>
            <p className="text-white/50 text-sm">— J.R.R. Tolkien</p>
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="w-full lg:w-1/2 bg-w-dark flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2.5 lg:hidden mb-10">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-w-accent to-w-gold flex items-center justify-center text-w-dark font-bold text-sm">W</div>
            <span className="font-display text-xl text-white tracking-widest">WANDR</span>
          </Link>

          <div className="mb-10">
            <h1 className="font-display text-4xl text-white font-light mb-2">Welcome back</h1>
            <p className="text-w-muted">Sign in to continue your adventures</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <input type="email" className="input" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required autoComplete="email" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0">Password</label>
                <Link to="/forgot-password" className="text-xs text-w-accent hover:text-w-gold transition-colors">Forgot password?</Link>
              </div>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} className="input pr-11" placeholder="Your password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required autoComplete="current-password" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-w-muted hover:text-white transition-colors">
                  {showPw ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base mt-2">
              {loading ? <span className="flex items-center justify-center gap-2"><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75"/></svg>Signing in...</span> : 'Sign In to Wandr →'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-w-muted">
            Don't have an account?{' '}
            <Link to="/register" className="text-w-accent hover:text-w-gold font-medium transition-colors">Create one free →</Link>
          </p>

          <div className="mt-6 pt-6 border-t border-w-border/40 text-center">
            <p className="text-xs text-w-muted/50">Demo — Admin: admin@wandr.travel / admin123</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
