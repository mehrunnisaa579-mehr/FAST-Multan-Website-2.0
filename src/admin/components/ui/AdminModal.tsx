import React, { ReactNode } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import AdminButton from './AdminButton';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function AdminModal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = 'md',
}: AdminModalProps) {
  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 flex items-center justify-center p-4 sm:p-6">
      <div className={`bg-white rounded-lg border border-[#E5E7EB] shadow-lg w-full ${maxWidthClasses} text-left overflow-hidden transform transition-all`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] bg-[#F9FAFB]">
          <h3 className="text-base font-bold text-[#1F2937]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-[#6B7280] hover:text-[#1F2937] hover:bg-[#E5E7EB] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-3.5 border-t border-[#E5E7EB] bg-[#F9FAFB]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  itemTitle?: string;
  loading?: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Item?',
  itemTitle,
  loading = false,
}: DeleteConfirmModalProps) {
  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="sm"
      footer={
        <>
          <AdminButton variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </AdminButton>
          <AdminButton variant="danger" onClick={onConfirm} loading={loading}>
            Delete
          </AdminButton>
        </>
      }
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center flex-shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-[#1F2937] mb-1">Are you sure?</h4>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            {itemTitle ? (
              <>
                You are about to delete <strong className="text-[#1F2937]">"{itemTitle}"</strong>. This action cannot be undone.
              </>
            ) : (
              'This action cannot be undone.'
            )}
          </p>
        </div>
      </div>
    </AdminModal>
  );
}
