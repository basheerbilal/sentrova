import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  VideoOff,
  Home,
  ArrowLeft,
  Compass,
  PhoneCall,
} from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const popularDestinations = [
    { label: 'Surveillance Services', path: '/services', desc: '8 Active CCTV monitoring solutions' },
    { label: 'Pricing & Packages', path: '/pricing', desc: 'Hourly billing with zero lock-in' },
    { label: 'How It Works', path: '/how-it-works', desc: '4-Step remote deterrence pipeline' },
    { label: 'Client Industries', path: '/industries', desc: 'Retail, supermarkets, logistics & sites' },
    { label: 'About Sentrova', path: '/about', desc: 'UK certified control center operations' },
    { label: 'Contact Desk', path: '/contact', desc: '24/7 commercial operations inquiries' },
  ];

  return (
    <div className="w-full bg-[#060E1E] text-white min-h-screen pt-28 pb-20 relative overflow-hidden flex flex-col items-center justify-center">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-subtle-mesh opacity-30 pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-8">
        {/* Security Alert Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/15 border border-red-400/30 text-xs font-bold text-red-300 mb-6 shadow-sm">
          <ShieldAlert className="w-4 h-4 text-red-400 animate-pulse" />
          <span className="tracking-widest uppercase font-mono">FEED STATUS: 0x404 // SECTOR_NOT_FOUND</span>
        </div>

        {/* Central Camera / Glitch Visual */}
        <div className="relative inline-block mb-8">
          <div className="w-28 h-28 sm:w-36 sm:h-36 mx-auto rounded-3xl bg-[#0A162D] border border-sky-400/30 flex items-center justify-center shadow-[0_0_50px_rgba(8,123,255,0.25)] relative group">
            {/* Corner crosshairs to mimic CCTV monitor feed */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#00D2FF]" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#00D2FF]" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#00D2FF]" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#00D2FF]" />

            <VideoOff className="w-14 h-14 sm:w-18 sm:h-18 text-[#00D2FF] opacity-90 group-hover:scale-105 transition-transform" />

            <div className="absolute -bottom-3 px-3 py-0.5 rounded-full bg-red-950/90 border border-red-500/40 text-[10px] font-mono font-extrabold text-red-400 tracking-wider">
              CAMERA OFFLINE
            </div>
          </div>
        </div>

        {/* Big 404 Heading */}
        <h1 className="text-6xl sm:text-8xl font-black tracking-tighter text-sentrova-gradient mb-3 text-cyber-glow">
          404
        </h1>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4">
          Surveillance Sector Unavailable
        </h2>

        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-8">
          The requested surveillance feed or page coordinates do not exist in the Sentrova network. The sector may have been relocated, renamed, or is currently restricted.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-14">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-sky-400/30 hover:border-[#00D2FF] bg-[#0A162D]/80 hover:bg-[#0B1E40] text-slate-200 hover:text-white font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <ArrowLeft className="w-4 h-4 text-[#00D2FF]" />
            <span>Return to Previous Screen</span>
          </button>

          <Link
            to="/"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-sentrova-gradient hover:opacity-95 text-white font-extrabold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-[0_8px_25px_rgba(8,123,255,0.4)] cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Go to Command Center (Home)</span>
          </Link>

          <Link
            to="/contact"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-sky-400/30 hover:border-emerald-400 bg-[#0A162D]/80 hover:bg-emerald-950/30 text-slate-200 hover:text-emerald-300 font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <span>Contact Operations Desk</span>
          </Link>
        </div>

        {/* Quick Sector Links Grid */}
        <div className="bg-[#0A162D]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-sky-400/20 text-left shadow-2xl shadow-blue-950/40">
          <div className="flex items-center gap-2 mb-5 pb-4 border-b border-sky-500/15">
            <Compass className="w-4 h-4 text-[#00D2FF]" />
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Active Security Sectors & Verified Links
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {popularDestinations.map((dest, i) => (
              <Link
                key={i}
                to={dest.path}
                className="p-3.5 rounded-2xl bg-[#060E1E]/80 border border-sky-400/15 hover:border-[#00D2FF]/60 hover:bg-[#0B1A38] transition-all group cursor-pointer block"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-extrabold text-white group-hover:text-[#00D2FF] transition-colors">
                    {dest.label}
                  </span>
                  <span className="text-[10px] text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-normal leading-snug">
                  {dest.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
