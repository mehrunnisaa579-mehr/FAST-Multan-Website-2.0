import React, { ReactNode } from 'react';

interface AdminSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

export default function AdminSection({
  title,
  description,
  children,
  action,
  className = '',
}: AdminSectionProps) {
  return (
    <section className={`mb-8 text-left ${className}`}>
      {(title || description || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            {title && <h2 className="text-lg font-bold text-[#1F2937]">{title}</h2>}
            {description && (
              <p className="text-xs text-[#6B7280] mt-0.5">{description}</p>
            )}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
