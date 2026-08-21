import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Monitor, Briefcase, Building2, ArrowRight } from 'lucide-react';
import AdminPageHeader from '../components/ui/AdminPageHeader';

interface DeptCard {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  path: string;
  color: string;
}

const deptCards: DeptCard[] = [
  {
    id: 'cs',
    icon: Monitor,
    title: 'Department of Computer Science',
    description: 'Manage CS page, HOD message, programs, department faculty and allied faculty.',
    path: '/admin-panel5463/departments/cs',
    color: '#0093DD',
  },
  {
    id: 'management',
    icon: Briefcase,
    title: 'Department of Management Sciences',
    description: 'Manage Management Sciences page, programs, faculty and media.',
    path: '/admin-panel5463/school-of-management',
    color: '#7C3AED',
  },
  {
    id: 'admin-staff',
    icon: Building2,
    title: 'Administration Staff',
    description: 'Manage administration offices, staff members, profiles and page media.',
    path: '/admin-panel5463/administration-staff',
    color: '#059669',
  },
];

export default function AdminManageDepartmentsHub() {
  return (
    <div className="space-y-8 text-left max-w-[1250px]">
      <AdminPageHeader
        title="Manage Departments"
        subtitle="Manage department pages, academic content, faculty and administration staff."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {deptCards.map((card) => {
          const Icon = card.icon;
          return (
            <RouterLink
              key={card.id}
              to={card.path}
              className="bg-white border border-[#E5E7EB] rounded-lg p-6 shadow-xs hover:border-[#0093DD] hover:shadow-md transition-all flex flex-col justify-between group min-h-[200px] no-underline block"
            >
              <div>
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors"
                  style={{ backgroundColor: `${card.color}15`, color: card.color }}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-bold text-[#1F2937] mb-1.5 group-hover:text-[#0093DD] transition-colors leading-snug">
                  {card.title}
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed mb-6">
                  {card.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#F3F4F6] flex items-center justify-between text-sm font-bold text-[#0093DD]">
                <span>Open Editor</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </RouterLink>
          );
        })}
      </div>
    </div>
  );
}
