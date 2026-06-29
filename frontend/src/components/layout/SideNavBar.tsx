"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/projects", label: "Projects", icon: "inventory_2" },
  { href: "/admin/skills", label: "Skills", icon: "terminal" },
  { href: "/admin/experience", label: "Experience", icon: "work_history" },
  { href: "/admin/settings", label: "Media", icon: "perm_media" },
  { href: "/admin/settings", label: "Settings", icon: "settings" },
];

interface SideNavBarProps {
  open?: boolean;
  onClose?: () => void;
}

export function SideNavBar({ open, onClose }: SideNavBarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const sidebar = (
    <>
      <div className="mb-8 px-4">
        <h1 className="font-headline-md text-headline-md text-primary tracking-tight font-bold">
          Admin Console
        </h1>
        <p className="text-on-surface-variant font-code-sm text-code-sm mt-1">
          Management Suite
        </p>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href + link.label}
              href={link.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-code-sm text-code-sm duration-200 ease-in-out ${
                isActive
                  ? "bg-primary-container text-on-primary-container font-bold"
                  : "text-on-surface-variant hover:bg-surface-bright/10"
              }`}
            >
              <span className="material-symbols-outlined text-lg">
                {link.icon}
              </span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-white/5">
        <Link
          href="/admin/projects/new"
          onClick={onClose}
          className="w-full py-3 px-4 bg-primary-container text-on-primary-container rounded-lg font-code-sm text-code-sm font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 duration-200"
        >
          <span className="material-symbols-outlined">add</span>
          Add New Project
        </Link>

        {user && (
          <div className="flex items-center gap-3 mt-4 px-2">
            <div className="w-10 h-10 rounded-full bg-surface-bright border border-white/10 flex items-center justify-center text-on-surface font-bold text-sm">
              {user.displayName.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-on-surface text-sm">
                {user.displayName}
              </p>
              <p className="text-on-surface-variant text-xs">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex bg-surface-container-low border-r border-white/5 h-screen w-sidebar-width fixed left-0 top-0 flex flex-col p-4 gap-2 z-40">
        {sidebar}
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-surface-container-low border-r border-white/5 flex flex-col p-4 gap-2 z-50">
            {sidebar}
          </aside>
        </div>
      )}
    </>
  );
}
