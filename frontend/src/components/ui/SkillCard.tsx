"use client";

interface SkillCardProps {
  name: string;
  icon?: string;
}

export function SkillCard({ name, icon }: SkillCardProps) {
  const letter = name.charAt(0).toUpperCase();
  const isUrl = icon?.startsWith("http://") || icon?.startsWith("https://");

  return (
    <div className="group flex flex-col items-center gap-4 bg-surface-container border border-white/5 p-6 md:p-8 rounded-xl hover:border-primary/50 transition-all duration-300 cursor-default">
      {icon ? (
        isUrl ? (
          <span className="w-12 h-12 flex items-center justify-center">
            <img
              src={icon}
              alt={name}
              className="w-10 h-10 object-contain group-hover:scale-110 transition-transform"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `<span class="material-symbols-outlined text-primary text-5xl">code</span>`;
                }
              }}
            />
          </span>
        ) : (
          <span className="material-symbols-outlined text-primary text-5xl md:text-6xl group-hover:scale-110 transition-transform">
            {icon}
          </span>
        )
      ) : (
        <span className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-bold group-hover:scale-110 transition-transform">
          {letter}
        </span>
      )}
      <span className="font-code-sm text-code-sm text-on-surface-variant text-center group-hover:text-on-surface transition-colors">
        {name}
      </span>
    </div>
  );
}
