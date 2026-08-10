import { useContext } from 'react';
import { AdminAuthContext } from './AdminAuthProvider';
import type { AdminAuthContextType } from './AdminAuthProvider';

export function useAdminAuth(): AdminAuthContextType {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
