import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../auth/useAdminAuth';
import { Lock, Mail, AlertCircle, ShieldAlert } from 'lucide-react';
import '../styles/admin.css';

export default function AdminLoginPage() {
  const { user, isAdmin, loading, signIn, authError, clearAuthError } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [inactivityMsg, setInactivityMsg] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const reasonParam = searchParams.get('reason');
    let storedReason: string | null = null;
    try {
      storedReason = localStorage.getItem('admin_logout_reason');
    } catch {}

    if (reasonParam === 'inactivity' || storedReason === 'inactivity' || location.state?.reason === 'inactivity') {
      setInactivityMsg('Your admin session expired due to inactivity. Please sign in again.');
      try {
        localStorage.removeItem('admin_logout_reason');
      } catch {}
    }
  }, [location]);

  // If already logged in and verified admin, redirect to /admin-panel5463 dashboard
  if (!loading && user && isAdmin) {
    return <Navigate to="/admin-panel5463" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setInactivityMsg(null);
    clearAuthError();

    if (!email.trim() || !password) {
      setLocalError('Please enter both email address and password.');
      return;
    }

    setSubmitting(true);
    const result = await signIn(email.trim(), password);
    setSubmitting(false);

    if (result.success) {
      navigate('/admin-panel5463', { replace: true });
    }
  };

  const displayError = localError || authError || inactivityMsg;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 sm:p-10 py-12 sm:py-16 select-none">
      <div className="w-full max-w-[520px]">
        {/* Branding Block */}
        <div className="flex flex-col items-center mb-[40px] text-center">
          {/* Hardcoded Logo from public/admin-logo.png */}
          <img
            src="/admin-logo.png"
            alt="FAST-NUCES Multan Logo"
            className="w-[200px] sm:w-[220px] h-auto object-contain mb-[26px] mx-auto"
          />
          <h1 className="text-2xl sm:text-[28px] font-extrabold text-[#1E3A6D] tracking-tight">
            FAST-NUCES Multan
          </h1>
          <span className="text-xs sm:text-[13px] font-bold text-[#0093DD] tracking-widest uppercase mt-[8px]">
            WEBSITE ADMINISTRATION
          </span>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-md p-9 sm:p-[40px]">
          <h2 className="text-xl sm:text-[22px] font-bold text-[#0F172A] mb-[11px] text-left">
            Sign In to Admin Panel
          </h2>
          <p className="text-sm text-[#64748B] mb-[28px] leading-relaxed text-left">
            Enter your authorized administrator credentials to manage campus website content.
          </p>

          {/* Error Banner */}
          {displayError && (
            <div className="mb-[24px] p-4 bg-[#FEF2F2] border border-[#FCA5A5] rounded-lg flex items-start gap-3 text-left">
              {displayError.includes('administrator access') ? (
                <ShieldAlert className="w-5 h-5 text-[#DC2626] flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-[#DC2626] flex-shrink-0 mt-0.5" />
              )}
              <span className="text-xs sm:text-sm font-medium text-[#991B1B] leading-relaxed">
                {displayError}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-[22px]">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-[8px] text-left">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@multan.nu.edu.pk"
                  className="w-full h-[56px] pl-[44px] pr-4 bg-white border border-[#CBD5E1] rounded-lg text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#0093DD] focus:ring-2 focus:ring-[#0093DD]/20 transition-all"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-[8px] text-left">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-[56px] pl-[44px] pr-4 bg-white border border-[#CBD5E1] rounded-lg text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#0093DD] focus:ring-2 focus:ring-[#0093DD]/20 transition-all"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full h-[52px] py-2.5 px-5 bg-[#0093DD] hover:bg-[#0B2E59] text-white text-base font-bold rounded-lg shadow-xs hover:shadow-md transition-all duration-250 cursor-pointer flex items-center justify-center gap-2 mt-[28px] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="mt-[32px] text-center text-xs text-[#94A3B8] font-medium tracking-wide">
          FAST-NUCES Multan Campus • Internal CMS Control Panel
        </div>
      </div>
    </div>
  );
}
