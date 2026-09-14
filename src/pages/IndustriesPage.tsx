import React from 'react';
import { Link } from 'react-router-dom';
import { PackageTier } from '../types';
import {
  ShoppingBag,
  Store,
  Warehouse,
  HardHat,
  Building2,
  Utensils,
  ShieldCheck,
  Check,
  ArrowRight,
  AlertTriangle,
  Zap,
  TrendingDown,
} from 'lucide-react';

interface IndustriesPageProps {
  onOpenQuote: (pkg?: PackageTier) => void;
}

const INDUSTRIES = [
  {
    id: 'retail',
    name: 'Retail & Fashion Boutiques',
    icon: <ShoppingBag className="w-8 h-8 text-[#087BFF]" />,
    tagline: 'Eliminate shoplifting and apparel grab-and-dash crime.',
    shrinkageReduction: '82% Shrinkage Cut',
    threats: [
      'Apparel concealment in bags and under coats',
      'Fitting room merchandise tag tampering',
      'Organized retail gang distraction tactics',
      'Return fraud and counterfeit receipt disputes',
    ],
    solutions: [
      'Continuous aisle loitering & concealment observation',
      'Instant audio voice-down warning to suspected shoplifters',
      'Real-time WhatsApp manager alert with timestamped clips',
      'Crown Prosecution compliant evidence dossier export',
    ],
    recommendedTier: 'growth' as PackageTier,
    tierName: 'Growth ($2.99/hr)',
  },
  {
    id: 'supermarkets',
    name: 'Supermarkets & Grocery Stores',
    icon: <Store className="w-8 h-8 text-[#087BFF]" />,
    tagline: 'Target self-checkout shrinkage and till manipulation.',
    shrinkageReduction: '76% Less Till Losses',
    threats: [
      'Self-checkout scan skipping & sweethearting',
      'High-value alcohol, meat, and baby formula theft',
      'Staff cashier till discrepancies & drawer skimming',
      'Slip-and-fall fraudulent personal injury claims',
    ],
    solutions: [
      'POS register camera cross-referencing in real time',
      'High-theft aisle active zoom and dwell verification',
      'Customer & staff delivery door synchronization',
      'Forensic slip-and-fall footage verification logs',
    ],
    recommendedTier: 'growth' as PackageTier,
    tierName: 'Growth ($2.99/hr)',
  },
  {
    id: 'logistics',
    name: 'Logistics, Warehouses & Depots',
    icon: <Warehouse className="w-8 h-8 text-[#087BFF]" />,
    tagline: 'Secure extensive perimeters and loading dock inventory.',
    shrinkageReduction: '94% Intrusion Deterrence',
    threats: [
      'After-hours fence cutting and yard intrusions',
      'Pallet shrinkage and loading dock theft during transfers',
      'Fuel siphoning and catalytic converter vehicle theft',
      'Unauthorized personnel entering hazardous storage zones',
    ],
    solutions: [
      'Virtual perimeter tripwires and thermal camera monitoring',
      'Live loudspeaker voice-down talk deterrence across yards',
      'Loading bay dispatch and vehicle license plate logging',
      'Direct priority police dispatch for active yard breaches',
    ],
    recommendedTier: 'ultimate' as PackageTier,
    tierName: 'Ultimate ($5.99/hr)',
  },
  {
    id: 'construction',
    name: 'Construction Sites & Heavy Plant',
    icon: <HardHat className="w-8 h-8 text-[#087BFF]" />,
    tagline: 'Protect tools, copper cabling, and costly plant equipment.',
    shrinkageReduction: '91% Night Site Breaches Prevented',
    threats: [
      'Overnight copper pipe, cable, and metal stripping',
      'High-value power tool and generator theft from containers',
      'Machinery vandalism and arson by trespassers',
      'Trespassing liability if unauthorized persons suffer injuries',
    ],
    solutions: [
      'Solar & battery-backed camera stream integration',
      'After-hours acoustic sirens and operator voice warnings',
      'Instant mobile supervisor alert via phone call and SMS',
      'Time-lapse documentation and safety audit logs',
    ],
    recommendedTier: 'ultimate' as PackageTier,
    tierName: 'Ultimate ($5.99/hr)',
  },
  {
    id: 'corporate',
    name: 'Corporate Offices & Business Parks',
    icon: <Building2 className="w-8 h-8 text-[#087BFF]" />,
    tagline: 'Prevent tailgating and safeguard intellectual assets.',
    shrinkageReduction: '99% Access Protocol Adherence',
    threats: [
      'Tailgating through electronic access barriers',
      'Laptops, confidential files, and IT hardware theft',
      'Unsupervised evening cleaning contractors and visitors',
      'Underground parking lot break-ins and vehicle damage',
    ],
    solutions: [
      'Lobby turnstile and access control video verification',
      'Server room and executive suite after-hours lock down',
      'Underground carpark motion tripwire surveillance',
      'Daily visitor and after-hours contractor verification logs',
    ],
    recommendedTier: 'essential' as PackageTier,
    tierName: 'Essential ($1.99/hr)',
  },
  {
    id: 'hospitality',
    name: 'Hospitality, Restaurants & Pubs',
    icon: <Utensils className="w-8 h-8 text-[#087BFF]" />,
    tagline: 'Maintain patron safety and monitor cash handling.',
    shrinkageReduction: '85% Incident Resolution Rate',
    threats: [
      'Late-night violent altercations and patron disputes',
      'Bar cash drawer discrepancies and unrecorded drink pouring',
      'Backdoor stockroom theft during busy dining rush hours',
      'False liability claims regarding spilled food or drinks',
    ],
    solutions: [
      'Active bar and till oversight to curb unauthorized pours',
      'Immediate alert to floor management during escalating fights',
      'Clear high-definition incident packages for licensing boards',
      'Backdoor delivery confirmation and stockroom watch',
    ],
    recommendedTier: 'growth' as PackageTier,
    tierName: 'Growth ($2.99/hr)',
  },
];

export const IndustriesPage: React.FC<IndustriesPageProps> = ({ onOpenQuote }) => {
  return (
    <div className="w-full bg-[#060E1E] text-slate-200 min-h-screen pt-24 pb-20">
      {/* Header */}
      <section className="relative py-16 border-b border-sky-500/20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-500/10 via-[#060E1E]/80 to-[#060E1E] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <nav className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 mb-4">
            <Link to="/" className="hover:text-[#00D2FF] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#00D2FF]">Industries</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-xs font-bold text-[#00D2FF] mb-4 shadow-[0_0_15px_rgba(0,210,255,0.15)]">
            <Zap className="w-3.5 h-3.5 text-[#00D2FF]" />
            <span>COMMERCIAL SECTOR SURVEILLANCE STRATEGIES</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-3xl mx-auto mb-5 leading-tight">
            Specialized Surveillance by <span className="bg-gradient-to-r from-white via-sky-200 to-[#00D2FF] bg-clip-text text-transparent">Industry</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Every business environment has unique security challenges. Discover how Sentrova configures tailored surveillance rules for retail stores, supermarkets, warehouses, and construction sites.
          </p>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {INDUSTRIES.map((ind) => (
            <div
              key={ind.id}
              className="bg-[#0A162D]/85 rounded-3xl p-8 sm:p-10 border border-sky-400/20 shadow-xl hover:border-[#00D2FF]/60 hover:shadow-[0_12px_40px_rgba(0,210,255,0.18)] transition-all duration-300 flex flex-col justify-between backdrop-blur-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-[#00D2FF]">
                    {ind.icon}
                  </div>
                  <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/40 flex items-center gap-1.5 shadow-sm">
                    <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{ind.shrinkageReduction}</span>
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
                  {ind.name}
                </h2>

                <p className="text-xs font-bold text-[#00D2FF] mb-6">
                  {ind.tagline}
                </p>

                {/* Threat Vectors vs Sentrova Playbook */}
                <div className="space-y-4 mb-8">
                  <div>
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-rose-400 mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Primary Vulnerabilities</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {ind.threats.map((t, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-rose-400 font-bold">•</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-sky-500/15">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#00D2FF] mb-2 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#00D2FF]" />
                      <span>Sentrova Surveillance Playbook</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-200 font-medium">
                      {ind.solutions.map((s, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-[#00D2FF] shrink-0 mt-0.5" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-sky-500/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-400">
                  <span>Recommended: </span>
                  <span className="font-extrabold text-white">{ind.tierName}</span>
                </div>

                <button
                  onClick={() => onOpenQuote(ind.recommendedTier)}
                  className="px-4 py-2.5 rounded-xl bg-sentrova-gradient hover:opacity-95 text-white font-bold text-xs shadow-[0_4px_20px_rgba(8,123,255,0.28)] hover:shadow-[0_4px_20px_rgba(0,210,255,0.45)] transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 border border-white/20"
                >
                  <span>Request {ind.name.split('&')[0]} Audit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#0A162D] via-[#0E244B] to-[#0756C9] rounded-3xl p-8 sm:p-12 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 border border-sky-400/30 shadow-[0_0_50px_rgba(0,210,255,0.15)]">
          <div className="max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-black mb-2">Have a Custom Commercial Facility?</h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              We also protect auto dealerships, pharmacy chains, fitness clubs, and storage facilities. Get a customized surveillance deployment schedule.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenQuote('growth')}
              className="px-6 py-3.5 rounded-full bg-sentrova-gradient hover:opacity-95 text-white font-extrabold text-sm shadow-[0_8px_25px_rgba(8,123,255,0.3)] hover:shadow-[0_8px_25px_rgba(0,210,255,0.45)] transition-colors shadow-md cursor-pointer flex items-center gap-2 border border-white/25"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Request Custom Audit</span>
            </button>
            <Link
              to="/contact"
              className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-colors"
            >
              <span>Speak to NOC Lead</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
