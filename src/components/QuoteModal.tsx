import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, Send, Phone } from 'lucide-react';
import { PACKAGES, SENTROVA_CONTACT } from '../data/sentrovaData';
import { PackageTier } from '../types';
import { api } from '../services/api';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage?: PackageTier;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  selectedPackage = 'growth',
}) => {
  const [pkg, setPkg] = useState<PackageTier>(selectedPackage);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [cameras, setCameras] = useState(8);
  const [businessName, setBusinessName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
        full_name: fullName,
        business_name: businessName,
        phone: phone,
        email: email,
        camera_count: cameras,
        package_id: pkgMap[pkg] || 2,
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit quote. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        className="bg-[#0A162D]/95 backdrop-blur-[24px] rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-sky-400/30 shadow-[0_25px_60px_rgba(0,210,255,0.2)] relative text-left overflow-hidden text-white my-auto max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ zIndex: 100000 }}
      >
        {/* Top subtle blue accent glow */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00D2FF] to-transparent opacity-90 pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-sky-500/20 transition-colors cursor-pointer"
          aria-label="Close quote modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-[#10B981] flex items-center justify-center mx-auto mb-4 border border-emerald-400/30">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold text-white mb-2">
              Quote Request Sent!
            </h3>
            <p className="text-sm text-slate-300 mb-6">
              Our UK monitoring desk will call you at <span className="font-bold text-[#00D2FF]">{phone}</span> to configure your 14-day trial.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-sentrova-gradient text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-sky-500/25 cursor-pointer border border-sky-300/30"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-[#00D2FF] text-[10px] font-extrabold uppercase tracking-widest">
                Fast 2-Hour Response
              </span>
              <h3 className="text-2xl font-extrabold text-white tracking-tight mt-2.5">
                Request a Custom Quote
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Zero hardware purchase required. Compatible with all existing CCTV.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Package selector */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-200 mb-1.5">
                  Package
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PACKAGES.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPkg(p.id)}
                      className={`py-2 px-1 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer ${
                        pkg === p.id
                          ? 'border-[#00D2FF] bg-sky-500/25 text-white ring-2 ring-[#00D2FF]/30 shadow-md'
                          : 'border-sky-400/20 bg-slate-900/60 text-slate-300 hover:border-sky-400/40'
                      }`}
                    >
                      <div>{p.name}</div>
                      <div className="text-[#00D2FF] text-[11px] mt-0.5">{p.price}/hr</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Business */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-200 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-sky-400/20 bg-slate-900/80 text-white placeholder-slate-400 focus:bg-slate-900 focus:outline-none focus:border-[#00D2FF]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-200 mb-1">Business Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Store / Company"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-sky-400/20 bg-slate-900/80 text-white placeholder-slate-400 focus:bg-slate-900 focus:outline-none focus:border-[#00D2FF]"
                  />
                </div>
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-200 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+44 7..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-sky-400/20 bg-slate-900/80 text-white placeholder-slate-400 focus:bg-slate-900 focus:outline-none focus:border-[#00D2FF]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-200 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@business.co.uk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-sky-400/20 bg-slate-900/80 text-white placeholder-slate-400 focus:bg-slate-900 focus:outline-none focus:border-[#00D2FF]"
                  />
                </div>
              </div>

              {/* Camera Count Slider */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-200 mb-1">
                  <span>Number of Cameras to Monitor:</span>
                  <span className="text-[#00D2FF] font-extrabold">{cameras} Cameras</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={48}
                  value={cameras}
                  onChange={(e) => setCameras(parseInt(e.target.value) || 1)}
                  className="w-full accent-[#00D2FF] cursor-pointer"
                />
              </div>

              {error && (
                <div className="p-3 text-xs font-bold text-rose-300 bg-rose-950/50 border border-rose-500/40 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-sentrova-gradient hover:opacity-95 text-white font-extrabold text-sm rounded-xl transition-all shadow-[0_6px_25px_rgba(0,210,255,0.35)] hover:shadow-[0_8px_30px_rgba(0,210,255,0.5)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 border border-sky-300/30"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Quote Request</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <a
                  href={`tel:${SENTROVA_CONTACT.phone.replace(/\s+/g, '')}`}
                  className="text-xs font-semibold text-slate-400 hover:text-[#00D2FF] inline-flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Or call our operations desk directly: {SENTROVA_CONTACT.phoneDisplay}</span>
                </a>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );

  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  return modalContent;
};

