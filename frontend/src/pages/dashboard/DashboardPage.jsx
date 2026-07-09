import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapIcon, CalendarIcon, CurrencyDollarIcon, PlusIcon, ArrowRightIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import useAuthStore from '../../context/authStore';
import api from '../../utils/api';
import { format, isAfter } from 'date-fns';

const StatCard = ({ icon: Icon, label, value, sub, color = 'text-wandr-accent', link }) => (
  <Link to={link || '#'} className="stat-card group block">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-wandr-accent/10 border border-wandr-accent/20 group-hover:bg-wandr-accent/20 transition-colors`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <ArrowRightIcon className="w-4 h-4 text-wandr-muted opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
    <div className={`font-display text-3xl font-bold ${color} mb-1`}>{value}</div>
    <div className="text-white font-medium text-sm">{label}</div>
    {sub && <div className="text-wandr-muted text-xs mt-1">{sub}</div>}
  </Link>
);

const TripCard = ({ trip }) => {
  const statusColors = { planning: 'badge-blue', upcoming: 'badge-gold', active: 'badge-green', completed: 'badge-green', cancelled: 'badge-red' };
  return (
    <Link to={`/trips/${trip._id}`} className="card-hover group flex gap-4">
      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-wandr-blue">
        {trip.coverImage ? (
          <img src={trip.coverImage} alt={trip.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">
            {trip.destinations?.[0]?.name?.[0] || '🗺️'}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-white truncate group-hover:text-wandr-accent transition-colors">{trip.name}</h3>
          <span className={statusColors[trip.status] || 'badge-blue'}>{trip.status}</span>
        </div>
        <p className="text-xs text-wandr-muted mt-1 truncate">
          {trip.destinations?.map(d => d.name).join(' → ') || 'No destinations yet'}
        </p>
        {trip.startDate && (
          <p className="text-xs text-wandr-muted mt-1">
            {format(new Date(trip.startDate), 'MMM d, yyyy')}
            {trip.duration ? ` · ${trip.duration} days` : ''}
          </p>
        )}
      </div>
    </Link>
  );
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [trips, setTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tripsRes, bookingsRes, expensesRes] = await Promise.all([
          api.get('/trips'),
          api.get('/bookings'),
          api.get('/budget'),
        ]);
        setTrips(tripsRes.data.trips || []);
        setBookings(bookingsRes.data.bookings || []);
        setExpenses(expensesRes.data.expenses || []);
      } catch (e) {}
      setLoading(false);
    };
    fetchData();
  }, []);

  const upcomingTrips = trips.filter(t => ['upcoming', 'planning'].includes(t.status));
  const activeTrips = trips.filter(t => t.status === 'active');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const totalSpend = expenses.reduce((sum, e) => sum + e.amount, 0);

  const nextTrip = upcomingTrips.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))[0];
  const upcomingBookings = bookings.filter(b => b.checkIn && isAfter(new Date(b.checkIn), new Date())).slice(0, 3);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex items-center gap-3 text-wandr-muted">
        <svg className="animate-spin w-6 h-6 text-wandr-accent" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
        Loading your dashboard...
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-white font-semibold">
            {greeting}, {user?.firstName}! 🌍
          </h1>
          <p className="text-wandr-muted mt-1">
            {activeTrips.length > 0 ? `You have ${activeTrips.length} active trip${activeTrips.length > 1 ? 's' : ''}` : nextTrip ? `Next trip: ${nextTrip.name}` : 'Ready to plan your next adventure?'}
          </p>
        </div>
        <Link to="/trips/new" className="btn-primary flex items-center gap-2 self-start">
          <PlusIcon className="w-5 h-5" />
          New Trip
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={MapIcon} label="Total Trips" value={trips.length} sub={`${activeTrips.length} active`} link="/trips" />
        <StatCard icon={CalendarIcon} label="Bookings" value={bookings.length} sub={`${confirmedBookings.length} confirmed`} link="/bookings" color="text-blue-400" />
        <StatCard icon={CurrencyDollarIcon} label="Total Spent" value={`$${totalSpend.toFixed(0)}`} sub="across all trips" link="/budget" color="text-emerald-400" />
        <StatCard icon={GlobeAltIcon} label="Countries" value={user?.countriesVisited || 0} sub="visited so far" link="/profile" color="text-purple-400" />
      </div>

      {/* Next trip banner */}
      {nextTrip && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-wandr-mid to-wandr-blue border border-wandr-accent/20 p-6">
          <div className="absolute top-0 right-0 w-40 h-40 bg-wandr-accent/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-wandr-accent uppercase tracking-widest mb-2 font-medium">Next Adventure</div>
              <h2 className="font-display text-2xl text-white font-semibold">{nextTrip.name}</h2>
              <p className="text-wandr-muted text-sm mt-1">
                {nextTrip.destinations?.map(d => d.name).join(' → ') || 'Destinations TBD'}
                {nextTrip.startDate && ` · Starting ${format(new Date(nextTrip.startDate), 'MMMM d, yyyy')}`}
              </p>
            </div>
            <Link to={`/trips/${nextTrip._id}`} className="btn-primary flex items-center gap-2 flex-shrink-0">
              View Trip <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Trips */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg text-white font-semibold">Recent Trips</h2>
            <Link to="/trips" className="text-sm text-wandr-accent hover:text-wandr-gold transition-colors">View all →</Link>
          </div>
          {trips.length === 0 ? (
            <div className="text-center py-10 text-wandr-muted">
              <MapIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No trips yet.</p>
              <Link to="/trips/new" className="btn-primary mt-4 inline-flex items-center gap-2 text-sm">
                <PlusIcon className="w-4 h-4" /> Create First Trip
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {trips.slice(0, 4).map(trip => <TripCard key={trip._id} trip={trip} />)}
            </div>
          )}
        </div>

        {/* Upcoming Bookings */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg text-white font-semibold">Upcoming Bookings</h2>
            <Link to="/bookings" className="text-sm text-wandr-accent hover:text-wandr-gold transition-colors">View all →</Link>
          </div>
          {upcomingBookings.length === 0 ? (
            <div className="text-center py-10 text-wandr-muted">
              <CalendarIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No upcoming bookings.</p>
              <Link to="/bookings" className="btn-secondary mt-4 inline-flex items-center gap-2 text-sm">
                Add Booking
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingBookings.map(booking => (
                <Link key={booking._id} to={`/bookings/${booking._id}`} className="flex items-center gap-4 p-3 rounded-xl hover:bg-wandr-blue/30 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-wandr-blue flex items-center justify-center text-lg flex-shrink-0">
                    {{ flight: '✈️', hotel: '🏨', activity: '🎯', car: '🚗', train: '🚂', tour: '🗺️' }[booking.type] || '📌'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate group-hover:text-wandr-accent transition-colors">{booking.name}</div>
                    <div className="text-xs text-wandr-muted mt-0.5">
                      {booking.checkIn && format(new Date(booking.checkIn), 'MMM d, yyyy')}
                      {booking.destination && ` · ${booking.destination}`}
                    </div>
                  </div>
                  <span className={`badge-${booking.status === 'confirmed' ? 'green' : booking.status === 'pending' ? 'blue' : 'red'} text-xs flex-shrink-0`}>
                    {booking.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="font-display text-lg text-white font-semibold mb-5">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: '✈️', label: 'New Trip', href: '/trips/new' },
            { icon: '🏨', label: 'Add Booking', href: '/bookings' },
            { icon: '💰', label: 'Log Expense', href: '/budget' },
            { icon: '🎒', label: 'Packing List', href: '/packing' },
            { icon: '🌍', label: 'Discover', href: '/discover' },
            { icon: '📔', label: 'Journal', href: '/journal' },
            { icon: '👥', label: 'Social Feed', href: '/social' },
            { icon: '⚙️', label: 'Settings', href: '/settings' },
          ].map(({ icon, label, href }) => (
            <Link key={label} to={href} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-wandr-blue/20 border border-wandr-border hover:border-wandr-accent/30 hover:bg-wandr-blue/40 transition-all group">
              <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
              <span className="text-xs text-wandr-muted group-hover:text-white transition-colors font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
