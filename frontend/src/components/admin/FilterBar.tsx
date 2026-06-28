"use client";

interface FilterBarProps {
  options: { value: string; label: string }[];
  active: string;
  onChange: (value: string) => void;
}

export function FilterBar({ options, active, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 rounded-full font-code-sm text-xs whitespace-nowrap transition-all ${
            active === opt.value
              ? "bg-white/10 border border-white/20 text-on-surface"
              : "bg-transparent border border-white/10 text-on-surface-variant hover:bg-white/5"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
