import React, { useEffect, useState } from 'react';
import {
  Users,
  FileCheck2,
  Clock,
  CheckCircle2,
  Mail,
  Layers,
  Shield,
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import { api } from '../../services/api';
import { ApiDashboardData, ApiQuoteLead } from '../../types';

interface DashboardViewProps {
  onNavigateTab: (tab: string) => void;
  onSelectLead: (lead: ApiQuoteLead) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigateTab, onSelectLead }) => {
  const [data, setData] = useState<ApiDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = async () => {
    try {
      setRefreshing(true);
      const res = await api.getDashboard();
      setData(res);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#087BFF] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Loading Analytics...</span>
        </div>
      </div>
    );
  }

  const metrics = data?.metrics || {
    total_quotes: 0,
    new_leads: 0,
    in_progress: 0,
    completed: 0,
    contact_unread: 0,
    contact_total: 0,
    active_packages: 0,
    active_services: 0,
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
      default:
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-700 border border-slate-200">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#DDE7F5] shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-[#0B1220] tracking-tight">Executive Dashboard</h1>
          <p className="text-sm text-[#536176] mt-0.5">
            Real-time live monitoring operations, sales lead pipeline, and active telemetry
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboard}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-[#087BFF] bg-blue-50 hover:bg-blue-100 rounded-xl transition-all border border-blue-200/60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Metrics</span>
          </button>
          <button
            onClick={() => onNavigateTab('quotes')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#087BFF] hover:bg-[#0756C9] rounded-xl shadow-md shadow-[#087BFF]/20 transition-all"
          >
            <span>View All Leads</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Quote Leads */}
        <div
          onClick={() => onNavigateTab('quotes')}
          className="bg-white p-5 rounded-2xl border border-[#DDE7F5] shadow-sm hover:border-[#087BFF]/40 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#536176]">Total Quote Leads</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#087BFF] group-hover:bg-[#087BFF] group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#0B1220]">{metrics.total_quotes}</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> Active
            </span>
          </div>
          <span className="text-xs text-[#536176] block mt-1">High-value commercial surveillance inquiries</span>
        </div>

        {/* Card 2: New Unactioned Leads */}
        <div
          onClick={() => onNavigateTab('quotes')}
          className="bg-white p-5 rounded-2xl border border-[#DDE7F5] shadow-sm hover:border-[#087BFF]/40 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#536176]">New Leads</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600">{metrics.new_leads}</span>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              Needs Contact
            </span>
          </div>
          <span className="text-xs text-[#536176] block mt-1">Direct callback within 15 minutes recommended</span>
        </div>

        {/* Card 3: In Progress / Quoted */}
        <div
          onClick={() => onNavigateTab('quotes')}
          className="bg-white p-5 rounded-2xl border border-[#DDE7F5] shadow-sm hover:border-[#087BFF]/40 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#536176]">In Negotiation</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#0B1220]">{metrics.in_progress}</span>
            <span className="text-xs font-bold text-[#536176]">Proposals sent</span>
          </div>
          <span className="text-xs text-[#536176] block mt-1">Audit calls & hardware compatibility review</span>
        </div>

        {/* Card 4: Unread Inquiries */}
        <div
          onClick={() => onNavigateTab('contacts')}
          className="bg-white p-5 rounded-2xl border border-[#DDE7F5] shadow-sm hover:border-[#087BFF]/40 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#536176]">Unread Messages</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Mail className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#0B1220]">{metrics.contact_unread}</span>
            <span className="text-xs font-bold text-purple-600">of {metrics.contact_total} total</span>
          </div>
          <span className="text-xs text-[#536176] block mt-1">General technical & partnership inquiries</span>
        </div>
      </div>

      {/* Secondary Status Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#F5F9FF] p-4 rounded-xl border border-[#DDE7F5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#0B1220] block">Completed Deployments</span>
              <span className="text-xs text-[#536176]">Active monitored accounts</span>
            </div>
          </div>
          <span className="text-xl font-black text-emerald-700">{metrics.completed}</span>
        </div>

        <div
          onClick={() => onNavigateTab('packages')}
          className="bg-[#F5F9FF] p-4 rounded-xl border border-[#DDE7F5] flex items-center justify-between cursor-pointer hover:border-blue-300 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-[#087BFF] flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#0B1220] block">Hourly Packages</span>
              <span className="text-xs text-[#536176]">Essential, Growth, Ultimate</span>
            </div>
          </div>
          <span className="text-xl font-black text-[#087BFF]">{metrics.active_packages} Active</span>
        </div>

        <div
          onClick={() => onNavigateTab('services')}
          className="bg-[#F5F9FF] p-4 rounded-xl border border-[#DDE7F5] flex items-center justify-between cursor-pointer hover:border-blue-300 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#0B1220] block">CCTV Services</span>
              <span className="text-xs text-[#536176]">Theft, Shoplifting, Staff Audit</span>
            </div>
          </div>
          <span className="text-xl font-black text-indigo-700">{metrics.active_services} Active</span>
        </div>
      </div>

      {/* Two Column Layout: Recent Leads + Security Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Quote Inquiries (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#DDE7F5] shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#DDE7F5] flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#0B1220]">Recent Quote Requests</h2>
              <span className="text-xs text-[#536176]">Live incoming leads from web portal</span>
            </div>
            <button
              onClick={() => onNavigateTab('quotes')}
              className="text-xs font-bold text-[#087BFF] hover:underline flex items-center gap-1"
            >
              <span>Manage CRM</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F9FF] text-[#536176] uppercase tracking-wider font-semibold border-b border-[#DDE7F5]">
                <tr>
                  <th className="px-5 py-3">Business & Contact</th>
                  <th className="px-4 py-3">Package / Cameras</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE7F5]/60">
                {!data?.recent_leads || data.recent_leads.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-[#536176]">
                      No quote inquiries received yet.
                    </td>
                  </tr>
                ) : (
                  data.recent_leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="font-bold text-[#0B1220] block text-sm">{lead.business_name}</span>
                        <span className="text-[#536176]">{lead.full_name} • {lead.phone}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-medium text-[#0B1220] block">{lead.package_name || 'Custom Package'}</span>
                        <span className="text-[#536176]">{lead.camera_count} Cameras</span>
                      </td>
                      <td className="px-4 py-3.5">
                        {getStatusBadge(lead.status)}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => {
                            onSelectLead(lead);
                            onNavigateTab('quotes');
                          }}
                          className="px-3 py-1.5 text-xs font-bold text-[#087BFF] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          Review Lead
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security & Activity Stream (1 Col) */}
        <div className="bg-white rounded-2xl border border-[#DDE7F5] shadow-sm p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#DDE7F5]">
            <h2 className="text-base font-bold text-[#0B1220]">Security & Audit Trail</h2>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Live
            </span>
          </div>

          <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[380px] pr-1">
            {!data?.recent_logs || data.recent_logs.length === 0 ? (
              <span className="text-xs text-[#536176] block text-center py-6">No recent logs recorded</span>
            ) : (
              data.recent_logs.map((log) => (
                <div key={log.id} className="text-xs p-3 rounded-xl bg-[#F5F9FF] border border-[#DDE7F5]">
                  <div className="flex items-center justify-between text-[#536176] mb-1">
                    <span className="font-bold text-[#087BFF] uppercase tracking-wider text-[10px]">
                      {log.action.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="font-semibold text-[#0B1220]">{log.details || log.entity}</p>
                  <span className="text-[11px] text-[#536176] block mt-0.5">By: {log.admin_name || 'System'}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
