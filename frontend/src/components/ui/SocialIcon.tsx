"use client";

export function SocialIcon({ icon, name, className = "text-[20px]" }: { icon?: string; name?: string; className?: string }) {
  const letter = (name || "?").charAt(0).toUpperCase();

  if (!icon) {
    return (
      <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] font-bold ${className}`}>
        {letter}
      </span>
    );
  }

  if (icon.startsWith("http://") || icon.startsWith("https://")) {
    return (
      <span className={`inline-flex items-center justify-center w-5 h-5 ${className}`}>
        <img
          src={icon}
          alt={name || "icon"}
          className="w-full h-full object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              const fallback = document.createElement('span');
              fallback.className = 'inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] font-bold';
              fallback.textContent = letter;
              parent.appendChild(fallback);
            }
          }}
        />
      </span>
    );
  }

  return (
    <span className={`relative inline-flex items-center justify-center w-5 h-5 ${className}`}>
      <span className="absolute inset-0 flex items-center justify-center rounded-full bg-primary/20 text-primary text-[10px] font-bold">
        {letter}
      </span>
      <span className="material-symbols-outlined relative z-10 text-[20px]">
        {icon}
      </span>
    </span>
  );
}
