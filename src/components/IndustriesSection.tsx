import React, { useEffect, useRef } from 'react';
import { INDUSTRIES } from '../data/sentrovaData';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface IndustriesSectionProps {
  onOpenQuote: () => void;
}

export const IndustriesSection: React.FC<IndustriesSectionProps> = ({ onOpenQuote }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const industriesGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (industriesGridRef.current && sectionRef.current) {
        gsap.fromTo(
          industriesGridRef.current.children,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="industries" className="py-24 bg-[#060E1E] relative overflow-hidden text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-[10%] left-[-100px] w-[600px] h-[600px] bg-[#00D2FF]/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] right-[-100px] w-[600px] h-[600px] bg-[#0756C9]/20 rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="glass-pill-blue inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-[#00D2FF]" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#38BDF8]">
              Sector-Specific Security
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            PROTECTION FOR EVERY BUSINESS
          </h2>
          <p className="text-lg md:text-xl text-slate-300 font-normal leading-relaxed">
            Tailored remote surveillance workflows calibrated for the distinct operational risks of your industry.
          </p>
        </div>

        {/* Asymmetric Bento Grid in Glass Panels */}
        <div ref={industriesGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INDUSTRIES.map((ind, index) => {
            const isLarge = index === 0 || index === 3 || index === 5;

            return (
              <div
                key={ind.id}
                className={`group rounded-3xl overflow-hidden border border-sky-400/25 bg-[#0B1A38]/75 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.5)] flex flex-col justify-between hover:border-[#00D2FF]/50 hover:shadow-[0_18px_45px_rgba(0,210,255,0.2)] transition-all duration-300 ${
                  isLarge ? 'lg:col-span-2' : 'lg:col-span-1'
                }`}
              >
                {/* Image Top / Header with Tag */}
                <div className="relative h-52 sm:h-64 overflow-hidden bg-slate-950">
                  <img
                    src={ind.imageUrl}
                    alt={ind.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060E1E] via-[#060E1E]/40 to-transparent pointer-events-none" />

                  {/* Top Glass Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="glass-pill text-[#00D2FF] text-xs font-extrabold px-3 py-1 rounded-full shadow-xs">
                      {ind.name}
                    </span>
                  </div>

                  {/* Bottom Image Caption Title */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                      {ind.name}
                    </h3>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 bg-[#0B1A38]/60 backdrop-blur-md flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-sm text-slate-300 leading-relaxed mb-4">
                      {ind.description}
                    </p>

                    {/* Key Risks Tag Pills */}
                    <div className="space-y-1.5 mb-5">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                        Mitigated Risks:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {ind.keyRisks.map((risk, rIdx) => (
                          <span
                            key={rIdx}
                            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-[#38BDF8]"
                          >
                            <CheckCircle2 className="w-3 h-3 text-[#00D2FF]" />
                            <span>{risk}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-sky-900/40 flex items-center justify-between">
                    <button
                      onClick={onOpenQuote}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00D2FF] hover:text-white group-hover:translate-x-1 transition-transform cursor-pointer"
                    >
                      <span>Configure for {ind.name}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] font-mono text-slate-400">Live Coverage</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
