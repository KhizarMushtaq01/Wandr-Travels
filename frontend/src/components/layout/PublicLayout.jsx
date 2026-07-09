import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

function PublicNav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'bg-w-dark/95 backdrop-blur-xl border-b border-w-border/50' : 'bg-w-dark/80 backdrop-blur-lg'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-w-accent to-w-gold flex items-center justify-center text-w-dark font-display font-bold text-sm">W</div>
          <span className="font-display text-xl font-medium text-white tracking-widest">WANDR</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-w-muted hover:text-white transition-colors px-4 py-2">Sign In</Link>
          <Link to="/register" className="btn-primary text-sm py-2 px-5">Get Started</Link>
        </div>
      </div>
    </nav>
  )
}

function PublicFooter() {
  return (
    <footer className="border-t border-w-border/40 bg-w-navy/40 mt-24">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          {[
            { title:'Company', links:[['About','/about'],['Careers','/careers'],['Press','/press'],['Contact','/contact']] },
            { title:'Resources', links:[['Help Center','/help'],['Blog','/blog'],['Explore','/explore']] },
            { title:'Legal', links:[['Privacy','/privacy'],['Terms','/terms'],['Cookies','/cookies'],['Refund','/refund'],['Acceptable Use','/acceptable-use'],['Accessibility','/accessibility']] },
            { title:'Product', links:[['Features','/#features'],['Pricing','/#pricing'],['Changelog','/blog'],['Roadmap','/blog']] },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map(([l, h]) => <li key={l}><Link to={h} className="text-sm text-w-muted hover:text-w-accent transition-colors">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-w-border/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-w-accent to-w-gold flex items-center justify-center text-w-dark font-bold text-xs">W</div>
            <span className="text-w-muted text-sm">© {new Date().getFullYear()} Wandr Travel</span>
          </div>
          <p className="text-xs text-w-muted/50">Built for adventurers worldwide</p>
        </div>
      </div>
    </footer>
  )
}

export default function PublicLayout({ children, hero, title, subtitle, breadcrumb }) {
  return (
    <div className="min-h-screen bg-w-dark">
      <PublicNav />
      {hero ? hero : (
        <div className="relative pt-16">
          <div className="relative h-48 sm:h-56 flex items-end overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-w-navy to-w-dark" />
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(ellipse at 30% 50%, rgba(232,194,122,0.06) 0%, transparent 60%)' }} />
            <div className="relative z-10 max-w-4xl mx-auto px-4 pb-10 w-full">
              {breadcrumb && (
                <div className="flex items-center gap-2 text-xs text-w-muted mb-3">
                  <Link to="/" className="hover:text-w-accent transition-colors">Home</Link>
                  <span>/</span>
                  <span className="text-w-text">{breadcrumb}</span>
                </div>
              )}
              <h1 className="font-display text-4xl sm:text-5xl text-white font-light">{title}</h1>
              {subtitle && <p className="text-w-muted mt-3 text-lg">{subtitle}</p>}
            </div>
          </div>
        </div>
      )}
      <main className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
        {children}
      </main>
      <PublicFooter />
    </div>
  )
}
