import React, { useState, useEffect, useRef } from 'react';
import { PACKAGES as DEFAULT_PACKAGES, PACKAGE_COMPARISON } from '../data/sentrovaData';
import { Check, ArrowRight, ShieldCheck, MessageSquare } from 'lucide-react';
import { PackageTier, MonitoringPackage } from '../types';
import { api } from '../services/api';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface PackagesSectionProps {
  onOpenQuote: (packageId?: PackageTier) => void;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({ onOpenQuote }) => {
  const [packagesList, setPackagesList] = useState<MonitoringPackage[]>(DEFAULT_PACKAGES);
  const [showComparison, setShowComparison] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const packagesGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.getPackages().then((apiPkgs) => {
      if (apiPkgs && apiPkgs.length > 0) {
        const mapped: MonitoringPackage[] = apiPkgs.map((p) => {
          const tierId: PackageTier =
            p.slug === 'growth' || p.slug === 'ultimate' ? (p.slug as PackageTier) : 'essential';
          return {
            id: tierId,
            name: p.name,
            price: `${p.currency}${p.price.toFixed(2)}`,
            unit: p.billing_unit,
            tagline: p.subtitle,
            highlight: p.popular,
            badge: p.popular ? 'MOST POPULAR' : undefined,
            description: p.description,
            bestFor: p.subtitle,
            features: (p.features || []).map((f) => f.feature),
          };
        });
        setPackagesList(mapped);
      }
    }).catch(() => {
      // fallback to DEFAULT_PACKAGES
    });
  }, []);

  const getWhatsAppInquiryUrl = (pkg: MonitoringPackage) => {
    const phone = '447448871603';
    const text = `Hello Sentrova, I am interested in the ${pkg.name.toUpperCase()} Package (${pkg.price} ${pkg.unit} - ${pkg.tagline.toUpperCase()}). Can you provide more details?`;
    return `https://api.whatsapp.com/send/?phone=${phone}&text=${encodeURIComponent(text)}`;
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (packagesGridRef.current && sectionRef.current) {
        gsap.fromTo(
          packagesGridRef.current.children,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.12,
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
    <section ref={sectionRef} id="packages" className="py-24 bg-[#060E1E] relative overflow-hidden text-white">
      {/* Background soft ambient radial depth */}
      <div className="absolute top-[20%] left-[-100px] w-[650px] h-[650px] bg-[#00D2FF]/15 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] right-[-100px] w-[650px] h-[650px] bg-[#0756C9]/20 rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="glass-pill-blue inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-[#00D2FF]" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#38BDF8]">
              Transparent Hourly Pricing
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            CHOOSE THE RIGHT LEVEL OF MONITORING
          </h2>
          <p className="text-lg md:text-xl text-slate-300 font-normal leading-relaxed">
            Scalable surveillance tiers designed for UK retailers, supermarkets, and commercial facilities.
            Pay only for the trading or after-hours coverage you need.
          </p>
        </div>

        {/* 3 Premium Glassmorphism Pricing Cards */}
        <div ref={packagesGridRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-20 pt-4">
          {packagesList.map((pkg) => {
            const isGrowth = pkg.highlight;

            return (
              <div
                key={pkg.id}
                className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative text-left group overflow-visible ${
                  isGrowth
                    ? 'bg-[#0E2045]/90 backdrop-blur-[24px] border-2 border-[#00D2FF] shadow-[0_20px_50px_rgba(0,210,255,0.25)] lg:-translate-y-3'
                    : 'bg-[#0B1A38]/75 backdrop-blur-[20px] border border-sky-400/25 shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:border-[#00D2FF]/50 hover:shadow-[0_18px_48px_rgba(0,210,255,0.2)] hover:-translate-y-1'
                }`}
              >
                {/* Subtle top specular glass light */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none rounded-t-3xl" />

                {/* MOST POPULAR Blue Glass Badge for Growth */}
                {isGrowth && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 bg-sentrova-gradient text-white text-[11px] font-extrabold uppercase px-4 py-1 rounded-full border border-white/40 shadow-[0_4px_14px_rgba(0,210,255,0.4)] tracking-wider whitespace-nowrap">
                    {pkg.badge || 'MOST POPULAR'}
                  </div>
                )}

                <div>
                  {/* Tier Title */}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-extrabold text-white tracking-wide">
                      {pkg.name}
                    </h3>
                    <span className="glass-pill-blue text-xs font-bold px-2.5 py-1 rounded-md">
                      Live Operator
                    </span>
                  </div>

                  {/* Core Value Tagline */}
                  <p className="text-sm font-bold text-[#38BDF8] mb-6">
                    {pkg.tagline}
                  </p>

                  {/* Large High-Contrast Price Display */}
                  <div className="mb-6 pb-6 border-b border-sky-900/40">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight">
                        {pkg.price}
                      </span>
                      <span className="text-lg font-bold text-slate-400">
                        {pkg.unit}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-2 font-medium">
                      Billed transparently per active monitoring hour. No lock-in contracts.
                    </p>
                  </div>

                  {/* Target Match Glass Pill */}
                  <div className="mb-6 bg-sky-500/10 backdrop-blur-sm border border-sky-400/30 p-3.5 rounded-xl text-xs text-slate-300">
                    <span className="font-bold text-white">Recommended for: </span>
                    {pkg.bestFor}
                  </div>

                  {/* Features List with Blue Checks */}
                  <div className="space-y-3.5 mb-8">
                    <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 block">
                      Included Surveillance:
                    </span>
                    {pkg.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-sky-500/20 text-[#00D2FF] border border-sky-400/40 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span className="text-sm font-medium text-slate-200 leading-snug">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action: Direct WhatsApp Booking & Inquiry */}
                <div className="mt-auto pt-4">
                  <a
                    href={getWhatsAppInquiryUrl(pkg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`relative group overflow-hidden w-full py-3.5 px-4 rounded-xl backdrop-blur-xl border text-white font-extrabold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 active:scale-[0.98] ${
                      pkg.highlight
                        ? 'bg-gradient-to-r from-emerald-500/25 via-teal-500/30 to-emerald-500/25 hover:from-emerald-500/35 hover:via-teal-500/40 hover:to-emerald-500/35 border-emerald-400/60 hover:border-emerald-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_8px_28px_rgba(16,185,129,0.35)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_12px_36px_rgba(16,185,129,0.5)]'
                        : 'bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-400/40 hover:border-emerald-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_8px_24px_rgba(16,185,129,0.2)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_12px_30px_rgba(16,185,129,0.4)]'
                    }`}
                  >
                    {/* Glass Sheen Light Sweep Animation */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

                    <div className="w-5 h-5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 group-hover:text-white transition-colors shrink-0">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </div>
                    <span>Inquire via WhatsApp ({pkg.name})</span>
                    <ArrowRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-1 group-hover:text-white transition-all ml-0.5 shrink-0" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* PACKAGE COMPARISON TABLE WITH GLASS CONTAINER */}
        <div className="bg-[#0B1A38]/75 backdrop-blur-xl rounded-3xl border border-sky-400/25 shadow-[0_15px_45px_rgba(0,0,0,0.5)] p-6 sm:p-10 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sky-900/40 mb-6">
            <div className="text-left">
              <h3 className="text-2xl font-extrabold text-white">
                Detailed Package Comparison
              </h3>
              <p className="text-sm text-slate-300 mt-1">
                Compare coverage, alert protocols, and response SLAs side-by-side.
              </p>
            </div>
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="glass-pill-blue inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-colors w-fit"
            >
              <span>{showComparison ? 'Collapse Table' : 'Expand Comparison'}</span>
            </button>
          </div>

          {showComparison && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="bg-sentrova-gradient text-white rounded-xl overflow-hidden shadow-sm">
                    <th className="py-4 px-6 font-extrabold text-sm rounded-l-xl">
                      MONITORING CAPABILITY
                    </th>
                    <th className="py-4 px-6 font-extrabold text-sm text-center">
                      ESSENTIAL ($1.99)
                    </th>
                    <th className="py-4 px-6 font-extrabold text-sm text-center bg-[#0756C9]/80">
                      GROWTH ($2.99)
                    </th>
                    <th className="py-4 px-6 font-extrabold text-sm text-center rounded-r-xl">
                      ULTIMATE ($5.99)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-900/30">
                  {PACKAGE_COMPARISON.map((row, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? 'bg-[#08152E]/50' : 'bg-[#0B1C3D]/50'}
                    >
                      <td className="py-4 px-6 text-sm font-bold text-white">
                        {row.feature}
                      </td>

                      {/* Essential Value */}
                      <td className="py-4 px-6 text-sm text-center font-medium text-slate-300">
                        {typeof row.essential === 'boolean' ? (
                          row.essential ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-sky-500/20 text-[#00D2FF] mx-auto border border-sky-400/40">
                              <Check className="w-4 h-4 stroke-[3]" />
                            </span>
                          ) : (
                            <span className="text-slate-500 font-mono text-base">—</span>
                          )
                        ) : (
                          <span className="font-semibold text-white">{row.essential}</span>
                        )}
                      </td>

                      {/* Growth Value */}
                      <td className="py-4 px-6 text-sm text-center font-medium text-slate-300 bg-sky-500/10">
                        {typeof row.growth === 'boolean' ? (
                          row.growth ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-sentrova-gradient text-white mx-auto shadow-xs">
                              <Check className="w-4 h-4 stroke-[3]" />
                            </span>
                          ) : (
                            <span className="text-slate-500 font-mono text-base">—</span>
                          )
                        ) : (
                          <span className="font-bold text-[#38BDF8]">{row.growth}</span>
                        )}
                      </td>

                      {/* Ultimate Value */}
                      <td className="py-4 px-6 text-sm text-center font-medium text-slate-300">
                        {typeof row.ultimate === 'boolean' ? (
                          row.ultimate ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#16A34A] text-white mx-auto shadow-xs">
                              <Check className="w-4 h-4 stroke-[3]" />
                            </span>
                          ) : (
                            <span className="text-slate-500 font-mono text-base">—</span>
                          )
                        ) : (
                          <span className="font-bold text-white">{row.ultimate}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Bottom Table Note */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#00D2FF]" />
              <span>All packages include SSL/TLS encrypted video streams & GDPR-compliant storage.</span>
            </span>
            <button
              onClick={() => onOpenQuote()}
              className="text-[#00D2FF] font-bold hover:underline cursor-pointer"
            >
              Need a custom multi-site package? Talk to our team →
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
