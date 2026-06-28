interface ChipProps {
  label: string;
  variant?: "default" | "primary" | "success";
  className?: string;
}

const variantClasses: Record<string, string> = {
  default: "chip text-[#666666]",
  primary: "bg-[#16181D] text-primary border border-primary/30",
  success: "bg-[#00382d] text-tertiary border border-tertiary/30",
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
