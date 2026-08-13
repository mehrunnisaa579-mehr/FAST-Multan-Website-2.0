import React, { createContext, useState, useEffect, useRef, ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';

export const ADMIN_INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
const LAST_ACTIVITY_KEY = 'admin_last_activity';
const LOGOUT_REASON_KEY = 'admin_logout_reason';

export interface AdminProfile {
  user_id: string;
  display_name: string | null;
  role: 'admin' | 'super_admin';
  is_active: boolean;
}

export interface AdminAuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  adminProfile: AdminProfile | null;
  authError: string | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  clearAuthError: () => void;
}

export const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const lastActivityRef = useRef<number>(Date.now());

  const verifyAdminStatus = async (currentUser: User | null): Promise<boolean> => {
    if (!currentUser) {
      setIsAdmin(false);
      setAdminProfile(null);
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', currentUser.id)
        .maybeSingle();

      if (error || !data) {
        setIsAdmin(false);
        setAdminProfile(null);
        return false;
      }

      if (data.is_active) {
        setIsAdmin(true);
        setAdminProfile(data as AdminProfile);
        return true;
      } else {
        setIsAdmin(false);
        setAdminProfile(data as AdminProfile);
        return false;
      }
    } catch {
      setIsAdmin(false);
      setAdminProfile(null);
      return false;
    }
  };

  useEffect(() => {
    // Initial Session Check
    const initAuth = async () => {
      setLoading(true);
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          await verifyAdminStatus(currentSession.user);
        }
      } catch (err) {
        console.error('Error checking initial auth session:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for Auth State Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        await verifyAdminStatus(newSession.user);
      } else {
        setIsAdmin(false);
        setAdminProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async (): Promise<void> => {
    setLoading(true);
    try {
      localStorage.removeItem(LAST_ACTIVITY_KEY);
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error signing out:', err);
    } finally {
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      setAdminProfile(null);
      setAuthError(null);
      setLoading(false);
    }
  };

  // Inactivity Timeout Manager
  useEffect(() => {
    if (!user || !isAdmin || loading) {
      return;
    }

    const now = Date.now();
    let initialActivity = now;
    try {
      const stored = localStorage.getItem(LAST_ACTIVITY_KEY);
      if (stored) {
        const parsed = Number(stored);
        if (!isNaN(parsed) && parsed > 0) {
          initialActivity = parsed;
        }
      } else {
        localStorage.setItem(LAST_ACTIVITY_KEY, String(now));
      }
    } catch {}

    // Check if session has already expired before setting up listeners
    if (now - initialActivity >= ADMIN_INACTIVITY_TIMEOUT_MS) {
      try {
        localStorage.setItem(LOGOUT_REASON_KEY, 'inactivity');
        localStorage.removeItem(LAST_ACTIVITY_KEY);
      } catch {}
      signOut().then(() => {
        if (window.location.pathname.startsWith('/admin-panel5463') && !window.location.pathname.endsWith('/login')) {
          window.location.href = '/admin-panel5463/login?reason=inactivity';
        }
      });
      return;
    }

    lastActivityRef.current = initialActivity;

    // Reset timer on meaningful user activity (throttled at 2 seconds)
    const updateActivity = () => {
      const currentTime = Date.now();
      if (currentTime - lastActivityRef.current >= 2000) {
        lastActivityRef.current = currentTime;
        try {
          localStorage.setItem(LAST_ACTIVITY_KEY, String(currentTime));
        } catch {}
      }
    };

    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    activityEvents.forEach((event) => {
      window.addEventListener(event, updateActivity, { passive: true });
    });

    const checkInactivity = async () => {
      const currentTime = Date.now();
      let lastAct = lastActivityRef.current;
      try {
        const stored = localStorage.getItem(LAST_ACTIVITY_KEY);
        if (stored) {
          const parsed = Number(stored);
          if (!isNaN(parsed) && parsed > 0) {
            lastAct = Math.max(lastAct, parsed);
          }
        }
      } catch {}

      if (currentTime - lastAct >= ADMIN_INACTIVITY_TIMEOUT_MS) {
        try {
          localStorage.setItem(LOGOUT_REASON_KEY, 'inactivity');
          localStorage.removeItem(LAST_ACTIVITY_KEY);
        } catch {}
        await signOut();
        if (window.location.pathname.startsWith('/admin-panel5463') && !window.location.pathname.endsWith('/login')) {
          window.location.href = '/admin-panel5463/login?reason=inactivity';
        }
      }
    };

    const intervalId = setInterval(checkInactivity, 2500);

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        checkInactivity();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('focus', handleVisibilityOrFocus);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === LAST_ACTIVITY_KEY && e.newValue) {
        const ts = Number(e.newValue);
        if (!isNaN(ts) && ts > 0) {
          lastActivityRef.current = Math.max(lastActivityRef.current, ts);
        }
      } else if (e.key === LOGOUT_REASON_KEY && e.newValue === 'inactivity') {
        signOut().then(() => {
          if (window.location.pathname.startsWith('/admin-panel5463') && !window.location.pathname.endsWith('/login')) {
            window.location.href = '/admin-panel5463/login?reason=inactivity';
          }
        });
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, updateActivity);
      });
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('focus', handleVisibilityOrFocus);
      window.removeEventListener('storage', handleStorage);
    };
  }, [user, isAdmin, loading]);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const errMsg = error.message.includes('Invalid login credentials')
          ? 'Invalid email address or password.'
          : 'Authentication failed. Please check your credentials.';
        setAuthError(errMsg);
        setLoading(false);
        return { success: false, error: errMsg };
      }

      if (data.user) {
        const validAdmin = await verifyAdminStatus(data.user);
        if (!validAdmin) {
          const unauthMsg = 'You do not have administrator access.';
          setAuthError(unauthMsg);
          setLoading(false);
          return { success: false, error: unauthMsg };
        }
      }

      setLoading(false);
      return { success: true };
    } catch {
      const genericMsg = 'An unexpected error occurred during sign in.';
      setAuthError(genericMsg);
      setLoading(false);
      return { success: false, error: genericMsg };
    }
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAdmin,
        adminProfile,
        authError,
        signIn,
        signOut,
        clearAuthError,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

