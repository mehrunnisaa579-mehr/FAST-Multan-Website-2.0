import React, { ReactNode } from 'react';

interface AdminCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export default function AdminCard({
  children,
  className = '',
  onClick,
  hoverable = false,
}: AdminCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-[#E5E7EB] rounded-lg p-6 shadow-xs text-left ${
        hoverable ? 'hover:border-[#0093DD] transition-all hover:shadow-sm cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
