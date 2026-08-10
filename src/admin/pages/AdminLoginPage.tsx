import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAdminAuth } from '../auth/useAdminAuth';
import { Lock, Mail, AlertCircle, ShieldAlert } from 'lucide-react';
import '../styles/admin.css';

export default function AdminLoginPage() {
  const { user, isAdmin, loading, signIn, authError, clearAuthError } = useAdminAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // If already logged in and verified admin, redirect to /admin-panel5463 dashboard
  if (!loading && user && isAdmin) {
    return <Navigate to="/admin-panel5463" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
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

  const displayError = localError || authError;

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col items-center justify-center p-4 select-none">
      <div className="w-full max-w-[420px]">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-14 h-14 rounded-full bg-[#1E3A6D] text-white flex items-center justify-center shadow-md mb-3 border-2 border-[#0093DD]">
            <span className="text-xs font-bold tracking-wider">FAST</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1E3A6D] tracking-tight">FAST-NUCES Multan</h1>
          <span className="text-xs font-bold text-[#0093DD] tracking-widest uppercase mt-1">
            Website Administration
          </span>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm p-6 sm:p-8">
          <h2 className="text-lg font-bold text-[#1E293B] mb-1">Sign In to Admin Panel</h2>
          <p className="text-xs text-[#64748B] mb-6">
            Enter your authorized administrator credentials to manage campus website content.
          </p>

          {/* Error Banner */}
          {displayError && (
            <div className="mb-5 p-3.5 bg-[#FEF2F2] border border-[#FCA5A5] rounded-md flex items-start gap-3 text-left">
              {displayError.includes('administrator access') ? (
                <ShieldAlert className="w-5 h-5 text-[#DC2626] flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-[#DC2626] flex-shrink-0 mt-0.5" />
              )}
              <span className="text-xs font-medium text-[#991B1B] leading-relaxed">
                {displayError}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5 text-left">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@multan.nu.edu.pk"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#CBD5E1] rounded-md text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#0093DD] focus:ring-1 focus:ring-[#0093DD]"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5 text-left">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#CBD5E1] rounded-md text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#0093DD] focus:ring-1 focus:ring-[#0093DD]"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-sm font-semibold rounded-md shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-xs text-[#94A3B8]">
          FAST-NUCES Multan Campus • Internal CMS Control Panel
        </div>
      </div>
    </div>
  );
}
