import React, { ReactNode } from 'react';

interface AdminFormGroupProps {
  label: string;
  htmlFor?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

export default function AdminFormGroup({
  label,
  htmlFor,
  helperText,
  error,
  required = false,
  children,
}: AdminFormGroupProps) {
  return (
    <div className="flex flex-col gap-1.5 text-left mb-4">
      <label htmlFor={htmlFor} className="text-xs font-bold text-[#1F2937] uppercase tracking-wider">
        {label} {required && <span className="text-[#DC2626]">*</span>}
      </label>
      {children}
      {helperText && !error && <span className="text-xs text-[#6B7280]">{helperText}</span>}
      {error && <span className="text-xs font-medium text-[#DC2626]">{error}</span>}
    </div>
  );
}
