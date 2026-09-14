import React, { useState, useEffect } from 'react';
import {
  Shield,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { api } from '../../services/api';
import { ApiService } from '../../types';

export const ServicesView: React.FC = () => {
  const [services, setServices] = useState<ApiService[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ApiService | null>(null);
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('ShieldAlert');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [saving, setSaving] = useState(false);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminServices(search);
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load services:', err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, [search]);

  const openCreateModal = () => {
    setEditingService(null);
    setTitle('');
    setShortDescription('');
    setDescription('');
    setIcon('ShieldAlert');
    setStatus('active');
    setIsModalOpen(true);
  };

  const openEditModal = (s: ApiService) => {
    setEditingService(s);
    setTitle(s.title);
    setShortDescription(s.short_description);
    setDescription(s.description);
    setIcon(s.icon);
    setStatus(s.status);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingService) {
        const updated = await api.updateService(editingService.id, {
          title,
          short_description: shortDescription,
          description,
          icon,
          status,
        });
      } else {
        await api.createService({
          title,
          short_description: shortDescription,
          description,
          icon,
          status,
        });
      }
      closeModal();
      await loadServices();
    } catch (err: any) {
      alert('Failed to save service: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      setLoading(true);
      await api.deleteService(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
      await loadServices();
    } catch (err: any) {
      alert('Failed to delete service: ' + err.message);
      await loadServices();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#DDE7F5] shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-[#0B1220] tracking-tight">CCTV Surveillance Services</h1>
          <p className="text-sm text-[#536176] mt-0.5">
            Manage live monitoring service categories, descriptions, and feature details
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#087BFF] hover:bg-[#0756C9] rounded-xl shadow-md shadow-[#087BFF]/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Service</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#DDE7F5] shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search surveillance services..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-[#F5F9FF] border border-[#DDE7F5] rounded-xl text-[#0B1220] focus:ring-2 focus:ring-[#087BFF] outline-none"
          />
        </div>
        <span className="text-xs font-semibold text-[#536176]">
          {services.length} Services Configured
        </span>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-2xl border border-[#DDE7F5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F9FF] text-[#536176] uppercase tracking-wider font-semibold border-b border-[#DDE7F5]">
              <tr>
                <th className="px-5 py-3.5">Service Title & Slug</th>
                <th className="px-4 py-3.5">Short Description</th>
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
                    <span>Loading services...</span>
                  </td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-[#536176]">
                    No services found.
                  </td>
                </tr>
              ) : (
                services.map((srv) => (
                  <tr key={srv.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-bold text-[#0B1220] block text-sm">{srv.title}</span>
                      <span className="text-slate-400 font-mono text-[11px]">slug: {srv.slug}</span>
                    </td>
                    <td className="px-4 py-4 max-w-sm text-slate-600 line-clamp-2">
                      {srv.short_description}
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-[#087BFF] font-mono text-[11px]">
                        {srv.icon}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                          srv.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {srv.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(srv)}
                          className="px-2.5 py-1.5 text-xs font-bold text-[#087BFF] hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(srv.id)}
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
          <div className="bg-white rounded-2xl border border-[#DDE7F5] shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-5 border-b border-[#DDE7F5] flex items-center justify-between">
              <h2 className="text-lg font-black text-[#0B1220]">
                {editingService ? `Edit: ${editingService.title}` : 'Add New Service'}
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
                  Service Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Shoplifting Monitoring"
                  className="w-full p-2.5 text-sm bg-[#F5F9FF] border border-[#DDE7F5] rounded-xl text-[#0B1220] focus:ring-2 focus:ring-[#087BFF] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#536176] mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  required
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Summary shown on cards..."
                  className="w-full p-2.5 text-xs bg-[#F5F9FF] border border-[#DDE7F5] rounded-xl text-[#0B1220] focus:ring-2 focus:ring-[#087BFF] outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#536176] mb-1">
                  Comprehensive Description / Explore Details
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed operations methodology..."
                  className="w-full p-2.5 text-xs bg-[#F5F9FF] border border-[#DDE7F5] rounded-xl text-[#0B1220] focus:ring-2 focus:ring-[#087BFF] outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#536176] mb-1">
                    Lucide Icon Name
                  </label>
                  <select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full p-2.5 text-xs bg-[#F5F9FF] border border-[#DDE7F5] rounded-xl text-[#0B1220] outline-none"
                  >
                    <option value="ShieldAlert">ShieldAlert</option>
                    <option value="Eye">Eye</option>
                    <option value="Users">Users</option>
                    <option value="AlertTriangle">AlertTriangle</option>
                    <option value="Lock">Lock</option>
                    <option value="Moon">Moon</option>
                    <option value="Radio">Radio</option>
                    <option value="FileText">FileText</option>
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
                  {saving ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
