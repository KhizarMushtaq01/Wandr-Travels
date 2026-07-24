import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import useAuthStore from './context/authStore'
import MainLayout   from './components/layout/MainLayout'
import AdminLayout  from './components/layout/AdminLayout'
import LandingPage        from './pages/LandingPage'
import DestinationDetail from './pages/DestinationDetail'
import LoginPage          from './pages/auth/LoginPage'
import RegisterPage       from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage  from './pages/auth/ResetPasswordPage'
import ExplorePage        from './pages/discover/ExplorePage'
import PrivacyPolicyPage     from './pages/policy/PrivacyPolicyPage'
import TermsOfServicePage    from './pages/policy/TermsOfServicePage'
import CookiePolicyPage      from './pages/policy/CookiePolicyPage'
import RefundPolicyPage      from './pages/policy/RefundPolicyPage'
import AcceptableUsePage     from './pages/policy/AcceptableUsePage'
import AccessibilityPage     from './pages/policy/AccessibilityPage'
import ContactPage           from './pages/policy/ContactPage'
import AboutPage             from './pages/policy/AboutPage'
import CareersPage           from './pages/policy/CareersPage'
import PressPage             from './pages/policy/PressPage'
import HelpCenterPage        from './pages/policy/HelpCenterPage'
import BlogPage              from './pages/policy/BlogPage'
import BlogPostPage          from './pages/policy/BlogPostPage'
import ChangelogPage          from './pages/policy/ChangelogPage'
import RoadmapPage            from './pages/policy/RoadmapPage'
import DashboardPage    from './pages/dashboard/DashboardPage'
import TripsPage        from './pages/trips/TripsPage'
import TripDetailPage   from './pages/trips/TripDetailPage'
import CreateTripPage   from './pages/trips/CreateTripPage'
import ItineraryPage    from './pages/trips/ItineraryPage'
import BookingsPage     from './pages/bookings/BookingsPage'
import BookingDetailPage from './pages/bookings/BookingDetailPage'
import BudgetPage       from './pages/budget/BudgetPage'
import PackingPage      from './pages/packing/PackingPage'
import DiscoverPage     from './pages/discover/DiscoverPage'
import WishlistPage     from './pages/wishlist/WishlistPage'
import JournalPage      from './pages/journal/JournalPage'
import JournalEntryPage from './pages/journal/JournalEntryPage'
import SocialFeedPage   from './pages/social/SocialFeedPage'
import ProfilePage      from './pages/profile/ProfilePage'
import SettingsPage     from './pages/settings/SettingsPage'
import NotificationsPage from './pages/notifications/NotificationsPage'
import AdminDashboard   from './pages/admin/AdminDashboard'
import AdminUsersPage   from './pages/admin/AdminUsersPage'
import AdminTripsPage   from './pages/admin/AdminTripsPage'
import AdminBookingsPage from './pages/admin/AdminBookingsPage'
import AdminReportsPage from './pages/admin/AdminReportsPage'
import AdminJournalPage from './pages/admin/AdminJournalPage'
import AdminContactPage from './pages/admin/AdminContactPage'
import AdminReviewsPage from './pages/admin/AdminReviewsPage'
import AdminActivityPage from './pages/admin/AdminActivityPage'
import AdminSettingsPage from './pages/admin/AdminSettingsPage'
import NotFoundPage from './pages/NotFoundPage'

const PrivateRoute = ({ children }) => { const ok = useAuthStore(s => s.isAuthenticated()); return ok ? children : <Navigate to="/login" replace /> }
const AdminRoute = ({ children }) => { const ok = useAuthStore(s => s.isAuthenticated()); const adm = useAuthStore(s => s.isAdmin()); if (!ok) return <Navigate to="/login" replace />; if (!adm) return <Navigate to="/dashboard" replace />; return children }
const PublicRoute = ({ children }) => { const ok = useAuthStore(s => s.isAuthenticated()); return ok ? <Navigate to="/dashboard" replace /> : children }

export default function App() {
  const getMe = useAuthStore(s => s.getMe)
  const token = useAuthStore(s => s.token)
  useEffect(() => { if (token) getMe() }, [])
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#0d1628', color: '#c8d6e8', border: '1px solid #1e3256', borderRadius: '14px', fontSize: '14px', padding: '14px 18px' }, success: { iconTheme: { primary: '#e8c27a', secondary: '#0d1628' } }, error: { iconTheme: { primary: '#ef4444', secondary: '#0d1628' } } }} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/destination/:name" element={<DestinationDetail />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
        <Route path="/reset-password/:token" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/press" element={<PressPage />} />
        <Route path="/help" element={<HelpCenterPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
        <Route path="/cookies" element={<CookiePolicyPage />} />
        <Route path="/refund" element={<RefundPolicyPage />} />
        <Route path="/acceptable-use" element={<AcceptableUsePage />} />
        <Route path="/accessibility" element={<AccessibilityPage />} />
        <Route path="/changelog" element={<ChangelogPage />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/trips" element={<TripsPage />} />
          <Route path="/trips/new" element={<CreateTripPage />} />
          <Route path="/trips/:id" element={<TripDetailPage />} />
          <Route path="/trips/:id/itinerary" element={<ItineraryPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/bookings/:id" element={<BookingDetailPage />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/packing" element={<PackingPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/journal/:id" element={<JournalEntryPage />} />
          <Route path="/social" element={<SocialFeedPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/:tab" element={<SettingsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>
        <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/trips" element={<AdminTripsPage />} />
          <Route path="/admin/bookings" element={<AdminBookingsPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
          <Route path="/admin/journal" element={<AdminJournalPage />} />
          <Route path="/admin/contact" element={<AdminContactPage />} />
          <Route path="/admin/reviews" element={<AdminReviewsPage />} />
          <Route path="/admin/activity" element={<AdminActivityPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
