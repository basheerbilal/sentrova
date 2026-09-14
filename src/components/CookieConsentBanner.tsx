import React, { useState, useEffect } from 'react';
import {
  Cookie,
  ShieldCheck,
  Settings2,
  Check,
  X,
  Lock,
  ChevronDown,
  ChevronUp,
  Info,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { CookieConsentPreferences } from '../types';

const STORAGE_KEY = 'sentrova_cookie_consent_v1';
const CONSENT_VERSION = '1.2.0';

export const DEFAULT_PREFERENCES: CookieConsentPreferences = {
  necessary: true,
  analytics: false,
  functional: false,
  marketing: false,
  updatedAt: '',
  version: CONSENT_VERSION,
};

// Helper function to trigger opening the modal from anywhere
export const openCookiePreferences = () => {
  window.dispatchEvent(new CustomEvent('sentrova_open_cookie_preferences'));
};

export const getStoredCookiePreferences = (): CookieConsentPreferences | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const CookieConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'preferences' | 'policy'>('preferences');
  const [preferences, setPreferences] = useState<CookieConsentPreferences>(DEFAULT_PREFERENCES);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const saved = getStoredCookiePreferences();
    if (saved) {
      setPreferences(saved);
      setIsVisible(false);
    } else {
      // Delay showing banner slightly for smooth page entrance
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleOpenRequest = () => {
      const saved = getStoredCookiePreferences() || DEFAULT_PREFERENCES;
      setPreferences(saved);
      setIsModalOpen(true);
      setModalTab('preferences');
    };

    window.addEventListener('sentrova_open_cookie_preferences', handleOpenRequest);
    return () => {
      window.removeEventListener('sentrova_open_cookie_preferences', handleOpenRequest);
    };
  }, []);

  const savePreferencesToStorage = (newPrefs: CookieConsentPreferences) => {
    const finalized: CookieConsentPreferences = {
      ...newPrefs,
      necessary: true, // Always true
      updatedAt: new Date().toISOString(),
      version: CONSENT_VERSION,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(finalized));
    } catch {
      // Handle private browsing storage limitations gracefully
    }
    setPreferences(finalized);
    setIsVisible(false);
    setIsModalOpen(false);

    // Dispatch global event for analytics or services to react
    window.dispatchEvent(new CustomEvent('sentrova_cookie_consent_saved', { detail: finalized }));

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAcceptAll = () => {
    savePreferencesToStorage({
      necessary: true,
      analytics: true,
      functional: true,
      marketing: true,
      updatedAt: '',
      version: CONSENT_VERSION,
    });
  };

  const handleRejectNonEssential = () => {
    savePreferencesToStorage({
      necessary: true,
      analytics: false,
      functional: false,
      marketing: false,
      updatedAt: '',
      version: CONSENT_VERSION,
    });
  };

  const handleSaveCustom = () => {
    savePreferencesToStorage(preferences);
  };

  const toggleCategory = (cat: 'analytics' | 'functional' | 'marketing') => {
    setPreferences((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  const toggleExpanded = (catName: string) => {
    setExpandedCategory((prev) => (prev === catName ? null : catName));
  };

  return (
    <>
      {/* 1. FLOATING BOTTOM COOKIE BANNER */}
      {isVisible && !isModalOpen && (
        <aside
          id="cookie-consent-banner"
          aria-label="Cookie consent management"
          className="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-5 pointer-events-none animate-in fade-in slide-in-from-bottom-6 duration-300"
        >
          <div className="max-w-5xl mx-auto bg-[#0A162D]/95 backdrop-blur-xl border border-sky-400/30 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl shadow-black/80 pointer-events-auto text-white">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
              {/* Left Info */}
              <div className="flex items-start gap-3.5 sm:gap-4 max-w-3xl">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center shrink-0 text-[#00D2FF] mt-0.5 shadow-sm">
                  <Cookie className="w-5 h-5" />
                </div>

                <div className="space-y-1.5 text-left">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                      We Value Your Privacy & Operational Security
                    </h3>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-[#00D2FF] text-[10px] font-mono font-bold">
                      <Lock className="w-2.5 h-2.5" />
                      <span>UK GDPR & PECR</span>
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    Sentrova utilizes strictly necessary cookies to ensure secure customer checkout, authentication, and encrypted video feeds. With your permission, we also use functional and telemetry cookies to optimize platform performance and tailor surveillance solutions.
                  </p>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full lg:w-auto shrink-0 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(true);
                    setModalTab('preferences');
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#0E1F3D] hover:bg-[#0E244B] border border-sky-400/20 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Settings2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Customize</span>
                </button>

                <button
                  type="button"
                  onClick={handleRejectNonEssential}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  <span>Essential Only</span>
                </button>

                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-sentrova-gradient hover:opacity-95 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-[0_4px_20px_rgba(8,123,255,0.3)] transition-all cursor-pointer border border-white/20"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Accept All</span>
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* 2. PERSISTENT DISCREET RE-OPEN BUTTON (Fixed on bottom-left) */}
      {!isVisible && (
        <button
          type="button"
          onClick={() => {
            setIsModalOpen(true);
            setModalTab('preferences');
          }}
          title="Manage Cookie & Privacy Preferences"
          aria-label="Manage Cookie & Privacy Preferences"
          className="fixed bottom-5 left-5 z-40 p-2.5 rounded-full bg-[#0A162D]/90 hover:bg-[#087BFF] text-slate-300 hover:text-white backdrop-blur-md border border-sky-400/30 shadow-lg transition-all duration-200 cursor-pointer group hover:scale-105"
        >
          <Cookie className="w-4 h-4 transition-transform group-hover:rotate-12" />
        </button>
      )}

      {/* 3. MODAL: PREFERENCES & POLICY DRAWER */}
      {isModalOpen && (
        <div
          id="cookie-preferences-modal"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="w-full max-w-2xl bg-[#0A162D] text-slate-200 rounded-3xl shadow-2xl border border-sky-400/30 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 sm:p-6 bg-sentrova-gradient text-white flex items-center justify-between shrink-0 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/30 backdrop-blur-md flex items-center justify-center text-white">
                  <Cookie className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-white">
                    Privacy & Cookie Preferences
                  </h2>
                  <p className="text-xs text-cyan-100">
                    Compliant with UK Data Protection Act 2018 & PECR
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close preferences modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center border-b border-sky-500/20 bg-[#060E1E] px-6 shrink-0">
              <button
                type="button"
                onClick={() => setModalTab('preferences')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  modalTab === 'preferences'
                    ? 'border-[#00D2FF] text-[#00D2FF]'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span>Cookie Categories</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab('policy')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  modalTab === 'policy'
                    ? 'border-[#00D2FF] text-[#00D2FF]'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Cookie Policy & Rights</span>
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-left flex-1 text-slate-300 text-sm">
              {modalTab === 'preferences' ? (
                <>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Choose which categories of cookies and telemetry tags you authorize on Sentrova. Strictly necessary cookies are mandatory to maintain secure encrypted connections, checkout token validity, and defense countermeasures.
                  </p>

                  {/* Category 1: Strictly Necessary */}
                  <div className="rounded-2xl border border-sky-400/20 bg-[#0E1F3D]/80 p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-white">
                            Strictly Necessary Cookies
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-500/10 border border-sky-400/30 text-[#00D2FF] px-2 py-0.5 rounded-full">
                            Always Active
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Required for essential platform operations, user sessions, CSRF protection, secure video feed authorization, and checkout order preservation.
                        </p>
                      </div>

                      {/* Locked Toggle Switch */}
                      <div className="w-11 h-6 bg-[#00D2FF] rounded-full p-1 cursor-not-allowed opacity-80 shrink-0 flex items-center justify-end">
                        <div className="w-4 h-4 bg-[#060E1E] rounded-full shadow-xs" />
                      </div>
                    </div>

                    {/* Expandable Table for Details */}
                    <button
                      type="button"
                      onClick={() => toggleExpanded('necessary')}
                      className="text-[11px] font-bold text-[#00D2FF] hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>{expandedCategory === 'necessary' ? 'Hide technical cookies' : 'View active cookies in this group (4)'}</span>
                      {expandedCategory === 'necessary' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {expandedCategory === 'necessary' && (
                      <div className="pt-2 border-t border-sky-500/20 text-[11px] font-mono space-y-1 text-slate-300 bg-[#060E1E] p-3 rounded-xl border border-sky-400/20">
                        <div className="flex justify-between py-1 border-b border-slate-800">
                          <span className="font-bold text-white">sentrova_cookie_consent_v1</span>
                          <span className="text-slate-400">Persistent (12 mos) • Consent memory</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-800">
                          <span className="font-bold text-white">sentrova_admin_token</span>
                          <span className="text-slate-400">Session (24h) • Encrypted CMS Auth</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-800">
                          <span className="font-bold text-white">sentrova_checkout_session</span>
                          <span className="text-slate-400">Session • Order retainer buffer</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="font-bold text-white">__Host-csrf_protect</span>
                          <span className="text-slate-400">Session • Form anti-forgery</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Category 2: Analytics & Performance */}
                  <div className="rounded-2xl border border-sky-400/20 bg-[#0E1F3D]/80 p-4 space-y-3 hover:border-sky-400/40 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-white">
                            Analytics & Performance Cookies
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Measures aggregated telemetry on camera stream latency, video player performance, and anonymous user journey navigation to optimize response times.
                        </p>
                      </div>

                      {/* Interactive Toggle Switch */}
                      <button
                        type="button"
                        onClick={() => toggleCategory('analytics')}
                        className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer shrink-0 flex items-center ${
                          preferences.analytics ? 'bg-[#00D2FF] justify-end' : 'bg-slate-700 justify-start'
                        }`}
                        role="switch"
                        aria-checked={preferences.analytics}
                        aria-label="Toggle analytics cookies"
                      >
                        <div className="w-4 h-4 bg-white rounded-full shadow-xs" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleExpanded('analytics')}
                      className="text-[11px] font-bold text-[#00D2FF] hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>{expandedCategory === 'analytics' ? 'Hide technical cookies' : 'View active cookies in this group (2)'}</span>
                      {expandedCategory === 'analytics' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {expandedCategory === 'analytics' && (
                      <div className="pt-2 border-t border-sky-500/20 text-[11px] font-mono space-y-1 text-slate-300 bg-[#060E1E] p-3 rounded-xl border border-sky-400/20">
                        <div className="flex justify-between py-1 border-b border-slate-800">
                          <span className="font-bold text-white">_st_telemetry_hud</span>
                          <span className="text-slate-400">30 Days • Video latency diagnostics</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="font-bold text-white">_st_anon_metrics</span>
                          <span className="text-slate-400">90 Days • Anonymized page flow</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Category 3: Functional & Experience */}
                  <div className="rounded-2xl border border-sky-400/20 bg-[#0E1F3D]/80 p-4 space-y-3 hover:border-sky-400/40 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-white">
                            Functional & Experience Preferences
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Stores your customized surveillance simulator settings (such as playback audio volume, speed preset, and live chat dialog status).
                        </p>
                      </div>

                      {/* Interactive Toggle Switch */}
                      <button
                        type="button"
                        onClick={() => toggleCategory('functional')}
                        className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer shrink-0 flex items-center ${
                          preferences.functional ? 'bg-[#00D2FF] justify-end' : 'bg-slate-700 justify-start'
                        }`}
                        role="switch"
                        aria-checked={preferences.functional}
                        aria-label="Toggle functional cookies"
                      >
                        <div className="w-4 h-4 bg-white rounded-full shadow-xs" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleExpanded('functional')}
                      className="text-[11px] font-bold text-[#00D2FF] hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>{expandedCategory === 'functional' ? 'Hide technical cookies' : 'View active cookies in this group (2)'}</span>
                      {expandedCategory === 'functional' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {expandedCategory === 'functional' && (
                      <div className="pt-2 border-t border-sky-500/20 text-[11px] font-mono space-y-1 text-slate-300 bg-[#060E1E] p-3 rounded-xl border border-sky-400/20">
                        <div className="flex justify-between py-1 border-b border-slate-800">
                          <span className="font-bold text-white">sentrova_demo_prefs</span>
                          <span className="text-slate-400">60 Days • Video speed & mute preset</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="font-bold text-white">sentrova_chat_state</span>
                          <span className="text-slate-400">Session • AI advisor conversation memory</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Category 4: Marketing & Lead Referral */}
                  <div className="rounded-2xl border border-sky-400/20 bg-[#0E1F3D]/80 p-4 space-y-3 hover:border-sky-400/40 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-white">
                            Marketing & Lead Attribution
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Records inbound business campaign sources for executive security newsletters. We never sell your personal information or use third-party behavioral ad trackers.
                        </p>
                      </div>

                      {/* Interactive Toggle Switch */}
                      <button
                        type="button"
                        onClick={() => toggleCategory('marketing')}
                        className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer shrink-0 flex items-center ${
                          preferences.marketing ? 'bg-[#00D2FF] justify-end' : 'bg-slate-700 justify-start'
                        }`}
                        role="switch"
                        aria-checked={preferences.marketing}
                        aria-label="Toggle marketing cookies"
                      >
                        <div className="w-4 h-4 bg-white rounded-full shadow-xs" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Cookie Policy Tab */
                <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <div className="p-4 rounded-2xl bg-[#060E1E] border border-sky-400/20 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-[#00D2FF]">
                      <ShieldCheck className="w-4 h-4 text-[#00D2FF]" />
                      <span>Sentrova Surveillance Ltd — Cookie Policy</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-normal">
                      Last reviewed: January 2026. This policy describes how Sentrova ("we", "us", "our") applies cookies, web beacons, and local storage objects in accordance with the UK Privacy and Electronic Communications Regulations (PECR) and the UK General Data Protection Regulation (UK GDPR).
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-white text-sm mb-1">1. What Are Cookies?</h4>
                    <p>
                      Cookies are compact text files stored on your browser or device by websites you visit. They allow our systems to recognize your terminal equipment, authenticate authorized personnel, and maintain secure shopping checkout baskets.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-white text-sm mb-1">2. How We Use Cookies</h4>
                    <p>
                      We utilize cookies strictly to support encrypted operations, audit surveillance telemetries, safeguard against automated bot attacks, and record compliance consents. No sensitive camera video data or confidential customer premise footage is stored in browser cookies.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-white text-sm mb-1">3. Managing Cookies in Your Browser</h4>
                    <p>
                      You can modify or revoke your consent anytime using the "Cookie Settings" control in our website footer. Additionally, you may configure browser settings (Google Chrome, Apple Safari, Mozilla Firefox, Microsoft Edge) to reject cookies. Disabling strictly necessary cookies may impede checkout order processing.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#060E1E] border border-sky-400/20 text-xs">
                    <span className="font-bold text-white">Questions or Data Inquiries:</span>
                    <p className="mt-0.5">
                      Contact our appointed Data Protection Officer at{' '}
                      <a href="mailto:dpo@sentrova.co.uk" className="text-[#00D2FF] font-bold underline">
                        dpo@sentrova.co.uk
                      </a>{' '}
                      or call our UK Operations Desk at +44 7448 871603.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer with Actions */}
            <div className="p-4 sm:p-6 bg-[#060E1E] border-t border-sky-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-sky-400/20 bg-[#0E1F3D] hover:bg-[#0E244B] text-xs font-bold text-slate-300 transition-colors cursor-pointer text-center"
              >
                Reject Non-Essential
              </button>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleSaveCustom}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer border border-slate-700"
                >
                  Save Choices
                </button>

                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-sentrova-gradient hover:opacity-95 text-white font-extrabold text-xs shadow-[0_4px_20px_rgba(8,123,255,0.3)] transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-white/20"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Accept All</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Temporary confirmation toast when preferences are saved */}
      {saveSuccess && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-950/90 text-white border border-emerald-500/50 shadow-xl backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <span className="font-bold block">Preferences Saved</span>
            <span className="text-emerald-200">Your privacy choices have been updated.</span>
          </div>
        </div>
      )}
    </>
  );
};
