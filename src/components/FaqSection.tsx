import React, { useState, useEffect } from 'react';
import { FAQS as DEFAULT_FAQS } from '../data/sentrovaData';
import { ChevronDown, PhoneCall } from 'lucide-react';
import { SENTROVA_CONTACT } from '../data/sentrovaData';
import { FaqItem } from '../types';
import { api } from '../services/api';

export const FaqSection: React.FC = () => {
  const [faqsList, setFaqsList] = useState<FaqItem[]>(DEFAULT_FAQS);
  const [openFaq, setOpenFaq] = useState<string | null>(DEFAULT_FAQS[0]?.id || null);

  useEffect(() => {
    api.getFaqs().then((apiFaqs) => {
      if (apiFaqs && apiFaqs.length > 0) {
        const mapped: FaqItem[] = apiFaqs.map((f) => ({
          id: String(f.id),
          question: f.question,
          answer: f.answer,
        }));
        setFaqsList(mapped);
        if (!openFaq && mapped[0]) {
          setOpenFaq(mapped[0].id);
        }
      }
    }).catch(() => {
      // fallback to DEFAULT_FAQS
    });
  }, []);

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 bg-[#060E1E] text-white relative border-t border-sky-500/10 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-[15%] right-[-100px] w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] left-[-100px] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          
          {/* Large Left Heading (5 cols) */}
          <div className="lg:col-span-5 text-left lg:sticky lg:top-28">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/15 border border-sky-400/30 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#00D2FF] animate-pulse" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#38BDF8]">
                Frequently Asked Questions
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
              QUESTIONS?
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-300 to-[#00D2FF]">
                WE HAVE ANSWERS.
              </span>
            </h2>

            <p className="text-base text-slate-300 font-normal leading-relaxed mb-8">
              Everything you need to know about connecting your cameras, our UK monitoring operations, alert dispatch times, and transparent hourly billing.
            </p>

            {/* Quick Contact Card on Left in Dark Glass Card */}
            <div className="p-6 rounded-2xl bg-[#0A162D]/80 backdrop-blur-xl border border-sky-400/20 shadow-xl shadow-blue-950/20 text-left">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-400/30 text-[#00D2FF] flex items-center justify-center shadow-xs">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">
                    Have a specific question?
                  </h4>
                  <p className="text-xs text-slate-400">Speak directly to an operations specialist.</p>
                </div>
              </div>
              <a
                href={`tel:${SENTROVA_CONTACT.phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#00D2FF] hover:text-white transition-colors mt-2"
              >
                <span>Call {SENTROVA_CONTACT.phoneDisplay}</span>
                <span>→</span>
              </a>
            </div>
          </div>

          {/* Right Accordion (7 cols) in Dark Glass Cards */}
          <div className="lg:col-span-7 space-y-4 text-left">
            {faqsList.map((faq) => {
              const isOpen = openFaq === faq.id;

              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'border-[#00D2FF] bg-[#0A162D]/90 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,210,255,0.18)]'
                      : 'border-sky-400/20 bg-[#0A162D]/60 backdrop-blur-md hover:border-[#00D2FF]/50 hover:bg-[#0A162D]/80 shadow-md'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full py-5 px-6 flex items-center justify-between gap-4 text-left cursor-pointer select-none"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                      {faq.question}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen
                          ? 'bg-sentrova-gradient text-white rotate-180 shadow-md shadow-sky-500/30'
                          : 'bg-sky-500/15 text-[#00D2FF]'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-slate-300 leading-relaxed border-t border-sky-500/20 animate-in fade-in duration-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};
