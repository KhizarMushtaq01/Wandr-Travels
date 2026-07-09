import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { PlusIcon, TrashIcon, CheckIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

const templates = {
  beach: ['Sunscreen', 'Swimsuit', 'Flip flops', 'Sunglasses', 'Beach towel', 'Hat'],
  mountains: ['Hiking boots', 'Layers', 'Rain jacket', 'Trekking poles', 'First aid kit'],
  city: ['Comfortable shoes', 'City map', 'Day bag', 'Umbrella', 'Power bank'],
  business: ['Laptop', 'Business cards', 'Dress shoes', 'Suit', 'Chargers'],
  camping: ['Tent', 'Sleeping bag', 'Flashlight', 'Camp stove', 'Water filter'],
};
const defaultCategories = ['Clothing', 'Toiletries', 'Electronics', 'Documents', 'Health', 'Accessories', 'General'];

export default function PackingPage() {
  const [lists, setLists] = useState([]);
  const [activeList, setActiveList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNewList, setShowNewList] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListTemplate, setNewListTemplate] = useState('custom');
  const [newItem, setNewItem] = useState({ name: '', category: 'General', quantity: 1, isEssential: false });

  const fetchLists = () => api.get('/packing').then(r => { const l = r.data.lists || []; setLists(l); if (l.length > 0 && !activeList) setActiveList(l[0]); setLoading(false); }).catch(() => setLoading(false));
  useEffect(() => { fetchLists(); }, []);

  const handleCreateList = async (e) => {
    e.preventDefault();
    const items = newListTemplate !== 'custom' ? (templates[newListTemplate] || []).map(name => ({ name, category: 'General', quantity: 1 })) : [];
    try {
      const r = await api.post('/packing', { name: newListName, template: newListTemplate, items });
      toast.success('Packing list created!');
      setShowNewList(false);
      setNewListName('');
      fetchLists();
      setActiveList(r.data.list);
    } catch (e) {}
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!activeList) return;
    try {
      const updatedItems = [...(activeList.items || []), newItem];
      const r = await api.put('/packing/' + activeList._id, { items: updatedItems });
      setActiveList(r.data.list);
      setLists(l => l.map(x => x._id === r.data.list._id ? r.data.list : x));
      setShowAddItem(false);
      setNewItem({ name: '', category: 'General', quantity: 1, isEssential: false });
      toast.success('Item added!');
    } catch (e) {}
  };

  const toggleItem = async (itemId) => {
    if (!activeList) return;
    try {
      const r = await api.patch('/packing/' + activeList._id + '/items/' + itemId + '/toggle');
      setActiveList(r.data.list);
      setLists(l => l.map(x => x._id === r.data.list._id ? r.data.list : x));
    } catch (e) {}
  };

  const deleteItem = async (itemId) => {
    if (!activeList) return;
    const updatedItems = activeList.items.filter(i => i._id !== itemId);
    try {
      const r = await api.put('/packing/' + activeList._id, { items: updatedItems });
      setActiveList(r.data.list);
      setLists(l => l.map(x => x._id === r.data.list._id ? r.data.list : x));
    } catch (e) {}
  };

  const deleteList = async (id) => {
    if (!window.confirm('Delete this list?')) return;
    await api.delete('/packing/' + id);
    toast.success('List deleted');
    const remaining = lists.filter(l => l._id !== id);
    setLists(remaining);
    setActiveList(remaining[0] || null);
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-wandr-accent border-t-transparent rounded-full" /></div>;

  const packed = activeList?.items?.filter(i => i.isPacked).length || 0;
  const total = activeList?.items?.length || 0;
  const progress = total > 0 ? Math.round((packed / total) * 100) : 0;

  const itemsByCategory = activeList?.items?.reduce((acc, item) => {
    const cat = item.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {}) || {};

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="page-header mb-0">
          <h1 className="page-title">Packing Lists</h1>
          <p className="page-subtitle">Never forget the essentials</p>
        </div>
        <button onClick={() => setShowNewList(true)} className="btn-primary flex items-center gap-2"><PlusIcon className="w-5 h-5" /> New List</button>
      </div>

      {lists.length === 0 ? (
        <div className="card text-center py-16">
          <ShoppingBagIcon className="w-14 h-14 mx-auto mb-4 text-wandr-muted opacity-30" />
          <h3 className="text-white font-semibold text-lg mb-2">No packing lists yet</h3>
          <button onClick={() => setShowNewList(true)} className="btn-primary mt-2 inline-flex items-center gap-2"><PlusIcon className="w-4 h-4" /> Create List</button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-5">
          {/* List sidebar */}
          <div className="lg:w-56 flex-shrink-0">
            <div className="card p-3 space-y-1">
              <div className="text-xs text-wandr-muted uppercase tracking-widest px-2 mb-2">My Lists</div>
              {lists.map(list => {
                const p = list.items?.filter(i => i.isPacked).length || 0;
                const t = list.items?.length || 0;
                return (
                  <button key={list._id} onClick={() => setActiveList(list)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all group flex items-center justify-between ${activeList?._id === list._id ? 'bg-wandr-accent/15 text-wandr-accent border border-wandr-accent/20' : 'text-wandr-muted hover:text-white hover:bg-white/5'}`}>
                    <div>
                      <div className="font-medium">{list.name}</div>
                      <div className="text-xs opacity-70">{p}/{t} packed</div>
                    </div>
                    <button onClick={e => { e.stopPropagation(); deleteList(list._id); }} className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all"><TrashIcon className="w-3.5 h-3.5" /></button>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active list */}
          {activeList && (
            <div className="flex-1 card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-display text-2xl text-white font-semibold">{activeList.name}</h2>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex-1 max-w-xs bg-wandr-border rounded-full h-2">
                      <div className="bg-wandr-accent h-2 rounded-full transition-all" style={{ width: progress + '%' }} />
                    </div>
                    <span className="text-sm text-wandr-muted">{packed}/{total} packed ({progress}%)</span>
                  </div>
                </div>
                <button onClick={() => setShowAddItem(true)} className="btn-primary text-sm px-4 py-2 flex items-center gap-2"><PlusIcon className="w-4 h-4" /> Add Item</button>
              </div>

              {Object.entries(itemsByCategory).map(([cat, items]) => (
                <div key={cat} className="mb-5">
                  <div className="text-xs text-wandr-muted uppercase tracking-widest mb-2 px-1">{cat}</div>
                  <div className="space-y-2">
                    {items.map(item => (
                      <div key={item._id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${item.isPacked ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-wandr-border bg-wandr-blue/20 hover:border-wandr-accent/30'}`}>
                        <button onClick={() => toggleItem(item._id)} className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${item.isPacked ? 'bg-emerald-500 border-emerald-500' : 'border-wandr-border hover:border-wandr-accent'}`}>
                          {item.isPacked && <CheckIcon className="w-3.5 h-3.5 text-white" />}
                        </button>
                        <span className={`flex-1 text-sm ${item.isPacked ? 'line-through text-wandr-muted' : 'text-white'}`}>{item.name}</span>
                        {item.isEssential && <span className="text-xs text-orange-400 border border-orange-400/30 bg-orange-400/10 px-1.5 py-0.5 rounded">Essential</span>}
                        {item.quantity > 1 && <span className="text-xs text-wandr-muted">x{item.quantity}</span>}
                        <button onClick={() => deleteItem(item._id)} className="p-1 text-wandr-muted hover:text-red-400 transition-colors"><TrashIcon className="w-3.5 h-3.5" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showNewList && (
        <div className="modal-overlay" onClick={() => setShowNewList(false)}>
          <div className="modal-content p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-xl text-white font-semibold mb-5">New Packing List</h3>
            <form onSubmit={handleCreateList} className="space-y-4">
              <div><label className="label">List Name *</label><input className="input-field" placeholder="Thailand Trip 2025" value={newListName} onChange={e => setNewListName(e.target.value)} required /></div>
              <div>
                <label className="label">Start from Template</label>
                <div className="grid grid-cols-3 gap-2">
                  {['custom', 'beach', 'mountains', 'city', 'business', 'camping'].map(t => (
                    <button key={t} type="button" onClick={() => setNewListTemplate(t)} className={`px-3 py-2 rounded-xl text-sm capitalize border transition-all ${newListTemplate === t ? 'bg-wandr-accent/15 text-wandr-accent border-wandr-accent/30' : 'border-wandr-border text-wandr-muted hover:text-white'}`}>{t}</button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowNewList(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Create List</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddItem && (
        <div className="modal-overlay" onClick={() => setShowAddItem(false)}>
          <div className="modal-content p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-xl text-white font-semibold mb-5">Add Item</h3>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div><label className="label">Item Name *</label><input className="input-field" placeholder="Sunscreen SPF 50" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Category</label>
                  <select className="input-field" value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })}>
                    {defaultCategories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div><label className="label">Quantity</label><input type="number" min="1" className="input-field" value={newItem.quantity} onChange={e => setNewItem({ ...newItem, quantity: Number(e.target.value) })} /></div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-wandr-blue/20 border border-wandr-border">
                <input type="checkbox" id="essential" checked={newItem.isEssential} onChange={e => setNewItem({ ...newItem, isEssential: e.target.checked })} className="w-4 h-4 accent-wandr-accent" />
                <label htmlFor="essential" className="text-sm text-wandr-text cursor-pointer">Mark as essential</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddItem(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Add Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
