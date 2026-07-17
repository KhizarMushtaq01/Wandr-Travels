import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { PlusIcon, TrashIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const categories = ['accommodation', 'transport', 'food', 'activities', 'shopping', 'health', 'visa', 'insurance', 'other'];
const catColors = { accommodation: '#e8c27a', transport: '#3b82f6', food: '#10b981', activities: '#8b5cf6', shopping: '#ec4899', health: '#ef4444', visa: '#f59e0b', insurance: '#06b6d4', other: '#6b7280' };
const catIcons = { accommodation: '🏨', transport: '🚌', food: '🍽️', activities: '🎯', shopping: '🛍️', health: '💊', visa: '📋', insurance: '🛡️', other: '📌' };

export default function BudgetPage() {
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [byCategory, setByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ category: 'food', description: '', amount: '', currency: 'USD', date: new Date().toISOString().split('T')[0], notes: '' });

  const fetchData = () => api.get('/budget').then(r => { setExpenses(r.data.expenses || []); setTotal(r.data.total || 0); setByCategory(r.data.byCategory || {}); setLoading(false); }).catch(() => setLoading(false));
  useEffect(() => { fetchData(); }, []);

  const handleAdd = async (e) => { e.preventDefault(); try { await api.post('/budget', form); toast.success('Expense logged!'); setShowAdd(false); fetchData(); } catch (e) {} };
  const handleDelete = async (id) => { await api.delete('/budget/' + id); toast.success('Deleted'); fetchData(); };
  const chartData = Object.entries(byCategory).map(([name, value]) => ({ name, value }));

  if (loading) return React.createElement('div', { className: 'flex justify-center py-20' }, React.createElement('div', { className: 'animate-spin w-8 h-8 border-2 border-wandr-accent border-t-transparent rounded-full' }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="page-header mb-0">
          <h1 className="page-title">Budget Tracker</h1>
          <p className="page-subtitle">Total: <span className="text-wandr-accent font-semibold">${total.toFixed(2)}</span></p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2"><PlusIcon className="w-5 h-5" /> Log Expense</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="font-display text-lg text-white font-semibold mb-4">By Category</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {chartData.map(({ name }) => <Cell key={name} fill={catColors[name] || '#6b7280'} />)}
                </Pie>
                <Tooltip formatter={(v) => '$' + Number(v).toFixed(2)} contentStyle={{ background: '#162444', border: '1px solid #2a3f6b', borderRadius: '8px', color: '#c8d6e8' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="h-48 flex items-center justify-center text-wandr-muted text-sm">No data yet</div>}
          <div className="space-y-2 mt-2">
            {Object.entries(byCategory).map(([cat, amt]) => (
              <div key={cat} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: catColors[cat] }} />
                  <span className="text-wandr-text capitalize">{catIcons[cat]} {cat}</span>
                </div>
                <span className="text-wandr-accent font-medium">${Number(amt).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2 card">
          <h3 className="font-display text-lg text-white font-semibold mb-4">All Expenses</h3>
          {expenses.length === 0 ? (
            <div className="text-center py-10 text-wandr-muted">
              <CurrencyDollarIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No expenses yet.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-hide">
              {expenses.map(exp => (
                <div key={exp._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-wandr-blue/20 transition-colors group">
                  <span className="text-lg">{catIcons[exp.category]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white">{exp.description}</div>
                    <div className="text-xs text-wandr-muted capitalize">{exp.category} - {new Date(exp.date).toLocaleDateString()}</div>
                  </div>
                  <span className="text-wandr-accent font-semibold text-sm">{exp.currency} {exp.amount}</span>
                  <button onClick={() => handleDelete(exp._id)} className="opacity-0 group-hover:opacity-100 p-1 text-wandr-muted hover:text-red-400 transition-all"><TrashIcon className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-xl text-white font-semibold mb-5">Log Expense</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Category</label>
                  <select className="input-field" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {categories.map(c => <option key={c} value={c}>{catIcons[c]} {c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
                <div><label className="label">Date</label><input type="date" className="input-field" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
              </div>
              <div><label className="label">Description *</label><input className="input-field" placeholder="Hotel 3 nights" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Amount *</label><input type="number" step="0.01" className="input-field" placeholder="0.00" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required /></div>
                <div><label className="label">Currency</label>
                  <select className="input-field" value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })}>
                    {['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="label">Notes</label><input className="input-field" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAdd(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Log Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
