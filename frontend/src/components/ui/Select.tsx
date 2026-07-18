"use client";

import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = "", id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={id}
            className="font-label-caps text-label-caps text-on-surface-variant"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={id}
            className={`appearance-none w-full min-h-[44px] bg-field border border-hairline/10 rounded-xl px-4 py-3 font-body-base text-body-base text-on-surface focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all inner-glow cursor-pointer ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-on-surface-variant">
            <span className="material-symbols-outlined text-sm">
              unfold_more
            </span>
          </div>
        </div>
        {error && (
          <span className="font-code-sm text-[10px] text-error">{error}</span>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
