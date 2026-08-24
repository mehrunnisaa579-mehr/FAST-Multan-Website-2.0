import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Monitor, Briefcase, Building2, ArrowRight, Plus, Trash2, GraduationCap } from 'lucide-react';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminButton from '../components/ui/AdminButton';
import AdminModal, { DeleteConfirmModal } from '../components/ui/AdminModal';
import AdminFormGroup from '../components/ui/AdminFormGroup';
import AdminInput from '../components/ui/AdminInput';
import AdminTextarea from '../components/ui/AdminTextarea';
import { cmsService } from '../../services/cmsService';

interface DeptCard {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  path: string;
  color: string;
  isCustom?: boolean;
  slug?: string;
}

const fixedCards: DeptCard[] = [
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
  const navigate = useNavigate();
  const [customDepts, setCustomDepts] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [newShortName, setNewShortName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  const fetchCustomDepts = async () => {
    const list = await cmsService.getCustomDepartments();
    setCustomDepts(list || []);
  };

  useEffect(() => {
    fetchCustomDepts();
  }, []);

  const handleCreateDepartment = async () => {
    if (!newDeptName.trim()) return;
    setIsSubmitting(true);

    const slug = (newShortName || newDeptName)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const formattedDeptName = newDeptName.trim().replace(/^(department\s+of\s+)+/i, 'Department of ');
    const fullDeptTitle = /^department\s+of/i.test(formattedDeptName) ? formattedDeptName : `Department of ${formattedDeptName}`;

    const newDept = {
      id: `dept-${Date.now()}`,
      name: fullDeptTitle,
      short_name: newShortName.trim() || formattedDeptName,
      slug: slug || `dept-${Date.now()}`,
      description: newDescription.trim() || fullDeptTitle,
      created_at: new Date().toISOString(),
    };

    const currentList = await cmsService.getCustomDepartments();
    const updatedList = [...currentList, newDept];
    await cmsService.saveCustomDepartments(updatedList);

    // Initialize default content
    await cmsService.saveCustomDepartmentContent(newDept.slug, {
      deptName: newDept.name,
      shortName: newDept.short_name,
      description: newDept.description,
      heroTitle: newDept.name,
      hodName: 'Dr. Head of Department',
      hodDesignation: `Head, ${newDept.name}`,
      hodMessage: `Welcome to the ${newDept.name} at FAST-NUCES Multan Campus.`,
      programsList: [],
      facultyList: [],
      alliedFacultyList: [],
    });

    setIsSubmitting(false);
    setIsAddModalOpen(false);
    setNewDeptName('');
    setNewShortName('');
    setNewDescription('');

    // Redirect to newly created department's generic editor
    navigate(`/admin-panel5463/departments/custom/${newDept.slug}`);
  };

  const handleDeleteDepartment = async () => {
    if (!deleteTarget) return;
    await cmsService.deleteCustomDepartment(deleteTarget.id, deleteTarget.slug);
    setDeleteTarget(null);
    fetchCustomDepts();
  };

  const customCards: DeptCard[] = customDepts.map((d) => ({
    id: d.id,
    icon: GraduationCap,
    title: d.name,
    description: d.description || `Manage ${d.name} page, HOD message, programs, and faculty.`,
    path: `/admin-panel5463/departments/custom/${d.slug}`,
    color: '#0093DD',
    isCustom: true,
    slug: d.slug,
  }));

  const allCards = [...fixedCards, ...customCards];

  return (
    <div className="space-y-8 text-left max-w-[1250px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <AdminPageHeader
          title="Manage Departments"
          subtitle="Manage department pages, academic content, faculty and administration staff."
        />

        <AdminButton
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#0093DD] hover:bg-[#007BB8] text-white flex items-center gap-2 px-5 py-2.5 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Department
        </AdminButton>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="bg-white border border-[#E5E7EB] rounded-lg p-6 shadow-xs hover:border-[#0093DD] hover:shadow-md transition-all flex flex-col justify-between group min-h-[220px] relative"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors"
                    style={{ backgroundColor: `${card.color}15`, color: card.color }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  {card.isCustom && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(card);
                      }}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                      title="Delete Department"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <h3 className="text-lg font-bold text-[#1F2937] mb-1.5 group-hover:text-[#0093DD] transition-colors leading-snug">
                  {card.title}
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed mb-6">
                  {card.description}
                </p>
              </div>

              <RouterLink
                to={card.path}
                className="pt-3 border-t border-[#F3F4F6] flex items-center justify-between text-sm font-bold text-[#0093DD] no-underline"
              >
                <span>Open Editor</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </RouterLink>
            </div>
          );
        })}
      </div>

      {/* Add Department Modal */}
      <AdminModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Department"
      >
        <div className="space-y-4 text-left">
          <AdminFormGroup label="Department Full Name">
            <AdminInput
              value={newDeptName}
              onChange={(e) => setNewDeptName(e.target.value)}
              placeholder="e.g. Department of Electrical Engineering"
            />
          </AdminFormGroup>

          <AdminFormGroup label="Short Name / Code">
            <AdminInput
              value={newShortName}
              onChange={(e) => setNewShortName(e.target.value)}
              placeholder="e.g. EE"
            />
          </AdminFormGroup>

          <AdminFormGroup label="Description">
            <AdminTextarea
              rows={3}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Brief description of the new department..."
            />
          </AdminFormGroup>

          <div className="flex justify-end gap-2 pt-4">
            <AdminButton variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton
              onClick={handleCreateDepartment}
              disabled={isSubmitting || !newDeptName.trim()}
              className="bg-[#0093DD] text-white"
            >
              {isSubmitting ? 'Creating...' : 'Create & Open Editor'}
            </AdminButton>
          </div>
        </div>
      </AdminModal>

      {/* Delete Department Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteDepartment}
        title="Delete Department"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? All its content schema will be removed.`}
      />
    </div>
  );
}
