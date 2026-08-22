import React from 'react';
import { Link } from 'react-router-dom';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import PublicLayout from '../../components/layout/PublicLayout';
export default function ExplorePage() {
  return (
    <PublicLayout title="Explore Wandr" subtitle="Discover the journeys our community is planning." breadcrumb="Explore">
      <div className="min-h-[360px] flex items-center justify-center text-center">
        <div>
          <div className="w-16 h-16 bg-gradient-to-br from-wandr-accent to-wandr-gold rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow"><GlobeAltIcon className="w-8 h-8 text-wandr-dark" /></div>
          <p className="text-wandr-muted text-lg mb-8 max-w-md mx-auto">Discover thousands of community-created itineraries. Sign up to copy and personalize any trip.</p>
          <div className="flex gap-4 justify-center">
            <Link to="/register" className="btn-primary">Get Started Free</Link>
            <Link to="/login" className="btn-secondary">Sign In</Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
