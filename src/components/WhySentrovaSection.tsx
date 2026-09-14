import React from 'react';
import { WHY_CHOOSE_ITEMS } from '../data/sentrovaData';
import {
  Clock,
  Radio,
  Zap,
  ShieldCheck,
  FileSpreadsheet,
  TrendingUp,
  CheckCircle,
  Award,
} from 'lucide-react';

export const WhySentrovaSection: React.FC = () => {
  const iconMap: Record<string, React.ElementType> = {
    Clock,
    Radio,
    Zap,
    ShieldCheck,
    FileSpreadsheet,
    TrendingUp,
  };

  return (
    <section id="why-sentrova" className="py-24 bg-[#060E1E] relative overflow-hidden text-white">
      {/* Background ambient glow for glass depth */}
      <div className="absolute top-[10%] left-[-100px] w-[600px] h-[600px] bg-[#00D2FF]/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] right-[-100px] w-[600px] h-[600px] bg-[#0756C9]/20 rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header Eyebrow */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="glass-pill-blue inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-[#00D2FF]" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#38BDF8]">
              The Sentrova Advantage
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            WHY BUSINESSES CHOOSE SENTROVA
          </h2>
          <p className="text-lg md:text-xl text-slate-300 font-normal leading-relaxed">
            Engineered from the ground up for UK commercial businesses that demand reliable loss prevention without the crippling costs of manned physical security.
          </p>
        </div>

        {/* Split Section: LEFT Large Security Image, RIGHT 6 Features */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* LEFT: Large Security Image with Glass Overlays */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-sky-400/30 shadow-[0_20px_50px_rgba(0,0,0,0.7)] aspect-[4/5] bg-slate-950 group">
              <img
                src="/why-sentrova.jpg"
                alt="Sentrova UK Certified Surveillance Operations Room"
                className="w-full h-full object-cover object-center opacity-95 group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Soft Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#060E1E] via-[#060E1E]/30 to-transparent pointer-events-none" />

              {/* Floating Top Glass Badge */}
              <div className="absolute top-5 left-5 bg-[#0A1832]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-sky-400/35 shadow-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-[#00D2FF]" />
                <span className="text-xs font-extrabold text-white">UK Accredited Operations</span>
              </div>

              {/* Floating Bottom Card Inside Image */}
              <div className="absolute bottom-6 left-6 right-6 bg-[#0B1A38]/95 backdrop-blur-xl p-5 rounded-2xl border border-sky-400/40 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-[#38BDF8] uppercase tracking-wider">
                    OPERATIONS DISPATCH
                  </span>
                  <span className="text-xs font-bold text-[#16A34A] flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-white">
                  &lt; 30 Seconds
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Average incident alert time from detection to store manager notification.
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: 6 Key Features in Light Glass Cards */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
              {WHY_CHOOSE_ITEMS.map((item, idx) => {
                const Icon = iconMap[item.icon] || ShieldCheck;

                return (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-[#0B1A38]/75 backdrop-blur-md border border-sky-400/25 shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:-translate-y-1.5 hover:border-[#00D2FF]/50 hover:shadow-[0_16px_40px_rgba(0,210,255,0.2)] hover:bg-[#0D224A]/85 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-sky-500/15 border border-sky-400/40 group-hover:bg-[#00D2FF] text-[#00D2FF] group-hover:text-slate-950 transition-colors flex items-center justify-center mb-4 shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>

                    <h3 className="text-lg font-extrabold text-white group-hover:text-[#00D2FF] transition-colors mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
