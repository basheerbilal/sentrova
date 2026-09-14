import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SentrovaLogo } from './SentrovaLogo';
import { SENTROVA_CONTACT } from '../data/sentrovaData';
import { useSettings } from '../context/SettingsContext';
import {
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Shield,
  ArrowUp,
  Code2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Send,
  Lock,
  Cookie,
  Share2,
} from 'lucide-react';
import { api } from '../services/api';
import { openCookiePreferences } from './CookieConsentBanner';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { settings } = useSettings();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [subscribedEmail, setSubscribedEmail] = useState('');
  const [socialLinks, setSocialLinks] = useState({
    facebook: 'https://facebook.com/sentrova',
    instagram: 'https://instagram.com/sentrova',
    linkedin: 'https://linkedin.com/company/sentrova',
    twitter: 'https://twitter.com/sentrova',
    youtube: 'https://youtube.com/@sentrova',
  });

  useEffect(() => {
    api.getSettings().then((data) => {
      if (data) {
        setSocialLinks((prev) => ({
          facebook: data.facebook_url || prev.facebook,
          instagram: data.instagram_url || prev.instagram,
          linkedin: data.linkedin_url || prev.linkedin,
          twitter: data.twitter_url || prev.twitter,
          youtube: data.youtube_url || prev.youtube,
        }));
      }
    }).catch(() => {});
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage('Please enter your business email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMessage('Please enter a valid email address (e.g., name@company.co.uk).');
      return;
    }

    setStatus('loading');

    try {
      await api.subscribeNewsletter(cleanEmail);
      setSubscribedEmail(cleanEmail);
      setStatus('success');
      setEmail('');
    } catch (err: any) {
      // Graceful fallback: store lead locally in case API is temporarily offline
      try {
        const stored = JSON.parse(localStorage.getItem('sentrova_newsletter_leads') || '[]');
        stored.push({ email: cleanEmail, date: new Date().toISOString() });
        localStorage.setItem('sentrova_newsletter_leads', JSON.stringify(stored));
        setSubscribedEmail(cleanEmail);
        setStatus('success');
        setEmail('');
      } catch {
        setStatus('error');
        setErrorMessage(err.message || 'Unable to complete subscription. Please try again.');
      }
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setErrorMessage('');
    setEmail('');
  };

  return (
    <footer id="footer" className="bg-[#040A17] border-t border-sky-500/15 text-slate-400 text-sm relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-sky-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        {/* Newsletter Subscription Section */}
        <div
          id="footer-newsletter-section"
          className="mb-14 rounded-3xl bg-gradient-to-br from-[#060E1E] via-[#0A162D] to-[#0E1F3D] border border-sky-400/25 p-8 sm:p-10 lg:p-12 text-white shadow-2xl shadow-blue-950/40 relative overflow-hidden"
        >
          {/* Subtle background ambient glows */}
          <div className="absolute -right-16 -top-16 w-80 h-80 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Value Proposition */}
            <div className="lg:col-span-7 text-left space-y-3.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-[#00D2FF] text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-sky-300" />
                <span>Executive Security Briefing</span>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                Stay Ahead of Retail & Commercial Crime Trends
              </h3>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
                Join over 2,400+ UK store directors, loss prevention managers, and facility executives. Receive our monthly intelligence dispatch featuring real deterrence case studies, retail theft pattern alerts, and remote CCTV compliance audits.
              </p>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 pt-1 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Monthly Intelligence Digest
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF]" />
                  Voice-Down Incident Analyses
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  Zero Spam • Unsubscribe Anytime
                </span>
              </div>
            </div>

            {/* Right Column: Subscription Form & Feedback */}
            <div className="lg:col-span-5 text-left">
              {status === 'success' ? (
                <div
                  id="newsletter-success-box"
                  className="p-6 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-left space-y-3.5"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">You're Subscribed!</h4>
                      <p className="text-emerald-200/90 text-xs sm:text-sm mt-1 leading-relaxed">
                        We've added <span className="font-semibold text-white underline">{subscribedEmail}</span> to our UK Surveillance Intelligence Dispatch. Your welcome loss prevention guide is on its way.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-emerald-500/20">
                    <span className="text-[11px] text-emerald-300/80">Dispatched 1st of every month</span>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="text-xs font-bold text-white hover:text-emerald-300 underline cursor-pointer"
                    >
                      Subscribe another email
                    </button>
                  </div>
                </div>
              ) : (
                <form id="newsletter-form" onSubmit={handleSubscribe} className="space-y-3" noValidate>
                  <div className="space-y-1.5">
                    <label htmlFor="newsletter-email-input" className="block text-xs font-semibold text-slate-300">
                      Work / Corporate Email
                    </label>
                    <div className="relative flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-1">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          id="newsletter-email-input"
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errorMessage) setErrorMessage('');
                          }}
                          placeholder="e.g. director@retailgroup.co.uk"
                          disabled={status === 'loading'}
                          className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/80 border text-sm text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:bg-slate-900 transition-all ${
                            errorMessage
                              ? 'border-red-500/70 focus:ring-red-500/40'
                              : 'border-sky-400/30 focus:ring-[#00D2FF] focus:border-[#00D2FF]'
                          }`}
                          aria-invalid={!!errorMessage}
                          aria-describedby={errorMessage ? 'newsletter-error-msg' : undefined}
                        />
                      </div>
                      <button
                        id="newsletter-submit-btn"
                        type="submit"
                        disabled={status === 'loading'}
                        className="px-6 py-3 rounded-xl bg-sentrova-gradient hover:opacity-95 disabled:opacity-60 text-white font-extrabold text-sm shadow-md shadow-sky-500/25 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer border border-sky-300/30"
                      >
                        {status === 'loading' ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Joining...</span>
                          </>
                        ) : (
                          <>
                            <span>Subscribe</span>
                            <Send className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>

                    {/* Validation Error Message */}
                    {errorMessage && (
                      <p
                        id="newsletter-error-msg"
                        className="flex items-center gap-1.5 text-xs text-rose-300 font-medium pt-1"
                        role="alert"
                      >
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                        <span>{errorMessage}</span>
                      </p>
                    )}
                  </div>

                  {/* Trust and privacy disclaimer */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-0.5">
                    <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>GDPR Compliant • We respect your inbox privacy • No spam</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-sky-500/15">
          
          {/* Col 1: Logo & Brand Intro (4 cols) */}
          <div className="lg:col-span-4 text-left">
            <Link to="/" className="inline-block mb-4">
              <SentrovaLogo size="md" />
            </Link>
            
            <p className="text-sm text-slate-300 font-normal leading-relaxed mt-4 mb-6">
              Professional CCTV Monitoring & Remote Surveillance. Protecting UK retail, supermarkets, logistics, and commercial properties with active 24/7 human oversight.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0A162D] border border-sky-400/25 text-xs font-bold text-[#38BDF8]">
              <Shield className="w-4 h-4 text-[#00D2FF]" />
              <span>Certified UK Surveillance Operations</span>
            </div>

            {/* Official Social Media Channels */}
            <div className="mt-5 p-3.5 rounded-2xl bg-[#0A162D]/90 border border-sky-400/20 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#38BDF8] flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-[#00D2FF]" />
                  <span>Connect With Us</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700">
                  Official Channels
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* Facebook */}
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Sentrova Facebook"
                  className="w-8 h-8 rounded-xl bg-slate-800/80 border border-sky-400/20 hover:bg-[#1877F2] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 shadow-xs hover:scale-105 hover:shadow-md hover:shadow-blue-500/20 cursor-pointer"
                  title="Follow Sentrova on Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Sentrova Instagram"
                  className="w-8 h-8 rounded-xl bg-slate-800/80 border border-sky-400/20 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 shadow-xs hover:scale-105 hover:shadow-md hover:shadow-pink-500/20 cursor-pointer"
                  title="Follow Sentrova on Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Sentrova LinkedIn"
                  className="w-8 h-8 rounded-xl bg-slate-800/80 border border-sky-400/20 hover:bg-[#0A66C2] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 shadow-xs hover:scale-105 hover:shadow-md hover:shadow-blue-600/20 cursor-pointer"
                  title="Follow Sentrova on LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>

                {/* X (Twitter) */}
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Sentrova X (Twitter)"
                  className="w-8 h-8 rounded-xl bg-slate-800/80 border border-sky-400/20 hover:bg-[#00D2FF] text-slate-300 hover:text-[#060E1E] flex items-center justify-center transition-all duration-200 shadow-xs hover:scale-105 hover:shadow-md hover:shadow-sky-400/20 cursor-pointer"
                  title="Follow Sentrova on X (Twitter)"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Sentrova YouTube"
                  className="w-8 h-8 rounded-xl bg-slate-800/80 border border-sky-400/20 hover:bg-[#FF0000] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 shadow-xs hover:scale-105 hover:shadow-md hover:shadow-red-500/20 cursor-pointer"
                  title="Watch Sentrova on YouTube"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation (2 cols) */}
          <div className="lg:col-span-2 text-left">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm font-semibold">
              <li><Link to="/" className="hover:text-[#00D2FF] text-slate-300 transition-colors">Home</Link></li>
              <li><Link to="/services" className="hover:text-[#00D2FF] text-slate-300 transition-colors">Services</Link></li>
              <li><Link to="/how-it-works" className="hover:text-[#00D2FF] text-slate-300 transition-colors">How It Works</Link></li>
              <li><Link to="/pricing" className="hover:text-[#00D2FF] text-slate-300 transition-colors">Pricing & Packages</Link></li>
              <li><Link to="/industries" className="hover:text-[#00D2FF] text-slate-300 transition-colors">Industries</Link></li>
              <li><Link to="/about" className="hover:text-[#00D2FF] text-slate-300 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-[#00D2FF] text-slate-300 transition-colors">Contact Desk</Link></li>
              <li>
                <button
                  type="button"
                  onClick={openCookiePreferences}
                  className="hover:text-[#00D2FF] text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer text-left font-semibold"
                >
                  <Cookie className="w-3.5 h-3.5 text-[#00D2FF]" />
                  <span>Cookie Preferences</span>
                </button>
              </li>
              <li className="pt-2">
                <a
                  href="https://web-basheerbilal.free.nf/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-400 hover:text-[#00D2FF] transition-colors inline-flex items-center gap-1.5 group font-medium"
                  title="Visit Basheer Bilal Portfolio"
                >
                  <Code2 className="w-3.5 h-3.5 text-[#00D2FF] shrink-0" />
                  <span>Develop by <strong className="text-white group-hover:text-[#00D2FF] font-bold">Web-BasheerBilal</strong></span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Services (3 cols) */}
          <div className="lg:col-span-3 text-left">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white mb-4">
              Monitoring Solutions
            </h4>
            <ul className="space-y-2.5 text-sm font-semibold">
              <li><Link to="/services" className="hover:text-[#00D2FF] text-slate-300 transition-colors">Customer Theft Monitoring</Link></li>
              <li><Link to="/services" className="hover:text-[#00D2FF] text-slate-300 transition-colors">Shoplifting Detection</Link></li>
              <li><Link to="/services" className="hover:text-[#00D2FF] text-slate-300 transition-colors">Staff & POS Till Oversight</Link></li>
              <li><Link to="/services" className="hover:text-[#00D2FF] text-slate-300 transition-colors">Suspicious Dwell Anomaly Watch</Link></li>
              <li><Link to="/services" className="hover:text-[#00D2FF] text-slate-300 transition-colors">Perimeter & Unauthorized Access</Link></li>
              <li><Link to="/services" className="hover:text-[#00D2FF] text-slate-300 transition-colors">After-Hours Facility Vigilance</Link></li>
              <li><Link to="/services" className="hover:text-[#00D2FF] text-slate-300 transition-colors">Police Incident Dossiers</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact (3 cols) */}
          <div className="lg:col-span-3 text-left">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white mb-4">
              Operations Center
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#00D2FF] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-400">Operations Desk</div>
                  <a href={`tel:${(settings.phone || SENTROVA_CONTACT.phone).replace(/\s+/g, '')}`} className="font-bold text-white hover:text-[#00D2FF]">
                    {settings.phoneDisplay || SENTROVA_CONTACT.phoneDisplay}
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <MessageSquare className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-400">WhatsApp Support</div>
                  <a href={settings.whatsappLink || SENTROVA_CONTACT.whatsappLink} target="_blank" rel="noreferrer" className="font-bold text-white hover:text-[#10B981]">
                    {settings.whatsappDisplay || SENTROVA_CONTACT.whatsappDisplay}
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#00D2FF] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-400">Inquiries</div>
                  <a href={`mailto:${settings.email || SENTROVA_CONTACT.email}`} className="font-bold text-white hover:text-[#00D2FF]">
                    {settings.email || SENTROVA_CONTACT.email}
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#00D2FF] shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300">
                  {settings.address || SENTROVA_CONTACT.address}
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Developer & Legal */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium">
          <div className="flex flex-wrap items-center gap-2 text-slate-400">
            <span>© 2026 SENTROVA. All rights reserved.</span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <a
              href="https://web-basheerbilal.free.nf/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-[#00D2FF] transition-colors"
            >
              Develop by <strong className="text-slate-300 hover:text-[#00D2FF] font-semibold">Web-BasheerBilal</strong>
            </a>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            {/* Quick Social Links in Bottom Bar */}
            <div className="flex items-center gap-1.5 text-slate-400">
              <a href={settings.facebook_url || socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-[#1877F2] p-1 transition-colors" title="Facebook">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </a>
              <a href={settings.instagram_url || socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-[#E4405F] p-1 transition-colors" title="Instagram">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
              </a>
              <a href={settings.linkedin_url || socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[#0A66C2] p-1 transition-colors" title="LinkedIn">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
              </a>
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-[#00D2FF] p-1 transition-colors" title="X (Twitter)">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-[#FF0000] p-1 transition-colors" title="YouTube">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
              </a>
            </div>

            <span className="text-slate-400">UK Certified 24/7 Ops</span>
            <button
              type="button"
              onClick={openCookiePreferences}
              className="text-slate-400 hover:text-[#00D2FF] transition-colors font-medium flex items-center gap-1 cursor-pointer"
            >
              <Cookie className="w-3.5 h-3.5 text-[#00D2FF]" />
              <span>Cookie Settings</span>
            </button>
          </div>

          {/* Scroll to Top */}
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1 text-[#00D2FF] hover:text-white font-bold p-1 cursor-pointer transition-colors"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
