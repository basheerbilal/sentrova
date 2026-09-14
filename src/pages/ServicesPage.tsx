import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SERVICES } from '../data/sentrovaData';
import { ServiceItem, PackageTier } from '../types';
import { ServiceDetailsModal } from '../components/ServiceDetailsModal';
import { api } from '../services/api';
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
  SlidersHorizontal,
  Layers,
  Cpu,
  CheckCircle2,
  PhoneCall,
  Server,
} from 'lucide-react';

interface ServicesPageProps {
  onOpenQuote: (pkg?: PackageTier) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All 8 Services' },
  { id: 'loss-prevention', label: 'Theft & Loss Prevention' },
  { id: 'operational', label: 'Staff & Cashier Audits' },
  { id: 'perimeter', label: 'Perimeter & After-Hours' },
  { id: 'evidence', label: 'Evidence & Compliance' },
];

export const ServicesPage: React.FC<ServicesPageProps> = ({ onOpenQuote }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [servicesList, setServicesList] = useState<ServiceItem[]>(SERVICES);

  useEffect(() => {
    api.getServices().then((apiSvcs) => {
      if (apiSvcs && apiSvcs.length > 0) {
        const mapped: ServiceItem[] = apiSvcs.map((s, idx) => ({
          id: s.slug || `srv-${idx + 1}`,
          title: s.title,
          shortDesc: s.short_description || s.description?.slice(0, 120) || '',
          fullDesc: s.description || '',
          icon: s.icon || 'ShieldAlert',
          benefits: [
            '24/7 dedicated human verification',
            'Instant audio voice-down deterrence',
            'Encrypted incident video retention',
          ],
        }));
        setServicesList(mapped);
      }
    }).catch(() => {
      // fallback to default
    });
  }, []);

  const getServiceIcon = (name: string) => {
    switch (name) {
      case 'ShieldAlert': return <ShieldAlert className="w-6 h-6" />;
      case 'Eye': return <Eye className="w-6 h-6" />;
      case 'Users': return <Users className="w-6 h-6" />;
      case 'AlertTriangle': return <AlertTriangle className="w-6 h-6" />;
      case 'Lock': return <Lock className="w-6 h-6" />;
      case 'Moon': return <Moon className="w-6 h-6" />;
      case 'Radio': return <Radio className="w-6 h-6" />;
      case 'FileText': return <FileText className="w-6 h-6" />;
      default: return <ShieldCheck className="w-6 h-6" />;
    }
  };

  const filteredServices = servicesList.filter((svc) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'loss-prevention') {
      return svc.id.includes('theft') || svc.id.includes('loitering') || svc.id.includes('shoplifting');
    }
    if (selectedCategory === 'operational') {
      return svc.id.includes('staff') || svc.id.includes('delivery') || svc.id.includes('audit');
    }
    if (selectedCategory === 'perimeter') {
      return svc.id.includes('perimeter') || svc.id.includes('after-hours') || svc.id.includes('audio');
    }
    if (selectedCategory === 'evidence') {
      return svc.id.includes('evidence') || svc.id.includes('dossier') || svc.id.includes('logs');
    }
    return true;
  });

  const handleOpenModal = (service: ServiceItem) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full bg-[#060E1E] text-white min-h-screen pt-24 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#0A162D] via-[#060E1E] to-[#060E1E] py-16 border-b border-sky-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 mb-4">
            <Link to="/" className="hover:text-[#00D2FF] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#00D2FF]">Services</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/15 border border-sky-400/30 text-xs font-bold text-[#38BDF8] mb-4">
            <Zap className="w-3.5 h-3.5 text-[#00D2FF]" />
            <span>COMMERCIAL SURVEILLANCE SOLUTIONS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-3xl mx-auto mb-5 leading-tight">
            Active Remote <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-200 to-[#00D2FF]">CCTV Monitoring</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Passive CCTV only records your losses for playback after criminals have fled. Sentrova’s certified live operators watch your cameras in real time to stop crimes as they happen.
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-[#0A162D]/80 backdrop-blur-md p-4 rounded-xl border border-sky-400/20 shadow-md">
              <div className="text-2xl font-black text-[#00D2FF]">{"< 30s"}</div>
              <div className="text-xs text-slate-400 font-semibold mt-0.5">Live Intervention Speed</div>
            </div>
            <div className="bg-[#0A162D]/80 backdrop-blur-md p-4 rounded-xl border border-sky-400/20 shadow-md">
              <div className="text-2xl font-black text-[#00D2FF]">99.8%</div>
              <div className="text-xs text-slate-400 font-semibold mt-0.5">Hardware Compatibility</div>
            </div>
            <div className="bg-[#0A162D]/80 backdrop-blur-md p-4 rounded-xl border border-sky-400/20 shadow-md">
              <div className="text-2xl font-black text-[#00D2FF]">1:16</div>
              <div className="text-xs text-slate-400 font-semibold mt-0.5">Max Camera:Operator Ratio</div>
            </div>
            <div className="bg-[#0A162D]/80 backdrop-blur-md p-4 rounded-xl border border-sky-400/20 shadow-md">
              <div className="text-2xl font-black text-[#00D2FF]">24/7/365</div>
              <div className="text-xs text-slate-400 font-semibold mt-0.5">UK NOC Control Center</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid with Category Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-sentrova-gradient text-white shadow-md shadow-sky-500/25 border border-sky-300/30'
                  : 'bg-[#0A162D]/70 text-slate-300 hover:text-white hover:bg-sky-500/15 border border-sky-400/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-[#0A162D]/75 backdrop-blur-xl rounded-2xl p-7 border border-sky-400/20 hover:border-[#00D2FF]/60 hover:shadow-[0_16px_45px_rgba(0,210,255,0.18)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group text-left relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 rounded-bl-full -z-0 group-hover:scale-110 transition-transform" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-sky-500/15 border border-sky-400/30 text-[#00D2FF] flex items-center justify-center group-hover:bg-sentrova-gradient group-hover:text-white transition-all duration-200">
                    {getServiceIcon(service.icon)}
                  </div>
                  <span className="text-[11px] font-bold text-[#38BDF8] bg-sky-500/15 px-2.5 py-1 rounded-full border border-sky-400/30">
                    Under 30s Intervention
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-white mb-2.5 group-hover:text-[#38BDF8] transition-colors">
                  {service.title}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed mb-5 font-normal">
                  {service.shortDesc}
                </p>

                {/* Bullet Points */}
                <ul className="space-y-2 mb-6 text-xs text-slate-200 font-medium">
                  {service.benefits.map((bp, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#00D2FF] shrink-0 mt-0.5" />
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-sky-500/20 flex items-center justify-between gap-3 relative z-10">
                <button
                  onClick={() => handleOpenModal(service)}
                  className="text-xs font-bold text-[#00D2FF] hover:text-white hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Technical Specs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onOpenQuote('growth')}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg bg-sky-500/15 text-[#00D2FF] hover:bg-sentrova-gradient hover:text-white transition-all cursor-pointer border border-sky-400/30"
                >
                  Inquire Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hardware Compatibility Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-[#0A162D]/80 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-sky-400/25 shadow-2xl text-left">
          <div className="max-w-3xl mb-10 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-xs font-bold text-emerald-400 mb-3">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>ZERO CAPITAL EXPENDITURE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
              Connects to 99.8% of Existing CCTV Hardware
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              You do not need to replace your existing cameras or invest thousands in proprietary hardware. Our encrypted bridge agent securely connects to your current recorder or cloud stream in less than 24 hours.
            </p>
          </div>

          {/* Supported Hardware Brands Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Hikvision', type: 'DVR / NVR / IP' },
              { name: 'Dahua', type: 'IP & HD-CVI' },
              { name: 'Axis', type: 'Network Cameras' },
              { name: 'Hanwha / Samsung', type: 'Wisenet NVR' },
              { name: 'Uniview', type: 'UNV IP Stream' },
              { name: 'ONVIF / RTSP', type: 'Universal Streams' },
            ].map((hw, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-900/70 border border-sky-400/20 text-center">
                <Server className="w-6 h-6 text-[#00D2FF] mx-auto mb-2" />
                <div className="font-extrabold text-sm text-white">{hw.name}</div>
                <div className="text-[10px] text-slate-400 font-semibold mt-0.5">{hw.type}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-sky-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2 text-left">
              <ShieldCheck className="w-4 h-4 text-[#00D2FF] shrink-0" />
              <span>Bank-grade TLS 1.3 encrypted tunnels. Your video feeds are never publicly exposed or sold.</span>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 font-bold text-[#00D2FF] hover:text-white hover:underline shrink-0 transition-colors"
            >
              <span>Check Camera Compatibility</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#0756C9] via-[#087BFF] to-[#0091FF] rounded-3xl p-8 sm:p-12 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 shadow-xl shadow-sky-500/25 border border-sky-300/30">
          <div className="max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-black mb-2 text-white">Ready to Stop Theft Before It Happens?</h3>
            <p className="text-sky-100 text-sm sm:text-base leading-relaxed">
              Book a complimentary security audit of your facility. Our senior surveillance engineers will review your camera angles and provide a customized monitoring quote.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenQuote('growth')}
              className="px-6 py-3.5 rounded-full bg-white text-[#0756C9] font-extrabold text-sm hover:bg-sky-50 transition-colors shadow-md cursor-pointer inline-flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Request Free Site Audit</span>
            </button>
            <Link
              to="/pricing"
              className="px-6 py-3.5 rounded-full bg-slate-900/40 hover:bg-slate-900/60 text-white font-bold text-sm border border-sky-300/40 transition-colors inline-flex items-center gap-2"
            >
              <span>View Hourly Pricing</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      <ServiceDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={selectedService}
        onSelectService={setSelectedService}
        onOpenQuote={(pkg) => onOpenQuote(pkg as PackageTier)}
      />
    </div>
  );
};
