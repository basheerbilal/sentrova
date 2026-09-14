import React from 'react';
import { ArrowRight, ShieldCheck, Phone, Zap, Clock } from 'lucide-react';
import { SENTROVA_CONTACT } from '../data/sentrovaData';

interface FinalCtaSectionProps {
  onOpenQuote: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onOpenQuote }) => {
  return (
    <section id="final-cta" className="py-24 bg-[#060E1E] relative overflow-hidden border-t border-sky-500/10">
      {/* Background ambient radial glow for glass depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-sky-500/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main CTA Card with Vibrant Blue Gradient & Cyan Highlights */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0756C9] via-[#087BFF] to-[#00A8FF] p-10 sm:p-14 lg:p-16 text-center text-white shadow-[0_20px_60px_rgba(0,210,255,0.35)] border border-sky-300/40">
          
          {/* Subtle Blue/Cyan Decorative Elements */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-cyan-300/25 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-white/20 blur-3xl pointer-events-none" />

          {/* Precision Reticle Accents */}
          <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-white/40 rounded-tl-xl pointer-events-none" />
          <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-white/40 rounded-tr-xl pointer-events-none" />
          <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-white/40 rounded-bl-xl pointer-events-none" />
          <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-white/40 rounded-br-xl pointer-events-none" />

          {/* Floating Glass Element 1 (Top Left) */}
          <div className="hidden md:flex absolute top-8 left-8 bg-white/20 backdrop-blur-md border border-white/35 px-4 py-2 rounded-2xl items-center gap-2 text-xs font-bold text-white shadow-lg pointer-events-none animate-bounce duration-1000">
            <Clock className="w-4 h-4 text-cyan-200" />
            <span>Avg Police Alert: 24s</span>
          </div>

          {/* Floating Glass Element 2 (Bottom Right) */}
          <div className="hidden md:flex absolute bottom-8 right-8 bg-white/20 backdrop-blur-md border border-white/35 px-4 py-2 rounded-2xl items-center gap-2 text-xs font-bold text-white shadow-lg pointer-events-none">
            <Zap className="w-4 h-4 text-yellow-300" />
            <span>Zero Hardware Lock-In</span>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            
            {/* Small Glass Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-extrabold uppercase tracking-wider mb-6 border border-white/35 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-cyan-200" />
              <span>Instant Setup • No Hardware Purchase</span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] mb-6 text-white drop-shadow-sm">
              READY TO TAKE YOUR CCTV
              <br />
              TO THE NEXT LEVEL?
            </h2>

            {/* Subtext */}
            <p className="text-lg sm:text-xl text-sky-100 font-normal leading-relaxed mb-10 max-w-2xl mx-auto">
              Get professional remote CCTV monitoring for your business. Protect inventory, reduce shrinkage, and safeguard staff 24/7.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onOpenQuote}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-sky-50 text-[#0756C9] font-extrabold text-base px-8 py-4 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_35px_rgba(255,255,255,0.4)] transition-all active:scale-[0.98] cursor-pointer"
                id="cta-quote-btn"
              >
                <span>GET A FREE QUOTE</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900/40 hover:bg-slate-900/60 text-white font-bold text-base px-8 py-4 rounded-xl border border-sky-300/40 backdrop-blur-md transition-all shadow-sm"
                id="cta-contact-btn"
              >
                <Phone className="w-4 h-4 text-[#00D2FF]" />
                <span>CONTACT SENTROVA</span>
              </a>
            </div>

            {/* Telemetry info */}
            <div className="mt-8 pt-6 border-t border-white/20 flex flex-wrap items-center justify-center gap-6 text-xs text-sky-100 font-semibold">
              <span>● Immediate Response Time</span>
              <span>● Hourly Billing from $1.99/hr</span>
              <span>● Rolling Monthly Contract</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
