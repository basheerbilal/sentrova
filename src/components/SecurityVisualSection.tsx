import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ShieldCheck,
  Video,
  Bell,
  Activity,
  Volume2,
  CheckCircle,
  AlertTriangle,
  Radio,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const SecurityVisualSection: React.FC = () => {
  const [selectedCam, setSelectedCam] = useState<number>(1);
  const sectionRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const camGridRef = useRef<HTMLDivElement>(null);
  const controlBarRef = useRef<HTMLDivElement>(null);

  const cameras = [
    {
      id: 1,
      name: 'CAM 01 • Main Entrance & Checkout',
      location: 'Store Entrance Aisle',
      status: 'SECURE',
      framerate: '30 FPS',
      resolution: '4K ULTRA HD',
      image: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=600&auto=format&fit=crop',
      aiTag: 'Zone Clear',
      alert: false,
    },
    {
      id: 2,
      name: 'CAM 02 • POS Registers 1-4',
      location: 'Cash Desk & Till Bank',
      status: 'ACTIVE AUDIT',
      framerate: '30 FPS',
      resolution: '4K ULTRA HD',
      image: 'https://images.unsplash.com/photo-1556742049-0a67e557b3bc?q=80&w=600&auto=format&fit=crop',
      aiTag: 'Till Reconciliation',
      alert: false,
    },
    {
      id: 3,
      name: 'CAM 03 • High-Value Cosmetics & Alcohol',
      location: 'Aisle 3 Fragrance Bay',
      status: 'SUSPICIOUS DWELL',
      framerate: '30 FPS',
      resolution: '4K ULTRA HD',
      image: 'https://images.unsplash.com/photo-1526178613552-2b45c6c302f0?q=80&w=600&auto=format&fit=crop',
      aiTag: 'Operator Flagged',
      alert: true,
    },
    {
      id: 4,
      name: 'CAM 04 • Rear Delivery Bay & Fire Exit',
      location: 'Loading Bay West',
      status: 'SECURE',
      framerate: '30 FPS',
      resolution: '4K ULTRA HD',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600&auto=format&fit=crop',
      aiTag: 'Doors Locked',
      alert: false,
    },
  ];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
        defaults: { ease: 'power3.out' },
      });

      tl.from(leftColRef.current, {
        x: -30,
        opacity: 0,
        duration: 0.8,
      })
        .from(
          dashboardRef.current,
          {
            scale: 0.96,
            y: 30,
            opacity: 0,
            duration: 0.8,
          },
          '-=0.5'
        )
        .from(
          camGridRef.current?.children || [],
          {
            y: 20,
            opacity: 0,
            stagger: 0.1,
            duration: 0.6,
          },
          '-=0.4'
        )
        .from(
          controlBarRef.current,
          {
            y: 15,
            opacity: 0,
            duration: 0.5,
          },
          '-=0.2'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="live-security"
      className="py-24 bg-[#060E1E] relative overflow-hidden text-white"
    >
      {/* Background ambient light orbs for glass depth */}
      <div className="absolute top-[15%] right-[-80px] w-[650px] h-[650px] bg-[#00D2FF]/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] left-[-100px] w-[650px] h-[650px] bg-[#0756C9]/20 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* Subtle depth mesh */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none -z-10"
        style={{
          backgroundImage: `radial-gradient(#00D2FF 1.2px, transparent 1.2px)`,
          backgroundSize: '30px 30px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* LEFT: Text & Capabilities (5 cols) */}
          <div ref={leftColRef} className="lg:col-span-5 text-left">
            <div className="glass-pill-blue inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4">
              <span className="w-2 h-2 rounded-full bg-[#00D2FF] animate-pulse" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#38BDF8]">
                Interactive Operations Console
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              ALWAYS WATCHING.
            </h2>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed mb-8">
              Experience the clarity of enterprise-grade surveillance. While standard security recorders sit passive in back rooms, Sentrova operators monitor multi-angle feeds in our central command center to intervene before crimes escalate.
            </p>

            <div className="space-y-4 mb-8">
              {/* Glass Feature Card 1 */}
              <div className="glass-surface p-4 rounded-2xl flex items-start gap-3.5 hover:border-[#00D2FF]/50 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-400/40 text-[#00D2FF] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">
                    Sub-30-Second Human Verification
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Eliminating 99% of false alarms caused by spiders, shadows, or wind through verified operator review.
                  </p>
                </div>
              </div>

              {/* Glass Feature Card 2 */}
              <div className="glass-surface p-4 rounded-2xl flex items-start gap-3.5 hover:border-[#00D2FF]/50 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-400/40 text-[#00D2FF] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">
                    Live Floor Manager Escalation
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Immediate direct WhatsApp notification with suspect stills and store coordinates to guide staff safely.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-sky-500/10 backdrop-blur-sm border border-sky-400/30 text-xs text-slate-300">
              <span className="font-bold text-[#38BDF8]">Illustrative UI Note: </span>
              The interface shown here is an interactive preview of the Sentrova command console layout used by our UK operations team.
            </div>
          </div>

          {/* RIGHT: Modern Layered White Glass Monitoring Dashboard (7 cols) */}
          <div className="lg:col-span-7">
            <div
              ref={dashboardRef}
              className="bg-[#0B1A38]/85 backdrop-blur-[24px] rounded-3xl p-5 sm:p-7 border border-sky-400/30 shadow-[0_20px_55px_rgba(0,0,0,0.7)] text-left relative overflow-hidden"
            >
              {/* Blue accent line at top */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00D2FF] to-transparent opacity-80" />

              {/* Console Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-sky-900/40 gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-[#00D2FF] to-[#0756C9] flex items-center justify-center text-white shadow-xs">
                      <Radio className="w-4 h-4" />
                    </div>
                    <span className="font-extrabold text-base tracking-wide text-white">
                      SENTROVA MONITORING
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 mt-0.5 block font-medium">
                    Console Session ID: SNTV-UK-OPS-884
                  </span>
                </div>

                {/* Status Badges in Light Glass Pills */}
                <div className="flex flex-wrap items-center gap-2.5 text-xs">
                  {/* System Status Pill */}
                  <div className="glass-pill px-3 py-1.5 rounded-full flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-ping" />
                    <span className="font-bold text-[#00D2FF]">ONLINE</span>
                  </div>

                  {/* Active Cameras Glass Pill */}
                  <div className="glass-pill px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-[#00D2FF]" />
                    <span className="font-extrabold text-white">24 ACTIVE</span>
                  </div>

                  {/* Alerts Glass Pill */}
                  <div className="glass-pill px-3 py-1.5 rounded-full flex items-center gap-1.5 border-amber-500/40 bg-amber-950/40">
                    <Bell className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span className="font-extrabold text-amber-400">02 ALERTS</span>
                  </div>
                </div>
              </div>

              {/* 4 Camera Thumbnails Grid in Light Glass Panels */}
              <div ref={camGridRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-5">
                {cameras.map((cam) => {
                  const isSelected = selectedCam === cam.id;
                  return (
                    <div
                      key={cam.id}
                      onClick={() => setSelectedCam(cam.id)}
                      className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 group ${
                        isSelected
                          ? 'border-2 border-[#00D2FF] shadow-[0_10px_25px_rgba(0,210,255,0.25)] scale-[1.01]'
                          : 'border border-sky-400/20 bg-slate-950/70 backdrop-blur-md shadow-xs hover:border-[#00D2FF]/40 hover:shadow-md'
                      }`}
                    >
                      {/* Image Thumbnail with Surveillance Overlay */}
                      <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                        <img
                          src={cam.image}
                          alt={cam.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-85"
                          referrerPolicy="no-referrer"
                        />
                        
                        {/* Light Surveillance Vignette */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

                        {/* Top Metadata Glass Bar */}
                        <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-[10px]">
                          <span className="bg-[#0A1832]/90 backdrop-blur-md px-2 py-0.5 rounded-md font-bold text-white border border-sky-400/30 shadow-xs">
                            {cam.name.split('•')[0]}
                          </span>
                          <span className="bg-[#00D2FF] text-slate-950 px-2 py-0.5 rounded-md font-mono font-bold shadow-xs">
                            {cam.framerate}
                          </span>
                        </div>

                        {/* Bottom Bar inside feed */}
                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white">
                          <span className="font-medium truncate max-w-[140px]">
                            {cam.location}
                          </span>
                          {cam.alert ? (
                            <span className="inline-flex items-center gap-1 bg-[#F59E0B] text-white px-2 py-0.5 rounded-full font-extrabold text-[10px] animate-pulse shadow-sm">
                              <AlertTriangle className="w-3 h-3" />
                              FLAGGED
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-[#16A34A] text-white px-2 py-0.5 rounded-full font-extrabold text-[10px] shadow-sm">
                              <CheckCircle className="w-3.5 h-3.5" />
                              OK
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Info Footer */}
                      <div className="p-3 bg-[#0B1A38]/80 backdrop-blur-sm border-t border-sky-900/40 flex items-center justify-between text-xs">
                        <span className="font-bold text-white truncate">
                          {cam.aiTag}
                        </span>
                        <span className="text-[10px] text-[#00D2FF] font-semibold">
                          Click to inspect
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Active Operator Controls Strip (Light Glass panel) */}
              <div
                ref={controlBarRef}
                className="p-3.5 bg-[#0A1832]/90 backdrop-blur-md rounded-2xl border border-sky-400/30 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2 text-[#38BDF8] font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse" />
                  <span>Operator: Officer J. Bennett (UK Shift 01)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="glass-btn-secondary px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
                    <Volume2 className="w-3.5 h-3.5 text-[#00D2FF]" />
                    <span>Talkdown Speaker</span>
                  </button>
                  <button className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#00D2FF] to-[#0756C9] text-white hover:opacity-95 font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all border border-white/25">
                    <Bell className="w-3.5 h-3.5" />
                    <span>Dispatch Alert</span>
                  </button>
                </div>
              </div>

              {/* Blue accent bottom glow */}
              <div className="mt-3 text-center text-[11px] text-slate-400">
                Demonstration control interface layout. Feeds shown for illustrative clarity.
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
