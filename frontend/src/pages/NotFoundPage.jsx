import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-w-dark flex items-center justify-center p-8 text-center relative overflow-hidden">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1400&q=70" alt="" className="w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-w-dark/60 to-w-dark" />
      </div>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-lg">
        <div className="font-display text-[120px] sm:text-[160px] font-light text-w-accent/10 leading-none mb-4">404</div>
        <div className="text-5xl mb-6">🧭</div>
        <h1 className="font-display text-4xl text-white font-light mb-4">You've wandered off the map.</h1>
        <p className="text-w-muted text-lg mb-10 leading-relaxed">The page you're looking for doesn't exist — but a great adventure is just one click away.</p>
        <div className="flex gap-4 justify-center">
          <Link to="/" className="btn-primary px-8 py-3">Take Me Home</Link>
          <Link to="/explore" className="btn-outline px-8 py-3">Explore Trips</Link>
        </div>
      </motion.div>
    </div>
  )
}
