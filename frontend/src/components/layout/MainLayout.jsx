import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useAuthStore from '../../context/authStore'
import NotificationBell from '../common/NotificationBell'
import GlobalSearch from '../common/GlobalSearch'

const NAV = [
  { to:'/dashboard',   icon:'🏠', label:'Dashboard'   },
  { to:'/trips',       icon:'🗺️', label:'My Trips'    },
  { to:'/bookings',    icon:'📅', label:'Bookings'    },
  { to:'/budget',      icon:'💰', label:'Budget'      },
  { to:'/packing',     icon:'🎒', label:'Packing'     },
  { to:'/discover',    icon:'✨', label:'Discover'    },
  { to:'/wishlist',    icon:'❤️', label:'Wishlist'    },
  { to:'/journal',     icon:'📔', label:'Journal'     },
  { to:'/social',      icon:'👥', label:'Social Feed' },
]
const BOTTOM = [
  { to:'/profile',       icon:'👤', label:'Profile'       },
  { to:'/settings',      icon:'⚙️', label:'Settings'      },
  { to:'/notifications', icon:'🔔', label:'Notifications' },
]

function Sidebar({ onClose }) {
  const { user, logout, isAdmin } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => { await logout(); navigate('/login') }

  return (
    <div className="flex flex-col h-full bg-w-navy border-r border-w-border">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-w-border">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-w-accent to-w-gold flex items-center justify-center text-w-dark font-bold text-sm shadow-[0_0_16px_rgba(232,194,122,0.3)]">W</div>
          <div>
            <div className="font-display text-lg text-white tracking-widest leading-none">WANDR</div>
            <div className="text-[9px] text-w-muted uppercase tracking-[0.2em]">Adventure Planner</div>
          </div>
        </Link>
      </div>

      {/* User card */}
      <div className="px-3 py-3 border-b border-w-border">
        <NavLink to="/profile" onClick={onClose} className="flex items-center gap-3 p-3 rounded-xl bg-w-blue/40 hover:bg-w-blue/60 transition-colors">
          {user?.avatar ? (
            <img src={user.avatar} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-w-mid flex items-center justify-center text-w-accent font-semibold text-sm flex-shrink-0">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">{user?.firstName} {user?.lastName}</div>
            <div className="text-xs text-w-muted truncate capitalize">{user?.subscriptionPlan === 'pro' ? '⭐ Pro' : user?.subscriptionPlan === 'premium' ? '💎 Premium' : 'Explorer'}</div>
          </div>
        </NavLink>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto scrollbar-hide">
        <p className="text-[9px] uppercase tracking-[0.2em] text-w-muted px-3 mb-2">Main</p>
        {NAV.map(({ to, icon, label }) => (
          <NavLink key={to} to={to} onClick={onClose}
            className={({ isActive }) => isActive ? 'nav-item-active' : 'nav-item'}>
            <span className="text-base w-5 flex-shrink-0">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
        <p className="text-[9px] uppercase tracking-[0.2em] text-w-muted px-3 mt-5 mb-2">Account</p>
        {BOTTOM.map(({ to, icon, label }) => (
          <NavLink key={to} to={to} onClick={onClose}
            className={({ isActive }) => isActive ? 'nav-item-active' : 'nav-item'}>
            <span className="text-base w-5 flex-shrink-0">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
        {isAdmin() && (
          <NavLink to="/admin" onClick={onClose} className="nav-item text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 mt-1">
            <span className="text-base w-5">🛡️</span>
            <span>Admin Panel</span>
          </NavLink>
        )}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-3 border-t border-w-border">
        <button onClick={handleLogout} className="nav-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
          <span className="text-base w-5">🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
}

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user } = useAuthStore()

  return (
    <div className="flex h-screen bg-w-dark overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 xl:w-64 flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40" onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="lg:hidden fixed inset-y-0 left-0 w-72 z-50 flex">
              <div className="w-full"><Sidebar onClose={() => setMobileOpen(false)} /></div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-14 bg-w-navy/80 backdrop-blur-xl border-b border-w-border flex items-center px-4 gap-3 flex-shrink-0">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 text-w-muted hover:text-white hover:bg-white/5 rounded-xl transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="flex-1" />
          <GlobalSearch />
          <NotificationBell />
          <div className="w-px h-5 bg-w-border" />
          <NavLink to="/profile">
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-w-border hover:ring-w-accent transition-all" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-w-mid flex items-center justify-center text-w-accent text-xs font-semibold ring-2 ring-w-border hover:ring-w-accent transition-all">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
            )}
          </NavLink>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
