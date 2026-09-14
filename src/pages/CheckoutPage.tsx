import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Clock,
  Building2,
  Camera,
  Calendar,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Printer,
  Download,
  Sparkles,
  Phone,
  Mail,
  Shield,
  FileText,
  TrendingDown,
  Info,
} from 'lucide-react';
import { api } from '../services/api';
import { PackageTier, ApiPaymentOrder, PaymentGatewayConfig } from '../types';
import { generateInvoicePdf } from '../utils/invoicePdf';

interface CheckoutPageProps {
  onOpenQuote?: (pkg?: PackageTier) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onOpenQuote }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Selected Plan & Hours
  const paramPlan = (searchParams.get('plan') as PackageTier) || 'growth';
  const initialPlan: PackageTier =
    paramPlan === 'essential' || paramPlan === 'growth' || paramPlan === 'ultimate'
      ? paramPlan
      : 'growth';

  const paramHours = Number(searchParams.get('hours')) || 80;

  const [selectedPlan, setSelectedPlan] = useState<PackageTier>(initialPlan);
  const [hours, setHours] = useState<number>(Math.max(10, paramHours));
  const [step, setStep] = useState<number>(1);

  // Business & Monitoring Details Form
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [cameraCount, setCameraCount] = useState<number>(8);
  const [setupDate, setSetupDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Payment Details Form
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Gateway status & API state
  const [gatewayConfig, setGatewayConfig] = useState<PaymentGatewayConfig | null>(null);
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<ApiPaymentOrder | null>(null);

  // Rates
  const getRate = (tier: PackageTier) => {
    switch (tier) {
      case 'essential':
        return 1.99;
      case 'growth':
        return 2.99;
      case 'ultimate':
        return 5.99;
      default:
        return 2.99;
    }
  };

  const currentRate = getRate(selectedPlan);
  const subtotal = Math.round(hours * currentRate * 100) / 100;
  const taxAmount = 0.00; // 0% Reverse charge B2B security services
  const totalAmount = subtotal + taxAmount;

  // Comparison benchmark: Physical guard @ $18/hr
  const physicalGuardCost = hours * 18.00;
  const savings = Math.max(0, physicalGuardCost - totalAmount);

  useEffect(() => {
    api
      .getPaymentConfig()
      .then((cfg) => {
        setGatewayConfig(cfg);
      })
      .catch((err) => {
        console.warn('Could not fetch payment gateway config:', err);
      });
  }, []);

  // Card formatting helpers
  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').substring(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').substring(0, 4);
    if (digits.length >= 2) {
      return `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
    }
    return digits;
  };

  const detectCardBrand = (number: string): string => {
    const clean = number.replace(/\D/g, '');
    if (/^4/.test(clean)) return 'Visa';
    if (/^(5[1-5]|2[2-7])/.test(clean)) return 'Mastercard';
    if (/^3[47]/.test(clean)) return 'Amex';
    if (/^6(011|5)/.test(clean)) return 'Discover';
    return 'Credit Card';
  };

  const handleFillTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setExpiry('12/28');
    setCvc('924');
    setCardholderName(contactName || 'Marcus Vance');
    setPostalCode('SW1A 1AA');
  };

  const handleProceedToStep2 = () => {
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToStep3 = () => {
    if (!companyName.trim() || !contactName.trim() || !email.trim() || !phone.trim()) {
      setErrorMessage('Please fill in your Business Name, Contact Name, Email, and Phone number.');
      return;
    }
    setErrorMessage(null);
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanCard = cardNumber.replace(/\s+/g, '');
    if (cleanCard.length < 15) {
      setErrorMessage('Please enter a valid 16-digit credit or debit card number.');
      return;
    }
    if (!expiry.includes('/') || expiry.length < 5) {
      setErrorMessage('Please enter a valid expiry date (MM/YY).');
      return;
    }
    if (cvc.length < 3) {
      setErrorMessage('Please enter a valid 3 or 4 digit security code (CVC).');
      return;
    }

    setProcessing(true);

    try {
      // 1. Create Payment Intent on the server
      const intentRes = await api.createPaymentIntent({
        package_slug: selectedPlan,
        hours,
        company_name: companyName,
        contact_name: contactName,
        email,
        phone,
        camera_count: cameraCount,
        location,
        currency: 'USD',
      });

      // 2. Confirm order and persist to database
      const orderRes = await api.confirmOrder({
        payment_intent_id: intentRes.payment_intent_id,
        company_name: companyName,
        contact_name: contactName,
        email,
        phone,
        location,
        package_slug: selectedPlan,
        hours,
        camera_count: cameraCount,
        setup_date: setupDate,
        special_instructions: specialInstructions,
        card_last4: cleanCard.slice(-4),
        card_brand: detectCardBrand(cleanCard),
        payment_method: 'stripe_card',
      });

      setConfirmedOrder(orderRes);
      setStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Payment failure:', err);
      setErrorMessage(
        err.message || 'Payment authorization was declined. Please check card details or try another card.'
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="w-full bg-[#060E1E] text-slate-200 min-h-screen pt-24 pb-20 font-sans">
      {/* Header Banner */}
      <section className="relative py-12 border-b border-sky-500/20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-500/10 via-[#060E1E]/80 to-[#060E1E] pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <nav className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 mb-3">
            <Link to="/" className="hover:text-[#00D2FF] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/pricing" className="hover:text-[#00D2FF] transition-colors">
              Pricing
            </Link>
            <span>/</span>
            <span className="text-[#00D2FF]">Secure Payment Gateway</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-xs font-bold text-[#00D2FF] mb-3 shadow-[0_0_15px_rgba(0,210,255,0.15)]">
            <Lock className="w-3.5 h-3.5 text-[#00D2FF]" />
            <span>256-BIT ENCRYPTED COMMERCIAL CHECKOUT PORTAL</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Book Surveillance Retainer <span className="bg-gradient-to-r from-white via-sky-200 to-[#00D2FF] bg-clip-text text-transparent">Online</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Authorize remote surveillance hours for your retail store, supermarket, or facility.
            Monitoring operators connect directly to your existing CCTV cameras with zero lock-in contracts.
          </p>

          {/* Step Progress Indicators */}
          <div className="mt-8 max-w-2xl mx-auto flex items-center justify-between text-xs font-bold">
            {[
              { num: 1, label: 'Plan & Hours' },
              { num: 2, label: 'Site & Cameras' },
              { num: 3, label: 'Payment Gateway' },
              { num: 4, label: 'Tax Invoice' },
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center flex-1 last:flex-none">
                <div
                  className={`flex items-center gap-2 ${
                    step >= s.num ? 'text-[#00D2FF]' : 'text-slate-500'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                      step === s.num
                        ? 'bg-[#00D2FF] text-[#060E1E] ring-4 ring-sky-500/30 shadow-md shadow-sky-500/30'
                        : step > s.num
                        ? 'bg-emerald-500 text-white'
                        : 'bg-[#0E1F3D] text-slate-400 border border-sky-400/20'
                    }`}
                  >
                    {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                  </div>
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {idx < 3 && (
                  <div
                    className={`flex-1 h-0.5 mx-3 transition-colors ${
                      step > s.num ? 'bg-emerald-500' : 'bg-slate-800'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Form Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Main Form Column */}
          <div className="lg:col-span-8 bg-[#0A162D]/90 rounded-3xl p-6 sm:p-10 border border-sky-400/20 shadow-2xl backdrop-blur-2xl">
            {errorMessage && (
              <div className="mb-6 p-4 rounded-2xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs font-semibold flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* ================= STEP 1: PLAN & HOURS ================= */}
            {step === 1 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight mb-1">
                    1. Select Surveillance Tier & Monitoring Hours
                  </h2>
                  <p className="text-xs text-slate-400">
                    Choose the surveillance tier and schedule of operator hours suited to your store.
                  </p>
                </div>

                {/* Tier Selection Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    {
                      id: 'essential' as PackageTier,
                      name: 'Essential',
                      rate: 1.99,
                      desc: 'Customer theft & shoplifting monitoring with instant alerts.',
                    },
                    {
                      id: 'growth' as PackageTier,
                      name: 'Growth',
                      rate: 2.99,
                      popular: true,
                      desc: 'Customer + cashier till audit & stockroom monitoring.',
                    },
                    {
                      id: 'ultimate' as PackageTier,
                      name: 'Ultimate',
                      rate: 5.99,
                      desc: '360° facility watch, voice deterrence & police evidentiary dossiers.',
                    },
                  ].map((pkg) => (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setSelectedPlan(pkg.id)}
                      className={`p-5 rounded-2xl border-2 text-left transition-all relative cursor-pointer backdrop-blur-md ${
                        selectedPlan === pkg.id
                          ? 'border-[#00D2FF] bg-[#0E244B] shadow-[0_0_25px_rgba(0,210,255,0.25)]'
                          : 'border-sky-400/20 hover:border-sky-400/40 bg-[#0E1F3D]/70'
                      }`}
                    >
                      {pkg.popular && (
                        <span className="absolute -top-2.5 right-3 bg-sentrova-gradient text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-md border border-white/20">
                          POPULAR
                        </span>
                      )}
                      <div className="font-extrabold text-sm text-white uppercase mb-1">
                        {pkg.name}
                      </div>
                      <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-2xl font-black text-[#00D2FF] font-mono">
                          ${pkg.rate.toFixed(2)}
                        </span>
                        <span className="text-xs text-slate-400 font-bold">/hr</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug">{pkg.desc}</p>
                    </button>
                  ))}
                </div>

                {/* Hours Selector */}
                <div className="space-y-4 pt-4 border-t border-sky-500/15">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase text-slate-300 block">
                        Scheduled Surveillance Retainer Hours:
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Hours roll over indefinitely and never expire.
                      </span>
                    </div>
                    <span className="text-base font-black text-[#00D2FF] bg-sky-500/10 px-3 py-1 rounded-xl border border-sky-400/30 font-mono shadow-inner">
                      {hours} Hours
                    </span>
                  </div>

                  {/* Preset Hour Buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { val: 40, label: '40 Hours', sub: 'Starter Trial Shift' },
                      { val: 80, label: '80 Hours', sub: 'Bi-weekly Shift' },
                      { val: 160, label: '160 Hours', sub: 'Monthly Shift' },
                      { val: 320, label: '320 Hours', sub: 'Multi-cam 24/7' },
                    ].map((btn) => (
                      <button
                        key={btn.val}
                        type="button"
                        onClick={() => setHours(btn.val)}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          hours === btn.val
                            ? 'bg-sentrova-gradient text-white border-transparent shadow-[0_4px_20px_rgba(8,123,255,0.35)]'
                            : 'bg-[#0E1F3D]/80 text-slate-300 border-sky-400/20 hover:border-[#00D2FF]/40'
                        }`}
                      >
                        <div className="font-bold text-xs">{btn.label}</div>
                        <div
                          className={`text-[10px] ${
                            hours === btn.val ? 'text-cyan-100' : 'text-slate-400'
                          }`}
                        >
                          {btn.sub}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Slider for custom hours */}
                  <div className="pt-2">
                    <input
                      type="range"
                      min="10"
                      max="500"
                      step="5"
                      value={hours}
                      onChange={(e) => setHours(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#00D2FF]"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                      <span>10 hrs min</span>
                      <span>160 hrs (Standard Store Month)</span>
                      <span>500 hrs max</span>
                    </div>
                  </div>
                </div>

                {/* Cost Comparison Pill */}
                <div className="p-4 bg-emerald-950/60 rounded-2xl border border-emerald-500/40 flex items-center justify-between text-xs text-slate-200 backdrop-blur-md">
                  <div className="flex items-center gap-2.5">
                    <TrendingDown className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <span className="font-bold text-white">Physical Guard Comparison: </span>
                      <span>An on-site guard for {hours} hrs costs ~${physicalGuardCost.toFixed(0)}.</span>
                    </div>
                  </div>
                  <div className="font-black text-emerald-400 text-sm shrink-0">
                    Save ~${savings.toFixed(0)} (83%)
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleProceedToStep2}
                    className="px-8 py-3.5 rounded-xl bg-sentrova-gradient hover:opacity-95 text-white font-bold text-sm shadow-[0_8px_25px_rgba(8,123,255,0.3)] hover:shadow-[0_8px_25px_rgba(0,210,255,0.45)] flex items-center gap-2 transition-all cursor-pointer border border-white/20"
                  >
                    <span>Continue to Site Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ================= STEP 2: BUSINESS & CAMERA SPECS ================= */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight mb-1">
                    2. Business & Camera Onboarding Information
                  </h2>
                  <p className="text-xs text-slate-400">
                    Our UK operations desk will use these details to generate your tax invoice and verify your CCTV feeds.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Business / Company Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vance Superstores Ltd"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-sky-400/20 bg-[#060E1E]/90 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-[#00D2FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Primary Contact Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Marcus Vance"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-sky-400/20 bg-[#060E1E]/90 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-[#00D2FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Business Email (for Tax Invoices) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. billing@vanceretail.co.uk"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-sky-400/20 bg-[#060E1E]/90 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-[#00D2FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Operations Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +44 7742 476163"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-sky-400/20 bg-[#060E1E]/90 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-[#00D2FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Store / Premise Location & City
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 14 High Street, Manchester"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-sky-400/20 bg-[#060E1E]/90 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-[#00D2FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Total Cameras to Connect
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="128"
                        value={cameraCount}
                        onChange={(e) => setCameraCount(Math.max(1, Number(e.target.value)))}
                        className="w-full px-4 py-2.5 rounded-xl border border-sky-400/20 bg-[#060E1E]/90 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-[#00D2FF]"
                      />
                      <span className="text-xs font-semibold text-slate-400 shrink-0">Cameras</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Target Monitoring Launch Date
                    </label>
                    <input
                      type="date"
                      value={setupDate}
                      onChange={(e) => setSetupDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-sky-400/20 bg-[#060E1E]/90 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-[#00D2FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Existing Camera System Type
                    </label>
                    <select className="w-full px-4 py-2.5 rounded-xl border border-sky-400/20 bg-[#060E1E] text-white text-xs focus:outline-none focus:border-[#00D2FF]">
                      <option>Hikvision / HiLook NVR</option>
                      <option>Dahua DVR / NVR</option>
                      <option>Axis Communications IP</option>
                      <option>Uniview (UNV)</option>
                      <option>Hanwha / Samsung</option>
                      <option>Standard RTSP / ONVIF IP Stream</option>
                      <option>Other / Not Sure (Engineer will assist)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Special Monitoring Instructions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Focus on till register #2 and rear delivery loading bay during closing shifts."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-sky-400/20 bg-[#060E1E]/90 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-[#00D2FF]"
                  />
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-sky-500/15">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-5 py-2.5 rounded-xl border border-sky-400/20 text-slate-300 hover:bg-[#0E1F3D] text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleProceedToStep3}
                    className="px-8 py-3.5 rounded-xl bg-sentrova-gradient hover:opacity-95 text-white font-bold text-sm shadow-[0_8px_25px_rgba(8,123,255,0.3)] hover:shadow-[0_8px_25px_rgba(0,210,255,0.45)] flex items-center gap-2 transition-all cursor-pointer border border-white/20"
                  >
                    <span>Proceed to Payment Gateway</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ================= STEP 3: PAYMENT GATEWAY (STRIPE) ================= */}
            {step === 3 && (
              <form onSubmit={handleProcessPayment} className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black text-white tracking-tight mb-1">
                      3. Secure Card Payment Gateway
                    </h2>
                    <p className="text-xs text-slate-400">
                      Processed securely via 256-bit encrypted Stripe gateway. Instant digital invoice provided.
                    </p>
                  </div>

                  {/* Sandbox status indicator */}
                  <div className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-[11px] font-bold text-[#00D2FF] flex items-center gap-1.5 shrink-0 shadow-[0_0_10px_rgba(0,210,255,0.15)]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{gatewayConfig?.configured ? 'Stripe Gateway Live' : 'Sandbox Gateway'}</span>
                  </div>
                </div>

                {/* Sandbox Test Card Notice & Quick Filler */}
                {!gatewayConfig?.configured && (
                  <div className="p-4 bg-[#0E1F3D]/80 rounded-2xl border border-sky-400/20 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Info className="w-4 h-4 text-[#00D2FF] shrink-0" />
                      <span>
                        <strong className="text-white">Testing Mode:</strong> You can test full end-to-end checkout with our test card.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleFillTestCard}
                      className="px-3 py-1.5 bg-[#00D2FF]/10 text-[#00D2FF] hover:bg-[#00D2FF] hover:text-[#060E1E] border border-sky-400/30 rounded-lg font-bold text-xs transition-colors cursor-pointer shrink-0"
                    >
                      Fill Demo Test Card (4242)
                    </button>
                  </div>
                )}

                {/* Credit Card Input Form */}
                <div className="p-6 rounded-2xl border border-sky-400/20 bg-[#0E1F3D]/70 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-sky-500/15 pb-3">
                    <span className="text-xs font-bold uppercase text-slate-400">Cardholder Details</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-[#00D2FF] font-mono">
                        {detectCardBrand(cardNumber)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Name on Card *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Marcus Vance"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-sky-400/20 bg-[#060E1E]/90 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-[#00D2FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Card Number *
                    </label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        maxLength={19}
                        placeholder="4242 •••• •••• 4242"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sky-400/20 bg-[#060E1E]/90 text-white placeholder-slate-400 text-xs font-mono tracking-wider focus:outline-none focus:border-[#00D2FF]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                        Expiry (MM/YY) *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        className="w-full px-4 py-2.5 rounded-xl border border-sky-400/20 bg-[#060E1E]/90 text-white placeholder-slate-400 text-xs font-mono text-center focus:outline-none focus:border-[#00D2FF]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                        CVC / CVV *
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        placeholder="123"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').substring(0, 4))}
                        className="w-full px-4 py-2.5 rounded-xl border border-sky-400/20 bg-[#060E1E]/90 text-white placeholder-slate-400 text-xs font-mono text-center focus:outline-none focus:border-[#00D2FF]"
                      />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                        Billing Postal Code *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="ZIP / Postcode"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-sky-400/20 bg-[#060E1E]/90 text-white placeholder-slate-400 text-xs uppercase focus:outline-none focus:border-[#00D2FF]"
                      />
                    </div>
                  </div>
                </div>

                {/* Security Guarantee Box */}
                <div className="p-4 bg-sky-500/10 rounded-2xl border border-sky-400/20 flex items-center gap-3 text-xs text-slate-300">
                  <ShieldCheck className="w-6 h-6 text-[#00D2FF] shrink-0" />
                  <div>
                    <span className="font-bold text-white">Guaranteed Operational Onboarding SLA: </span>
                    <span>
                      Our security engineering team verifies network camera connections within 24 hours.
                      Unused surveillance hours never expire and remain credited to your account.
                    </span>
                  </div>
                </div>

                {/* Form Action Controls */}
                <div className="pt-4 flex items-center justify-between border-t border-sky-500/15">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={processing}
                    className="px-5 py-2.5 rounded-xl border border-sky-400/20 text-slate-300 hover:bg-[#0E1F3D] text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Specs</span>
                  </button>

                  <button
                    type="submit"
                    disabled={processing}
                    className="px-8 py-3.5 rounded-xl bg-sentrova-gradient hover:opacity-95 text-white font-extrabold text-sm shadow-[0_8px_25px_rgba(8,123,255,0.3)] hover:shadow-[0_8px_25px_rgba(0,210,255,0.45)] flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 border border-white/25"
                  >
                    {processing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Authorizing Payment...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Authorize & Pay ${totalAmount.toFixed(2)}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* ================= STEP 4: ORDER CONFIRMATION & TAX INVOICE ================= */}
            {step === 4 && confirmedOrder && (
              <div className="space-y-6">
                {/* Celebration Header */}
                <div className="p-6 bg-emerald-950/60 rounded-2xl border border-emerald-500/40 text-center sm:text-left flex flex-col sm:flex-row items-center gap-4 backdrop-blur-md">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white">
                      Surveillance Retainer Confirmed & Activated!
                    </h2>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Your payment has been cleared via Stripe. Formal commercial invoice{' '}
                      <strong className="text-[#00D2FF]">{confirmedOrder.invoice_number}</strong> generated.
                    </p>
                  </div>
                </div>

                {/* Official Tax Invoice Container */}
                <div
                  id="customer-tax-invoice"
                  className="p-6 sm:p-8 rounded-2xl border border-sky-400/20 bg-[#0E1F3D]/80 space-y-6 text-xs text-slate-300"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-sky-500/15">
                    <div>
                      <div className="text-base font-black text-white tracking-tight">
                        SENTROVA SURVEILLANCE LTD
                      </div>
                      <div className="text-slate-400 text-[11px] mt-0.5">
                        Commercial Remote CCTV Monitoring & Active Voice Deterrence
                      </div>
                      <div className="text-slate-400 text-[11px]">Operations Hotline: +44 7742 476163</div>
                      <div className="text-slate-400 text-[11px]">billing@sentrova.co.uk</div>
                    </div>
                    <div className="sm:text-right">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 block">
                        Commercial Tax Invoice
                      </span>
                      <div className="font-mono font-black text-sm text-[#00D2FF]">
                        {confirmedOrder.invoice_number}
                      </div>
                      <div className="text-slate-400 text-[11px] mt-1">
                        Date: {new Date(confirmedOrder.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-slate-400 text-[11px] font-mono">
                        Txn: {confirmedOrder.transaction_id}
                      </div>
                      <button
                        type="button"
                        onClick={() => generateInvoicePdf(confirmedOrder)}
                        className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-[#00D2FF] font-bold text-[11px] border border-sky-400/30 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </button>
                    </div>
                  </div>

                  {/* Customer & Location Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#060E1E]/80 rounded-xl border border-sky-400/20">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Billed Client
                      </span>
                      <div className="font-bold text-white text-sm">{confirmedOrder.company_name}</div>
                      <div>Attn: {confirmedOrder.contact_name}</div>
                      <div>{confirmedOrder.email}</div>
                      <div>{confirmedOrder.phone}</div>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Monitoring Site Details
                      </span>
                      <div className="text-slate-200 font-medium">
                        {confirmedOrder.location || 'Store Premise'}
                      </div>
                      <div>Registered Cameras: <strong className="text-white">{confirmedOrder.camera_count} Feeds</strong></div>
                      <div>Setup Date: <strong className="text-white">{confirmedOrder.setup_date}</strong></div>
                    </div>
                  </div>

                  {/* Line Item */}
                  <table className="w-full text-left">
                    <thead className="border-b border-sky-500/20 text-slate-400 uppercase text-[10px] font-bold">
                      <tr>
                        <th className="py-2">Service Description</th>
                        <th className="py-2 text-right">Hours</th>
                        <th className="py-2 text-right">Hourly Rate</th>
                        <th className="py-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sky-500/10">
                      <tr>
                        <td className="py-3">
                          <div className="font-bold text-white">{confirmedOrder.package_name}</div>
                          <div className="text-[11px] text-slate-400">
                            Active live surveillance shifts, immediate voice-down deterrence, and daily encrypted shift logs.
                          </div>
                        </td>
                        <td className="py-3 text-right font-mono font-bold text-white">
                          {confirmedOrder.hours_purchased} hrs
                        </td>
                        <td className="py-3 text-right font-mono text-slate-300">
                          ${confirmedOrder.hourly_rate.toFixed(2)}/hr
                        </td>
                        <td className="py-3 text-right font-mono font-bold text-[#00D2FF]">
                          ${confirmedOrder.subtotal.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                    <tfoot className="border-t border-sky-500/20">
                      <tr>
                        <td colSpan={3} className="pt-3 text-right font-bold text-slate-400">
                          Subtotal:
                        </td>
                        <td className="pt-3 text-right font-mono font-bold text-white">
                          ${confirmedOrder.subtotal.toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={3} className="py-1 text-right text-slate-400">
                          VAT / Tax (0% Reverse Charge B2B):
                        </td>
                        <td className="py-1 text-right font-mono text-slate-400">$0.00</td>
                      </tr>
                      <tr className="text-sm font-black text-white">
                        <td colSpan={3} className="pt-2 text-right">
                          Total Paid:
                        </td>
                        <td className="pt-2 text-right font-mono text-[#00D2FF]">
                          ${confirmedOrder.total_amount.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>

                  <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-500/40 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span className="font-semibold text-emerald-200">
                        Paid in full via {confirmedOrder.card_brand} •••• {confirmedOrder.card_last4}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">
                      Cleared by Stripe
                    </span>
                  </div>
                </div>

                {/* Onboarding Next Steps Timeline */}
                <div className="p-6 bg-[#0E1F3D]/80 rounded-2xl border border-sky-400/20 space-y-4">
                  <h3 className="font-black text-sm text-white uppercase tracking-wider">
                    Next Steps: Operator Setup Timeline
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 bg-[#060E1E]/80 rounded-xl border border-sky-400/20">
                      <div className="w-7 h-7 rounded-lg bg-sky-500/15 text-[#00D2FF] font-black text-xs flex items-center justify-center mb-2">
                        1
                      </div>
                      <div className="font-bold text-white">Invoice Sent</div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Official tax invoice sent to {confirmedOrder.email}.
                      </p>
                    </div>

                    <div className="p-4 bg-[#060E1E]/80 rounded-xl border border-sky-400/20">
                      <div className="w-7 h-7 rounded-lg bg-sky-500/15 text-[#00D2FF] font-black text-xs flex items-center justify-center mb-2">
                        2
                      </div>
                      <div className="font-bold text-white">CCTV Connection</div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Our UK engineer contacts you within 24h to connect your RTSP/NVR stream.
                      </p>
                    </div>

                    <div className="p-4 bg-[#060E1E]/80 rounded-xl border border-sky-400/20">
                      <div className="w-7 h-7 rounded-lg bg-sky-500/15 text-[#00D2FF] font-black text-xs flex items-center justify-center mb-2">
                        3
                      </div>
                      <div className="font-bold text-white">Shifts Begin</div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Active surveillance commences with live daily logs & WhatsApp incident alerts.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col lg:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                  <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => generateInvoicePdf(confirmedOrder)}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-sentrova-gradient hover:opacity-95 text-white text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-[0_8px_25px_rgba(8,123,255,0.3)] transition-all border border-white/20"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Invoice PDF</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="w-full sm:w-auto px-5 py-3 rounded-xl border border-sky-400/20 bg-[#0E1F3D] hover:bg-[#0E244B] text-xs font-bold text-slate-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
                    >
                      <Printer className="w-4 h-4 text-slate-400" />
                      <span>Print Tax Invoice</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <Link
                      to="/"
                      className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold text-center transition-colors border border-slate-700"
                    >
                      Return to Homepage
                    </Link>
                    <a
                      href={`https://api.whatsapp.com/send/?phone=447448871603&text=Hello%20Sentrova,%20I%20have%20just%20completed%20an%20online%20surveillance%20payment.%20Order%20Ref:%20${encodeURIComponent(confirmedOrder.invoice_number)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <span>Contact WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-4 bg-gradient-to-br from-[#0A162D] via-[#0E244B] to-[#0756C9] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-sky-400/30 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-sky-500/20">
              <span className="text-xs font-bold uppercase tracking-wider text-[#00D2FF]">
                Order Summary
              </span>
              <span className="text-xs text-slate-300 font-mono">No Lock-in</span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="text-slate-300 font-semibold">Selected Surveillance Package</div>
                <div className="text-base font-black text-white uppercase mt-0.5">
                  {selectedPlan} Package
                </div>
                <div className="text-[11px] text-[#00D2FF] font-mono">
                  ${currentRate.toFixed(2)} per operator hour
                </div>
              </div>

              <div className="flex justify-between items-center py-2 border-y border-sky-500/20">
                <span className="text-slate-300">Total Hours Retainer:</span>
                <span className="font-mono font-bold text-white text-sm">{hours} Hours</span>
              </div>

              <div className="space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT / Sales Tax (0% B2B):</span>
                  <span className="font-mono text-slate-400">$0.00</span>
                </div>
              </div>

              <div className="pt-3 border-t border-sky-500/20 flex justify-between items-baseline">
                <span className="font-bold text-sm text-white">Total Payable:</span>
                <div className="text-right">
                  <div className="text-2xl font-black text-[#00D2FF] font-mono">
                    ${totalAmount.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-300">USD • Billed Hourly</div>
                </div>
              </div>
            </div>

            {/* Included Features List */}
            <div className="p-4 rounded-2xl bg-black/20 border border-sky-400/20 space-y-2.5 text-xs backdrop-blur-md">
              <div className="text-[11px] font-extrabold text-[#00D2FF] uppercase tracking-wider">
                Included in Retainer:
              </div>
              <ul className="space-y-2 text-[11px] text-slate-300">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00D2FF] shrink-0" />
                  <span>Real-time theft & concealment monitoring</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00D2FF] shrink-0" />
                  <span>Instant manager WhatsApp alerts in &lt;30s</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00D2FF] shrink-0" />
                  <span>Live audio voice-down broadcast deterrence</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00D2FF] shrink-0" />
                  <span>Unused hours roll over indefinitely</span>
                </li>
              </ul>
            </div>

            {/* 24/7 Operations Desk Support */}
            <div className="pt-2 text-center text-xs text-slate-300">
              <p>Questions regarding custom hours or camera compatibility?</p>
              <div className="mt-2 flex items-center justify-center gap-2 text-[#00D2FF] font-bold">
                <Phone className="w-3.5 h-3.5" />
                <span>+44 7742 476163 (24/7 Operations Desk)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
