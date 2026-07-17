import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import useAuthStore from '../../context/authStore';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon, ShieldCheckIcon, BellIcon, UserIcon, TrashIcon } from '@heroicons/react/24/outline';
import { FaKey, FaHand, FaLock, FaTriangleExclamation } from 'react-icons/fa6';

const tabs = [
  { id: 'profile', label: 'Profile', icon: UserIcon },
  { id: 'security', label: 'Security', icon: ShieldCheckIcon },
  { id: 'notifications', label: 'Notifications', icon: BellIcon },
  { id: 'danger', label: 'Danger Zone', icon: TrashIcon },
];

export default function SettingsPage() {
  const { tab = 'profile' } = useParams();
  const navigate = useNavigate();
  const { user, updatePassword, logout, setUser } = useAuthStore();

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState({});
  const [deletePassword, setDeletePassword] = useState('');
  const [notifications, setNotifications] = useState(user?.notifications || { email: true, tripReminders: true, socialUpdates: true, bookingAlerts: true });
  const [saving, setSaving] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (pwForm.newPassword.length < 6) { toast.error('New password must be at least 6 characters'); return; }
    setSaving(true);
    const result = await updatePassword(pwForm);
    setSaving(false);
    if (result.success) { toast.success(<><FaKey className="inline w-4 h-4 mr-1" /> Password changed! Check your email for confirmation.</>); setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); }
  };

  const handleNotificationsSave = async () => {
    setSaving(true);
    try {
      const res = await api.put('/users/me', { notifications });
      setUser(res.data.user);
      toast.success('Notification preferences saved!');
    } catch (e) {}
    setSaving(false);
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (!window.confirm('This is permanent. Are you absolutely sure?')) return;
    try {
      await api.delete('/users/me', { data: { password: deletePassword } });
      toast.success(<>Account deleted. Goodbye! <FaHand className="inline w-4 h-4 ml-1" /></>);
      await logout();
      navigate('/');
    } catch (e) {}
  };

  const inputType = (key) => showPw[key] ? 'text' : 'password';
  const togglePw = (key) => setShowPw(p => ({ ...p, [key]: !p[key] }));

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account preferences</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Tab Nav */}
        <nav className="sm:w-48 flex-shrink-0">
          <div className="card p-2 space-y-0.5">
            {tabs.map(({ id, label, icon: Icon }) => (
              <Link key={id} to={'/settings/' + id}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === id ? (id === 'danger' ? 'text-red-400 bg-red-500/10 border border-red-500/20' : 'nav-link-active') : (id === 'danger' ? 'text-wandr-muted hover:text-red-400 hover:bg-red-500/5' : 'nav-link')}`}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Tab Content */}
        <div className="flex-1">
          {/* Profile */}
          {tab === 'profile' && (
            <div className="card space-y-5">
              <h2 className="font-display text-xl text-white font-semibold">Profile Information</h2>
              <div className="p-4 rounded-xl bg-wandr-blue/20 border border-wandr-accent/20">
                <p className="text-sm text-wandr-muted">To update your profile details, visit your <Link to="/profile" className="text-wandr-accent hover:text-wandr-gold">Profile page</Link> and click Edit.</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-wandr-border/50"><span className="text-wandr-muted">Name</span><span className="text-white">{user?.firstName} {user?.lastName}</span></div>
                <div className="flex justify-between py-2 border-b border-wandr-border/50"><span className="text-wandr-muted">Email</span><span className="text-white">{user?.email}</span></div>
                <div className="flex justify-between py-2 border-b border-wandr-border/50"><span className="text-wandr-muted">Role</span><span className="text-white capitalize">{user?.role}</span></div>
                <div className="flex justify-between py-2"><span className="text-wandr-muted">Plan</span><span className="text-wandr-accent capitalize font-medium">{user?.subscriptionPlan}</span></div>
              </div>
            </div>
          )}

          {/* Security */}
          {tab === 'security' && (
            <div className="card space-y-5">
              <h2 className="font-display text-xl text-white font-semibold">Change Password</h2>
              <div className="p-3 rounded-xl bg-wandr-blue/20 border border-wandr-border text-xs text-wandr-muted">
                <FaKey className="inline w-3.5 h-3.5 mr-1" /> A confirmation email will be sent to {user?.email} when your password is changed.
              </div>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                {[
                  { key: 'currentPassword', label: 'Current Password', field: 'currentPassword' },
                  { key: 'newPassword', label: 'New Password', field: 'newPassword' },
                  { key: 'confirmPassword', label: 'Confirm New Password', field: 'confirmPassword' },
                ].map(({ key, label, field }) => (
                  <div key={key}>
                    <label className="label">{label}</label>
                    <div className="relative">
                      <input type={inputType(key)} className="input-field pr-11" value={pwForm[field]} onChange={e => setPwForm({ ...pwForm, [field]: e.target.value })} required minLength={field !== 'currentPassword' ? 6 : 1} />
                      <button type="button" onClick={() => togglePw(key)} className="absolute right-3 top-1/2 -translate-y-1/2 text-wandr-muted hover:text-white transition-colors">
                        {showPw[key] ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                ))}
                <button type="submit" disabled={saving} className="btn-primary w-full py-3">
                  {saving ? 'Updating...' : 'Update Password'}
                </button>
              </form>

              <div className="pt-4 border-t border-wandr-border">
                <h3 className="text-white font-medium mb-3">Recent Login Activity</h3>
                <div className="space-y-2">
                  {(user?.loginHistory || []).slice(0, 3).map((log, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-wandr-blue/20 text-xs">
                      <FaLock className="w-4 h-4" />
                      <div>
                        <div className="text-white font-medium">{new Date(log.timestamp).toLocaleString()}</div>
                        <div className="text-wandr-muted mt-0.5">{log.ip} · {log.device?.substring(0, 60)}</div>
                      </div>
                    </div>
                  ))}
                  {(!user?.loginHistory || user.loginHistory.length === 0) && <p className="text-wandr-muted text-sm">No login history available.</p>}
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {tab === 'notifications' && (
            <div className="card space-y-5">
              <h2 className="font-display text-xl text-white font-semibold">Email Notifications</h2>
              <p className="text-sm text-wandr-muted">Choose which emails you want to receive at {user?.email}</p>
              <div className="space-y-3">
                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Receive all account-related emails including sign-in alerts and profile changes' },
                  { key: 'tripReminders', label: 'Trip Reminders', desc: 'Get reminders before your trips start' },
                  { key: 'socialUpdates', label: 'Social Updates', desc: 'New followers, comments, and likes on your content' },
                  { key: 'bookingAlerts', label: 'Booking Alerts', desc: 'Confirmations and updates for your bookings' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-start gap-4 p-4 rounded-xl bg-wandr-blue/20 border border-wandr-border hover:border-wandr-accent/20 transition-colors">
                    <div className="flex-1">
                      <div className="text-white font-medium text-sm">{label}</div>
                      <div className="text-wandr-muted text-xs mt-0.5">{desc}</div>
                    </div>
                    <button onClick={() => setNotifications(n => ({ ...n, [key]: !n[key] }))}
                      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${notifications[key] ? 'bg-wandr-accent' : 'bg-wandr-border'}`}>
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifications[key] ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={handleNotificationsSave} disabled={saving} className="btn-primary w-full py-3">
                {saving ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          )}

          {/* Danger Zone */}
          {tab === 'danger' && (
            <div className="card border-red-500/20 space-y-5">
              <h2 className="font-display text-xl text-red-400 font-semibold">Danger Zone</h2>
              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                <p className="text-sm text-red-300 font-medium mb-1 inline-flex items-center gap-2"><FaTriangleExclamation className="w-4 h-4" /> Delete Account</p>
                <p className="text-xs text-red-300/70">This action is permanent. All your trips, bookings, journals and data will be deleted immediately. A confirmation email will be sent.</p>
              </div>
              <form onSubmit={handleDeleteAccount} className="space-y-4">
                <div>
                  <label className="label text-red-400">Enter your password to confirm</label>
                  <input type="password" className="input-field border-red-500/30 focus:border-red-500" placeholder="Your current password" value={deletePassword} onChange={e => setDeletePassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn-danger w-full py-3 flex items-center justify-center gap-2">
                  <TrashIcon className="w-5 h-5" /> Permanently Delete My Account
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
