"use client";

export function SocialIcon({ icon, name, className = "text-[20px]" }: { icon?: string; name?: string; className?: string }) {
  if (!icon) {
    return (
      <span className={`material-symbols-outlined ${className}`}>
        link
      </span>
    );
  }

  if (icon.startsWith("http://") || icon.startsWith("https://")) {
    return (
      <img
        src={icon}
        alt={name || "icon"}
        className={`w-5 h-5 object-contain ${className}`}
      />
    );
  }

  return (
    <span className={`material-symbols-outlined ${className}`}>
      {icon}
    </span>
  );
}
