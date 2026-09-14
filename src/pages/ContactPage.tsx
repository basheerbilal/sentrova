import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SENTROVA_CONTACT } from '../data/sentrovaData';
import { useSettings } from '../context/SettingsContext';
import { PackageTier } from '../types';
import { api } from '../services/api';
import {
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Send,
  AlertCircle,
  Headphones,
} from 'lucide-react';

interface ContactPageProps {
  initialPackage?: PackageTier;
}

export const ContactPage: React.FC<ContactPageProps> = ({ initialPackage = 'growth' }) => {
  const { settings } = useSettings();
  // Quote form state
  const [activeTab, setActiveTab] = useState<'quote' | 'message'>('quote');

  // Quote state
  const [businessName, setBusinessName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cameraCount, setCameraCount] = useState(8);
  const [businessType, setBusinessType] = useState('Retail Store');
  const [selectedPackage, setSelectedPackage] = useState<PackageTier>(initialPackage);
  const [notes, setNotes] = useState('');
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  // Message state
  const [msgName, setMsgName] = useState('');
  const [msgEmail, setMsgEmail] = useState('');
  const [msgPhone, setMsgPhone] = useState('');
  const [msgSubject, setMsgSubject] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [msgSubmitting, setMsgSubmitting] = useState(false);
  const [msgSuccess, setMsgSuccess] = useState(false);
  const [msgError, setMsgError] = useState<string | null>(null);

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSubmitting(true);
    setQuoteError(null);

    try {
      await api.submitQuoteRequest({
        business_name: businessName,
        full_name: contactName,
        email,
        phone,
        camera_count: Number(cameraCount),
        message: `[Sector: ${businessType}] [Target Tier: ${selectedPackage}] ${notes}`.trim(),
      });

      setQuoteSuccess(true);
    } catch (err: any) {
      setQuoteError(err.message || 'Failed to submit quote request. Please try again or call our hotline.');
    } finally {
      setQuoteSubmitting(false);
    }
  };

  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsgSubmitting(true);
    setMsgError(null);

    try {
      await api.submitContact({
        full_name: msgName,
        email: msgEmail,
        phone: msgPhone,
        subject: msgSubject,
        message: msgBody,
      });

      setMsgSuccess(true);
    } catch (err: any) {
      setMsgError(err.message || 'Failed to send message. Please call our 24/7 hotline.');
    } finally {
      setMsgSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#060E1E] text-slate-200 min-h-screen pt-24 pb-20">
      {/* Header */}
      <section className="relative py-16 border-b border-sky-500/20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-500/10 via-[#060E1E]/80 to-[#060E1E] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <nav className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 mb-4">
            <Link to="/" className="hover:text-[#00D2FF] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#00D2FF]">Contact & Quotes</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-xs font-bold text-[#00D2FF] mb-4 shadow-[0_0_15px_rgba(0,210,255,0.15)]">
            <Headphones className="w-3.5 h-3.5 text-[#00D2FF]" />
            <span>24/7 UK OPERATIONS CENTER</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-3xl mx-auto mb-5 leading-tight">
            Get in Touch with <span className="bg-gradient-to-r from-white via-sky-200 to-[#00D2FF] bg-clip-text text-transparent">Sentrova</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Need active surveillance, stream compatibility verification, or a customized multi-branch quote? Our senior security team is on call 24 hours a day.
          </p>
        </div>
      </section>

      {/* Main Grid: Contact Cards + Interactive Forms */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Operations Details */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="bg-[#0A162D]/85 rounded-3xl p-8 border border-sky-400/20 shadow-xl backdrop-blur-xl">
              <h2 className="text-xl font-extrabold text-white mb-2">
                Operations & Dispatch
              </h2>
              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                Connect directly with our 24/7 commercial surveillance operators in the UK.
              </p>

              <div className="space-y-4">
                {/* 24/7 Phone */}
                <a
                  href={`tel:${(settings.phone || SENTROVA_CONTACT.phone).replace(/\s+/g, '')}`}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-[#0E1F3D]/80 border border-sky-400/20 hover:border-[#00D2FF]/60 hover:bg-[#0E244B] transition-all group shadow-md"
                >
                  <div className="w-10 h-10 rounded-xl bg-sentrova-gradient text-white flex items-center justify-center shrink-0 shadow-sm border border-white/20">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#00D2FF]">24/7 Operations Desk</div>
                    <div className="text-base font-black text-white group-hover:text-[#00D2FF] transition-colors">
                      {settings.phoneDisplay || SENTROVA_CONTACT.phoneDisplay}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Live emergency dispatch and incident status</div>
                  </div>
                </a>

                {/* Direct WhatsApp */}
                <a
                  href={settings.whatsappLink || SENTROVA_CONTACT.whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-4 p-4 rounded-2xl bg-[#0E1F3D]/80 border border-emerald-500/25 hover:border-emerald-400 hover:bg-emerald-950/20 transition-all group shadow-md"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Instant WhatsApp</div>
                    <div className="text-base font-black text-white group-hover:text-emerald-300 transition-colors">
                      {settings.whatsappDisplay || SENTROVA_CONTACT.whatsappDisplay}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Quick camera questions and quote consultations</div>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${settings.email || SENTROVA_CONTACT.email}`}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-[#0E1F3D]/80 border border-sky-400/20 hover:border-[#00D2FF]/60 hover:bg-[#0E244B] transition-all group shadow-md"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-cyan-300 flex items-center justify-center shrink-0 shadow-sm border border-sky-400/20">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Corporate Inquiries</div>
                    <div className="text-sm font-black text-white group-hover:text-[#00D2FF] transition-colors">
                      {settings.email || SENTROVA_CONTACT.email}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Contract proposals and RFP documentation</div>
                  </div>
                </a>

                {/* Location */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#0E1F3D]/80 border border-sky-400/20">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-sky-400 flex items-center justify-center shrink-0 shadow-sm border border-sky-400/20">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Headquarters</div>
                    <div className="text-sm font-bold text-white">
                      {settings.address || SENTROVA_CONTACT.address}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">UK Network Operations Center</div>
                  </div>
                </div>
              </div>
            </div>

            {/* SLA Badge */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0A162D] via-[#0E244B] to-[#0756C9] border border-sky-400/30 text-white space-y-3 shadow-xl">
              <div className="flex items-center gap-2 text-[#00D2FF] font-bold text-xs uppercase tracking-wider">
                <Clock className="w-4 h-4" />
                <span>Rapid Response SLA</span>
              </div>
              <h3 className="text-lg font-black">24-Hour Stream Activation</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                We connect to your existing Hikvision, Dahua, Axis, or ONVIF setup without replacing any hardware. All quotes submitted here are returned within 2 business hours.
              </p>
            </div>
          </div>

          {/* Right Column: Tabbed Form (Quote / Message) */}
          <div className="lg:col-span-7">
            <div className="bg-[#0A162D]/90 rounded-3xl p-8 sm:p-10 border border-sky-400/20 shadow-2xl backdrop-blur-2xl text-left">
              {/* Form Mode Toggle */}
              <div className="flex items-center gap-2 mb-8 p-1.5 rounded-2xl bg-[#060E1E] border border-sky-400/20 max-w-sm">
                <button
                  type="button"
                  onClick={() => setActiveTab('quote')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === 'quote'
                      ? 'bg-sentrova-gradient text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Request Free Quote
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('message')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === 'message'
                      ? 'bg-sentrova-gradient text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Direct Inquiry
                </button>
              </div>

              {/* Quote Request Form */}
              {activeTab === 'quote' && (
                <>
                  {quoteSuccess ? (
                    <div className="p-8 text-center bg-emerald-950/60 rounded-2xl border border-emerald-500/40 text-white space-y-3 backdrop-blur-xl">
                      <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                      <h3 className="text-xl font-black text-white">Quote Request Received!</h3>
                      <p className="text-xs text-slate-300 max-w-md mx-auto">
                        Thank you, <span className="font-bold text-white">{contactName}</span>. Your security requirements for <span className="font-bold text-white">{businessName}</span> have been routed to our senior surveillance engineers. A detailed proposal will be sent to <span className="font-bold text-[#00D2FF]">{email}</span> within 2 hours.
                      </p>
                      <button
                        onClick={() => {
                          setQuoteSuccess(false);
                          setBusinessName('');
                          setContactName('');
                          setEmail('');
                          setPhone('');
                          setNotes('');
                        }}
                        className="mt-4 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-lg"
                      >
                        Submit Another Request
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleQuoteSubmit} className="space-y-4">
                      {quoteError && (
                        <div className="p-3 bg-red-950/70 border border-red-500/40 text-red-200 text-xs rounded-xl flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                          <span>{quoteError}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Business / Facility Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Metro Supermarket Ltd"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-sky-400/20 bg-[#060E1E]/90 text-white placeholder-slate-400 text-xs font-medium focus:outline-none focus:border-[#00D2FF]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Contact Person *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Your Full Name"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-sky-400/20 bg-[#060E1E]/90 text-white placeholder-slate-400 text-xs font-medium focus:outline-none focus:border-[#00D2FF]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Business Email *
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="manager@yourbusiness.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-sky-400/20 bg-[#060E1E]/90 text-white placeholder-slate-400 text-xs font-medium focus:outline-none focus:border-[#00D2FF]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Phone / WhatsApp *
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="+44 7... or mobile number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-sky-400/20 bg-[#060E1E]/90 text-white placeholder-slate-400 text-xs font-medium focus:outline-none focus:border-[#00D2FF]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Existing Cameras
                          </label>
                          <select
                            value={cameraCount}
                            onChange={(e) => setCameraCount(Number(e.target.value))}
                            className="w-full px-3 py-2.5 rounded-xl border border-sky-400/20 bg-[#060E1E] text-white text-xs font-medium focus:outline-none focus:border-[#00D2FF]"
                          >
                            <option value={4}>1 – 4 Cameras</option>
                            <option value={8}>5 – 8 Cameras</option>
                            <option value={16}>9 – 16 Cameras</option>
                            <option value={32}>17 – 32 Cameras</option>
                            <option value={64}>33+ Cameras</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Business Sector
                          </label>
                          <select
                            value={businessType}
                            onChange={(e) => setBusinessType(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-sky-400/20 bg-[#060E1E] text-white text-xs font-medium focus:outline-none focus:border-[#00D2FF]"
                          >
                            <option value="Retail Store">Retail & Boutique</option>
                            <option value="Supermarket">Supermarket / Grocery</option>
                            <option value="Warehouse / Logistics">Warehouse / Logistics</option>
                            <option value="Construction Site">Construction Site</option>
                            <option value="Corporate Office">Corporate Office</option>
                            <option value="Hospitality / Pub">Hospitality / Restaurant</option>
                            <option value="Other Commercial">Other Commercial</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Target Tier
                          </label>
                          <select
                            value={selectedPackage}
                            onChange={(e) => setSelectedPackage(e.target.value as PackageTier)}
                            className="w-full px-3 py-2.5 rounded-xl border border-sky-400/20 bg-[#060E1E] text-white text-xs font-medium focus:outline-none focus:border-[#00D2FF]"
                          >
                            <option value="essential">Essential ($1.99/hr)</option>
                            <option value="growth">Growth ($2.99/hr)</option>
                            <option value="ultimate">Ultimate ($5.99/hr)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Facility Details / Specific Areas to Protect (Optional)
                        </label>
                        <textarea
                          rows={3}
                          placeholder="e.g. We want monitoring for 4 till cameras and 2 entrance doors during peak hours 4pm-10pm..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-sky-400/20 bg-[#060E1E]/90 text-white placeholder-slate-400 text-xs font-medium focus:outline-none focus:border-[#00D2FF]"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={quoteSubmitting}
                        className="w-full py-3.5 rounded-xl bg-sentrova-gradient hover:opacity-95 text-white font-extrabold text-sm shadow-[0_8px_25px_rgba(8,123,255,0.3)] hover:shadow-[0_8px_25px_rgba(0,210,255,0.45)] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 border border-white/25"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>{quoteSubmitting ? 'Transmitting Request...' : 'Submit Quote Request & Free Audit'}</span>
                      </button>

                      <div className="text-center">
                        <span className="text-[11px] text-slate-400">
                          🔒 Zero commitment. Your details are strictly confidential and encrypted under UK GDPR.
                        </span>
                      </div>
                    </form>
                  )}
                </>
              )}

              {/* Direct Message Form */}
              {activeTab === 'message' && (
                <>
                  {msgSuccess ? (
                    <div className="p-8 text-center bg-emerald-950/60 rounded-2xl border border-emerald-500/40 text-white backdrop-blur-xl">
                      <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <CheckCircle2 className="w-7 h-7" />
                      </div>
                      <h4 className="text-xl font-extrabold text-white mb-1">Message Transmitted</h4>
                      <p className="text-xs text-slate-300 mb-6">
                        Thank you for reaching out. Our operations coordinator will review your inquiry and get back to you shortly.
                      </p>
                      <button
                        onClick={() => setMsgSuccess(false)}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md"
                      >
                        Send Another Inquiry
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleMessageSubmit} className="space-y-4">
                      {msgError && (
                        <div className="p-3 bg-red-950/70 border border-red-500/40 text-red-200 text-xs rounded-xl flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                          <span>{msgError}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">Your Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="Full Name"
                            value={msgName}
                            onChange={(e) => setMsgName(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-sky-400/20 bg-[#060E1E]/90 text-white placeholder-slate-400 text-xs font-medium focus:outline-none focus:border-[#00D2FF]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">Your Email *</label>
                          <input
                            type="email"
                            required
                            placeholder="email@domain.com"
                            value={msgEmail}
                            onChange={(e) => setMsgEmail(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-sky-400/20 bg-[#060E1E]/90 text-white placeholder-slate-400 text-xs font-medium focus:outline-none focus:border-[#00D2FF]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">Contact Phone</label>
                          <input
                            type="tel"
                            placeholder="Phone Number"
                            value={msgPhone}
                            onChange={(e) => setMsgPhone(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-sky-400/20 bg-[#060E1E]/90 text-white placeholder-slate-400 text-xs font-medium focus:outline-none focus:border-[#00D2FF]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">Subject *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Technical stream integration inquiry"
                            value={msgSubject}
                            onChange={(e) => setMsgSubject(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-sky-400/20 bg-[#060E1E]/90 text-white placeholder-slate-400 text-xs font-medium focus:outline-none focus:border-[#00D2FF]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Message *</label>
                        <textarea
                          rows={4}
                          required
                          placeholder="How can Sentrova assist your business?"
                          value={msgBody}
                          onChange={(e) => setMsgBody(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-sky-400/20 bg-[#060E1E]/90 text-white placeholder-slate-400 text-xs font-medium focus:outline-none focus:border-[#00D2FF]"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={msgSubmitting}
                        className="w-full py-3.5 rounded-xl bg-sentrova-gradient hover:opacity-95 text-white font-extrabold text-sm shadow-[0_8px_25px_rgba(8,123,255,0.3)] hover:shadow-[0_8px_25px_rgba(0,210,255,0.45)] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 border border-white/25"
                      >
                        <Send className="w-4 h-4" />
                        <span>{msgSubmitting ? 'Sending Message...' : 'Send Message'}</span>
                      </button>
                    </form>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
