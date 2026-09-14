import React from 'react';
import { Link } from 'react-router-dom';
import { HeroSection } from '../components/HeroSection';
import { TrustBar } from '../components/TrustBar';
import { ServicesSection } from '../components/ServicesSection';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { DemoVideoSection } from '../components/DemoVideoSection';
import { PackagesSection } from '../components/PackagesSection';
import { WhySentrovaSection } from '../components/WhySentrovaSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { FinalCtaSection } from '../components/FinalCtaSection';
import { ArrowRight } from 'lucide-react';
import { PackageTier } from '../types';

interface HomePageProps {
  onOpenQuote: (pkg?: PackageTier) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenQuote }) => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <HeroSection onOpenQuote={() => onOpenQuote()} />

      {/* Trust Bar with Certified Security Badges & Moving Marquees */}
      <TrustBar />

      {/* Services Section with Direct Deep Dive Link */}
      <section className="relative bg-[#060E1E]">
        <ServicesSection onOpenQuote={(pkg) => onOpenQuote(pkg as PackageTier)} />
        <div className="max-w-7xl mx-auto px-4 text-center -mt-10 pb-16">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0A162D]/90 border border-sky-400/30 shadow-md hover:border-[#00D2FF] text-[#38BDF8] hover:text-white font-bold text-sm transition-all group"
          >
            <span>Explore All 8 Surveillance Services & Technical Specs</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#00D2FF]" />
          </Link>
        </div>
      </section>

      {/* How It Works Section with Direct Deep Dive Link */}
      <section className="relative bg-[#060E1E]">
        <HowItWorksSection />
        <div className="max-w-7xl mx-auto px-4 text-center -mt-8 pb-16">
          <Link
            to="/how-it-works"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0A162D]/90 border border-sky-400/30 shadow-md hover:border-[#00D2FF] text-[#38BDF8] hover:text-white font-bold text-sm transition-all group"
          >
            <span>Learn More About the 4-Step Pipeline & Audio Talk Deterrence</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#00D2FF]" />
          </Link>
        </div>
      </section>

      {/* Live Operations & Voice-Down Demo Video Section */}
      <DemoVideoSection onOpenQuote={onOpenQuote} />

      {/* Monitoring Packages */}
      <section className="relative bg-[#060E1E]">
        <PackagesSection onOpenQuote={(pkg) => onOpenQuote(pkg)} />
        <div className="max-w-7xl mx-auto px-4 text-center -mt-8 pb-16">
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0A162D]/90 border border-sky-400/30 shadow-md hover:border-[#00D2FF] text-[#38BDF8] hover:text-white font-bold text-sm transition-all group"
          >
            <span>Open Interactive Cost Calculator & Guard Savings Matrix</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#00D2FF]" />
          </Link>
        </div>
      </section>

      {/* Why Sentrova Advantages */}
      <WhySentrovaSection />

      {/* Verified Client Testimonials */}
      <TestimonialsSection />

      {/* Final Call to Action */}
      <FinalCtaSection onOpenQuote={() => onOpenQuote()} />
    </div>
  );
};
