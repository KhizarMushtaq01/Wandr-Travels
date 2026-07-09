import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import useAuthStore from '../../context/authStore';
import { CameraIcon, PencilIcon, UserPlusIcon, CheckIcon } from '@heroicons/react/24/outline';

const travelStyles = ['Adventure', 'Cultural', 'Luxury', 'Budget', 'Solo', 'Family', 'Romantic', 'Beach', 'Mountain', 'City'];

export default function ProfilePage() {
  const { id } = useParams();
  const { user: currentUser, setUser } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [trips, setTrips] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});
  const fileRef = useRef();

  const profileId = id || currentUser?._id;
  const isOwn = !id || id === currentUser?._id;

  useEffect(() => {
    Promise.all([
      api.get('/users/profile/' + profileId),
      api.get('/trips').then(r => r).catch(() => ({ data: { trips: [] } })),
    ]).then(([profileRes, tripsRes]) => {
      setProfile(profileRes.data.user);
      setForm(profileRes.data.user);
      if (isOwn) setTrips(tripsRes.data.trips || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [profileId]);

  const handleSave = async () => {
    try {
      const res = await api.put('/users/me', form);
      setProfile(res.data.user);
      setUser(res.data.user);
      setIsEditing(false);
      toast.success('Profile updated! ✅');
    } catch (e) {}
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append('avatar', file);
    try {
      const res = await api.post('/users/me/avatar', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setProfile(p => ({ ...p, avatar: res.data.avatar }));
      setUser({ ...currentUser, avatar: res.data.avatar });
      toast.success('Avatar updated! 🖼️');
    } catch (e) {}
  };

  const handleFollow = async () => {
    try {
      await api.post('/users/' + profileId + '/follow');
      setProfile(p => ({ ...p, followers: { length: (p.followers?.length || 0) + 1 } }));
      toast.success('Followed!');
    } catch (e) {}
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-wandr-accent border-t-transparent rounded-full" /></div>;
  if (!profile) return <div className="card text-center py-16 text-wandr-muted">User not found</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Cover / Avatar */}
      <div className="card overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-wandr-mid to-wandr-blue -mx-6 -mt-6 mb-0" />
        <div className="flex flex-col sm:flex-row items-start gap-5 -mt-12 pt-0 px-0">
          <div className="relative flex-shrink-0 ml-2">
            {profile.avatar ? (
              <img src={profile.avatar} alt="" className="w-24 h-24 rounded-2xl object-cover border-4 border-wandr-card shadow-lg" />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-wandr-mid border-4 border-wandr-card flex items-center justify-center text-3xl font-bold text-wandr-accent shadow-lg">
                {profile.firstName?.[0]}{profile.lastName?.[0]}
              </div>
            )}
            {isOwn && (
              <>
                <button onClick={() => fileRef.current.click()} className="absolute -bottom-1 -right-1 w-7 h-7 bg-wandr-accent rounded-full flex items-center justify-center shadow-lg hover:bg-wandr-gold transition-colors">
                  <CameraIcon className="w-3.5 h-3.5 text-wandr-dark" />
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </>
            )}
          </div>
          <div className="flex-1 min-w-0 mt-14 sm:mt-14">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                {isEditing ? (
                  <div className="flex gap-2 mb-1">
                    <input className="input-field text-lg font-semibold py-1.5 w-32" value={form.firstName || ''} onChange={e => setForm({ ...form, firstName: e.target.value })} />
                    <input className="input-field text-lg font-semibold py-1.5 w-32" value={form.lastName || ''} onChange={e => setForm({ ...form, lastName: e.target.value })} />
                  </div>
                ) : (
                  <h1 className="font-display text-2xl text-white font-semibold">{profile.firstName} {profile.lastName}</h1>
                )}
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className={`badge-${profile.role === 'admin' ? 'red' : 'gold'} text-xs capitalize`}>{profile.role}</span>
                  <span className="badge-blue text-xs capitalize">{profile.subscriptionPlan}</span>
                  {profile.location && <span className="text-xs text-wandr-muted">📍 {profile.location}</span>}
                </div>
              </div>
              {isOwn ? (
                isEditing ? (
                  <div className="flex gap-2">
                    <button onClick={() => setIsEditing(false)} className="btn-secondary text-sm px-3 py-1.5">Cancel</button>
                    <button onClick={handleSave} className="btn-primary text-sm px-3 py-1.5 flex items-center gap-1"><CheckIcon className="w-4 h-4" /> Save</button>
                  </div>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="btn-secondary text-sm px-3 py-1.5 flex items-center gap-1.5"><PencilIcon className="w-4 h-4" /> Edit</button>
                )
              ) : (
                <button onClick={handleFollow} className="btn-primary text-sm px-4 py-2 flex items-center gap-2"><UserPlusIcon className="w-4 h-4" /> Follow</button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {isEditing ? (
            <>
              <div><label className="label">Bio</label><textarea className="input-field resize-none" rows={3} value={form.bio || ''} onChange={e => setForm({ ...form, bio: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Location</label><input className="input-field" value={form.location || ''} onChange={e => setForm({ ...form, location: e.target.value })} /></div>
                <div><label className="label">Website</label><input className="input-field" value={form.website || ''} onChange={e => setForm({ ...form, website: e.target.value })} /></div>
              </div>
              <div>
                <label className="label">Travel Styles</label>
                <div className="flex flex-wrap gap-2">
                  {travelStyles.map(style => (
                    <button key={style} type="button"
                      onClick={() => setForm(f => ({ ...f, travelStyle: f.travelStyle?.includes(style) ? f.travelStyle.filter(s => s !== style) : [...(f.travelStyle || []), style] }))}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${(form.travelStyle || []).includes(style) ? 'bg-wandr-accent/15 text-wandr-accent border-wandr-accent/30' : 'text-wandr-muted border-wandr-border hover:text-white'}`}>
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {profile.bio && <p className="text-wandr-muted">{profile.bio}</p>}
              {profile.travelStyle?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {profile.travelStyle.map(s => <span key={s} className="badge-gold text-xs">{s}</span>)}
                </div>
              )}
            </>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-5 pt-5 border-t border-wandr-border">
          {[
            { label: 'Followers', value: profile.followers?.length || 0 },
            { label: 'Following', value: profile.following?.length || 0 },
            { label: 'Countries', value: profile.countriesVisited || 0 },
            { label: 'Trips', value: isOwn ? trips.length : (profile.tripsCompleted || 0) },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="font-display text-2xl font-bold text-gradient">{value}</div>
              <div className="text-xs text-wandr-muted mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Trips */}
      {isOwn && trips.length > 0 && (
        <div className="card">
          <h2 className="font-display text-xl text-white font-semibold mb-4">My Trips ({trips.length})</h2>
          <div className="space-y-3">
            {trips.slice(0, 5).map(trip => (
              <div key={trip._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-wandr-blue/20 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-wandr-blue flex items-center justify-center text-lg flex-shrink-0">🗺️</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{trip.name}</div>
                  <div className="text-xs text-wandr-muted">{trip.destinations?.map(d => d.name).join(', ') || 'No destinations'}</div>
                </div>
                <span className={`badge-${trip.status === 'active' ? 'green' : 'blue'} text-xs capitalize`}>{trip.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
