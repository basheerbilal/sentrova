import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SENTROVA_CONTACT } from '../data/sentrovaData';
import { useSettings } from '../context/SettingsContext';

export const FloatingWhatsApp: React.FC = () => {
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = message.trim() || settings.whatsappMessage || 'Hello Sentrova, I would like to inquire about 24/7 CCTV monitoring.';
    const phoneClean = (settings.whatsapp || '447448871603').replace(/[^0-9]/g, '');
    const url = `https://api.whatsapp.com/send/?phone=${phoneClean}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setMessage('');
    setIsOpen(false);
  };

  return (
    <aside
      aria-label="WhatsApp chat assistance"
      className="fixed bottom-5 left-5 sm:bottom-6 sm:left-6 z-50 select-none pointer-events-auto"
    >
      {/* Quick WhatsApp Pop-up Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.94 }}
            transition={{ duration: 0.2 }}
            className="mb-3 w-[300px] sm:w-[320px] bg-[#0A162D]/98 backdrop-blur-xl border border-emerald-500/40 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden text-left"
          >
            {/* Header */}
            <div className="bg-[#25D366] text-slate-950 p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-950/10 flex items-center justify-center font-bold">
                  <MessageSquare className="w-4 h-4 fill-slate-950 text-slate-950" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs uppercase tracking-wide leading-tight">
                    Sentrova WhatsApp Desk
                  </h4>
                  <span className="text-[10px] font-semibold text-emerald-950 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-950 animate-ping" />
                    Online • Typically replies instantly
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-950/80 hover:text-slate-950 cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-3.5 space-y-3 bg-[#060E1E]/95">
              <div className="bg-[#0D244C] border border-sky-400/25 p-3 rounded-xl text-xs text-slate-200">
                <p className="font-semibold text-white mb-1">Hi there! 👋</p>
                <p>How can we help you protect your store or business with 24/7 CCTV monitoring?</p>
              </div>

              {/* Input Form */}
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-[#0A162D] border border-emerald-500/30 focus:border-[#25D366] focus:outline-none rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400"
                />
                <button
                  type="submit"
                  className="bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 p-2 rounded-xl transition-transform active:scale-95 cursor-pointer shrink-0 shadow-sm"
                  title="Send via WhatsApp"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Floating Button / Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 p-2 sm:px-3 sm:py-2 rounded-full bg-[#0B1A38]/95 border border-emerald-500/50 hover:border-emerald-400 shadow-[0_8px_30px_rgba(0,0,0,0.7)] cursor-pointer hover:shadow-emerald-500/25 transition-all group backdrop-blur-md active:scale-95"
          aria-label="Toggle WhatsApp Chat"
          id="floating-whatsapp-btn"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-sm shrink-0 relative group-hover:scale-105 transition-transform">
            <MessageSquare className="w-5 h-5 fill-white text-white" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border-2 border-white"></span>
            </span>
          </div>
          <span className="text-[13px] sm:text-[14px] font-bold text-white pr-2.5 hidden sm:inline group-hover:text-emerald-300 transition-colors">
            WhatsApp
          </span>
        </button>
      </div>
    </aside>
  );
};
