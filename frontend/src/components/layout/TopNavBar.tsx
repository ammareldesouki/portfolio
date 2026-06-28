"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/about#resume", label: "Resume" },
  { href: "/about#contact", label: "Contact" },
];

export function TopNavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/70 backdrop-blur-xl border-b border-white/10 shadow-2xl">
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-20 w-full max-w-content mx-auto">
        <Link
          href="/"
          className="font-display-lg text-headline-md font-bold text-on-surface tracking-tighter"
        >
          FLUTTER.DEV
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium transition-colors duration-300 scale-95 active:scale-90 transition-transform ${
                  isActive
                    ? "text-primary font-bold border-b-2 border-primary pb-1"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <button className="btn-primary px-6 py-2 rounded-lg font-code-sm text-code-sm font-semibold transition-all scale-95 active:scale-90 hidden md:block">
          Hire Me
        </button>

        <button className="md:hidden text-on-surface">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
    </nav>
  );
}
