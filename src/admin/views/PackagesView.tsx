import React, { useState, useEffect } from 'react';
import {
  Layers,
  Edit2,
  Plus,
  Trash2,
  Check,
  X,
  CheckCircle2,
  Sparkles,
  DollarSign,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { api } from '../../services/api';
import { ApiPackage, ApiPackageFeature } from '../../types';

export const PackagesView: React.FC = () => {
  const [packages, setPackages] = useState<ApiPackage[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit package modal
  const [editingPkg, setEditingPkg] = useState<ApiPackage | null>(null);
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [currency, setCurrency] = useState('$');
  const [billingUnit, setBillingUnit] = useState('/HR');
  const [description, setDescription] = useState('');
  const [popular, setPopular] = useState(false);
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [savingPkg, setSavingPkg] = useState(false);

  // Add feature input state
  const [newFeatureText, setNewFeatureText] = useState<{ [packageId: number]: string }>({});
  const [addingFeature, setAddingFeature] = useState<{ [packageId: number]: boolean }>({});

  const loadPackages = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminPackages();
      setPackages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load packages:', err);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const openEditModal = (pkg: ApiPackage) => {
    setEditingPkg(pkg);
    setName(pkg.name);
    setSubtitle(pkg.subtitle);
    setPrice(pkg.price);
    setCurrency(pkg.currency);
    setBillingUnit(pkg.billing_unit);
    setDescription(pkg.description);
    setPopular(pkg.popular);
    setStatus(pkg.status);
  };

  const closeEditModal = () => {
    setEditingPkg(null);
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPkg) return;
    try {
      setSavingPkg(true);
      const updated = await api.updatePackage(editingPkg.id, {
        name,
        subtitle,
        price,
        currency,
        billing_unit: billingUnit,
        description,
        popular,
        status,
      });

      setPackages((prev) =>
        prev.map((p) => (p.id === updated.id ? { ...updated, features: p.features } : p))
      );
      closeEditModal();
    } catch (err: any) {
      alert('Failed to save package: ' + err.message);
    } finally {
      setSavingPkg(false);
    }
  };

  const handleAddFeature = async (pkgId: number) => {
    const text = (newFeatureText[pkgId] || '').trim();
    if (!text) return;

    try {
      setAddingFeature((prev) => ({ ...prev, [pkgId]: true }));
      const newFeature = await api.addPackageFeature(pkgId, text);
      setPackages((prev) =>
        prev.map((p) => (p.id === pkgId ? { ...p, features: [...(p.features || []), newFeature] } : p))
      );
      setNewFeatureText((prev) => ({ ...prev, [pkgId]: '' }));
    } catch (err: any) {
      alert('Failed to add feature: ' + err.message);
    } finally {
      setAddingFeature((prev) => ({ ...prev, [pkgId]: false }));
    }
  };

  const handleDeleteFeature = async (pkgId: number, featureId: number) => {
    if (!confirm('Are you sure you want to remove this surveillance feature?')) return;
    try {
      await api.deletePackageFeature(featureId);
      setPackages((prev) =>
        prev.map((p) =>
          p.id === pkgId
            ? { ...p, features: (p.features || []).filter((f) => f.id !== featureId) }
            : p
        )
      );
    } catch (err: any) {
      alert('Failed to delete feature: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#DDE7F5] shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-[#0B1220] tracking-tight">Hourly Packages & Deliverables</h1>
          <p className="text-sm text-[#536176] mt-0.5">
            Configure CCTV surveillance pricing tiers, hourly rates, and deliverables checklist
          </p>
        </div>
        <button
          onClick={loadPackages}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-[#DDE7F5] transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reload</span>
        </button>
      </div>

      {/* Package Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500">
          <div className="w-8 h-8 border-2 border-[#087BFF] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <span>Loading packages configuration...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-white rounded-2xl border transition-all flex flex-col ${
                pkg.popular
                  ? 'border-[#087BFF] shadow-lg shadow-blue-500/10'
                  : 'border-[#DDE7F5] shadow-sm'
              }`}
            >
              {/* Package Header Card */}
              <div className="p-6 border-b border-[#DDE7F5] relative">
                {pkg.popular && (
                  <span className="absolute top-4 right-4 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#087BFF] bg-blue-50 border border-blue-200 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Most Popular
                  </span>
                )}

                <span className="text-xs font-black tracking-widest uppercase text-[#087BFF] block">
                  {pkg.name}
                </span>
                <h3 className="text-xl font-bold text-[#0B1220] mt-1">{pkg.subtitle}</h3>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-[#0B1220]">
                    {pkg.currency}{pkg.price.toFixed(2)}
                  </span>
                  <span className="text-xs font-bold text-[#536176]">{pkg.billing_unit}</span>
                </div>

                <p className="mt-2 text-xs text-[#536176] leading-relaxed line-clamp-2">
                  {pkg.description}
                </p>

                <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
                  <span
                    className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full ${
                      pkg.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {pkg.status === 'active' ? 'Active on Website' : 'Inactive'}
                  </span>

                  <button
                    onClick={() => openEditModal(pkg)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#087BFF] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit Tier</span>
                  </button>
                </div>
              </div>

              {/* Package Features List */}
              <div className="p-6 flex-1 flex flex-col justify-between bg-[#F5F9FF]/40">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#536176]">
                      Included Features ({(pkg.features || []).length})
                    </span>
                  </div>

                  <ul className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                    {(pkg.features || []).map((feat) => (
                      <li
                        key={feat.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#DDE7F5] text-xs text-[#0B1220] group"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          <span>{feat.feature}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteFeature(pkg.id, feat.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 rounded transition-opacity"
                          title="Remove feature"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Add Feature Form */}
                <div className="mt-4 pt-4 border-t border-[#DDE7F5]">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add surveillance feature..."
                      value={newFeatureText[pkg.id] || ''}
                      onChange={(e) =>
                        setNewFeatureText((prev) => ({ ...prev, [pkg.id]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddFeature(pkg.id);
                        }
                      }}
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#DDE7F5] rounded-lg text-[#0B1220] focus:ring-2 focus:ring-[#087BFF] outline-none"
                    />
                    <button
                      onClick={() => handleAddFeature(pkg.id)}
                      disabled={addingFeature[pkg.id]}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-[#087BFF] hover:bg-[#0756C9] rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Package Modal */}
      {editingPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-[#DDE7F5] shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-5 border-b border-[#DDE7F5] flex items-center justify-between">
              <h2 className="text-lg font-black text-[#0B1220]">Edit Package: {editingPkg.name}</h2>
              <button
                onClick={closeEditModal}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePackage} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#536176] mb-1">
                  Package Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 text-sm bg-[#F5F9FF] border border-[#DDE7F5] rounded-xl text-[#0B1220] focus:ring-2 focus:ring-[#087BFF] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#536176] mb-1">
                  Subtitle / Focus
                </label>
                <input
                  type="text"
                  required
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full p-2.5 text-sm bg-[#F5F9FF] border border-[#DDE7F5] rounded-xl text-[#0B1220] focus:ring-2 focus:ring-[#087BFF] outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#536176] mb-1">
                    Hourly Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 text-sm bg-[#F5F9FF] border border-[#DDE7F5] rounded-xl text-[#0B1220] focus:ring-2 focus:ring-[#087BFF] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#536176] mb-1">
                    Currency Symbol
                  </label>
                  <input
                    type="text"
                    required
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full p-2.5 text-sm bg-[#F5F9FF] border border-[#DDE7F5] rounded-xl text-[#0B1220] focus:ring-2 focus:ring-[#087BFF] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#536176] mb-1">
                    Billing Unit
                  </label>
                  <input
                    type="text"
                    required
                    value={billingUnit}
                    onChange={(e) => setBillingUnit(e.target.value)}
                    className="w-full p-2.5 text-sm bg-[#F5F9FF] border border-[#DDE7F5] rounded-xl text-[#0B1220] focus:ring-2 focus:ring-[#087BFF] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#536176] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 text-xs bg-[#F5F9FF] border border-[#DDE7F5] rounded-xl text-[#0B1220] focus:ring-2 focus:ring-[#087BFF] outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F5F9FF] border border-[#DDE7F5]">
                <div>
                  <span className="text-xs font-bold text-[#0B1220] block">Highlight as Most Popular</span>
                  <span className="text-[11px] text-[#536176]">Displays blue border and highlight badge</span>
                </div>
                <input
                  type="checkbox"
                  checked={popular}
                  onChange={(e) => setPopular(e.target.checked)}
                  className="w-4 h-4 text-[#087BFF] rounded"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#536176] mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full p-2.5 text-sm bg-[#F5F9FF] border border-[#DDE7F5] rounded-xl text-[#0B1220] outline-none"
                >
                  <option value="active">Active (Visible on Website)</option>
                  <option value="inactive">Inactive (Hidden)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#DDE7F5]">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 border border-[#DDE7F5] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPkg}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#087BFF] hover:bg-[#0756C9] rounded-xl shadow-md shadow-[#087BFF]/20"
                >
                  {savingPkg ? 'Saving...' : 'Save Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
