import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Shield,
  Eye,
  Bell,
  FileText,
  Video,
  Radio,
  MessageSquare,
  Play,
} from 'lucide-react';
import { SENTROVA_CONTACT } from '../data/sentrovaData';
import { useSettings } from '../context/SettingsContext';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  onOpenQuote: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenQuote }) => {
  const { settings } = useSettings();
  const [currency, setCurrency] = useState<'GBP' | 'USD'>('GBP');
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const priceCardRef = useRef<HTMLDivElement>(null);
  const whatsappCardRef = useRef<HTMLDivElement>(null);
  const bgBlob1Ref = useRef<HTMLDivElement>(null);
  const bgBlob2Ref = useRef<HTMLDivElement>(null);
  const bgBlob3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (!prefersReducedMotion) {
        // Gentle floating animation on the price card
        if (priceCardRef.current) {
          gsap.to(priceCardRef.current, {
            y: -6,
            duration: 2.8,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        }

        // Parallax on blobs
        if (heroRef.current) {
          if (bgBlob1Ref.current) {
            gsap.to(bgBlob1Ref.current, {
              y: 120,
              ease: 'none',
              scrollTrigger: {
                trigger: heroRef.current,
                start: 'top top',
                end: 'bottom top',
                scrub: 1.2,
              },
            });
          }
          if (bgBlob2Ref.current) {
            gsap.to(bgBlob2Ref.current, {
              y: -80,
              ease: 'none',
              scrollTrigger: {
                trigger: heroRef.current,
                start: 'top top',
                end: 'bottom top',
                scrub: 1.4,
              },
            });
          }
        }
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const corePillars = [
    {
      icon: Video,
      title: 'LIVE CCTV MONITORING',
      desc: 'Real people monitoring your store in real-time.',
    },
    {
      icon: Bell,
      title: 'INSTANT ALERTS',
      desc: 'Get alerts when unusual activity is detected.',
    },
    {
      icon: Shield,
      title: 'THEFT & VANDALISM PREVENTION',
      desc: 'Deter theft, vandalism and unauthorized access.',
    },
    {
      icon: FileText,
      title: 'ACTIVITY REPORTS',
      desc: 'Stay informed with incident summaries.',
    },
  ];

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative pt-32 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-[#060E1E] text-white"
    >
      {/* Background radial glow layers */}
      <div
        ref={bgBlob1Ref}
        className="absolute top-[-100px] left-[-120px] w-[680px] h-[680px] bg-gradient-to-br from-[#087BFF]/35 to-[#00D2FF]/20 rounded-full blur-[140px] pointer-events-none -z-10"
      />
      <div
        ref={bgBlob2Ref}
        className="absolute top-[20%] right-[-140px] w-[720px] h-[720px] bg-gradient-to-bl from-[#00D2FF]/25 via-[#0756C9]/30 to-transparent rounded-full blur-[160px] pointer-events-none -z-10"
      />
      <div
        ref={bgBlob3Ref}
        className="absolute bottom-[-100px] left-[30%] w-[550px] h-[550px] bg-[#087BFF]/20 rounded-full blur-[130px] pointer-events-none -z-10"
      />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none -z-10"
        style={{
          backgroundImage: `radial-gradient(#00D2FF 1.2px, transparent 1.2px)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: Main Headline, Badge & 4 Key Surveillance Pillars            */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            <div ref={headlineRef} className="w-full">
              {/* Category Badge matching the poster: FOR CONVENIENCE STORES */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B2554] border border-[#00D2FF]/60 shadow-[0_0_15px_rgba(0,210,255,0.3)] mb-4">
                <span className="w-2 h-2 rounded-full bg-[#00D2FF] animate-pulse" />
                <span className="text-[11px] sm:text-[12px] font-extrabold tracking-[0.18em] uppercase text-white">
                  FOR CONVENIENCE STORES
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[62px] leading-[1.05] font-black tracking-tight mb-3">
                <span className="text-white">
                  {settings.hero_title || '24/7 CCTV MONITORING'}
                </span>
              </h1>

              {/* Sub-tagline */}
              <p className="text-slate-200 text-[16px] sm:text-[18px] font-medium leading-relaxed mb-8 max-w-[560px]">
                {settings.hero_description || 'Protect your store, your staff and your inventory – 24/7.'}
              </p>
            </div>

            {/* 4 Key Pillars Stack matching the poster */}
            <div ref={pillarsRef} className="w-full space-y-3.5 mb-8">
              {corePillars.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-[#0A1D3D] border border-sky-400/40 hover:border-[#00D2FF] hover:bg-[#0D244C] transition-all group shadow-md"
                  >
                    <div className="w-11 h-11 rounded-xl bg-[#0F2B5B] border border-sky-400/50 flex items-center justify-center text-[#00D2FF] group-hover:scale-105 group-hover:bg-sentrova-gradient group-hover:text-white transition-all shrink-0 shadow-xs mt-0.5">
                      <Icon className="w-5 h-5 stroke-[2.3]" />
                    </div>
                    <div className="flex flex-col text-left">
                      <h3 className="text-[14px] sm:text-[15px] font-black text-white tracking-wide group-hover:text-[#00D2FF] transition-colors uppercase">
                        {item.title}
                      </h3>
                      <p className="text-[13px] sm:text-[14px] text-slate-200 font-medium leading-snug mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
              <button
                onClick={onOpenQuote}
                className="bg-sentrova-gradient hover:opacity-95 text-white px-7 py-3.5 rounded-xl text-[15px] font-bold shadow-[0_8px_25px_rgba(8,123,255,0.35)] hover:shadow-[0_12px_35px_rgba(0,210,255,0.55)] tap-press cursor-pointer inline-flex items-center justify-center gap-2.5 border border-white/30"
              >
                <span>GET A FREE QUOTE</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                href={settings.whatsappLink || SENTROVA_CONTACT.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-btn-secondary px-6 py-3.5 rounded-xl text-[14px] sm:text-[15px] font-bold inline-flex items-center justify-center text-center tap-press cursor-pointer gap-2 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/40"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>WHATSAPP CONSULTATION</span>
              </a>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: Visual Frame + Starting from £99/mo + WhatsApp Strip        */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center py-4">
            
            {/* Glowing circular separator rings matching the poster */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] sm:w-[460px] h-[380px] sm:h-[460px] rounded-full border border-sky-400/20 pointer-events-none animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[370px] h-[300px] sm:h-[370px] rounded-full border border-dashed border-[#00D2FF]/30 pointer-events-none" />

            <div className="relative w-full max-w-[370px] sm:max-w-[420px] flex flex-col items-center">
              
              {/* Surveillance Monitor Visual Container */}
              <div
                ref={visualRef}
                className="relative w-full aspect-[16/10] bg-[#0A1832]/90 backdrop-blur-2xl rounded-3xl p-3 border-2 border-[#00D2FF]/50 shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden group"
              >
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-950 shadow-inner">
                  {/* Sentrova 24/7 Control Room Image */}
                  <img
                    src="/hero-monitoring.jpg"
                    alt="Sentrova 24/7 Live CCTV Operations Monitoring Room"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Gradient overlays for cinematic depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060E1E]/80 via-transparent to-[#00D2FF]/10 pointer-events-none" />

                  {/* Top Live Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-2 bg-[#061226]/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-sky-400/40 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[10px] font-black tracking-wider text-white">
                      UK CONTROL ROOM • LIVE
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 bg-[#061226]/90 backdrop-blur-md px-2 py-1 rounded-lg border border-sky-400/40 text-[10px] font-mono font-bold text-[#00D2FF] shadow-xs">
                    24/7 ACTIVE
                  </div>

                  {/* Camera Reticle Target in Center */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-20 h-16 border border-dashed border-[#00D2FF]/60 rounded-lg relative flex items-center justify-center shadow-[0_0_15px_rgba(0,210,255,0.35)]">
                      <div className="w-2 h-2 bg-[#00D2FF] rounded-full animate-ping" />
                    </div>
                  </div>

                  {/* Bottom Strip on Video Feed */}
                  <div className="absolute bottom-2 left-2 right-2 bg-[#061226]/92 backdrop-blur-md px-3 py-1.5 rounded-xl border border-sky-400/30 flex items-center justify-between text-[11px] text-slate-300 shadow-sm">
                    <span className="flex items-center gap-1.5 text-white font-bold text-[10px]">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#00D2FF]" />
                      <span>Dedicated UK Specialists</span>
                    </span>
                    <span className="text-[#00D2FF] font-semibold text-[10px] font-mono">100% Real-Time</span>
                  </div>
                </div>
              </div>

              {/* FLOATING PRICING CARD with Interactive Currency Switcher */}
              <div
                ref={priceCardRef}
                className="w-full mt-4 bg-gradient-to-br from-[#0B2350]/95 via-[#081734]/95 to-[#050D1E]/95 backdrop-blur-xl border-2 border-[#00D2FF] rounded-2xl p-4 sm:p-5 shadow-[0_15px_40px_rgba(0,210,255,0.3)] text-center relative overflow-hidden"
              >
                {/* Specular light highlight */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                
                {/* Header with Title & Currency Toggle */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] sm:text-[12px] font-black tracking-[0.18em] text-slate-300 uppercase">
                    STARTING FROM
                  </span>

                  {/* Currency Converter Switcher */}
                  <div className="inline-flex items-center p-0.5 rounded-lg bg-[#061226]/90 border border-sky-400/40 shadow-inner">
                    <button
                      onClick={() => setCurrency('GBP')}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-black transition-all cursor-pointer ${
                        currency === 'GBP'
                          ? 'bg-sentrova-gradient text-white shadow-xs border border-white/30'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="View in British Pounds (£)"
                    >
                      £ GBP
                    </button>
                    <button
                      onClick={() => setCurrency('USD')}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-black transition-all cursor-pointer ${
                        currency === 'USD'
                          ? 'bg-sentrova-gradient text-white shadow-xs border border-white/30'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="View in US Dollars ($)"
                    >
                      $ USD
                    </button>
                  </div>
                </div>
                
                {/* Dynamic Price Display */}
                <div className="flex items-baseline justify-center gap-1.5 my-1">
                  <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00D2FF] via-[#38BDF8] to-white drop-shadow-[0_0_20px_rgba(0,210,255,0.6)]">
                    {currency === 'GBP' ? '£99' : '$129'}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <span className="text-[11px] sm:text-[12px] font-extrabold tracking-[0.2em] text-[#38BDF8] uppercase">
                    PER MONTH
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    ({currency === 'GBP' ? '≈ $129 USD' : '≈ £99 GBP'})
                  </span>
                </div>
              </div>

              {/* WHATSAPP CONSULTATION STRIP matching the poster */}
              <div
                ref={whatsappCardRef}
                className="w-full mt-3 bg-[#08152E]/90 backdrop-blur-md border border-sky-400/30 rounded-2xl p-3 sm:p-3.5 shadow-lg flex items-center justify-between gap-3 hover:border-emerald-400/60 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 border border-[#25D366]/50 flex items-center justify-center text-[#25D366] shrink-0">
                    <MessageSquare className="w-5 h-5 fill-current" />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] sm:text-[11px] font-extrabold uppercase text-[#38BDF8] tracking-wider block">
                      BOOK YOUR FREE CONSULTATION
                    </span>
                    <a
                      href={settings.whatsappLink || SENTROVA_CONTACT.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[14px] sm:text-[15px] font-black text-white hover:text-[#25D366] transition-colors"
                    >
                      {settings.whatsappDisplay || SENTROVA_CONTACT.whatsappDisplay}
                    </a>
                  </div>
                </div>

                <a
                  href={settings.whatsappLink || SENTROVA_CONTACT.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 px-3 py-2 rounded-xl text-xs font-black shrink-0 transition-transform active:scale-95 shadow-xs"
                >
                  CHAT
                </a>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
