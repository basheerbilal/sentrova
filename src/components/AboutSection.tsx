import React from 'react';
import { Eye, ShieldCheck, Cpu } from 'lucide-react';

interface AboutSectionProps {
  onOpenQuote: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = () => {
  const values = [
    {
      title: 'VIGILANCE',
      description: 'Zero lapses in attention. Every shift is staffed by dedicated surveillance professionals focused entirely on anomaly detection and active loss prevention.',
      icon: Eye,
    },
    {
      title: 'RELIABILITY',
      description: 'Always online, always responsive. Our infrastructure maintains 99.98% connectivity with redundant encrypted gateways across the United Kingdom.',
      icon: ShieldCheck,
    },
    {
      title: 'TECHNOLOGY',
      description: 'Cutting-edge optical intelligence layered with human expertise. We turn passive camera hardware into proactive security deterrence.',
      icon: Cpu,
    },
  ];

  return (
    <section id="about" className="py-24 bg-[#060E1E] text-white relative overflow-hidden border-t border-sky-500/10">
      {/* Background ambient lighting */}
      <div className="absolute top-[10%] left-[-100px] w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] right-[-100px] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Content Layout */}
        <div className="max-w-4xl mx-auto text-left">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/15 border border-sky-400/30 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#00D2FF] animate-pulse" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#38BDF8]">
              About Sentrova
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4">
            SECURITY YOU CAN <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-200 to-[#00D2FF]">TRUST.</span>
          </h2>

          {/* Blue Accent Line */}
          <div className="w-24 h-1.5 bg-sentrova-gradient rounded-full mb-8 shadow-[0_2px_15px_rgba(0,210,255,0.6)]" />

          {/* Short Corporate Paragraphs */}
          <div className="space-y-5 text-base sm:text-lg text-slate-300 font-normal leading-relaxed mb-16">
            <p>
              Sentrova was founded to solve a fundamental crisis in commercial security: traditional CCTV only records crimes after they happen, while physical on-site guards are prohibitively expensive and prone to distraction.
            </p>
            <p>
              We bridge this gap with professional remote video monitoring. By connecting securely to your existing camera infrastructure, our UK operations specialists provide vigilant human eyes on your business around the clock—protecting revenue, deterring retail shrinkage, and keeping your staff safe.
            </p>
          </div>

          {/* Three Core Values in Dark Glass Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-sky-500/15">
            {values.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#0A162D]/70 backdrop-blur-xl p-7 rounded-3xl border border-sky-400/20 shadow-xl shadow-blue-950/20 hover:border-[#00D2FF]/60 hover:-translate-y-1.5 hover:shadow-[0_16px_45px_rgba(0,210,255,0.18)] hover:bg-[#0A162D]/90 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-400/30 text-[#00D2FF] group-hover:bg-sentrova-gradient group-hover:text-white transition-all flex items-center justify-center mb-5 shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-extrabold tracking-wider text-white group-hover:text-[#38BDF8] transition-colors mb-2">
                    {val.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {val.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
