"use client";

import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
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
        <textarea
          ref={ref}
          id={id}
          className={`w-full bg-field border border-hairline/10 rounded-xl px-4 py-3 font-body-base text-body-base text-on-surface focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:text-on-surface-variant/50 inner-glow resize-none ${className}`}
          {...props}
        />
        {error && (
          <span className="font-code-sm text-[10px] text-error">{error}</span>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
