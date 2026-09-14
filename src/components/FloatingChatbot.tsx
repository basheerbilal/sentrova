import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import {
  MessageSquare,
  X,
  Send,
  ShieldCheck,
  Phone,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Bot,
  RefreshCw,
  MinusCircle,
} from 'lucide-react';
import { SENTROVA_CONTACT } from '../data/sentrovaData';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface FloatingChatbotProps {
  onOpenQuote: (packageId?: string) => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome',
    role: 'assistant',
    content:
      "Hello! I am **Sentrova AI**, your 24/7 commercial CCTV surveillance & loss prevention advisor.\n\nHow can I help you protect your premises today?",
    timestamp: 'Just now',
  },
];

const SUGGESTED_QUESTIONS = [
  'Which plan fits my retail store?',
  'Does Sentrova work with my existing CCTV?',
  'How does the $1.99/hr pricing work?',
  'What is live voice-down audio deterrence?',
];

export const FloatingChatbot: React.FC<FloatingChatbotProps> = ({ onOpenQuote }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasPromptBubble, setHasPromptBubble] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || "I'm here to assist you with Sentrova's 24/7 video monitoring services. How else can I help?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Failed to communicate with chat backend:', err);
      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          "Sentrova provides 24/7 live active CCTV monitoring starting at **$1.99/hr** with no lock-in contracts. We connect securely to 99% of existing CCTV systems without replacing your cameras.\n\nWould you like a personalized monitoring quote or to speak with our UK operations desk at **+44 7742 476163**?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <>
      {/* Floating Action Button and Callout */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end pointer-events-auto">
        
        {/* Soft Callout Bubble when Chat is Closed */}
        <AnimatePresence>
          {!isOpen && hasPromptBubble && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="mb-3 mr-1 bg-[#0A162D]/95 backdrop-blur-xl border border-sky-400/30 rounded-2xl p-3.5 shadow-[0_12px_35px_rgba(0,210,255,0.25)] max-w-xs text-left relative cursor-pointer group"
              onClick={() => {
                setIsOpen(true);
                setHasPromptBubble(false);
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setHasPromptBubble(false);
                }}
                className="absolute -top-2 -left-2 w-5 h-5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full flex items-center justify-center text-[10px] shadow-md border border-sky-400/30"
                title="Dismiss"
              >
                <X className="w-3 h-3" />
              </button>
              
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00D2FF] animate-pulse" />
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#00D2FF]">
                  Sentrova Security AI
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-200 leading-snug">
                Questions about 24/7 CCTV monitoring or pricing? Ask our live AI advisor!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Floating Toggle Button */}
        <motion.button
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) setHasPromptBubble(false);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-[0_8px_30px_rgba(8,123,255,0.38)] hover:shadow-[0_10px_35px_rgba(0,210,255,0.5)] cursor-pointer transition-all duration-300 overflow-hidden border border-white/35 ${
            isOpen
              ? 'bg-[#060E1E] text-white hover:bg-[#0A162D]'
              : 'bg-sentrova-gradient text-white'
          }`}
          aria-label={isOpen ? 'Close AI Chat' : 'Open AI Security Chatbot'}
          id="floating-ai-chatbot-btn"
        >
          {/* Subtle top specular sheen */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <div className="relative flex items-center justify-center">
              <Bot className="w-7 h-7 text-white" />
              <Sparkles className="w-3.5 h-3.5 text-cyan-200 absolute -top-1 -right-1 animate-pulse" />
            </div>
          )}

          {/* Active Status Ring when closed */}
          {!isOpen && (
            <span className="absolute bottom-2 right-2 w-3 h-3 bg-[#00D2FF] border-2 border-[#060E1E] rounded-full shadow-xs" />
          )}
        </motion.button>
      </div>

      {/* Floating Chat Modal Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.94 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-22 right-4 sm:bottom-24 sm:right-6 z-50 w-[92vw] sm:w-[410px] h-[570px] max-h-[82vh] bg-[#0A162D]/95 backdrop-blur-2xl border border-sky-400/30 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,210,255,0.25)] flex flex-col overflow-hidden pointer-events-auto"
            id="floating-chatbot-window"
          >
            {/* Top Specular Edge */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />

            {/* Chatbot Header */}
            <div className="bg-sentrova-gradient text-white p-4 sm:px-5 flex items-center justify-between shrink-0 shadow-xs relative">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/30 backdrop-blur-md flex items-center justify-center text-white shadow-xs shrink-0">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm sm:text-base leading-none">
                      Sentrova AI Advisor
                    </h3>
                    <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider">
                      24/7
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-2 h-2 rounded-full bg-[#00D2FF] animate-pulse" />
                    <span className="text-[11px] text-cyan-100 font-medium">
                      Active Surveillance Desk
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleResetChat}
                  className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                  title="Reset conversation"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                  title="Minimize chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Action Strip below Header */}
            <div className="bg-[#060E1E]/90 border-b border-sky-500/20 px-4 py-2 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-[#00D2FF] font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instant surveillance answers</span>
              </div>
              <button
                onClick={() => onOpenQuote()}
                className="text-[11px] font-bold text-sky-300 hover:text-white hover:underline cursor-pointer flex items-center gap-0.5"
              >
                <span>Get a Quote</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-left scroll-smooth">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        isUser
                          ? 'bg-sentrova-gradient text-white rounded-br-xs shadow-xs border border-white/20'
                          : 'bg-[#0E1F3D]/90 border border-sky-400/20 text-slate-100 rounded-bl-xs shadow-md'
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <div className="markdown-body prose prose-sm max-w-none text-slate-100 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:ml-4 [&_ul]:mb-2 [&_li]:mb-1 [&_strong]:text-[#00D2FF] [&_strong]:font-bold">
                          <Markdown>{msg.content}</Markdown>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {isLoading && (
                <div className="flex items-start gap-2">
                  <div className="bg-[#0E1F3D]/90 border border-sky-400/20 rounded-2xl rounded-bl-xs px-4 py-3 shadow-md flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#00D2FF] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#087BFF] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Pill Recommendations */}
            {messages.length <= 2 && !isLoading && (
              <div className="px-4 pb-2 pt-1 border-t border-sky-500/20 bg-[#060E1E]/80">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Suggested Questions:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSendMessage(q)}
                      className="text-left text-xs bg-sky-500/10 hover:bg-sky-500/20 border border-sky-400/30 text-[#00D2FF] font-medium px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form Bar */}
            <div className="p-3 sm:p-4 bg-[#060E1E] border-t border-sky-500/20 flex flex-col gap-2 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about surveillance, packages..."
                  disabled={isLoading}
                  className="flex-1 bg-[#0A162D] border border-sky-400/20 focus:border-[#00D2FF] focus:outline-none rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-400 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-sentrova-gradient hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed text-white p-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center shrink-0 border border-white/20"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* Direct Link to Emergency Phone / WhatsApp */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-0.5">
                <a
                  href={`tel:${SENTROVA_CONTACT.phone.replace(/\s+/g, '')}`}
                  className="hover:text-[#00D2FF] flex items-center gap-1 transition-colors"
                >
                  <Phone className="w-3 h-3 text-[#00D2FF]" />
                  <span>Call Operations: {SENTROVA_CONTACT.phoneDisplay}</span>
                </a>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenQuote();
                  }}
                  className="font-bold text-[#00D2FF] hover:underline"
                >
                  Quote Tool →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
