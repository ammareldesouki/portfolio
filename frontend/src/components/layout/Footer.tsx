"use client";

import { useEffect, useState } from "react";
import { settingsApi, Settings } from "@/lib/api/settings";
import { SocialIcon } from "@/components/ui/SocialIcon";

export function Footer() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    settingsApi.getPublic()
      .then((res) => setSettings(res.data || null))
      .catch(() => {});
  }, []);

  const links = settings?.socialLinks?.length
    ? settings.socialLinks.filter((l) => l.show !== false)
    : [];

  return (
    <footer className="bg-surface-container-lowest font-code-sm text-code-sm py-12 border-t border-hairline/5">
      <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop max-w-content mx-auto gap-4">
        <span className="font-label-caps text-label-caps text-on-surface">
          &copy; {new Date().getFullYear()} {settings?.displayName || "Portfolio"}. Built with Precision.
        </span>
        {links.length > 0 && (
          <div className="flex gap-6">
            {links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-on-surface-variant hover:text-primary underline flex items-center gap-1"
              >
                <SocialIcon icon={link.icon} name={link.name} className="text-sm" />
                {link.name || link.url}
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}
