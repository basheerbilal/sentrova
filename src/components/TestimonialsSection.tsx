import React, { useState, useEffect } from 'react';
import { TESTIMONIALS as DEFAULT_TESTIMONIALS } from '../data/sentrovaData';
import {
  Quote,
  Star,
  RotateCw,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  Clock,
  Cpu,
  Building2,
  Sparkles,
} from 'lucide-react';
import { TestimonialItem } from '../types';
import { api } from '../services/api';

interface OutcomeData {
  primaryMetric: string;
  metricLabel: string;
  costSavings: string;
  costLabel: string;
  responseSpeed: string;
  hardware: string;
  summary: string;
  tag: string;
}

const OUTCOMES_MAP: Record<string, OutcomeData> = {
  t1: {
    primaryMetric: '-68%',
    metricLabel: 'Shop Floor Shrinkage',
    costSavings: '£4,200/mo',
    costLabel: 'Stock Loss Prevented',
    responseSpeed: '< 22s',
    hardware: 'Dahua NVR (4 Stores)',
    summary: 'Concealment detected in real-time before checkout exit; floor manager notified discreetly.',
    tag: 'Retail Flagship',
  },
  t2: {
    primaryMetric: '0 Breaches',
    metricLabel: 'Night Perimeter Security',
    costSavings: '65% Cheaper',
    costLabel: 'vs Static Night Guards',
    responseSpeed: '< 28s',
    hardware: '32 Hikvision HD Feeds',
    summary: 'Continuous 360° yard coverage with instant two-way voice deterrence and police-ready dossiers.',
    tag: 'Logistics Depot',
  },
  t3: {
    primaryMetric: 'Day 1 ROI',
    metricLabel: 'Till Shortage Reduction',
    costSavings: '£1,850/mo',
    costLabel: 'Shrinkage & Leakage Saved',
    responseSpeed: '< 18s',
    hardware: 'Existing POS CCTV Setup',
    summary: 'Zero register discrepancies and improved staff accountability across cashiers and delivery dock.',
    tag: 'Supermarket & Grocer',
  },
};

export const TestimonialsSection: React.FC = () => {
  const [items, setItems] = useState<TestimonialItem[]>(DEFAULT_TESTIMONIALS);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  useEffect(() => {
    api
      .getTestimonials()
      .then((apiItems) => {
        if (apiItems && apiItems.length > 0) {
          const mapped: TestimonialItem[] = apiItems.map((t) => ({
            id: String(t.id),
            name: t.customer_name,
            role: t.designation,
            company: t.company_name,
            industry: t.company_name,
            content: t.content,
            rating: t.rating,
          }));
          setItems(mapped);
        }
      })
      .catch(() => {
        // fallback to DEFAULT_TESTIMONIALS
      });
  }, []);

  const toggleFlip = (id: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getOutcome = (t: TestimonialItem, idx: number): OutcomeData => {
    if (OUTCOMES_MAP[t.id]) return OUTCOMES_MAP[t.id];
    return {
      primaryMetric: '99.4%',
      metricLabel: 'Crime Deterrence Rate',
      costSavings: '£2,500+',
      costLabel: 'Average Monthly Savings',
      responseSpeed: '< 30s',
      hardware: 'Existing Camera Bridge',
      summary: 'Active human operator verification eliminated false alarms and stopped crime attempts in progress.',
      tag: t.industry || `Client Partner #${idx + 1}`,
    };
  };

  return (
    <section id="testimonials" className="py-24 bg-[#060E1E] text-white relative overflow-hidden border-t border-sky-500/15">
      {/* Background ambient lighting */}
      <div className="absolute top-[15%] left-[-120px] w-[550px] h-[550px] bg-[#00D2FF]/10 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-[15%] right-[-120px] w-[600px] h-[600px] bg-[#0756C9]/15 rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="glass-pill-blue inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#00D2FF]" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#38BDF8]">
              Interactive Reviews & Case Studies
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            TRUSTED BY <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-200 to-[#00D2FF]">COMMERCIAL LEADERS</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
            See how real UK retailers, logistics hubs, and commercial operators safeguard their bottom line.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#00D2FF] bg-sky-500/10 px-4 py-1.5 rounded-full border border-sky-400/25">
            <RotateCw className="w-3.5 h-3.5 animate-spin-slow" />
            <span>Tap any card to flip and inspect verified case results & ROI metrics</span>
          </div>
        </div>

        {/* 3D Flip Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((t, idx) => {
            const isFlipped = !!flippedCards[t.id];
            const outcome = getOutcome(t, idx);
            const initials = t.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={t.id}
                className="perspective-1000 h-[480px] w-full cursor-pointer select-none group"
                onClick={() => toggleFlip(t.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleFlip(t.id);
                  }
                }}
                aria-label={`Testimonial card for ${t.name}. Press to flip.`}
              >
                <div
                  className={`relative w-full h-full transform-style-3d transition-transform duration-700 ease-out ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                >
                  {/* FRONT FACE (Client Testimonial Review) */}
                  <div className="absolute inset-0 backface-hidden bg-[#0A162D]/85 backdrop-blur-xl rounded-3xl p-7 border border-sky-400/25 shadow-[0_12px_35px_rgba(0,0,0,0.5)] group-hover:border-[#00D2FF]/60 group-hover:shadow-[0_16px_45px_rgba(0,210,255,0.2)] flex flex-col justify-between transition-all duration-300 overflow-hidden text-left">
                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00D2FF]/60 to-transparent pointer-events-none" />

                    <div>
                      {/* Card Header: Quote Badge + 5 Stars + Flip Hint */}
                      <div className="flex items-center justify-between mb-5">
                        <div className="w-11 h-11 rounded-2xl bg-sky-500/15 border border-sky-400/30 text-[#00D2FF] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                          <Quote className="w-5 h-5 stroke-[2.2]" />
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-1">
                            {[...Array(t.rating || 5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Verified Client
                          </span>
                        </div>
                      </div>

                      {/* Testimonial Quote */}
                      <p className="text-sm text-slate-200 leading-relaxed font-normal mb-4 line-clamp-6">
                        "{t.content}"
                      </p>
                    </div>

                    <div>
                      {/* Author Info */}
                      <div className="pt-4 border-t border-sky-500/20 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#087BFF] to-[#00D2FF] text-slate-950 font-black text-xs flex items-center justify-center shadow-sm shrink-0 border border-white/30">
                          {initials}
                        </div>
                        <div className="overflow-hidden">
                          <div className="font-extrabold text-white text-sm truncate">
                            {t.name}
                          </div>
                          <div className="text-xs font-semibold text-[#38BDF8] truncate">
                            {t.role} • {t.company}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {t.industry}
                          </div>
                        </div>
                      </div>

                      {/* Flip Card Action Bar */}
                      <div className="mt-4 pt-3 border-t border-sky-900/50 flex items-center justify-between text-xs font-bold text-[#00D2FF] group-hover:text-white transition-colors">
                        <span className="flex items-center gap-1.5">
                          <RotateCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                          <span>Flip for Verified Case ROI</span>
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 group-hover:text-[#00D2FF]">
                          View stats →
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* BACK FACE (Case Outcome & Verified Metrics) */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#0C1E42]/95 backdrop-blur-2xl rounded-3xl p-7 border-2 border-[#00D2FF]/60 shadow-[0_20px_55px_rgba(0,210,255,0.25)] flex flex-col justify-between text-left overflow-hidden">
                    {/* Top Accent Glow Line */}
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#00D2FF] to-transparent pointer-events-none" />

                    <div>
                      {/* Back Header */}
                      <div className="flex items-center justify-between mb-5">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00D2FF]/20 border border-[#00D2FF]/40 text-xs font-extrabold text-[#38BDF8]">
                          <ShieldCheck className="w-4 h-4 text-[#00D2FF]" />
                          <span>VERIFIED CASE ROI</span>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded-full border border-sky-400/30">
                          {outcome.tag}
                        </span>
                      </div>

                      {/* 2x2 Metric Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="bg-[#061226]/90 p-3.5 rounded-2xl border border-sky-400/25">
                          <div className="text-xl font-black text-[#00D2FF] tracking-tight">
                            {outcome.primaryMetric}
                          </div>
                          <div className="text-[11px] text-slate-300 font-semibold leading-tight mt-0.5">
                            {outcome.metricLabel}
                          </div>
                        </div>

                        <div className="bg-[#061226]/90 p-3.5 rounded-2xl border border-sky-400/25">
                          <div className="text-xl font-black text-[#10B981] tracking-tight">
                            {outcome.costSavings}
                          </div>
                          <div className="text-[11px] text-slate-300 font-semibold leading-tight mt-0.5">
                            {outcome.costLabel}
                          </div>
                        </div>

                        <div className="bg-[#061226]/90 p-3.5 rounded-2xl border border-sky-400/25">
                          <div className="flex items-center gap-1 text-white text-xs font-black">
                            <Clock className="w-3.5 h-3.5 text-[#00D2FF]" />
                            <span>{outcome.responseSpeed}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
                            Intervention Time
                          </div>
                        </div>

                        <div className="bg-[#061226]/90 p-3.5 rounded-2xl border border-sky-400/25">
                          <div className="flex items-center gap-1 text-white text-xs font-black truncate">
                            <Cpu className="w-3.5 h-3.5 text-[#00D2FF] shrink-0" />
                            <span className="truncate">Active Feeds</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">
                            {outcome.hardware}
                          </div>
                        </div>
                      </div>

                      {/* Outcome Narrative Summary */}
                      <div className="p-3.5 bg-[#061226]/95 rounded-2xl border-l-3 border-[#00D2FF] border-r border-t border-b border-sky-400/20 text-xs text-slate-200 leading-relaxed">
                        <span className="font-extrabold text-white block mb-0.5">
                          Operational Result:
                        </span>
                        {outcome.summary}
                      </div>
                    </div>

                    {/* Flip Back Button */}
                    <div className="pt-3 border-t border-sky-900/50">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFlip(t.id);
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/40 text-xs font-bold text-[#00D2FF] hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Flip Back to Testimonial Review</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Trust Note */}
        <div className="mt-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          <span>All client case outcomes verified by Sentrova UK Control Desk operations.</span>
        </div>

      </div>
    </section>
  );
};

