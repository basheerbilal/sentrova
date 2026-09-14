import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { SentrovaLogo } from './SentrovaLogo';
import { Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  onOpenQuote: (packageId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenQuote }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;

          // Update frosted glass background blur & saturation
          setIsScrolled(currentY > 20);

          // Always visible at the top safe zone or if drawer is open
          if (currentY <= 40 || mobileMenuOpen) {
            setIsVisible(true);
          } else if (currentY > lastY + 6) {
            // Scroll down: hide navbar with spring motion
            setIsVisible(false);
          } else if (currentY < lastY - 6) {
            // Scroll up: smoothly reveal navbar
            setIsVisible(true);
          }

          lastY = Math.max(0, currentY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);

  const handleNavClick = (targetPath: string) => {
    if (location.pathname === targetPath) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Industries', path: '/industries' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <motion.header
      id="main-navbar"
      initial={{ y: -80, opacity: 0 }}
      animate={{
        y: isVisible ? 0 : -105,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 280,
        damping: 26,
        mass: 0.75,
      }}
      className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-5 lg:px-8 pt-2.5 sm:pt-3.5 pointer-events-none will-change-transform"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Floating Glass Island Capsule */}
        <motion.div
          layout
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={`pointer-events-auto rounded-2xl sm:rounded-3xl relative overflow-hidden px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between ${
            isScrolled ? 'glass-navbar-scrolled' : 'glass-navbar'
          }`}
        >
          {/* Specular Edge: Realistic top-edge light reflection on glass */}
          <div className="glass-specular-edge" />

          {/* Diagonal Glass Sheen Ambient Layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/35 via-transparent to-blue-50/20 pointer-events-none -z-10" />

          {/* Logo on Left with Smooth Motion Hover and Scroll To Top */}
          <Link
            to="/"
            onClick={() => handleNavClick('/')}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#087BFF] rounded-xl transition-opacity hover:opacity-95 shrink-0"
            aria-label="SENTROVA Home"
          >
            <SentrovaLogo size="md" />
          </Link>

          {/* Desktop Navigation Links with Glass Interactive Motion Pills */}
          <nav className="hidden xl:flex items-center space-x-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
              return (
                <motion.div
                  key={link.label}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.94 }}
                  className="relative"
                >
                  <NavLink
                    to={link.path}
                    onClick={() => handleNavClick(link.path)}
                    className={`relative z-10 block text-[13.5px] font-semibold transition-colors px-3.5 py-1.5 rounded-full select-none ${
                      isActive
                        ? 'text-[#00D2FF] font-extrabold'
                        : 'text-slate-300 hover:text-[#00D2FF]'
                    }`}
                  >
                    {link.label}
                  </NavLink>
                  {isActive && (
                    <motion.span
                      layoutId="navbar-active-pill"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-sky-500/15 border border-sky-400/40 shadow-[0_0_12px_rgba(0,210,255,0.25)] pointer-events-none z-0"
                    />
                  )}
                </motion.div>
              );
            })}
          </nav>

          {/* Right CTAs */}
          <div className="hidden lg:flex items-center space-x-3.5">
            {/* Get a Quote Primary CTA with Motion Spring and Soft Elevate */}
            <motion.button
              onClick={() => onOpenQuote()}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="bg-sentrova-gradient hover:opacity-95 text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-[13.5px] font-bold shadow-[0_6px_20px_rgba(8,123,255,0.28)] hover:shadow-[0_8px_25px_rgba(0,210,255,0.45)] transition-all cursor-pointer inline-flex items-center gap-2 border border-white/30 relative overflow-hidden"
              id="navbar-quote-btn"
            >
              <span>Get a Quote</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex lg:hidden items-center space-x-2">
            <motion.button
              onClick={() => onOpenQuote()}
              whileTap={{ scale: 0.95 }}
              className="text-xs font-bold bg-sentrova-gradient text-white px-3.5 py-1.5 rounded-full shadow-sm"
            >
              Quote
            </motion.button>
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              className="p-2 rounded-xl text-white bg-slate-900/80 backdrop-blur-md border border-sky-400/30 hover:border-[#00D2FF]/60 hover:bg-slate-850 shadow-xs transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#00D2FF]" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </motion.div>

        {/* Mobile Glass Navigation Drawer with Framer Motion Spring AnimatePresence */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden pointer-events-auto mt-2.5 glass-navbar-scrolled rounded-2xl sm:rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden"
            >
              {/* Top Specular Line for Mobile Drawer */}
              <div className="glass-specular-edge" />

              <div className="flex flex-col space-y-1.5 relative z-10">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
                  return (
                    <motion.div
                      key={link.label}
                      whileTap={{ scale: 0.96 }}
                      className="w-full"
                    >
                      <NavLink
                        to={link.path}
                        onClick={() => handleNavClick(link.path)}
                        className={`text-sm font-bold px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between ${
                          isActive
                            ? 'text-[#00D2FF] bg-sky-500/15 shadow-xs border border-sky-400/40 font-black'
                            : 'text-slate-200 hover:text-[#00D2FF] hover:bg-slate-800/60'
                        }`}
                      >
                        <span>{link.label}</span>
                        <ArrowRight className={`w-3.5 h-3.5 ${isActive ? 'text-[#00D2FF] opacity-100' : 'opacity-40'}`} />
                      </NavLink>
                    </motion.div>
                  );
                })}

                <div className="pt-3 mt-1.5 border-t border-sky-900/50 flex flex-col gap-2.5">
                  <motion.button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenQuote();
                    }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2.5 bg-sentrova-gradient hover:opacity-95 text-white font-bold rounded-xl text-center flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(8,123,255,0.25)] text-sm cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Get a Free Monitoring Quote</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};
