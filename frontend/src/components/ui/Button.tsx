"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "secondary";
  children: ReactNode;
}

const variantClasses: Record<string, string> = {
  primary: "btn-primary font-code-sm text-code-sm font-bold tracking-wide transition-all",
  ghost: "btn-ghost font-code-sm text-code-sm font-bold tracking-wide transition-all flex items-center gap-2",
  secondary:
    "bg-transparent border border-white/10 text-on-surface-variant font-code-sm text-code-sm hover:bg-white/5 hover:border-primary transition-all",
};

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  return (
    <button
      className={`${variantClasses[variant]} ${className} scale-95 active:scale-90 transition-transform`}
      {...props}
    >
      {children}
    </button>
  );
}
