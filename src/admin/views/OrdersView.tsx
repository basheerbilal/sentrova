import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Printer,
  RefreshCw,
  TrendingUp,
  Shield,
  Download,
  Building,
  DollarSign,
  Calendar,
  X,
} from 'lucide-react';
import { api } from '../../services/api';
import { ApiPaymentOrder } from '../../types';
import { generateInvoicePdf } from '../../utils/invoicePdf';

export const OrdersView: React.FC = () => {
  const [orders, setOrders] = useState<ApiPaymentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [summary, setSummary] = useState({
    total_orders: 0,
    total_revenue: 0,
    total_hours: 0,
    paid_orders: 0,
  });
  const [selectedOrder, setSelectedOrder] = useState<ApiPaymentOrder | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [newStatus, setNewStatus] = useState<string>('paid');
  const [adminNotes, setAdminNotes] = useState<string>('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminOrders({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: search.trim() || undefined,
      });
      setOrders(res.records || []);
      setSummary(res.summary || {
        total_orders: 0,
        total_revenue: 0,
        total_hours: 0,
        paid_orders: 0,
      });
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleOpenDetail = (order: ApiPaymentOrder) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setAdminNotes(order.admin_notes || '');
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    setUpdatingId(selectedOrder.id);
    try {
      const updated = await api.updateAdminOrderStatus(selectedOrder.id, newStatus, adminNotes);
      setSelectedOrder(updated);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Summary Cards */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0B1220] tracking-tight">Payments & Retainers</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time surveillance hourly bookings, gateway transactions, and customer tax invoices.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Records</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#DDE7F5] shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#0B1220] font-mono">
            ${summary.total_revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Active surveillance retainers</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#DDE7F5] shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Hours Purchased</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#087BFF] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#0B1220] font-mono">
            {summary.total_hours.toLocaleString()} hrs
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Across active commercial accounts
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#DDE7F5] shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Completed Orders</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#0B1220] font-mono">
            {summary.paid_orders}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Paid & onboarded retainers
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#DDE7F5] shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Payment Gateway</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0756C9] flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-sm font-black text-[#0B1220] flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Stripe 256-Bit Gateway</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Cards, Apple Pay, Google Pay
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#DDE7F5] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search company, email, invoice..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-[#087BFF]"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="active">Active (Onboarded)</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#DDE7F5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#DDE7F5] text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Customer & Company</th>
                <th className="py-3.5 px-4">Surveillance Tier</th>
                <th className="py-3.5 px-4">Hours</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#087BFF]" />
                    <span>Loading payment transactions...</span>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <CreditCard className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-600">No payment orders found</p>
                    <p className="text-[11px] text-slate-400 mt-1">Orders processed through the checkout gateway will appear here.</p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const isPaid = order.status === 'paid' || order.status === 'active';
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#087BFF]">
                        {order.invoice_number}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#0B1220]">{order.company_name}</div>
                        <div className="text-[11px] text-slate-500">{order.contact_name} • {order.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-700 uppercase bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                          {order.package_slug} (${order.hourly_rate.toFixed(2)}/hr)
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0B1220]">
                        {order.hours_purchased} hrs
                      </td>
                      <td className="py-3.5 px-4 font-mono font-black text-slate-900">
                        ${order.total_amount.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                            order.status === 'paid' || order.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : order.status === 'pending'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => generateInvoicePdf(order)}
                            title="Download Official PDF Invoice"
                            className="px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:text-[#087BFF] hover:bg-blue-50 border border-slate-200 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer shadow-2xs"
                          >
                            <Download className="w-3.5 h-3.5 text-[#087BFF]" />
                            <span>PDF</span>
                          </button>
                          <button
                            onClick={() => handleOpenDetail(order)}
                            className="px-2.5 py-1.5 text-xs font-bold text-[#087BFF] hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice & Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-[#0B1220] to-[#162544] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#087BFF]/20 border border-[#087BFF]/40 flex items-center justify-center text-[#38BDF8]">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Commercial Surveillance Invoice</h3>
                  <p className="text-xs text-slate-300 font-mono">{selectedOrder.invoice_number}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Invoice View */}
            <div className="p-6 space-y-6 text-xs" id="printable-invoice">
              <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                <div>
                  <div className="font-extrabold text-sm text-[#0B1220]">SENTROVA SURVEILLANCE LTD</div>
                  <div className="text-slate-500 mt-0.5">Commercial Remote CCTV Surveillance Operations</div>
                  <div className="text-slate-500">24/7 Operations Desk: +44 7742 476163</div>
                  <div className="text-slate-500">billing@sentrova.co.uk</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-400 uppercase text-[10px] font-bold">Tax Invoice Date</div>
                  <div className="font-mono font-bold text-slate-800">{new Date(selectedOrder.created_at).toLocaleString()}</div>
                  <div className="text-slate-400 uppercase text-[10px] font-bold mt-1">Transaction Ref</div>
                  <div className="font-mono text-slate-600 text-[11px]">{selectedOrder.transaction_id}</div>
                </div>
              </div>

              {/* Billed To */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Billed To</span>
                  <div className="font-bold text-slate-900 text-sm">{selectedOrder.company_name}</div>
                  <div className="text-slate-600">Attn: {selectedOrder.contact_name}</div>
                  <div className="text-slate-600">{selectedOrder.email}</div>
                  <div className="text-slate-600">{selectedOrder.phone}</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Monitoring Site Details</span>
                  <div className="text-slate-800 font-medium">{selectedOrder.location || 'Primary Store / Facility'}</div>
                  <div className="text-slate-600 mt-1">Connected Cameras: <strong className="text-slate-900">{selectedOrder.camera_count} feeds</strong></div>
                  <div className="text-slate-600">Activation Date: <strong>{selectedOrder.setup_date || 'Within 24 Hours'}</strong></div>
                </div>
              </div>

              {/* Line Items Table */}
              <table className="w-full text-left">
                <thead className="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                  <tr>
                    <th className="py-2">Description</th>
                    <th className="py-2 text-right">Hours</th>
                    <th className="py-2 text-right">Rate</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3">
                      <div className="font-bold text-slate-900">{selectedOrder.package_name}</div>
                      <div className="text-slate-500 text-[11px]">
                        Live CCTV stream monitoring, instant audio deterrence, and shift audit logs.
                      </div>
                    </td>
                    <td className="py-3 text-right font-mono font-bold">{selectedOrder.hours_purchased} hrs</td>
                    <td className="py-3 text-right font-mono">${selectedOrder.hourly_rate.toFixed(2)}/hr</td>
                    <td className="py-3 text-right font-mono font-bold">${selectedOrder.subtotal.toFixed(2)}</td>
                  </tr>
                </tbody>
                <tfoot className="border-t border-slate-200">
                  <tr>
                    <td colSpan={3} className="pt-3 text-right font-bold text-slate-600">Subtotal:</td>
                    <td className="pt-3 text-right font-mono font-bold text-slate-900">${selectedOrder.subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="py-1 text-right text-slate-500">VAT / Tax (0% Reverse Charge B2B):</td>
                    <td className="py-1 text-right font-mono text-slate-600">$0.00</td>
                  </tr>
                  <tr className="text-sm font-black text-[#0B1220]">
                    <td colSpan={3} className="pt-2 text-right">Total Paid:</td>
                    <td className="pt-2 text-right font-mono text-[#087BFF]">${selectedOrder.total_amount.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>

              {/* Payment Card & Security */}
              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#087BFF]" />
                  <span className="text-slate-700 font-semibold">
                    Payment Method: {selectedOrder.card_brand} ending in •••• {selectedOrder.card_last4}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  VERIFIED BY STRIPE
                </span>
              </div>

              {/* Status Update Control for Admin */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Update Monitoring Activation Status
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="p-2 rounded-xl border border-slate-300 text-xs bg-white font-semibold"
                  >
                    <option value="paid">Paid (Awaiting camera onboarding)</option>
                    <option value="active">Active (Cameras connected & streaming)</option>
                    <option value="pending">Pending</option>
                    <option value="refunded">Refunded</option>
                  </select>
                  <button
                    onClick={handleUpdateStatus}
                    disabled={updatingId !== null}
                    className="px-4 py-2 bg-[#087BFF] hover:bg-[#0756C9] text-white rounded-xl font-bold transition-colors cursor-pointer"
                  >
                    {updatingId ? 'Saving...' : 'Update Status'}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap justify-between items-center gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => selectedOrder && generateInvoicePdf(selectedOrder)}
                  className="px-4 py-2 bg-[#087BFF] hover:bg-[#0756C9] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF Invoice</span>
                </button>

                <button
                  onClick={printInvoice}
                  className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Invoice</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
