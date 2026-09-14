import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  X,
  RefreshCw,
} from 'lucide-react';
import { api } from '../../services/api';
import { ApiIndustry } from '../../types';

export const IndustriesView: React.FC = () => {
  const [industries, setIndustries] = useState<ApiIndustry[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ApiIndustry | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Building2');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [saving, setSaving] = useState(false);

  const loadIndustries = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminIndustries();
      setIndustries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load industries:', err);
      setIndustries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIndustries();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setName('');
    setDescription('');
    setIcon('Building2');
    setStatus('active');
    setIsModalOpen(true);
  };

  const openEditModal = (item: ApiIndustry) => {
    setEditingItem(item);
    setName(item.name);
    setDescription(item.description);
    setIcon(item.icon);
    setStatus(item.status);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingItem) {
        const updated = await api.updateIndustry(editingItem.id, {
          name,
          description,
          icon,
          status,
        });
      } else {
        await api.createIndustry({
          name,
          description,
          icon,
          status,
        });
      }
      closeModal();
      await loadIndustries();
    } catch (err: any) {
      alert('Failed to save industry: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this industry sector?')) return;
    try {
      setLoading(true);
      await api.deleteIndustry(id);
      setIndustries((prev) => prev.filter((ind) => ind.id !== id));
      await loadIndustries();
    } catch (err: any) {
      alert('Failed to delete industry: ' + err.message);
      await loadIndustries();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#DDE7F5] shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-[#0B1220] tracking-tight">Client Industries & Verticals</h1>
          <p className="text-sm text-[#536176] mt-0.5">
            Configure target markets (Retail, Supermarkets, Warehouses, Construction sites)
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#087BFF] hover:bg-[#0756C9] rounded-xl shadow-md shadow-[#087BFF]/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Industry Sector</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#DDE7F5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F9FF] text-[#536176] uppercase tracking-wider font-semibold border-b border-[#DDE7F5]">
              <tr>
                <th className="px-5 py-3.5">Industry Name</th>
                <th className="px-4 py-3.5">Description</th>
                <th className="px-4 py-3.5">Icon</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE7F5]/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                    <div className="w-6 h-6 border-2 border-[#087BFF] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading industries...</span>
                  </td>
                </tr>
              ) : industries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-[#536176]">
                    No industries configured.
                  </td>
                </tr>
              ) : (
                industries.map((ind) => (
                  <tr key={ind.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-5 py-4 font-bold text-[#0B1220] text-sm">
                      {ind.name}
                    </td>
                    <td className="px-4 py-4 text-slate-600 max-w-sm">
                      {ind.description}
                    </td>
                    <td className="px-4 py-4 font-mono text-[11px] text-[#087BFF]">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200">
                        {ind.icon}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                          ind.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {ind.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(ind)}
                          className="px-2.5 py-1.5 text-xs font-bold text-[#087BFF] hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(ind.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-[#DDE7F5] shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-[#DDE7F5] flex items-center justify-between">
              <h2 className="text-lg font-black text-[#0B1220]">
                {editingItem ? `Edit: ${editingItem.name}` : 'Add Industry'}
              </h2>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#536176] mb-1">
                  Industry Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Warehouses & Logistics"
                  className="w-full p-2.5 text-sm bg-[#F5F9FF] border border-[#DDE7F5] rounded-xl text-[#0B1220] focus:ring-2 focus:ring-[#087BFF] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#536176] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Vulnerability overview..."
                  className="w-full p-2.5 text-xs bg-[#F5F9FF] border border-[#DDE7F5] rounded-xl text-[#0B1220] focus:ring-2 focus:ring-[#087BFF] outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#536176] mb-1">
                    Lucide Icon
                  </label>
                  <select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full p-2.5 text-xs bg-[#F5F9FF] border border-[#DDE7F5] rounded-xl text-[#0B1220] outline-none"
                  >
                    <option value="ShoppingBag">ShoppingBag</option>
                    <option value="Store">Store</option>
                    <option value="Clock">Clock</option>
                    <option value="Boxes">Boxes</option>
                    <option value="Building2">Building2</option>
                    <option value="UtensilsCrossed">UtensilsCrossed</option>
                    <option value="Building">Building</option>
                    <option value="Wrench">Wrench</option>
                    <option value="HardHat">HardHat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#536176] mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full p-2.5 text-xs bg-[#F5F9FF] border border-[#DDE7F5] rounded-xl text-[#0B1220] outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#DDE7F5]">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 border border-[#DDE7F5] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#087BFF] hover:bg-[#0756C9] rounded-xl shadow-md shadow-[#087BFF]/20"
                >
                  {saving ? 'Saving...' : 'Save Industry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
