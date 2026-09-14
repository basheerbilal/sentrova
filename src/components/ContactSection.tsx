import React, { useState } from 'react';
import { SENTROVA_CONTACT, PACKAGES } from '../data/sentrovaData';
import { useSettings } from '../context/SettingsContext';
import { Phone, MessageSquare, Send, CheckCircle, ShieldCheck } from 'lucide-react';
import { PackageTier, QuoteFormData } from '../types';
import { api } from '../services/api';

interface ContactSectionProps {
  initialPackage?: PackageTier;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ initialPackage = 'growth' }) => {
  const { settings } = useSettings();
  const [formData, setFormData] = useState<QuoteFormData>({
    fullName: '',
    businessName: '',
    phone: '',
    email: '',
    location: '',
    numberOfCameras: 8,
    packageTier: initialPackage,
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const pkgMap: Record<string, number> = {
      essential: 1,
      growth: 2,
      ultimate: 3,
    };

    try {
      await api.submitQuoteRequest({
        full_name: formData.fullName,
        business_name: formData.businessName,
        phone: formData.phone,
        email: formData.email,
        location: formData.location,
        camera_count: formData.numberOfCameras,
        package_id: pkgMap[formData.packageTier] || 2,
        message: formData.message,
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit quote request. Please try again or reach our hotline.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#060E1E] text-white relative overflow-hidden border-t border-sky-500/10">
      {/* Background ambient radial lights */}
      <div className="absolute top-[10%] left-[-100px] w-[550px] h-[550px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] right-[-100px] w-[550px] h-[550px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/15 border border-sky-400/30 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#00D2FF] animate-pulse" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#38BDF8]">
              Direct Contact & Quotes
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            GET YOUR FREE <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-200 to-[#00D2FF]">MONITORING QUOTE</span>
          </h2>
          <p className="text-lg text-slate-300 font-normal leading-relaxed">
            Tell us about your premises and surveillance objectives. Our UK operations team will prepare a custom proposal within 2 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: Direct Contact Channels (5 cols) in Dark Glass Cards */}
          <div className="lg:col-span-5 space-y-6 text-left">
            
            {/* Phone Dark Glass Card */}
            <div className="bg-[#0A162D]/80 backdrop-blur-xl p-7 rounded-3xl border border-sky-400/20 shadow-xl shadow-blue-950/20 hover:border-[#00D2FF]/50 hover:shadow-[0_16px_40px_rgba(0,210,255,0.15)] transition-all">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-400/30 text-[#00D2FF] flex items-center justify-center shadow-xs">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#38BDF8]">
                    CALL US DIRECTLY
                  </span>
                  <div className="text-2xl font-extrabold text-white mt-0.5">
                    {settings.phoneDisplay || SENTROVA_CONTACT.phoneDisplay}
                  </div>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                Speak directly with an on-duty operations coordinator regarding site requirements and instant camera connection.
              </p>
              <a
                href={`tel:${(settings.phone || SENTROVA_CONTACT.phone).replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 text-sm font-extrabold text-[#00D2FF] hover:text-white transition-colors"
              >
                <span>Call Now</span>
                <span>→</span>
              </a>
            </div>

            {/* WhatsApp Dark Glass Card */}
            <div className="bg-[#0A162D]/80 backdrop-blur-xl p-7 rounded-3xl border border-sky-400/20 shadow-xl shadow-blue-950/20 hover:border-emerald-400/50 hover:shadow-[0_16px_40px_rgba(16,185,129,0.15)] transition-all">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 text-[#10B981] flex items-center justify-center shadow-xs">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
                    WHATSAPP DIRECT
                  </span>
                  <div className="text-2xl font-extrabold text-white mt-0.5">
                    {settings.whatsappDisplay || SENTROVA_CONTACT.whatsappDisplay}
                  </div>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                Chat with our security desk. Send photos of your camera setup or NVR model for immediate compatibility confirmation.
              </p>
              <a
                href={settings.whatsappLink || SENTROVA_CONTACT.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-extrabold text-[#10B981] hover:text-emerald-300 transition-colors"
              >
                <span>Start WhatsApp Chat</span>
                <span>→</span>
              </a>
            </div>

            {/* SLA Badge Box */}
            <div className="p-6 rounded-3xl bg-sky-500/10 backdrop-blur-md border border-sky-400/25">
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="w-5 h-5 text-[#00D2FF]" />
                <span className="text-sm font-extrabold text-[#38BDF8]">
                  Guaranteed Fast Turnaround
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                All monitoring quotes include an initial site risk consultation, existing DVR configuration test, and a 14-day performance trial.
              </p>
            </div>

          </div>

          {/* RIGHT: Quote Form in Elevated Dark Glass Panel (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-[#0A162D]/85 backdrop-blur-[24px] rounded-3xl p-8 sm:p-10 border border-sky-400/25 shadow-2xl shadow-blue-950/40 text-left relative overflow-hidden">
              
              {/* Subtle blue accent rule at top */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00D2FF] to-transparent opacity-80" />

              {submitted ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-[#10B981] flex items-center justify-center mx-auto mb-5 border border-emerald-400/30">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-white mb-2">
                    Quote Request Received!
                  </h3>
                  <p className="text-base text-slate-300 max-w-md mx-auto mb-6">
                    Thank you, <span className="font-bold text-white">{formData.fullName}</span>. A Sentrova operations specialist will review your {formData.numberOfCameras}-camera requirement and contact you at <span className="font-bold text-[#00D2FF]">{formData.phone || formData.email}</span> shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="glass-btn-secondary inline-flex items-center justify-center font-bold text-sm px-6 py-2.5 rounded-xl cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-200 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Robert Smith"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-sky-400/20 bg-slate-900/80 text-white placeholder-slate-400 focus:outline-none focus:border-[#00D2FF] focus:bg-slate-900 focus:ring-3 focus:ring-[#00D2FF]/20 transition-all text-sm"
                      />
                    </div>

                    {/* Business Name */}
                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-200 mb-2">
                        Business Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Apex Supermarket Ltd"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-sky-400/20 bg-slate-900/80 text-white placeholder-slate-400 focus:outline-none focus:border-[#00D2FF] focus:bg-slate-900 focus:ring-3 focus:ring-[#00D2FF]/20 transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-200 mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+44 7..."
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-sky-400/20 bg-slate-900/80 text-white placeholder-slate-400 focus:outline-none focus:border-[#00D2FF] focus:bg-slate-900 focus:ring-3 focus:ring-[#00D2FF]/20 transition-all text-sm"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-200 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="contact@company.co.uk"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-sky-400/20 bg-slate-900/80 text-white placeholder-slate-400 focus:outline-none focus:border-[#00D2FF] focus:bg-slate-900 focus:ring-3 focus:ring-[#00D2FF]/20 transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Location */}
                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-200 mb-2">
                        Location / City *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Manchester, London, Birmingham"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-sky-400/20 bg-slate-900/80 text-white placeholder-slate-400 focus:outline-none focus:border-[#00D2FF] focus:bg-slate-900 focus:ring-3 focus:ring-[#00D2FF]/20 transition-all text-sm"
                      />
                    </div>

                    {/* Number of Cameras */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-200">
                          Number of Cameras
                        </label>
                        <span className="text-xs font-bold text-[#00D2FF] bg-sky-500/15 px-2.5 py-0.5 rounded-full border border-sky-400/30">
                          {formData.numberOfCameras} Cameras
                        </span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={64}
                        value={formData.numberOfCameras}
                        onChange={(e) => setFormData({ ...formData, numberOfCameras: parseInt(e.target.value) || 1 })}
                        className="w-full accent-[#00D2FF] cursor-pointer mt-2"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                        <span>1 Cam</span>
                        <span>16 Cams</span>
                        <span>32 Cams</span>
                        <span>64+ Cams</span>
                      </div>
                    </div>
                  </div>

                  {/* Package Selector */}
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-200 mb-2">
                      Select Monitoring Package *
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {PACKAGES.map((pkg) => (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, packageTier: pkg.id })}
                          className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                            formData.packageTier === pkg.id
                              ? 'border-[#00D2FF] bg-sky-500/20 ring-2 ring-[#00D2FF]/30 text-white font-bold shadow-md shadow-sky-500/20'
                              : 'border-sky-400/20 bg-slate-900/60 text-slate-300 hover:border-sky-400/40'
                          }`}
                        >
                          <div className="font-extrabold text-xs">{pkg.name}</div>
                          <div className="text-xs font-bold text-[#00D2FF] mt-0.5">{pkg.price}/hr</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-200 mb-2">
                      Specific Requirements or Existing Camera Brands
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. We have 12 Hikvision cameras covering retail tills and stockroom. Looking for live evening monitoring..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-sky-400/20 bg-slate-900/80 text-white placeholder-slate-400 focus:outline-none focus:border-[#00D2FF] focus:bg-slate-900 focus:ring-3 focus:ring-[#00D2FF]/20 transition-all text-sm resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-sentrova-gradient hover:opacity-95 disabled:opacity-70 text-white font-extrabold text-base rounded-xl shadow-[0_8px_30px_rgba(0,210,255,0.35)] hover:shadow-[0_12px_35px_rgba(0,210,255,0.5)] transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer border border-sky-300/30"
                    id="contact-submit-btn"
                  >
                    {submitting ? (
                      <span>Submitting Request...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>RECEIVE CUSTOM MONITORING PROPOSAL</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-slate-400">
                    🔒 Your information is confidential and protected by UK GDPR. No sales spam.
                  </p>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
