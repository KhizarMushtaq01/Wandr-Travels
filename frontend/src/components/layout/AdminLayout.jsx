import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useAuthStore from '../../context/authStore'
import { ADMIN_NAV_ICONS } from '../../utils/icons'

const ADMIN_NAV = [
  { to:'/admin',           icon:ADMIN_NAV_ICONS.dashboard, label:'Dashboard', exact:true },
  { to:'/admin/users',     icon:ADMIN_NAV_ICONS.users,     label:'Users'    },
  { to:'/admin/trips',     icon:ADMIN_NAV_ICONS.trips,     label:'Trips'    },
  { to:'/admin/bookings',  icon:ADMIN_NAV_ICONS.bookings,  label:'Bookings' },
  { to:'/admin/reports',   icon:ADMIN_NAV_ICONS.reports,   label:'Reports'  },
  { to:'/admin/journal',   icon:ADMIN_NAV_ICONS.journal,   label:'Journal'  },
  { to:'/admin/contact',   icon:ADMIN_NAV_ICONS.contact,   label:'Contact'  },
  { to:'/admin/activity',  icon:ADMIN_NAV_ICONS.activity,  label:'Activity'  },
  { to:'/admin/settings',  icon:ADMIN_NAV_ICONS.settings,  label:'Settings'  },
]

function AdminSidebar({ onClose }) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const handleLogout = async () => { await logout(); navigate('/login') }

  return (
    <div className="flex flex-col h-full bg-w-navy border-r border-purple-900/50">
      <div className="px-5 py-5 border-b border-purple-900/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold text-sm">W</div>
          <div>
            <div className="font-display text-lg text-white tracking-widest">WANDR</div>
            <div className="text-[9px] text-purple-400 uppercase tracking-[0.2em]">Admin Panel</div>
          </div>
        </div>
      </div>
      <div className="px-3 py-3 border-b border-purple-900/30">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <div className="w-9 h-9 rounded-full bg-purple-700 flex items-center justify-center text-white text-sm font-semibold">{user?.firstName?.[0]}</div>
          <div><div className="text-sm font-medium text-white">{user?.firstName} {user?.lastName}</div><div className="text-xs text-purple-400 capitalize">{user?.role}</div></div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {ADMIN_NAV.map(({ to, icon, label, exact }) => (
          <NavLink key={to} to={to} end={exact} onClick={onClose}
            className={({ isActive }) => isActive
              ? 'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-purple-300 bg-purple-500/15 border border-purple-500/25'
              : 'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-w-muted hover:text-white hover:bg-white/5 transition-all'}>
            <span className="w-5">{icon}</span><span>{label}</span>
          </NavLink>
        ))}
        <div className="pt-3 mt-3 border-t border-purple-900/30">
          <NavLink to="/dashboard" onClick={onClose} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-w-muted hover:text-w-accent hover:bg-w-accent/5 transition-all">
            <span className="w-5">{ADMIN_NAV_ICONS.clientView}</span><span>Client View</span>
          </NavLink>
        </div>
      </nav>
      <div className="px-3 py-3 border-t border-purple-900/40">
        <button onClick={handleLogout} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 w-full transition-all">
          <span className="w-5">{ADMIN_NAV_ICONS.signOut}</span><span>Sign Out</span>
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user } = useAuthStore()

  return (
    <div className="flex h-screen bg-w-dark overflow-hidden">
      <aside className="hidden lg:flex w-60 xl:w-64 flex-shrink-0">
        <AdminSidebar />
      </aside>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40" onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} className="lg:hidden fixed inset-y-0 left-0 w-72 z-50">
              <AdminSidebar onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 bg-w-navy/80 backdrop-blur-xl border-b border-purple-900/40 flex items-center px-4 gap-3 flex-shrink-0">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 text-w-muted hover:text-white rounded-xl">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <span className="text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2.5 py-1 rounded-full font-medium tracking-wide">Admin Mode</span>
          <div className="flex-1" />
          <span className="text-sm text-w-muted hidden sm:block">Welcome, {user?.firstName}</span>
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8"><Outlet /></div>
        </main>
      </div>
    </div>
  )
}
