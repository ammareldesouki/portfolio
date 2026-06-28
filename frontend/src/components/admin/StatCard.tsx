"use client";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: string;
  trendUp?: boolean;
  color?: "primary" | "tertiary" | "error";
}

const colorMap = {
  primary: { bg: "bg-primary/10", hover: "group-hover:bg-primary/20" },
  tertiary: { bg: "bg-tertiary/10", hover: "group-hover:bg-tertiary/20" },
  error: { bg: "bg-error/10", hover: "group-hover:bg-error/20" },
};

const iconColorMap = {
  primary: "text-primary",
  tertiary: "text-tertiary",
  error: "text-error",
};

export function StatCard({ title, value, icon, trend, trendUp = true, color = "primary" }: StatCardProps) {
  return (
    <div className="bg-[#0A0C10] border border-white/10 rounded-xl p-6 flex flex-col justify-between h-40 relative overflow-hidden group hover:border-primary/50 transition-all duration-300">
      <div
        className={`absolute -right-4 -top-4 w-24 h-24 ${colorMap[color].bg} rounded-full blur-2xl ${colorMap[color].hover} transition-all`}
      />
      <div className="flex justify-between items-start z-10">
        <p className="font-code-sm text-code-sm text-on-surface-variant uppercase tracking-widest">
          {title}
        </p>
        <span className={`material-symbols-outlined ${iconColorMap[color]}`}>{icon}</span>
      </div>
      <div className="z-10">
        <h3 className="font-display-lg-mobile text-display-lg-mobile text-on-surface">
          {value}
        </h3>
        {trend && (
          <p className="text-tertiary font-code-sm text-xs mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">
              {trendUp ? "trending_up" : "trending_down"}
            </span>
            {trend}
          </p>
        )}
      </div>
    </div>
  );
}
