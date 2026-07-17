import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import api from '../../utils/api';

const emptyResults = { trips: [], bookings: [], journal: [], destinations: [] };

function ResultGroups({ results, onNavigate }) {
  return (
    <>
      {results.trips.length > 0 && (
        <div className="px-4 py-2">
          <div className="text-[10px] uppercase tracking-widest text-wandr-muted mb-1">Trips</div>
          {results.trips.map(t => (
            <button key={t._id} onClick={() => onNavigate(`/trips/${t._id}`)} className="w-full text-left px-2 py-2 rounded-lg hover:bg-white/5 text-sm text-white truncate">🗺️ {t.name}</button>
          ))}
        </div>
      )}
      {results.bookings.length > 0 && (
        <div className="px-4 py-2">
          <div className="text-[10px] uppercase tracking-widest text-wandr-muted mb-1">Bookings</div>
          {results.bookings.map(b => (
            <button key={b._id} onClick={() => onNavigate(`/bookings/${b._id}`)} className="w-full text-left px-2 py-2 rounded-lg hover:bg-white/5 text-sm text-white truncate">📅 {b.name}</button>
          ))}
        </div>
      )}
      {results.journal.length > 0 && (
        <div className="px-4 py-2">
          <div className="text-[10px] uppercase tracking-widest text-wandr-muted mb-1">Journal</div>
          {results.journal.map(j => (
            <button key={j._id} onClick={() => onNavigate(`/journal/${j._id}`)} className="w-full text-left px-2 py-2 rounded-lg hover:bg-white/5 text-sm text-white truncate">📔 {j.title}</button>
          ))}
        </div>
      )}
      {results.destinations.length > 0 && (
        <div className="px-4 py-2">
          <div className="text-[10px] uppercase tracking-widest text-wandr-muted mb-1">Destinations</div>
          {results.destinations.map(d => (
            <button key={d.name} onClick={() => onNavigate('/discover')} className="w-full text-left px-2 py-2 rounded-lg hover:bg-white/5 text-sm text-white truncate">🌍 {d.name}{d.country ? `, ${d.country}` : ''}</button>
          ))}
        </div>
      )}
    </>
  );
}

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(emptyResults);
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (!query.trim()) { setResults(emptyResults); setOpen(false); return; }
    setLoading(true);
    const timeout = setTimeout(() => {
      api.get('/search?q=' + encodeURIComponent(query))
        .then(r => { setResults(r.data); setOpen(true); })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const hasResults = results.trips.length || results.bookings.length || results.journal.length || results.destinations.length;

  const goTo = (path) => { setQuery(''); setOpen(false); setMobileOpen(false); navigate(path); };

  return (
    <>
      <div className="relative hidden sm:block w-64" ref={ref}>
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-wandr-muted pointer-events-none" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => query.trim() && setOpen(true)}
          placeholder="Search trips, bookings..."
          className="w-full bg-white/5 border border-wandr-border rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder:text-wandr-muted focus:outline-none focus:border-wandr-accent/40 transition-colors"
        />
        {open && (
          <div className="absolute left-0 right-0 top-12 w-96 max-w-[calc(100vw-2rem)] bg-wandr-navy border border-wandr-border rounded-2xl shadow-2xl z-50 max-h-96 overflow-y-auto scrollbar-hide animate-slide-down">
            {loading ? (
              <div className="py-8 text-center text-wandr-muted text-sm">Searching...</div>
            ) : !hasResults ? (
              <div className="py-8 text-center text-wandr-muted text-sm">No results for "{query}"</div>
            ) : (
              <ResultGroups results={results} onNavigate={goTo} />
            )}
          </div>
        )}
      </div>

      <button onClick={() => setMobileOpen(true)} className="sm:hidden p-2 rounded-xl text-wandr-muted hover:text-white hover:bg-white/5 transition-all">
        <MagnifyingGlassIcon className="w-5 h-5" />
      </button>

      {mobileOpen && (
        <div className="sm:hidden fixed inset-0 z-50 bg-wandr-dark/95 backdrop-blur-xl p-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-wandr-muted" />
            <input
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search trips, bookings..."
              className="w-full bg-white/5 border border-wandr-border rounded-xl pl-9 pr-9 py-3 text-sm text-white placeholder:text-wandr-muted focus:outline-none focus:border-wandr-accent/40"
            />
            <button onClick={() => { setMobileOpen(false); setQuery(''); }} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-wandr-muted hover:text-white">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-4 bg-wandr-navy border border-wandr-border rounded-2xl overflow-hidden max-h-[70vh] overflow-y-auto scrollbar-hide">
            {!query.trim() ? null : loading ? (
              <div className="py-8 text-center text-wandr-muted text-sm">Searching...</div>
            ) : !hasResults ? (
              <div className="py-8 text-center text-wandr-muted text-sm">No results for "{query}"</div>
            ) : (
              <ResultGroups results={results} onNavigate={goTo} />
            )}
          </div>
        </div>
      )}
    </>
  );
}
