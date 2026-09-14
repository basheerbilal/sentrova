import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  Camera,
  Calendar,
  Layers,
  X,
  Trash2,
  Save,
  CheckCircle2,
  RefreshCw,
  Eye,
  FileText,
} from 'lucide-react';
import { api } from '../../services/api';
import { ApiQuoteLead, ApiPackage } from '../../types';

interface QuotesViewProps {
  initialLead?: ApiQuoteLead | null;
  onClearInitialLead?: () => void;
}

export const QuotesView: React.FC<QuotesViewProps> = ({ initialLead, onClearInitialLead }) => {
  const [leads, setLeads] = useState<ApiQuoteLead[]>([]);
  const [packages, setPackages] = useState<ApiPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [packageFilter, setPackageFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Selected lead for modal/drawer
  const [activeLead, setActiveLead] = useState<ApiQuoteLead | null>(initialLead || null);
  const [editStatus, setEditStatus] = useState<string>('new');
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    if (initialLead) {
      setActiveLead(initialLead);
      setEditStatus(initialLead.status);
      setAdminNotes(initialLead.admin_notes || '');
    }
  }, [initialLead]);

  const loadPackages = async () => {
    try {
      const data = await api.getAdminPackages();
      setPackages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load packages filter:', err);
      setPackages([]);
    }
  };

  const loadLeads = async () => {
    try {
      setLoading(true);
      const data = await api.getQuotes({
        page,
        limit: 15,
        search,
        status: statusFilter,
        package_id: packageFilter,
      });
      setLeads(Array.isArray(data?.records) ? data.records : []);
      setTotalPages(data?.pagination?.total_pages || 1);
      setTotalRecords(data?.pagination?.total || 0);
    } catch (err) {
      console.error('Failed to load quotes:', err);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  useEffect(() => {
    loadLeads();
  }, [page, statusFilter, packageFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadLeads();
  };

  const openLeadModal = (lead: ApiQuoteLead) => {
    setActiveLead(lead);
    setEditStatus(lead.status);
    setAdminNotes(lead.admin_notes || '');
    setSaveSuccess(false);
    setDeleteConfirm(false);
  };

  const closeLeadModal = () => {
    setActiveLead(null);
    if (onClearInitialLead) onClearInitialLead();
  };

  const handleUpdateLead = async () => {
    if (!activeLead) return;
    try {
      setSavingNotes(true);
      const updated = await api.updateQuote(activeLead.id, editStatus, adminNotes);
      setActiveLead(updated);
      setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert('Failed to update lead: ' + err.message);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDeleteLead = async () => {
    if (!activeLead) return;
    try {
      await api.deleteQuote(activeLead.id);
      setLeads((prev) => prev.filter((l) => l.id !== activeLead.id));
      closeLeadModal();
    } catch (err: any) {
      alert('Failed to delete lead: ' + err.message);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-100 text-[#087BFF] border border-blue-200">New Lead</span>;
      case 'contacted':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-purple-100 text-purple-700 border border-purple-200">Contacted</span>;
      case 'in_progress':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-200">In Progress</span>;
      case 'completed':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">Completed</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-red-100 text-red-700 border border-red-200">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#DDE7F5] shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-[#0B1220] tracking-tight">Quote Requests & Leads CRM</h1>
          <p className="text-sm text-[#536176] mt-0.5">
            Manage commercial CCTV monitoring leads, client requirements, and operational status
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 text-xs font-bold text-[#087BFF] bg-blue-50 rounded-xl border border-blue-200/60">
            {totalRecords} Total Leads Found
          </span>
          <button
            onClick={loadLeads}
            className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-[#DDE7F5] transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#DDE7F5] shadow-sm flex flex-col md:flex-row gap-4 justify-between items-stretch">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by business, contact name, email, or phone..."
            className="w-full pl-10 pr-24 py-2 text-sm bg-[#F5F9FF] border border-[#DDE7F5] rounded-xl text-[#0B1220] focus:ring-2 focus:ring-[#087BFF] focus:border-transparent outline-none transition-all"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-[#087BFF] hover:bg-[#0756C9] text-white text-xs font-bold rounded-lg transition-colors"
          >
            Filter
          </button>
        </form>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="py-2 px-3 text-xs font-medium bg-[#F5F9FF] border border-[#DDE7F5] rounded-xl text-[#0B1220] focus:ring-2 focus:ring-[#087BFF] outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="new">New Lead</option>
              <option value="contacted">Contacted</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <select
            value={packageFilter}
            onChange={(e) => {
              setPackageFilter(e.target.value);
              setPage(1);
            }}
            className="py-2 px-3 text-xs font-medium bg-[#F5F9FF] border border-[#DDE7F5] rounded-xl text-[#0B1220] focus:ring-2 focus:ring-[#087BFF] outline-none"
          >
            <option value="all">All Packages</option>
            {packages.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.name} ({pkg.currency}{pkg.price}{pkg.billing_unit})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main CRM Leads Table */}
      <div className="bg-white rounded-2xl border border-[#DDE7F5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F9FF] text-[#536176] uppercase tracking-wider font-semibold border-b border-[#DDE7F5]">
              <tr>
                <th className="px-5 py-3.5">Business & Contact</th>
                <th className="px-4 py-3.5">Contact Details</th>
                <th className="px-4 py-3.5">Package & Cams</th>
                <th className="px-4 py-3.5">Location</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE7F5]/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-[#087BFF] border-t-transparent rounded-full animate-spin" />
                      <span>Loading records...</span>
                    </div>
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[#536176]">
                    No leads found matching your criteria.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-bold text-[#0B1220] block text-sm">{lead.business_name}</span>
                      <span className="text-[#536176] font-medium">{lead.full_name}</span>
                    </td>
                    <td className="px-4 py-4">
                      <a
                        href={`tel:${lead.phone}`}
                        className="text-[#087BFF] hover:underline font-semibold block flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{lead.phone}</span>
                      </a>
                      <a
                        href={`mailto:${lead.email}`}
                        className="text-slate-500 hover:text-[#087BFF] block text-[11px] truncate max-w-[160px]"
                      >
                        {lead.email}
                      </a>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-semibold text-[#0B1220] block">
                        {lead.package_name || 'Standard Package'}
                      </span>
                      <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                        <Camera className="w-3 h-3" /> {lead.camera_count} Cameras
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {lead.location ? (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span className="truncate max-w-[120px]">{lead.location}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(lead.status)}
                    </td>
                    <td className="px-4 py-4 text-slate-500 whitespace-nowrap">
                      {new Date(lead.created_at).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => openLeadModal(lead)}
                        className="px-3 py-1.5 text-xs font-bold text-[#087BFF] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-[#DDE7F5] bg-[#F5F9FF] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#536176]">
          <span>
            Showing Page <strong className="text-[#0B1220]">{page}</strong> of <strong className="text-[#0B1220]">{totalPages}</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 font-bold rounded-lg border border-[#DDE7F5] bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 font-bold rounded-lg border border-[#DDE7F5] bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Lead Details Modal / Drawer */}
      {activeLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-[#DDE7F5] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#DDE7F5] flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#087BFF]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-[#0B1220]">{activeLead.business_name}</h2>
                  <span className="text-xs text-[#536176]">Lead ID #{activeLead.id} • Registered {new Date(activeLead.created_at).toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={closeLeadModal}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Client Profile Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F5F9FF] p-4 rounded-xl border border-[#DDE7F5] text-xs">
                <div>
                  <span className="text-slate-500 uppercase tracking-wider font-semibold text-[10px] block mb-1">Contact Name</span>
                  <span className="text-sm font-bold text-[#0B1220]">{activeLead.full_name}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase tracking-wider font-semibold text-[10px] block mb-1">Phone Number</span>
                  <a href={`tel:${activeLead.phone}`} className="text-sm font-bold text-[#087BFF] hover:underline flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{activeLead.phone}</span>
                  </a>
                </div>
                <div>
                  <span className="text-slate-500 uppercase tracking-wider font-semibold text-[10px] block mb-1">Email Address</span>
                  <a href={`mailto:${activeLead.email}`} className="text-sm font-medium text-[#087BFF] hover:underline flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{activeLead.email}</span>
                  </a>
                </div>
                <div>
                  <span className="text-slate-500 uppercase tracking-wider font-semibold text-[10px] block mb-1">Location / Site Address</span>
                  <span className="text-sm font-medium text-[#0B1220] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{activeLead.location || 'Not specified'}</span>
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase tracking-wider font-semibold text-[10px] block mb-1">Package Selected</span>
                  <span className="text-sm font-bold text-[#087BFF] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>{activeLead.package_name || 'Standard Package'}</span>
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase tracking-wider font-semibold text-[10px] block mb-1">CCTV Cameras to Monitor</span>
                  <span className="text-sm font-bold text-[#0B1220] flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-slate-500" />
                    <span>{activeLead.camera_count} Cameras</span>
                  </span>
                </div>
              </div>

              {/* Customer Message */}
              {activeLead.message && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#536176] mb-1.5">
                    Customer Submitted Message
                  </label>
                  <div className="p-4 rounded-xl bg-white border border-[#DDE7F5] text-xs text-[#0B1220] leading-relaxed">
                    {activeLead.message}
                  </div>
                </div>
              )}

              {/* Status Update Control */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#536176] mb-1.5">
                    CRM Lead Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full py-2.5 px-3 text-sm font-semibold bg-white border border-[#DDE7F5] rounded-xl text-[#0B1220] focus:ring-2 focus:ring-[#087BFF] outline-none"
                  >
                    <option value="new">New Lead</option>
                    <option value="contacted">Contacted</option>
                    <option value="in_progress">In Progress (Audit / Setup)</option>
                    <option value="completed">Completed (Monitored)</option>
                    <option value="cancelled">Cancelled / Unqualified</option>
                  </select>
                </div>
              </div>

              {/* Internal Admin Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#536176] mb-1.5">
                  Internal Operations Notes (Admin Only)
                </label>
                <textarea
                  rows={4}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Record phone discussions, camera model numbers, NVR port info, agreed monitoring schedule..."
                  className="w-full p-3 text-xs bg-white border border-[#DDE7F5] rounded-xl text-[#0B1220] focus:ring-2 focus:ring-[#087BFF] outline-none resize-none leading-relaxed"
                />
              </div>

              {saveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Lead status and operations notes saved successfully!</span>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-5 border-t border-[#DDE7F5] bg-[#F5F9FF] flex items-center justify-between">
              <div>
                {deleteConfirm ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-red-600 font-bold">Are you sure?</span>
                    <button
                      onClick={handleDeleteLead}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-colors"
                    >
                      Yes, Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(false)}
                      className="px-2 py-1 text-slate-500 hover:text-slate-700 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(true)}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Lead</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={closeLeadModal}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 rounded-xl border border-[#DDE7F5] transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleUpdateLead}
                  disabled={savingNotes}
                  className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-[#087BFF] hover:bg-[#0756C9] rounded-xl shadow-md shadow-[#087BFF]/20 transition-all disabled:opacity-50"
                >
                  {savingNotes ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
