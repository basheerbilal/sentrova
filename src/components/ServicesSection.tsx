import React, { useState, useEffect, useRef } from 'react';
import { SERVICES } from '../data/sentrovaData';
import { ServiceItem } from '../types';
import { ServiceDetailsModal } from './ServiceDetailsModal';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ShieldAlert,
  Eye,
  Users,
  AlertTriangle,
  Lock,
  Moon,
  Radio,
  FileText,
  Check,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ServicesSectionProps {
  onOpenQuote: (packageId?: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenQuote }) => {
  const [activeTab, setActiveTab] = useState<string>(SERVICES[0].id);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const servicesGridRef = useRef<HTMLDivElement>(null);

  const handleOpenDetails = (service: ServiceItem) => {
    setSelectedService(service);
    setActiveTab(service.id);
    setIsDetailsModalOpen(true);
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (servicesGridRef.current && sectionRef.current) {
        gsap.fromTo(
          servicesGridRef.current.children,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.06,
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

  const iconMap: Record<string, React.ElementType> = {
    ShieldAlert,
    Eye,
    Users,
    AlertTriangle,
    Lock,
    Moon,
    Radio,
    FileText,
  };

  return (
    <section ref={sectionRef} id="services" className="py-24 bg-[#060E1E] relative overflow-hidden text-white">
      {/* Background soft ambient lights for glass depth */}
      <div className="absolute top-[10%] left-[-100px] w-[600px] h-[600px] bg-[#00D2FF]/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] right-[-100px] w-[650px] h-[650px] bg-[#0756C9]/20 rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="glass-pill-blue inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-[#00D2FF]" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#38BDF8]">
              Specialist Video Surveillance
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            MORE THAN JUST CAMERAS.
          </h2>
          <p className="text-lg md:text-xl text-slate-300 font-normal leading-relaxed">
            Active monitoring that helps businesses detect suspicious activity when it matters most.
          </p>
        </div>

        {/* 8 Premium Glassmorphism Service Cards */}
        <div ref={servicesGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {SERVICES.map((service) => {
            const Icon = iconMap[service.icon] || ShieldAlert;
            const isSelected = activeTab === service.id;

            return (
              <div
                key={service.id}
                onClick={() => handleOpenDetails(service)}
                className={`rounded-2xl p-6 transition-all duration-300 cursor-pointer text-left flex flex-col justify-between group relative overflow-hidden ${
                  isSelected
                    ? 'bg-[#0E2045]/90 backdrop-blur-xl border border-[#00D2FF]/60 shadow-[0_16px_45px_-8px_rgba(0,210,255,0.25)] -translate-y-1.5 ring-1 ring-[#00D2FF]/40'
                    : 'bg-[#0B1A38]/75 backdrop-blur-md border border-sky-400/25 shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:-translate-y-1.5 hover:border-[#00D2FF]/50 hover:shadow-[0_16px_45px_-8px_rgba(0,210,255,0.2)] hover:bg-[#0D224A]/85'
                }`}
                style={{ minHeight: '260px' }}
              >
                {/* Subtle glass specular top highlight */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

                <div>
                  {/* Glass Icon Box */}
                  <div className="w-12 h-12 rounded-xl bg-sky-500/15 backdrop-blur-sm border border-sky-400/40 text-[#00D2FF] group-hover:bg-[#00D2FF] group-hover:text-slate-950 transition-all flex items-center justify-center mb-5 shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-extrabold text-white group-hover:text-[#00D2FF] transition-colors mb-2.5 leading-snug">
                    {service.title}
                  </h3>

                  {/* Short Description */}
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {service.shortDesc}
                  </p>
                </div>

                {/* Benefits Footer link */}
                <div className="mt-5 pt-4 border-t border-sky-900/40 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDetails(service);
                    }}
                    className="flex items-center text-xs font-bold text-[#00D2FF] group-hover:translate-x-1 transition-transform cursor-pointer hover:underline"
                  >
                    <span>Explore details</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                  <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded-full border border-sky-400/30">
                    24/7
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* SERVICES VISUAL: Alternating Layouts with Layered Glass Panels */}
        <div className="space-y-20">

          {/* Alternate 1: LEFT CCTV Image, RIGHT Service Explanation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center bg-[#0B1A38]/75 backdrop-blur-xl rounded-3xl p-8 sm:p-10 lg:p-12 border border-sky-400/25 shadow-[0_12px_45px_rgba(0,0,0,0.5)]">
            {/* LEFT: Large CCTV Image */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-sky-400/30 aspect-[4/3] bg-slate-950">
                <img
                  src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=1200&auto=format&fit=crop"
                  alt="Retail Store CCTV Loss Prevention"
                  className="w-full h-full object-cover opacity-85"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Overlaid Live Surveillance Metadata Tag */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#0A1832]/90 backdrop-blur-md p-3.5 rounded-xl border border-sky-400/35 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse" />
                    <span className="text-xs font-bold text-white">HIGH-SHRINK AISLE • ACTIVE OVERLAY</span>
                  </div>
                  <span className="text-xs font-bold text-[#00D2FF]">Deterrence Active</span>
                </div>
              </div>

              {/* Floating Glass Stat Card */}
              <div className="absolute -bottom-5 -right-4 bg-[#0B1A38]/95 backdrop-blur-md p-4 rounded-xl border border-sky-400/40 shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-[#00D2FF]">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-base font-extrabold text-white">Up to 74%</div>
                  <div className="text-[11px] text-slate-400 font-medium">Reduction in Store Shrinkage</div>
                </div>
              </div>
            </div>

            {/* RIGHT: Service Explanation */}
            <div className="lg:col-span-6 text-left">
              <div className="glass-pill-blue inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-extrabold uppercase tracking-wider mb-4">
                Active Deterrence
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-4">
                Catch Shoplifting & Concealment In Real Time
              </h3>
              <p className="text-base text-slate-300 leading-relaxed mb-6">
                Most CCTV systems only function as historical recorders—documenting merchandise that was already stolen. Sentrova flips the script with live, active visual surveillance. Our UK-based specialists monitor aisles, high-value fragrance/alcohol displays, and checkout points to detect concealment before perpetrators can walk out the door.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-sky-500/20 border border-sky-400/40 text-[#00D2FF] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm font-semibold text-white">
                    Real-time suspect tagging across multiple camera angles.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-sky-500/20 border border-sky-400/40 text-[#00D2FF] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm font-semibold text-white">
                    Discreet direct phone or WhatsApp message to store managers within 30 seconds.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-sky-500/20 border border-sky-400/40 text-[#00D2FF] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm font-semibold text-white">
                    High-definition digital evidentiary export dossiers ready for police reporting.
                  </span>
                </div>
              </div>

              <button
                onClick={() => onOpenQuote()}
                className="inline-flex items-center gap-2 bg-sentrova-gradient hover:opacity-95 text-white text-sm font-bold px-6 py-3 rounded-xl shadow-[0_6px_20px_rgba(8,123,255,0.25)] hover:shadow-[0_8px_25px_rgba(0,210,255,0.4)] transition-all cursor-pointer border border-white/25"
              >
                <span>Request Retail Protection Audit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Alternate 2: RIGHT Image, LEFT Service Explanation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center bg-[#0B1A38]/75 backdrop-blur-xl rounded-3xl p-8 sm:p-10 lg:p-12 border border-sky-400/25 shadow-[0_12px_45px_rgba(0,0,0,0.5)]">
            {/* LEFT: Text */}
            <div className="lg:col-span-6 text-left order-2 lg:order-1">
              <div className="glass-pill-blue inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-extrabold uppercase tracking-wider mb-4">
                Facility & Perimeter
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-4">
                Unauthorized Access & After-Hours Protection
              </h3>
              <p className="text-base text-slate-300 leading-relaxed mb-6">
                When your staff lock up and go home, Sentrova stays vigilant. We monitor perimeter fences, loading docks, fire escape routes, and server facilities throughout the night. Thermal and optical feeds alert our operators to perimeter breaches in seconds, triggering immediate audio warnings and police dispatch.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-sky-500/20 border border-sky-400/40 text-[#00D2FF] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm font-semibold text-white">
                    Virtual tripwires and intelligent virtual perimeter boundary alerts.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-sky-500/20 border border-sky-400/40 text-[#00D2FF] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm font-semibold text-white">
                    Live remote voice talkdown alerts to scare trespassers away instantly.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-sky-500/20 border border-sky-400/40 text-[#00D2FF] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm font-semibold text-white">
                    Fast keyholder phone calls and verified emergency services dispatch.
                  </span>
                </div>
              </div>

              <a
                href="#packages"
                className="glass-btn-secondary inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-xl transition-all"
              >
                <span>View After-Hours Packages</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* RIGHT: Large Image */}
            <div className="lg:col-span-6 relative order-1 lg:order-2">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-sky-400/30 aspect-[4/3] bg-slate-950">
                <img
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop"
                  alt="Warehouse Logistics Commercial Perimeter Security"
                  className="w-full h-full object-cover opacity-85"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Overlaid Live Surveillance Tag */}
                <div className="absolute top-4 right-4 bg-[#0A1832]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-sky-400/35 shadow-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#00D2FF]" />
                  <span className="text-xs font-bold text-white">PERIMETER GATE 02 • SECURED</span>
                </div>

                <div className="absolute bottom-4 left-4 bg-[#0A1832]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-sky-400/35 text-xs font-semibold text-white shadow-sm">
                  <span>Night Watch Status: </span>
                  <span className="text-[#16A34A] font-bold">● Active 360° Patrol</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Interactive Service Details Modal */}
      <ServiceDetailsModal
        service={selectedService}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onSelectService={(srv) => {
          setSelectedService(srv);
          setActiveTab(srv.id);
        }}
        onOpenQuote={onOpenQuote}
      />
    </section>
  );
};
