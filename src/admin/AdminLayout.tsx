import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Layers,
  Shield,
  Building2,
  HelpCircle,
  MessageSquareQuote,
  Mail,
  Settings as SettingsIcon,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Bell,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { api } from '../services/api';
import { ApiAdminUser, ApiQuoteLead } from '../types';
import { DashboardView } from './views/DashboardView';
import { QuotesView } from './views/QuotesView';
import { OrdersView } from './views/OrdersView';
import { PackagesView } from './views/PackagesView';
import { ServicesView } from './views/ServicesView';
import { IndustriesView } from './views/IndustriesView';
import { FaqsView } from './views/FaqsView';
import { TestimonialsView } from './views/TestimonialsView';
import { ContactsView } from './views/ContactsView';
import { SettingsView } from './views/SettingsView';

interface AdminLayoutProps {
  admin: ApiAdminUser;
  onLogout: () => void;
  onViewSite: () => void;
}

class AdminErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-lg mx-auto my-12 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-[#087BFF] flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Notice</h3>
          <p className="text-sm text-slate-500 mb-6">
            {this.state.error?.message || 'Database records are updating. Please refresh to reload this section.'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="px-5 py-2.5 bg-[#087BFF] text-white rounded-xl text-sm font-semibold hover:bg-[#0756C9] transition-all shadow-md shadow-blue-500/20"
          >
            Refresh Section
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ admin, onLogout, onViewSite }) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<ApiQuoteLead | null>(null);
  const [unreadLeadsCount, setUnreadLeadsCount] = useState<number>(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const d = await api.getDashboard();
        setUnreadLeadsCount(d.metrics.new_leads || 0);
      } catch (err) {
        // silent
      }
    };
    fetchUnread();
    const timer = setInterval(fetchUnread, 30000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'quotes', label: 'Quote CRM & Leads', icon: Users, badge: unreadLeadsCount > 0 ? unreadLeadsCount : null },
    { id: 'orders', label: 'Payments & Retainers', icon: CreditCard, badge: null },
    { id: 'packages', label: 'Hourly Packages', icon: Layers, badge: null },
    { id: 'services', label: 'CCTV Services', icon: Shield, badge: null },
    { id: 'industries', label: 'Client Industries', icon: Building2, badge: null },
    { id: 'faqs', label: 'FAQs & Transparency', icon: HelpCircle, badge: null },
    { id: 'testimonials', label: 'Client Testimonials', icon: MessageSquareQuote, badge: null },
    { id: 'contacts', label: 'Direct Messages', icon: Mail, badge: null },
    { id: 'settings', label: 'System Settings', icon: SettingsIcon, badge: null },
  ];

  const handleSelectLeadFromDashboard = (lead: ApiQuoteLead) => {
    setSelectedLead(lead);
    setActiveTab('quotes');
  };

  return (
    <div className="min-h-screen bg-[#060E1E] flex flex-col font-sans text-slate-100 admin-theme">
      {/* Top Mobile Bar */}
      <header className="lg:hidden bg-[#0A162D] border-b border-sky-400/20 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sentrova-gradient flex items-center justify-center text-white font-black text-sm shadow-md shadow-[#087BFF]/30">
            S
          </div>
          <span className="font-black text-sm tracking-wider text-white">SENTROVA <span className="text-[#00D2FF]">Admin</span></span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-slate-300 hover:text-[#00D2FF] rounded-lg border border-sky-400/20 hover:bg-sky-500/10"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0A162D] border-r border-sky-400/20 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static ${
            sidebarOpen ? 'translate-x-0 shadow-2xl shadow-black/80' : '-translate-x-full'
          }`}
        >
          <div className="p-5 flex flex-col h-full overflow-y-auto">
            {/* Brand Logo */}
            <div className="flex items-center gap-3 pb-6 border-b border-sky-400/20">
              <div className="w-10 h-10 rounded-xl bg-sentrova-gradient flex items-center justify-center text-white shadow-lg shadow-[#087BFF]/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="font-black text-base tracking-wider text-white block">
                  SENTROVA
                </span>
                <span className="text-[10px] font-bold text-[#00D2FF] uppercase tracking-widest block">
                  CCTV Operations CMS
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="mt-6 space-y-1.5 flex-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-sentrova-gradient text-white shadow-lg shadow-[#087BFF]/30'
                        : 'text-slate-300 hover:text-white hover:bg-sky-500/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-sky-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== null && (
                      <span
                        className={`px-2 py-0.5 text-[10px] font-black rounded-full ${
                          isActive
                            ? 'bg-white/20 text-white border border-white/30'
                            : 'bg-sky-500/20 text-[#38BDF8] border border-sky-400/30'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Footer Quick Links & User Card */}
            <div className="pt-4 border-t border-sky-400/20 space-y-2.5">
              <button
                onClick={onViewSite}
                className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-[#00D2FF] hover:bg-sky-500/10 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-sky-400" />
                  <span>View Live Website</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <div className="p-3 bg-[#0B2147] rounded-xl border border-sky-400/25 flex items-center justify-between">
                <div className="overflow-hidden">
                  <span className="font-bold text-xs text-white block truncate">
                    {admin.name}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">{admin.email}</span>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-sky-500/20 text-[#00D2FF] border border-sky-400/30 rounded-md uppercase">
                  {admin.role.replace('_', ' ')}
                </span>
              </div>

              {/* Dedicated Bold Red Logout Button */}
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-md shadow-red-500/20 active:scale-[0.98]"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          />
        )}

        {/* Main Workspace */}
        <main className="flex-1 overflow-y-auto flex flex-col">
          {/* Top Bar on Desktop */}
          <div className="hidden lg:flex bg-[#0A162D]/95 backdrop-blur-md border-b border-sky-400/20 px-8 py-3.5 items-center justify-between sticky top-0 z-20 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Control Panel</span>
              <span className="text-slate-600">/</span>
              <span className="text-xs font-extrabold text-white capitalize">
                {navItems.find((n) => n.id === activeTab)?.label || activeTab}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={onViewSite}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-[#00D2FF] transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Visit Website</span>
              </button>

              <div className="h-4 w-[1px] bg-sky-400/20" />

              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse" />
                <span className="text-slate-300 font-medium">{admin.name}</span>
              </div>

              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all shadow-sm shadow-red-500/20 active:scale-95"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
            <AdminErrorBoundary key={activeTab}>
              {activeTab === 'dashboard' && (
                <DashboardView
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  onSelectLead={handleSelectLeadFromDashboard}
                />
              )}
              {activeTab === 'quotes' && (
                <QuotesView
                  initialLead={selectedLead}
                  onClearInitialLead={() => setSelectedLead(null)}
                />
              )}
              {activeTab === 'orders' && <OrdersView />}
              {activeTab === 'packages' && <PackagesView />}
              {activeTab === 'services' && <ServicesView />}
              {activeTab === 'industries' && <IndustriesView />}
              {activeTab === 'faqs' && <FaqsView />}
              {activeTab === 'testimonials' && <TestimonialsView />}
              {activeTab === 'contacts' && <ContactsView />}
              {activeTab === 'settings' && <SettingsView />}
              </AdminErrorBoundary>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
