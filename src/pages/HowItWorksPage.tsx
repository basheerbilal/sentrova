import React from 'react';
import { Link } from 'react-router-dom';
import { DemoVideoSection } from '../components/DemoVideoSection';
import { PackageTier } from '../types';
import {
  ShieldCheck,
  Radio,
  Eye,
  Megaphone,
  FileCheck2,
  Lock,
  Clock,
  ArrowRight,
  Zap,
  Check,
  X,
  PhoneCall,
  Server,
  Activity,
  AlertTriangle,
} from 'lucide-react';

interface HowItWorksPageProps {
  onOpenQuote: (pkg?: PackageTier) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onOpenQuote }) => {
  const steps = [
    {
      number: '01',
      title: 'Encrypted Stream Handshake',
      subtitle: 'Zero hardware replacement. Up and running within 24 hours.',
      icon: <Server className="w-7 h-7 text-[#087BFF]" />,
      description:
        'Our technical specialists configure an ultra-secure, encrypted bridge to your existing NVR, DVR, or IP cameras. We support Hikvision, Dahua, Axis, and all ONVIF/RTSP compliant setups. No new hardware purchase is required.',
      highlights: [
        'End-to-end TLS 1.3 encrypted video transmission',
        'Compatible with 99.8% of existing CCTV brands',
        'Zero downtime or business interruption during setup',
        'Configurable monitoring schedules (24/7, nights, or peak hours)',
      ],
    },
    {
      number: '02',
      title: 'Active Human Operator Vigilance',
      subtitle: 'Dedicated UK operators, not passive recordings or false AI alarms.',
      icon: <Eye className="w-7 h-7 text-[#087BFF]" />,
      description:
        'During your scheduled monitoring window, your feeds are assigned to certified surveillance operators in our high-security Network Operations Center (NOC). Unlike automated software that triggers on spiders and shadows, our trained human eyes identify subtle shoplifting techniques, concealment, and suspicious loitering.',
      highlights: [
        'Strict 1:16 operator-to-camera ratio for deep focus',
        'Trained on retail shrinkage and concealment detection',
        'Till and cash register transaction cross-referencing',
        'Immediate escalation protocols tailored to your premises',
      ],
    },
    {
      number: '03',
      title: 'Instant Voice-Down Talk & Dispatch',
      subtitle: 'Live audio broadcast stops intruders within 30 seconds.',
      icon: <Megaphone className="w-7 h-7 text-[#087BFF]" />,
      description:
        'When suspicious activity or an active theft is identified, the operator activates our real-time 2-way audio voice-down speaker. The operator issues an immediate, targeted broadcast: "Warning: you are under live CCTV surveillance. Put down the merchandise and exit the store immediately."',
      highlights: [
        'Proven to stop over 94% of opportunistic crimes instantly',
        'Simultaneous manager phone call and WhatsApp alert (< 30s)',
        'Direct emergency dispatch for high-threat situations',
        'Operators track suspect departure route and vehicle plates',
      ],
    },
    {
      number: '04',
      title: 'Police Dossiers & Shift Reports',
      subtitle: 'Court-admissible video exports and daily shift summaries.',
      icon: <FileCheck2 className="w-7 h-7 text-[#087BFF]" />,
      description:
        'Every incident is logged with timestamped forensic video packages, suspect descriptions, and chronological timelines ready for the police and insurance claims. Every morning, you receive an encrypted executive summary of your monitored shifts.',
      highlights: [
        'Police and Crown Prosecution compliant video exports',
        'Daily shift logs delivered directly to your inbox',
        'Health & safety hazard reporting for slip/trip prevention',
        'Comprehensive audit trail for insurance rate discounts',
      ],
    },
  ];

  return (
    <div className="w-full bg-[#060E1E] text-white min-h-screen pt-24 pb-20">
      {/* Header */}
      <section className="bg-gradient-to-b from-[#0A162D] via-[#060E1E] to-[#060E1E] py-16 border-b border-sky-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 mb-4">
            <Link to="/" className="hover:text-[#00D2FF] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#00D2FF]">How It Works</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/15 border border-sky-400/30 text-xs font-bold text-[#38BDF8] mb-4">
            <Activity className="w-3.5 h-3.5 text-[#00D2FF]" />
            <span>OPERATIONAL SURVEILLANCE PIPELINE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-3xl mx-auto mb-5 leading-tight">
            How Sentrova Remote <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-200 to-[#00D2FF]">Monitoring Operates</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Discover the rigorous 4-step workflow that transforms standard CCTV cameras into an active, proactive theft deterrence shield.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onOpenQuote('growth')}
              className="px-6 py-3 rounded-full bg-sentrova-gradient hover:opacity-95 text-white font-bold text-sm shadow-md shadow-sky-500/25 transition-all cursor-pointer flex items-center gap-2 border border-sky-300/30"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Request Free Stream Compatibility Audit</span>
            </button>
            <Link
              to="/pricing"
              className="px-6 py-3 rounded-full bg-[#0A162D]/90 border border-sky-400/30 hover:border-[#00D2FF] text-[#38BDF8] hover:text-white font-bold text-sm transition-all"
            >
              <span>See Hourly Pricing Plans</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Detailed Pipeline Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-12">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="bg-[#0A162D]/75 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-sky-400/20 shadow-xl shadow-blue-950/20 hover:border-[#00D2FF]/60 hover:shadow-[0_16px_45px_rgba(0,210,255,0.18)] transition-all text-left"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Step badge & icon */}
                <div className="lg:col-span-4 flex flex-col items-start">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl font-black text-sky-400/40 font-mono">
                      {step.number}
                    </span>
                    <span className="text-xs font-bold text-[#38BDF8] bg-sky-500/15 px-2.5 py-1 rounded-full border border-sky-400/30 uppercase tracking-wider">
                      Stage {index + 1}
                    </span>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-sky-500/15 border border-sky-400/30 text-[#00D2FF] flex items-center justify-center mb-4">
                    {step.icon}
                  </div>
                  <h2 className="text-2xl font-black text-white mb-2 leading-tight">
                    {step.title}
                  </h2>
                  <p className="text-xs font-bold text-[#38BDF8]">
                    {step.subtitle}
                  </p>
                </div>

                {/* Step content */}
                <div className="lg:col-span-8 space-y-5">
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {step.highlights.map((hl, i) => (
                      <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/70 border border-sky-400/20">
                        <Check className="w-4 h-4 text-[#00D2FF] shrink-0 mt-0.5" />
                        <span className="text-xs font-semibold text-slate-200 leading-snug">{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live Operations & Voice-Down Video Demo Section */}
      <DemoVideoSection onOpenQuote={onOpenQuote} />

      {/* Comparison: Sentrova vs Traditional Guard vs Passive Recording */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-[#0A162D]/80 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-sky-400/25 shadow-2xl text-left">
          <div className="max-w-3xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
              Why Active Remote Surveillance Wins
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Compare Sentrova's active remote surveillance against standard passive CCTV recorders and traditional physical on-site guards.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-sky-500/20 bg-slate-900/80">
                  <th className="py-4 px-4 font-bold text-slate-300 uppercase tracking-wider text-xs">Security Factor</th>
                  <th className="py-4 px-4 font-extrabold text-[#00D2FF] bg-sky-500/10">Sentrova Remote Surveillance</th>
                  <th className="py-4 px-4 font-bold text-slate-300">Physical Security Guard</th>
                  <th className="py-4 px-4 font-bold text-slate-300">Standard Passive CCTV</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-500/15">
                <tr>
                  <td className="py-3.5 px-4 font-bold text-white">Response Time</td>
                  <td className="py-3.5 px-4 font-bold text-[#00D2FF] bg-sky-500/10">Immediate (&lt; 30 Seconds)</td>
                  <td className="py-3.5 px-4 text-slate-300">Minutes (patrol dependent)</td>
                  <td className="py-3.5 px-4 text-rose-400 font-semibold">Zero (post-crime recording only)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-white">Average Hourly Cost</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400 bg-sky-500/10">From $1.99 / hr</td>
                  <td className="py-3.5 px-4 text-slate-300 font-semibold">$15.00 – $25.00 / hr</td>
                  <td className="py-3.5 px-4 text-slate-400">Zero active cost (100% loss risk)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-white">Multi-Camera Coverage</td>
                  <td className="py-3.5 px-4 font-bold text-[#00D2FF] bg-sky-500/10">Full 360° simultaneous coverage</td>
                  <td className="py-3.5 px-4 text-slate-300">Single line-of-sight only</td>
                  <td className="py-3.5 px-4 text-slate-400">All cameras record, no one watches</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-white">Live Voice Deterrence</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400 bg-sky-500/10">Yes (2-way audio broadcast)</td>
                  <td className="py-3.5 px-4 text-slate-300">Physical presence only</td>
                  <td className="py-3.5 px-4 text-rose-400 font-semibold">None</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-white">Shift Reliability</td>
                  <td className="py-3.5 px-4 font-bold text-[#00D2FF] bg-sky-500/10">100% (No fatigue, NOC backup)</td>
                  <td className="py-3.5 px-4 text-slate-300">Fatigue, distraction, sick leave</td>
                  <td className="py-3.5 px-4 text-slate-400">Hardware dependent</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-white">Lock-in Contract</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400 bg-sky-500/10">None (Flexible monthly billing)</td>
                  <td className="py-3.5 px-4 text-slate-300">12-month agency lock-in</td>
                  <td className="py-3.5 px-4 text-slate-400">N/A</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#0756C9] to-[#0A162D] rounded-3xl p-8 sm:p-12 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 border border-sky-400/30 shadow-2xl">
          <div>
            <h3 className="text-2xl sm:text-3xl font-black mb-2 text-white">Connect Your Cameras Today</h3>
            <p className="text-slate-300 text-sm sm:text-base max-w-lg">
              Start your risk-free trial. We configure the stream handshake and begin monitoring your business within 24 hours.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenQuote('growth')}
              className="px-6 py-3.5 rounded-full bg-sentrova-gradient hover:opacity-95 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer flex items-center gap-2 border border-sky-300/30"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Get Started Now</span>
            </button>
            <Link
              to="/contact"
              className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all"
            >
              <span>Contact Us</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
