import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from './useAdminAuth';

export default function RequireAdmin() {
  const { user, loading, isAdmin, signOut } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F6F9] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 bg-white p-8 rounded-lg shadow-sm border border-[#E2E8F0]">
          <div className="w-8 h-8 border-4 border-[#0093DD] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-[#475569]">Verifying Administrator Credentials...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin-panel5463/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#F4F6F9] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-[420px] bg-white rounded-lg p-8 shadow-sm border border-[#E2E8F0] text-center">
          <div className="w-12 h-12 rounded-full bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#1E293B] mb-2">Access Denied</h2>
          <p className="text-sm text-[#64748B] mb-6 leading-relaxed">
            You do not have administrator access. Your account is authenticated but not registered as an active admin in the system.
          </p>
          <button
            type="button"
            onClick={() => signOut()}
            className="w-full py-2.5 px-4 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-sm font-semibold rounded-md transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
