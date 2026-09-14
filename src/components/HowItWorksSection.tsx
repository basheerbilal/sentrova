import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HOW_IT_WORKS_STEPS } from '../data/sentrovaData';
import { Network, Eye, AlertCircle, Send, CheckCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const HowItWorksSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineFillRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement[]>([]);

  const iconMap: Record<string, React.ElementType> = {
    Network,
    Eye,
    AlertCircle,
    Send,
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (lineFillRef.current && sectionRef.current) {
        gsap.fromTo(
          lineFillRef.current,
          { width: '0%' },
          {
            width: '100%',
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              end: 'bottom 80%',
              scrub: 1,
            },
          }
        );
      }

      stepsRef.current.forEach((stepEl, i) => {
        if (!stepEl) return;
        gsap.fromTo(
          stepEl,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: stepEl,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            delay: i * 0.1,
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="py-24 bg-[#060E1E] relative overflow-hidden border-y border-sky-500/20 text-white"
    >
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-[10%] left-[-100px] w-[600px] h-[600px] bg-[#00D2FF]/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] right-[-100px] w-[600px] h-[600px] bg-[#0756C9]/20 rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="glass-pill-blue inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-[#00D2FF]" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#38BDF8]">
              Effortless Onboarding
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            HOW SENTROVA WORKS
          </h2>
          <p className="text-lg md:text-xl text-slate-300 font-normal leading-relaxed">
            Deploy professional remote monitoring across your premises in 4 simple, transparent steps.
          </p>
        </div>

        {/* Desktop Connected Workflow with Progress Line */}
        <div className="relative">
          
          {/* Horizontal Connection Track (Desktop) */}
          <div className="hidden lg:block absolute top-14 left-[12%] right-[12%] h-1 bg-sky-950/80 rounded-full z-0">
            {/* Animated Blue Progress Line */}
            <div
              ref={lineFillRef}
              className="h-full bg-gradient-to-r from-[#0756C9] via-[#087BFF] to-[#00D2FF] rounded-full shadow-[0_0_12px_#00D2FF]"
              style={{ width: '0%' }}
            />
          </div>

          {/* 4 Steps Grid in Light Glass Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {HOW_IT_WORKS_STEPS.map((step, idx) => {
              const Icon = iconMap[step.icon] || Network;
              return (
                <div
                  key={step.step}
                  ref={(el) => {
                    if (el) stepsRef.current[idx] = el;
                  }}
                  className="bg-[#0B1A38]/75 backdrop-blur-md rounded-2xl p-7 border border-sky-400/25 shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_16px_40px_rgba(0,210,255,0.2)] hover:border-[#00D2FF]/50 hover:-translate-y-1.5 hover:bg-[#0D224A]/85 transition-all duration-300 flex flex-col justify-between group relative text-left"
                >
                  <div>
                    {/* Top Step Number & Icon Badge */}
                    <div className="flex items-center justify-between mb-6">
                      {/* Step Number Glass Pill */}
                      <span className="glass-pill-blue text-xs font-extrabold tracking-wider px-3 py-1 rounded-full">
                        STEP {step.step}
                      </span>

                      {/* Icon Circle */}
                      <div className="w-12 h-12 rounded-xl bg-sky-500/15 border border-sky-400/40 group-hover:border-[#00D2FF] group-hover:bg-[#00D2FF] text-[#00D2FF] group-hover:text-slate-950 flex items-center justify-center transition-colors shadow-xs">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Step Title */}
                    <h3 className="text-xl font-extrabold text-white tracking-tight mb-2 group-hover:text-[#00D2FF] transition-colors">
                      {step.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-sm font-bold text-[#38BDF8] mb-3">
                      {step.description}
                    </p>

                    {/* Operational Details */}
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {step.details}
                    </p>
                  </div>

                  {/* Bottom Verification Check */}
                  <div className="mt-6 pt-4 border-t border-sky-900/40 flex items-center gap-2 text-xs font-semibold text-[#00D2FF]">
                    <CheckCircle className="w-4 h-4" />
                    <span>Active Protocol Verified</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Supporting Assurance Strip in Glass Panel */}
        <div className="mt-14 p-6 bg-white/80 backdrop-blur-xl rounded-2xl border border-white/95 shadow-[0_10px_35px_rgba(20,100,200,0.06)] flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <h4 className="text-base font-extrabold text-[#0B1220]">
              Already have an NVR or Cloud DVR installed?
            </h4>
            <p className="text-sm text-[#536176]">
              We link with Hikvision, Dahua, Axis, Hanwha, Uniview, and standard ONVIF IP systems in under 20 minutes.
            </p>
          </div>
          <a
            href="#contact"
            className="glass-btn-secondary inline-flex items-center justify-center whitespace-nowrap font-bold text-sm px-6 py-3 rounded-xl transition-all"
          >
            Check Camera Compatibility
          </a>
        </div>

      </div>
    </section>
  );
};
