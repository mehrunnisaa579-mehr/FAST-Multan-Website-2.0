import React, { TextareaHTMLAttributes } from 'react';

interface AdminTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export default function AdminTextarea({ error = false, className = '', rows = 4, ...props }: AdminTextareaProps) {
  return (
    <textarea
      rows={rows}
      className={`w-full px-3.5 py-2.5 bg-white border ${
        error ? 'border-[#DC2626]' : 'border-[#E5E7EB]'
      } rounded-md text-sm text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:border-[#0093DD] focus:ring-1 focus:ring-[#0093DD] transition-all resize-y ${className}`}
      {...props}
    />
  );
}
