import React, { InputHTMLAttributes } from 'react';

interface AdminInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export default function AdminInput({ error = false, className = '', ...props }: AdminInputProps) {
  return (
    <input
      className={`w-full px-3.5 py-2.5 bg-white border ${
        error ? 'border-[#DC2626]' : 'border-[#E5E7EB]'
      } rounded-md text-sm text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:border-[#0093DD] focus:ring-1 focus:ring-[#0093DD] transition-all ${className}`}
      {...props}
    />
  );
}
