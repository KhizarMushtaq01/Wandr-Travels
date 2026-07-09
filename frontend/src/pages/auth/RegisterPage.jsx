import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { EyeIcon, EyeSlashIcon, CheckIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import useAuthStore from '../../context/authStore'
import toast from 'react-hot-toast'

const BG = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1400&q=80'

const pwStrength = (p) => { let s=0; if(p.length>=8)s++; if(/[A-Z]/.test(p))s++; if(/[0-9]/.test(p))s++; if(/[^A-Za-z0-9]/.test(p))s++; return s }
const strengthColor = ['','bg-red-500','bg-orange-400','bg-yellow-400','bg-emerald-500']
const strengthLabel = ['','Weak','Fair','Good','Strong']

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', password:'', confirm:'' })
  const [showPw, setShowPw] = useState(false)
  const { register, loading } = useAuthStore()
  const navigate = useNavigate()
  const strength = pwStrength(form.password)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    const r = await register({ firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password })
    if (r.success) { toast.success('Welcome to Wandr! Check your email. 🌍'); navigate('/dashboard') }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img src={BG} alt="travel" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-w-dark/20 to-w-dark/70" />
        <div className="relative z-10 h-full flex flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-w-accent to-w-gold flex items-center justify-center text-w-dark font-bold text-sm">W</div>
            <span className="font-display text-xl text-white tracking-widest">WANDR</span>
          </Link>
          <div>
            <p className="font-display text-4xl text-white font-light leading-snug mb-4">"The world is a book, and those who do not travel read only one page."</p>
            <p className="text-white/50 text-sm">— Saint Augustine</p>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="w-full lg:w-1/2 bg-w-dark flex items-center justify-center p-8 overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md py-8">
          <Link to="/" className="flex items-center gap-2.5 lg:hidden mb-10">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-w-accent to-w-gold flex items-center justify-center text-w-dark font-bold text-sm">W</div>
            <span className="font-display text-xl text-white tracking-widest">WANDR</span>
          </Link>

          <div className="mb-10">
            <h1 className="font-display text-4xl text-white font-light mb-2">Start your journey</h1>
            <p className="text-w-muted">Create your free Wandr account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">First Name</label><input className="input" placeholder="Alex" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} required /></div>
              <div><label className="label">Last Name</label><input className="input" placeholder="Rivera" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} required /></div>
            </div>
            <div><label className="label">Email Address</label><input type="email" className="input" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} className="input pr-11" placeholder="Min 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-w-muted hover:text-white"><EyeIcon className="w-5 h-5" /></button>
              </div>
              {form.password && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex gap-1 flex-1">{[1,2,3,4].map(i => <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength ? strengthColor[strength] : 'bg-w-border'}`} />)}</div>
                  <span className="text-xs text-w-muted">{strengthLabel[strength]}</span>
                </div>
              )}
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <div className="relative">
                <input type="password" className={`input pr-11 ${form.confirm && form.password !== form.confirm ? 'border-red-500/50' : form.confirm && form.password === form.confirm ? 'border-emerald-500/50' : ''}`} value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} required />
                {form.confirm && form.password === form.confirm && <CheckIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />}
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base mt-2">
              {loading ? 'Creating account...' : 'Create My Account →'}
            </button>
            <p className="text-xs text-w-muted/60 text-center">By creating an account you agree to our <Link to="/terms" className="text-w-accent hover:underline">Terms</Link> and <Link to="/privacy" className="text-w-accent hover:underline">Privacy Policy</Link></p>
          </form>

          <p className="mt-8 text-center text-sm text-w-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-w-accent hover:text-w-gold font-medium transition-colors">Sign in →</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
