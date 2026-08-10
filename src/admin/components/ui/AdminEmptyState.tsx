import React from 'react';
import { Info } from 'lucide-react';

interface AdminEmptyStateProps {
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export default function AdminEmptyState({
  title,
  description = 'Website editing tools for this section will be available in the next setup step.',
  actionText,
  onAction,
}: AdminEmptyStateProps) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg p-8 sm:p-12 text-center flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-full bg-[#F0F9FF] text-[#0093DD] flex items-center justify-center mb-4">
        <Info className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-[#1F2937] mb-1.5">{title}</h3>
      <p className="text-sm text-[#6B7280] max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-4 py-2 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-sm font-semibold rounded-md transition-colors cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
