import React, { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { FaCircleCheck } from 'react-icons/fa6'
import api from '../../utils/api'
import toast from 'react-hot-toast'

export default function ResetPasswordPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ password: '', confirm: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return }
    setLoading(true)
    try {
      await api.put(`/auth/reset-password/${token}`, { password: form.password })
      setDone(true)
      setTimeout(() => navigate('/login'), 2500)
    } catch (e) {}
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-w-dark flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(232,194,122,0.05),transparent_60%)]" />
      <div className="relative z-10 w-full max-w-md">
        <Link to="/" className="flex items-center gap-2.5 justify-center mb-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-w-accent to-w-gold flex items-center justify-center text-w-dark font-display font-bold">W</div>
          <span className="font-display text-2xl font-medium text-white tracking-widest">WANDR</span>
        </Link>
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-white font-light mb-2">New Password</h1>
          <p className="text-w-muted">Choose a strong password for your account</p>
        </div>
        <div className="bg-w-navy/80 backdrop-blur-xl border border-w-border rounded-2xl p-8">
          {done ? (
            <div className="text-center py-4">
              <div className="mb-4 flex justify-center"><FaCircleCheck className="w-10 h-10 text-emerald-400" /></div>
              <h3 className="text-white font-semibold mb-2">Password Updated!</h3>
              <p className="text-w-muted text-sm">Redirecting you to sign in...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label">New Password</label>
                <div className="relative">
                  <input type={show ? 'text' : 'password'} className="input pr-11" placeholder="Min 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
                  <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-w-muted hover:text-white">
                    {show ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div><label className="label">Confirm Password</label><input type="password" className="input" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} required /></div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">{loading ? 'Updating...' : 'Update Password'}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
