import React from 'react';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminEmptyState from '../components/ui/AdminEmptyState';

interface AdminPlaceholderPageProps {
  title: string;
  subtitle?: string;
}

export default function AdminPlaceholderPage({ title, subtitle }: AdminPlaceholderPageProps) {
  return (
    <div className="space-y-6 text-left max-w-[1200px]">
      <AdminPageHeader
        title={title}
        subtitle={subtitle || `Manage ${title.toLowerCase()} content for FAST-NUCES Multan.`}
      />
      <AdminEmptyState
        title={`${title} Management`}
        description="This section is ready for the next content setup step."
      />
    </div>
  );
}
