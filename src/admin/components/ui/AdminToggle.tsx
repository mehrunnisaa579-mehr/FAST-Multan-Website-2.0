import React from 'react';

interface AdminToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

export default function AdminToggle({ label, checked, onChange, description }: AdminToggleProps) {
  return (
    <div className="flex items-center justify-between py-2 text-left">
      <div>
        <span className="text-sm font-semibold text-[#1F2937] block">{label}</span>
        {description && <span className="text-xs text-[#6B7280] block mt-0.5">{description}</span>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          checked ? 'bg-[#0093DD]' : 'bg-[#E5E7EB]'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
