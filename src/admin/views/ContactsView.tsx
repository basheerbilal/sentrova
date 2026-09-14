import React, { useState, useEffect } from 'react';
import {
  Mail,
  Phone,
  Trash2,
  X,
  CheckCircle2,
  Save,
  Clock,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { api } from '../../services/api';
import { ApiContactMessage } from '../../types';

export const ContactsView: React.FC = () => {
  const [messages, setMessages] = useState<ApiContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // Active message modal
  const [activeMsg, setActiveMsg] = useState<ApiContactMessage | null>(null);
  const [editStatus, setEditStatus] = useState<string>('new');
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [saving, setSaving] = useState(false);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await api.getContacts({ status: statusFilter });
      setMessages(Array.isArray(data?.records) ? data.records : []);
    } catch (err) {
      console.error('Failed to load contact messages:', err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [statusFilter]);

  const openModal = (msg: ApiContactMessage) => {
    setActiveMsg(msg);
    setEditStatus(msg.status);
    setAdminNotes(msg.admin_notes || '');
  };

  const closeModal = () => {
    setActiveMsg(null);
  };

  const handleUpdate = async () => {
    if (!activeMsg) return;
    try {
      setSaving(true);
      const updated = await api.updateContact(activeMsg.id, editStatus, adminNotes);
      setMessages((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      setActiveMsg(updated);
      closeModal();
    } catch (err: any) {
      alert('Failed to update message: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await api.deleteContact(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (activeMsg?.id === id) closeModal();
    } catch (err: any) {
      alert('Failed to delete message: ' + err.message);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-100 text-[#087BFF] border border-blue-200">New Message</span>;
      case 'read':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-700">Read</span>;
      case 'replied':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800">Replied</span>;
      case 'archived':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-purple-100 text-purple-700">Archived</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#DDE7F5] shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-[#0B1220] tracking-tight">Direct Contact Inquiries</h1>
          <p className="text-sm text-[#536176] mt-0.5">
            Website general communications, technical questions, and support requests
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 text-xs font-medium bg-[#F5F9FF] border border-[#DDE7F5] rounded-xl text-[#0B1220] outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>
          <button
            onClick={loadMessages}
            className="p-2 text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-[#DDE7F5]"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#DDE7F5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F9FF] text-[#536176] uppercase tracking-wider font-semibold border-b border-[#DDE7F5]">
              <tr>
                <th className="px-5 py-3.5">Sender</th>
                <th className="px-4 py-3.5">Subject & Preview</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Received</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE7F5]/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                    <div className="w-6 h-6 border-2 border-[#087BFF] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading messages...</span>
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-[#536176]">
                    No messages found.
                  </td>
                </tr>
              ) : (
                messages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-bold text-[#0B1220] block text-sm">{msg.full_name}</span>
                      <span className="text-[#087BFF] font-medium">{msg.email}</span>
                      {msg.phone && <span className="text-slate-400 block text-[11px]">{msg.phone}</span>}
                    </td>
                    <td className="px-4 py-4 max-w-md">
                      <span className="font-semibold text-[#0B1220] block">{msg.subject}</span>
                      <p className="text-slate-500 truncate text-[11px] mt-0.5">{msg.message}</p>
                    </td>
                    <td className="px-4 py-4">{getStatusBadge(msg.status)}</td>
                    <td className="px-4 py-4 text-slate-500 whitespace-nowrap">
                      {new Date(msg.created_at).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => openModal(msg)}
                        className="px-3 py-1.5 text-xs font-bold text-[#087BFF] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {activeMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-[#DDE7F5] shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-5 border-b border-[#DDE7F5] flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-[#0B1220]">{activeMsg.subject}</h2>
                <span className="text-xs text-slate-500">From {activeMsg.full_name} • {new Date(activeMsg.created_at).toLocaleString()}</span>
              </div>
              <button onClick={closeModal} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 bg-[#F5F9FF] rounded-xl border border-[#DDE7F5] text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Email:</span>
                  <a href={`mailto:${activeMsg.email}`} className="font-bold text-[#087BFF] hover:underline">
                    {activeMsg.email}
                  </a>
                </div>
                {activeMsg.phone && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Phone:</span>
                    <a href={`tel:${activeMsg.phone}`} className="font-bold text-[#087BFF] hover:underline">
                      {activeMsg.phone}
                    </a>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#536176] mb-1">
                  Message Body
                </label>
                <div className="p-4 rounded-xl bg-white border border-[#DDE7F5] text-xs text-[#0B1220] leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto">
                  {activeMsg.message}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#536176] mb-1">
                  Message Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full p-2.5 text-sm bg-[#F5F9FF] border border-[#DDE7F5] rounded-xl text-[#0B1220] outline-none"
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#536176] mb-1">
                  Internal Notes
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Record internal response notes..."
                  className="w-full p-2.5 text-xs bg-[#F5F9FF] border border-[#DDE7F5] rounded-xl text-[#0B1220] outline-none resize-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-[#DDE7F5]">
                <button
                  type="button"
                  onClick={() => handleDelete(activeMsg.id)}
                  className="px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 border border-[#DDE7F5] rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdate}
                    disabled={saving}
                    className="px-5 py-2 text-xs font-bold text-white bg-[#087BFF] hover:bg-[#0756C9] rounded-xl shadow-md shadow-[#087BFF]/20"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
