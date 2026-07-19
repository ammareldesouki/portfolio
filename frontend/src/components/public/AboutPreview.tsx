"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { settingsApi, Settings } from "@/lib/api/settings";
import { Reveal } from "@/components/ui/Reveal";

export function AboutPreview() {
  const [s, setS] = useState<Settings | null>(null);

  useEffect(() => {
    settingsApi
      .getPublic()
      .then((res) => setS(res.data || null))
      .catch(() => {});
  }, []);

  const bio = s?.bio || s?.aboutContent;

  // Hide until there's real content — no placeholders ship.
  if (!bio) return null;

  const facts = [
    s?.location && { icon: "location_on", label: s.location },
    s?.email && { icon: "mail", label: s.email },
  ].filter(Boolean) as { icon: string; label: string }[];

  return (
    <Reveal
      as="section"
      id="about"
      className="py-16 md:py-24 px-margin-mobile md:px-margin-desktop relative z-10"
    >
      <div className="max-w-content mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-gutter items-center">
        {s?.avatar && (
          <div className="md:col-span-5 order-1">
            <div className="relative aspect-[4/5] w-full max-w-sm mx-auto md:mx-0 rounded-2xl overflow-hidden border border-hairline/10 inner-glow bg-surface-container-low">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.avatar}
                alt={s.displayName || "Profile"}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        <div className={`${s?.avatar ? "md:col-span-7" : "md:col-span-12"} order-2 space-y-6`}>
          <div className="flex items-center gap-4">
            <h2 className="font-headline-md text-headline-md text-on-surface">
              About Me
            </h2>
            <div className="h-px flex-grow bg-hairline/10" />
          </div>

          <p className="font-body-base text-body-base text-on-surface-variant leading-relaxed whitespace-pre-line max-w-2xl">
            {bio}
          </p>

          {facts.length > 0 && (
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {facts.map((f) => (
                <span
                  key={f.label}
                  className="inline-flex items-center gap-2 font-code-sm text-code-sm text-on-surface-variant"
                >
                  <span className="material-symbols-outlined text-primary text-base">
                    {f.icon}
                  </span>
                  {f.label}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/about"
              className="btn-primary px-6 py-3 rounded-xl font-code-sm text-code-sm font-bold inline-flex items-center gap-2 min-h-[44px]"
            >
              More about me
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                arrow_forward
              </span>
            </Link>
            {s?.resumeUrl && (
              <a
                href={s.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost px-6 py-3 rounded-xl font-code-sm text-code-sm font-bold inline-flex items-center gap-2 min-h-[44px]"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                Resume
              </a>
            )}
          </div>
        </div>
      </div>
    </Reveal>
  );
}
