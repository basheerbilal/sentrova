import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { api } from '../services/api';
import { ApiAdminUser } from '../types';

interface AdminLoginProps {
  onLoginSuccess: (admin: ApiAdminUser) => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToSite }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.login(email.trim(), password, rememberMe);
      if (res && res.admin) {
        onLoginSuccess(res.admin);
      } else {
        setError('Login failed: Administrator account profile not received.');
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060E1E] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans admin-theme text-slate-100">
      {/* Subtle Background Glows matching home page */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#00D2FF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#087BFF]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-subtle-mesh opacity-25 pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-sentrova-gradient flex items-center justify-center text-white shadow-lg shadow-[#087BFF]/30">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-wider text-white">SENTROVA</span>
            <span className="block text-xs font-semibold text-[#00D2FF] tracking-widest uppercase">Admin Operations</span>
          </div>
        </div>

        <h2 className="text-center text-2xl font-bold tracking-tight text-white">
          Sign in to Control Center
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Authorized personnel only. Enter your administrator credentials.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-[#0A162D]/95 backdrop-blur-xl py-8 px-6 shadow-2xl shadow-black/60 rounded-2xl border border-sky-400/25 sm:px-10">
          {error && (
            <div className="mb-6 rounded-xl bg-red-950/40 border border-red-500/40 p-4 flex items-start gap-3 text-red-300 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit} autoComplete="off">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Administrator Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3.5 py-2.5 text-sm bg-[#0B2147] border border-sky-400/30 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-[#00D2FF]/40 focus:border-[#00D2FF] outline-none transition-all"
                  placeholder="admin@sentrova.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 text-sm bg-[#0B2147] border border-sky-400/30 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-[#00D2FF]/40 focus:border-[#00D2FF] outline-none transition-all"
                  placeholder="Enter administrator password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[#087BFF] rounded border-sky-400/30 bg-[#0B2147] focus:ring-[#00D2FF]"
                />
                <span>Remember me on this browser</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl shadow-lg shadow-[#087BFF]/30 text-sm font-bold text-white bg-sentrova-gradient hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00D2FF] transition-all disabled:opacity-50 active:scale-[0.99]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-sky-400/20 text-center">
            <button
              type="button"
              onClick={onBackToSite}
              className="text-xs font-semibold text-slate-400 hover:text-[#00D2FF] transition-colors"
            >
              ← Return to public SENTROVA website
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
