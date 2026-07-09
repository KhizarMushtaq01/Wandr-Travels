import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { MagnifyingGlassIcon, ShieldCheckIcon, NoSymbolIcon, UserIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (search) params.set('search', search);
      if (roleFilter) params.set('role', roleFilter);
      const r = await api.get('/users?' + params.toString());
      setUsers(r.data.users || []);
      setTotal(r.data.total || 0);
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, [page, roleFilter]);

  const handleSearch = (e) => { e.preventDefault(); fetchUsers(); };

  const toggleStatus = async (userId, isActive) => {
    try {
      await api.patch('/users/' + userId + '/status');
      setUsers(u => u.map(x => x._id === userId ? { ...x, isActive: !x.isActive } : x));
      toast.success(isActive ? 'User deactivated' : 'User activated');
    } catch (e) {}
  };

  const changeRole = async (userId, role) => {
    try {
      await api.patch('/users/' + userId + '/role', { role });
      setUsers(u => u.map(x => x._id === userId ? { ...x, role } : x));
      toast.success('Role updated');
    } catch (e) {}
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Users Management</h1>
        <p className="page-subtitle">{total} total users</p>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-wandr-muted" />
              <input className="input-field pl-10" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button type="submit" className="btn-primary px-4">Search</button>
          </form>
          <select className="input-field sm:w-36" value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}>
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Superadmin</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-10"><div className="animate-spin w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-wandr-border">
                  <th className="table-header text-left">User</th>
                  <th className="table-header text-left hidden md:table-cell">Joined</th>
                  <th className="table-header text-left hidden sm:table-cell">Role</th>
                  <th className="table-header text-left">Status</th>
                  <th className="table-header text-left">Plan</th>
                  <th className="table-header text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        {u.avatar ? <img src={u.avatar} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" /> : <div className="w-8 h-8 rounded-full bg-wandr-mid flex items-center justify-center text-xs font-semibold text-wandr-accent flex-shrink-0">{u.firstName?.[0]}</div>}
                        <div>
                          <div className="text-white font-medium text-sm">{u.firstName} {u.lastName}</div>
                          <div className="text-wandr-muted text-xs">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell hidden md:table-cell text-wandr-muted text-sm">{format(new Date(u.createdAt), 'MMM d, yyyy')}</td>
                    <td className="table-cell hidden sm:table-cell">
                      <select value={u.role} onChange={e => changeRole(u._id, e.target.value)}
                        className="text-xs bg-wandr-blue border border-wandr-border text-wandr-text rounded-lg px-2 py-1 focus:outline-none focus:border-purple-400">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">Superadmin</option>
                      </select>
                    </td>
                    <td className="table-cell">
                      <span className={`badge-${u.isActive ? 'green' : 'red'} text-xs`}>{u.isActive ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td className="table-cell">
                      <span className={`badge-${u.subscriptionPlan === 'pro' ? 'gold' : u.subscriptionPlan === 'premium' ? 'red' : 'blue'} text-xs capitalize`}>{u.subscriptionPlan}</span>
                    </td>
                    <td className="table-cell text-right">
                      <button onClick={() => toggleStatus(u._id, u.isActive)}
                        className={`p-1.5 rounded-lg transition-colors ${u.isActive ? 'text-wandr-muted hover:text-red-400 hover:bg-red-500/10' : 'text-wandr-muted hover:text-emerald-400 hover:bg-emerald-500/10'}`}
                        title={u.isActive ? 'Deactivate' : 'Activate'}>
                        {u.isActive ? <NoSymbolIcon className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-wandr-border">
          <span className="text-sm text-wandr-muted">Showing {users.length} of {total}</span>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary text-sm px-3 py-1.5 disabled:opacity-40">← Prev</button>
            <span className="px-3 py-1.5 text-sm text-wandr-muted">Page {page}</span>
            <button disabled={users.length < 20} onClick={() => setPage(p => p + 1)} className="btn-secondary text-sm px-3 py-1.5 disabled:opacity-40">Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
