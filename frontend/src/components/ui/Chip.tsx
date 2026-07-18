interface ChipProps {
  label: string;
  variant?: "default" | "primary" | "success";
  className?: string;
}

const variantClasses: Record<string, string> = {
  default: "chip",
  primary: "bg-primary/10 text-primary border border-primary/30",
  success: "bg-tertiary/10 text-tertiary border border-tertiary/30",
};

export function Chip({ label, variant = "default", className = "" }: ChipProps) {
  return (
    <span
      className={`chip px-2 py-1 rounded font-code-sm text-[10px] tracking-wider uppercase ${variantClasses[variant]} ${className}`}
    >
      {label}
    </span>
  );
}
