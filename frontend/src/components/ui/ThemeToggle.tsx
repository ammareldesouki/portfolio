"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch: theme is only known on the client.
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-lg border border-hairline/10 text-on-surface-variant hover:text-primary hover:border-primary/50 transition-colors ${className}`}
    >
      {/* Render a stable icon until mounted to keep SSR/CSR markup consistent */}
      {mounted && !isDark ? (
        <Moon size={18} strokeWidth={2} />
      ) : (
        <Sun size={18} strokeWidth={2} />
      )}
    </button>
  );
}
