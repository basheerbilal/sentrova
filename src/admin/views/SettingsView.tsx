import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Save,
  CheckCircle2,
  Building,
  Phone,
  Mail,
  MapPin,
  Globe,
  Share2,
  Send,
  AlertCircle,
} from 'lucide-react';
import { api } from '../../services/api';
import { useSettings } from '../../context/SettingsContext';

export const SettingsView: React.FC = () => {
  const { refreshSettings } = useSettings();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);
  const [testStatus, setTestStatus] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const data = await api.getAdminSettings();
        setSettings(data);
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updated = await api.updateAdminSettings(settings);
      if (updated && typeof updated === 'object') {
        setSettings(updated);
      }
      await refreshSettings();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 5000);
    } catch (err: any) {
      alert('Failed to save settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = async () => {
    try {
      setTestingEmail(true);
      setTestStatus(null);
      await api.updateAdminSettings(settings);
      const target = settings.admin_notification_email || settings.email || 'monitoring@sentrova.co.uk';
      const res = await api.testSmtpEmail(target);
      setTestStatus(res);
    } catch (err: any) {
      setTestStatus({ success: false, message: err?.message || 'SMTP connection failed' });
    } finally {
      setTestingEmail(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500">
        <div className="w-8 h-8 border-2 border-[#087BFF] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <span>Loading corporate settings...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#DDE7F5] shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-[#0B1220] tracking-tight">System & Corporate Settings</h1>
          <p className="text-sm text-[#536176] mt-0.5">
            Configure contact hotlines, WhatsApp routing, branding variables, and SEO metadata
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#087BFF] hover:bg-[#0756C9] rounded-xl shadow-md shadow-[#087BFF]/20 transition-all disabled:opacity-50"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save All Settings</span>
            </>
          )}
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>Corporate configuration updated successfully and applied across website endpoints.</span>
        </div>
      )}

      {/* Section 1: Contact Hotlines & Operational Desks */}
      <div className="bg-white p-6 rounded-2xl border border-[#DDE7F5] shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#DDE7F5]">
          <Phone className="w-4 h-4 text-[#087BFF]" />
          <h2 className="text-sm font-bold text-[#0B1220] uppercase tracking-wider">
            24/7 Monitoring Desk & Contact Channels
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#536176] mb-1">
              Company Name
            </label>
            <input
              type="text"
              value={settings.company_name || ''}
              onChange={(e) => handleChange('company_name', e.target.value)}
              className="w-full p-2.5 text-sm bg-[#F5F9FF] border border-[#DDE7F5] rounded-xl text-[#0B1220] focus:ring-2 focus:ring-[#087BFF] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#536176] mb-1">
              24/7 Operations Hotline
            </label>
            <input
              type="text"
              value={settings.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full p-2.5 text-sm bg-[#F5F9FF] border border-[#DDE7F5] rounded-xl text-[#0B1220] focus:ring-2 focus:ring-[#087BFF] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#536176] mb-1">
              WhatsApp Dispatch Number
            </label>
            <input
              type="text"
              value={settings.whatsapp || ''}
              onChange={(e) => handleChange('whatsapp', e.target.value)}
              className="w-full p-2.5 text-sm bg-[#F5F9FF] border border-[#DDE7F5] rounded-xl text-[#0B1220] focus:ring-2 focus:ring-[#087BFF] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#536176] mb-1">
              Operations Email Address
            </label>
            <input
              type="email"
              value={settings.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full p-2.5 text-sm bg-[#F5F9FF] border border-[#DDE7F5] rounded-xl text-[#0B1220] focus:ring-2 focus:ring-[#087BFF] outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#536176] mb-1">
              Corporate Headquarters Address
            </label>
            <input
              type="text"
              value={settings.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full p-2.5 text-sm bg-[#F5F9FF] border border-[#DDE7F5] rounded-xl text-[#0B1220] focus:ring-2 focus:ring-[#087BFF] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Hero & Copywriting */}
      <div className="bg-white p-6 rounded-2xl border border-[#DDE7F5] shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#DDE7F5]">
          <Globe className="w-4 h-4 text-[#087BFF]" />
          <h2 className="text-sm font-bold text-[#0B1220] uppercase tracking-wider">
            Hero Branding & SEO Copywriting
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#536176] mb-1">
              Main Hero Heading
            </label>
            <input
              type="text"
              value={settings.hero_title || ''}
              onChange={(e) => handleChange('hero_title', e.target.value)}
              className="w-full p-2.5 text-sm bg-[#F5F9FF] border border-[#DDE7F5] rounded-xl text-[#0B1220] focus:ring-2 focus:ring-[#087BFF] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#536176] mb-1">
              Hero Subtitle / Description
            </label>
            <textarea
              rows={2}
              value={settings.hero_description || ''}
              onChange={(e) => handleChange('hero_description', e.target.value)}
              className="w-full p-2.5 text-xs bg-[#F5F9FF] border border-[#DDE7F5] rounded-xl text-[#0B1220] focus:ring-2 focus:ring-[#087BFF] outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#536176] mb-1">
              WhatsApp Pre-filled Customer Inquiry Message
            </label>
            <input
              type="text"
              value={settings.whatsapp_message || ''}
              onChange={(e) => handleChange('whatsapp_message', e.target.value)}
              className="w-full p-2.5 text-sm bg-[#F5F9FF] border border-[#DDE7F5] rounded-xl text-[#0B1220] focus:ring-2 focus:ring-[#087BFF] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Social Profile Links */}
      <div className="bg-white p-6 rounded-2xl border border-[#DDE7F5] shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#DDE7F5]">
          <Share2 className="w-4 h-4 text-[#087BFF]" />
          <h2 className="text-sm font-bold text-[#0B1220] uppercase tracking-wider">
            Social Profile Handles
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#536176] mb-1">
              Facebook URL
            </label>
            <input
              type="text"
              value={settings.facebook_url || ''}
              onChange={(e) => handleChange('facebook_url', e.target.value)}
              className="w-full p-2.5 text-sm bg-[#F5F9FF] border border-[#DDE7F5] rounded-xl text-[#0B1220] focus:ring-2 focus:ring-[#087BFF] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#536176] mb-1">
              Instagram URL
            </label>
            <input
              type="text"
              value={settings.instagram_url || ''}
              onChange={(e) => handleChange('instagram_url', e.target.value)}
              className="w-full p-2.5 text-sm bg-[#F5F9FF] border border-[#DDE7F5] rounded-xl text-[#0B1220] focus:ring-2 focus:ring-[#087BFF] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#536176] mb-1">
              LinkedIn URL
            </label>
            <input
              type="text"
              value={settings.linkedin_url || ''}
              onChange={(e) => handleChange('linkedin_url', e.target.value)}
              className="w-full p-2.5 text-sm bg-[#F5F9FF] border border-[#DDE7F5] rounded-xl text-[#0B1220] focus:ring-2 focus:ring-[#087BFF] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Section 4: SMTP Email Notification Server Settings */}
      <div className="bg-white p-6 rounded-2xl border border-[#DDE7F5] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#DDE7F5]">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#087BFF]" />
            <h2 className="text-sm font-bold text-[#0B1220] uppercase tracking-wider">
              SMTP Email Notifications (Quotes, Subscribers & Messages)
            </h2>
          </div>
          <span className="text-[10px] font-bold text-sky-400 bg-sky-500/15 px-2.5 py-1 rounded-full border border-sky-400/30 w-fit">
            Nodemailer Automated Dispatch
          </span>
        </div>

        <p className="text-xs text-[#536176] leading-relaxed">
          Configure your corporate SMTP mail server credentials (e.g. Hostinger, Gmail App Password, or cPanel Webmail). When a client submits a <strong>Quote Request</strong>, <strong>Newsletter Subscription</strong>, or <strong>Direct Message</strong>, Sentrova will automatically dispatch branded confirmation emails to the client and instant lead alerts to your operations desk.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#536176] mb-1">
              SMTP Host / Server
            </label>
            <input
              type="text"
              placeholder="e.g. smtp.hostinger.com, smtp.gmail.com"
              value={settings.smtp_host || ''}
              onChange={(e) => handleChange('smtp_host', e.target.value)}
              className="w-full p-2.5 text-sm bg-[#F5F9FF] border border-[#DDE7F5] rounded-xl text-[#0B1220] focus:ring-2 focus:ring-[#087BFF] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#536176] mb-1">
              SMTP Port
            </label>
            <input
              type="text"
              placeholder="465 (SSL) or 587 (TLS)"
              value={settings.smtp_port || '465'}
              onChange={(e) => handleChange('smtp_port', e.target.value)}
              className="w-full p-2.5 text-sm bg-[#F5F9FF] border border-[#DDE7F5] rounded-xl text-[#0B1220] focus:ring-2 focus:ring-[#087BFF] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#536176] mb-1">
              Admin Alert Notification Email
            </label>
            <input
              type="email"
              placeholder="monitoring@sentrova.co.uk"
              value={settings.admin_notification_email || ''}
              onChange={(e) => handleChange('admin_notification_email', e.target.value)}
              className="w-full p-2.5 text-sm bg-[#F5F9FF] border border-[#DDE7F5] rounded-xl text-[#0B1220] focus:ring-2 focus:ring-[#087BFF] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#536176] mb-1">
              SMTP Username / Mailbox
            </label>
            <input
              type="text"
              placeholder="monitoring@sentrovaglobal.com"
              value={settings.smtp_user || ''}
              onChange={(e) => handleChange('smtp_user', e.target.value)}
              className="w-full p-2.5 text-sm bg-[#F5F9FF] border border-[#DDE7F5] rounded-xl text-[#0B1220] focus:ring-2 focus:ring-[#087BFF] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#536176] mb-1">
              SMTP Password / App Password
            </label>
            <input
              type="password"
              placeholder="Enter SMTP password"
              value={settings.smtp_pass || ''}
              onChange={(e) => handleChange('smtp_pass', e.target.value)}
              className="w-full p-2.5 text-sm bg-[#F5F9FF] border border-[#DDE7F5] rounded-xl text-[#0B1220] focus:ring-2 focus:ring-[#087BFF] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#536176] mb-1">
              Sender From Header
            </label>
            <input
              type="text"
              placeholder='"SENTROVA Operations" <monitoring@sentrovaglobal.com>'
              value={settings.smtp_from || ''}
              onChange={(e) => handleChange('smtp_from', e.target.value)}
              className="w-full p-2.5 text-sm bg-[#F5F9FF] border border-[#DDE7F5] rounded-xl text-[#0B1220] focus:ring-2 focus:ring-[#087BFF] outline-none"
            />
          </div>
        </div>

        {/* Test Email Verification Trigger */}
        <div className="pt-3 border-t border-[#DDE7F5] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#536176]">
            {testStatus && (
              <span className={`font-bold flex items-center gap-1.5 ${testStatus.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                {testStatus.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
                <span>{testStatus.message}</span>
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleTestEmail}
            disabled={testingEmail || !settings.smtp_host || !settings.smtp_user}
            className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-400/30 rounded-xl transition-colors cursor-pointer disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {testingEmail ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
                <span>Sending Test Dispatch...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5 text-sky-400" />
                <span>Verify & Send Test Email</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Save Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#DDE7F5] shadow-sm">
        <div className="text-xs text-[#536176]">
          {savedSuccess ? (
            <span className="text-emerald-700 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Settings saved and updated live across the entire website!
            </span>
          ) : (
            <span>Changes will apply immediately across the website upon saving.</span>
          )}
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold text-white bg-[#087BFF] hover:bg-[#0756C9] rounded-xl shadow-md shadow-[#087BFF]/20 transition-all disabled:opacity-50 cursor-pointer"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save All Settings</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
