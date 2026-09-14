import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { ScrollToTop } from './components/ScrollToTop';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { FloatingChatbot } from './components/FloatingChatbot';
import { QuoteModal } from './components/QuoteModal';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { PageTransition } from './components/PageTransition';
import { PageProgressBar } from './components/PageProgressBar';
import { TapRippleEffect } from './components/TapRippleEffect';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { PricingPage } from './pages/PricingPage';
import { IndustriesPage } from './pages/IndustriesPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminPage } from './pages/AdminPage';
import { PackageTier } from './types';
import { SettingsProvider } from './context/SettingsContext';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageTier>('growth');

  const handleOpenQuote = (packageId?: string | PackageTier) => {
    if (packageId && (packageId === 'essential' || packageId === 'growth' || packageId === 'ultimate')) {
      setSelectedPackage(packageId);
    }
    setQuoteModalOpen(true);
  };

  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <Routes>
        <Route path="/admin/*" element={<AdminPage />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-[#060E1E] text-[#F1F5F9] flex flex-col selection:bg-[#00D2FF] selection:text-[#060E1E] font-sans antialiased relative">
      {/* Top Page Change Loading & Tap Progress Indicator */}
      <PageProgressBar />

      {/* Global Interactive Tap Ripple Effect */}
      <TapRippleEffect />

      {/* Scroll restoration helper */}
      <ScrollToTop />

      {/* Floating Glass Island Navbar */}
      <Navbar onOpenQuote={handleOpenQuote} />

      {/* Multi-page Routing with Smooth Page Change Animation */}
      <main className="flex-grow flex flex-col">
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><HomePage onOpenQuote={handleOpenQuote} /></PageTransition>} />
            <Route path="/services" element={<PageTransition><ServicesPage onOpenQuote={handleOpenQuote} /></PageTransition>} />
            <Route path="/how-it-works" element={<PageTransition><HowItWorksPage onOpenQuote={handleOpenQuote} /></PageTransition>} />
            <Route path="/pricing" element={<PageTransition><PricingPage onOpenQuote={handleOpenQuote} /></PageTransition>} />
            <Route path="/industries" element={<PageTransition><IndustriesPage onOpenQuote={handleOpenQuote} /></PageTransition>} />
            <Route path="/about" element={<PageTransition><AboutPage onOpenQuote={handleOpenQuote} /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><ContactPage initialPackage={selectedPackage} /></PageTransition>} />
            <Route path="/checkout" element={<Navigate to="/pricing" replace />} />
            <Route path="/pay" element={<Navigate to="/pricing" replace />} />
            {/* 404 Fallback Route */}
            <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Footer with Page Links */}
      <Footer onOpenAdmin={() => navigate('/admin')} />

      {/* Floating WhatsApp Quick Action Button */}
      <FloatingWhatsApp />

      {/* Floating AI Surveillance Advisor Chatbot */}
      <FloatingChatbot onOpenQuote={handleOpenQuote} />

      {/* Quick Quote Interactive Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        selectedPackage={selectedPackage}
      />

      {/* GDPR & PECR Cookie Consent Banner & Preferences Manager */}
      <CookieConsentBanner />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
    </BrowserRouter>
  );
}
