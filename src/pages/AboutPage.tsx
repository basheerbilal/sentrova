import React from 'react';
import { Link } from 'react-router-dom';
import { FaqSection } from '../components/FaqSection';
import { PackageTier } from '../types';
import {
  ShieldCheck,
  Award,
  Users,
  Lock,
  Eye,
  CheckCircle2,
  ArrowRight,
  Zap,
  Target,
  FileCheck,
} from 'lucide-react';

interface AboutPageProps {
  onOpenQuote: (pkg?: PackageTier) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenQuote }) => {
  return (
    <div className="w-full bg-[#060E1E] text-slate-200 min-h-screen pt-24 pb-20">
      {/* Header */}
      <section className="relative py-16 border-b border-sky-500/20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-500/10 via-[#060E1E]/80 to-[#060E1E] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <nav className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 mb-4">
            <Link to="/" className="hover:text-[#00D2FF] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#00D2FF]">About Us</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-xs font-bold text-[#00D2FF] mb-4 shadow-[0_0_15px_rgba(0,210,255,0.15)]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00D2FF]" />
            <span>COMMERCIAL SURVEILLANCE EXCELLENCE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-3xl mx-auto mb-5 leading-tight">
            Security Built on Active <span className="bg-gradient-to-r from-white via-sky-200 to-[#00D2FF] bg-clip-text text-transparent">Human Vigilance</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Sentrova was founded to solve the fatal flaw of modern commercial security: cameras that silently record crimes without intervening to stop them.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
          <div>
            <span className="text-xs font-bold text-[#00D2FF] uppercase tracking-wider">Our Purpose</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-1 mb-5">
              Transforming CCTV from a Silent Witness into an <span className="text-[#00D2FF]">Active Defense</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
              For decades, business owners spent thousands of pounds installing CCTV cameras, only to realize that when thieves struck, all they had was high-definition video of masked individuals walking away with their merchandise.
            </p>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
              Sentrova turns the table. By streaming your existing cameras to our certified UK surveillance operations center, we provide real-time human eyes and instant voice-down talk deterrence at a fraction of the cost of physical security guards.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#0A162D]/85 border border-sky-400/20 backdrop-blur-xl shadow-lg">
                <div className="text-2xl sm:text-3xl font-black text-[#00D2FF] font-mono">94.2%</div>
                <div className="text-xs text-slate-400 font-medium mt-1">Crimes stopped at deterrence stage</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#0A162D]/85 border border-sky-400/20 backdrop-blur-xl shadow-lg">
                <div className="text-2xl sm:text-3xl font-black text-[#00D2FF] font-mono">{"< 30s"}</div>
                <div className="text-xs text-slate-400 font-medium mt-1">Average incident intervention time</div>
              </div>
            </div>
          </div>

          {/* Pillars Card */}
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-[#0A162D]/80 border border-sky-400/20 hover:border-[#00D2FF]/60 hover:shadow-[0_8px_30px_rgba(0,210,255,0.15)] transition-all backdrop-blur-xl">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-400/30 text-[#00D2FF] flex items-center justify-center font-bold">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Strict 1:16 Camera Concentration Ratio</h3>
                  <span className="text-xs font-bold text-[#00D2FF]">Industry standard is 1:64</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                We strictly cap the number of cameras assigned to an operator during an active shift. This ensures focused vigilance and rapid threat detection without operator burnout.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0A162D]/80 border border-sky-400/20 hover:border-[#00D2FF]/60 hover:shadow-[0_8px_30px_rgba(0,210,255,0.15)] transition-all backdrop-blur-xl">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-400/30 text-[#00D2FF] flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Vetted & Certified UK Operators</h3>
                  <span className="text-xs font-bold text-[#00D2FF]">SIA Standards & Continuous Training</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every member of our surveillance desk undergoes background checks, shrinkage detection training, and crisis de-escalation protocols.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0A162D]/80 border border-sky-400/20 hover:border-[#00D2FF]/60 hover:shadow-[0_8px_30px_rgba(0,210,255,0.15)] transition-all backdrop-blur-xl">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-400/30 text-[#00D2FF] flex items-center justify-center font-bold">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">UK GDPR & Data Compliance</h3>
                  <span className="text-xs font-bold text-[#00D2FF]">ICO Registered & TLS 1.3 Encrypted</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your video streams are encrypted in transit and stored according to strict UK data privacy legislation. Footage is shared solely with authorized personnel and law enforcement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Section */}
      <section className="border-t border-sky-500/20">
        <FaqSection />
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-gradient-to-r from-[#0A162D] via-[#0E244B] to-[#0756C9] rounded-3xl p-8 sm:p-12 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 border border-sky-400/30 shadow-[0_0_50px_rgba(0,210,255,0.15)]">
          <div>
            <h3 className="text-2xl sm:text-3xl font-black mb-2">Work with the Leaders in Active Surveillance</h3>
            <p className="text-slate-300 text-sm sm:text-base max-w-lg">
              Contact our senior operations managers today to schedule your complimentary video audit and live system demonstration.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenQuote('growth')}
              className="px-6 py-3.5 rounded-full bg-sentrova-gradient hover:opacity-95 text-white font-extrabold text-sm shadow-[0_8px_25px_rgba(8,123,255,0.3)] hover:shadow-[0_8px_25px_rgba(0,210,255,0.45)] transition-all cursor-pointer flex items-center gap-2 border border-white/25"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Get a Free Quote</span>
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
