"use client";

import { useEffect, useState } from "react";
import { settingsApi, Settings } from "@/lib/api/settings";

export function Footer() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    settingsApi.getPublic()
      .then((res) => setSettings(res.data || null))
      .catch(() => {});
  }, []);

  const links = settings?.socialLinks?.length
    ? settings.socialLinks
    : [
        { name: "Github", icon: "code", url: "#" },
        { name: "LinkedIn", icon: "work", url: "#" },
        { name: "Twitter", icon: "alternate_email", url: "#" },
      ];

  return (
    <footer className="bg-surface-container-lowest font-code-sm text-code-sm py-12 border-t border-white/5">
      <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop max-w-content mx-auto gap-4">
        <span className="font-label-caps text-label-caps text-on-surface">
          &copy; 2024 {settings?.displayName || "FlutterDev Portfolio"}. Built with Precision.
        </span>
        <div className="flex gap-6">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-on-surface-variant hover:text-primary underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">{link.icon || "link"}</span>
              {link.name || link.url}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
