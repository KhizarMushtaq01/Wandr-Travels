import React from 'react';
import { Link } from 'react-router-dom';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-8 text-center">
      <div>
        <div className="w-16 h-16 bg-gradient-to-br from-wandr-accent to-wandr-gold rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow"><GlobeAltIcon className="w-8 h-8 text-wandr-dark" /></div>
        <h1 className="font-display text-4xl text-white font-bold mb-4">Explore Wandr</h1>
        <p className="text-wandr-muted text-lg mb-8 max-w-md mx-auto">Discover thousands of community-created itineraries. Sign up to copy and personalize any trip.</p>
        <div className="flex gap-4 justify-center">
          <Link to="/register" className="btn-primary">Get Started Free</Link>
          <Link to="/login" style={{ marginTop: '10px' }} className="btn-secondary">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
