import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PACKAGES as DEFAULT_PACKAGES, PACKAGE_COMPARISON } from '../data/sentrovaData';
import { PackageTier, MonitoringPackage } from '../types';
import { api } from '../services/api';
import {
  ShieldCheck,
  Check,
  X,
  ArrowRight,
  MessageSquare,
  Calculator,
  DollarSign,
  TrendingDown,
  Sparkles,
  HelpCircle,
  Clock,
  Shield,
  Phone,
  Lock,
} from 'lucide-react';

interface PricingPageProps {
  onOpenQuote: (pkg?: PackageTier) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onOpenQuote }) => {
  const navigate = useNavigate();
  const [packagesList, setPackagesList] = useState<MonitoringPackage[]>(DEFAULT_PACKAGES);

  // Calculator state
  const [calcTier, setCalcTier] = useState<PackageTier>('growth');
  const [hoursPerDay, setHoursPerDay] = useState(10);
  const [daysPerWeek, setDaysPerWeek] = useState(6);

  useEffect(() => {
    api.getPackages().then((apiPkgs) => {
      if (apiPkgs && apiPkgs.length > 0) {
        const mapped: MonitoringPackage[] = apiPkgs.map((p) => {
          const tierId: PackageTier =
            p.slug === 'growth' || p.slug === 'ultimate' ? (p.slug as PackageTier) : 'essential';
          return {
            id: tierId,
            name: p.name,
            price: `${p.currency}${p.price.toFixed(2)}`,
            unit: p.billing_unit,
            tagline: p.subtitle,
            highlight: p.popular,
            badge: p.popular ? 'MOST POPULAR' : undefined,
            description: p.description,
            bestFor: p.subtitle,
            features: (p.features || []).map((f) => f.feature),
          };
        });
        setPackagesList(mapped);
      }
    }).catch(() => {
      // fallback
    });
  }, []);

  // Rates
  const getHourlyRate = (tier: PackageTier) => {
    switch (tier) {
      case 'essential': return 1.99;
      case 'growth': return 2.99;
      case 'ultimate': return 5.99;
      default: return 2.99;
    }
  };

  const currentRate = getHourlyRate(calcTier);
  const totalWeeklyHours = hoursPerDay * daysPerWeek;
  const weeklyCost = totalWeeklyHours * currentRate;
  const monthlyCost = weeklyCost * 4.33;

  // Benchmark: Physical Security Guard @ $18/hr
  const physicalGuardHourly = 18.00;
  const monthlyGuardCost = totalWeeklyHours * physicalGuardHourly * 4.33;
  const monthlySavings = Math.max(0, monthlyGuardCost - monthlyCost);
  const savingsPercent = Math.round((monthlySavings / monthlyGuardCost) * 100);

  const getWhatsAppInquiryUrl = (pkg: MonitoringPackage) => {
    const phone = '447448871603';
    const text = `Hello Sentrova, I am interested in the ${pkg.name.toUpperCase()} Package (${pkg.price} ${pkg.unit}). Can you provide details and set this up for my store?`;
    return `https://api.whatsapp.com/send/?phone=${phone}&text=${encodeURIComponent(text)}`;
  };

  const getCalculatorWhatsAppUrl = () => {
    const phone = '447448871603';
    const text = `Hello Sentrova, I calculated monitoring needs for the ${calcTier.toUpperCase()} package (${Math.round(totalWeeklyHours * 4)} hrs/month, ~$${monthlyCost.toFixed(0)}/mo). Can we discuss setup on WhatsApp?`;
    return `https://api.whatsapp.com/send/?phone=${phone}&text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="w-full bg-[#060E1E] text-white min-h-screen pt-24 pb-20">
      {/* Header */}
      <section className="bg-gradient-to-b from-[#0A162D] via-[#060E1E] to-[#060E1E] py-16 border-b border-sky-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <nav className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 mb-4">
            <Link to="/" className="hover:text-[#00D2FF] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#00D2FF]">Pricing & Packages</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/15 border border-sky-400/30 text-xs font-bold text-[#38BDF8] mb-4">
            <DollarSign className="w-3.5 h-3.5 text-[#00D2FF]" />
            <span>TRANSPARENT HOURLY BILLING - NO LOCK-IN CONTRACTS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-3xl mx-auto mb-5 leading-tight">
            Predictable <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-200 to-[#00D2FF]">Surveillance Pricing</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Pay only for the hours your business requires active surveillance. Schedule during peak customer hours, overnight shifts, or 24/7/365.
          </p>

          <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-xs font-bold text-emerald-400">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Save up to 85% compared to on-site physical security guards</span>
          </div>
        </div>
      </section>

      {/* 3 Pricing Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-16">
          {packagesList.map((pkg) => {
            const isGrowth = pkg.highlight;

            return (
              <div
                key={pkg.id}
                className={`rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between text-left relative ${
                  isGrowth
                    ? 'bg-[#0A162D]/90 backdrop-blur-xl border-2 border-[#00D2FF] shadow-[0_20px_50px_rgba(0,210,255,0.22)] lg:-translate-y-2'
                    : 'bg-[#0A162D]/70 backdrop-blur-xl border border-sky-400/20 shadow-xl shadow-blue-950/20 hover:border-[#00D2FF]/50 hover:shadow-2xl'
                }`}
              >
                {isGrowth && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-sentrova-gradient text-white px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-[0_4px_14px_rgba(0,210,255,0.4)] border border-sky-300/40">
                    MOST POPULAR FOR RETAIL
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#38BDF8] bg-sky-500/15 px-3 py-1 rounded-full border border-sky-400/30">
                      {pkg.name}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Billed Hourly</span>
                  </div>

                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-4xl sm:text-5xl font-black text-white tracking-tight font-mono">
                      {pkg.price}
                    </span>
                    <span className="text-sm font-bold text-slate-400">{pkg.unit}</span>
                  </div>

                  <p className="text-xs font-bold text-[#38BDF8] mb-4">
                    {pkg.tagline}
                  </p>

                  <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                    {pkg.description}
                  </p>

                  <div className="pt-6 border-t border-sky-500/20">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-3">
                      Included Surveillance Features:
                    </div>
                    <ul className="space-y-2.5 text-xs text-slate-200 font-medium mb-8">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-[#00D2FF] shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-sky-500/20">
                  <a
                    href={getWhatsAppInquiryUrl(pkg)}
                    target="_blank"
                    rel="noreferrer"
                    className={`relative group overflow-hidden w-full py-3.5 px-4 rounded-xl backdrop-blur-xl border text-white font-extrabold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 active:scale-[0.98] ${
                      pkg.highlight
                        ? 'bg-gradient-to-r from-emerald-500/25 via-teal-500/30 to-emerald-500/25 hover:from-emerald-500/35 hover:via-teal-500/40 hover:to-emerald-500/35 border-emerald-400/60 hover:border-emerald-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_8px_28px_rgba(16,185,129,0.35)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_12px_36px_rgba(16,185,129,0.5)]'
                        : 'bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-400/40 hover:border-emerald-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_8px_24px_rgba(16,185,129,0.2)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_12px_30px_rgba(16,185,129,0.4)]'
                    }`}
                  >
                    {/* Glass Sheen Light Sweep Animation */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

                    <div className="w-5 h-5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 group-hover:text-white transition-colors shrink-0">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </div>
                    <span>Inquire via WhatsApp ({pkg.name})</span>
                    <ArrowRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-1 group-hover:text-white transition-all ml-0.5 shrink-0" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Monitoring Cost & Guard Savings Calculator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-16">
        <div className="bg-[#0A162D]/80 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-sky-400/25 shadow-2xl shadow-blue-950/30 text-left">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-sky-500/20">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-xs font-bold text-[#38BDF8] mb-2">
                <Calculator className="w-3.5 h-3.5 text-[#00D2FF]" />
                <span>INTERACTIVE BUDGET ESTIMATOR</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Surveillance Cost & Guard Savings Calculator
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Customize your required surveillance schedule and calculate estimated monthly investment versus physical on-site guards.
              </p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 font-bold text-xs sm:text-sm flex items-center gap-2 shrink-0">
              <TrendingDown className="w-4 h-4" />
              <span>{savingsPercent}% Lower Cost Than Guards</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Controls */}
            <div className="lg:col-span-7 space-y-6">
              {/* Select Tier */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-2">
                  Select Surveillance Tier:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['essential', 'growth', 'ultimate'] as PackageTier[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setCalcTier(t)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer border ${
                        calcTier === t
                          ? 'bg-sentrova-gradient text-white border-sky-400/40 shadow-md shadow-sky-500/20'
                          : 'bg-slate-900/60 text-slate-300 border-sky-400/20 hover:border-sky-400/50'
                      }`}
                    >
                      {t} (${getHourlyRate(t).toFixed(2)}/hr)
                    </button>
                  ))}
                </div>
              </div>

              {/* Hours per Day Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase text-slate-300">Monitoring Hours Per Day:</span>
                  <span className="text-sm font-black text-[#00D2FF] bg-sky-500/15 px-2.5 py-0.5 rounded-lg border border-sky-400/30">
                    {hoursPerDay} Hours / Day
                  </span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="24"
                  step="1"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#00D2FF]"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                  <span>4 hrs (Peak evening)</span>
                  <span>12 hrs (Overnight)</span>
                  <span>24 hrs (Full-time)</span>
                </div>
              </div>

              {/* Days per Week Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase text-slate-300">Monitoring Days Per Week:</span>
                  <span className="text-sm font-black text-[#00D2FF] bg-sky-500/15 px-2.5 py-0.5 rounded-lg border border-sky-400/30">
                    {daysPerWeek} Days / Week
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="7"
                  step="1"
                  value={daysPerWeek}
                  onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#00D2FF]"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                  <span>1 day (Weekends only)</span>
                  <span>5 days (Mon-Fri)</span>
                  <span>7 days (Continuous)</span>
                </div>
              </div>
            </div>

            {/* Calculated Output Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#060E1E] to-[#0A162D] text-white p-7 rounded-2xl border border-sky-400/25 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-sky-500/20">
                <span className="text-xs text-slate-400 font-semibold uppercase">Total Scheduled Hours:</span>
                <span className="text-sm font-mono font-bold text-white">{totalWeeklyHours} hrs / week</span>
              </div>

              <div>
                <div className="text-xs text-[#38BDF8] font-bold uppercase tracking-wider">Estimated Sentrova Cost</div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-black text-white font-mono">
                    ${monthlyCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs text-slate-300">/ month</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-medium">
                  (${weeklyCost.toFixed(2)} / week • No hidden contracts)
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Physical Guard Benchmark ($18/hr):</span>
                  <span className="font-mono line-through text-slate-400">${monthlyGuardCost.toFixed(0)}/mo</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-400 pt-1 border-t border-white/10">
                  <span>Your Monthly Savings:</span>
                  <span className="font-mono text-sm">~${monthlySavings.toFixed(0)}/mo</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <a
                  href={getCalculatorWhatsAppUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="relative group overflow-hidden w-full py-3.5 rounded-xl backdrop-blur-xl bg-gradient-to-r from-emerald-500/25 via-teal-500/30 to-emerald-500/25 hover:from-emerald-500/35 hover:via-teal-500/40 hover:to-emerald-500/35 border border-emerald-400/60 hover:border-emerald-300 text-white font-extrabold text-xs sm:text-sm transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_8px_28px_rgba(16,185,129,0.35)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_12px_36px_rgba(16,185,129,0.5)] cursor-pointer flex items-center justify-center gap-2.5 hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
                  <div className="w-5 h-5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 group-hover:text-white transition-colors shrink-0">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <span>Inquire via WhatsApp (~${monthlyCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/mo)</span>
                  <ArrowRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-1 group-hover:text-white transition-all ml-0.5 shrink-0" />
                </a>

                <button
                  onClick={() => onOpenQuote(calcTier)}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 border border-white/15"
                >
                  <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
                  <span>Request Custom Corporate Proposal</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Feature Comparison Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-16">
        <div className="bg-[#0A162D]/80 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-sky-400/25 shadow-2xl shadow-blue-950/30 text-left">
          <div className="max-w-3xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
              Side-by-Side Surveillance Comparison
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Verify what each monitoring tier delivers for your commercial footprint.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-sky-500/20 bg-slate-900/80">
                  <th className="py-4 px-4 font-bold text-slate-300 uppercase tracking-wider text-xs">Surveillance Capability</th>
                  <th className="py-4 px-4 font-bold text-white text-center">Essential ($1.99/hr)</th>
                  <th className="py-4 px-4 font-extrabold text-[#00D2FF] text-center bg-sky-500/10">Growth ($2.99/hr)</th>
                  <th className="py-4 px-4 font-bold text-white text-center">Ultimate ($5.99/hr)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-500/15">
                {PACKAGE_COMPARISON.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-200">{row.feature}</td>
                    <td className="py-3.5 px-4 text-center">
                      {row.essential ? (
                        <Check className="w-4 h-4 text-[#00D2FF] mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-slate-600 mx-auto" />
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center bg-sky-500/10 font-bold">
                      {row.growth ? (
                        <Check className="w-4 h-4 text-[#00D2FF] mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-slate-600 mx-auto" />
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {row.ultimate ? (
                        <Check className="w-4 h-4 text-[#00D2FF] mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-slate-600 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#0756C9] to-[#0A162D] rounded-3xl p-8 sm:p-12 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 border border-sky-400/30 shadow-2xl">
          <div>
            <h3 className="text-2xl sm:text-3xl font-black mb-2 text-white">Need a Multi-Branch Commercial Quote?</h3>
            <p className="text-slate-300 text-sm sm:text-base max-w-lg">
              Operating multiple retail stores, depots, or supermarkets? Contact our corporate security team for tiered volume discounts.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenQuote('ultimate')}
              className="px-6 py-3.5 rounded-full bg-sentrova-gradient hover:opacity-95 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer flex items-center gap-2 border border-sky-300/30"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Request Corporate Quote</span>
            </button>
            <Link
              to="/contact"
              className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all"
            >
              <span>Contact Operations</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
