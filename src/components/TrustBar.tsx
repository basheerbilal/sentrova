import React from 'react';
import { Link } from 'react-router-dom';
import {
  Store,
  Clock,
  Users,
  MapPin,
  ShieldCheck,
  Radio,
  Zap,
  Shield,
  Activity,
  DollarSign,
  Layers,
  ArrowRight,
  Building,
  PhoneCall,
} from 'lucide-react';

export const TrustBar: React.FC = () => {
  const trustItems = [
    {
      icon: Store,
      title: 'CONVENIENCE STORES',
      subtitle: 'Specialised Retail Protection',
    },
    {
      icon: Clock,
      title: '24/7 MONITORING',
      subtitle: 'Continuous Live Video Watch',
    },
    {
      icon: Users,
      title: 'REAL PEOPLE REAL PROTECTION',
      subtitle: 'Trained UK Security Specialists',
    },
    {
      icon: MapPin,
      title: 'UK BASED SERVICE',
      subtitle: 'National Operations & Fast Support',
    },
    {
      icon: ShieldCheck,
      title: 'ZERO HARDWARE CAPITAL',
      subtitle: 'Connects to 99% of Existing CCTV',
    },
    {
      icon: Zap,
      title: 'SUB-30s INTERVENTION',
      subtitle: 'Direct WhatsApp & Phone Escalations',
    },
    {
      icon: Radio,
      title: 'REMOTE VOICE DETERRENCE',
      subtitle: 'Live On-Site Audio Talk-Down',
    },
  ];

  const navItems = [
    {
      to: '/services',
      icon: Shield,
      subtitle: '8 Core Modules',
      title: 'Our Services',
    },
    {
      to: '/how-it-works',
      icon: Activity,
      subtitle: 'Under 30s Response',
      title: 'How It Works',
    },
    {
      to: '/pricing',
      icon: DollarSign,
      subtitle: 'From $1.99/hr',
      title: 'Hourly Rates',
    },
    {
      to: '/industries',
      icon: Layers,
      subtitle: 'Sector Threat Models',
      title: 'Industries',
    },
    {
      to: '/about',
      icon: Building,
      subtitle: 'Certified UK Operations',
      title: 'About Sentrova',
    },
    {
      to: '/contact',
      icon: PhoneCall,
      subtitle: 'Direct Operations Desk',
      title: 'Contact Us',
    },
  ];

  return (
    <section id="trust-bar" className="bg-[#08142A]/90 backdrop-blur-md border-t border-b border-sky-500/20 py-8 relative overflow-hidden">
      <div className="w-full">
        {/* ROW 1: Continuous Marquee Moving to the LEFT */}
        <div className="relative overflow-hidden marquee-container py-1.5">
          {/* Soft Left & Right Ambient Gradients */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#08142A] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#08142A] to-transparent z-10 pointer-events-none" />

          <div className="marquee-track-left gap-4 lg:gap-5 flex pl-4">
            {[...trustItems, ...trustItems].map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={`trust-${index}`}
                  className="flex items-center gap-3.5 p-3 px-4 rounded-2xl bg-[#0B1A38]/85 backdrop-blur-md border border-sky-400/25 shadow-xs hover:border-[#00D2FF]/60 hover:bg-[#0E2045]/95 transition-all group shrink-0 min-w-[270px] sm:min-w-[300px] cursor-pointer"
                >
                  <div className="w-11 h-11 bg-[#0B2350] border border-sky-400/40 rounded-xl flex items-center justify-center text-[#00D2FF] group-hover:scale-105 group-hover:bg-sentrova-gradient group-hover:text-white transition-all shrink-0 shadow-xs">
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[13px] sm:text-[14px] font-black text-white tracking-wide group-hover:text-[#00D2FF] transition-colors uppercase whitespace-nowrap">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                      {item.subtitle}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MIDDLE SLOGAN BANNER */}
        <div className="my-5 py-3 border-y border-sky-900/40 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center px-4">
          <p className="text-xs sm:text-sm md:text-base font-black tracking-[0.25em] text-white uppercase">
            REAL PEOPLE. REAL TIME.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D2FF] to-[#38BDF8] drop-shadow-[0_0_15px_rgba(0,210,255,0.4)]">
              REAL PROTECTION.
            </span>
          </p>
        </div>

        {/* ROW 2: Continuous Marquee Moving to the RIGHT */}
        <div className="relative overflow-hidden marquee-container py-1.5">
          {/* Soft Left & Right Ambient Gradients */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#08142A] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#08142A] to-transparent z-10 pointer-events-none" />

          <div className="marquee-track-right gap-4 lg:gap-5 flex pl-4">
            {[...navItems, ...navItems].map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={`nav-${index}`}
                  to={item.to}
                  className="flex items-center justify-between gap-4 p-3 px-4 rounded-2xl bg-[#0B1A38]/85 backdrop-blur-md border border-sky-400/25 shadow-xs hover:border-[#00D2FF]/60 hover:bg-[#0E2045]/95 hover:shadow-lg hover:shadow-sky-500/15 transition-all group shrink-0 min-w-[270px] sm:min-w-[300px]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-[#00D2FF] group-hover:bg-sentrova-gradient group-hover:text-white transition-all flex items-center justify-center font-bold shrink-0 border border-sky-400/30">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="text-[11px] text-slate-400 font-medium whitespace-nowrap">{item.subtitle}</div>
                      <div className="text-sm font-bold text-white group-hover:text-[#00D2FF] transition-colors whitespace-nowrap">{item.title}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#00D2FF] group-hover:translate-x-1 transition-all shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

