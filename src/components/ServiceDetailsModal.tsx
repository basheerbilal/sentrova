import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Check,
  ShieldCheck,
  ArrowRight,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Radio,
  Clock,
  ShieldAlert,
  Eye,
  Users,
  AlertTriangle,
  Lock,
  Moon,
  FileText,
} from 'lucide-react';
import { ServiceItem } from '../types';
import { SERVICES, SENTROVA_CONTACT } from '../data/sentrovaData';

interface ServiceDetailsModalProps {
  service: ServiceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectService: (service: ServiceItem) => void;
  onOpenQuote: (packageId?: string) => void;
}

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

// Extended metadata for each service
const SERVICE_EXTENDED_INFO: Record<
  string,
  {
    targetZones: string[];
    responseProtocol: string;
    cameraTech: string;
    recommendedTier: 'essential' | 'growth' | 'ultimate';
    tierName: string;
    rate: string;
    sampleIncident: string;
  }
> = {
  'customer-theft': {
    targetZones: ['Sales floor aisles', 'Merchandise display islands', 'High-shrink cosmetic & fragrance bays', 'Fitting room entry points'],
    responseProtocol: 'Immediate 30-second discreet call or WhatsApp alert to store manager with suspect location, clothing tags, and item details.',
    cameraTech: 'Compatible with standard 1080p / 4K dome & bullet cameras, PTZ tracking, and existing NVR systems.',
    recommendedTier: 'essential',
    tierName: 'ESSENTIAL',
    rate: '$1.99 / HR',
    sampleIncident: 'Operator detected repeated concealment of high-value cosmetics into a booster bag; floor staff notified within 22 seconds before exit.',
  },
  'shoplifting': {
    targetZones: ['Alcohol and spirits aisles', 'Designer apparel racks', 'Consumer electronics displays', 'Self-checkout terminals'],
    responseProtocol: 'Multi-angle suspect tracking across blind spots with real-time video timestamps recorded for police evidence.',
    cameraTech: 'High-resolution optical zoom feeds, wide-angle overview lenses, and AI-assisted loitering alerts.',
    recommendedTier: 'essential',
    tierName: 'ESSENTIAL',
    rate: '$1.99 / HR',
    sampleIncident: 'Two coordinated individuals attempting tag tampering were flagged; direct announcement prompted immediate abandonment of items.',
  },
  'staff-monitoring': {
    targetZones: ['Point of sale (POS) cash registers', 'Refund & customer service counters', 'Stockroom receiving bays', 'Employee locker room entries'],
    responseProtocol: 'Detailed daily transaction audit log and discrepancy flagging against POS transaction receipts.',
    cameraTech: 'Overhead till cameras with optical zoom, pinhole registers, and motion-activated backroom sensors.',
    recommendedTier: 'growth',
    tierName: 'GROWTH',
    rate: '$2.99 / HR',
    sampleIncident: 'Operator identified repeated off-register cash exchanges and unauthorized void transactions, saving an estimated £1,400/month.',
  },
  'suspicious-behaviour': {
    targetZones: ['Store entrances and vestibules', 'Blind corners and dead zones', 'Perimeter walkways', 'Cash drop areas'],
    responseProtocol: 'Early warning situational briefing to floor supervisors, allowing peaceful visual deterrence before incidents escalate.',
    cameraTech: 'Dwell-time anomaly detection, thermal contour tracking, and wide-angle optical cameras.',
    recommendedTier: 'growth',
    tierName: 'GROWTH',
    rate: '$2.99 / HR',
    sampleIncident: 'Scouting behavior identified 15 minutes before closing; early presence deployment successfully deterred a planned group robbery.',
  },
  'unauthorized-access': {
    targetZones: ['Emergency fire exit doors', 'Delivery and loading bays', 'Rooftop and server room access doors', 'Staff-only corridors'],
    responseProtocol: 'Instant two-way live audio voice-down broadcast ("You are in a restricted area. Vacate immediately") and security dispatch.',
    cameraTech: 'Virtual tripwire boundary sensors, thermal boundary sensors, and infrared night vision.',
    recommendedTier: 'ultimate',
    tierName: 'ULTIMATE',
    rate: '$5.99 / HR',
    sampleIncident: 'Trespassers breaching an external loading dock gate were stopped within 10 seconds via direct remote audio broadcast.',
  },
  'after-hours': {
    targetZones: ['Building perimeter fences', 'Car parking lots & vehicle yards', 'Main glass storefronts', 'Rooftop air vents and skylights'],
    responseProtocol: 'Instantaneous visual verification of motion triggers, emergency keyholder contact, and verified police dispatch.',
    cameraTech: 'Long-range infrared illuminators, dark-fighter ultra-low-light sensors, and pan-tilt-zoom thermal cameras.',
    recommendedTier: 'ultimate',
    tierName: 'ULTIMATE',
    rate: '$5.99 / HR',
    sampleIncident: 'Burglary attempt at 3:14 AM detected at fence line; police arrived within 6 minutes while suspects were still on perimeter grounds.',
  },
  'real-time-incident': {
    targetZones: ['Entire facility interior and exterior', 'Public access routes', 'Staff muster points', 'Cash collection routes'],
    responseProtocol: 'Active operator live-feed relay to 999/police dispatch, delivering real-time tactical intel and suspect movement descriptions.',
    cameraTech: 'Synchronized multi-channel video matrix with zero-latency cloud streaming.',
    recommendedTier: 'ultimate',
    tierName: 'ULTIMATE',
    rate: '$5.99 / HR',
    sampleIncident: 'During an aggressive disturbance, operators guided emergency services directly to the suspects location without putting staff at risk.',
  },
  'incident-reporting': {
    targetZones: ['All monitored cameras across facility', 'Incident timeline reconstruction', 'Chain-of-custody archive'],
    responseProtocol: 'Standardized court-admissible digital incident dossier compiled and delivered via secure cloud link within 15 minutes.',
    cameraTech: 'Cryptographically hashed high-definition MP4 clips with certified UTC timestamps.',
    recommendedTier: 'growth',
    tierName: 'GROWTH',
    rate: '$2.99 / HR',
    sampleIncident: 'High-definition digital dossier delivered to police resulted in same-day recovery of £3,200 of stolen designer inventory.',
  },
};

export const ServiceDetailsModal: React.FC<ServiceDetailsModalProps> = ({
  service,
  isOpen,
  onClose,
  onSelectService,
  onOpenQuote,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (typeof document === 'undefined') return null;

  const currentService = service || SERVICES[0];
  const Icon = iconMap[currentService.icon] || ShieldAlert;
  const extended = SERVICE_EXTENDED_INFO[currentService.id] || {
    targetZones: ['Active retail floor', 'Checkout bays', 'Backroom exits'],
    responseProtocol: 'Immediate telephone/SMS notification to on-duty management within 30 seconds.',
    cameraTech: 'Full compatibility with 99% of existing IP and analog CCTV equipment.',
    recommendedTier: 'growth' as const,
    tierName: 'GROWTH',
    rate: '$2.99 / HR',
    sampleIncident: 'Live incident verified and resolved with full evidentiary backup.',
  };

  const currentIndex = SERVICES.findIndex((s) => s.id === currentService.id);
  const prevService = SERVICES[(currentIndex - 1 + SERVICES.length) % SERVICES.length];
  const nextService = SERVICES[(currentIndex + 1) % SERVICES.length];

  const getWhatsAppServiceInquiryUrl = () => {
    const phone = '447448871603';
    const text = `Hello Sentrova, I would like to explore details and pricing for ${currentService.title.toUpperCase()} (${extended.rate}). Can you share how to set this up for my store?`;
    return `https://api.whatsapp.com/send/?phone=${phone}&text=${encodeURIComponent(text)}`;
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && service && (
        <motion.div
          key="service-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99999,
          }}
        >
          <motion.div
            key={service.id}
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="bg-[#0A1832] backdrop-blur-2xl rounded-3xl max-w-2xl w-full p-6 sm:p-8 border-2 border-[#00D2FF]/50 shadow-[0_25px_70px_rgba(0,0,0,0.95)] relative text-left my-auto max-h-[90vh] overflow-y-auto text-white"
            onClick={(e) => e.stopPropagation()}
            id="service-details-modal"
            style={{ zIndex: 100000 }}
          >
          {/* Top Specular Accent Border */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#00D2FF] to-transparent opacity-90 pointer-events-none" />

          {/* Modal Header Bar */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#0F2F66] border border-sky-400/40 flex items-center justify-center text-[#00D2FF] shadow-xs shrink-0">
                <Icon className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-400/40 text-[#00D2FF] text-[10px] font-extrabold uppercase tracking-wider">
                    Specialist Module
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#10B981]">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    24/7 Live Monitoring
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {service.title}
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900/80 hover:bg-sky-500/20 border border-sky-400/30 transition-colors cursor-pointer shrink-0"
              aria-label="Close details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Core Description */}
          <div className="bg-[#061226] border border-sky-400/30 rounded-2xl p-4 sm:p-5 mb-6">
            <p className="text-sm font-bold text-white leading-relaxed mb-2">
              {service.shortDesc}
            </p>
            <p className="text-sm text-slate-200 leading-relaxed font-normal">
              {service.fullDesc}
            </p>
          </div>

          {/* Key Operational Benefits Checklist */}
          <div className="mb-6">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#38BDF8] mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00D2FF]" />
              <span>Key Surveillance Capabilities</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {service.benefits.map((benefit, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 bg-[#061226] p-3 rounded-xl border border-sky-400/25 shadow-xs"
                >
                  <div className="w-5 h-5 rounded-full bg-sky-500/20 text-[#00D2FF] border border-sky-400/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-xs font-semibold text-slate-200 leading-snug">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Intelligence Details */}
          <div className="space-y-3 mb-6 bg-[#061226] rounded-2xl p-4 sm:p-5 border border-sky-400/30">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-black text-white block mb-1 uppercase tracking-wider">
                  Monitored Zones:
                </span>
                <ul className="text-slate-300 space-y-1 list-disc list-inside">
                  {extended.targetZones.map((zone, idx) => (
                    <li key={idx}>{zone}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="font-black text-white block mb-1 uppercase tracking-wider">
                  Escalation Protocol:
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {extended.responseProtocol}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-sky-900/50 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-200 font-medium">
                <Clock className="w-4 h-4 text-[#00D2FF]" />
                <span>
                  Recommended Tier:{' '}
                  <strong className="text-white font-black">{extended.tierName}</strong> ({extended.rate})
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[#10B981] font-bold">
                <Radio className="w-3.5 h-3.5" />
                <span>Zero New Hardware Needed</span>
              </div>
            </div>
          </div>

          {/* Real-World Case Snippet */}
          <div className="mb-6 p-4 rounded-xl bg-[#061226] border-l-4 border-[#00D2FF] border-r border-t border-b border-sky-400/20 text-xs text-slate-200">
            <span className="font-black text-white block mb-0.5 uppercase tracking-wider">
              Operational Incident Example:
            </span>
            {extended.sampleIncident}
          </div>

          {/* CTA Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 mb-6">
            <button
              onClick={() => {
                onClose();
                onOpenQuote(extended.recommendedTier);
              }}
              className="w-full sm:flex-1 py-3.5 px-5 rounded-xl font-bold text-xs sm:text-sm tracking-wide bg-sentrova-gradient hover:opacity-95 text-white shadow-[0_8px_25px_rgba(0,210,255,0.35)] hover:shadow-[0_8px_25px_rgba(0,210,255,0.5)] flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 border border-white/30"
            >
              <span>Request Protection ({extended.tierName})</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={getWhatsAppServiceInquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto py-3.5 px-5 rounded-xl border border-emerald-500/40 hover:border-emerald-400 bg-emerald-950/40 hover:bg-emerald-950/60 text-[#10B981] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Inquiry</span>
            </a>
          </div>

          {/* Modal Pagination Navigation (Browse all 8 Services) */}
          <div className="pt-4 border-t border-sky-900/50 flex items-center justify-between text-xs text-slate-300">
            <button
              onClick={() => onSelectService(prevService)}
              className="flex items-center gap-1.5 font-bold hover:text-[#00D2FF] transition-colors cursor-pointer group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">{prevService.title}</span>
              <span className="sm:hidden">Previous</span>
            </button>

            <span className="font-mono text-[11px] text-slate-400 font-bold">
              {currentIndex + 1} / {SERVICES.length}
            </span>

            <button
              onClick={() => onSelectService(nextService)}
              className="flex items-center gap-1.5 font-bold hover:text-[#00D2FF] transition-colors cursor-pointer group"
            >
              <span className="hidden sm:inline">{nextService.title}</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>,
  document.body
);
};


