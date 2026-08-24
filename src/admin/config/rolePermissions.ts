export type AdminRole = 'admin' | 'super_admin' | 'hr' | 'director_secretary' | 'student_affairs';

export const ROLE_PERMISSIONS = {
  admin: {
    modules: ['*'], // Has access to everything
  },
  super_admin: {
    modules: ['*'],
  },
  hr: {
    modules: ['news_manager', 'admin_staff_manager', 'manage_departments', 'department_editor'],
  },
  director_secretary: {
    modules: ['news_manager', 'admin_staff_manager', 'manage_departments', 'department_editor'],
  },
  student_affairs: {
    modules: ['events_manager', 'societies_manager'],
  }
};

export function canAccessModule(role: AdminRole | undefined | null, moduleName: string): boolean {
  if (!role) return false;
  if (role === 'admin' || role === 'super_admin') return true;
  
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  
  return permissions.modules.includes(moduleName);
}

export function canAccessDepartmentSection(role: AdminRole | undefined | null, section: string): boolean {
  if (!role) return false;
  
  // Admin/Super Admin can access everything
  if (role === 'admin' || role === 'super_admin') return true;
  
  // HR & Director Secretary can ONLY access 'faculty' (and allied faculty if grouped)
  if (role === 'hr' || role === 'director_secretary') {
    return section === 'faculty' || section === 'alliedFaculty' || section === 'basic'; // basic needed for save? no, save saves everything. But let's only render faculty.
  }
  
  return false;
}

export function getModuleForPath(pathname: string): string {
  if (pathname.includes('/news') || pathname.includes('/campus-news')) return 'news_manager';
  if (pathname.includes('/events')) return 'events_manager';
  if (pathname.includes('/societies')) return 'societies_manager';
  if (pathname.includes('/administration-staff') || pathname.includes('/web-team')) return 'admin_staff_manager';
  if (pathname.includes('/manage-departments')) return 'manage_departments';
  
  // Department Editors
  if (pathname.includes('/departments/') || pathname.includes('/school-of-management') || pathname.includes('/school-of-computing')) {
    return 'department_editor';
  }
  
  // Base dashboard for admin
  if (pathname === '/admin-panel5463' || pathname === '/admin-panel5463/') return 'dashboard';
  
  // Default to requiring full admin for anything else
  return 'admin_only';
}

export function getLandingPageForRole(role: AdminRole | undefined | null): string {
  if (role === 'hr' || role === 'director_secretary') {
    return '/admin-panel5463/news';
  }
  if (role === 'student_affairs') {
    return '/admin-panel5463/events';
  }
  return '/admin-panel5463';
}
