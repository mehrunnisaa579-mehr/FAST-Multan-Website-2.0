import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface AdminButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: ReactNode;
  icon?: ReactNode;
  loading?: boolean;
}

export default function AdminButton({
  variant = 'primary',
  children,
  icon,
  loading = false,
  className = '',
  disabled,
  ...props
}: AdminButtonProps) {
  let baseStyles = 'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors cursor-pointer outline-none border text-center';

  if (variant === 'primary') {
    baseStyles += ' bg-[#0093DD] hover:bg-[#0C71C3] text-white border-transparent shadow-xs';
  } else if (variant === 'secondary') {
    baseStyles += ' bg-white hover:bg-[#F9FAFB] text-[#1F2937] border-[#E5E7EB] shadow-xs';
  } else if (variant === 'danger') {
    baseStyles += ' bg-[#DC2626] hover:bg-[#B91C1C] text-white border-transparent shadow-xs';
  }

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyles} ${disabled || loading ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon
      )}
      <span>{children}</span>
    </button>
  );
}
