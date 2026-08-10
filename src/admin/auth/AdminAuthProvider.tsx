import React, { createContext, useState, useEffect, ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';

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

  const signOut = async (): Promise<void> => {
    setLoading(true);
    try {
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
