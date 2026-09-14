import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  X,
} from 'lucide-react';
import { api } from '../../services/api';
import { ApiFaq } from '../../types';

export const FaqsView: React.FC = () => {
  const [faqs, setFaqs] = useState<ApiFaq[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<ApiFaq | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [saving, setSaving] = useState(false);

  const loadFaqs = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminFaqs();
      setFaqs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load FAQs:', err);
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const openCreateModal = () => {
    setEditingFaq(null);
    setQuestion('');
    setAnswer('');
    setStatus('active');
    setIsModalOpen(true);
  };

  const openEditModal = (faq: ApiFaq) => {
    setEditingFaq(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setStatus(faq.status);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFaq(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingFaq) {
        await api.updateFaq(editingFaq.id, {
          question,
          answer,
          status,
        });
      } else {
        await api.createFaq({
          question,
          answer,
          status,
        });
      }
      closeModal();
      await loadFaqs();
    } catch (err: any) {
      alert('Failed to save FAQ: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this FAQ item?')) return;
    try {
      setLoading(true);
      await api.deleteFaq(id);
      setFaqs((prev) => prev.filter((f) => f.id !== id));
      await loadFaqs();
    } catch (err: any) {
      alert('Failed to delete FAQ: ' + err.message);
      await loadFaqs();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#DDE7F5] shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-[#0B1220] tracking-tight">Frequently Asked Questions</h1>
          <p className="text-sm text-[#536176] mt-0.5">
            Manage customer clarifications, hardware compatibility details, and contract transparency
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#087BFF] hover:bg-[#0756C9] rounded-xl shadow-md shadow-[#087BFF]/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add FAQ</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#DDE7F5] shadow-sm overflow-hidden">
        <div className="divide-y divide-[#DDE7F5]/60">
          {loading ? (
            <div className="p-12 text-center text-slate-500">
              <div className="w-6 h-6 border-2 border-[#087BFF] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span>Loading questions...</span>
            </div>
          ) : faqs.length === 0 ? (
            <div className="p-12 text-center text-[#536176]">No FAQs configured.</div>
          ) : (
            faqs.map((faq) => (
              <div key={faq.id} className="p-5 hover:bg-blue-50/30 transition-colors flex items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#0B1220] text-sm">{faq.question}</span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        faq.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {faq.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#536176] leading-relaxed max-w-3xl">{faq.answer}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEditModal(faq)}
                    className="p-1.5 text-[#087BFF] hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-[#DDE7F5] shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-5 border-b border-[#DDE7F5] flex items-center justify-between">
              <h2 className="text-lg font-black text-[#0B1220]">
                {editingFaq ? 'Edit FAQ' : 'Add FAQ'}
              </h2>
              <button onClick={closeModal} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#536176] mb-1">
                  Question
                </label>
                <input
                  type="text"
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full p-2.5 text-sm bg-[#F5F9FF] border border-[#DDE7F5] rounded-xl text-[#0B1220] focus:ring-2 focus:ring-[#087BFF] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#536176] mb-1">
                  Answer
                </label>
                <textarea
                  rows={4}
                  required
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full p-2.5 text-xs bg-[#F5F9FF] border border-[#DDE7F5] rounded-xl text-[#0B1220] focus:ring-2 focus:ring-[#087BFF] outline-none resize-none leading-relaxed"
                />
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
                  {saving ? 'Saving...' : 'Save FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
